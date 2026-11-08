import React from 'react';
import { Product } from '../types';
import { getVerdictStyle } from './ProductCard';

interface ProductMatrixTableProps {
  products: Product[];
  isProductSaved: (product: Product) => boolean;
  onToggleSave: (product: Product, e: React.MouseEvent) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductMatrixTable: React.FC<ProductMatrixTableProps> = ({
  products,
  isProductSaved,
  onToggleSave,
  onSelectProduct
}) => {
  return (
    <section className="bg-[#141418] border border-[#232329] overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#0A0A0C] border-b border-[#232329] text-[11px] font-mono uppercase text-[#A1A1AA]">
            <th className="p-3.5">Product / Category</th>
            <th className="p-3.5">Winning Score</th>
            <th className="p-3.5">COGS / Retail</th>
            <th className="p-3.5">Net Margin</th>
            <th className="p-3.5">Demand vs Sat.</th>
            <th className="p-3.5">Viral Factor</th>
            <th className="p-3.5">Council Verdict</th>
            <th className="p-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#232329] text-xs">
          {products.map((product) => {
            const vStyle = getVerdictStyle(product.verdict);
            const saved = isProductSaved(product);
            return (
              <tr
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="hover:bg-[#1C1C22] cursor-pointer transition-colors"
              >
                <td className="p-3.5 max-w-xs">
                  <div className="font-bold text-white">{product.name}</div>
                  <div className="text-[11px] text-[#71717A] font-mono mt-0.5">
                    {product.category} · {product.targetMarket}
                  </div>
                </td>
                <td className="p-3.5 font-mono font-bold text-sm text-[#10B981]">
                  {product.winningScore}/100
                </td>
                <td className="p-3.5 font-mono text-white">
                  ${Number(product.sourcingCost).toFixed(2)} → $
                  {Number(product.sellingPrice).toFixed(2)}
                </td>
                <td className="p-3.5 font-mono font-bold">
                  <span
                    className={
                      product.netProfitMargin >= 35
                        ? 'text-[#10B981]'
                        : product.netProfitMargin >= 20
                        ? 'text-[#F59E0B]'
                        : 'text-[#EF4444]'
                    }
                  >
                    {product.netProfitMargin}%
                  </span>
                </td>
                <td className="p-3.5 font-mono">
                  <span className="text-[#10B981]">{product.demandScore}D</span>
                  <span className="text-[#52525B] mx-1">/</span>
                  <span className="text-[#F59E0B]">{product.saturationScore}S</span>
                </td>
                <td className="p-3.5 font-mono text-[#3B82F6] font-bold">
                  {product.viralFactor}/10
                </td>
                <td className="p-3.5">
                  <span
                    className={`inline-block px-2 py-0.5 border text-[10px] font-mono font-bold uppercase ${vStyle.bg} ${vStyle.border} ${vStyle.text}`}
                  >
                    {product.verdict}
                  </span>
                </td>
                <td className="p-3.5 text-right space-x-2">
                  <button
                    onClick={(e) => onToggleSave(product, e)}
                    aria-label={saved ? `Remove ${product.name} from saved` : `Save ${product.name}`}
                    className={`px-2 py-1 border text-[11px] font-mono cursor-pointer ${
                      saved
                        ? 'bg-[#3B82F6] border-[#3B82F6] text-white'
                        : 'bg-[#0A0A0C] border-[#232329] text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    {saved ? 'Saved' : 'Save'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProduct(product);
                    }}
                    className="px-2.5 py-1 bg-[#0A0A0C] border border-[#232329] text-[#3B82F6] font-mono text-[11px] hover:text-white cursor-pointer"
                  >
                    Inspect
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};
