// src/index.ts
import { getDexPrice, getCexPrice } from './priceFetcher';
import { shouldArbitrage } from './arbChecker';

async function main() {
  const dexPrice = await getDexPrice('CRV');
  const cexResult = await getCexPrice('CRV');
  const okxPrice = cexResult.okx || 0; // 提取okx价格，如果不存在则默认为0

  console.log('DEX 价格:', dexPrice);
  console.log('OKX 价格:', okxPrice);

  const result = shouldArbitrage(dexPrice, okxPrice);

  if (result.shouldTrade) {
    console.log(`✅ 满足套利条件，差价比例：${(result.diffRatio * 100).toFixed(2)}%`);
  } else {
    console.log(`❌ 未满足套利条件，差价比例：${(result.diffRatio * 100).toFixed(2)}%`);
  }
}

main().catch(console.error);
