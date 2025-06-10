// src/config.ts
import dotenv from 'dotenv';
dotenv.config();

export interface TokenConfig {
  symbol: string;
  dex: {
    protocol: 'UniswapV3';
    poolAddress: string;
    token0Decimals: number;
    token1Decimals: number;
  };
  cex: Array< 'okx'>;
}

export const TOKENS: TokenConfig[] = [
  {
    symbol: 'CRV',
    dex: {
      protocol: 'UniswapV3',
      poolAddress: '0x224e94D1fa04195Df9Ad941c0d1529908401B23B',           // 填入 CRV/USDT 池子地址
      token0Decimals: 18,             // CRV 通常是 18
      token1Decimals: 6               // USDT 通常是 6
    },
    cex: ['okx']
  }
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
