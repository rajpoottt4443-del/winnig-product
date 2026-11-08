import { ApiKeys, Product } from '../types';

export interface EngineResult {
  text: string;
  latency: number;
  provider: string;
}

export async function callGeminiAPI(
  apiKey: string,
  systemInstruction: string,
  userPrompt: string
): Promise<EngineResult> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey.trim())}`;
  const startTime = performance.now();

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }]
        }
      ],
      generationConfig: {
        temperature: 0.35,
        responseMimeType: 'application/json'
      }
    })
  });

  const latency = Math.round(performance.now() - startTime);

  if (!response.ok) {
    let errText = `HTTP ${response.status}`;
    try {
      const errJson = await response.json();
      errText = errJson?.error?.message || errText;
    } catch (_) {}
    throw new Error(`Gemini API Error: ${errText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return { text, latency, provider: 'Google Gemini (gemini-2.5-flash)' };
}

export async function callGroqAPI(
  apiKey: string,
  systemInstruction: string,
  userPrompt: string
): Promise<EngineResult> {
  const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
  const startTime = performance.now();

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey.trim()}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemInstruction + '\nRespond strictly with valid JSON.' },
        { role: 'user', content: userPrompt }
      ]
    })
  });

  const latency = Math.round(performance.now() - startTime);

  if (!response.ok) {
    let errText = `HTTP ${response.status}`;
    try {
      const errJson = await response.json();
      errText = errJson?.error?.message || errText;
    } catch (_) {}
    throw new Error(`Groq API Error: ${errText}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content || '';
  return { text, latency, provider: 'Groq LPU (llama-3.3-70b-versatile)' };
}

export async function callOpenRouterAPI(
  apiKey: string,
  model: string,
  systemInstruction: string,
  userPrompt: string
): Promise<EngineResult> {
  const endpoint = 'https://openrouter.ai/api/v1/chat/completions';
  const startTime = performance.now();
  const chosenModel = model || 'meta-llama/llama-3.3-70b-instruct';

  const makeRequest = async (targetModel: string) => {
    return fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`,
        'HTTP-Referer': window.location.origin || 'https://winning-product-hunter.app',
        'X-Title': 'Triple-AI Winning Product Hunter'
      },
      body: JSON.stringify({
        model: targetModel,
        temperature: 0.35,
        messages: [
          {
            role: 'system',
            content: systemInstruction + '\nIMPORTANT: Return ONLY raw valid JSON without markdown codeblocks.'
          },
          { role: 'user', content: userPrompt }
        ]
      })
    });
  };

  let response = await makeRequest(chosenModel);
  let usedModel = chosenModel;

  if (!response.ok && chosenModel !== 'meta-llama/llama-3.1-8b-instruct') {
    usedModel = 'meta-llama/llama-3.1-8b-instruct';
    response = await makeRequest(usedModel);
  }

  const latency = Math.round(performance.now() - startTime);

  if (!response.ok) {
    let errText = `HTTP ${response.status}`;
    try {
      const errJson = await response.json();
      errText = errJson?.error?.message || errText;
    } catch (_) {}
    throw new Error(`OpenRouter API Error: ${errText}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content || '';
  return { text, latency, provider: `OpenRouter (${usedModel})` };
}

export async function executeEngineTask(
  preferredEngine: 'gemini' | 'groq' | 'openrouter',
  activeEngines: string[],
  apiKeys: ApiKeys,
  systemPrompt: string,
  userPrompt: string,
  logWarning?: (msg: string) => void
): Promise<EngineResult> {
  const priorityOrder = [
    preferredEngine,
    ...(['gemini', 'groq', 'openrouter'] as const).filter((e) => e !== preferredEngine)
  ].filter((engineName) => activeEngines.includes(engineName));

  if (priorityOrder.length === 0) {
    throw new Error('No active API keys configured.');
  }

  let lastError: any = null;

  for (const engine of priorityOrder) {
    try {
      if (engine !== preferredEngine && logWarning) {
        logWarning(
          `Redistributing [${preferredEngine.toUpperCase()}] workload to active engine [${engine.toUpperCase()}]...`
        );
      }
      if (engine === 'gemini') {
        return await callGeminiAPI(apiKeys.gemini, systemPrompt, userPrompt);
      }
      if (engine === 'groq') {
        return await callGroqAPI(apiKeys.groq, systemPrompt, userPrompt);
      }
      if (engine === 'openrouter') {
        return await callOpenRouterAPI(
          apiKeys.openrouter,
          apiKeys.openrouterModel,
          systemPrompt,
          userPrompt
        );
      }
    } catch (err: any) {
      lastError = err;
      if (logWarning) {
        logWarning(`${engine.toUpperCase()}: ${err.message} — trying fallback...`);
      }
    }
  }

  throw lastError || new Error('All configured AI engines failed to respond.');
}

export function generateSynthesizedFallback(
  niche: string,
  targetMarket: string,
  budgetTier: string
): Product[] {
  // Generates fresh domain-specific products if testing demo mode without external API keys
  const sanitizedNiche = niche.trim() || 'Smart Gadgets';
  const timestamp = new Date().toISOString();

  return [
    {
      id: `syn_1_${Date.now()}`,
      name: `Precision Pro Multi-Angle ${sanitizedNiche} Tool with LED Alignment`,
      category: sanitizedNiche,
      tagline: `High-durability engineered alloy with instant ergonomic feedback`,
      problemSolved: `Eliminates slow manual frustration and inaccurate setups in daily ${sanitizedNiche.toLowerCase()} workflows.`,
      niche: sanitizedNiche,
      targetMarket,
      budgetTier,
      huntedAt: timestamp,
      winningScore: 88,
      demandScore: 85,
      saturationScore: 34,
      viralFactor: 8.7,
      sourcingCost: 8.2,
      sellingPrice: 39.99,
      estimatedShipping: 4.5,
      estimatedCPA: 12.0,
      netProfitMargin: 38,
      searchIntent: `High transactional purchase queries across TikTok Shop, Instagram Reels, and Google Shopping.`,
      targetDemographics: `Active buyers aged 24-49 in ${targetMarket} prioritizing efficiency and modern design.`,
      trendTrajectory: `Rising momentum with +95% monthly video discovery velocity.`,
      geminiInsight: `Combines visual high-satisfaction demonstrations with genuine recurring utility.`,
      marketProvider: 'Synthesized Market Trend Model',
      adHooks: [
        `If you still do ${sanitizedNiche.toLowerCase()} the traditional way, watch this 5-second fix.`,
        `Why thousands of buyers in ${targetMarket} are replacing their old equipment with this.`,
        `I tested the most viral ${sanitizedNiche} gadget to see if the hype was real.`
      ],
      primaryAdCopy: `Tired of tedious hassle? Meet the Precision Pro ${sanitizedNiche} — engineered for instant results, durable everyday use, and maximum satisfaction.`,
      creativeBlueprint: `Split-screen comparison: Frustrating traditional technique on left vs smooth 3-second completion on right.`,
      targetInterests: [sanitizedNiche, 'Modern Gadgets', 'Life Hacks', 'Home Improvement'],
      groqInsight: `Healthy $31.79 gross margin spread easily sustains paid acquisition bidding.`,
      quantProvider: 'Synthesized Quant Model',
      verdict: 'MUST LAUNCH',
      saturationRisk: `Low paid social ad density. Differentiate with high-speed local fulfillment and gift bundles.`,
      seasonalTrap: `Consistent year-round demand with peak seasonal gifting spikes.`,
      returnRateRisk: `Under 2.5% when quality control inspection verifies locking mechanisms.`,
      supplierNegotiationAngle: `Negotiate $7.60/unit for 300+ units with branded packaging inserts.`,
      openRouterInsight: `High impulse conversion potential when creative highlights immediate problem-resolution.`,
      skepticProvider: 'Synthesized Skeptic Council'
    },
    {
      id: `syn_2_${Date.now()}`,
      name: `Compact Magnetic ${sanitizedNiche} Rapid Organizer & Sanitizer`,
      category: sanitizedNiche,
      tagline: `Space-saving magnetic dock with integrated micro-clean technology`,
      problemSolved: `Clutter, lost accessories, and unsanitary storage in tight living and work spaces.`,
      niche: sanitizedNiche,
      targetMarket,
      budgetTier,
      huntedAt: timestamp,
      winningScore: 84,
      demandScore: 82,
      saturationScore: 41,
      viralFactor: 8.1,
      sourcingCost: 6.8,
      sellingPrice: 34.5,
      estimatedShipping: 3.8,
      estimatedCPA: 11.0,
      netProfitMargin: 37,
      searchIntent: `Strong organic search traffic for decluttering hacks and aesthetic organization setups.`,
      targetDemographics: `Homeowners, renters, and workspace professionals looking for clean minimalist desks.`,
      trendTrajectory: `Steady compounding search growth across home and lifestyle hashtags.`,
      geminiInsight: `Visual transformation before-and-after makes for frictionless social ad engagement.`,
      marketProvider: 'Synthesized Market Trend Model',
      adHooks: [
        `Transform your cluttered counter into a clean aesthetic workspace in 30 seconds.`,
        `Here is the $34 organizer that went viral for fixing the most annoying daily clutter.`,
        `Stop wasting time searching for misplaced tools: this magnetic dock locks everything in place.`
      ],
      primaryAdCopy: `Declutter your life with the Compact Magnetic Dock. Built with aerospace magnets and sleek matte finish to keep your ${sanitizedNiche.toLowerCase()} essentials organized, charged, and ready.`,
      creativeBlueprint: 'Time-lapse: messy countertop transforming into a magazine-worthy organized layout.',
      targetInterests: ['Interior Design', 'Organization Hacks', 'Minimalism', 'Smart Living'],
      groqInsight: `Low sourcing cost creates strong margin buffer for buy-2-get-1 bundle offers.`,
      quantProvider: 'Synthesized Quant Model',
      verdict: 'MUST LAUNCH',
      saturationRisk: `Medium competition on generic marketplaces; stand out with bespoke colorways.`,
      seasonalTrap: `Compounding boost during Spring Cleaning and New Year reset periods.`,
      returnRateRisk: `Low defect rate with solid-state magnetic components.`,
      supplierNegotiationAngle: `Request custom matte silicone coating and private label gift box.`,
      openRouterInsight: `Broad mass-market appeal with strong social sharing mechanics.`,
      skepticProvider: 'Synthesized Skeptic Council'
    }
  ];
}
