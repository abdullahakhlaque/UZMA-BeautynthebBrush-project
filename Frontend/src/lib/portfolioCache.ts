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

// ── In-memory store (lives for the lifetime of the JS module) ──────────────
// We use a mutable object so that fetchPortfolio() can update it in-place
// and getCachedPortfolio() always sees the latest value without re-reading
// sessionStorage.
const cache: { items: PortfolioItem[] | null } = { items: null };

// Hydrate from sessionStorage on first load so returning visitors get
// instant rendering even before the network request completes.
try {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (raw) {
    const parsed = JSON.parse(raw) as { items: PortfolioItem[] };
    if (Array.isArray(parsed?.items)) {
      cache.items = parsed.items;
    }
  }
} catch {
  /* sessionStorage unavailable — ignore */
}

let inflight: Promise<PortfolioItem[]> | null = null;

const persist = (items: PortfolioItem[]) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ items, ts: Date.now() }));
  } catch {
    /* quota / private mode — ignore */
  }
};

/** Returns cached items if available, otherwise null. */
export const getCachedPortfolio = (): PortfolioItem[] | null => cache.items;

/** Fetches portfolio from API (or returns cache). Always resolves — never throws. */
export const fetchPortfolio = async (): Promise<PortfolioItem[]> => {
  // Return in-memory cache immediately
  if (cache.items !== null) return cache.items;
  // De-duplicate concurrent calls
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const res = await fetch(apiUrl('/api/portfolio'), { cache: 'default' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const items: PortfolioItem[] = Array.isArray(data) ? data : [];
      // ← KEY FIX: update the in-memory cache so next call is instant
      cache.items = items;
      persist(items);
      return items;
    } catch (err) {
      console.error('[portfolioCache] Failed to load portfolio:', err);
      // Don't cache failures — let the next call retry
      cache.items = null;
      return [];
    } finally {
      inflight = null;
    }
  })();

  return inflight;
};

// ── Image preloader ────────────────────────────────────────────────────────
const preloaded = new Set<string>();

/**
 * Injects <link rel="preload" as="image"> for the first N images so the
 * browser starts fetching them in parallel with JS/HTML parsing.
 */
export const preloadFirstImages = (items: PortfolioItem[], count = 4) => {
  if (typeof document === 'undefined') return;
  items.slice(0, count).forEach(item => {
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