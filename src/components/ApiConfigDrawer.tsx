import React from 'react';
import { Key, RefreshCw } from 'lucide-react';
import { ApiKeys, KeyStatusState } from '../types';
import { OPENROUTER_MODELS } from '../data/presetData';

interface ApiConfigDrawerProps {
  apiKeys: ApiKeys;
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKeys>>;
  keyStatus: KeyStatusState;
  isTestingKeys: boolean;
  onTestConnections: () => void;
  onClose: () => void;
}

export const ApiConfigDrawer: React.FC<ApiConfigDrawerProps> = ({
  apiKeys,
  setApiKeys,
  keyStatus,
  isTestingKeys,
  onTestConnections,
  onClose
}) => {
  return (
    <div className="bg-[#141418] border-b border-[#232329] px-4 sm:px-6 py-5 animate-in slide-in-from-top-2 duration-150">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-[#232329]">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-[#3B82F6]" />
              Triple-AI Engine Configuration (Local Browser Storage)
            </h2>
            <p className="text-xs text-[#A1A1AA] mt-0.5">
              Keys are stored strictly in your browser&apos;s <code className="text-[#10B981]">localStorage</code> and dispatched directly to official endpoints. If only 1 or 2 keys are entered, tasks automatically redistribute across active engines.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onTestConnections}
              disabled={isTestingKeys}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingKeys ? 'animate-spin' : ''}`} />
              {isTestingKeys ? 'Pinging Endpoints...' : 'Test Active Connections'}
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 bg-[#0A0A0C] hover:bg-[#1F1F26] border border-[#232329] text-xs text-[#A1A1AA] hover:text-white cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 1. GOOGLE GEMINI CARD */}
          <div className="bg-[#0A0A0C] border border-[#232329] p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#3B82F6]" />
                  1. Google Gemini API Key
                </span>
                <span
                  className={`text-[10px] font-mono uppercase px-1.5 py-0.5 border ${
                    apiKeys.gemini?.trim()
                      ? keyStatus.gemini.status === 'error'
                        ? 'border-[#EF4444] text-[#EF4444]'
                        : 'border-[#10B981] text-[#10B981]'
                      : 'border-[#232329] text-[#71717A]'
                  }`}
                >
                  {apiKeys.gemini?.trim()
                    ? keyStatus.gemini.message || 'Configured'
                    : 'Missing'}
                </span>
              </div>
              <p className="text-[11px] text-[#A1A1AA] mb-3">
                <strong className="text-[#E4E4E7]">Role:</strong> Product Discovery, Deep Market Trend Analysis, Search Intent & Competitor Saturation.
              </p>
              <input
                type="password"
                value={apiKeys.gemini}
                onChange={(e) => setApiKeys((prev) => ({ ...prev, gemini: e.target.value }))}
                placeholder="AIzaSy... (Google AI Studio Key)"
                className="w-full px-3 py-2 bg-[#141418] border border-[#232329] focus:border-[#3B82F6] focus:outline-none text-xs font-mono text-white"
              />
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-[#71717A]">
              <span>Model: gemini-2.5-flash</span>
              <span>Hint: Starts with AIza...</span>
            </div>
          </div>

          {/* 2. GROQ LPU CARD */}
          <div className="bg-[#0A0A0C] border border-[#232329] p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#10B981]" />
                  2. Groq Cloud API Key
                </span>
                <span
                  className={`text-[10px] font-mono uppercase px-1.5 py-0.5 border ${
                    apiKeys.groq?.trim()
                      ? keyStatus.groq.status === 'error'
                        ? 'border-[#EF4444] text-[#EF4444]'
                        : 'border-[#10B981] text-[#10B981]'
                      : 'border-[#232329] text-[#71717A]'
                  }`}
                >
                  {apiKeys.groq?.trim()
                    ? keyStatus.groq.message || 'Configured'
                    : 'Missing'}
                </span>
              </div>
              <p className="text-[11px] text-[#A1A1AA] mb-3">
                <strong className="text-[#E4E4E7]">Role:</strong> Ultra-Fast Winning Score Calculation, Unit Economics, Profit Breakdown & Viral Ad Hooks.
              </p>
              <input
                type="password"
                value={apiKeys.groq}
                onChange={(e) => setApiKeys((prev) => ({ ...prev, groq: e.target.value }))}
                placeholder="gsk_... (Groq Cloud API Key)"
                className="w-full px-3 py-2 bg-[#141418] border border-[#232329] focus:border-[#3B82F6] focus:outline-none text-xs font-mono text-white"
              />
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-[#71717A]">
              <span>Model: llama-3.3-70b-versatile</span>
              <span>Hint: Starts with gsk_...</span>
            </div>
          </div>

          {/* 3. OPENROUTER COUNCIL CARD */}
          <div className="bg-[#0A0A0C] border border-[#232329] p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#F59E0B]" />
                  3. OpenRouter API Key
                </span>
                <span
                  className={`text-[10px] font-mono uppercase px-1.5 py-0.5 border ${
                    apiKeys.openrouter?.trim()
                      ? keyStatus.openrouter.status === 'error'
                        ? 'border-[#EF4444] text-[#EF4444]'
                        : 'border-[#10B981] text-[#10B981]'
                      : 'border-[#232329] text-[#71717A]'
                  }`}
                >
                  {apiKeys.openrouter?.trim()
                    ? keyStatus.openrouter.message || 'Configured'
                    : 'Missing'}
                </span>
              </div>
              <p className="text-[11px] text-[#A1A1AA] mb-2">
                <strong className="text-[#E4E4E7]">Role:</strong> Ruthless Skeptic Verification Council, Saturation Traps & Supplier MOQ Negotiation.
              </p>
              <div className="space-y-2">
                <input
                  type="password"
                  value={apiKeys.openrouter}
                  onChange={(e) => setApiKeys((prev) => ({ ...prev, openrouter: e.target.value }))}
                  placeholder="sk-or-v1-... (OpenRouter Key)"
                  className="w-full px-3 py-2 bg-[#141418] border border-[#232329] focus:border-[#3B82F6] focus:outline-none text-xs font-mono text-white"
                />
                <select
                  value={apiKeys.openrouterModel}
                  onChange={(e) => setApiKeys((prev) => ({ ...prev, openrouterModel: e.target.value }))}
                  className="w-full px-2.5 py-1.5 bg-[#141418] border border-[#232329] text-[11px] font-mono text-[#E4E4E7] focus:outline-none"
                >
                  {OPENROUTER_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-[#71717A]">
              <span>Auto-fallback enabled</span>
              <span>Hint: Starts with sk-or-...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
