import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateUnitEconomics } from './calculator';

test('calculates correct profit and margin for standard e-commerce item', () => {
  const result = calculateUnitEconomics({
    sellingPrice: 40,
    cogs: 10,
    shippingCost: 5,
    cpa: 12,
    processingFeePct: 2.9,
    fixedFeeDollar: 0.3,
    monthlyUnits: 200
  });

  // payment fee = 40 * 0.029 + 0.3 = 1.16 + 0.3 = 1.46
  assert.equal(result.paymentFeeDollar, 1.46);
  // landed cost = 10 + 5 + 1.46 = 16.46
  assert.equal(result.totalLandedCost, 16.46);
  // gross margin before ads = 40 - 16.46 = 23.54
  assert.equal(result.grossMarginBeforeAds, 23.54);
  // net profit = 23.54 - 12 = 11.54
  assert.equal(result.netProfitPerUnit, 11.54);
  // net margin % = Math.round(11.54 / 40 * 100) = 29%
  assert.equal(result.netMarginPct, 29);
  // breakEvenROAS = 40 / 23.54 = 1.70
  assert.equal(result.breakEvenROAS, '1.70');
  // achievedROAS = 40 / 12 = 3.33
  assert.equal(result.achievedROAS, '3.33');
  // monthly revenue = 40 * 200 = 8000
  assert.equal(result.monthlyRevenue, 8000);
  // monthly net profit = 11.54 * 200 = 2308
  assert.equal(result.monthlyNetProfit, 2308);
});

test('handles zero or negative margin gracefully without crashing', () => {
  const result = calculateUnitEconomics({
    sellingPrice: 15,
    cogs: 12,
    shippingCost: 4,
    cpa: 8
  });

  assert.ok(result.netProfitPerUnit < 0);
  assert.ok(result.netMarginPct < 0);
  assert.equal(result.breakEvenROAS, '∞');
});
