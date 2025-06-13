# DEX-CEX 套利监控系统

这是一个实时监控DEX（去中心化交易所）和CEX（中心化交易所）之间价格差异的套利系统。

## 功能特点

- 实时监控DEX（Uniswap V3）和CEX（Binance和OKX）之间的价格差异
- 每秒检查套利机会
- 当发现符合阈值的套利机会时发送Telegram通知
- 支持多个交易所和多个代币的监控

## 安装

```bash
# 克隆仓库
git clone <repository-url>
cd DEX-CEX-Aribtrage

# 安装依赖
npm install
```

## 配置

1. 复制`.env.example`文件并重命名为`.env`
2. 填写必要的配置信息：
   - RPC节点URL
   - 交易所API密钥
   - Telegram Bot Token和Chat ID
   - 套利阈值和其他参数

```
# RPC节点
RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY

# 套利配置
THRESHOLD=0.002           # 套利阈值，如0.002表示0.2%
POLL_INTERVAL_MS=1000     # 轮询间隔，毫秒
SLIPPAGE=0.005            # 滑点容忍度
ORDER_SIZE_USDT=1000      # 每笔订单大小，USDT

# 钱包配置
PRIVATE_KEY=your_private_key_here

# CEX API配置
# Binance
BINANCE_API_KEY=your_binance_api_key
BINANCE_SECRET=your_binance_secret

# OKX
OKEX_API_KEY=your_okx_api_key
OKEX_SECRET=your_okx_secret
OKEX_PASSPHRASE=your_okx_passphrase

# Telegram通知
BOT_WEBHOOK_URL=https://api.telegram.org/botYOUR_BOT_TOKEN/sendMessage
TELEGRAM_CHAT_ID=your_chat_id
```

## 运行

```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start

# 构建项目
npm run build
```

## 添加新代币

在`src/config.ts`文件中的`TOKENS`数组中添加新的代币配置：

```typescript
{
  symbol: 'TOKEN_SYMBOL',
  dex: {
    protocol: 'UniswapV3',
    poolAddress: '0x...', // Uniswap V3池子地址
    token0Decimals: 18,   // 代币0的小数位数
    token1Decimals: 6     // 代币1的小数位数
  },
  cex: ['okx', 'binance'] // 要监控的中心化交易所
}
``` 