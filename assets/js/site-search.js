(() => {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('results');
  const summary = document.getElementById('resultSummary');
  const form = document.getElementById('searchForm');
  const categoryFilter = document.getElementById('categoryFilter');
  const services = Array.isArray(window.YANGMEI_SEARCH_SERVICES) ? window.YANGMEI_SEARCH_SERVICES : [];

  const normalize = (value) => String(value || '').trim().toLowerCase();
  const renderCategories = () => {
    const categories = [...new Map(services.map((item) => [item.category, item.categoryTitle])).entries()];
    categoryFilter.innerHTML = '<option value="">全部分類</option>' + categories.map(([id, title]) => `<option value="${id}">${title}</option>`).join('');
  };

  const render = () => {
    const query = normalize(input.value);
    const category = categoryFilter.value;
    const matched = services.filter((item) => {
      const haystack = [item.title, item.desc, item.categoryTitle, item.status, ...(item.tags || [])].join(' ').toLowerCase();
      return (!query || haystack.includes(query)) && (!category || item.category === category);
    });

    summary.textContent = query || category
      ? `找到 ${matched.length} 筆結果`
      : `目前收錄 ${services.length} 個功能，可直接搜尋或依分類篩選。`;

    results.innerHTML = matched.map((item) => {
      const isExternal = item.url.startsWith('http');
      const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      const secondaryUrl = item.secondaryTargetUrl || '';
      const hasSecondary = Boolean(secondaryUrl);
      const secondaryTarget = secondaryUrl.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
      const secondaryLabel = item.secondaryTargetType === 'external-link' ? '前往服務' : '查看內容';
      const primaryLabel = isExternal ? '前往服務' : '查看內容';
      return `<article class="result-card rounded-xl p-3 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg sm:p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="text-xs font-black text-indigo-700">${item.categoryTitle}</div>
            <div class="compact-title mt-1 text-base font-black leading-snug text-gray-900 sm:text-lg">${item.title}</div>
          </div>
          <span class="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs font-black text-slate-600">${item.status}</span>
        </div>
        <div class="compact-desc compact-desc--2 mt-2 text-sm leading-5 text-gray-600">${item.desc}</div>
        <div class="mt-2 flex flex-wrap gap-1">
          ${(item.tags || []).map((tag) => `<span class="rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700">${tag}</span>`).join('')}
        </div>
        <div class="mt-3 flex flex-wrap gap-2">
          <a class="inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-sm font-black" style="background:#0f172a;color:#fff" href="${item.url}"${target}>${primaryLabel}</a>
          ${hasSecondary ? `<a class="inline-flex min-h-11 items-center justify-center rounded-lg border px-3 text-sm font-black" style="border-color:#cbd5e1;background:#fff;color:#334155" href="${secondaryUrl}"${secondaryTarget}>${secondaryLabel}</a>` : ''}
        </div>
      </article>`;
    }).join('');
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try { localStorage.setItem('searchQuery', input.value.trim()); } catch {}
    render();
  });
  input.addEventListener('input', render);
  categoryFilter.addEventListener('change', render);

  try { input.value = localStorage.getItem('searchQuery') || ''; } catch {}
  renderCategories();
  render();
})();
