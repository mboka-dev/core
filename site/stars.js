const API_URL = 'https://api.github.com/repos/mboka-dev/core';
const CACHE_KEY = 'mboka-github-stars';
const REFRESH_MS = 5 * 60 * 1000;

function readCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (Number.isSafeInteger(cached?.count) && cached.count >= 0
      && Number.isSafeInteger(cached.at) && cached.at > 0 && cached.at <= Date.now()) return cached;
  } catch { /* Metadata caching is optional. */ }
  return null;
}

export function initStars() {
  const count = document.getElementById('star-count');
  const link = count.closest('a');
  let cached = readCache();
  let refreshing = false;
  let timer;

  function render() {
    count.hidden = !cached;
    if (!cached) return;
    count.textContent = new Intl.NumberFormat('fr', { notation: 'compact', maximumFractionDigits: 1 }).format(cached.count);
    const stars = new Intl.NumberFormat('fr').format(cached.count);
    const date = new Intl.DateTimeFormat('fr', { dateStyle: 'short', timeStyle: 'short' }).format(cached.at);
    link.setAttribute('aria-label', `Voir mboka-dev/core sur GitHub, ${stars} étoiles, relevées le ${date}`);
    link.title = `${stars} étoiles · relevé le ${date}`;
  }

  async function refresh() {
    if (document.hidden || refreshing) return;
    if (cached && Date.now() - cached.at >= 0 && Date.now() - cached.at < REFRESH_MS) return;
    refreshing = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(API_URL, { credentials: 'omit', referrerPolicy: 'no-referrer', signal: controller.signal, headers: { Accept: 'application/vnd.github+json' } });
      if (!response.ok) throw new Error('GitHub metadata unavailable');
      const data = await response.json();
      if (!Number.isSafeInteger(data.stargazers_count) || data.stargazers_count < 0) throw new Error('Invalid star count');
      cached = { count: data.stargazers_count, at: Date.now() };
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(cached)); } catch { /* In-memory refresh still works. */ }
      render();
    } catch {
      // A dated previous count is useful offline; otherwise leave only the GitHub icon.
      render();
    } finally {
      clearTimeout(timeout);
      refreshing = false;
    }
  }

  function schedule() {
    clearInterval(timer);
    if (!document.hidden) {
      void refresh();
      timer = setInterval(() => { void refresh(); }, REFRESH_MS);
    }
  }
  render();
  schedule();
  document.addEventListener('visibilitychange', schedule);
  window.addEventListener('online', () => { void refresh(); });
}
