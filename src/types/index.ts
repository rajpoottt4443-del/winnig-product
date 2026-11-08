export interface Product {
  id: string;
  name: string;
  category: string;
  tagline?: string;
  problemSolved: string;
  niche: string;
  targetMarket: string;
  budgetTier: string;
  huntedAt: string;

  // Quantitative & Predictive Scores
  winningScore: number;
  demandScore: number;
  saturationScore: number;
  viralFactor: number;

  // Unit Economics
  sourcingCost: number;
  sellingPrice: number;
  estimatedShipping: number;
  estimatedCPA: number;
  netProfitMargin: number;

  // Engine A (Gemini) - Market Trend Analysis
  searchIntent: string;
  targetDemographics: string;
  trendTrajectory: string;
  geminiInsight: string;
  marketProvider?: string;

  // Engine B (Groq) - Marketing & Virality Pack
  adHooks: string[];
  primaryAdCopy: string;
  creativeBlueprint: string;
  targetInterests: string[];
  groqInsight: string;
  quantProvider?: string;

  // Engine C (OpenRouter) - Skeptic Council & Sourcing Audit
  verdict: 'MUST LAUNCH' | 'TEST WITH CAUTION' | 'SATURATED - AVOID';
  saturationRisk: string;
  seasonalTrap: string;
  returnRateRisk: string;
  supplierNegotiationAngle: string;
  openRouterInsight: string;
  skepticProvider?: string;
}

export interface ApiKeys {
  gemini: string;
  groq: string;
  openrouter: string;
  openrouterModel: string;
}

export type EngineStatus = 'untested' | 'testing' | 'connected' | 'error' | 'missing';

export interface KeyStatusItem {
  status: EngineStatus;
  latency: number | null;
  message: string;
}

export interface KeyStatusState {
  gemini: KeyStatusItem;
  groq: KeyStatusItem;
  openrouter: KeyStatusItem;
}

export interface TerminalLog {
  id: number;
  timestamp: string;
  engine: string;
  message: string;
  status: 'info' | 'success' | 'warn' | 'error';
  latency?: number | null;
}

export interface ScrapedSignal {
  source: string;
  title: string;
  engagement: string;
}

export interface ToastMessage {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export type ViewMode = 'grid' | 'matrix' | 'saved';
export type SortOption = 'winningScore' | 'profitMargin' | 'demandScore' | 'viralFactor';
export type VerdictFilterOption = 'ALL' | 'MUST LAUNCH' | 'TEST WITH CAUTION' | 'SATURATED - AVOID';
export type DrawerTab = 'calculator' | 'marketing' | 'debate';
