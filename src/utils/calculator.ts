export interface EconomicsInput {
  sellingPrice: number;
  cogs: number;
  shippingCost: number;
  cpa: number;
  processingFeePct?: number; // default 2.9%
  fixedFeeDollar?: number;   // default $0.30
  monthlyUnits?: number;     // default 300
}

export interface EconomicsResult {
  paymentFeeDollar: number;
  totalLandedCost: number;
  grossMarginBeforeAds: number;
  netProfitPerUnit: number;
  netMarginPct: number;
  breakEvenROAS: string;
  achievedROAS: string;
  monthlyRevenue: number;
  monthlyNetProfit: number;
}

export function calculateUnitEconomics(input: EconomicsInput): EconomicsResult {
  const sellingPrice = Number(input.sellingPrice) || 0;
  const cogs = Number(input.cogs) || 0;
  const shippingCost = Number(input.shippingCost) || 0;
  const cpa = Number(input.cpa) || 0;
  const processingFeePct = typeof input.processingFeePct === 'number' ? input.processingFeePct : 2.9;
  const fixedFeeDollar = typeof input.fixedFeeDollar === 'number' ? input.fixedFeeDollar : 0.3;
  const monthlyUnits = typeof input.monthlyUnits === 'number' ? input.monthlyUnits : 300;

  const paymentFeeDollar = Number(((sellingPrice * processingFeePct) / 100 + fixedFeeDollar).toFixed(2));
  const totalLandedCost = Number((cogs + shippingCost + paymentFeeDollar).toFixed(2));
  const grossMarginBeforeAds = Number((sellingPrice - totalLandedCost).toFixed(2));
  const netProfitPerUnit = Number((grossMarginBeforeAds - cpa).toFixed(2));

  const netMarginPct = sellingPrice > 0 ? Math.round((netProfitPerUnit / sellingPrice) * 100) : 0;

  const breakEvenROAS = grossMarginBeforeAds > 0
    ? (sellingPrice / grossMarginBeforeAds).toFixed(2)
    : '∞';

  const achievedROAS = cpa > 0
    ? (sellingPrice / cpa).toFixed(2)
    : '∞';

  const monthlyRevenue = Math.round(sellingPrice * monthlyUnits);
  const monthlyNetProfit = Math.round(netProfitPerUnit * monthlyUnits);

  return {
    paymentFeeDollar,
    totalLandedCost,
    grossMarginBeforeAds,
    netProfitPerUnit,
    netMarginPct,
    breakEvenROAS,
    achievedROAS,
    monthlyRevenue,
    monthlyNetProfit
  };
}
