(() => {
  const app = document.getElementById('servicePageApp');
  if (!app) return;

  const pageId = app.dataset.servicePage;
  const configs = Array.isArray(window.YANGMEI_SERVICE_PAGES) ? window.YANGMEI_SERVICE_PAGES : [];
  const config = configs.find((item) => item.id === pageId);

  const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const formatMoney = (value) => {
    const number = Number(value) || 0;
    return 'NT$ ' + new Intl.NumberFormat('zh-TW', {
      maximumFractionDigits: 0
    }).format(number);
  };

  const readChecks = () => {
    try {
      return JSON.parse(localStorage.getItem('yangmei_service_checks_' + pageId) || '[]');
    } catch {
      return [];
    }
  };

  const saveChecks = (checks) => {
    try {
      localStorage.setItem('yangmei_service_checks_' + pageId, JSON.stringify(checks));
    } catch {}
  };

  const renderCard = (item) => `<article class="service-card rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4" data-search="${escapeHtml([item.title, item.meta, item.desc, ...(item.tags || [])].join(' ').toLowerCase())}">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h2 class="compact-title text-base font-black leading-snug text-slate-950 sm:text-lg">${escapeHtml(item.title)}</h2>
        <p class="mt-1 text-sm font-bold" style="color:${config.accent}">${escapeHtml(item.meta)}</p>
      </div>
      <span class="h-3 w-3 shrink-0 rounded-full" style="background:${config.accent}"></span>
    </div>
    <p class="compact-desc compact-desc--3 mt-2 text-sm leading-5 text-slate-600">${escapeHtml(item.desc)}</p>
    <div class="service-card-tags mt-2 flex flex-wrap gap-1">
      ${(item.tags || []).map((tag) => `<span class="rounded-full px-2 py-1 text-xs font-black" style="background:${config.accent}14;color:${config.accent}">${escapeHtml(tag)}</span>`).join('')}
    </div>
    ${item.href ? `<a class="mt-3 inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-950 px-3 text-sm font-black text-white hover:bg-indigo-700" href="${escapeHtml(item.href)}"${String(item.href).startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''}>開啟相關功能</a>` : ''}
  </article>`;

  const renderChecklist = () => {
    const checks = readChecks();
    const items = config.checklist || [];
    const completed = items.filter((_, index) => checks[index]).length;
    const percent = items.length ? Math.round((completed / items.length) * 100) : 0;
    return `<section class="mt-4 rounded-xl bg-white p-4 shadow-sm">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-lg font-black text-slate-950 sm:text-xl">處理清單</h2>
          <p class="mt-1 text-sm text-slate-600">目前進度 ${completed}/${items.length}</p>
        </div>
        <div class="h-3 w-full overflow-hidden rounded-full bg-slate-100 sm:w-52">
          <div id="checkProgressBar" class="h-full rounded-full" style="width:${percent}%;background:${config.accent}"></div>
        </div>
      </div>
      <div class="mt-3 grid gap-2">
        ${items.map((item, index) => `<label class="flex min-h-11 items-center gap-3 rounded-xl bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700">
          <input class="service-check h-5 w-5 rounded border-slate-300" type="checkbox" data-check-index="${index}" ${checks[index] ? 'checked' : ''}>
          <span>${escapeHtml(item)}</span>
        </label>`).join('')}
      </div>
    </section>`;
  };

  const renderCalculator = () => {
    if (!config.calculator) return '';
    const calculator = config.calculator;
    return `<section class="mt-4 rounded-xl bg-slate-950 p-4 text-white shadow-sm sm:p-5">
      <div class="grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
        <div>
          <div class="text-sm font-black text-indigo-200">${escapeHtml(calculator.label)}</div>
          <h2 class="mt-1 text-xl font-black sm:text-2xl">預算快速估算</h2>
          <div class="mt-3 grid gap-3 sm:grid-cols-2">
            <label class="block">
              <span class="text-sm font-bold text-slate-300">數量 / ${escapeHtml(calculator.unit)}</span>
              <input id="calcQuantity" class="mt-1 min-h-11 w-full rounded-xl border border-white/20 bg-white px-4 font-black text-slate-950 outline-none" type="number" min="1" value="${calculator.defaultQuantity}">
            </label>
            <div class="rounded-xl bg-white/10 p-3">
              <div class="text-sm font-bold text-slate-300">估算結果</div>
              <div id="calcTotal" class="mt-1 text-2xl font-black">NT$0</div>
            </div>
          </div>
          <div class="mt-3 grid gap-2 sm:grid-cols-2">
            ${calculator.options.map((option, index) => `<label class="flex min-h-11 items-center gap-3 rounded-xl bg-white/10 px-3 py-2 text-sm font-bold">
              <input class="calc-option h-5 w-5" type="checkbox" data-calc-index="${index}" checked>
              <span class="min-w-0 flex-1">${escapeHtml(option.label)}</span>
              <span class="text-slate-300">${formatMoney(option.price)}${option.mode === 'perUnit' ? '/' + escapeHtml(calculator.unit) : ''}</span>
            </label>`).join('')}
          </div>
        </div>
        <div class="rounded-xl bg-white/10 p-4 text-sm leading-6 text-slate-200">
          實際報價會因材料、樓層、動線、施工時段與現場條件調整。這裡先做內容頁的基本估算比例。
        </div>
      </div>
    </section>`;
  };

  const updateChecklist = () => {
    const checks = Array.from(app.querySelectorAll('.service-check')).map((input) => input.checked);
    saveChecks(checks);
    const items = config.checklist || [];
    const completed = checks.filter(Boolean).length;
    const percent = items.length ? Math.round((completed / items.length) * 100) : 0;
    const text = app.querySelector('#checkProgressText');
    const bar = app.querySelector('#checkProgressBar');
    if (text) text.textContent = `${completed}/${items.length}`;
    if (bar) bar.style.width = percent + '%';
  };

  const updateCalculator = () => {
    if (!config.calculator) return;
    const quantity = Math.max(1, Number(app.querySelector('#calcQuantity')?.value || config.calculator.defaultQuantity || 1));
    let total = 0;
    app.querySelectorAll('.calc-option').forEach((input) => {
      if (!input.checked) return;
      const option = config.calculator.options[Number(input.dataset.calcIndex)];
      if (!option) return;
      total += option.mode === 'perUnit' ? option.price * quantity : option.price;
    });
    const target = app.querySelector('#calcTotal');
    if (target) target.textContent = formatMoney(total);
  };

  const render = () => {
    if (!config) {
      app.innerHTML = '<section class="panel rounded-2xl p-6"><h1 class="text-2xl font-black">找不到頁面資料</h1></section>';
      return;
    }

    app.innerHTML = `
      <nav class="mb-5 flex flex-wrap gap-2 text-sm">
        <a class="nav-link bg-white text-indigo-700 shadow-sm" href="index.html">首頁</a>
        <a class="nav-link bg-white text-indigo-700 shadow-sm" href="pages/index.html">功能分類</a>
        <a class="nav-link bg-slate-900 text-white shadow-sm" href="${escapeHtml(config.categoryUrl)}">${escapeHtml(config.categoryTitle)}</a>
      </nav>
      <header class="entry-hero panel rounded-2xl p-6 sm:p-8">
        <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
          <div>
            <div class="text-sm font-black" style="color:${config.accent}">${escapeHtml(config.categoryTitle)}</div>
            <h1 class="entry-hero-title mt-2 text-3xl font-black tracking-tight sm:text-4xl">${escapeHtml(config.title)}</h1>
            <p class="entry-hero-text mt-3 max-w-3xl text-slate-600">${escapeHtml(config.summary || config.description)}</p>
          </div>
          <div class="grid grid-cols-3 gap-2 text-center text-sm">
            ${(config.highlights || []).slice(0, 3).map((item) => `<div class="rounded-xl bg-white px-2 py-2 shadow-sm"><div class="font-black leading-tight text-slate-950">${escapeHtml(item)}</div><div class="text-xs text-slate-500">重點</div></div>`).join('')}
          </div>
        </div>
      </header>
      ${renderCalculator()}
      <section class="search-shell mt-4 rounded-2xl bg-white/80 p-3 shadow-sm">
        <input id="serviceSearch" class="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 font-bold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" type="search" placeholder="搜尋此頁項目">
      </section>
      <section id="serviceGrid" class="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        ${(config.items || []).map(renderCard).join('')}
      </section>
      <p id="serviceEmpty" class="mt-4 rounded-xl bg-white p-4 text-center font-bold text-slate-500" hidden>沒有符合的項目</p>
      `;

    app.querySelector('#serviceSearch')?.addEventListener('input', (event) => {
      const query = event.target.value.trim().toLowerCase();
      let visible = 0;
      app.querySelectorAll('.service-card').forEach((card) => {
        const matched = !query || card.dataset.search.includes(query);
        card.hidden = !matched;
        if (matched) visible += 1;
      });
      const empty = app.querySelector('#serviceEmpty');
      if (empty) empty.hidden = visible > 0;
    });
    app.querySelectorAll('.service-check').forEach((input) => input.addEventListener('change', updateChecklist));
    app.querySelector('#calcQuantity')?.addEventListener('input', updateCalculator);
    app.querySelectorAll('.calc-option').forEach((input) => input.addEventListener('change', updateCalculator));
    updateCalculator();
  };

  render();
})();
