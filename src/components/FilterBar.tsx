import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { ViewMode, SortOption, VerdictFilterOption } from '../types';

interface FilterBarProps {
  activeView: ViewMode;
  itemCount: number;
  verdictFilter: VerdictFilterOption;
  setVerdictFilter: (v: VerdictFilterOption) => void;
  sortBy: SortOption;
  setSortBy: (s: SortOption) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeView,
  itemCount,
  verdictFilter,
  setVerdictFilter,
  sortBy,
  setSortBy
}) => {
  const verdictOptions: VerdictFilterOption[] = [
    'ALL',
    'MUST LAUNCH',
    'TEST WITH CAUTION',
    'SATURATED - AVOID'
  ];

  return (
    <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#141418] border border-[#232329] px-4 py-3">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-mono uppercase text-[#A1A1AA]">
          {activeView === 'saved'
            ? `Saved Winners Vault (${itemCount})`
            : `Analyzed Candidates (${itemCount})`}
        </span>

        <span className="text-[#232329]">|</span>

        {/* Verdict Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {verdictOptions.map((v) => (
            <button
              key={v}
              onClick={() => setVerdictFilter(v)}
              className={`px-2.5 py-1 text-[11px] font-mono uppercase border transition-colors cursor-pointer ${
                verdictFilter === v
                  ? v === 'MUST LAUNCH'
                    ? 'bg-[#10B981] text-[#0A0A0C] border-[#10B981] font-bold'
                    : v === 'SATURATED - AVOID'
                    ? 'bg-[#EF4444] text-white border-[#EF4444] font-bold'
                    : v === 'TEST WITH CAUTION'
                    ? 'bg-[#F59E0B] text-[#0A0A0C] border-[#F59E0B] font-bold'
                    : 'bg-[#3B82F6] text-white border-[#3B82F6] font-bold'
                  : 'bg-[#0A0A0C] border-[#232329] text-[#A1A1AA] hover:text-white'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Selector */}
      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-3.5 h-3.5 text-[#71717A]" />
        <span className="text-xs font-mono uppercase text-[#A1A1AA]">Sort By:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="px-2.5 py-1 bg-[#0A0A0C] border border-[#232329] text-xs font-mono text-white focus:outline-none"
        >
          <option value="winningScore">Winning Score (High → Low)</option>
          <option value="profitMargin">Net Profit Margin % (High → Low)</option>
          <option value="demandScore">Market Demand (High → Low)</option>
          <option value="viralFactor">Viral / Wow Factor (High → Low)</option>
        </select>
      </div>
    </section>
  );
};
