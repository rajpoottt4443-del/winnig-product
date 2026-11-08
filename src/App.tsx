import React, { useState, useEffect, useMemo } from 'react';
import { Layers, Play, Key } from 'lucide-react';
import {
  Product,
  ApiKeys,
  KeyStatusState,
  TerminalLog,
  ScrapedSignal,
  ToastMessage,
  ViewMode,
  SortOption,
  VerdictFilterOption,
  DrawerTab
} from './types';
import { INITIAL_SEED_PRODUCTS } from './data/presetData';
import { extractAndParseJSON } from './utils/jsonParser';
import { exportToCSV, exportToJSON } from './utils/export';
import {
  callGeminiAPI,
  callGroqAPI,
  callOpenRouterAPI,
  executeEngineTask,
  generateSynthesizedFallback
} from './services/aiEngines';
import { fetchLiveWebSignals } from './services/scraper';
import { Header } from './components/Header';
import { ApiConfigDrawer } from './components/ApiConfigDrawer';
import { HuntControlBar } from './components/HuntControlBar';
import { TerminalDrawer } from './components/TerminalDrawer';
import { FilterBar } from './components/FilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductMatrixTable } from './components/ProductMatrixTable';
import { ProductDeepDiveDrawer } from './components/ProductDeepDiveDrawer';
import { ToastContainer } from './components/ToastContainer';

export default function App() {
  // --------------------------------------------------------------------------
  // 1. API KEYS & PERSISTENCE
  // --------------------------------------------------------------------------
  const [apiKeys, setApiKeys] = useState<ApiKeys>(() => {
    try {
      const saved = localStorage.getItem('wph_triple_api_keys_v1');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return {
      gemini: '',
      groq: '',
      openrouter: '',
      openrouterModel: 'meta-llama/llama-3.3-70b-instruct'
    };
  });

  const [keyStatus, setKeyStatus] = useState<KeyStatusState>({
    gemini: { status: 'untested', latency: null, message: '' },
    groq: { status: 'untested', latency: null, message: '' },
    openrouter: { status: 'untested', latency: null, message: '' }
  });

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isTestingKeys, setIsTestingKeys] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('wph_triple_api_keys_v1', JSON.stringify(apiKeys));
    } catch (_) {}
  }, [apiKeys]);

  const activeEngines = useMemo(() => {
    const list: ('gemini' | 'groq' | 'openrouter')[] = [];
    if (apiKeys.gemini?.trim()) list.push('gemini');
    if (apiKeys.groq?.trim()) list.push('groq');
    if (apiKeys.openrouter?.trim()) list.push('openrouter');
    return list;
  }, [apiKeys]);

  // --------------------------------------------------------------------------
  // 2. HUNTING PARAMETERS & STATE
  // --------------------------------------------------------------------------
  const [niche, setNiche] = useState('Smart Kitchen Gadgets');
  const [targetMarket, setTargetMarket] = useState('USA');
  const [budgetTier, setBudgetTier] = useState('Mid Ticket ($20-$60)');
  const [huntMode, setHuntMode] = useState<'live_scraper' | 'ai_deep_synthesis'>('live_scraper');
  const [customSignals, setCustomSignals] = useState('');
  const [showCustomSignalsInput, setShowCustomSignalsInput] = useState(false);

  const [isHunting, setIsHunting] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([]);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [scrapedSignals, setScrapedSignals] = useState<ScrapedSignal[]>([]);

  // Seed with initial products if first time, or load from cache
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const cached = localStorage.getItem('wph_last_hunt_products_v1');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return INITIAL_SEED_PRODUCTS;
  });

  const [savedWinners, setSavedWinners] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('wph_saved_winners_v1');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  // UI Navigation, Sorting, Filtering & Deep-Dive Drawer
  const [activeView, setActiveView] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('winningScore');
  const [verdictFilter, setVerdictFilter] = useState<VerdictFilterOption>('ALL');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [drawerTab, setDrawerTab] = useState<DrawerTab>('calculator');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('wph_last_hunt_products_v1', JSON.stringify(products));
    } catch (_) {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('wph_saved_winners_v1', JSON.stringify(savedWinners));
    } catch (_) {}
  }, [savedWinners]);

  // --------------------------------------------------------------------------
  // 3. TOAST & LOG UTILITIES
  // --------------------------------------------------------------------------
  const addToast = (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'error'
  ) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6500);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const appendLog = (
    engine: string,
    message: string,
    status: 'info' | 'success' | 'warn' | 'error' = 'info',
    latency: number | null = null
  ) => {
    const timestamp = new Date().toLocaleTimeString([], {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    setTerminalLogs((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), timestamp, engine, message, status, latency }
    ]);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // --------------------------------------------------------------------------
  // 4. API CONNECTION PING TESTER
  // --------------------------------------------------------------------------
  const testActiveConnections = async () => {
    if (activeEngines.length === 0) {
      addToast(
        'No API Keys Entered',
        'Please enter at least one valid API key (Gemini, Groq, or OpenRouter) to test connections.',
        'warning'
      );
      return;
    }

    setIsTestingKeys(true);
    const pingSystem = 'You are an API health check responder. Return strictly JSON: {"ok": true}';
    const pingUser = 'Ping status check. Return {"ok": true}';

    const nextStatus = { ...keyStatus };
    const tasks: Promise<any>[] = [];

    if (apiKeys.gemini?.trim()) {
      nextStatus.gemini = { status: 'testing', latency: null, message: 'Pinging endpoint...' };
      tasks.push(
        callGeminiAPI(apiKeys.gemini, pingSystem, pingUser)
          .then((res) => {
            nextStatus.gemini = {
              status: 'connected',
              latency: res.latency,
              message: `Verified (${res.latency}ms)`
            };
          })
          .catch((err) => {
            nextStatus.gemini = {
              status: 'error',
              latency: null,
              message: err.message
            };
            addToast('Gemini Key Validation Failed', err.message, 'error');
          })
      );
    } else {
      nextStatus.gemini = { status: 'missing', latency: null, message: 'No key provided' };
    }

    if (apiKeys.groq?.trim()) {
      nextStatus.groq = { status: 'testing', latency: null, message: 'Pinging endpoint...' };
      tasks.push(
        callGroqAPI(apiKeys.groq, pingSystem, pingUser)
          .then((res) => {
            nextStatus.groq = {
              status: 'connected',
              latency: res.latency,
              message: `Verified (${res.latency}ms)`
            };
          })
          .catch((err) => {
            nextStatus.groq = {
              status: 'error',
              latency: null,
              message: err.message
            };
            addToast('Groq Key Validation Failed', err.message, 'error');
          })
      );
    } else {
      nextStatus.groq = { status: 'missing', latency: null, message: 'No key provided' };
    }

    if (apiKeys.openrouter?.trim()) {
      nextStatus.openrouter = { status: 'testing', latency: null, message: 'Pinging endpoint...' };
      tasks.push(
        callOpenRouterAPI(apiKeys.openrouter, apiKeys.openrouterModel, pingSystem, pingUser)
          .then((res) => {
            nextStatus.openrouter = {
              status: 'connected',
              latency: res.latency,
              message: `Verified (${res.latency}ms)`
            };
          })
          .catch((err) => {
            nextStatus.openrouter = {
              status: 'error',
              latency: null,
              message: err.message
            };
            addToast('OpenRouter Key Validation Failed', err.message, 'error');
          })
      );
    } else {
      nextStatus.openrouter = { status: 'missing', latency: null, message: 'No key provided' };
    }

    setKeyStatus({ ...nextStatus });
    await Promise.allSettled(tasks);
    setKeyStatus({ ...nextStatus });
    setIsTestingKeys(false);

    const connectedCount = Object.values(nextStatus).filter((s) => s.status === 'connected').length;
    if (connectedCount > 0) {
      addToast(
        'Connection Test Complete',
        `${connectedCount} of ${activeEngines.length} configured AI engine(s) responded with valid JSON.`,
        'success'
      );
    }
  };

  // --------------------------------------------------------------------------
  // 5. TRIPLE-AI HUNTING PIPELINE
  // --------------------------------------------------------------------------
  const handleHuntProducts = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!niche.trim()) {
      addToast('Missing Niche / Keyword', 'Please enter a product niche or select a preset chip.', 'warning');
      return;
    }

    // If user has not configured any keys yet, provide intuitive option:
    if (activeEngines.length === 0) {
      setIsHunting(true);
      setIsTerminalOpen(true);
      setTerminalLogs([]);
      setActiveView('grid');

      appendLog(
        'SYSTEM',
        `No live API keys detected in local storage. Running High-Fidelity Demo Synthesis for "${niche}"...`,
        'warn'
      );
      appendLog(
        'NOTICE',
        'To connect live Gemini 2.5 Flash, Groq LPU, and OpenRouter, enter your keys in the top drawer anytime.',
        'info'
      );

      // Scrape web signals or simulate
      const signals = await fetchLiveWebSignals(niche, huntMode, customSignals, appendLog);
      setScrapedSignals(signals);

      await new Promise((r) => setTimeout(r, 650));
      appendLog('DEMO_PIPELINE', 'Synthesizing market trend depth and search velocity...', 'info');
      await new Promise((r) => setTimeout(r, 600));
      appendLog('DEMO_PIPELINE', 'Calculating unit economics, COGS, and viral TikTok hooks...', 'info');
      await new Promise((r) => setTimeout(r, 550));
      appendLog('DEMO_PIPELINE', 'Convening skeptic council for saturation traps and supplier MOQ...', 'info');

      const demoResults = generateSynthesizedFallback(niche, targetMarket, budgetTier);
      setProducts(demoResults);
      appendLog('PIPELINE_COMPLETE', `Generated ${demoResults.length} winning product dossiers.`, 'success');
      setIsHunting(false);
      addToast(
        'Showcase Products Generated',
        `Synthesized 2 winning candidate dossiers for "${niche}". Enter your keys above to run the live multi-LLM engine.`,
        'success'
      );
      return;
    }

    // LIVE PIPELINE WITH USER-CONFIGURED KEYS
    setIsHunting(true);
    setIsTerminalOpen(true);
    setTerminalLogs([]);
    setActiveView('grid');

    appendLog(
      'SYSTEM',
      `Initializing Triple-AI Product Hunter for niche: "${niche}" | Market: ${targetMarket} | Tier: ${budgetTier}`,
      'info'
    );
    appendLog(
      'SYSTEM',
      `Active Engines Detected: [${activeEngines.map((eng) => eng.toUpperCase()).join(', ')}] (${
        activeEngines.length === 3
          ? 'Full Triple-Engine Parallel Mode'
          : 'Dynamic Task Redistribution Mode'
      })`,
      'info'
    );

    try {
      // PHASE 0: LIVE SIGNAL SCRAPING
      const signals = await fetchLiveWebSignals(niche, huntMode, customSignals, appendLog);
      setScrapedSignals(signals);

      const signalsContext =
        signals.length > 0
          ? `LIVE SCRAPED WEB & CONSUMER SIGNALS:\n` +
            signals.map((s, idx) => `${idx + 1}. [${s.source}] ${s.title} (${s.engagement})`).join('\n')
          : 'No external forum threads matched; synthesize from current search & e-commerce velocity trends.';

      // PHASE 1: BASE PRODUCT DISCOVERY
      appendLog(
        'PHASE_1',
        'Generating 6 specific, physical e-commerce products with real market demand signals...',
        'info'
      );

      const discoverySystemPrompt = `You are an elite E-Commerce Product Researcher & Trend Analyst.
Generate exactly 6 specific, physical, shippable e-commerce/dropshipping/wholesale products for the user's niche, target market, and price tier.
Avoid vague generic names (e.g. instead of "Kitchen Knife", specify "Magnetic Self-Sharpening Bamboo Knife Block with LED UV Sanitizer").
Return strictly a JSON object matching this exact schema:
{
  "products": [
    {
      "id": "prod_1",
      "name": "Specific Product Name",
      "category": "Sub-Category Name",
      "tagline": "One-sentence value proposition",
      "problemSolved": "Specific painful consumer problem this solves immediately"
    }
  ]
}`;

      const discoveryUserPrompt = `Niche/Keyword: "${niche}"
Target Market: ${targetMarket}
Price Tier: ${budgetTier}
${signalsContext}

Identify 6 specific physical products with breakout potential right now. Output strictly valid JSON.`;

      const discoveryRes = await executeEngineTask(
        'gemini',
        activeEngines,
        apiKeys,
        discoverySystemPrompt,
        discoveryUserPrompt,
        (msg) => appendLog('ROUTER', msg, 'warn')
      );

      const discoveryParsed = extractAndParseJSON<{ products: any[] }>(discoveryRes.text);
      const baseProducts = Array.isArray(discoveryParsed?.products)
        ? discoveryParsed.products.slice(0, 6)
        : [];

      if (baseProducts.length === 0) {
        throw new Error('Phase 1 Discovery returned an empty product list.');
      }

      appendLog(
        'PHASE_1',
        `Discovered ${baseProducts.length} candidate products via ${discoveryRes.provider} in ${discoveryRes.latency}ms.`,
        'success',
        discoveryRes.latency
      );

      const productRosterJSON = JSON.stringify(
        baseProducts.map((p, i) => ({
          id: p.id || `prod_${i + 1}`,
          name: p.name,
          category: p.category,
          problemSolved: p.problemSolved
        }))
      );

      // PHASE 2: PARALLEL TRIPLE-AI DEEP ANALYSIS
      appendLog(
        'PHASE_2',
        'Launching parallel Triple-AI analysis: [Role 1: Market & Saturation] + [Role 2: Quant & Viral Hooks] + [Role 3: Ruthless Skeptic Council]...',
        'info'
      );

      const geminiRoleSystem = `You are Role A: Deep Market Trend & Search Intent Analyst.
Analyze every product in the provided list for the ${targetMarket} market (${budgetTier}).
Return strictly valid JSON with this exact root key "marketAnalysis" containing an array of objects:
{
  "marketAnalysis": [
    {
      "id": "prod_1",
      "demandScore": 84,
      "saturationScore": 42,
      "searchIntent": "High transactional intent driven by...",
      "targetDemographics": "Women & homeowners aged 24-45 who...",
      "trendTrajectory": "Rising Q3/Q4 breakout velocity...",
      "geminiInsight": "Detailed 2-sentence analytical thesis on market depth and search volume."
    }
  ]
}`;

      const groqRoleSystem = `You are Role B: Quantitative Unit Economics & Viral Growth Hacker.
For every product in the provided list (${budgetTier} in ${targetMarket}), calculate realistic sourcing cost (Alibaba/1688 landed COGS in USD), recommended retail selling price (USD), estimated CPA (Customer Acquisition Cost in USD), shipping cost (USD), winning score (0-100), viral wow factor (1-10), 3 scroll-stopping TikTok/Meta video ad hooks, primary ad copy, visual creative angle, and 4 target interest stacks.
Return strictly valid JSON with this exact root key "quantAnalysis":
{
  "quantAnalysis": [
    {
      "id": "prod_1",
      "winningScore": 88,
      "sourcingCost": 7.50,
      "sellingPrice": 39.99,
      "estimatedShipping": 4.50,
      "estimatedCPA": 12.00,
      "netProfitMargin": 39,
      "viralFactor": 8.7,
      "adHooks": [
        "Hook 1: Stop doing [painful task] the hard way...",
        "Hook 2: I tested the viral [product] so you don't have to...",
        "Hook 3: Why 40,000 households in ${targetMarket} switched to this..."
      ],
      "primaryAdCopy": "Compelling direct-response Meta/TikTok ad body text...",
      "creativeBlueprint": "First 3 seconds visual demonstration instruction...",
      "targetInterests": ["Interest 1", "Interest 2", "Interest 3", "Interest 4"],
      "groqInsight": "Quantitative breakdown of why the margin and viral thumb-stop rate work."
    }
  ]
}`;

      const openRouterRoleSystem = `You are Role C: The Ruthless E-Commerce Skeptic & Sourcing Council.
Your job is to challenge hype, expose hidden saturation traps, quality/return rate risks, seasonal pitfalls, and provide concrete Alibaba/supplier negotiation tactics (MOQ, custom packaging, private label angles).
Assign each product a strict Final Verdict from ONLY these three exact strings:
"MUST LAUNCH", "TEST WITH CAUTION", or "SATURATED - AVOID".
Return strictly valid JSON with this exact root key "skepticAnalysis":
{
  "skepticAnalysis": [
    {
      "id": "prod_1",
      "verdict": "MUST LAUNCH",
      "saturationRisk": "Medium — generic versions exist on Amazon, requires custom bundle...",
      "seasonalTrap": "Evergreen year-round demand with Q4 gifting spike.",
      "returnRateRisk": "Low defect rate if food-grade silicone certification is verified.",
      "supplierNegotiationAngle": "Request MOQ 100 custom color box + laser logo at $0.35/unit extra.",
      "openRouterInsight": "Brutally honest devil's advocate verdict on whether a media buyer will profit or burn cash."
    }
  ]
}`;

      const sharedAnalysisUserPrompt = `Analyze these 6 candidate products for Niche: "${niche}", Target Market: "${targetMarket}", Budget Tier: "${budgetTier}".
Candidate Products JSON:
${productRosterJSON}

${signalsContext}

Return strictly valid JSON matching your assigned schema for all 6 product IDs.`;

      const [geminiSettled, groqSettled, openRouterSettled] = await Promise.allSettled([
        executeEngineTask('gemini', activeEngines, apiKeys, geminiRoleSystem, sharedAnalysisUserPrompt),
        executeEngineTask('groq', activeEngines, apiKeys, groqRoleSystem, sharedAnalysisUserPrompt),
        executeEngineTask('openrouter', activeEngines, apiKeys, openRouterRoleSystem, sharedAnalysisUserPrompt)
      ]);

      const marketMap: Record<string, any> = {};
      const quantMap: Record<string, any> = {};
      const skepticMap: Record<string, any> = {};

      let marketProvider = 'Unassigned';
      let quantProvider = 'Unassigned';
      let skepticProvider = 'Unassigned';

      if (geminiSettled.status === 'fulfilled') {
        marketProvider = geminiSettled.value.provider;
        appendLog(
          'ENGINE_A (MARKET)',
          `Market Trend & Saturation matrix completed via ${marketProvider} (${geminiSettled.value.latency}ms).`,
          'success',
          geminiSettled.value.latency
        );
        try {
          const parsed: any = extractAndParseJSON(geminiSettled.value.text);
          const arr = parsed?.marketAnalysis || parsed?.products || (Array.isArray(parsed) ? parsed : []);
          arr.forEach((item: any, idx: number) => {
            const key = item.id || `prod_${idx + 1}`;
            marketMap[key] = item;
          });
        } catch (parseErr: any) {
          appendLog('ENGINE_A (MARKET)', `JSON Parse Warning: ${parseErr.message}`, 'warn');
        }
      } else {
        appendLog('ENGINE_A (MARKET)', `Failed: ${geminiSettled.reason?.message}`, 'error');
        addToast('Market Analysis Engine Error', geminiSettled.reason?.message || 'Request failed', 'error');
      }

      if (groqSettled.status === 'fulfilled') {
        quantProvider = groqSettled.value.provider;
        appendLog(
          'ENGINE_B (QUANT)',
          `Winning Score, Unit Economics & Ad Hooks calculated via ${quantProvider} (${groqSettled.value.latency}ms).`,
          'success',
          groqSettled.value.latency
        );
        try {
          const parsed: any = extractAndParseJSON(groqSettled.value.text);
          const arr = parsed?.quantAnalysis || parsed?.products || (Array.isArray(parsed) ? parsed : []);
          arr.forEach((item: any, idx: number) => {
            const key = item.id || `prod_${idx + 1}`;
            quantMap[key] = item;
          });
        } catch (parseErr: any) {
          appendLog('ENGINE_B (QUANT)', `JSON Parse Warning: ${parseErr.message}`, 'warn');
        }
      } else {
        appendLog('ENGINE_B (QUANT)', `Failed: ${groqSettled.reason?.message}`, 'error');
        addToast('Quant Scoring Engine Error', groqSettled.reason?.message || 'Request failed', 'error');
      }

      if (openRouterSettled.status === 'fulfilled') {
        skepticProvider = openRouterSettled.value.provider;
        appendLog(
          'ENGINE_C (COUNCIL)',
          `Ruthless Skeptic verification & sourcing audit completed via ${skepticProvider} (${openRouterSettled.value.latency}ms).`,
          'success',
          openRouterSettled.value.latency
        );
        try {
          const parsed: any = extractAndParseJSON(openRouterSettled.value.text);
          const arr = parsed?.skepticAnalysis || parsed?.products || (Array.isArray(parsed) ? parsed : []);
          arr.forEach((item: any, idx: number) => {
            const key = item.id || `prod_${idx + 1}`;
            skepticMap[key] = item;
          });
        } catch (parseErr: any) {
          appendLog('ENGINE_C (COUNCIL)', `JSON Parse Warning: ${parseErr.message}`, 'warn');
        }
      } else {
        appendLog('ENGINE_C (COUNCIL)', `Failed: ${openRouterSettled.reason?.message}`, 'error');
        addToast('Skeptic Council Engine Error', openRouterSettled.reason?.message || 'Request failed', 'error');
      }

      // SYNTHESIZE ALL 3 PERSPECTIVES
      const synthesizedProducts: Product[] = baseProducts.map((base, idx) => {
        const pid = base.id || `prod_${idx + 1}`;
        const m = marketMap[pid] || Object.values(marketMap)[idx] || {};
        const q = quantMap[pid] || Object.values(quantMap)[idx] || {};
        const s = skepticMap[pid] || Object.values(skepticMap)[idx] || {};

        const sourcingCost = Number(q.sourcingCost) > 0 ? Number(q.sourcingCost) : 8.5;
        const sellingPrice = Number(q.sellingPrice) > sourcingCost ? Number(q.sellingPrice) : 34.99;
        const estimatedShipping = Number(q.estimatedShipping) >= 0 ? Number(q.estimatedShipping) : 4.0;
        const estimatedCPA = Number(q.estimatedCPA) >= 0 ? Number(q.estimatedCPA) : 11.0;

        const netDollar = sellingPrice - sourcingCost - estimatedShipping - estimatedCPA - sellingPrice * 0.029;
        const calculatedMargin = Math.round((netDollar / sellingPrice) * 100);
        const netProfitMargin =
          typeof q.netProfitMargin === 'number' && !isNaN(q.netProfitMargin)
            ? Math.round(q.netProfitMargin)
            : Math.max(8, calculatedMargin);

        const rawVerdict = String(s.verdict || '').toUpperCase();
        let normalizedVerdict: 'MUST LAUNCH' | 'TEST WITH CAUTION' | 'SATURATED - AVOID' = 'TEST WITH CAUTION';
        if (rawVerdict.includes('MUST') || rawVerdict.includes('LAUNCH')) {
          normalizedVerdict = 'MUST LAUNCH';
        } else if (rawVerdict.includes('AVOID') || rawVerdict.includes('SATURATED')) {
          normalizedVerdict = 'SATURATED - AVOID';
        }

        const demandScore = Math.min(100, Math.max(15, Number(m.demandScore) || 78));
        const saturationScore = Math.min(100, Math.max(10, Number(m.saturationScore) || 45));
        const winningScore = Math.min(100, Math.max(20, Number(q.winningScore) || 82));
        const viralFactor = Math.min(10, Math.max(1, Number(q.viralFactor) || 8.1));

        return {
          id: `${pid}_${Date.now()}`,
          name: base.name || `Winning Candidate #${idx + 1}`,
          category: base.category || niche,
          tagline: base.tagline || base.problemSolved || '',
          problemSolved: base.problemSolved || 'Solves daily consumer friction with high perceived value.',
          niche,
          targetMarket,
          budgetTier,
          huntedAt: new Date().toISOString(),

          winningScore,
          demandScore,
          saturationScore,
          viralFactor,

          sourcingCost,
          sellingPrice,
          estimatedShipping,
          estimatedCPA,
          netProfitMargin,

          searchIntent: m.searchIntent || 'Strong commercial buyer intent on social & search.',
          targetDemographics: m.targetDemographics || `Core ${targetMarket} online shoppers aged 22-50.`,
          trendTrajectory: m.trendTrajectory || 'Sustained upward search momentum.',
          geminiInsight:
            m.geminiInsight ||
            'Strong problem-solving utility combined with visual demonstration potential.',
          marketProvider,

          adHooks:
            Array.isArray(q.adHooks) && q.adHooks.length > 0
              ? q.adHooks
              : [
                  `Stop wasting time with outdated ${niche.toLowerCase()} tools — watch how this works in 5 seconds.`,
                  `Why everyone in ${targetMarket} is replacing their old setup with the ${base.name}.`,
                  `I tested the most talked-about ${base.name} to see if it actually lives up to the hype.`
                ],
          primaryAdCopy:
            q.primaryAdCopy ||
            `Tired of dealing with ${base.problemSolved?.toLowerCase() || 'everyday hassle'}? Meet the ${base.name} — engineered for instant results.`,
          creativeBlueprint:
            q.creativeBlueprint ||
            'Split-screen comparison showing old frustrating method vs 3-second transformation using the product.',
          targetInterests:
            Array.isArray(q.targetInterests) && q.targetInterests.length > 0
              ? q.targetInterests
              : [niche, 'Online Shopping', 'Gadgets & Innovations', 'Home Improvement'],
          groqInsight:
            q.groqInsight ||
            'Healthy gross markup supports paid social customer acquisition with room for bundle AOV expansion.',
          quantProvider,

          verdict: normalizedVerdict,
          saturationRisk:
            s.saturationRisk ||
            'Moderate competition; differentiate via custom landing page offer and fast local fulfillment.',
          seasonalTrap: s.seasonalTrap || 'Consistent demand profile across quarters.',
          returnRateRisk: s.returnRateRisk || 'Standard QC inspection advised before bulk shipment.',
          supplierNegotiationAngle:
            s.supplierNegotiationAngle ||
            'Negotiate 15% discount at 300+ units MOQ and request custom branded insert cards.',
          openRouterInsight:
            s.openRouterInsight ||
            'Viable unit economics if creative testing validates a thumb-stop ratio above 28% on TikTok/Reels.',
          skepticProvider
        };
      });

      setProducts(synthesizedProducts);
      appendLog(
        'PIPELINE_COMPLETE',
        `Successfully synthesized ${synthesizedProducts.length} complete winning product dossiers.`,
        'success'
      );
      addToast(
        'Product Hunt Finished',
        `Discovered and scored ${synthesizedProducts.length} winning candidates for "${niche}".`,
        'success'
      );
    } catch (err: any) {
      appendLog('FATAL_ERROR', err.message || 'Pipeline execution failed.', 'error');
      addToast('Hunt Pipeline Error', err.message || 'Check your API keys and network connection.', 'error');
    } finally {
      setIsHunting(false);
    }
  };

  // --------------------------------------------------------------------------
  // 6. BOOKMARKING & EXPORT
  // --------------------------------------------------------------------------
  const isProductSaved = (prod: Product) => {
    return savedWinners.some((item) => item.name === prod.name && item.niche === prod.niche);
  };

  const toggleSaveProduct = (prod: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const exists = isProductSaved(prod);
    if (exists) {
      setSavedWinners((prev) =>
        prev.filter((item) => !(item.name === prod.name && item.niche === prod.niche))
      );
      addToast('Removed from Saved Winners', `"${prod.name}" removed from bookmarks.`, 'info');
    } else {
      setSavedWinners((prev) => [prod, ...prev]);
      addToast('Saved to Winners Vault', `"${prod.name}" bookmarked to localStorage.`, 'success');
    }
  };

  const handleExportCSV = () => {
    const list = activeView === 'saved' ? savedWinners : products;
    if (list.length === 0) {
      addToast('Nothing to Export', 'Run a product hunt or save winning products first.', 'warning');
      return;
    }
    const filename = `winning-products-${niche.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.csv`;
    exportToCSV(list, filename);
    addToast('CSV Export Downloaded', `Exported ${list.length} product research records.`, 'success');
  };

  const handleExportJSON = () => {
    const list = activeView === 'saved' ? savedWinners : products;
    if (list.length === 0) {
      addToast('Nothing to Export', 'Run a product hunt or save winning products first.', 'warning');
      return;
    }
    const filename = `winning-products-report-${Date.now()}.json`;
    exportToJSON(list, filename);
    addToast('JSON Report Downloaded', `Exported full structured JSON for ${list.length} products.`, 'success');
  };

  // --------------------------------------------------------------------------
  // 7. FILTERED & SORTED PRODUCTS
  // --------------------------------------------------------------------------
  const displayedProducts = useMemo(() => {
    const baseList = activeView === 'saved' ? savedWinners : products;
    const filtered = baseList.filter((p) => {
      if (verdictFilter === 'ALL') return true;
      return p.verdict === verdictFilter;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'winningScore') return (b.winningScore || 0) - (a.winningScore || 0);
      if (sortBy === 'profitMargin') return (b.netProfitMargin || 0) - (a.netProfitMargin || 0);
      if (sortBy === 'demandScore') return (b.demandScore || 0) - (a.demandScore || 0);
      if (sortBy === 'viralFactor') return (b.viralFactor || 0) - (a.viralFactor || 0);
      return 0;
    });
  }, [products, savedWinners, activeView, sortBy, verdictFilter]);

  // --------------------------------------------------------------------------
  // 8. RENDER
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F4F4F6] font-sans antialiased selection:bg-[#3B82F6] selection:text-white">
      {/* Floating Actionable Toast Stack */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

      {/* 1. Header Command Bar */}
      <Header
        apiKeys={apiKeys}
        keyStatus={keyStatus}
        isConfigOpen={isConfigOpen}
        setIsConfigOpen={setIsConfigOpen}
        activeView={activeView}
        setActiveView={setActiveView}
        savedCount={savedWinners.length}
        onExportCSV={handleExportCSV}
        onExportJSON={handleExportJSON}
      />

      {/* 2. Collapsible API Configuration Drawer */}
      {isConfigOpen && (
        <ApiConfigDrawer
          apiKeys={apiKeys}
          setApiKeys={setApiKeys}
          keyStatus={keyStatus}
          isTestingKeys={isTestingKeys}
          onTestConnections={testActiveConnections}
          onClose={() => setIsConfigOpen(false)}
        />
      )}

      {/* 3. Main Workspace */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Hunt Control Parameters */}
        <HuntControlBar
          niche={niche}
          setNiche={setNiche}
          targetMarket={targetMarket}
          setTargetMarket={setTargetMarket}
          budgetTier={budgetTier}
          setBudgetTier={setBudgetTier}
          huntMode={huntMode}
          setHuntMode={setHuntMode}
          customSignals={customSignals}
          setCustomSignals={setCustomSignals}
          showCustomSignalsInput={showCustomSignalsInput}
          setShowCustomSignalsInput={setShowCustomSignalsInput}
          isHunting={isHunting}
          onHunt={handleHuntProducts}
        />

        {/* Live Execution Telemetry & Signals Drawer */}
        {(terminalLogs.length > 0 || isHunting) && (
          <TerminalDrawer
            terminalLogs={terminalLogs}
            isHunting={isHunting}
            isTerminalOpen={isTerminalOpen}
            setIsTerminalOpen={setIsTerminalOpen}
            scrapedSignals={scrapedSignals}
          />
        )}

        {/* Filter & Sort Bar */}
        <FilterBar
          activeView={activeView}
          itemCount={displayedProducts.length}
          verdictFilter={verdictFilter}
          setVerdictFilter={setVerdictFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Empty State when no products match */}
        {displayedProducts.length === 0 && !isHunting && (
          <section className="bg-[#141418] border border-[#232329] p-10 text-center max-w-3xl mx-auto my-8">
            <div className="w-12 h-12 bg-[#0A0A0C] border border-[#232329] flex items-center justify-center mx-auto mb-4">
              <Layers className="w-6 h-6 text-[#3B82F6]" />
            </div>
            <h3 className="text-lg font-bold uppercase tracking-wide text-white">
              {activeView === 'saved'
                ? 'Your Saved Winners Vault is Empty'
                : 'No Products Match Selected Filters'}
            </h3>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-2 leading-relaxed max-w-xl mx-auto">
              {activeView === 'saved'
                ? 'Bookmark any analyzed product card to store it permanently in your browser and export custom CSV reports.'
                : 'Try resetting the verdict filter to "ALL" or launch a new hunt for another product niche above.'}
            </p>
            <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
              {activeView === 'saved' ? (
                <button
                  onClick={() => setActiveView('grid')}
                  className="px-5 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  View Analyzed Candidates
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setVerdictFilter('ALL')}
                    className="px-4 py-2 bg-[#0A0A0C] border border-[#232329] text-white text-xs font-mono uppercase hover:border-[#3B82F6] cursor-pointer"
                  >
                    Reset Filter to ALL
                  </button>
                  <button
                    onClick={handleHuntProducts}
                    className="px-5 py-2 bg-[#10B981] hover:bg-[#059669] text-[#0A0A0C] text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4" />
                    Launch Hunt for &ldquo;{niche}&rdquo;
                  </button>
                </>
              )}
            </div>
          </section>
        )}

        {/* Grid View */}
        {(activeView === 'grid' || activeView === 'saved') && displayedProducts.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSaved={isProductSaved(product)}
                onToggleSave={(e) => toggleSaveProduct(product, e)}
                onClick={() => {
                  setSelectedProduct(product);
                  setDrawerTab('calculator');
                }}
              />
            ))}
          </section>
        )}

        {/* Matrix Table View */}
        {activeView === 'matrix' && displayedProducts.length > 0 && (
          <ProductMatrixTable
            products={displayedProducts}
            isProductSaved={isProductSaved}
            onToggleSave={toggleSaveProduct}
            onSelectProduct={(prod) => {
              setSelectedProduct(prod);
              setDrawerTab('calculator');
            }}
          />
        )}
      </main>

      {/* Deep-Dive Slide-Over Drawer */}
      {selectedProduct && (
        <ProductDeepDiveDrawer
          product={selectedProduct}
          activeTab={drawerTab}
          setActiveTab={setDrawerTab}
          onClose={() => setSelectedProduct(null)}
          isSaved={isProductSaved(selectedProduct)}
          onToggleSave={(e) => toggleSaveProduct(selectedProduct, e)}
          onCopy={copyToClipboard}
          copiedId={copiedId}
        />
      )}
    </div>
  );
}
