import { ScrapedSignal } from '../types';

export async function fetchLiveWebSignals(
  searchNiche: string,
  huntMode: string,
  customSignals: string,
  onLog?: (engine: string, message: string, status: 'info' | 'success' | 'warn' | 'error') => void
): Promise<ScrapedSignal[]> {
  const collectedSignals: ScrapedSignal[] = [];

  // 1. Parse user custom signals
  if (customSignals.trim()) {
    const customLines = customSignals
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    customLines.forEach((line) => {
      collectedSignals.push({
        source: 'USER_SIGNAL',
        title: line,
        engagement: 'Direct Input'
      });
    });
    if (onLog) {
      onLog('SCRAPER', `Injected ${customLines.length} custom user product/URL signals.`, 'success');
    }
  }

  if (huntMode !== 'live_scraper') {
    if (onLog) {
      onLog('SCRAPER', 'Live Web Scraper bypassed (AI Deep Synthesis mode selected).', 'info');
    }
    return collectedSignals;
  }

  if (onLog) {
    onLog('SCRAPER', `Querying live public Reddit & HackerNews JSON feeds for "${searchNiche}"...`, 'info');
  }

  const redditUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(
    searchNiche + ' gadget OR product OR buy OR best'
  )}&sort=relevance&t=year&limit=8`;

  const hnUrl = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(
    searchNiche
  )}&tags=story&hitsPerPage=6`;

  const [redditRes, hnRes] = await Promise.allSettled([
    fetch(redditUrl, { headers: { Accept: 'application/json' } }).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    }),
    fetch(hnUrl, { headers: { Accept: 'application/json' } }).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
  ]);

  if (redditRes.status === 'fulfilled' && redditRes.value?.data?.children) {
    const posts = redditRes.value.data.children;
    let count = 0;
    posts.forEach((p: any) => {
      if (p?.data?.title) {
        count++;
        collectedSignals.push({
          source: `r/${p.data.subreddit || 'reddit'}`,
          title: p.data.title,
          engagement: `${p.data.ups || 0} upvotes · ${p.data.num_comments || 0} comments`
        });
      }
    });
    if (onLog) {
      onLog('REDDIT_API', `Extracted ${count} live consumer discussion signals from Reddit.`, 'success');
    }
  } else if (onLog) {
    onLog(
      'REDDIT_API',
      'Reddit public JSON blocked or rate-limited; proceeding with HackerNews + AI synthesis.',
      'warn'
    );
  }

  if (hnRes.status === 'fulfilled' && Array.isArray(hnRes.value?.hits)) {
    const hits = hnRes.value.hits;
    let count = 0;
    hits.forEach((h: any) => {
      if (h?.title) {
        count++;
        collectedSignals.push({
          source: 'HackerNews',
          title: h.title,
          engagement: `${h.points || 0} pts · ${h.num_comments || 0} comments`
        });
      }
    });
    if (onLog) {
      onLog('ALGOLIA_HN', `Extracted ${count} tech & consumer trend signals from Algolia HN.`, 'success');
    }
  }

  return collectedSignals;
}
