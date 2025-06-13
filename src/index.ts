// src/index.ts
import { getDexPrice, getCexPrice } from './priceFetcher';
import { shouldArbitrage, ArbResult } from './arbChecker';
import { sendAlert } from './notifier';
import { POLL_INTERVAL, TOKENS } from './config';

// 记录上次发送的套利提醒时间，避免频繁发送
const lastAlertTime: Record<string, number> = {};

async function checkArbitrageOpportunity(symbol: string): Promise<void> {
  try {
    // 同时获取DEX和CEX价格，确保在同一时间
    const [dexPrice, cexPrices] = await Promise.all([
      getDexPrice(symbol),
      getCexPrice(symbol)
    ]);

    console.log(`${new Date().toLocaleTimeString()} - ${symbol} 价格:`);
    console.log(`DEX: ${dexPrice}`);
    console.log(`Binance: ${cexPrices.binance || 'N/A'}`);
    console.log(`OKX: ${cexPrices.okx || 'N/A'}`);

    const result = shouldArbitrage(dexPrice, cexPrices);

    if (result.shouldTrade) {
      console.log(`✅ 发现套利机会 (${result.exchange || 'Unknown'})，差价比例：${(result.diffRatio * 100).toFixed(2)}%`);
      
      // 避免频繁发送提醒，每分钟最多发送一次
      const now = Date.now();
      const key = `${symbol}-${result.exchange}`;
      if (!lastAlertTime[key] || now - lastAlertTime[key] > 60000) {
        await sendAlert(
          `🚨 套利机会 (${symbol})\n` +
          `交易所: ${result.exchange || 'Unknown'}\n` +
          `DEX价格: ${result.dexPrice}\n` +
          `CEX价格: ${result.cexPrice}\n` +
          `差价比例: ${(result.diffRatio * 100).toFixed(2)}%`
        );
        lastAlertTime[key] = now;
      }
    } else {
      console.log(`❌ 未满足套利条件，差价比例：${(result.diffRatio * 100).toFixed(2)}%`);
    }
  } catch (error) {
    console.error(`检查套利机会出错 (${symbol}):`, error);
  }
}

async function main() {
  console.log('🚀 套利监控程序已启动');
  console.log(`监控间隔: ${POLL_INTERVAL}ms`);
  
  // 初始运行一次
  for (const token of TOKENS) {
    await checkArbitrageOpportunity(token.symbol);
  }
  
  // 设置定时器，定期检查
  setInterval(async () => {
    for (const token of TOKENS) {
      await checkArbitrageOpportunity(token.symbol);
    }
  }, POLL_INTERVAL);
}

main().catch(error => {
  console.error('程序出错:', error);
  process.exit(1);
});
