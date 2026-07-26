(function () {
  const img = (id, w = 220, h = 220) =>
    `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&crop=center&auto=format&q=80`;

  const thumbs = {
    '遊戲': img('photo-1550745165-9bc0b252726f'),
    '運勢': img('photo-1515942661900-94b3d1972591'),
    'MBTI': img('photo-1516321318423-f06f85e504b3'),
    '金句': img('photo-1455390582262-044cdead277a'),
    '二手交易': img('photo-1555529669-e69e7aa0ba9a'),
    '水電修繕': img('photo-1621905252507-b35492cc74b4'),
    '驗屋公司': 'https://i.postimg.cc/3xmFgXhD/1761779534302.jpg',
    '防霾紗網': 'https://www.gogo-engineering.com/store_image/polltex/L173380795390.png',
    '油漆粉刷': 'https://i.postimg.cc/j2HFgp0Q/you-qi.jpg',
    '白蟻除蟲': img('photo-1585909695284-32d2985ac9c0'),
    '搬家公司': img('photo-1600880292203-757bb62b4baf'),
    '冷氣服務': img('photo-1581092918056-0c4c3acd3789'),
    '包租代管': img('photo-1560518883-ce09059eeffa'),
    '功夫茶': 'https://i.postimg.cc/FRny97rm/kungfutea.jpg',
    '餐車': img('photo-1565123409695-7b5ef63a2efb'),
    '美容護膚': img('photo-1570172619644-dfd03ed5d881'),
    '美髮造型': img('photo-1560066984-138dadb4c035'),
    '美睫服務': img('photo-1512496015851-a90fb38ba796'),
    '美甲服務': img('photo-1604654894610-df63bc536371'),
    '泰式按摩': img('photo-1544161515-4ab6ce6db874'),
    '越式按摩': img('photo-1515377905703-c4788e51af15'),
    '美式整復': img('photo-1576091160550-2173dba999ef'),
    '台式按摩': img('photo-1600334129128-685c5582fd35'),
    '個人儀表板': img('photo-1551288049-bebda4e38f71'),
    '天氣': img('photo-1500530855697-b586d89ba3ee'),
    '垃圾車': img('photo-1532996122724-e3c354a0b15b'),
    '發票': img('photo-1554224155-6726b3ff858f'),
    '公車': img('photo-1544620347-c4fd4a3d5957'),
    '驗屋': 'https://i.postimg.cc/3xmFgXhD/1761779534302.jpg',
    '利率': img('photo-1554224154-26032ffc0d07'),
    '物品收納': img('photo-1586023492125-27b2c045efd7'),
    '待辦事項': img('photo-1484480974693-6ca0a78fb36b'),
    '比價工具': img('photo-1556742049-0cfed4f6a45d'),
    '健康記錄': img('photo-1576091160550-2173dba999ef'),
    '水電用量': img('photo-1621905252507-b35492cc74b4'),
    '維修記錄': img('photo-1581092918056-0c4c3acd3789'),
    '機車保養': img('photo-1558981285-6f0c94958bb6'),
    '社區公告': img('photo-1511632765486-a01980e01a18'),
    '醫院診所': img('photo-1538108149393-fbbd81895907'),
    '停車場': img('photo-1506521781263-d8422e82f27a')
  };

  const mediaThumbs = [
    {
      title: '房產投資秘訣',
      label: '2:30',
      badge: 'HOT',
      src: img('photo-1560518883-ce09059eeffa', 520, 300)
    },
    {
      title: '楊梅在地生活',
      label: '相片',
      badge: 'LOCAL',
      src: img('photo-1511632765486-a01980e01a18', 520, 300)
    },
    {
      title: '裝潢設計靈感',
      label: '4:15',
      badge: 'NEW',
      src: img('photo-1600585154340-be6161a56a0c', 520, 300)
    },
    {
      title: '社區活動',
      label: '相片',
      badge: 'LIVE',
      src: img('photo-1529156069898-49953e39b3ac', 520, 300)
    }
  ];

  function injectStyles() {
    if (document.getElementById('homepageThumbnailStyles')) return;
    const style = document.createElement('style');
    style.id = 'homepageThumbnailStyles';
    style.textContent = `
      .home-thumb{width:3.55rem;height:3.55rem;margin:0 auto .38rem;border-radius:.95rem;overflow:hidden;box-shadow:0 8px 20px rgba(15,23,42,.18);border:2px solid rgba(255,255,255,.55);background:rgba(255,255,255,.18)}
      .home-thumb img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .3s ease}
      .group:hover .home-thumb img{transform:scale(1.08)}
      .relaxed-card .home-thumb{width:4.35rem;height:4.35rem;border-radius:1.15rem;margin-bottom:.65rem}
      #mainMediaDisplay{height:clamp(16rem,42vw,30rem);min-height:0}
      .media-thumbnail{position:relative}
      .media-thumb-frame{position:relative;width:100%;aspect-ratio:3/4;min-height:7.5rem}
      .media-thumb-image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .3s ease}
      .media-thumbnail:hover .media-thumb-image{transform:scale(1.06)}
      .media-thumb-scrim{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.62),rgba(0,0,0,.12) 52%,rgba(0,0,0,.04))}
      @media(max-width:640px){.home-thumb{width:3.05rem;height:3.05rem;border-radius:.85rem;margin-bottom:.28rem}.relaxed-card .home-thumb{width:3.75rem;height:3.75rem;border-radius:.95rem}#mainMediaDisplay{height:16rem}.media-thumb-frame{min-height:7rem}}
    `;
    document.head.appendChild(style);
  }

  function replaceThumb(card, src, label) {
    const content = card.querySelector('.relative.z-10') || card;
    const old =
      content.querySelector('.home-thumb') ||
      content.querySelector('.card-icon') ||
      content.querySelector('.w-12.h-12') ||
      content.querySelector('.text-3xl.mb-2') ||
      content.querySelector('.text-2xl.mb-1');

    const html = `
      <div class="home-thumb" aria-hidden="true">
        <img src="${src}" alt="${label}" loading="lazy" decoding="async">
      </div>
    `;

    if (old) {
      old.outerHTML = html;
    } else {
      content.insertAdjacentHTML('afterbegin', html);
    }
  }

  function upgradeCards() {
    document.querySelectorAll('.app-card, .relaxed-card').forEach((card) => {
      const text = card.textContent.replace(/\s+/g, ' ').trim();
      const label = Object.keys(thumbs).find((key) => text.includes(key));
      if (!thumbs[label]) return;
      replaceThumb(card, thumbs[label], label);
    });
  }

  function upgradeMediaThumbnails() {
    document.querySelectorAll('.media-thumbnail').forEach((thumb, index) => {
      const data = mediaThumbs[index];
      if (!data) return;
      const active = thumb.classList.contains('active') ? ' active' : '';
      thumb.className = `media-thumbnail${active}`;
      thumb.innerHTML = `
        <div class="media-thumb-frame rounded-lg overflow-hidden cursor-pointer group">
          <img class="media-thumb-image" src="${data.src}" alt="${data.title}" loading="lazy" decoding="async">
          <div class="media-thumb-scrim"></div>
          <div class="absolute bottom-1 left-1 text-xs bg-black/70 text-white px-1.5 py-0.5 rounded">${data.label}</div>
          <div class="absolute top-1 right-1 text-xs bg-white/90 text-gray-900 px-1.5 py-0.5 rounded">${data.badge}</div>
        </div>
      `;
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    injectStyles();
    upgradeCards();
    upgradeMediaThumbnails();
  });
})();
