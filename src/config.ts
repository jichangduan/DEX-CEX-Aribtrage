// src/config.ts
import dotenv from 'dotenv';
dotenv.config();

export interface TokenConfig {
  symbol: string;
  dex: {
    protocol: 'UniswapV3';
    poolAddress: string;
    token0: string;
    token1: string;
    token0Decimals: number;
    token1Decimals: number;
    isToken0Base: boolean; // 如果代币是token0，则为true；如果是token1，则为false
  };
  cex: Array<'okx' | 'binance'>;
}

// WETH/USDT价格获取配置（用于将WETH池价格转换为USDT价格）
export const WETH_USDT_POOL = {
  address: '0x11b815efB8f581194ae79006d24E0d814B7697F6', // WETH/USDT池地址
  token0Decimals: 18, // WETH decimals
  token1Decimals: 6   // USDT decimals
};

export const TOKENS: TokenConfig[] = [
  {
    symbol: 'CRV',
    dex: {
      protocol: 'UniswapV3',
      poolAddress: '0x224e94D1fa04195Df9Ad941c0d1529908401B23B', // CRV/USDT 池子地址
      token0: 'CRV',
      token1: 'USDT',
      token0Decimals: 18,  // CRV 通常是 18
      token1Decimals: 6,   // USDT 通常是 6
      isToken0Base: true   // CRV是token0
    },
    cex: ['okx', 'binance']
  }
  // 可以添加更多代币
  // {
  //   symbol: 'LINK',
  //   dex: {
  //     protocol: 'UniswapV3',
  //     poolAddress: '0xFD0A40Bc83C5faE4203DEc7e5929B446b07d1C76', // LINK/WETH 池子地址
  //     token0: 'LINK', 
  //     token1: 'WETH',
  //     token0Decimals: 18,
  //     token1Decimals: 18,
  //     isToken0Base: true  // LINK是token0
  //   },
  //   cex: ['okx', 'binance']
  // }
];

export const THRESHOLD = parseFloat(process.env.THRESHOLD || '0.002');
export const POLL_INTERVAL = parseInt(process.env.POLL_INTERVAL_MS || '1000');
export const SLIPPAGE_TOLERANCE = parseFloat(process.env.SLIPPAGE || '0.005');
export const ORDER_SIZE_USDT = parseFloat(process.env.ORDER_SIZE_USDT || '1000');

export const WALLET = {
  privateKey: process.env.PRIVATE_KEY!,
  rpcUrl: process.env.RPC_URL!
};

export const CEX_API = {
  binance: {
    apiKey: process.env.BINANCE_API_KEY!,
    secret: process.env.BINANCE_SECRET!
  },
  okx: {
    apiKey: process.env.OKEX_API_KEY!,
    secret: process.env.OKEX_SECRET!,
    passphrase: process.env.OKEX_PASSPHRASE!
  }
};
