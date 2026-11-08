import { Product } from '../types';

export function exportToCSV(list: Product[], defaultFilename: string = 'winning-products.csv') {
  if (list.length === 0) return false;

  const headers = [
    'Product Name',
    'Category',
    'Niche',
    'Target Market',
    'Budget Tier',
    'Winning Score (0-100)',
    'AI Consensus Verdict',
    'Sourcing Cost ($)',
    'Selling Price ($)',
    'Shipping ($)',
    'Est CPA ($)',
    'Net Profit Margin (%)',
    'Viral Factor (1-10)',
    'Demand Score (0-100)',
    'Saturation Score (0-100)',
    'Problem Solved',
    'Top Ad Hook',
    'Supplier Negotiation Angle'
  ];

  const escapeCSV = (val: any) => {
    const str = String(val ?? '').replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = list.map((p) => [
    escapeCSV(p.name),
    escapeCSV(p.category),
    escapeCSV(p.niche),
    escapeCSV(p.targetMarket),
    escapeCSV(p.budgetTier),
    escapeCSV(p.winningScore),
    escapeCSV(p.verdict),
    escapeCSV(p.sourcingCost),
    escapeCSV(p.sellingPrice),
    escapeCSV(p.estimatedShipping),
    escapeCSV(p.estimatedCPA),
    escapeCSV(p.netProfitMargin),
    escapeCSV(p.viralFactor),
    escapeCSV(p.demandScore),
    escapeCSV(p.saturationScore),
    escapeCSV(p.problemSolved),
    escapeCSV(p.adHooks?.[0] || ''),
    escapeCSV(p.supplierNegotiationAngle)
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = defaultFilename;
  a.click();
  URL.revokeObjectURL(url);
  return true;
}

export function exportToJSON(list: Product[], defaultFilename: string = 'winning-products-report.json') {
  if (list.length === 0) return false;

  const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = defaultFilename;
  a.click();
  URL.revokeObjectURL(url);
  return true;
}
