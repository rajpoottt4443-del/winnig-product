import React, { useRef, useEffect } from 'react';
import { Terminal, ChevronUp, ChevronDown } from 'lucide-react';
import { TerminalLog, ScrapedSignal } from '../types';

interface TerminalDrawerProps {
  terminalLogs: TerminalLog[];
  isHunting: boolean;
  isTerminalOpen: boolean;
  setIsTerminalOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  scrapedSignals: ScrapedSignal[];
}

export const TerminalDrawer: React.FC<TerminalDrawerProps> = ({
  terminalLogs,
  isHunting,
  isTerminalOpen,
  setIsTerminalOpen,
  scrapedSignals
}) => {
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTerminalOpen && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs, isTerminalOpen]);

  return (
    <section className="bg-[#141418] border border-[#232329]">
      <div
        onClick={() => setIsTerminalOpen((prev) => !prev)}
        className="px-4 py-2.5 bg-[#0A0A0C] border-b border-[#232329] flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-[#10B981]" />
          <span className="text-xs font-mono uppercase font-bold tracking-wider text-white">
            Multi-AI Execution Pipeline Telemetry
          </span>
          {isHunting && (
            <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-[#3B82F6]/20 border border-[#3B82F6] text-[#3B82F6] animate-pulse">
              RUNNING PARALLEL QUERIES...
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-[#71717A]">
          <span>{terminalLogs.length} events</span>
          {scrapedSignals.length > 0 && (
            <span className="text-[#10B981]">{scrapedSignals.length} live signals</span>
          )}
          {isTerminalOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {isTerminalOpen && (
        <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Terminal Log Output (8 cols) */}
          <div className="lg:col-span-8 bg-[#0A0A0C] border border-[#232329] p-3 max-h-48 overflow-y-auto font-mono text-xs space-y-1.5">
            {terminalLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                <span className="text-[#52525B] shrink-0">[{log.timestamp}]</span>
                <span
                  className={`shrink-0 font-bold ${
                    log.status === 'success'
                      ? 'text-[#10B981]'
                      : log.status === 'warn'
                      ? 'text-[#F59E0B]'
                      : log.status === 'error'
                      ? 'text-[#EF4444]'
                      : 'text-[#3B82F6]'
                  }`}
                >
                  [{log.engine}]
                </span>
                <span className="text-[#E4E4E7] break-words">{log.message}</span>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Live Scraped Web Signals Feed (4 cols) */}
          <div className="lg:col-span-4 bg-[#0A0A0C] border border-[#232329] p-3 max-h-48 overflow-y-auto">
            <div className="text-[10px] font-mono uppercase text-[#A1A1AA] mb-2 flex items-center justify-between">
              <span>Scraped Community Signals (Reddit / HN)</span>
              <span className="text-[#10B981]">{scrapedSignals.length} hits</span>
            </div>
            {scrapedSignals.length === 0 ? (
              <div className="text-xs text-[#71717A] font-mono py-4 text-center">
                {isHunting
                  ? 'Fetching live JSON feeds...'
                  : 'No external forum signals cached for this run.'}
              </div>
            ) : (
              <div className="space-y-2">
                {scrapedSignals.map((sig, i) => (
                  <div key={i} className="border-b border-[#232329] pb-1.5 last:border-b-0">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[#3B82F6]">{sig.source}</span>
                      <span className="text-[#71717A]">{sig.engagement}</span>
                    </div>
                    <div className="text-xs text-[#E4E4E7] line-clamp-1 mt-0.5">{sig.title}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
