
import { THRESHOLD } from "./config"

export function shouldArbitrage(dexPrice: number, cexPrice: number) {
    const ratio = cexPrice / dexPrice;
    const diffRatio = ratio - 1;

    const shouldTrade = diffRatio >= THRESHOLD
    
    return {
        shouldTrade,
        diffRatio,
        ratio, 
        dexPrice,
        cexPrice
    }
}