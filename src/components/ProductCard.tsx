import React from 'react';
import { Bookmark, ChevronRight, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent) => void;
  onClick: () => void;
}

export function getVerdictStyle(verdict: string) {
  if (verdict === 'MUST LAUNCH') {
    return {
      bg: 'bg-[#10B981]/15',
      border: 'border-[#10B981]',
      text: 'text-[#10B981]',
      icon: CheckCircle2
    };
  }
  if (verdict === 'SATURATED - AVOID') {
    return {
      bg: 'bg-[#EF4444]/15',
      border: 'border-[#EF4444]',
      text: 'text-[#EF4444]',
      icon: XCircle
    };
  }
  return {
    bg: 'bg-[#F59E0B]/15',
    border: 'border-[#F59E0B]',
    text: 'text-[#F59E0B]',
    icon: AlertTriangle
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSaved,
  onToggleSave,
  onClick
}) => {
  const vStyle = getVerdictStyle(product.verdict);
  const VerdictIcon = vStyle.icon;

  return (
    <article
      onClick={onClick}
      className="bg-[#141418] hover:bg-[#18181E] border border-[#232329] hover:border-[#3B82F6] transition-colors flex flex-col justify-between cursor-pointer group"
    >
      {/* Top Header */}
      <div className="p-5 border-b border-[#232329]">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="px-2 py-0.5 bg-[#0A0A0C] border border-[#232329] text-[10px] font-mono uppercase text-[#A1A1AA]">
            {product.category}
          </span>

          <div className="flex items-center gap-2">
            {/* AI Consensus Verdict Badge */}
            <span
              className={`flex items-center gap-1 px-2 py-0.5 border text-[10px] font-mono font-bold uppercase ${vStyle.bg} ${vStyle.border} ${vStyle.text}`}
            >
              <VerdictIcon className="w-3 h-3" />
              {product.verdict}
            </span>

            {/* Bookmark Button */}
            <button
              onClick={onToggleSave}
              aria-label={isSaved ? `Remove ${product.name} from saved` : `Save ${product.name}`}
              className={`p-1.5 border transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-[#3B82F6] border-[#3B82F6] text-white'
                  : 'bg-[#0A0A0C] border-[#232329] text-[#71717A] hover:text-white'
              }`}
              title={isSaved ? 'Remove from Saved Winners' : 'Save to Winners Vault'}
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Product Title & Problem Solved */}
        <h3 className="text-base font-bold text-white group-hover:text-[#3B82F6] transition-colors leading-snug">
          {product.name}
        </h3>
        <p className="text-xs text-[#A1A1AA] mt-1.5 line-clamp-2 leading-relaxed">
          {product.problemSolved}
        </p>
      </div>

      {/* Core Metrics Body */}
      <div className="p-5 space-y-4">
        {/* Winning Score + Unit Economics Row */}
        <div className="grid grid-cols-3 gap-2 bg-[#0A0A0C] border border-[#232329] p-3">
          <div>
            <div className="text-[10px] font-mono uppercase text-[#71717A]">
              Winning Score
            </div>
            <div className="text-lg font-mono font-bold text-[#10B981] mt-0.5">
              {product.winningScore}
              <span className="text-xs text-[#71717A]">/100</span>
            </div>
          </div>

          <div className="border-l border-[#232329] pl-3">
            <div className="text-[10px] font-mono uppercase text-[#71717A]">
              COGS → Retail
            </div>
            <div className="text-sm font-mono font-bold text-white mt-1">
              ${Number(product.sourcingCost).toFixed(2)}{' '}
              <span className="text-[#71717A]">→</span> $
              {Number(product.sellingPrice).toFixed(2)}
            </div>
          </div>

          <div className="border-l border-[#232329] pl-3">
            <div className="text-[10px] font-mono uppercase text-[#71717A]">
              Viral Factor
            </div>
            <div className="text-sm font-mono font-bold text-[#3B82F6] mt-1">
              {product.viralFactor} <span className="text-xs text-[#71717A]">/ 10</span>
            </div>
          </div>
        </div>

        {/* Net Profit Margin Bar */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-[#A1A1AA] uppercase text-[11px]">
              Est. Net Profit Margin
            </span>
            <span
              className={`font-bold ${
                product.netProfitMargin >= 35
                  ? 'text-[#10B981]'
                  : product.netProfitMargin >= 20
                  ? 'text-[#F59E0B]'
                  : 'text-[#EF4444]'
              }`}
            >
              {product.netProfitMargin}% Net
            </span>
          </div>
          <div className="w-full h-2 bg-[#0A0A0C] border border-[#232329]">
            <div
              className={`h-full ${
                product.netProfitMargin >= 35
                  ? 'bg-[#10B981]'
                  : product.netProfitMargin >= 20
                  ? 'bg-[#F59E0B]'
                  : 'bg-[#EF4444]'
              }`}
              style={{
                width: `${Math.min(100, Math.max(8, product.netProfitMargin))}%`
              }}
            />
          </div>
        </div>

        {/* Demand vs Saturation Dual Meter */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono mb-1">
              <span className="text-[#A1A1AA]">DEMAND</span>
              <span className="text-[#10B981] font-bold">{product.demandScore}/100</span>
            </div>
            <div className="w-full h-1.5 bg-[#0A0A0C] border border-[#232329]">
              <div
                className="h-full bg-[#10B981]"
                style={{ width: `${product.demandScore}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] font-mono mb-1">
              <span className="text-[#A1A1AA]">SATURATION</span>
              <span
                className={`font-bold ${
                  product.saturationScore > 70
                    ? 'text-[#EF4444]'
                    : product.saturationScore > 45
                    ? 'text-[#F59E0B]'
                    : 'text-[#10B981]'
                }`}
              >
                {product.saturationScore}/100
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#0A0A0C] border border-[#232329]">
              <div
                className={`h-full ${
                  product.saturationScore > 70
                    ? 'bg-[#EF4444]'
                    : product.saturationScore > 45
                    ? 'bg-[#F59E0B]'
                    : 'bg-[#3B82F6]'
                }`}
                style={{ width: `${product.saturationScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Preview Top Viral Hook */}
        <div className="bg-[#0A0A0C] border border-[#232329] p-2.5">
          <div className="text-[10px] font-mono uppercase text-[#3B82F6] mb-0.5">
            Top Groq Viral Ad Hook:
          </div>
          <p className="text-xs text-[#E4E4E7] line-clamp-2 italic">
            &ldquo;{product.adHooks?.[0]}&rdquo;
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 py-3 bg-[#0A0A0C] border-t border-[#232329] flex items-center justify-between text-xs">
        <span className="font-mono text-[11px] text-[#71717A]">
          Market: <strong className="text-[#E4E4E7]">{product.targetMarket}</strong>
        </span>
        <span className="font-mono text-[11px] text-[#3B82F6] group-hover:underline flex items-center gap-1 font-semibold">
          Open 3-AI Deep Dive <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </article>
  );
};
