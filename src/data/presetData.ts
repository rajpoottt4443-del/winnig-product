import { Product } from '../types';

export const NICHE_PRESETS = [
  'Smart Kitchen Gadgets',
  'Pet Grooming & Tech',
  'Ergonomic Home Office',
  'Auto Detailing & Accessories',
  'Winter Apparel & Heating',
  'Compact Home Organization',
  'Portable Fitness Recovery',
  'Baby Safety & Travel Gear'
];

export const TARGET_MARKETS = [
  { id: 'USA', label: 'USA (North America)', currency: '$' },
  { id: 'Global', label: 'Global (Worldwide)', currency: '$' },
  { id: 'UK', label: 'United Kingdom', currency: '$' },
  { id: 'Europe', label: 'European Union', currency: '$' },
  { id: 'UAE', label: 'UAE / GCC Middle East', currency: '$' },
  { id: 'Pakistan', label: 'Pakistan (Local COD / E-Com)', currency: '$' }
];

export const BUDGET_TIERS = [
  { id: 'Low Ticket (<$20)', label: 'Low Ticket (<$20)', range: 'Under $20 retail' },
  { id: 'Mid Ticket ($20-$60)', label: 'Mid Ticket ($20-$60)', range: '$20 to $60 retail' },
  { id: 'High Ticket ($60+)', label: 'High Ticket ($60+)', range: '$60 to $250+ retail' }
];

export const OPENROUTER_MODELS = [
  { id: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B Instruct (Recommended)' },
  { id: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet (High Precision)' },
  { id: 'google/gemini-2.0-flash-001', label: 'Gemini 2.0 Flash (Fast & Economical)' },
  { id: 'meta-llama/llama-3.1-8b-instruct', label: 'Llama 3.1 8B Instruct (Ultra-Light Fallback)' },
  { id: 'openai/gpt-4o-mini', label: 'GPT-4o Mini (Balanced)' }
];

export const INITIAL_SEED_PRODUCTS: Product[] = [
  {
    id: 'seed_prod_1',
    name: 'Self-Sanitizing UV Magnetic Knife & Culinary Dock',
    category: 'Smart Kitchen Gadgets',
    tagline: 'Medical-grade 254nm UVC sterilization in a precision walnut magnetic block',
    problemSolved: 'Cross-contamination on damp chef knives and cluttered butcher blocks harboring bacteria.',
    niche: 'Smart Kitchen Gadgets',
    targetMarket: 'USA',
    budgetTier: 'Mid Ticket ($20-$60)',
    huntedAt: new Date().toISOString(),

    winningScore: 92,
    demandScore: 88,
    saturationScore: 32,
    viralFactor: 8.9,

    sourcingCost: 9.8,
    sellingPrice: 49.99,
    estimatedShipping: 4.8,
    estimatedCPA: 13.5,
    netProfitMargin: 40,

    searchIntent: 'High transactional intent driven by clean kitchen aesthetics, food safety and cooking creator trends.',
    targetDemographics: 'Millennial and Gen-X home cooks, foodies, and hygiene-conscious families aged 25-48.',
    trendTrajectory: '+142% search volume uptick across TikTok Shop, Instagram Reels, and Amazon Launchpad.',
    geminiInsight: 'Unlocks a rare intersection of hygienic culinary utility and high-end visual countertop flex. Low return rate profile.',
    marketProvider: 'Google Gemini (gemini-2.5-flash)',

    adHooks: [
      'Stop wiping your kitchen knives with that dirty sponge: here is what happens under UV light...',
      'Why 32,000 professional home cooks in the US switched to this self-cleaning magnetic dock this month.',
      'I tested every viral kitchen gadget on TikTok so you do not burn your money: here is the real winner.'
    ],
    primaryAdCopy: 'Did you know standard wooden knife blocks harbor over 4x more bacteria than your bathroom counter? The PureBlade Dock pairs aerospace magnets with timed 254nm UV sterilization to keep your chef blades razor sharp and 99.9% sanitized with zero cords.',
    creativeBlueprint: '0-3s Hook: Macro UV glow showing bacteria on ordinary wooden block vs instant sterile click onto walnut dock. Split screen demonstration.',
    targetInterests: ['Culinary Arts', 'Kitchen Gadgets', 'Home Organization', 'Williams-Sonoma', 'Gordon Ramsay'],
    groqInsight: 'Gross margin spread of $40.19 allows aggressive Meta bid caps and bundle upsell with custom steak knife sets for $79 AOV.',
    quantProvider: 'Groq LPU (llama-3.3-70b-versatile)',

    verdict: 'MUST LAUNCH',
    saturationRisk: 'Low-to-moderate. Generic wooden blocks are saturated on Amazon, but UV magnetic docks are blue ocean on Meta and TikTok.',
    seasonalTrap: 'Evergreen year-round kitchen upgrade with major Q4 holiday gifting spike.',
    returnRateRisk: 'Extremely low (<2%) if supplier includes CE/FCC certified 5V USB-C charging module and water-resistant seals.',
    supplierNegotiationAngle: 'Negotiate $8.90 landed unit cost at 300 MOQ with custom embossed craft-paper packaging and foam inserts.',
    openRouterInsight: 'Strong impulse buy mechanics. The UV glow creates instant visual thumb-stop in the first 2 seconds of video ads.',
    skepticProvider: 'OpenRouter (meta-llama/llama-3.3-70b-instruct)'
  },
  {
    id: 'seed_prod_2',
    name: 'Ultrasonic Pet De-Shedding & Steam Massager Brush',
    category: 'Pet Grooming & Tech',
    tagline: 'Gentle nano-mist detangler that traps flying fur and soothes anxious pets',
    problemSolved: 'Fur flying everywhere during grooming and pets scratching or panicking from harsh metal wire combs.',
    niche: 'Pet Grooming & Tech',
    targetMarket: 'USA',
    budgetTier: 'Low Ticket (<$20)',
    huntedAt: new Date().toISOString(),

    winningScore: 89,
    demandScore: 94,
    saturationScore: 48,
    viralFactor: 9.3,

    sourcingCost: 3.4,
    sellingPrice: 24.99,
    estimatedShipping: 3.2,
    estimatedCPA: 8.5,
    netProfitMargin: 36,

    searchIntent: 'Massive organic UGC search for pet hair removal hacks and anxiety-free grooming.',
    targetDemographics: 'Dog and cat owners aged 18-55, particularly golden retriever, husky, and long-hair cat owners.',
    trendTrajectory: 'Viral breakout on TikTok with over 80M hashtag views and continuous comment inquiries.',
    geminiInsight: 'Pet niche carries the highest emotional conversion rate in direct-to-consumer e-commerce.',
    marketProvider: 'Google Gemini (gemini-2.5-flash)',

    adHooks: [
      'If your pet sheds like a blizzard whenever you touch them, you need to see this steam brush in action.',
      'My cat usually hates being brushed, but watch what happens when I turn on the warm ultrasonic mist...',
      'Do not buy another lint roller until you see how this $24 gadget collects 3 tennis balls worth of loose fur.'
    ],
    primaryAdCopy: 'Flying pet hair on your couch, clothes, and dinner? The SteamPurr Brush uses ultrasonic cool mist to gently weigh down loose dander while soft silicone bristles massage your pet into pure bliss. One-click hair ejection makes cleanup effortless.',
    creativeBlueprint: 'Satisfying peel-off shot of a thick mat of fur coming off the brush in one seamless sheet. Instant ASMR appeal.',
    targetInterests: ['Cat Lovers', 'Golden Retriever', 'Dog Grooming', 'Petco', 'Chewy'],
    groqInsight: 'Ultra-low sourcing cost enables 2-pack and 3-pack bundle offers that lift store AOV above $42 with sub-$11 blended CPA.',
    quantProvider: 'Groq LPU (llama-3.3-70b-versatile)',

    verdict: 'MUST LAUNCH',
    saturationRisk: 'Rising competition on TikTok Shop; protect margins by offering customized scented detangling essence pods.',
    seasonalTrap: 'Spring and Autumn peak molting seasons provide huge momentum, but pet hair remains an everyday pain point.',
    returnRateRisk: 'Ensure supplier uses medical food-grade silicone teeth so no pets get skin irritation.',
    supplierNegotiationAngle: 'Lock in 500 units with 2 extra silicone replacement heads included for under $3.10/unit.',
    openRouterInsight: 'Clear winner with organic virality. Easy to scale via micro-influencer gifting campaign with dog/cat TikTok accounts.',
    skepticProvider: 'OpenRouter (meta-llama/llama-3.3-70b-instruct)'
  },
  {
    id: 'seed_prod_3',
    name: 'Dynamic Cervical Traction & Heated Acupressure Pillow',
    category: 'Portable Fitness Recovery',
    tagline: 'Inflatable orthopedic spine alignment with graphene thermo-therapy',
    problemSolved: 'Chronic neck stiffness, text-neck tension, and poor sleep posture from desk work.',
    niche: 'Portable Fitness Recovery',
    targetMarket: 'USA',
    budgetTier: 'Mid Ticket ($20-$60)',
    huntedAt: new Date().toISOString(),

    winningScore: 84,
    demandScore: 86,
    saturationScore: 54,
    viralFactor: 7.8,

    sourcingCost: 11.2,
    sellingPrice: 59.99,
    estimatedShipping: 5.5,
    estimatedCPA: 18.0,
    netProfitMargin: 38,

    searchIntent: 'Desperate pain-relief search queries on Google and Amazon for text-neck and cervical spine relief.',
    targetDemographics: 'Remote workers, coders, gamers, desk professionals, and older adults suffering from occipital tension.',
    trendTrajectory: 'Steady compounding search growth driven by sedentary lifestyle and remote work culture.',
    geminiInsight: 'High perceived medical utility justifies a higher retail price and builds deep customer trust.',
    marketProvider: 'Google Gemini (gemini-2.5-flash)',

    adHooks: [
      'If you sit at a desk for more than 6 hours a day, your cervical spine is under 45 lbs of constant pressure.',
      'Chiropractors charge $150 per session for cervical traction. Here is how to do it at home in 10 minutes.',
      'Hear that gentle decompression click? That is 8 hours of desk tension leaving my upper back.'
    ],
    primaryAdCopy: 'Reverse the damage of hunching over screens. The OrthoCerv Pillow uses calibrated air-chamber traction and soothing graphene heat to gently restore your natural spinal curvature in just 10 minutes a day. FSA/HSA eligible appeal.',
    creativeBlueprint: 'Side-angle 3D anatomical overlay showing curved spine straightening under gentle inflatable lift with thermal gradient map.',
    targetInterests: ['Physical Therapy', 'Chiropractic', 'Ergonomics', 'Desk Setup', 'Pain Management'],
    groqInsight: 'High retail ticket ($59.99) yields $23+ net contribution margin even under elevated ad auction CPMs.',
    quantProvider: 'Groq LPU (llama-3.3-70b-versatile)',

    verdict: 'TEST WITH CAUTION',
    saturationRisk: 'Multiple physical therapy brands exist. Must differentiate through FDA-cleared wording, verified testimonials, and warranty.',
    seasonalTrap: 'Consistent year-round demand with peak in January New Year wellness resolutions.',
    returnRateRisk: 'Moderate risk if users expect instant overnight cures; include a clear 7-day posture rehabilitation guide card in the box.',
    supplierNegotiationAngle: 'Request custom nylon storage travel pouch and 3-level heat controller with auto-shutoff safety timer.',
    openRouterInsight: 'Viable if creative messaging focuses strictly on desk posture tension rather than making unverified medical claims.',
    skepticProvider: 'OpenRouter (meta-llama/llama-3.3-70b-instruct)'
  },
  {
    id: 'seed_prod_4',
    name: 'Hydro-Jet Under-Chassis & Wheel Detailing Wand',
    category: 'Auto Detailing & Accessories',
    tagline: '4000 PSI pivoting undercarriage cleaner with dual-action salt blaster',
    problemSolved: 'Winter road salt rust and mud buildup under vehicle wheel wells that car washes miss.',
    niche: 'Auto Detailing & Accessories',
    targetMarket: 'USA',
    budgetTier: 'Mid Ticket ($20-$60)',
    huntedAt: new Date().toISOString(),

    winningScore: 82,
    demandScore: 81,
    saturationScore: 39,
    viralFactor: 8.5,

    sourcingCost: 8.9,
    sellingPrice: 44.95,
    estimatedShipping: 6.2,
    estimatedCPA: 13.0,
    netProfitMargin: 35,

    searchIntent: 'Seasonal panic for winter rust prevention and auto detailing enthusiasts looking for satisfying pressure-wash tools.',
    targetDemographics: 'Car enthusiasts, truck owners, DIY detailers, suburban homeowners with pressure washers.',
    trendTrajectory: 'Seasonal spikes in Northern states and mountain regions during snow and road salt months.',
    geminiInsight: 'Extreme visual satisfaction when muddy or salty dirty water blasts out from beneath a truck.',
    marketProvider: 'Google Gemini (gemini-2.5-flash)',

    adHooks: [
      'Road salt is silently eating away your car frame right now. Watch what comes out from underneath this truck...',
      'Why pay $30 at the automated car wash when this 4-nozzle hydro-wand cleans your chassis in 60 seconds?',
      'The most satisfying car detailing video you will watch today. Listen to that pressure wash.'
    ],
    primaryAdCopy: 'Prevent thousands of dollars in frame rust and suspension corrosion. The HydroChassis 4000 rolls effortlessly under any vehicle with dual caster wheels and 4 high-pressure stainless steel spray nozzles to blast away grime, salt, and mud in seconds.',
    creativeBlueprint: 'Low-angle camera shot showing brown dirty water cascading from underneath a luxury truck, transitioning into spotless clean metal.',
    targetInterests: ['Auto Detailing', 'Pressure Washing', 'Ford F-150', 'Automotive Care', 'DIY Home'],
    groqInsight: 'Strong candidate for quick geo-targeted Meta ad campaigns in cold US states (New York, Ohio, Michigan, Pennsylvania).',
    quantProvider: 'Groq LPU (llama-3.3-70b-versatile)',

    verdict: 'MUST LAUNCH',
    saturationRisk: 'Low on paid social feeds. Most competitors only sell via dull Amazon search listings with poor video creative.',
    seasonalTrap: 'High winter/spring seasonality; transition to mud/off-road angle during summer months.',
    returnRateRisk: 'Ensure standard 1/4 inch quick-connect brass fittings are included so it works with all residential pressure washers.',
    supplierNegotiationAngle: 'Bundle with a 45-degree angled extension rod for $1.50 extra from supplier and raise retail price to $49.99.',
    openRouterInsight: 'Excellent conversion rate when ad creative demonstrates actual dirty salt water draining in high definition.',
    skepticProvider: 'OpenRouter (meta-llama/llama-3.3-70b-instruct)'
  },
  {
    id: 'seed_prod_5',
    name: 'Smart Biometric Fingerprint Padlock with Weatherproof Cover',
    category: 'Baby Safety & Travel Gear',
    tagline: '0.2s capacitive touch unlock with 1-year standby USB-C rechargeable battery',
    problemSolved: 'Lost gym lock keys, forgotten 4-digit combinations, and rusted dials in rain.',
    niche: 'Compact Home Organization',
    targetMarket: 'USA',
    budgetTier: 'Mid Ticket ($20-$60)',
    huntedAt: new Date().toISOString(),

    winningScore: 71,
    demandScore: 75,
    saturationScore: 78,
    viralFactor: 6.9,

    sourcingCost: 7.2,
    sellingPrice: 29.99,
    estimatedShipping: 3.5,
    estimatedCPA: 14.5,
    netProfitMargin: 12,

    searchIntent: 'Searchers looking for gym locker locks, outdoor shed locks, and student backpack security.',
    targetDemographics: 'Gym-goers, college students, travelers, cyclists, outdoor shed owners.',
    trendTrajectory: 'Plateaued search volume; heavy price competition from established Chinese brands on Amazon.',
    geminiInsight: 'Commoditized hardware category with aggressive price erosion down to $19.99 on marketplaces.',
    marketProvider: 'Google Gemini (gemini-2.5-flash)',

    adHooks: [
      'Stop fumbling with combinations at the gym when your hands are sweaty.',
      'Your fingerprint is your key: watch this unlock in 0.2 seconds.',
      'Is this biometric lock pick-proof? We put it to the test with heavy bolt cutters.'
    ],
    primaryAdCopy: 'Never forget your locker combination again. The BioLock Pro stores up to 20 fingerprints, withstands heavy outdoor rain with IP65 rating, and lasts 12 months on a single 30-minute USB-C charge.',
    creativeBlueprint: 'Gym locker test: athlete taps finger and door opens instantly while someone else struggles with an old combination lock.',
    targetInterests: ['Fitness', 'Gym Life', 'Travel Accessories', 'Tech Gadgets', 'Smart Home'],
    groqInsight: 'Thin margin buffer ($4.79 net) leaves virtually zero room for Meta ad CPA fluctuation above $15.',
    quantProvider: 'Groq LPU (llama-3.3-70b-versatile)',

    verdict: 'SATURATED - AVOID',
    saturationRisk: 'Extreme. Over 400 identical models listed on Amazon FBA and Temu selling at or near wholesale cost.',
    seasonalTrap: 'Mild back-to-school spike in August/September, otherwise flat.',
    returnRateRisk: 'High return rates if biometric scanner fails in cold weather or wet rain environments.',
    supplierNegotiationAngle: 'Suppliers offer low unit price but custom firmware for app integration requires 2000+ unit commitment.',
    openRouterInsight: 'Saturated commodity trap. Paid traffic will likely produce negative ROAS against marketplace price comparisons.',
    skepticProvider: 'OpenRouter (meta-llama/llama-3.3-70b-instruct)'
  },
  {
    id: 'seed_prod_6',
    name: 'Dual-Zone Vacuum Thermal Lunch Flask with Self-Venting Steam Seal',
    category: 'Smart Kitchen Gadgets',
    tagline: 'Keeps soup piping hot (12 hrs) while crisp salads remain chilled below',
    problemSolved: 'Soggy work lunches, cold meals when office microwaves have long queues, carrying 3 separate food containers.',
    niche: 'Smart Kitchen Gadgets',
    targetMarket: 'USA',
    budgetTier: 'Mid Ticket ($20-$60)',
    huntedAt: new Date().toISOString(),

    winningScore: 86,
    demandScore: 84,
    saturationScore: 42,
    viralFactor: 8.2,

    sourcingCost: 7.9,
    sellingPrice: 38.5,
    estimatedShipping: 4.6,
    estimatedCPA: 11.5,
    netProfitMargin: 35,

    searchIntent: 'Growing work-from-office meal prep trends, bento box aesthetics, and inflation-conscious lunch packing.',
    targetDemographics: 'Office commuters, construction workers, hospital nurses, meal-prep fitness enthusiasts.',
    trendTrajectory: '+65% year-over-year rise in packed lunch and thermal meal prep tags across social platforms.',
    geminiInsight: 'Solves an acute daily expense problem ($15 office lunches) with instant aesthetic meal prep appeal.',
    marketProvider: 'Google Gemini (gemini-2.5-flash)',

    adHooks: [
      'Stop spending $18 a day on mediocre office takeout. Watch how I pack piping hot ramen and cold fresh salad in one flask.',
      'The office microwave always has a 15-minute line during lunch break: here is my life hack.',
      'I put boiling soup in here at 7 AM. It is now 1:30 PM: let us check the digital temperature gauge.'
    ],
    primaryAdCopy: 'Save over $3,000 a year on bland workday takeout. The DualTherm Bento Flask features isolated double-wall vacuum chambers that keep hot dishes steaming hot for 12 hours without warming your cold fruit or dessert stored below. 100% leakproof guarantee.',
    creativeBlueprint: 'Thermometer probe test: inserting probe into steaming chicken noodle soup 6 hours after packing, showing 155°F reading.',
    targetInterests: ['Meal Prep', 'Bento', 'Zero Waste', 'Healthy Eating', 'Office Life'],
    groqInsight: 'Clean $13.40+ net profit margin per unit with strong potential for utensil set upsell at checkout.',
    quantProvider: 'Groq LPU (llama-3.3-70b-versatile)',

    verdict: 'MUST LAUNCH',
    saturationRisk: 'Low-to-moderate. Most thermal jars only hold 1 temperature item; dual-zone thermal isolation is a unique selling proposition.',
    seasonalTrap: 'Evergreen work routine with back-to-work and back-to-school peaks in January and September.',
    returnRateRisk: 'Ensure silicone gasket seals are food-grade and easy to disassemble for dishwasher cleaning.',
    supplierNegotiationAngle: 'Incorporate laser-etched graduation marks and magnetic folding spork into lid at $0.40/unit.',
    openRouterInsight: 'Strong high-margin everyday utility. Video creative focused on saving $3,000/year resonates strongly during economic inflation.',
    skepticProvider: 'OpenRouter (meta-llama/llama-3.3-70b-instruct)'
  }
];
