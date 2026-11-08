import React from 'react';
import { Search, Globe, DollarSign, RefreshCw, Zap, Radio, Sparkles, Link2 } from 'lucide-react';
import { NICHE_PRESETS, TARGET_MARKETS, BUDGET_TIERS } from '../data/presetData';

interface HuntControlBarProps {
  niche: string;
  setNiche: (niche: string) => void;
  targetMarket: string;
  setTargetMarket: (market: string) => void;
  budgetTier: string;
  setBudgetTier: (tier: string) => void;
  huntMode: string;
  setHuntMode: (mode: 'live_scraper' | 'ai_deep_synthesis') => void;
  customSignals: string;
  setCustomSignals: (signals: string) => void;
  showCustomSignalsInput: boolean;
  setShowCustomSignalsInput: (val: boolean | ((prev: boolean) => boolean)) => void;
  isHunting: boolean;
  onHunt: (e?: React.FormEvent) => void;
}

export const HuntControlBar: React.FC<HuntControlBarProps> = ({
  niche,
  setNiche,
  targetMarket,
  setTargetMarket,
  budgetTier,
  setBudgetTier,
  huntMode,
  setHuntMode,
  customSignals,
  setCustomSignals,
  showCustomSignalsInput,
  setShowCustomSignalsInput,
  isHunting,
  onHunt
}) => {
  return (
    <section className="bg-[#141418] border border-[#232329] p-5">
      <form onSubmit={onHunt} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Niche / Keyword Input (5 cols) */}
          <div className="lg:col-span-5">
            <label className="block text-[11px] font-mono uppercase text-[#A1A1AA] mb-1.5">
              1. Target Niche / Product Keyword
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g., Smart Kitchen Gadgets, Auto Detailing, Pet Tech..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0C] border border-[#232329] focus:border-[#3B82F6] focus:outline-none text-sm text-white"
              />
            </div>
          </div>

          {/* Target Market Selector (2 cols) */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-mono uppercase text-[#A1A1AA] mb-1.5">
              2. Target Market
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-[#71717A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={targetMarket}
                onChange={(e) => setTargetMarket(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#0A0A0C] border border-[#232329] focus:border-[#3B82F6] focus:outline-none text-sm text-white"
              >
                {TARGET_MARKETS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Budget / Price Tier (2 cols) */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-mono uppercase text-[#A1A1AA] mb-1.5">
              3. Price / Ticket Tier
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-[#71717A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={budgetTier}
                onChange={(e) => setBudgetTier(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#0A0A0C] border border-[#232329] focus:border-[#3B82F6] focus:outline-none text-sm text-white"
              >
                {BUDGET_TIERS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Execute Hunt CTA (3 cols) */}
          <div className="lg:col-span-3 flex items-end">
            <button
              type="submit"
              disabled={isHunting}
              className="w-full py-2.5 px-4 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-60 text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 border border-[#60A5FA] transition-colors cursor-pointer"
            >
              {isHunting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Executing Triple-AI...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>HUNT WINNING PRODUCTS</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Niche Preset Chips & Hunt Mode Controls */}
        <div className="pt-3 border-t border-[#232329] flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          {/* Preset Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono uppercase text-[#71717A] mr-1">
              Quick Niches:
            </span>
            {NICHE_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setNiche(preset)}
                className={`px-2.5 py-1 text-xs border transition-colors cursor-pointer ${
                  niche === preset
                    ? 'bg-[#3B82F6]/20 border-[#3B82F6] text-white font-medium'
                    : 'bg-[#0A0A0C] border-[#232329] text-[#A1A1AA] hover:text-white hover:border-[#3F3F46]'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Hunt Mode Toggle + Custom URL/Signal Injector */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-[#0A0A0C] border border-[#232329] p-0.5">
              <button
                type="button"
                onClick={() => setHuntMode('live_scraper')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono uppercase transition-colors cursor-pointer ${
                  huntMode === 'live_scraper'
                    ? 'bg-[#10B981] text-[#0A0A0C] font-bold'
                    : 'text-[#A1A1AA] hover:text-white'
                }`}
              >
                <Radio className="w-3 h-3" />
                Live Web Signal Scraper + AI
              </button>
              <button
                type="button"
                onClick={() => setHuntMode('ai_deep_synthesis')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono uppercase transition-colors cursor-pointer ${
                  huntMode === 'ai_deep_synthesis'
                    ? 'bg-[#3B82F6] text-white font-bold'
                    : 'text-[#A1A1AA] hover:text-white'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                Direct 3-AI Synthesis
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowCustomSignalsInput((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs border transition-colors cursor-pointer ${
                showCustomSignalsInput || customSignals.trim()
                  ? 'bg-[#141418] border-[#3B82F6] text-[#3B82F6]'
                  : 'bg-[#0A0A0C] border-[#232329] text-[#A1A1AA] hover:text-white'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>
                {customSignals.trim()
                  ? 'Custom Product URLs Active'
                  : 'Paste Custom URLs / Signals'}
              </span>
            </button>
          </div>
        </div>

        {/* Optional Custom URL / Raw Signal Paste Box */}
        {showCustomSignalsInput && (
          <div className="pt-3 border-t border-[#232329]">
            <label className="block text-[11px] font-mono uppercase text-[#A1A1AA] mb-1">
              Custom Competitor URLs / AliExpress / Amazon / TikTok Shop Titles (One per line — passed into all 3 AI Engines)
            </label>
            <textarea
              rows={3}
              value={customSignals}
              onChange={(e) => setCustomSignals(e.target.value)}
              placeholder="Paste specific product titles, Amazon/AliExpress URLs, or TikTok ad observations here to force the 3 AI engines to evaluate or benchmark them..."
              className="w-full p-3 bg-[#0A0A0C] border border-[#232329] focus:border-[#3B82F6] focus:outline-none text-xs font-mono text-white"
            />
          </div>
        )}
      </form>
    </section>
  );
};
