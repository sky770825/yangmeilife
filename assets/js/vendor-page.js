(() => {
  const LINE_URL = 'https://line.me/ti/p/@931aeinu';
  const app = document.getElementById('vendorPageApp');
  if (!app) return;

  const page = app.dataset.vendorPage || location.pathname.split('/').pop();
  const state = {
    vendors: [],
    query: '',
    sort: 'default',
    filter: 'all',
    view: localStorage.getItem('yangmeiVendorView') || 'compact'
  };

  const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const readFavorites = () => {
    try { return JSON.parse(localStorage.getItem('yangmei_favorites') || '[]'); }
    catch { return []; }
  };

  const saveFavorites = (favorites) => {
    try { localStorage.setItem('yangmei_favorites', JSON.stringify(favorites)); }
    catch {}
  };

  const toast = (message) => {
    const node = document.createElement('div');
    node.className = 'fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-xl';
    node.textContent = message;
    document.body.appendChild(node);
    setTimeout(() => node.remove(), 1800);
  };

  const emptyish = (value) => value === null || value === undefined || value === '';

  const consumerVendorTitle = (title = '') => String(title || '').replace(/廠商/g, '店家');

  const consumerVendorIntro = (intro = '') => {
    const text = String(intro || '');
    if (!text) return '';
    return text
      .replace('此頁先補入飲品周邊廠商卡，讓餐飲專區內容更完整。', '精選楊梅在地飲品店，快速查看電話、導航與官方資訊。')
      .replace('此分類正在建置真實店家資料，展示店名已移至待補清單，待官方來源確認後再上架。', '這個分類的店家資料正在整理中，歡迎推薦在地店家。')
      .replace('此分類尚未收錄已核實店家；展示資料已移出前台，待確認官方來源後再上架。', '這個分類的店家資料正在整理中，歡迎推薦在地店家。')
      .replace('僅收錄已核實電話、地址與公開來源的店家。', '方便快速查看電話、地址與公開資訊。')
      .replace(/廠商/g, '店家');
  };

  const hasOfficialSource = (vendor) =>
    !emptyish(vendor.officialUrl)
    || !emptyish(vendor.officialSource)
    || (Array.isArray(vendor.sourceUrls) && vendor.sourceUrls.length > 0);

  const normalizeVendor = (vendor) => {
    const missingFields = Array.isArray(vendor.missingFields) ? vendor.missingFields : [];
    const verified = vendor.verified === true;
    const image = vendor.img || vendor.image;
    const imageSourceType = vendor.imageSourceType || (String(image || '').includes('images.unsplash.com') ? 'stock' : 'official');
    return {
      ...vendor,
      img: image,
      imageSourceType,
      tags: vendor.tags || [],
      missingFields,
      verified,
      needsVerification: vendor.needsVerification !== false && !verified,
      verificationStatus: vendor.verificationStatus || (verified ? '已核實' : '待核實'),
      verificationLevel: vendor.verificationLevel || (verified ? 'verified' : 'demo'),
      contactNote: vendor.contactNote || ''
    };
  };

  const searchHaystack = (vendor) => [
    vendor.name,
    vendor.area,
    vendor.price,
    vendor.phone,
    vendor.address,
    vendor.contactNote,
    vendor.verificationStatus,
    vendor.verificationLevel,
    ...(vendor.tags || []),
    ...(vendor.missingFields || [])
  ].filter((value) => !emptyish(value)).join(' ').toLowerCase();

  const officialSourceShortLabel = (vendor) => {
    const label = String(vendor.officialSource || '');
    const href = String(vendor.officialUrl || (vendor.sourceUrls && vendor.sourceUrls[0]) || '');
    const hrefLower = href.toLowerCase();
    const labelLower = label.toLowerCase();
    if (hrefLower.includes('line.me')) return 'LINE';
    if (hrefLower.includes('facebook.com')) return 'FB';
    if (hrefLower.includes('instagram.com')) return 'IG';
    if (href) return '官網';
    if (labelLower.includes('line')) return 'LINE';
    if (labelLower.includes('facebook')) return 'FB';
    if (labelLower.includes('instagram')) return 'IG';
    if (label.includes('公司') || label.includes('登記')) return '登記';
    if (label.includes('官方網站') || label.includes('官網')) return '官網';
    return '官方';
  };

  const iconSvg = (name) => {
    const icons = {
      phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.32 1.77.59 2.61a2 2 0 0 1-.45 2.11L8 9.69a16 16 0 0 0 6.31 6.31l1.25-1.25a2 2 0 0 1 2.11-.45c.84.27 1.71.47 2.61.59A2 2 0 0 1 22 16.92Z"/></svg>',
      map: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
      link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 0 0-7.07-7.07L11 4.93"/><path d="M14 11a5 5 0 0 0-7.07 0L4.81 13.12a5 5 0 0 0 7.07 7.07L13 19.07"/></svg>',
      message: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/></svg>',
      bookmark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 21 12 17 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/></svg>'
    };
    return icons[name] || icons.link;
  };

  const quickLink = (icon, label, href, options = {}) => {
    const { external = false, title = null, ariaLabel = label } = options;
    if (emptyish(href)) {
      return `<span class="vendor-card-link vendor-card-link--disabled" aria-disabled="true" title="${escapeHtml(label)}">${iconSvg(icon)}<span class="vendor-card-link-label">${escapeHtml(label)}</span></span>`;
    }
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
    return `<a class="vendor-card-link" href="${escapeHtml(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}${titleAttr} aria-label="${escapeHtml(ariaLabel)}">${iconSvg(icon)}<span class="vendor-card-link-label">${escapeHtml(label)}</span></a>`;
  };

  const vendorCard = (vendor, category) => {
    const favorites = readFavorites();
    const favored = favorites.some((item) => item.id === vendor.id);
    const officialLabel = vendor.officialSource || vendor.officialUrl || '';
    const officialHref = vendor.officialUrl || null;
    const officialDisplayLabel = officialSourceShortLabel(vendor);
    const metaItems = [vendor.area, vendor.price].filter((value) => !emptyish(value));
    const inquiryHref = vendor.lineUrl || vendor.officialUrl || null;
    const phoneHref = vendor.phone ? 'tel:' + String(vendor.phone).replace(/[^0-9+#*,-]/g, '') : null;
    const imageUrl = typeof vendor.img === 'string' && new RegExp('^(?:https?:/{2}|/(?!/)|[.]{1,2}/|assets/)', 'i').test(vendor.img.trim())
      ? vendor.img.trim()
      : null;
    const imageMarkup = imageUrl
      ? '<img class="vendor-card-image" src="' + escapeHtml(imageUrl) + '" alt="' + escapeHtml(vendor.name) + '" loading="lazy" decoding="async" width="640" height="360">'
      : '';
  return `<article class="vendor-card" data-search="${escapeHtml(searchHaystack(vendor))}">
      ${imageMarkup}
      <div class="vendor-card-body">
        <div class="vendor-card-heading">
          <h2 class="vendor-card-title">${escapeHtml(vendor.name)}</h2>
        </div>
        <div class="vendor-card-meta">
          ${metaItems.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}
        </div>
        <div class="vendor-card-links">
          ${quickLink('phone', '撥打', phoneHref, { title: vendor.phone || '電話待補', ariaLabel: vendor.phone ? '撥打電話：' + vendor.phone : '電話待補' })}
          ${quickLink('map', '導航', vendor.mapUrl || null, { external: Boolean(vendor.mapUrl), title: vendor.address || '地址待補', ariaLabel: vendor.address ? '導航到：' + vendor.address : '地址待補' })}
          ${hasOfficialSource(vendor)
            ? quickLink('link', officialDisplayLabel, officialHref, { external: true, title: officialLabel, ariaLabel: '開啟官方來源：' + officialLabel })
            : quickLink('link', '官方', null, { title: '來源待補', ariaLabel: '官方來源待補' })}
        </div>
        <div class="vendor-card-tags">
          ${vendor.tags.slice(0, 3).map((tag) => `<span class="vendor-card-tag" style="background:${category.accent}16;color:${category.accent}">${escapeHtml(tag)}</span>`).join('')}
        </div>
        <div class="vendor-card-actions">
          ${inquiryHref
            ? `<a class="vendor-card-action vendor-card-action--primary" style="background:${category.accent}" href="${escapeHtml(inquiryHref)}" target="_blank" rel="noopener noreferrer">${iconSvg('message')}<span>洽詢</span></a>`
            : `<span class="vendor-card-action vendor-card-action--secondary" aria-disabled="true" title="店家聯絡方式待補">${iconSvg('message')}<span>洽詢</span></span>`}
          <button class="favorite-btn vendor-card-action vendor-card-action--secondary" type="button" data-vendor-id="${escapeHtml(vendor.id)}">${iconSvg('bookmark')}<span>${favored ? '已收藏' : '收藏'}</span></button>
        </div>
      </div>
    </article>`;
  };

  const matchesFilter = (vendor) => {
    if (state.filter === 'all') return true;
    if (state.filter === 'verified') return vendor.verified;
    if (state.filter === 'needs-verification') return vendor.needsVerification || !vendor.verified;
    if (state.filter === 'missing-contact') {
      return vendor.missingFields.includes('phone') || vendor.missingFields.includes('address');
    }
    if (state.filter === 'missing-source') return vendor.missingFields.includes('officialSource');
    return true;
  };

  const applyFilters = (category) => {
    const query = state.query.trim().toLowerCase();
    let vendors = [...state.vendors];
    if (query) vendors = vendors.filter((vendor) => searchHaystack(vendor).includes(query));
    vendors = vendors.filter(matchesFilter);
    if (state.sort === 'price-low') vendors.sort((a, b) => Number(String(a.price).replace(/[^0-9]/g, '') || 0) - Number(String(b.price).replace(/[^0-9]/g, '') || 0));
    if (state.sort === 'price-high') vendors.sort((a, b) => Number(String(b.price).replace(/[^0-9]/g, '') || 0) - Number(String(a.price).replace(/[^0-9]/g, '') || 0));
    if (state.sort === 'area') vendors.sort((a, b) => String(a.area).localeCompare(String(b.area), 'zh-Hant'));

    const grid = app.querySelector('#vendorGrid');
    const count = app.querySelector('#vendorCount');
    const empty = app.querySelector('#vendorEmpty');
    grid.className = state.view === 'compact'
      ? 'vendor-card-grid vendor-card-grid--compact'
      : 'vendor-card-grid vendor-card-grid--gallery';
    if (vendors.length === 1) grid.className += ' vendor-card-grid--single';
    grid.innerHTML = vendors.map((vendor) => vendorCard(vendor, category)).join('');
    count.textContent = `${vendors.length} 家`;
    empty.textContent = state.vendors.length === 0 ? '這個分類的店家資料正在整理中，歡迎推薦在地店家。' : '沒有符合的店家';
    empty.hidden = vendors.length > 0;
  };

  const wireControls = (category) => {
    app.querySelector('#vendorSearch').addEventListener('input', (event) => {
      state.query = event.target.value;
      applyFilters(category);
    });
    app.querySelector('#vendorSort').addEventListener('change', (event) => {
      state.sort = event.target.value;
      applyFilters(category);
    });
    app.querySelector('#vendorFilter').addEventListener('change', (event) => {
      state.filter = event.target.value;
      applyFilters(category);
    });
    app.querySelectorAll('[data-view]').forEach((button) => {
      button.addEventListener('click', () => {
        state.view = button.dataset.view;
        localStorage.setItem('yangmeiVendorView', state.view);
        app.querySelectorAll('[data-view]').forEach((node) => node.setAttribute('aria-pressed', String(node.dataset.view === state.view)));
        applyFilters(category);
      });
    });
    app.addEventListener('click', (event) => {
      const button = event.target.closest('.favorite-btn');
      if (!button) return;
      const id = button.dataset.vendorId;
      const vendor = state.vendors.find((item) => item.id === id);
      if (!vendor) return;
      const favorites = readFavorites();
      const index = favorites.findIndex((item) => item.id === id);
      if (index >= 0) {
        favorites.splice(index, 1);
        toast('已取消收藏');
      } else {
        favorites.push({ id, name: vendor.name, category: category.displayTitle || consumerVendorTitle(category.title), pageUrl: page, addedAt: Date.now() });
        toast('已加入收藏');
      }
      saveFavorites(favorites);
      applyFilters(category);
    });
  };

  const render = (category) => {
    state.vendors = category.vendors.map(normalizeVendor);
    const displayTitle = category.displayTitle || consumerVendorTitle(category.title);
    const displayIntro = category.displayIntro || consumerVendorIntro(category.intro);
    const displayCategoryTitle = consumerVendorTitle(category.categoryTitle);
    app.innerHTML = `
      <nav class="mb-5 flex flex-wrap gap-2 text-sm">
        <a class="nav-link bg-white text-indigo-700 shadow-sm" href="index.html">首頁</a>
        <a class="nav-link bg-white text-indigo-700 shadow-sm" href="pages/index.html">功能分類</a>
        <a class="nav-link bg-slate-900 text-white shadow-sm" href="${escapeHtml(category.categoryUrl)}">${escapeHtml(displayCategoryTitle)}</a>
      </nav>
      <header class="panel rounded-2xl p-6 sm:p-8">
        <div class="ui-min-w-0 flex min-w-0 flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div class="ui-min-w-0 min-w-0">
            <div class="text-sm font-black" style="color:${category.accent}">店家分類</div>
            <h1 class="mt-2 text-3xl font-black tracking-tight sm:text-4xl">${escapeHtml(displayTitle)}</h1>
            <p class="mt-3 max-w-3xl text-slate-600">${escapeHtml(displayIntro)}</p>
          </div>
          <div class="ui-min-w-0 grid min-w-0 grid-cols-1 gap-2 text-center text-sm">
            <div class="ui-min-w-0 min-w-0 rounded-xl bg-white px-3 py-2 shadow-sm"><div id="vendorCount" class="font-black text-slate-950">0 家</div><div class="text-xs text-slate-500">店家</div></div>
          </div>
        </div>
      </header>
      <section class="mt-5 grid gap-3 rounded-2xl bg-white/80 p-3 shadow-sm md:grid-cols-[1fr_auto_auto] md:items-center">
        <input id="vendorSearch" class="min-h-11 min-w-0 rounded-xl border border-slate-300 bg-white px-4 font-bold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" type="search" placeholder="搜尋店名、地區、電話或地址">
        <select id="vendorFilter" class="hidden" aria-label="篩選方式">
          <option value="all">全部</option>
        </select>
        <select id="vendorSort" class="min-h-11 min-w-0 rounded-xl border border-slate-300 bg-white px-3 font-bold outline-none focus:border-indigo-500" aria-label="排序方式">
          <option value="default">預設排序</option>
          <option value="price-low">價格低到高</option>
          <option value="price-high">價格高到低</option>
          <option value="area">依地區</option>
        </select>
        <div class="grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          <button class="rounded-lg px-3 py-2 text-sm font-black" type="button" data-view="compact" aria-pressed="${state.view === 'compact'}">精簡</button>
          <button class="rounded-lg px-3 py-2 text-sm font-black" type="button" data-view="gallery" aria-pressed="${state.view === 'gallery'}">大圖</button>
        </div>
      </section>
      <section id="vendorGrid" class="mt-5"></section>
      <p id="vendorEmpty" class="mt-5 rounded-xl bg-white p-5 text-center font-bold text-slate-500" hidden>沒有符合的廠商</p>
      <section class="mt-5 flex flex-col gap-3 rounded-2xl bg-white/80 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="font-black text-slate-950">想讓店家出現在這裡？</h2>
          <p class="mt-1 text-sm leading-6 text-slate-600">提供店名、地址、電話與官方連結，我們會協助整理成店家卡片。</p>
        </div>
        <a class="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-950 px-4 font-black text-white" href="${LINE_URL}" target="_blank" rel="noopener noreferrer">新增我的店</a>
      </section>`;
    app.querySelectorAll('[data-view]').forEach((node) => node.setAttribute('aria-pressed', String(node.dataset.view === state.view)));
    wireControls(category);
    applyFilters(category);
  };

  const loadVendorData = window.YANGMEI_VENDOR_CATEGORIES
    ? Promise.resolve({ categories: window.YANGMEI_VENDOR_CATEGORIES })
    : fetch('data/vendors/vendor-categories.json').then((response) => response.json());

  loadVendorData
    .then((data) => {
      const category = data.categories.find((item) => item.page === page);
      if (!category) throw new Error(`找不到廠商分類：${page}`);
      render(category);
    })
    .catch((error) => {
      app.innerHTML = `<section class="panel rounded-2xl p-6"><h1 class="text-2xl font-black">廠商資料載入失敗</h1><p class="mt-2 text-slate-600">${escapeHtml(error.message)}</p></section>`;
    });
})();
