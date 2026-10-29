import { initDemos } from './demos.js';
import { initStars } from './stars.js';

const pages = [...document.querySelectorAll('[data-page]')];
const main = document.getElementById('contenu');
const toc = document.getElementById('page-toc');
const mobileNav = document.getElementById('mobile-nav');
const searchDialog = document.getElementById('search-dialog');
const searchInput = document.getElementById('search-query');
const mobileLinks = document.getElementById('sidebar-nav').cloneNode(true);
mobileLinks.removeAttribute('id');
document.getElementById('mobile-links').append(mobileLinks);

function route({ focus = false } = {}) {
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { id = ''; }
  if (id === 'contenu') { main.focus(); return; }
  const anchor = document.getElementById(id);
  const page = anchor?.closest('[data-page]') ?? pages[0];
  for (const item of pages) item.hidden = item !== page;
  for (const link of document.querySelectorAll('[data-route]')) {
    if (link.dataset.route === page.id) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  document.title = `${page.querySelector('h1').textContent} — mboka`;
  toc.replaceChildren(...[...page.querySelectorAll('[data-toc]')].map(section => {
    const link = document.createElement('a');
    link.href = `#${section.id}`;
    link.textContent = section.dataset.toc;
    if (anchor === section) link.setAttribute('aria-current', 'location');
    return link;
  }));
  mobileNav.close();
  searchDialog.close();
  if (focus) {
    main.focus({ preventScroll: true });
    if (anchor && anchor !== page) anchor.scrollIntoView({ block: 'start' });
    else window.scrollTo({ top: 0 });
  }
}

window.addEventListener('hashchange', () => route({ focus: true }));
route();

const themeButton = document.getElementById('theme-toggle');
function syncTheme() {
  const light = document.documentElement.dataset.theme === 'light';
  themeButton.setAttribute('aria-label', light ? 'Activer le thème sombre' : 'Activer le thème clair');
  document.querySelector('meta[name="theme-color"]').content = light ? '#ffffff' : '#090909';
}
themeButton.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('mboka-theme', theme); } catch { /* Preferences can remain in memory. */ }
  syncTheme();
});
syncTheme();

for (const group of document.querySelectorAll('[role="tablist"]')) {
  const tabs = [...group.querySelectorAll('[role="tab"]')];
  function activate(tab) {
    for (const item of tabs) {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(item.getAttribute('aria-controls'));
      panel.hidden = !active;
      if (active) for (const code of panel.querySelectorAll('[data-mirror]')) {
        code.textContent = document.querySelector(code.dataset.mirror).textContent;
        highlight(code);
      }
    }
  }
  group.addEventListener('click', event => {
    const tab = event.target.closest('[role="tab"]');
    if (tab) activate(tab);
  });
  group.addEventListener('keydown', event => {
    const index = tabs.indexOf(document.activeElement);
    if (index < 0 || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    activate(tabs[next]);
    tabs[next].focus();
  });
}

function highlight(code) {
  const text = code.textContent;
  const fragment = document.createDocumentFragment();
  const tokens = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b(?:import|from|const)\b)/g;
  let offset = 0;
  for (const match of text.matchAll(tokens)) {
    fragment.append(document.createTextNode(text.slice(offset, match.index)));
    const span = document.createElement('span');
    span.className = /^['"]/.test(match[0]) ? 'token-string' : 'token-keyword';
    span.textContent = match[0];
    fragment.append(span);
    offset = match.index + match[0].length;
  }
  fragment.append(document.createTextNode(text.slice(offset)));
  code.replaceChildren(fragment);
}
function highlightExamples() {
  for (const code of document.querySelectorAll('.code-panel pre code')) highlight(code);
}

let toastTimer;
document.addEventListener('click', async event => {
  const button = event.target.closest('[data-copy]');
  if (!button) return;
  const target = document.querySelector(button.dataset.copy);
  const code = target.matches('code, output') ? target : [...target.querySelectorAll('code')].find(item => !item.closest('[hidden]'));
  const status = document.getElementById('copy-status');
  clearTimeout(toastTimer);
  try {
    await navigator.clipboard.writeText(code.textContent);
    status.textContent = 'Copié dans le presse-papiers.';
  } catch {
    status.textContent = 'Copie indisponible. Sélectionnez le texte pour le copier.';
  }
  toastTimer = setTimeout(() => { status.textContent = ''; }, 3500);
});

const searchEntries = [
  { title: 'Téléphone', detail: 'Analyser et formater un numéro +242', hash: 'telephone', terms: 'parse national international numero mobile' },
  { title: 'Montants', detail: 'Formater un montant en FCFA ou XAF', hash: 'montants', terms: 'money argent devise format prix' },
  { title: 'Territoire', detail: 'Données des départements du Congo-Brazzaville', hash: 'territoire', terms: 'geo communes departements geographie source' },
  { title: 'Installation', detail: 'Installer les paquets JavaScript et Python', hash: 'installation', terms: 'npm pip typescript node' },
  { title: 'Présentation', detail: 'Découvrir mboka et le fonctionnement des démos', hash: 'presentation', terms: 'donnees projet librairie bibliotheque' },
  { title: 'Confidentialité', detail: 'Comprendre ce qui reste dans votre navigateur', hash: 'presentation-confidentialite', terms: 'vie privee traceur collecte reseau' },
];
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
function search() {
  const words = normalize(searchInput.value).trim().split(/\s+/);
  const results = searchEntries.filter(item => words.every(word => normalize(`${item.title} ${item.detail} ${item.terms}`).includes(word)));
  const list = document.getElementById('search-results');
  list.replaceChildren(...results.map(item => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${item.hash}`;
    link.append(document.createTextNode(item.title));
    const detail = document.createElement('span');
    detail.textContent = item.detail;
    link.append(detail);
    link.addEventListener('click', () => {
      // Selecting the current route does not dispatch hashchange.
      if (location.hash === link.hash) route({ focus: true });
    });
    li.append(link);
    return li;
  }));
  if (!results.length) {
    const empty = document.createElement('li');
    empty.className = 'search-empty';
    empty.textContent = 'Aucun résultat. Essayez « téléphone » ou « montant ».';
    list.append(empty);
  }
  document.getElementById('search-status').textContent = `${results.length} résultat${results.length > 1 ? 's' : ''}.`;
}
function openSearch() {
  if (mobileNav.open) mobileNav.close();
  searchDialog.showModal();
  searchInput.value = '';
  search();
  searchInput.focus();
}
document.getElementById('search-open').addEventListener('click', openSearch);
searchInput.addEventListener('input', search);
searchInput.addEventListener('keydown', event => {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    document.querySelector('#search-results a')?.focus();
  }
});
document.getElementById('menu-open').addEventListener('click', () => mobileNav.showModal());
document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k' && !event.isComposing) {
    event.preventDefault();
    if (searchDialog.open) searchDialog.close(); else openSearch();
  }
});
for (const dialog of [mobileNav, searchDialog]) {
  dialog.addEventListener('click', event => {
    if (event.target.closest('[data-close-dialog]')) dialog.close();
    if (event.target === dialog) {
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    }
  });
}
mobileLinks.addEventListener('click', event => { if (event.target.closest('a')) mobileNav.close(); });

highlightExamples();
void initDemos().then(highlightExamples);
document.addEventListener('submit', () => queueMicrotask(highlightExamples));
const libraryStatus = document.getElementById('library-status');
new MutationObserver(() => {
  if (libraryStatus.hidden) highlightExamples();
}).observe(libraryStatus, { attributes: true, attributeFilter: ['hidden'] });
initStars();
