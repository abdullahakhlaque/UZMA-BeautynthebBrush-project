// Shared in-memory + sessionStorage cache for portfolio items,
// plus a tiny helper that warms the browser cache for the first N
// portfolio images so the home page and the portfolio page render
// them instantly.

import { apiUrl, resolveMediaUrl } from './api';

export interface PortfolioItem {
  id: string;
  url: string;
  type: 'image' | 'video';
}

const STORAGE_KEY = 'uzma:portfolio:v1';
const inMemory: { items: PortfolioItem[]; ts: number } | null = (() => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { items: PortfolioItem[]; ts: number };
    if (!parsed || !Array.isArray(parsed.items)) return null;
    return parsed;
  } catch {
    return null;
  }
})();

let inflight: Promise<PortfolioItem[]> | null = null;

const persist = (items: PortfolioItem[]) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ items, ts: Date.now() }));
  } catch {
    /* sessionStorage may be unavailable (private mode, quota) — ignore */
  }
};

export const getCachedPortfolio = (): PortfolioItem[] | null => inMemory?.items ?? null;

export const fetchPortfolio = async (): Promise<PortfolioItem[]> => {
  if (inMemory) return inMemory.items;
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const res = await fetch(apiUrl('/api/portfolio'), { cache: 'default' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const items: PortfolioItem[] = Array.isArray(data) ? data : [];
      persist(items);
      return items;
    } catch (err) {
      console.error('Failed to load portfolio', err);
      return [];
    } finally {
      inflight = null;
    }
  })();

  return inflight;
};

// Injects <link rel="preload" as="image"> for the first N images so the
// browser starts fetching them in parallel with the JS bundle / HTML.
const preloaded = new Set<string>();

export const preloadFirstImages = (items: PortfolioItem[], count = 4) => {
  if (typeof document === 'undefined') return;

  items.slice(0, count).forEach((item) => {
    if (item.type !== 'image') return;
    const resolved = resolveMediaUrl(item.url);
    if (!resolved || preloaded.has(resolved)) return;
    preloaded.add(resolved);

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = resolved;
    link.fetchPriority = 'high';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};
