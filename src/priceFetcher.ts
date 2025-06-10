import {ethers} from 'ethers'
import ccxt from 'ccxt'
import { TOKENS, CEX_API} from './config'

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)

const slot0Abi = ['function slot0() view returns (uint160 sqrtPriceX96, int24, uint16, uint16, uint16, uint8, bool)']

export async function getDexPrice(symbol: string): Promise<number> {
    
    const token = TOKENS.find(t => t.symbol === symbol)!;
    const pool = new ethers.Contract(token.dex.poolAddress, slot0Abi, provider);

    const { sqrtPriceX96 } = await pool.slot0() as any;
    const priceX96 = BigInt(sqrtPriceX96.toString()) ** 2n;
    const price = Number(priceX96) / 2 ** 192;
    return price * (10 ** (token.dex.token0Decimals - token.dex.token1Decimals));
  }

  export async function getCexPrice(symbol: string): Promise<{ binance?: number; okx?: number }> {
    const result: any = {};
    // // Binance
    // const binance = new ccxt.binance(CEX_API.binance);
    // const tickerB = await binance.fetchTicker(`${symbol}/USDT`);
    // result.binance = tickerB.last;
    // OKEx
    const okx = new ccxt.okx(CEX_API.okx);
    const tickerO = await okx.fetchTicker(`${symbol}/USDT`);
    result.okx = tickerO.last;
    return result;
  }