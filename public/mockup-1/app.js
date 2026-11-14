import { products, modelUrl, formatPrice, siteUrl } from './products.js';

const page = document.body.dataset.page;
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
const closeIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg>';
const external = 'target="_blank" rel="noopener noreferrer"';
const socialMocks = `<div class="social-icons" aria-label="Социальные сети">
  <span class="social-icon" role="img" aria-label="Telegram, заглушка" title="Telegram · скоро"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 4-3.4 16-5.5-4.1-2.8 2.7.5-4.6L18 7 7.7 12.8 3 11.3Z"/></svg></span>
  <span class="social-icon" role="img" aria-label="Instagram, заглушка" title="Instagram · скоро"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg></span>
</div>`;
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const announce = (message) => { $('[data-announcement]').textContent = message; };

function readStored(storage, key, fallback) {
  try { return JSON.parse(storage.getItem(key)) ?? fallback; } catch { return fallback; }
}

function store(storage, key, value) {
  try { storage.setItem(key, JSON.stringify(value)); } catch { /* Selection still works when browser storage is unavailable. */ }
}

let selected = readStored(localStorage, 'cross-compare', []);
selected = Array.isArray(selected) ? [...new Set(selected)].filter((id) => products.some((p) => p.id === id)).slice(0, 3) : [];

function comparisonControl(product) {
  return `<label class="compare-control"><input type="checkbox" data-compare="${product.id}" ${selected.includes(product.id) ? 'checked' : ''}><span>Сравнить<span class="sr-only">: ${product.name}</span></span></label>`;
}

function productCard(product) {
  return `<article class="product-card">
    <a class="card-photo" href="${modelUrl(product)}" aria-label="${product.name}, открыть модель">
      <img src="${product.image}" alt="${product.alt}" width="1536" height="1024" loading="lazy" style="view-transition-name:bike-${product.id}">
      <span class="photo-link" aria-hidden="true">${arrow}</span>
    </a>
    <div class="card-title"><h3><a href="${modelUrl(product)}">${product.name}</a></h3><p>${product.price ? `от ${formatPrice(product.price)}` : 'Цена по запросу'}</p></div>
    <div class="card-actions">${comparisonControl(product)}<a class="card-more" href="${modelUrl(product)}">Заказать <span class="sr-only">${product.name}</span>${arrow}</a></div>
  </article>`;
}

function renderChrome() {
  $('[data-header]').innerHTML = `
    <div class="header-inner">
      <a class="wordmark" href="${siteUrl()}" aria-label="CROSS, главная">CROSS</a>
      <nav class="desktop-nav" aria-label="Основная навигация">
        <button type="button" class="nav-models" data-nav-toggle aria-expanded="false" aria-controls="models-menu">Модели <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg></button>
        <a href="${siteUrl()}#store">Магазин в Москве</a><a href="#contacts">Контакты</a>
      </nav>
      <div class="header-actions">${socialMocks}<button class="mobile-toggle icon-button" type="button" data-nav-toggle aria-expanded="false" aria-controls="models-menu" aria-label="Открыть меню"><span></span><span></span></button></div>
    </div>
    <div class="models-menu" id="models-menu" hidden>
      <div class="menu-intro"><a href="${siteUrl('catalog/')}">Все модели ${arrow}</a><p>Электровелосипеды CROSS</p><a class="menu-store-link" href="${siteUrl()}#store">Магазин в Москве</a><a class="menu-store-link" href="#contacts">Контакты</a></div>
      <div class="menu-products">${products.filter((p) => p.featured).slice(0, 3).map((p) => `<a class="menu-product" href="${modelUrl(p)}"><img src="${p.image}" alt="" width="1536" height="1024"><span>${p.name}</span><small>${p.price ? `от ${formatPrice(p.price)}` : 'Цена по запросу'}</small></a>`).join('')}</div>
    </div>`;

  $('[data-footer]').innerHTML = `
    <div class="footer-main" id="contacts"><a class="wordmark" href="${siteUrl()}" aria-label="CROSS, главная">CROSS</a><nav class="footer-nav" aria-label="Навигация в подвале"><a href="${siteUrl('catalog/')}">Каталог</a><a href="${siteUrl('compare/')}">Сравнение</a><a href="${siteUrl()}#store">Магазин</a></nav>${socialMocks}</div>
    <div class="footer-bottom"><span>© CROSS, 2026</span><a href="#page-top" data-back-top>Наверх <span aria-hidden="true">↑</span></a></div>`;

  document.body.id = 'page-top';
  $('[data-back-top]').addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    $('.wordmark', $('[data-header]')).focus({ preventScroll: true });
  });

  const header = $('[data-header]');
  const menu = $('#models-menu');
  const toggles = $$('[data-nav-toggle]');
  let opener;
  function closeMenu(returnFocus = false) {
    menu.hidden = true;
    header.classList.remove('menu-open');
    document.body.classList.remove('nav-open');
    toggles.forEach((toggle) => toggle.setAttribute('aria-expanded', 'false'));
    $('.mobile-toggle').setAttribute('aria-label', 'Открыть меню');
    if (returnFocus) opener?.focus();
  }
  toggles.forEach((toggle) => toggle.addEventListener('click', () => {
    if (!menu.hidden) { closeMenu(); return; }
    opener = toggle;
    menu.hidden = false;
    header.classList.add('menu-open');
    document.body.classList.add('nav-open');
    toggles.forEach((item) => item.setAttribute('aria-expanded', 'true'));
    $('.mobile-toggle').setAttribute('aria-label', 'Закрыть меню');
  }));
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target) || event.target.closest('a')) closeMenu();
  });
  document.addEventListener('focusin', (event) => { if (!header.contains(event.target)) closeMenu(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !menu.hidden) closeMenu(true); });
  matchMedia('(max-width: 760px)').addEventListener('change', () => closeMenu());

  let floating = scrollY > 120;
  const updateHeader = () => {
    if (scrollY > 120) floating = true;
    else if (scrollY < 24) floating = false;
    header.classList.toggle('is-solid', page !== 'home' || floating);
    header.classList.toggle('is-floating', floating);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

function updateCompare() {
  store(localStorage, 'cross-compare', selected);
  $$('[data-compare]').forEach((input) => { input.checked = selected.includes(input.dataset.compare); });
  const tray = $('[data-compare-tray]');
  if (!tray) return;
  if (!selected.length) { tray.innerHTML = ''; document.body.classList.remove('has-compare'); return; }
  document.body.classList.add('has-compare');
  tray.innerHTML = `<aside class="compare-tray" aria-label="Выбранные модели">
    <div class="tray-selection"><span class="tray-title">Сравнение <span>${selected.length}/3</span></span><div class="tray-models">${selected.map((id) => {
      const p = products.find((item) => item.id === id);
      return `<button type="button" class="tray-model" data-remove-compare="${id}" aria-label="Убрать ${p.name} из сравнения"><img src="${p.image}" alt="" width="72" height="48">${closeIcon}</button>`;
    }).join('')}</div></div>
    <div class="tray-actions"><button class="quiet-link" type="button" data-clear-compare>Очистить</button>${selected.length > 1 ? `<a class="button button-dark" href="${siteUrl('compare/')}?models=${selected.join(',')}">Сравнить (${selected.length})</a>` : '<button class="button button-dark" type="button" disabled>Выберите ещё модель</button>'}</div>
  </aside>`;
}

document.addEventListener('change', (event) => {
  const input = event.target.closest('[data-compare]');
  if (!input) return;
  const id = input.dataset.compare;
  if (input.checked && selected.length === 3) {
    input.checked = false;
    announce('Можно сравнить до трёх моделей. Уберите одну из выбранных.');
    return;
  }
  selected = input.checked ? [...new Set([...selected, id])] : selected.filter((item) => item !== id);
  updateCompare();
  announce(`В сравнении ${selected.length} из трёх моделей.`);
});

document.addEventListener('click', (event) => {
  const remove = event.target.closest('[data-remove-compare]');
  const clear = event.target.closest('[data-clear-compare]');
  if (!remove && !clear) return;
  const removedId = remove?.dataset.removeCompare;
  selected = clear ? [] : selected.filter((id) => id !== removedId);
  updateCompare();
  if (page === 'compare') renderComparison();
  const focusTarget = removedId ? $(`[data-compare="${removedId}"]`) || $('[data-remove-compare]') || $('[data-comparison] a') : $('[data-compare]');
  focusTarget?.focus();
  announce(`В сравнении ${selected.length} из трёх моделей.`);
});

function initCatalog() {
  const params = new URLSearchParams(location.search);
  let category = ['enclosed', 'open'].includes(params.get('category')) ? params.get('category') : 'all';
  const parsePrice = (value) => value !== null && value !== '' && Number.isFinite(Number(value)) && Number(value) >= 0 ? Number(value) : null;
  let minPrice = parsePrice(params.get('min'));
  let maxPrice = parsePrice(params.get('max'));
  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) [minPrice, maxPrice] = [maxPrice, minPrice];
  const search = $('[data-search]');
  const sort = $('[data-sort]');
  search.value = params.get('q') || '';
  sort.value = ['price-asc', 'price-desc'].includes(params.get('sort')) ? params.get('sort') : 'featured';

  function renderCatalog() {
    const query = search.value.trim().toLocaleLowerCase('ru');
    const visible = products.filter((p) => {
      const searchText = [p.name, p.description, ...p.features].join(' ').toLocaleLowerCase('ru');
      return (category === 'all' || p.frame === category) && searchText.includes(query)
        && (minPrice === null || (p.price !== null && p.price >= minPrice))
        && (maxPrice === null || (p.price !== null && p.price <= maxPrice));
    });
    if (sort.value !== 'featured') visible.sort((a, b) => {
      if (a.price === null) return b.price === null ? 0 : 1;
      if (b.price === null) return -1;
      return sort.value === 'price-asc' ? a.price - b.price : b.price - a.price;
    });
    $('[data-catalog-products]').innerHTML = visible.map(productCard).join('');
    $('[data-empty]').hidden = visible.length > 0;
    const word = new Intl.PluralRules('ru').select(visible.length);
    $('[data-result-count]').textContent = `${visible.length} ${word === 'one' ? 'модель' : word === 'few' ? 'модели' : 'моделей'}`;
    $$('[data-category]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.category === category)));
    const filterCount = Number(category !== 'all') + Number(minPrice !== null || maxPrice !== null);
    $('[data-filter-count]').textContent = filterCount ? ` (${filterCount})` : '';
    $('[data-active-filters]').innerHTML = minPrice !== null || maxPrice !== null ? `<button type="button" class="active-filter" data-clear-price>${minPrice !== null ? `от ${formatPrice(minPrice)}` : ''}${minPrice !== null && maxPrice !== null ? ' ' : ''}${maxPrice !== null ? `до ${formatPrice(maxPrice)}` : ''}<span class="sr-only">, убрать фильтр цены</span>${closeIcon}</button>` : '';
    const url = new URL(location.href);
    url.search = '';
    if (category !== 'all') url.searchParams.set('category', category);
    if (query) url.searchParams.set('q', search.value.trim());
    if (sort.value !== 'featured') url.searchParams.set('sort', sort.value);
    if (minPrice !== null) url.searchParams.set('min', minPrice);
    if (maxPrice !== null) url.searchParams.set('max', maxPrice);
    history.replaceState(null, '', url);
    store(sessionStorage, 'cross-catalog-url', url.pathname + url.search);
  }
  $$('[data-category]').forEach((button) => button.addEventListener('click', () => { category = button.dataset.category; renderCatalog(); }));
  search.addEventListener('input', renderCatalog);
  sort.addEventListener('change', renderCatalog);
  $('[data-reset-catalog]').addEventListener('click', () => {
    category = 'all'; minPrice = null; maxPrice = null; search.value = ''; sort.value = 'featured'; renderCatalog(); search.focus();
  });
  $('[data-active-filters]').addEventListener('click', (event) => { if (event.target.closest('[data-clear-price]')) { minPrice = null; maxPrice = null; renderCatalog(); $('[data-open-filters]').focus(); } });

  const dialog = $('[data-filter-dialog]');
  const form = $('[data-filter-form]');
  const error = $('[data-price-error]');
  $('[data-open-filters]').addEventListener('click', () => {
    form.elements.frame.value = category;
    form.elements.min.value = minPrice ?? '';
    form.elements.max.value = maxPrice ?? '';
    error.hidden = true;
    dialog.showModal();
  });
  $('[data-close-filters]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const min = parsePrice(form.elements.min.value);
    const max = parsePrice(form.elements.max.value);
    if (min !== null && max !== null && min > max) { error.hidden = false; form.elements.max.focus(); return; }
    category = form.elements.frame.value; minPrice = min; maxPrice = max;
    renderCatalog(); dialog.close();
  });
  form.addEventListener('input', () => { error.hidden = true; });
  $('[data-reset-filters]').addEventListener('click', () => { form.reset(); error.hidden = true; });
  window.addEventListener('pagehide', () => store(sessionStorage, 'cross-catalog-scroll', scrollY));
  renderCatalog();
  if (readStored(sessionStorage, 'cross-return-catalog', false)) {
    store(sessionStorage, 'cross-return-catalog', false);
    requestAnimationFrame(() => scrollTo({ top: readStored(sessionStorage, 'cross-catalog-scroll', 0), behavior: 'instant' }));
  }
}

function initProduct() {
  const product = products.find((p) => p.id === document.body.dataset.product);
  const main = $('[data-product-page]');
  if (!product) { main.innerHTML = `<div class="empty-state"><h1>Модель не найдена</h1><a class="button button-dark" href="${siteUrl('catalog/')}">Открыть каталог</a></div>`; return; }
  const catalogPath = siteUrl('catalog/');
  const savedCatalog = readStored(sessionStorage, 'cross-catalog-url', catalogPath);
  const catalogUrl = typeof savedCatalog === 'string' && (savedCatalog === catalogPath || savedCatalog.startsWith(`${catalogPath}?`)) ? savedCatalog : catalogPath;
  main.innerHTML = `
    <div class="product-breadcrumb section-wrap"><a href="${escapeHTML(catalogUrl)}" data-return-catalog><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6"/></svg>Все модели</a></div>
    <div class="product-layout section-wrap">
      <div class="product-gallery"><button class="product-image-button" type="button" data-zoom aria-label="Увеличить фото: ${product.name}"><img src="${product.image}" alt="${product.alt}" width="1536" height="1024" fetchpriority="high" style="view-transition-name:bike-${product.id}"><span class="zoom-indicator"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4H4v5m11-5h5v5M4 15v5h5m6 0h5v-5"/></svg></span></button></div>
      <div class="product-purchase"><h1>${product.name}</h1><p class="product-description">${product.description}</p>
        ${product.variants ? `<fieldset class="variant-field"><legend>Комплектация</legend>${product.variants.map((variant, index) => `<label class="variant-option"><input type="radio" name="battery" value="${variant.id}" ${index === 0 ? 'checked' : ''}><span><span>${variant.name}<small>${variant.description}</small></span><strong>${formatPrice(variant.price)}</strong></span></label>`).join('')}</fieldset>` : ''}
        <div class="product-price" aria-live="polite" aria-atomic="true"><strong data-price>${product.variants ? formatPrice(product.variants[0].price) : `от ${formatPrice(product.price)}`}</strong><span data-price-label>${product.variants ? 'с аккумулятором' : ''}</span></div>
        <button class="button button-dark order-button" type="button" data-open-order>Заказать</button>
        <div class="purchase-compare">${comparisonControl(product)}</div>
        <details class="product-details" open><summary>Характеристики<span aria-hidden="true"></span></summary><dl>${product.specs.map(([key, value]) => `<div><dt>${key}</dt><dd${key === 'Аккумулятор' ? ' data-variant-spec' : ''}>${value}</dd></div>`).join('')}</dl></details>
      </div>
    </div>
    <section class="related-models section-wrap" aria-labelledby="related-title"><div class="section-heading"><h2 id="related-title">Ещё модели</h2><a class="text-link" href="${siteUrl('catalog/')}">Весь каталог ${arrow}</a></div><div class="product-grid related-grid">${products.filter((p) => p.id !== product.id).slice(0, 2).map(productCard).join('')}</div></section>
    <dialog class="image-dialog" data-image-dialog aria-label="Фото модели ${product.name}"><button class="icon-button" type="button" data-close-image aria-label="Закрыть фото">${closeIcon}</button><img src="${product.image}" alt="${product.alt}" width="1536" height="1024"></dialog>
    <dialog class="order-dialog" data-order-dialog aria-labelledby="order-title">
      <button class="icon-button order-close" type="button" data-close-order aria-label="Закрыть заказ">${closeIcon}</button>
      <div data-order-entry>
        <h2 id="order-title">Ваш заказ</h2>
        <div class="order-summary"><img src="${product.image}" alt="" width="180" height="120"><div><h3>${product.name}</h3><p data-order-variant></p><strong data-order-price></strong></div></div>
        <form class="order-form" data-order-form>
          <label for="order-name">Имя<input id="order-name" name="name" autocomplete="given-name" required maxlength="80" placeholder="Как к вам обращаться" autofocus></label>
          <label for="order-phone">Телефон<input id="order-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required maxlength="24" placeholder="+7 (999) 123-45-67"></label>
          <button class="button button-dark" type="submit">Оформить заказ</button>
        </form>
      </div>
      <div class="order-success" data-order-success hidden>
        <h2 id="order-success-title" tabindex="-1">Спасибо<br>за заказ</h2>
        <p>Менеджер свяжется с вами<br>в ближайшее время.</p>
        <button class="button button-dark" type="button" data-close-order>Продолжить просмотр</button>
      </div>
    </dialog>`;
  initOrderDialog(product);
  $('[data-return-catalog]').addEventListener('click', () => store(sessionStorage, 'cross-return-catalog', true));
  const imageDialog = $('[data-image-dialog]');
  $('[data-zoom]').addEventListener('click', () => imageDialog.showModal());
  $('[data-close-image]').addEventListener('click', () => imageDialog.close());
  imageDialog.addEventListener('click', (event) => { if (event.target === imageDialog) imageDialog.close(); });
  if (product.variants) {
    function setVariant(id, save = true) {
      const variant = product.variants.find((item) => item.id === id) || product.variants[0];
      $(`input[name="battery"][value="${variant.id}"]`).checked = true;
      $('[data-price]').textContent = formatPrice(variant.price);
      $('[data-price-label]').textContent = variant.name.toLocaleLowerCase('ru');
      $('[data-variant-spec]').textContent = variant.id === 'with' ? 'LiFePO4 60V 45Ah' : 'Не входит в комплект';
      if (save) { const url = new URL(location.href); url.searchParams.set('battery', variant.id); history.replaceState(null, '', url); }
    }
    $$('input[name="battery"]').forEach((input) => input.addEventListener('change', () => setVariant(input.value)));
    setVariant(new URLSearchParams(location.search).get('battery'), false);
    window.addEventListener('popstate', () => setVariant(new URLSearchParams(location.search).get('battery'), false));
  }
}

function initOrderDialog(product) {
  const dialog = $('[data-order-dialog]');
  const form = $('[data-order-form]');
  const entry = $('[data-order-entry]');
  const success = $('[data-order-success]');
  const opener = $('[data-open-order]');
  const name = form.elements.name;
  const phone = form.elements.phone;
  opener.addEventListener('click', () => {
    form.reset();
    name.setCustomValidity('');
    phone.setCustomValidity('');
    entry.hidden = false;
    success.hidden = true;
    dialog.setAttribute('aria-labelledby', 'order-title');
    const variant = product.variants?.find((item) => item.id === $('input[name="battery"]:checked')?.value);
    $('[data-order-variant]').textContent = variant?.name || '';
    $('[data-order-price]').textContent = variant ? formatPrice(variant.price) : `от ${formatPrice(product.price)}`;
    dialog.showModal();
  });
  $$('[data-close-order]', dialog).forEach((button) => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => opener.focus({ preventScroll: true }));
  name.addEventListener('input', () => name.setCustomValidity(name.value.trim() ? '' : 'Введите имя.'));
  phone.addEventListener('input', () => {
    const digits = phone.value.replace(/\D/g, '');
    phone.setCustomValidity(digits.length >= 10 && digits.length <= 15 && /^\+?[\d\s()\-]+$/.test(phone.value.trim()) ? '' : 'Введите телефон с кодом города или оператора.');
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    name.dispatchEvent(new Event('input'));
    phone.dispatchEvent(new Event('input'));
    if (!form.reportValidity()) return;
    // Local interaction prototype; connect order delivery before publishing this flow.
    entry.hidden = true;
    success.hidden = false;
    dialog.setAttribute('aria-labelledby', 'order-success-title');
    $('#order-success-title').focus({ preventScroll: true });
    form.reset();
  });
}

function renderComparison() {
  const modelList = selected.map((id) => products.find((p) => p.id === id)).filter(Boolean);
  const root = $('[data-comparison]');
  const url = new URL(location.href);
  if (selected.length) url.searchParams.set('models', selected.join(',')); else url.searchParams.delete('models');
  history.replaceState(null, '', url);
  if (!modelList.length) {
    root.innerHTML = `<div class="empty-state"><h2>Выберите модели для сравнения</h2><p>Отметьте два или три байка в каталоге.</p><a class="button button-dark" href="${siteUrl('catalog/')}">Выбрать модели</a></div>`;
    return;
  }
  const rows = [
    ['Цена', (p) => `от ${formatPrice(p.price)}`],
    ['Аккумулятор', (p) => p.battery],
    ['Мощность', (p) => p.power],
    ['Максимальная скорость', (p) => p.speed],
    ['Максимальная нагрузка', (p) => p.load],
    ['Конструкция', (p) => p.frameLabel],
    ['Сиденье / багажник', (p) => p.seat],
  ];
  const headings = modelList.map((p) => `<th scope="col"><div class="comparison-product"><button type="button" class="icon-button" data-remove-compare="${p.id}" aria-label="Убрать ${p.name} из сравнения">${closeIcon}</button><a href="${modelUrl(p)}"><img src="${p.image}" alt="${p.alt}" width="1536" height="1024"><span>${p.name}</span></a></div></th>`).join('');
  const body = rows.map(([label, value]) => `<tr><th scope="row">${label}</th>${modelList.map((p) => `<td>${value(p)}</td>`).join('')}</tr>`).join('');
  const actions = modelList.map((p) => `<td><a class="button button-dark" href="${modelUrl(p)}">Заказать</a></td>`).join('');
  root.innerHTML = `
    <p class="comparison-scroll-hint">Прокрутите таблицу, чтобы увидеть остальные модели ${arrow}</p>
    <div class="table-scroll" role="region" aria-label="Сравнение выбранных моделей, прокрутка по горизонтали" tabindex="0">
      <table class="comparison-table"><caption class="sr-only">Характеристики и комплектации моделей CROSS</caption>
        <thead><tr><td></td>${headings}</tr></thead>
        <tbody>${body}<tr><th scope="row"><span class="sr-only">Выбор модели</span></th>${actions}</tr></tbody>
      </table>
    </div>`;
}

function initRideFilm() {
  const video = $('[data-ride-video]');
  if (!video) return;
  const toggle = $('[data-film-toggle]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let inView = false;
  let userPaused = false;
  const load = () => { if (!video.getAttribute('src')) video.src = video.dataset.src; };
  const play = () => { load(); video.play().catch(() => {}); };
  const update = () => {
    toggle.setAttribute('aria-label', video.paused ? 'Воспроизвести видео' : 'Приостановить видео');
    toggle.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${video.paused ? 'm9 5 11 7-11 7Z' : 'M8 5v14M16 5v14'}"/></svg>`;
  };
  const sync = () => {
    if (!inView || document.hidden) video.pause();
    else if (!userPaused && !reducedMotion.matches && !navigator.connection?.saveData) play();
  };
  video.controls = false;
  video.muted = true;
  toggle.hidden = false;
  video.addEventListener('play', update);
  video.addEventListener('pause', update);
  video.addEventListener('error', () => {
    toggle.hidden = true;
    const message = document.createElement('span');
    message.className = 'film-fallback';
    message.textContent = 'Видео недоступно';
    video.parentElement.append(message);
  }, { once: true });
  toggle.addEventListener('click', () => {
    userPaused = !video.paused;
    if (video.paused) play();
    else video.pause();
  });
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting && entry.intersectionRatio >= .2;
    sync();
  }, { threshold: [0, .2] }).observe(video);
  document.addEventListener('visibilitychange', sync);
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) video.pause(); else sync(); });
  window.addEventListener('pagehide', () => video.pause());
}

function initPageMotion() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches || !('IntersectionObserver' in window)) return;
  const animations = new Set();
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      const animation = entry.target.animate([
        { opacity: .25, transform: 'translateY(14px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: 600, easing: 'cubic-bezier(.22, 1, .36, 1)' });
      animations.add(animation);
      animation.finished.then(() => animations.delete(animation)).catch(() => animations.delete(animation));
    }
  }, { threshold: .08 });
  $$('.home-models .section-heading, .home-models .product-grid, .location-copy, .related-models .section-heading, .footer-main').forEach((element) => {
    if (element.getBoundingClientRect().top >= innerHeight) observer.observe(element);
  });
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    observer.disconnect();
    animations.forEach((animation) => animation.cancel());
    animations.clear();
  });
}

renderChrome();
initRideFilm();
if (page === 'home') $('[data-home-products]').innerHTML = products.filter((product) => product.featured).slice(0, 6).map(productCard).join('');
if (page === 'catalog') initCatalog();
if (page === 'product') initProduct();
if (page === 'compare') {
  const ids = new URLSearchParams(location.search).get('models');
  if (ids !== null) selected = [...new Set(ids.split(','))].filter((id) => products.some((p) => p.id === id)).slice(0, 3);
  renderComparison();
}
updateCompare();
initPageMotion();
