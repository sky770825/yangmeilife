(function () {
  const LINE_URL = 'https://line.me/ti/p/@931aeinu';

  const image = (id, w = 640, h = 440) =>
    `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&crop=center&auto=format&q=80`;

  const fallback = {
    beauty: image('photo-1570172619644-dfd03ed5d881'),
    hair: image('photo-1560066984-138dadb4c035'),
    lash: image('photo-1512496015851-a90fb38ba796'),
    nail: image('photo-1604654894610-df63bc536371'),
    massage: image('photo-1544161515-4ab6ce6db874'),
    food: image('photo-1529692236671-f1f6cf9683ba'),
    tea: 'https://i.postimg.cc/FRny97rm/kungfutea.jpg',
    rental: image('photo-1560518883-ce09059eeffa'),
    chiro: image('photo-1576091160550-2173dba999ef')
  };

  const pages = {
    'beauty-skin.html': {
      accent: '#ec4899',
      title: '楊梅美容護膚廠商',
      intro: '已先整理 3 個可展示版位，方便使用者直接比較服務重點。',
      vendors: [
        { name: '楊梅光采肌膚管理', area: '楊梅市區', price: '$899 起', rating: '4.8', img: fallback.beauty, tags: ['深層清潔', '保濕修護', '預約制'] },
        { name: '埔心植萃美顏室', area: '埔心車站周邊', price: '$1,200 起', rating: '4.7', img: image('photo-1522337360788-8b13dee7a37e'), tags: ['敏感肌', '植萃保養', '女仕護理'] },
        { name: '富岡亮顏工作室', area: '富岡老街', price: '$799 起', rating: '4.6', img: image('photo-1616394584738-fc6e612e71b9'), tags: ['基礎護膚', '粉刺護理', '平價'] }
      ]
    },
    'hair-salon.html': {
      accent: '#8b5cf6',
      title: '楊梅美髮造型廠商',
      intro: '把剪染燙與男士理髮拆開呈現，手機上比較好選。',
      vendors: [
        { name: '楊梅剪染研究室', area: '楊梅火車站', price: '$450 起', rating: '4.8', img: fallback.hair, tags: ['剪髮', '染髮', '護髮'] },
        { name: '埔心髮型工作室', area: '埔心商圈', price: '$399 起', rating: '4.6', img: image('photo-1521590832167-7bcbfaa6381f'), tags: ['燙髮', '造型', '親子友善'] },
        { name: '富岡男士理髮', area: '富岡車站', price: '$300 起', rating: '4.7', img: image('photo-1503951914875-452162b0f3f1'), tags: ['男士剪髮', '修容', '快速整理'] }
      ]
    },
    'eyelash-service.html': {
      accent: '#f59e0b',
      title: '楊梅美睫服務廠商',
      intro: '用照片版卡片呈現風格，避免只靠圖示判斷。',
      vendors: [
        { name: '楊梅自然睫作', area: '楊梅市區', price: '$999 起', rating: '4.9', img: fallback.lash, tags: ['自然款', '單根嫁接', '保養教學'] },
        { name: '埔心睫眉設計', area: '埔心車站', price: '$1,200 起', rating: '4.7', img: image('photo-1487412720507-e7ab37603c6f'), tags: ['濃密款', '眉型整理', '預約制'] },
        { name: '富岡輕感美睫', area: '富岡老街', price: '$899 起', rating: '4.6', img: image('photo-1522335789203-aabd1fc54bc9'), tags: ['輕柔款', '補睫', '新手友善'] }
      ]
    },
    'nail-service.html': {
      accent: '#ef4444',
      title: '楊梅美甲服務廠商',
      intro: '新增款式照片與價位標籤，使用者不用點進 LINE 才知道方向。',
      vendors: [
        { name: '楊梅指尖美學', area: '楊梅市區', price: '$799 起', rating: '4.8', img: fallback.nail, tags: ['凝膠美甲', '手足保養', '簡約款'] },
        { name: '埔心日系美甲室', area: '埔心商圈', price: '$999 起', rating: '4.7', img: image('photo-1604654894611-6973b376cbde'), tags: ['日系款', '暈染', '預約制'] },
        { name: '富岡手足護理', area: '富岡車站', price: '$699 起', rating: '4.5', img: image('photo-1610992015732-2449b76344bc'), tags: ['足部保養', '基礎護理', '平價'] }
      ]
    },
    'thai-massage.html': {
      accent: '#f97316',
      title: '楊梅泰式按摩廠商',
      intro: '先放入可比較的按摩店卡片，讓分類頁不再空白。',
      vendors: [
        { name: '楊梅蘭納泰式舒壓', area: '楊梅市區', price: '$1,000 起', rating: '4.8', img: fallback.massage, tags: ['泰式伸展', '油壓', '雙人房'] },
        { name: '埔心古法按摩館', area: '埔心商圈', price: '$900 起', rating: '4.7', img: image('photo-1600334129128-685c5582fd35'), tags: ['古法指壓', '肩頸', '腳底'] },
        { name: '富岡香氛舒壓', area: '富岡車站', price: '$1,200 起', rating: '4.6', img: image('photo-1519823551278-64ac92734fb1'), tags: ['精油', '放鬆', '預約制'] }
      ]
    },
    'vietnamese-massage.html': {
      accent: '#ef4444',
      title: '楊梅越式按摩廠商',
      intro: '以服務照片加重點標籤呈現，降低首頁點進來後的落差。',
      vendors: [
        { name: '楊梅越式養生館', area: '楊梅市區', price: '$899 起', rating: '4.6', img: image('photo-1515377905703-c4788e51af15'), tags: ['越式舒壓', '刮痧', '肩頸'] },
        { name: '埔心足體會館', area: '埔心車站', price: '$699 起', rating: '4.7', img: image('photo-1540555700478-4be289fbecef'), tags: ['足底', '全身', '夜間營業'] },
        { name: '富岡輕鬆養生', area: '富岡老街', price: '$799 起', rating: '4.5', img: fallback.massage, tags: ['全身按摩', '頭肩頸', '平價'] }
      ]
    },
    'taiwanese-massage.html': {
      accent: '#10b981',
      title: '楊梅台式按摩廠商',
      intro: '新增台式傳統舒壓版位，卡片資訊可直接比較。',
      vendors: [
        { name: '楊梅傳統整復舒壓', area: '楊梅市區', price: '$800 起', rating: '4.7', img: fallback.massage, tags: ['指壓', '筋膜放鬆', '肩頸'] },
        { name: '埔心足體工坊', area: '埔心商圈', price: '$650 起', rating: '4.6', img: image('photo-1544161515-4ab6ce6db874'), tags: ['腳底', '半身', '快速放鬆'] },
        { name: '富岡在地按摩', area: '富岡車站', price: '$700 起', rating: '4.5', img: image('photo-1519824145371-296894a0daa9'), tags: ['台式手法', '預約制', '熟客推薦'] }
      ]
    },
    'american-chiropractic.html': {
      accent: '#3b82f6',
      title: '楊梅美式整復廠商',
      intro: '整復類頁面補上專業照片與服務範圍，避免只看到招募資訊。',
      vendors: [
        { name: '楊梅脊衡整復所', area: '楊梅市區', price: '$1,200 起', rating: '4.8', img: fallback.chiro, tags: ['脊椎評估', '姿勢調整', '預約制'] },
        { name: '埔心關節調理室', area: '埔心商圈', price: '$1,000 起', rating: '4.6', img: image('photo-1571019613454-1cb2f99b2d8b'), tags: ['肩頸', '下背', '運動恢復'] },
        { name: '富岡動作修復', area: '富岡車站', price: '$999 起', rating: '4.5', img: image('photo-1576091160399-112ba8d25d1d'), tags: ['動作檢測', '伸展建議', '保養'] }
      ]
    },
    'food-truck.html': {
      accent: '#f97316',
      title: '楊梅餐車廠商',
      intro: '把餐車頁補成可逛的排班清單，先以常見餐車類型呈現。',
      vendors: [
        { name: '四維路鹽酥雞餐車', area: '四維商圈', price: '$60 起', rating: '4.7', img: image('photo-1529692236671-f1f6cf9683ba'), tags: ['炸物', '夜間', '現點現炸'] },
        { name: '埔心甜點餐車', area: '埔心車站', price: '$80 起', rating: '4.6', img: image('photo-1488477181946-6428a0291777'), tags: ['甜點', '下午茶', '親子'] },
        { name: '富岡咖啡行動吧', area: '富岡老街', price: '$70 起', rating: '4.5', img: image('photo-1501339847302-ac426a4a7cbb'), tags: ['咖啡', '輕食', '假日出車'] }
      ]
    },
    'kungfu-tea.html': {
      accent: '#f59e0b',
      title: '楊梅飲品廠商',
      intro: '此頁先補入飲品周邊廠商卡，讓餐飲專區內容更完整。',
      vendors: [
        { name: '功夫茶楊梅店', area: '楊梅市區', price: '$35 起', rating: '4.8', img: fallback.tea, tags: ['茶飲', '外帶', '人氣店'] },
        { name: '埔心鮮果茶吧', area: '埔心商圈', price: '$45 起', rating: '4.6', img: image('photo-1556679343-c7306c1976bc'), tags: ['鮮果茶', '無糖選項', '夏季推薦'] },
        { name: '富岡手搖飲', area: '富岡車站', price: '$35 起', rating: '4.5', img: image('photo-1544145945-f90425340c7e'), tags: ['奶茶', '珍珠', '平價'] }
      ]
    },
    'rental-management.html': {
      accent: '#6366f1',
      title: '楊梅包租代管廠商',
      intro: '補入租賃管理服務卡，讓房產服務分類有可比較的入口。',
      vendors: [
        { name: '楊梅租管顧問', area: '楊梅市區', price: '諮詢制', rating: '4.7', img: fallback.rental, tags: ['租客媒合', '代收租金', '修繕協調'] },
        { name: '埔心社宅包租團隊', area: '埔心周邊', price: '諮詢制', rating: '4.6', img: image('photo-1560518883-ce09059eeffa'), tags: ['社宅方案', '屋況管理', '租約協助'] },
        { name: '富岡出租管理', area: '富岡周邊', price: '諮詢制', rating: '4.5', img: image('photo-1560448204-e02f11c3d0e2'), tags: ['空屋代管', '點交', '屋主服務'] }
      ]
    }
  };

  function injectStyles(accent) {
    if (document.getElementById('vendorDirectoryStyles')) return;
    const style = document.createElement('style');
    style.id = 'vendorDirectoryStyles';
    style.textContent = `
      .vendor-directory-section{background:rgba(255,255,255,.94);border-radius:1.05rem;padding:clamp(.85rem,2vw,1.15rem);box-shadow:0 10px 28px rgba(15,23,42,.09);border:1px solid rgba(255,255,255,.55);min-width:0}
      .vendor-directory-head{display:grid;grid-template-columns:minmax(0,1fr);gap:.8rem;margin-bottom:.85rem}
      .vendor-directory-eyebrow{display:inline-flex;align-items:center;gap:.4rem;border-radius:999px;background:${accent}18;color:${accent};font-size:.75rem;font-weight:800;padding:.25rem .65rem}
      .vendor-directory-title{font-size:clamp(1.12rem,2vw,1.35rem);font-weight:900;color:#111827;line-height:1.18;margin-top:.45rem;overflow-wrap:anywhere}
      .vendor-directory-intro{font-size:.86rem;color:#6b7280;margin-top:.3rem;line-height:1.5;max-width:58ch}
      .vendor-directory-tools{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;min-width:0}
      .vendor-sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
      .vendor-search{flex:1 1 170px;min-width:0}
      .vendor-search input{width:100%;min-height:36px;border:1px solid rgba(148,163,184,.35);border-radius:.75rem;background:#fff;color:#111827;font-size:.8rem;font-weight:700;padding:0 .75rem;outline:none;box-shadow:0 1px 2px rgba(15,23,42,.04)}
      .vendor-search input:focus{border-color:${accent};box-shadow:0 0 0 3px ${accent}22}
      .vendor-search input::placeholder{color:#94a3b8}
      .vendor-sort-select{border:1px solid rgba(148,163,184,.35);border-radius:.75rem;background:#fff;color:#111827;font-size:.74rem;font-weight:800;padding:0 .55rem;min-height:30px;outline:none;cursor:pointer}
      .vendor-sort-select:focus{border-color:${accent};box-shadow:0 0 0 3px ${accent}22}
      .vendor-view-toggle{display:grid;grid-template-columns:1fr 1fr;background:#eef2f7;border:1px solid rgba(148,163,184,.25);border-radius:.78rem;padding:.16rem;gap:.12rem}
      .vendor-view-toggle button{border:0;background:transparent;border-radius:.62rem;min-height:30px;padding:0 .62rem;font-size:.74rem;font-weight:900;color:#64748b;white-space:nowrap;cursor:pointer}
      .vendor-view-toggle button[aria-pressed="true"]{background:#fff;color:#111827;box-shadow:0 2px 8px rgba(15,23,42,.10)}
      .vendor-count{font-size:.75rem;font-weight:900;color:#64748b;white-space:nowrap}
      .vendor-directory-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:.72rem;align-items:stretch}
      .vendor-card{background:#fff;border:1px solid rgba(148,163,184,.22);border-radius:.92rem;overflow:hidden;min-width:0;box-shadow:0 4px 14px rgba(15,23,42,.065);display:grid;grid-template-rows:auto 1fr;height:100%}
      .vendor-card[hidden]{display:none!important}
      .vendor-card-image{width:100%;aspect-ratio:3/4;object-fit:cover;display:block;background:#f3f4f6}
      .vendor-card-body{padding:.72rem;display:flex;flex-direction:column;min-width:0}
      .vendor-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:.6rem}
      .vendor-card-name{font-size:.98rem;font-weight:900;color:#111827;line-height:1.24;overflow-wrap:anywhere;margin:0;min-width:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      .vendor-rating{flex:0 0 auto;color:#b45309;background:#fffbeb;border:1px solid #fde68a;border-radius:999px;font-size:.74rem;font-weight:900;white-space:nowrap;padding:.1rem .38rem}
      .vendor-meta{display:flex;flex-wrap:wrap;gap:.32rem .55rem;margin:.44rem 0 .08rem;color:#64748b;font-size:.74rem;font-weight:700;line-height:1.3;min-width:0}
      .vendor-meta span{min-width:0;overflow-wrap:anywhere}
      .vendor-tags{display:flex;flex-wrap:wrap;gap:.32rem;margin:.5rem 0 .68rem}
      .vendor-tag{border-radius:999px;background:${accent}14;color:${accent};font-size:.68rem;font-weight:900;padding:.16rem .46rem;line-height:1.25}
      .vendor-actions{margin-top:auto;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.4rem}
      .vendor-action{min-height:34px;border-radius:.68rem;display:flex;align-items:center;justify-content:center;text-decoration:none;font-size:.75rem;font-weight:900;min-width:0}
      .vendor-action.primary{background:${accent};color:#fff}
      .vendor-action.secondary{background:#f1f5f9;color:#334155}
      .vendor-empty{display:none;margin:.7rem 0 0;border-radius:.9rem;background:#f8fafc;color:#64748b;font-size:.84rem;font-weight:800;text-align:center;padding:.75rem}
      .vendor-empty:not([hidden]){display:block}
      .vendor-directory-section[data-view="compact"] .vendor-directory-grid{grid-template-columns:1fr;gap:.62rem}
      .vendor-directory-section[data-view="compact"] .vendor-card{grid-template-columns:108px minmax(0,1fr);grid-template-rows:auto;align-items:stretch;min-height:138px}
      .vendor-directory-section[data-view="compact"] .vendor-card-image{width:108px;height:100%;min-height:138px;aspect-ratio:auto}
      .vendor-directory-section[data-view="compact"] .vendor-card-body{padding:.66rem .7rem}
      .vendor-directory-section[data-view="gallery"] .vendor-card-image{aspect-ratio:3/4}
      .vendor-join-card{margin-top:.78rem;border-radius:.92rem;background:linear-gradient(135deg,${accent}16,rgba(255,255,255,.74));border:1px dashed ${accent}66;padding:.78rem;display:flex;align-items:center;justify-content:space-between;gap:.75rem}
      .vendor-join-card h4{font-weight:900;color:#111827;margin:0 0 .15rem}
      .vendor-join-card p{font-size:.8rem;color:#64748b;margin:0;line-height:1.45}
      .vendor-join-card a{background:#111827;color:#fff;border-radius:.72rem;padding:.52rem .78rem;font-size:.76rem;font-weight:900;text-decoration:none;white-space:nowrap}
      @media (min-width:780px){.vendor-directory-head{grid-template-columns:minmax(0,1fr) minmax(330px,auto);align-items:end}.vendor-directory-tools{justify-content:flex-end}.vendor-directory-section[data-view="compact"] .vendor-directory-grid{grid-template-columns:repeat(auto-fit,minmax(310px,1fr))}}
      @media (max-width:760px){.vendor-directory-tools{gap:.42rem}.vendor-search{flex-basis:100%}.vendor-view-toggle{flex:1 1 auto}.vendor-count{margin-left:auto}.vendor-directory-section[data-view="compact"] .vendor-card{grid-template-columns:96px minmax(0,1fr);min-height:128px}.vendor-directory-section[data-view="compact"] .vendor-card-image{width:96px;min-height:128px}.vendor-card-name{font-size:.93rem}.vendor-meta{font-size:.72rem}.vendor-tag:nth-child(n+3){display:none}.vendor-action{min-height:32px;font-size:.72rem;padding:0 .32rem}.vendor-join-card{align-items:flex-start;flex-direction:column}.vendor-join-card a{width:100%;text-align:center}}
    `;
    document.head.appendChild(style);
  }

  function escapeAttr(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function createVendorCard(vendor) {
    const searchable = [vendor.name, vendor.area, vendor.price, ...vendor.tags].join(' ').toLowerCase();
    const vendorId = (vendor.name || '').replace(/\s+/g, '-').toLowerCase();
    return `
      <article class="vendor-card" data-search="${escapeAttr(searchable)}" data-vendor-id="${escapeAttr(vendorId)}">
        <img class="vendor-card-image" src="${vendor.img}" alt="${vendor.name}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${fallback.food}'">
        <div class="vendor-card-body">
          <div class="vendor-card-top">
            <h3 class="vendor-card-name">${vendor.name}</h3>
            <span class="vendor-rating">★ ${vendor.rating}</span>
          </div>
          <div class="vendor-meta">
            <span>${vendor.area}</span>
            <span>${vendor.price}</span>
          </div>
          <div class="vendor-tags">
            ${vendor.tags.map((tag) => `<span class="vendor-tag">${tag}</span>`).join('')}
          </div>
          <div class="vendor-actions">
            <a class="vendor-action primary" href="${LINE_URL}" target="_blank" rel="noopener noreferrer">洽詢</a>
            <button class="vendor-action secondary fav-btn" data-vendor='${escapeAttr(JSON.stringify({id: vendorId, name: vendor.name, category: (window._vendorConfig?.title || ''), icon: "🏪", pageUrl: location.pathname.split('/').pop()}))}' onclick="toggleFavorite(this)" aria-label="加入收藏">
              <span class="fav-icon">♡</span> 收藏
            </button>
          </div>
        </div>
      </article>
    `;
  }

  // Toggle favorite in localStorage
  window.toggleFavorite = function(btn) {
    try {
      const data = JSON.parse(btn.dataset.vendor);
      let favorites = JSON.parse(localStorage.getItem('yangmei_favorites') || '[]');
      const idx = favorites.findIndex(f => f.id === data.id);
      if (idx >= 0) {
        favorites.splice(idx, 1);
        btn.querySelector('.fav-icon').textContent = '♡';
        btn.style.color = '';
        showFavoriteToast('已取消收藏');
      } else {
        favorites.push({ ...data, addedAt: Date.now() });
        btn.querySelector('.fav-icon').textContent = '♥';
        btn.style.color = '#ec4899';
        showFavoriteToast('已加入收藏 ❤️');
      }
      localStorage.setItem('yangmei_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Favorite toggle failed', e);
    }
  };

  function showFavoriteToast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2000);
  }

  // Sync favorite icons on render
  function syncFavoriteIcons() {
    const favorites = JSON.parse(localStorage.getItem('yangmei_favorites') || '[]');
    const favIds = new Set(favorites.map(f => f.id));
    document.querySelectorAll('.fav-btn').forEach(btn => {
      try {
        const data = JSON.parse(btn.dataset.vendor);
        if (favIds.has(data.id)) {
          btn.querySelector('.fav-icon').textContent = '♥';
          btn.style.color = '#ec4899';
        }
      } catch (e) {}
    });
  }

  function initVendorControls(section) {
    const cards = Array.from(section.querySelectorAll('.vendor-card'));
    const input = section.querySelector('.vendor-search-input');
    const count = section.querySelector('.vendor-count');
    const empty = section.querySelector('.vendor-empty');
    const sortSelect = section.querySelector('.vendor-sort-select');
    const viewButtons = Array.from(section.querySelectorAll('[data-vendor-view]'));

    // Sync favorite icons after render
    setTimeout(syncFavoriteIcons, 0);
    const readSavedView = () => {
      try {
        return localStorage.getItem('yangmeiVendorView');
      } catch (error) {
        return null;
      }
    };
    const saveView = (view) => {
      try {
        localStorage.setItem('yangmeiVendorView', view);
      } catch (error) {
        // Storage can be blocked in strict browser modes; the view still changes for this page.
      }
    };
    const savedView = readSavedView();
    const defaultView = savedView || (window.matchMedia('(max-width: 760px)').matches ? 'compact' : 'gallery');

    function setView(view, persist = false) {
      section.dataset.view = view;
      viewButtons.forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.vendorView === view));
      });
      if (persist) saveView(view);
    }

    function updateFilter() {
      const query = (input?.value || '').trim().toLowerCase();
      let visible = 0;
      cards.forEach((card) => {
        const matched = !query || card.dataset.search.includes(query);
        card.hidden = !matched;
        if (matched) visible += 1;
      });
      if (count) count.textContent = `${visible} 家`;
      if (empty) empty.hidden = visible > 0;
    }

    setView(defaultView);
    updateFilter();

    input?.addEventListener('input', updateFilter);
    sortSelect?.addEventListener('change', () => {
      const mode = sortSelect.value;
      const grid = section.querySelector('.vendor-directory-grid');
      const sortedCards = [...cards].sort((a, b) => {
        const ratingA = parseFloat(a.querySelector('.vendor-rating')?.textContent.replace(/[^\d.]/g, '') || '0');
        const ratingB = parseFloat(b.querySelector('.vendor-rating')?.textContent.replace(/[^\d.]/g, '') || '0');
        const metaA = a.querySelector('.vendor-meta')?.textContent || '';
        const metaB = b.querySelector('.vendor-meta')?.textContent || '';
        // Extract price number
        const priceA = parseInt(metaA.replace(/[^0-9]/g, '') || '0');
        const priceB = parseInt(metaB.replace(/[^0-9]/g, '') || '0');
        const areaA = metaA.split(/\s+/)[0] || '';
        const areaB = metaB.split(/\s+/)[0] || '';

        switch(mode) {
          case 'rating': return ratingB - ratingA;
          case 'price-low': return priceA - priceB;
          case 'price-high': return priceB - priceA;
          case 'area': return areaA.localeCompare(areaB, 'zh-Hant');
          default: return 0;
        }
      });
      sortedCards.forEach(c => grid.appendChild(c));
    });
    viewButtons.forEach((button) => {
      button.addEventListener('click', () => setView(button.dataset.vendorView, true));
    });
  }

  function render(config) {
    window._vendorConfig = config;
    injectStyles(config.accent);
    const heading = Array.from(document.querySelectorAll('h3')).find((node) => node.textContent.includes('待廠商進駐'));
    if (!heading) return;
    const target = heading.closest('.glass-card, .contractor-card') || heading.parentElement;
    if (!target) return;
    const sectionId = `vendor-directory-${Date.now()}`;
    target.outerHTML = `
      <section class="vendor-directory-section" id="${sectionId}" data-view="compact">
        <div class="vendor-directory-head">
          <div>
            <span class="vendor-directory-eyebrow">已新增廠商</span>
            <h2 class="vendor-directory-title">${config.title}</h2>
            <p class="vendor-directory-intro">${config.intro}</p>
          </div>
          <div class="vendor-directory-tools">
            <label class="vendor-search">
              <span class="vendor-sr-only">搜尋廠商</span>
              <input class="vendor-search-input" type="search" placeholder="搜尋店名 / 服務" autocomplete="off">
            </label>
            <select class="vendor-sort-select" aria-label="排序方式">
              <option value="default">預設排序</option>
              <option value="rating">⭐ 評分高→低</option>
              <option value="price-low">💰 價格低→高</option>
              <option value="price-high">💎 價格高→低</option>
              <option value="area">📍 依地區</option>
            </select>
            <div class="vendor-view-toggle" role="group" aria-label="切換廠商卡片顯示">
              <button type="button" data-vendor-view="compact" aria-pressed="true">精簡</button>
              <button type="button" data-vendor-view="gallery" aria-pressed="false">大圖</button>
            </div>
            <span class="vendor-count" aria-live="polite"></span>
          </div>
        </div>
        <div class="vendor-directory-grid">
          ${config.vendors.map(createVendorCard).join('')}
        </div>
        <p class="vendor-empty" hidden>沒有符合的廠商</p>
        <div class="vendor-join-card">
          <div>
            <h4>還有廠商要進駐？</h4>
            <p>店名、服務項目、照片與聯絡方式整理好後，可以直接交給網站店長上架。</p>
          </div>
          <a href="${LINE_URL}" target="_blank" rel="noopener noreferrer">新增我的店</a>
        </div>
      </section>
    `;
    const section = document.getElementById(sectionId);
    if (section) initVendorControls(section);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const filename = location.pathname.split('/').pop() || 'index.html';
    const config = pages[filename];
    if (config) render(config);
  });
})();
