import {ethers} from 'ethers'
import ccxt from 'ccxt'
import { TOKENS, CEX_API, WETH_USDT_POOL} from './config'

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)

const slot0Abi = ['function slot0() view returns (uint160 sqrtPriceX96, int24, uint16, uint16, uint16, uint8, bool)']

// 缓存WETH/USDT价格，避免频繁查询
let cachedWethPrice: number | null = null;
let lastWethPriceUpdate = 0;
const WETH_PRICE_CACHE_TTL = 30000; // 30秒缓存

// 获取WETH/USDT价格
async function getWethUsdtPrice(): Promise<number> {
  const now = Date.now();
  
  // 如果缓存有效，直接返回缓存的价格
  if (cachedWethPrice && (now - lastWethPriceUpdate < WETH_PRICE_CACHE_TTL)) {
    return cachedWethPrice;
  }
  
  try {
    const wethUsdtPool = new ethers.Contract(WETH_USDT_POOL.address, slot0Abi, provider);
    const { sqrtPriceX96 } = await wethUsdtPool.slot0() as any;
    const priceX96 = BigInt(sqrtPriceX96.toString()) ** 2n;
    const price = Number(priceX96) / 2 ** 192;
    
    // 计算并缓存WETH/USDT价格
    cachedWethPrice = price * (10 ** (WETH_USDT_POOL.token0Decimals - WETH_USDT_POOL.token1Decimals));
    lastWethPriceUpdate = now;
    
    return cachedWethPrice;
  } catch (error) {
    console.error('获取WETH/USDT价格失败:', error);
    // 如果获取失败但有缓存，返回缓存
    if (cachedWethPrice) return cachedWethPrice;
    // 否则返回一个合理的默认值
    return 3000; // 假设WETH约为3000 USDT
  }
}

export async function getDexPrice(symbol: string): Promise<number> {
  const token = TOKENS.find(t => t.symbol === symbol)!;
  const pool = new ethers.Contract(token.dex.poolAddress, slot0Abi, provider);
  
  try {
    const { sqrtPriceX96 } = await pool.slot0() as any;
    const priceX96 = BigInt(sqrtPriceX96.toString()) ** 2n;
    let price = Number(priceX96) / 2 ** 192;
    
    // 应用小数位调整
    price = price * (10 ** (token.dex.token0Decimals - token.dex.token1Decimals));
    
    // 如果池子中的另一个代币是USDT，直接返回价格
    if (token.dex.token1 === 'USDT') {
      return token.dex.isToken0Base ? price : 1 / price;
    }
    // 如果池子中的另一个代币是WETH，需要转换为USDT价格
    else if (token.dex.token1 === 'WETH') {
      const wethPrice = await getWethUsdtPrice();
      return (token.dex.isToken0Base ? price : 1 / price) * wethPrice;
    }
    // 如果池子中的一个代币是WETH，但代币是token1
    else if (token.dex.token0 === 'WETH') {
      const wethPrice = await getWethUsdtPrice();
      return (token.dex.isToken0Base ? price * wethPrice : wethPrice / price);
    }
    
    // 默认情况，假设价格已经是USDT计价
    return price;
  } catch (error) {
    console.error(`获取${symbol} DEX价格失败:`, error);
    return 0;
  }
}

export async function getCexPrice(symbol: string): Promise<{ binance?: number; okx?: number }> {
  const result: { binance?: number; okx?: number } = {};
  
  try {
    // Binance
    const binance = new ccxt.binance(CEX_API.binance);
    const tickerB = await binance.fetchTicker(`${symbol}/USDT`);
    result.binance = tickerB.last;
  } catch (error) {
    console.error('获取Binance价格失败:', error);
  }
  
  try {
    // OKX
    const okx = new ccxt.okx(CEX_API.okx);
    const tickerO = await okx.fetchTicker(`${symbol}/USDT`);
    result.okx = tickerO.last;
  } catch (error) {
    console.error('获取OKX价格失败:', error);
  }
  
  return result;
}