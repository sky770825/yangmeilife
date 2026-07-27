(() => {
  const LINE_URL = 'https://line.me/ti/p/@931aeinu';
  const app = document.getElementById('vendorPageApp');
  if (!app) return;

  const vendorPageStyleId = 'vendor-page-responsive-styles';
  if (document.head && !document.getElementById(vendorPageStyleId)) {
    const style = document.createElement('style');
    style.id = vendorPageStyleId;
    style.textContent = "\n#vendorPageApp{min-width:0}\n#vendorPageApp .vendor-page-header{padding:16px}\n#vendorPageApp .vendor-page-header-layout{display:grid;grid-template-columns:minmax(0,1fr);gap:12px;align-items:start}\n#vendorPageApp .vendor-page-header-content{min-width:0}\n#vendorPageApp .vendor-page-eyebrow{font-size:14px;font-weight:900}\n#vendorPageApp .vendor-page-title{margin:4px 0 0;overflow-wrap:anywhere;font-size:28px;line-height:1.2;font-weight:900;color:#0f172a}\n#vendorPageApp .vendor-page-intro{margin:8px 0 0;max-width:768px;overflow-wrap:anywhere;color:#475569;line-height:1.55}\n#vendorPageApp .vendor-page-summary{width:fit-content;min-width:112px;justify-self:start;border:1px solid #e2e8f0;border-radius:8px;background:#fff;padding:8px 12px;text-align:center;box-shadow:0 1px 2px rgb(15 23 42 / 6%)}\n#vendorPageApp .vendor-page-summary-count{font-weight:900;color:#0f172a}\n#vendorPageApp .vendor-page-summary-label{margin-top:2px;font-size:12px;color:#64748b}\n#vendorPageApp .vendor-directory-toolbar{display:grid;grid-template-columns:minmax(0,1fr);gap:8px;align-items:center;margin-top:20px;padding:10px;border:1px solid #dbe3ed;border-radius:10px;background:#fff}\n#vendorPageApp .vendor-directory-search,#vendorPageApp .vendor-directory-sort{min-width:0;min-height:44px;border:1px solid #cbd5e1;border-radius:8px;background:#fff;padding:0 12px;font:inherit;font-weight:700;color:#0f172a;outline:none}\n#vendorPageApp .vendor-directory-search:focus,#vendorPageApp .vendor-directory-sort:focus,#vendorPageApp .vendor-view-button:focus-visible,#vendorPageApp .vendor-card-action:focus-visible,#vendorPageApp .vendor-page-join-action:focus-visible{outline:3px solid #bfdbfe;outline-offset:2px}\n#vendorPageApp .vendor-view-switch{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}\n#vendorPageApp .vendor-view-button{min-width:44px;min-height:44px;border:1px solid transparent;border-radius:8px;background:#f1f5f9;padding:8px;color:#334155;font:inherit;font-weight:800;cursor:pointer}\n#vendorPageApp .vendor-view-button[aria-pressed=\"true\"]{border-color:#1d4ed8;background:#dbeafe;color:#1e3a8a}\n#vendorPageApp .vendor-card-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:12px;align-items:start}\n#vendorPageApp .vendor-card-grid--gallery{grid-template-columns:minmax(0,1fr)}\n#vendorPageApp .vendor-card-grid--single{width:100%;max-width:620px;margin-inline:auto;grid-template-columns:minmax(0,1fr)!important}\n#vendorPageApp .vendor-card{display:flex;min-width:0;align-self:start;flex-direction:column;overflow:hidden;border:1px solid #dbe3ed;border-radius:8px;background:#fff;box-shadow:0 1px 2px rgb(15 23 42 / 8%)}\n#vendorPageApp .vendor-card-media{display:flex;width:100%;aspect-ratio:2/1;align-items:center;justify-content:center;overflow:hidden;border-bottom:1px solid #e2e8f0;background:#f8fafc;color:#64748b}\n#vendorPageApp .vendor-card-media img{display:block;width:100%;height:100%;object-fit:cover}\n#vendorPageApp .vendor-card-media--fallback svg{width:30px;height:30px;fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.6}\n#vendorPageApp .vendor-card-media--fallback::before{content:'店家資訊';font-size:13px;font-weight:800;letter-spacing:0;color:#64748b}\n#vendorPageApp .vendor-card-body{min-width:0;padding:12px}\n#vendorPageApp .vendor-card-heading{min-width:0}\n#vendorPageApp .vendor-card-title{margin:0;overflow-wrap:anywhere;word-break:break-word;font-size:18px;line-height:1.35;font-weight:900;color:#0f172a}\n#vendorPageApp .vendor-card-meta{display:flex;min-width:0;flex-wrap:wrap;gap:8px;margin-top:6px;color:#475569;font-size:14px;line-height:1.45}\n#vendorPageApp .vendor-card-meta span{min-width:0;overflow-wrap:anywhere}\n#vendorPageApp .vendor-card-tags{display:flex;min-width:0;flex-wrap:wrap;gap:8px;margin-top:10px}\n#vendorPageApp .vendor-card-tag{max-width:100%;overflow-wrap:anywhere;border-radius:999px;padding:4px 8px;font-size:12px;font-weight:800;line-height:1.3}\n#vendorPageApp .vendor-card-actions{display:grid;grid-template-columns:repeat(4,minmax(44px,1fr));gap:8px;margin-top:12px}\n#vendorPageApp .vendor-card-action{display:inline-flex;min-width:44px;min-height:44px;align-items:center;justify-content:center;gap:6px;overflow:hidden;border:1px solid #cbd5e1;border-radius:8px;background:#fff;padding:6px;color:#0f172a;font:inherit;font-size:13px;font-weight:800;line-height:1.15;text-decoration:none}\n#vendorPageApp .vendor-card-action svg{width:18px;height:18px;flex:0 0 auto;fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.8}\n#vendorPageApp .vendor-card-action-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n#vendorPageApp .vendor-card-action--disabled{cursor:not-allowed;background:#f8fafc;color:#94a3b8}\n#vendorPageApp .favorite-btn{cursor:pointer}\n#vendorPageApp .vendor-page-join{display:grid;grid-template-columns:minmax(0,1fr);gap:12px;align-items:center;margin-top:20px;border:1px solid #e2e8f0;border-radius:8px;background:#fff;padding:16px}\n#vendorPageApp .vendor-page-join-content{min-width:0}\n#vendorPageApp .vendor-page-join-title{margin:0;font-size:16px;font-weight:900;color:#0f172a}\n#vendorPageApp .vendor-page-join-text{margin:4px 0 0;overflow-wrap:anywhere;color:#475569;font-size:14px;line-height:1.5}\n#vendorPageApp .vendor-page-join-action{display:inline-flex;width:fit-content;min-width:132px;min-height:44px;align-items:center;justify-content:center;border-radius:8px;background:#0f172a;padding:0 16px;color:#fff;font-weight:900;text-decoration:none}\n@media (min-width:768px){#vendorPageApp .vendor-page-header{padding:20px}#vendorPageApp .vendor-page-header-layout{grid-template-columns:minmax(0,1fr) 132px;align-items:end}#vendorPageApp .vendor-page-summary{width:auto;justify-self:end}#vendorPageApp .vendor-directory-toolbar{grid-template-columns:minmax(0,1fr) 168px 184px}#vendorPageApp .vendor-card-grid--gallery{grid-template-columns:repeat(2,minmax(0,1fr))}#vendorPageApp .vendor-page-join{grid-template-columns:minmax(0,1fr) auto}#vendorPageApp .vendor-page-join-action{justify-self:end}}\n@media (min-width:1024px){#vendorPageApp .vendor-card-grid--compact{grid-template-columns:repeat(2,minmax(0,1fr))}#vendorPageApp .vendor-card-grid--compact .vendor-card{flex-direction:row}#vendorPageApp .vendor-card-grid--compact .vendor-card-media{width:38%;flex:0 0 38%;align-self:flex-start;border-right:1px solid #e2e8f0;border-bottom:0}#vendorPageApp .vendor-card-grid--compact .vendor-card-body{flex:1}}\n@media (min-width:1180px){#vendorPageApp .vendor-card-grid--gallery{grid-template-columns:repeat(3,minmax(0,1fr))}}\n@media (max-width:430px){#vendorPageApp .vendor-card-action-label{display:none}#vendorPageApp .vendor-card-action{padding:6px}}\n";
    document.head.appendChild(style);
  }

  const page = app.dataset.vendorPage || location.pathname.split('/').pop();
  const state = {
    vendors: [],
    query: '',
    sort: 'default',
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
      bookmark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 21 12 17 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/></svg>',
      store: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v10h16V10"/><path d="M3 10 5 4h14l2 6"/><path d="M3 10c.6 1.5 2 2 3.5 2S9.4 11.5 10 10c.6 1.5 2 2 3.5 2s2.9-.5 3.5-2c.6 1.5 2 2 3.5 2S23.4 11.5 24 10"/><path d="M9 20v-5h6v5"/></svg>'
    };
    return icons[name] || icons.link;
  };

  const mediaFallbackMarkup = (name) =>
    '<div class="vendor-card-media vendor-card-media--fallback" role="img" aria-label="' + escapeHtml(name) + '：暫無核可圖片">' + iconSvg('store') + '</div>';

  const showMediaFallback = (media, name) => {
    media.classList.add('vendor-card-media--fallback');
    media.setAttribute('role', 'img');
    media.setAttribute('aria-label', name + '：暫無核可圖片');
    media.removeAttribute('data-vendor-name');
    media.innerHTML = iconSvg('store');
  };

  app.addEventListener('error', (event) => {
    const image = event.target;
    if (!image || !image.classList || !image.classList.contains('vendor-card-image')) return;
    const media = image.parentElement;
    if (!media || !media.classList || !media.classList.contains('vendor-card-media')) return;
    const name = image.alt || media.dataset.vendorName || '店家';
    image.remove();
    showMediaFallback(media, name);
  }, true);

  const quickAction = (icon, label, href, options = {}) => {
    const { external = false, title = null, ariaLabel = label } = options;
    const iconMarkup = iconSvg(icon);
    const labelMarkup = `<span class="vendor-card-action-label">${escapeHtml(label)}</span>`;
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
    if (emptyish(href)) {
      return `<span class="vendor-card-action vendor-card-action--disabled" aria-disabled="true"${titleAttr || ` title="${escapeHtml(label)}"`} aria-label="${escapeHtml(ariaLabel)}">${iconMarkup}${labelMarkup}</span>`;
    }
    return `<a class="vendor-card-action" href="${escapeHtml(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}${titleAttr} aria-label="${escapeHtml(ariaLabel)}">${iconMarkup}${labelMarkup}</a>`;
  };

  const vendorCard = (vendor, category) => {
    const favorites = readFavorites();
    const favored = favorites.some((item) => item.id === vendor.id);
    const officialLabel = vendor.officialSource || vendor.officialUrl || '';
    const officialHref = vendor.officialUrl || null;
    const officialDisplayLabel = officialSourceShortLabel(vendor);
    const contactHref = vendor.lineUrl || vendor.officialUrl || null;
    const contactLabel = vendor.lineUrl ? 'LINE' : officialDisplayLabel;
    const contactTitle = vendor.lineUrl ? '開啟店家 LINE' : (officialLabel || '店家聯絡方式待補');
    const contactAriaLabel = vendor.lineUrl
      ? '開啟店家 LINE：' + vendor.name
      : (officialHref ? '開啟官方來源：' + officialLabel : '店家聯絡方式待補');
    const metaItems = [vendor.area].filter((value) => !emptyish(value));
    const phoneHref = vendor.phone ? 'tel:' + String(vendor.phone).replace(/[^0-9+#*,-]/g, '') : null;
    const imageUrl = typeof vendor.img === 'string' && new RegExp('^(?:https?:/{2}|/(?!/)|[.]{1,2}/|assets/)', 'i').test(vendor.img.trim())
      ? vendor.img.trim()
      : null;
    const imageMarkup = imageUrl
      ? '<div class="vendor-card-media" data-vendor-name="' + escapeHtml(vendor.name) + '"><img class="vendor-card-image" src="' + escapeHtml(imageUrl) + '" alt="' + escapeHtml(vendor.name) + '" loading="lazy" decoding="async" width="640" height="360"></div>'
      : mediaFallbackMarkup(vendor.name);
  return `<article class="vendor-card" data-search="${escapeHtml(searchHaystack(vendor))}">
      ${imageMarkup}
      <div class="vendor-card-body">
        <div class="vendor-card-heading">
          <h2 class="vendor-card-title">${escapeHtml(vendor.name)}</h2>
        </div>
        <div class="vendor-card-meta">
          ${metaItems.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}
        </div>
        <div class="vendor-card-tags">
          ${vendor.tags.slice(0, 3).map((tag) => `<span class="vendor-card-tag" style="background:${category.accent}16;color:${category.accent}">${escapeHtml(tag)}</span>`).join('')}
        </div>
        <div class="vendor-card-actions">
          ${quickAction('phone', '電話', phoneHref, { title: vendor.phone || '電話待補', ariaLabel: vendor.phone ? '撥打電話：' + vendor.phone : '電話待補' })}
          ${quickAction('map', '導航', vendor.mapUrl || null, { external: Boolean(vendor.mapUrl), title: vendor.address || '地址待補', ariaLabel: vendor.address ? '導航到：' + vendor.address : '地址待補' })}
          ${quickAction('message', contactLabel, contactHref, { external: Boolean(contactHref), title: contactTitle, ariaLabel: contactAriaLabel })}
          <button class="favorite-btn vendor-card-action" type="button" data-vendor-id="${escapeHtml(vendor.id)}" aria-label="收藏 ${escapeHtml(vendor.name)}" title="收藏 ${escapeHtml(vendor.name)}" aria-pressed="${favored}">${iconSvg('bookmark')}<span class="vendor-card-action-label">${favored ? '已收藏' : '收藏'}</span></button>
        </div>
      </div>
    </article>`;
  };

  const applyFilters = (category) => {
    const query = state.query.trim().toLowerCase();
    let vendors = [...state.vendors];
    if (query) vendors = vendors.filter((vendor) => searchHaystack(vendor).includes(query));
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
      <header class="vendor-page-header panel">
        <div class="vendor-page-header-layout">
          <div class="vendor-page-header-content">
            <div class="vendor-page-eyebrow" style="color:${category.accent}">店家分類</div>
            <h1 class="vendor-page-title">${escapeHtml(displayTitle)}</h1>
            <p class="vendor-page-intro">${escapeHtml(displayIntro)}</p>
          </div>
          <div class="vendor-page-summary">
            <div id="vendorCount" class="vendor-page-summary-count">0 家</div>
            <div class="vendor-page-summary-label">店家</div>
          </div>
        </div>
      </header>
      <section class="vendor-directory-toolbar" aria-label="店家瀏覽工具">
        <input id="vendorSearch" class="vendor-directory-search" type="search" placeholder="搜尋店名、地區、電話或地址" aria-label="搜尋店家">
        <select id="vendorSort" class="vendor-directory-sort" aria-label="排序方式">
          <option value="default">預設排序</option>
          <option value="area">依地區</option>
        </select>
        <div class="vendor-view-switch" aria-label="檢視方式">
          <button class="vendor-view-button" type="button" data-view="compact" aria-pressed="${state.view === 'compact'}" aria-label="精簡檢視" title="精簡檢視">精簡</button>
          <button class="vendor-view-button" type="button" data-view="gallery" aria-pressed="${state.view === 'gallery'}" aria-label="圖庫檢視" title="圖庫檢視">大圖</button>
        </div>
      </section>
      <section id="vendorGrid" class="mt-5"></section>
      <p id="vendorEmpty" class="mt-5 rounded-xl bg-white p-5 text-center font-bold text-slate-500" hidden>沒有符合的廠商</p>
      <section class="vendor-page-join">
        <div class="vendor-page-join-content">
          <h2 class="vendor-page-join-title">想讓店家出現在這裡？</h2>
          <p class="vendor-page-join-text">提供店名、地址、電話與官方連結，我們會協助整理成店家卡片。</p>
        </div>
        <a class="vendor-page-join-action" href="${LINE_URL}" target="_blank" rel="noopener noreferrer">新增我的店</a>
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
