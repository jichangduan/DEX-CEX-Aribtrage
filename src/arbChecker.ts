import { THRESHOLD } from "./config"

export interface ArbResult {
    shouldTrade: boolean;
    diffRatio: number;
    ratio: number;
    dexPrice: number;
    cexPrice: number;
    exchange?: string;
}

export function shouldArbitrage(dexPrice: number, cexPrices: { binance?: number; okx?: number }): ArbResult {
    const results: ArbResult[] = [];
    
    // 检查OKX套利机会
    if (cexPrices.okx) {
        const okxRatio = cexPrices.okx / dexPrice;
        const okxDiffRatio = okxRatio - 1;
        
        results.push({
            shouldTrade: okxDiffRatio >= THRESHOLD,
            diffRatio: okxDiffRatio,
            ratio: okxRatio,
            dexPrice,
            cexPrice: cexPrices.okx,
            exchange: 'OKX'
        });
    }
    
    // 检查Binance套利机会
    if (cexPrices.binance) {
        const binanceRatio = cexPrices.binance / dexPrice;
        const binanceDiffRatio = binanceRatio - 1;
        
        results.push({
            shouldTrade: binanceDiffRatio >= THRESHOLD,
            diffRatio: binanceDiffRatio,
            ratio: binanceRatio,
            dexPrice,
            cexPrice: cexPrices.binance,
            exchange: 'Binance'
        });
    }
    
    // 返回最优套利机会
    return results.sort((a, b) => b.diffRatio - a.diffRatio)[0] || {
        shouldTrade: false,
        diffRatio: 0,
        ratio: 1,
        dexPrice,
        cexPrice: 0
    };
}