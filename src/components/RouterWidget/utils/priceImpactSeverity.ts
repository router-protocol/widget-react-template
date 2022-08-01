// export const BIPS_BASE = JSBI.BigInt(10000)
// const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%
// const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
// const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%

export function warningSeverity(priceImpact: string): 0 | 1 | 2 | 3 | 4 {
  if(parseFloat(priceImpact)>15) return 4
  if(parseFloat(priceImpact)>5) return 3
  if(parseFloat(priceImpact)>3) return 2
  if(parseFloat(priceImpact)>1) return 1
  return 0
}