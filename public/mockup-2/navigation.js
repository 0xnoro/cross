const base = new URL('./', import.meta.url);
const bikesPath = base.pathname;
const batteriesPath = new URL('batteries/', base).pathname;
const cache = new Map();
let current = location.pathname === batteriesPath ? batteriesPath : bikesPath;
let bikesReady = current === bikesPath;
let navigating = false;
cache.set(current, {main: document.querySelector('main'), title: document.title});
for (const link of document.querySelectorAll('.header a, .footer a')) link.setAttribute('href', link.href);

const stylesReady = [];
for (const file of ['extras.css', 'shop-motion.css', 'order.css', 'batteries/batteries.css']) {
  const href = new URL(file, base).href;
  if (![...document.querySelectorAll('link[rel="stylesheet"]')].some(link => link.href === href)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    stylesReady.push(new Promise((resolve, reject) => {
      link.onload = resolve;
      link.onerror = reject;
    }));
    document.head.append(link);
  }
}

async function load(path) {
  if (cache.has(path)) return cache.get(path);
  const response = await fetch(path);
  if (!response.ok) throw new Error('Page unavailable');
  const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
  const main = doc.querySelector('main');
  for (const element of main.querySelectorAll('[src], [href], [data-shop-photo]')) {
    for (const attribute of ['src', 'href', 'data-shop-photo']) {
      if (element.hasAttribute(attribute)) element.setAttribute(attribute, new URL(element.getAttribute(attribute), response.url).href);
    }
  }
  await Promise.all([...main.querySelectorAll('img')].map(image => {
    image.loading = 'eager';
    return image.decode().catch(() => {});
  }));
  const page = {main, title: doc.title, dialogs: [...doc.querySelectorAll('dialog')]};
  cache.set(path, page);
  return page;
}

async function navigate(url, push = true) {
  if (navigating) return;
  navigating = true;
  try {
    const page = await load(url.pathname);
    await Promise.all(stylesReady);
    if (current !== url.pathname) {
      document.querySelector('main').replaceWith(page.main);
      current = url.pathname;
    }
    if (push) history.pushState(null, '', url);
    document.title = page.title;
    if (current === bikesPath && !bikesReady) {
      for (const dialog of page.dialogs) document.body.append(dialog);
      await import('./storefront.js');
      await import('./order.js');
      bikesReady = true;
    }
    for (const link of document.querySelectorAll('.header nav a')) {
      const target = new URL(link.href);
      if (target.pathname === current && target.hash !== '#store') link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
    const anchor = url.hash && document.getElementById(url.hash.slice(1));
    if (anchor) anchor.scrollIntoView({behavior:'instant'});
    else window.scrollTo({top:0, behavior:'instant'});
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      page.main.animate([{transform:'translateY(5px)'},{transform:'translateY(0)'}], {duration:360, easing:'ease-out'});
    }
  } catch {
    location.assign(url.href);
  } finally {
    navigating = false;
  }
}

document.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest('a');
  if (!link || link.target || link.hasAttribute('download')) return;
  const url = new URL(link.href);
  if (url.origin !== location.origin || ![bikesPath, batteriesPath].includes(url.pathname)) return;
  if (url.pathname === current) return;
  event.preventDefault();
  navigate(url);
});
window.addEventListener('popstate', () => navigate(new URL(location.href), false));

for (const link of document.querySelectorAll('.header nav a')) {
  const url = new URL(link.href);
  link.addEventListener('pointerenter', () => load(url.pathname).catch(() => {}), {once:true});
}
