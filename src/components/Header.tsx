import React from 'react';
import { Cpu, Key, LayoutGrid, Table as TableIcon, Bookmark, FileSpreadsheet, FileJson, ChevronUp, ChevronDown } from 'lucide-react';
import { ApiKeys, KeyStatusState, ViewMode } from '../types';

interface HeaderProps {
  apiKeys: ApiKeys;
  keyStatus: KeyStatusState;
  isConfigOpen: boolean;
  setIsConfigOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
  savedCount: number;
  onExportCSV: () => void;
  onExportJSON: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  apiKeys,
  keyStatus,
  isConfigOpen,
  setIsConfigOpen,
  activeView,
  setActiveView,
  savedCount,
  onExportCSV,
  onExportJSON
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0A0A0C] border-b border-[#232329]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#3B82F6] flex items-center justify-center border border-[#60A5FA]">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-sm sm:text-base text-white uppercase">
                TRIPLE-AI PRODUCT HUNTER
              </span>
              <span className="hidden md:inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 bg-[#141418] border border-[#232329] text-[#10B981]">
                LIVE ENGINE v3.4
              </span>
            </div>
            <p className="text-[11px] text-[#71717A] hidden sm:block">
              Multi-LLM E-Commerce Intelligence · Gemini 2.5 + Groq Llama 3.3 + OpenRouter Council
            </p>
          </div>
        </div>

        {/* Engine Status & View Switchers */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Engine Status Trigger */}
          <button
            onClick={() => setIsConfigOpen((prev) => !prev)}
            className="flex items-center gap-2.5 px-3 py-1.5 bg-[#141418] hover:bg-[#1C1C22] border border-[#232329] text-xs transition-colors cursor-pointer"
            title="Configure Triple-AI API Keys"
          >
            <Key className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span className="font-semibold text-white hidden xl:inline">API ENGINES:</span>

            {/* Gemini Pill */}
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <span
                className={`w-2 h-2 ${
                  apiKeys.gemini?.trim()
                    ? keyStatus.gemini.status === 'error'
                      ? 'bg-[#EF4444]'
                      : 'bg-[#10B981]'
                    : 'bg-[#52525B]'
                }`}
              />
              <span className={apiKeys.gemini?.trim() ? 'text-white' : 'text-[#71717A]'}>GEMINI</span>
            </span>

            <span className="text-[#232329]">|</span>

            {/* Groq Pill */}
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <span
                className={`w-2 h-2 ${
                  apiKeys.groq?.trim()
                    ? keyStatus.groq.status === 'error'
                      ? 'bg-[#EF4444]'
                      : 'bg-[#10B981]'
                    : 'bg-[#52525B]'
                }`}
              />
              <span className={apiKeys.groq?.trim() ? 'text-white' : 'text-[#71717A]'}>GROQ</span>
            </span>

            <span className="text-[#232329]">|</span>

            {/* OpenRouter Pill */}
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <span
                className={`w-2 h-2 ${
                  apiKeys.openrouter?.trim()
                    ? keyStatus.openrouter.status === 'error'
                      ? 'bg-[#EF4444]'
                      : 'bg-[#10B981]'
                    : 'bg-[#52525B]'
                }`}
              />
              <span className={apiKeys.openrouter?.trim() ? 'text-white' : 'text-[#71717A]'}>
                OPENROUTER
              </span>
            </span>

            {isConfigOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-[#A1A1AA]" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-[#A1A1AA]" />
            )}
          </button>

          {/* View Switcher */}
          <div className="flex items-center bg-[#141418] border border-[#232329]">
            <button
              onClick={() => setActiveView('grid')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                activeView === 'grid'
                  ? 'bg-[#3B82F6] text-white'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
              title="Product Card Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Grid</span>
            </button>
            <button
              onClick={() => setActiveView('matrix')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium border-l border-[#232329] transition-colors cursor-pointer ${
                activeView === 'matrix'
                  ? 'bg-[#3B82F6] text-white'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
              title="Comparison Matrix Table"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Matrix</span>
            </button>
            <button
              onClick={() => setActiveView('saved')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium border-l border-[#232329] transition-colors cursor-pointer ${
                activeView === 'saved'
                  ? 'bg-[#3B82F6] text-white'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
              title="Saved Winners Vault"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Saved</span>
              <span className="px-1.5 py-0.2 bg-[#0A0A0C] text-[10px] font-mono text-[#10B981] border border-[#232329]">
                {savedCount}
              </span>
            </button>
          </div>

          {/* Export Buttons */}
          <button
            onClick={onExportCSV}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#141418] hover:bg-[#1C1C22] border border-[#232329] text-xs text-[#E4E4E7] transition-colors cursor-pointer"
            title="Export Research Report as CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="hidden lg:inline">CSV</span>
          </button>
          <button
            onClick={onExportJSON}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#141418] hover:bg-[#1C1C22] border border-[#232329] text-xs text-[#E4E4E7] transition-colors cursor-pointer"
            title="Export Raw JSON Data"
          >
            <FileJson className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span className="hidden lg:inline">JSON</span>
          </button>
        </div>
      </div>
    </header>
  );
};
