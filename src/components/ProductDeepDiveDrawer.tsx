import React, { useState, useEffect } from 'react';
import {
  X,
  Bookmark,
  Calculator,
  Megaphone,
  Scale,
  Package,
  Zap,
  Copy,
  Check,
  TrendingUp,
  Activity,
  ShieldAlert
} from 'lucide-react';
import { Product, DrawerTab } from '../types';
import { calculateUnitEconomics } from '../utils/calculator';
import { getVerdictStyle } from './ProductCard';

interface ProductDeepDiveDrawerProps {
  product: Product;
  activeTab: DrawerTab;
  setActiveTab: (tab: DrawerTab) => void;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent) => void;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
}

export const ProductDeepDiveDrawer: React.FC<ProductDeepDiveDrawerProps> = ({
  product,
  activeTab,
  setActiveTab,
  onClose,
  isSaved,
  onToggleSave,
  onCopy,
  copiedId
}) => {
  const [cogs, setCogs] = useState(Number(product.sourcingCost) || 8.5);
  const [sellingPrice, setSellingPrice] = useState(Number(product.sellingPrice) || 39.99);
  const [shippingCost, setShippingCost] = useState(Number(product.estimatedShipping) || 4.5);
  const [cpa, setCpa] = useState(Number(product.estimatedCPA) || 12.0);
  const [processingFeePct, setProcessingFeePct] = useState(2.9);
  const [monthlyUnits, setMonthlyUnits] = useState(300);

  useEffect(() => {
    setCogs(Number(product.sourcingCost) || 8.5);
    setSellingPrice(Number(product.sellingPrice) || 39.99);
    setShippingCost(Number(product.estimatedShipping) || 4.5);
    setCpa(Number(product.estimatedCPA) || 12.0);
  }, [product]);

  const economics = calculateUnitEconomics({
    sellingPrice,
    cogs,
    shippingCost,
    cpa,
    processingFeePct,
    monthlyUnits
  });

  const vStyle = getVerdictStyle(product.verdict);
  const VerdictIcon = vStyle.icon;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/75 flex justify-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-[#0A0A0C] border-l border-[#232329] h-full flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 bg-[#141418] border-b border-[#232329] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="px-2 py-0.5 bg-[#0A0A0C] border border-[#232329] text-[10px] font-mono uppercase text-[#A1A1AA]">
                {product.category}
              </span>
              <span className="px-2 py-0.5 bg-[#0A0A0C] border border-[#232329] text-[10px] font-mono uppercase text-[#3B82F6]">
                Market: {product.targetMarket}
              </span>
              <span
                className={`flex items-center gap-1 px-2 py-0.5 border text-[10px] font-mono font-bold uppercase ${vStyle.bg} ${vStyle.border} ${vStyle.text}`}
              >
                <VerdictIcon className="w-3 h-3" />
                {product.verdict}
              </span>
              <span className="px-2 py-0.5 bg-[#10B981]/15 border border-[#10B981] text-[#10B981] text-[10px] font-mono font-bold">
                SCORE: {product.winningScore}/100
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">{product.name}</h2>
            <p className="text-xs text-[#A1A1AA] mt-1">{product.problemSolved}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onToggleSave}
              className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-mono uppercase transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-[#3B82F6] border-[#3B82F6] text-white'
                  : 'bg-[#0A0A0C] border-[#232329] text-[#A1A1AA] hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              {isSaved ? 'Bookmarked' : 'Bookmark'}
            </button>
            <button
              onClick={onClose}
              aria-label="Close drawer"
              className="p-2 bg-[#0A0A0C] hover:bg-[#1F1F26] border border-[#232329] text-[#A1A1AA] hover:text-white cursor-pointer"
              title="Close Drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Tab Navigation */}
        <div className="flex border-b border-[#232329] bg-[#141418] px-5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'calculator'
                ? 'border-[#3B82F6] text-white bg-[#0A0A0C]'
                : 'border-transparent text-[#A1A1AA] hover:text-white'
            }`}
          >
            <Calculator className="w-4 h-4 text-[#10B981]" />
            Tab 1: Profit & Sourcing Calculator
          </button>

          <button
            onClick={() => setActiveTab('marketing')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'marketing'
                ? 'border-[#3B82F6] text-white bg-[#0A0A0C]'
                : 'border-transparent text-[#A1A1AA] hover:text-white'
            }`}
          >
            <Megaphone className="w-4 h-4 text-[#3B82F6]" />
            Tab 2: AI Marketing Pack (Groq)
          </button>

          <button
            onClick={() => setActiveTab('debate')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'debate'
                ? 'border-[#3B82F6] text-white bg-[#0A0A0C]'
                : 'border-transparent text-[#A1A1AA] hover:text-white'
            }`}
          >
            <Scale className="w-4 h-4 text-[#F59E0B]" />
            Tab 3: 3-AI Debate & Sourcing
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: PROFIT & SOURCING CALCULATOR */}
          {activeTab === 'calculator' && (
            <div className="space-y-6">
              {/* Top KPI Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#141418] border border-[#232329] p-4">
                  <div className="text-[10px] font-mono uppercase text-[#A1A1AA]">
                    Net Profit / Unit
                  </div>
                  <div
                    className={`text-xl font-mono font-bold mt-1 ${
                      economics.netProfitPerUnit > 0 ? 'text-[#10B981]' : 'text-[#EF4444]'
                    }`}
                  >
                    ${economics.netProfitPerUnit.toFixed(2)}
                  </div>
                  <div className="text-[11px] font-mono text-[#71717A] mt-0.5">
                    Margin: {economics.netMarginPct}%
                  </div>
                </div>

                <div className="bg-[#141418] border border-[#232329] p-4">
                  <div className="text-[10px] font-mono uppercase text-[#A1A1AA]">
                    Break-Even ROAS
                  </div>
                  <div className="text-xl font-mono font-bold text-white mt-1">
                    {economics.breakEvenROAS}x
                  </div>
                  <div className="text-[11px] font-mono text-[#3B82F6] mt-0.5">
                    Current ROAS: {economics.achievedROAS}x
                  </div>
                </div>

                <div className="bg-[#141418] border border-[#232329] p-4">
                  <div className="text-[10px] font-mono uppercase text-[#A1A1AA]">
                    Monthly Revenue
                  </div>
                  <div className="text-xl font-mono font-bold text-white mt-1">
                    ${economics.monthlyRevenue.toLocaleString()}
                  </div>
                  <div className="text-[11px] font-mono text-[#71717A] mt-0.5">
                    @ {monthlyUnits} orders/mo
                  </div>
                </div>

                <div className="bg-[#141418] border border-[#232329] p-4">
                  <div className="text-[10px] font-mono uppercase text-[#A1A1AA]">
                    Monthly Net Profit
                  </div>
                  <div
                    className={`text-xl font-mono font-bold mt-1 ${
                      economics.monthlyNetProfit > 0 ? 'text-[#10B981]' : 'text-[#EF4444]'
                    }`}
                  >
                    ${economics.monthlyNetProfit.toLocaleString()}
                  </div>
                  <div className="text-[11px] font-mono text-[#71717A] mt-0.5">
                    After COGS + Ads + Fees
                  </div>
                </div>
              </div>

              {/* Interactive Sliders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-[#141418] border border-[#232329] p-5">
                {/* Selling Price Slider */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-[#A1A1AA] uppercase">Retail Selling Price ($)</span>
                    <span className="text-white font-bold">${sellingPrice.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="250"
                    step="0.5"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(parseFloat(e.target.value))}
                    className="w-full accent-[#3B82F6] cursor-pointer"
                  />
                </div>

                {/* Manufacturing / Sourcing COGS Slider */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-[#A1A1AA] uppercase">Unit Sourcing Cost / COGS ($)</span>
                    <span className="text-white font-bold">${cogs.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="120"
                    step="0.25"
                    value={cogs}
                    onChange={(e) => setCogs(parseFloat(e.target.value))}
                    className="w-full accent-[#3B82F6] cursor-pointer"
                  />
                </div>

                {/* Ad Spend CPA Slider */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-[#A1A1AA] uppercase">Target Ad CPA / CAC ($)</span>
                    <span className="text-[#F59E0B] font-bold">${cpa.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="80"
                    step="0.5"
                    value={cpa}
                    onChange={(e) => setCpa(parseFloat(e.target.value))}
                    className="w-full accent-[#F59E0B] cursor-pointer"
                  />
                </div>

                {/* Fulfillment / Shipping Cost Slider */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-[#A1A1AA] uppercase">3PL / ePacket Shipping ($)</span>
                    <span className="text-white font-bold">${shippingCost.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="35"
                    step="0.5"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(parseFloat(e.target.value))}
                    className="w-full accent-[#3B82F6] cursor-pointer"
                  />
                </div>

                {/* Monthly Order Volume Slider */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-[#A1A1AA] uppercase">Projected Monthly Sales (Units)</span>
                    <span className="text-[#10B981] font-bold">{monthlyUnits} units</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="3000"
                    step="10"
                    value={monthlyUnits}
                    onChange={(e) => setMonthlyUnits(parseInt(e.target.value, 10))}
                    className="w-full accent-[#10B981] cursor-pointer"
                  />
                </div>

                {/* Payment Gateway Fee Slider */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-[#A1A1AA] uppercase">Payment Processing Fee (%)</span>
                    <span className="text-white font-bold">{processingFeePct.toFixed(1)}% + $0.30</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    step="0.1"
                    value={processingFeePct}
                    onChange={(e) => setProcessingFeePct(parseFloat(e.target.value))}
                    className="w-full accent-[#3B82F6] cursor-pointer"
                  />
                </div>
              </div>

              {/* Supplier Negotiation & Sourcing Intelligence Box */}
              <div className="bg-[#141418] border border-[#232329] p-5 space-y-3">
                <div className="text-xs font-mono uppercase text-[#10B981] font-bold flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Supplier & Alibaba MOQ Negotiation Playbook
                </div>
                <p className="text-xs text-[#E4E4E7] leading-relaxed">
                  {product.supplierNegotiationAngle}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-[#0A0A0C] border border-[#232329] p-3">
                    <div className="text-[10px] font-mono uppercase text-[#A1A1AA]">
                      Quality & Return Rate Audit
                    </div>
                    <p className="text-xs text-[#E4E4E7] mt-1">{product.returnRateRisk}</p>
                  </div>
                  <div className="bg-[#0A0A0C] border border-[#232329] p-3">
                    <div className="text-[10px] font-mono uppercase text-[#A1A1AA]">
                      Seasonality & Inventory Timing
                    </div>
                    <p className="text-xs text-[#E4E4E7] mt-1">{product.seasonalTrap}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI MARKETING PACK (GROQ) */}
          {activeTab === 'marketing' && (
            <div className="space-y-5">
              {/* 3 Scroll-Stopping TikTok / Reels Hooks */}
              <div className="bg-[#141418] border border-[#232329] p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-mono uppercase font-bold text-[#3B82F6] flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    3 High-Converting TikTok / Meta Video Hooks (First 3 Seconds)
                  </h3>
                  <span className="text-[10px] font-mono text-[#71717A]">
                    Generated via {product.quantProvider || 'Groq LPU'}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {(product.adHooks || []).map((hook, idx) => {
                    const cid = `hook_${idx}`;
                    return (
                      <div
                        key={idx}
                        className="bg-[#0A0A0C] border border-[#232329] p-3.5 flex items-start justify-between gap-3"
                      >
                        <div className="text-xs text-white leading-relaxed">
                          <span className="font-mono text-[#10B981] font-bold mr-2">
                            HOOK #{idx + 1}:
                          </span>
                          &ldquo;{hook}&rdquo;
                        </div>
                        <button
                          onClick={() => onCopy(hook, cid)}
                          className="px-2.5 py-1 bg-[#141418] hover:bg-[#1F1F26] border border-[#232329] text-[11px] font-mono text-[#A1A1AA] hover:text-white shrink-0 flex items-center gap-1 cursor-pointer"
                        >
                          {copiedId === cid ? (
                            <>
                              <Check className="w-3 h-3 text-[#10B981]" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Primary Direct-Response Ad Copy */}
              <div className="bg-[#141418] border border-[#232329] p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-mono uppercase font-bold text-white">
                    Primary Meta / TikTok Ad Copy
                  </h3>
                  <button
                    onClick={() => onCopy(product.primaryAdCopy, 'ad_body')}
                    className="px-2.5 py-1 bg-[#0A0A0C] border border-[#232329] text-[11px] font-mono text-[#A1A1AA] hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === 'ad_body' ? (
                      <>
                        <Check className="w-3 h-3 text-[#10B981]" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy Ad Text
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-[#E4E4E7] bg-[#0A0A0C] border border-[#232329] p-3.5 leading-relaxed whitespace-pre-line">
                  {product.primaryAdCopy}
                </p>
              </div>

              {/* Creative Visual Blueprint & Audience Interests */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#141418] border border-[#232329] p-4">
                  <h4 className="text-xs font-mono uppercase font-bold text-[#10B981] mb-2">
                    UGC Creative Storyboard Blueprint
                  </h4>
                  <p className="text-xs text-[#E4E4E7] leading-relaxed">
                    {product.creativeBlueprint}
                  </p>
                </div>

                <div className="bg-[#141418] border border-[#232329] p-4">
                  <h4 className="text-xs font-mono uppercase font-bold text-[#F59E0B] mb-2">
                    Recommended Ad Targeting Interest Stack
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(product.targetInterests || []).map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-[#0A0A0C] border border-[#232329] text-xs font-mono text-white"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#232329] text-[11px] text-[#A1A1AA]">
                    <strong className="text-white">Demographics:</strong> {product.targetDemographics}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 3-AI DEBATE VIEW */}
          {activeTab === 'debate' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Column 1: Gemini Market Analyst */}
                <div className="bg-[#141418] border border-[#232329] p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#232329]">
                      <span className="text-xs font-mono font-bold uppercase text-[#3B82F6] flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4" />
                        1. Market Analyst
                      </span>
                      <span className="text-[10px] font-mono text-[#71717A]">
                        {product.marketProvider || 'Google Gemini'}
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="text-[10px] font-mono uppercase text-[#71717A]">
                          Core Market Thesis
                        </div>
                        <p className="text-[#E4E4E7] mt-1 leading-relaxed">
                          {product.geminiInsight}
                        </p>
                      </div>

                      <div>
                        <div className="text-[10px] font-mono uppercase text-[#71717A]">
                          Search Intent Signal
                        </div>
                        <p className="text-[#E4E4E7] mt-1 leading-relaxed">
                          {product.searchIntent}
                        </p>
                      </div>

                      <div>
                        <div className="text-[10px] font-mono uppercase text-[#71717A]">
                          Velocity Trajectory
                        </div>
                        <p className="text-[#10B981] font-mono mt-1">{product.trendTrajectory}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#232329] flex justify-between font-mono text-[11px]">
                    <span className="text-[#A1A1AA]">Demand: {product.demandScore}/100</span>
                    <span className="text-[#F59E0B]">Saturation: {product.saturationScore}/100</span>
                  </div>
                </div>

                {/* Column 2: Groq Quant & Growth Scorer */}
                <div className="bg-[#141418] border border-[#232329] p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#232329]">
                      <span className="text-xs font-mono font-bold uppercase text-[#10B981] flex items-center gap-1.5">
                        <Activity className="w-4 h-4" />
                        2. Quant & Viral Scorer
                      </span>
                      <span className="text-[10px] font-mono text-[#71717A]">
                        {product.quantProvider || 'Groq LPU'}
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="text-[10px] font-mono uppercase text-[#71717A]">
                          Quantitative Margin Thesis
                        </div>
                        <p className="text-[#E4E4E7] mt-1 leading-relaxed">{product.groqInsight}</p>
                      </div>

                      <div>
                        <div className="text-[10px] font-mono uppercase text-[#71717A]">
                          Unit Economics Spread
                        </div>
                        <p className="text-white font-mono mt-1">
                          COGS ${Number(product.sourcingCost).toFixed(2)} → Retail $
                          {Number(product.sellingPrice).toFixed(2)} ({product.netProfitMargin}% Net)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#232329] flex justify-between font-mono text-[11px]">
                    <span className="text-[#10B981]">Score: {product.winningScore}/100</span>
                    <span className="text-[#3B82F6]">Viral Wow: {product.viralFactor}/10</span>
                  </div>
                </div>

                {/* Column 3: OpenRouter Ruthless Skeptic */}
                <div className="bg-[#141418] border border-[#232329] p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#232329]">
                      <span className="text-xs font-mono font-bold uppercase text-[#F59E0B] flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4" />
                        3. Ruthless Skeptic
                      </span>
                      <span className="text-[10px] font-mono text-[#71717A]">
                        {product.skepticProvider || 'OpenRouter'}
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="text-[10px] font-mono uppercase text-[#71717A]">
                          Devil&apos;s Advocate Audit
                        </div>
                        <p className="text-[#E4E4E7] mt-1 leading-relaxed">
                          {product.openRouterInsight}
                        </p>
                      </div>

                      <div>
                        <div className="text-[10px] font-mono uppercase text-[#71717A]">
                          Saturation & Competition Risk
                        </div>
                        <p className="text-[#F59E0B] mt-1 leading-relaxed">
                          {product.saturationRisk}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#232329] flex items-center justify-between font-mono text-[11px]">
                    <span className="text-[#A1A1AA]">Final Verdict:</span>
                    <span className={`font-bold ${vStyle.text}`}>{product.verdict}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
