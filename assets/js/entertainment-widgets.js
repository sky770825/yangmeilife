(() => {
  const app = document.getElementById('servicePageApp');
  if (!app) return;

  const pageId = app.dataset.servicePage;
  const supported = new Set(['games', 'fortune', 'mbti', 'daily-quote']);
  if (!supported.has(pageId)) return;
  const entertainmentData = window.YANGMEI_ENTERTAINMENT_DATA || {};

  const listOrFallback = (value, fallback) => (Array.isArray(value) && value.length ? value : fallback);
  const objectOrFallback = (value, fallback) => (value && typeof value === 'object' && !Array.isArray(value) ? value : fallback);

  const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const readJson = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  };

  const writeJson = (key, value) => {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  };

  const seededIndex = (seed, length) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
      hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
    }
    return Math.abs(hash) % length;
  };

  const todayKey = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand('copy');
      textarea.remove();
      return ok;
    }
  };

  const injectStyle = () => {
    if (document.getElementById('entertainmentWidgetStyle')) return;
    const style = document.createElement('style');
    style.id = 'entertainmentWidgetStyle';
    style.textContent = `
.yw-widget{background:#fff;border:1px solid rgba(148,163,184,.28);border-radius:1rem;box-shadow:0 14px 34px rgba(15,23,42,.08);padding:1rem}
.yw-toolbar{display:flex;flex-wrap:wrap;gap:.5rem}
.yw-tab,.yw-btn{min-height:2.75rem;border-radius:.75rem;border:1px solid #cbd5e1;background:#fff;padding:.55rem .85rem;font-weight:900;color:#334155;cursor:pointer;touch-action:manipulation;transition:transform .18s ease,border-color .18s ease,background .18s ease,box-shadow .18s ease}
.yw-tab:hover,.yw-btn:hover{border-color:#7c3aed;box-shadow:0 8px 18px rgba(124,58,237,.12)}
.yw-tab:active,.yw-btn:active,.yw-choice:active,.yw-card-btn:active,.yw-route-level:active,.yw-quiz-set:active,.yw-merge-mission:active,.yw-merge-dir:active{transform:scale(.97)}
.yw-tab:focus-visible,.yw-btn:focus-visible,.yw-choice:focus-visible,.yw-card-btn:focus-visible,.yw-input:focus-visible,.yw-merge-mission:focus-visible,.yw-merge-dir:focus-visible{outline:3px solid rgba(124,58,237,.35);outline-offset:2px}
.yw-tab[aria-pressed="true"],.yw-btn-primary{background:#0f172a;color:#fff;border-color:#0f172a}
.yw-grid{display:grid;gap:.75rem}
.yw-grid-2{grid-template-columns:repeat(2,minmax(0,1fr))}
.yw-grid-3{grid-template-columns:repeat(3,minmax(0,1fr))}
.yw-stat{border-radius:.85rem;background:#f8fafc;padding:.75rem;text-align:center}
.yw-output{border-radius:1rem;background:#f8fafc;padding:1rem;line-height:1.7;color:#334155}
.yw-choice{min-height:3.5rem;border-radius:.85rem;border:1px solid #cbd5e1;background:#fff;padding:.75rem;text-align:left;font-weight:800;color:#1e293b;cursor:pointer;touch-action:manipulation;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease,background .18s ease}
.yw-choice:hover,.yw-card-btn:hover{border-color:#6366f1;box-shadow:0 8px 18px rgba(99,102,241,.12)}
.yw-choice:disabled,.yw-btn:disabled{opacity:.55;cursor:not-allowed;background:#f8fafc}
.yw-card-btn{min-height:4.25rem;border-radius:.85rem;border:1px solid #cbd5e1;background:#fff;font-size:1.35rem;font-weight:900;color:#0f172a;cursor:pointer;touch-action:manipulation;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease,background .18s ease}
.yw-card-btn[aria-pressed="true"],.yw-card-btn[data-solved="true"]{background:#ede9fe;border-color:#7c3aed;color:#4c1d95}
.yw-merge-board{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.45rem;max-width:22rem}
.yw-merge-cell{aspect-ratio:1/1;border-radius:.65rem;background:#e2e8f0;display:flex;flex-direction:column;align-items:center;justify-content:center;font-weight:900;color:#0f172a;min-width:0}
.yw-merge-cell[data-value="0"]{color:transparent}
.yw-merge-cell[data-value="2"],.yw-merge-cell[data-value="4"]{background:#fef3c7}
.yw-merge-cell[data-value="8"],.yw-merge-cell[data-value="16"],.yw-merge-cell[data-value="32"]{background:#fed7aa}
.yw-merge-cell[data-value="64"],.yw-merge-cell[data-value="128"],.yw-merge-cell[data-value="256"]{background:#fca5a5}
.yw-merge-cell[data-value="512"],.yw-merge-cell[data-value="1024"],.yw-merge-cell[data-value="2048"]{background:#c4b5fd}
.yw-merge-layout{display:grid;grid-template-columns:minmax(0,22rem) minmax(0,1fr);gap:1rem;align-items:start}
.yw-merge-mission-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.55rem}
.yw-merge-mission{min-height:6rem;border-radius:.9rem;border:1px solid #cbd5e1;background:#fff;padding:.8rem;text-align:left;color:#0f172a;cursor:pointer;touch-action:manipulation;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease,background .18s ease}
.yw-merge-mission:hover{border-color:#16a34a;box-shadow:0 8px 18px rgba(22,163,74,.13)}
.yw-merge-mission[aria-pressed="true"]{background:#ecfdf5;border-color:#16a34a;color:#14532d}
.yw-merge-mission strong{display:block;font-size:1rem}
.yw-merge-mission small{display:block;margin-top:.25rem;color:#64748b;font-weight:800;line-height:1.35}
.yw-merge-controls{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.45rem;max-width:15rem}
.yw-merge-dir{min-height:3rem;border-radius:.75rem;border:1px solid #cbd5e1;background:#fff;font-size:1.15rem;font-weight:900;color:#0f172a;cursor:pointer;touch-action:manipulation;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease,background .18s ease}
.yw-merge-dir:hover{border-color:#16a34a;box-shadow:0 8px 18px rgba(22,163,74,.13)}
.yw-merge-dir-placeholder{min-height:3rem}
.yw-list{display:grid;gap:.5rem}
.yw-list-item{border-radius:.85rem;background:#f8fafc;padding:.75rem}
.yw-input{min-height:2.75rem;width:100%;border-radius:.75rem;border:1px solid #cbd5e1;background:#fff;padding:.55rem .8rem;font-weight:800;outline:none}
.yw-game-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.75rem;border-radius:1rem;background:#f8fafc;padding:1rem}
.yw-pill-row{display:flex;flex-wrap:wrap;gap:.5rem}
.yw-pill{border-radius:999px;background:#e0f2fe;color:#075985;padding:.35rem .65rem;font-size:.8rem;font-weight:900}
.yw-visual-icon{width:2.55rem;height:2.55rem;flex:0 0 auto;border-radius:.8rem;display:inline-flex;align-items:center;justify-content:center;background:var(--yw-visual-bg,#eef2ff);color:var(--yw-visual,#4f46e5)}
.yw-visual-icon svg{width:1.45rem;height:1.45rem;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.yw-route-map{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.55rem}
.yw-route-level{min-height:5.5rem;border-radius:.9rem;border:1px solid #cbd5e1;background:#fff;padding:.75rem;text-align:left;color:#0f172a;cursor:pointer;touch-action:manipulation;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease,background .18s ease}
.yw-route-level:hover{border-color:#7c3aed;box-shadow:0 8px 18px rgba(124,58,237,.12)}
.yw-route-level:focus-visible{outline:3px solid rgba(124,58,237,.35);outline-offset:2px}
.yw-route-level[aria-pressed="true"]{background:#ede9fe;border-color:#7c3aed;color:#4c1d95}
.yw-route-level[data-locked="true"]{opacity:.55;cursor:not-allowed;background:#f8fafc}
.yw-route-level-main{display:flex;align-items:center;gap:.65rem}
.yw-route-level strong{display:block;font-size:.98rem}
.yw-route-level small{display:block;margin-top:.25rem;color:#64748b;font-weight:800;line-height:1.35}
.yw-route-progress{height:.55rem;overflow:hidden;border-radius:999px;background:#e2e8f0}
.yw-route-progress div{height:100%;background:#7c3aed}
.yw-achievement-panel{border-radius:1rem;border:1px solid #ddd6fe;background:#fbfaff;padding:1rem}
.yw-achievement-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.75rem}
.yw-achievement-meter{height:.6rem;overflow:hidden;border-radius:999px;background:#e9d5ff}
.yw-achievement-meter div{height:100%;background:#16a34a}
.yw-achievement-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.55rem}
.yw-achievement-card{min-height:6.25rem;border-radius:.9rem;border:1px solid #cbd5e1;background:#fff;padding:.75rem;display:grid;grid-template-columns:2.75rem minmax(0,1fr);gap:.75rem;align-items:center;color:#0f172a}
.yw-achievement-card[data-unlocked="true"]{border-color:var(--yw-badge,#7c3aed);background:linear-gradient(135deg,var(--yw-badge-bg,#faf5ff),#fff)}
.yw-achievement-card[data-unlocked="false"]{background:#f8fafc;color:#64748b}
.yw-achievement-card strong{display:block;font-size:.98rem;color:#0f172a}
.yw-achievement-card small{display:block;margin-top:.18rem;font-weight:800;line-height:1.35;color:#64748b}
.yw-achievement-icon{width:2.75rem;height:2.75rem;border-radius:.85rem;display:flex;align-items:center;justify-content:center;background:var(--yw-badge-bg,#eef2ff);color:var(--yw-badge,#4f46e5)}
.yw-achievement-card[data-unlocked="false"] .yw-achievement-icon{background:#e2e8f0;color:#64748b}
.yw-achievement-icon svg{width:1.45rem;height:1.45rem;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.yw-achievement-status{display:inline-flex;margin-top:.35rem;border-radius:999px;background:#e0f2fe;color:#075985;padding:.18rem .5rem;font-size:.72rem;font-weight:900}
.yw-achievement-card[data-unlocked="true"] .yw-achievement-status{background:#dcfce7;color:#166534}
.yw-quiz-set-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.55rem}
.yw-quiz-set{min-height:6rem;border-radius:.9rem;border:1px solid #cbd5e1;background:#fff;padding:.8rem;text-align:left;color:#0f172a;cursor:pointer;touch-action:manipulation;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease,background .18s ease}
.yw-quiz-set:hover{border-color:#2563eb;box-shadow:0 8px 18px rgba(37,99,235,.12)}
.yw-quiz-set:focus-visible{outline:3px solid rgba(37,99,235,.35);outline-offset:2px}
.yw-quiz-set-main{display:grid;grid-template-columns:2.55rem minmax(0,1fr);gap:.7rem;align-items:center}
.yw-quiz-set strong{display:block;font-size:1rem}
.yw-quiz-set small{display:block;margin-top:.25rem;color:#64748b;font-weight:800;line-height:1.35}
.yw-quiz-review{display:grid;gap:.55rem}
.yw-quiz-review-item{border-radius:.85rem;border:1px solid #e2e8f0;background:#fff;padding:.8rem;line-height:1.55}
.yw-quiz-review-item[data-correct="false"]{border-color:#fecaca;background:#fff7f7}
.yw-quiz-review-item[data-correct="true"]{border-color:#bbf7d0;background:#f0fdf4}
.yw-route-visual{display:grid;grid-template-columns:repeat(auto-fit,minmax(8.5rem,1fr));gap:.55rem}
.yw-route-node-card{position:relative;min-height:5.25rem;border-radius:.9rem;background:#fff;border:1px solid #cbd5e1;padding:.75rem;display:grid;grid-template-columns:2.55rem minmax(0,1fr);gap:.65rem;align-items:center;font-weight:900;color:#0f172a}
.yw-route-node-card[data-complete="true"]{border-color:#16a34a;background:#f0fdf4}
.yw-route-node-card[data-mode="input"][data-complete="false"]{background:#f8fafc}
.yw-route-node-index{position:absolute;top:.45rem;right:.55rem;border-radius:999px;background:#0f172a;color:#fff;padding:.12rem .45rem;font-size:.68rem;font-weight:900}
.yw-route-node-card small{display:block;margin-top:.1rem;font-weight:800;color:#64748b;line-height:1.25}
.yw-market-choice-content{display:grid;grid-template-columns:2.55rem minmax(0,1fr);gap:.7rem;align-items:center}
.yw-market-brief{display:grid;grid-template-columns:2.55rem minmax(0,1fr);gap:.75rem;align-items:center}
.yw-option-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.55rem}
.yw-score-banner{border-radius:1rem;background:#0f172a;color:#fff;padding:1rem}
.yw-score-banner strong{font-size:1.75rem}
.yw-daily-card{border-radius:1rem;border:1px solid #ddd6fe;background:#faf5ff;padding:1rem;color:#4c1d95}
.yw-toast{border-radius:.9rem;padding:.75rem .9rem;font-weight:900;border:1px solid transparent;animation:yw-pop .22s ease-out}
.yw-toast-success{background:#ecfdf5;color:#047857;border-color:#a7f3d0}
.yw-toast-error{background:#fef2f2;color:#b91c1c;border-color:#fecaca}
.yw-toast-info{background:#eef2ff;color:#4338ca;border-color:#c7d2fe}
.yw-animate-pop{animation:yw-pop .22s ease-out}
.yw-animate-shake{animation:yw-shake .24s ease-in-out}
.yw-motion-surface[data-motion="enter"],#gameArea[data-motion="enter"]{animation:yw-rise .22s ease-out both}
.yw-motion-surface[data-motion="success"],.yw-route-node-card[data-motion="success"],.yw-choice[data-motion="success"],.yw-merge-cell[data-motion="merge"],.yw-merge-cell[data-motion="spawn"],.yw-quiz-review-item[data-motion="success"]{animation:yw-confirm .24s ease-out both}
.yw-motion-surface[data-motion="error"],.yw-route-node-card[data-motion="error"],.yw-choice[data-motion="error"],.yw-merge-cell[data-motion="blocked"]{animation:yw-wrong .22s ease-in-out both}
.yw-motion-surface[data-motion="complete"],.yw-score-banner[data-motion="complete"],.yw-achievement-card[data-motion="unlock"]{animation:yw-celebrate .28s ease-out both}
.yw-merge-board[data-board-motion="move"] .yw-merge-cell[data-motion="move"]{animation:yw-slide-soft .18s ease-out both}
.yw-merge-board[data-board-motion="blocked"]{animation:yw-wrong .22s ease-in-out both}
.yw-pill[data-urgent="true"]{background:#fee2e2;color:#991b1b;animation:yw-urgent 1s ease-in-out infinite}
.yw-choice[data-motion="success"],.yw-route-node-card[data-motion="success"]{border-color:#16a34a;background:#ecfdf5}
.yw-choice[data-motion="error"],.yw-route-node-card[data-motion="error"]{border-color:#dc2626;background:#fef2f2}
@keyframes yw-pop{from{opacity:0;transform:translateY(6px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes yw-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
@keyframes yw-rise{from{opacity:.72;transform:translateY(8px) scale(.99)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes yw-confirm{0%{opacity:.86;transform:scale(.985)}55%{opacity:1;transform:scale(1.025)}100%{opacity:1;transform:scale(1)}}
@keyframes yw-wrong{0%,100%{transform:translateX(0)}30%{transform:translateX(-5px)}65%{transform:translateX(5px)}}
@keyframes yw-celebrate{0%{opacity:.86;transform:translateY(4px) scale(.985)}60%{opacity:1;transform:translateY(-2px) scale(1.018)}100%{opacity:1;transform:translateY(0) scale(1)}}
@keyframes yw-slide-soft{from{opacity:.8;transform:translateY(4px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes yw-urgent{0%,100%{transform:scale(1)}50%{transform:scale(1.035)}}
.yw-merge-cell strong{font-size:.95rem;line-height:1}
.yw-merge-cell .yw-visual-icon{width:2.25rem;height:2.25rem;border-radius:.7rem;margin-bottom:.28rem;background:rgba(255,255,255,.58)}
.yw-merge-cell .yw-visual-icon svg{width:1.25rem;height:1.25rem}
.yw-merge-cell small{display:block;font-size:.68rem;line-height:1.1;color:#475569;text-align:center}
.yw-merge-cell[data-value="0"] small,.yw-merge-cell[data-value="0"] strong{color:transparent}
@media (min-width:768px){.yw-grid-md-2{grid-template-columns:repeat(2,minmax(0,1fr))}.yw-grid-md-3{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (min-width:1024px){.yw-achievement-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:720px){.yw-merge-layout{grid-template-columns:1fr}}
@media (max-width:640px){.yw-achievement-grid{grid-template-columns:1fr}.yw-achievement-card{grid-template-columns:2.5rem minmax(0,1fr)}}
@media (max-width:520px){.yw-option-grid,.yw-route-map,.yw-route-visual,.yw-quiz-set-grid,.yw-merge-mission-grid{grid-template-columns:1fr}.yw-game-head{align-items:stretch}.yw-merge-board{max-width:100%}.yw-route-node-card{min-height:4.75rem}}
@media (prefers-reduced-motion:reduce){.yw-tab,.yw-btn,.yw-choice,.yw-card-btn,.yw-route-level,.yw-quiz-set,.yw-merge-mission,.yw-merge-dir,.yw-toast,.yw-animate-pop,.yw-animate-shake,.yw-motion-surface,#gameArea,.yw-route-node-card,.yw-merge-cell,.yw-score-banner,.yw-achievement-card,.yw-pill{animation:none!important;transition:none!important}.yw-tab:active,.yw-btn:active,.yw-choice:active,.yw-card-btn:active,.yw-route-level:active,.yw-quiz-set:active,.yw-merge-mission:active,.yw-merge-dir:active{transform:none}}
`;
    document.head.appendChild(style);
  };

  const mountWidget = (html) => {
    injectStyle();
    const existing = document.getElementById('entertainmentWidget');
    if (existing) existing.remove();
    const widget = document.createElement('section');
    widget.id = 'entertainmentWidget';
    widget.className = 'yw-widget mt-5';
    widget.innerHTML = html;
    const grid = app.querySelector('#serviceGrid');
    if (grid) grid.before(widget);
    else app.appendChild(widget);
    return widget;
  };

  const renderGames = () => {
    const gameData = objectOrFallback(entertainmentData.games, {});
    const storageKey = gameData.storageKey || 'yangmei_games_v3';
    const store = readJson(storageKey, { total: 0, played: 0, highs: {}, recent: [] });
    store.highs = objectOrFallback(store.highs, {});
    store.recent = listOrFallback(store.recent, []);
    store.daily = objectOrFallback(store.daily, { date: todayKey(), completed: [] });
    if (store.daily.date !== todayKey()) store.daily = { date: todayKey(), completed: [] };
    store.routeProgress = objectOrFallback(store.routeProgress, { highestLevel: 0, highestScore: 0 });
    store.routeProgress.highestLevel = Math.max(0, Number(store.routeProgress.highestLevel) || 0);
    store.routeProgress.highestScore = Math.max(0, Number(store.routeProgress.highestScore) || 0);
    store.quizProgress = objectOrFallback(store.quizProgress, { attempts: 0, bestAccuracy: 0, bestScore: 0, bestSet: '' });
    store.quizProgress.attempts = Math.max(0, Number(store.quizProgress.attempts) || 0);
    store.quizProgress.bestAccuracy = Math.max(0, Number(store.quizProgress.bestAccuracy) || 0);
    store.quizProgress.bestScore = Math.max(0, Number(store.quizProgress.bestScore) || 0);
    store.mergeProgress = objectOrFallback(store.mergeProgress, { completed: 0, highestTile: 0, bestScore: 0, bestMoves: 0, bestMission: '', completedMissions: {} });
    store.mergeProgress.completedMissions = objectOrFallback(store.mergeProgress.completedMissions, {});
    store.mergeProgress.completed = Math.max(0, Number(store.mergeProgress.completed) || 0, Object.keys(store.mergeProgress.completedMissions).length);
    store.mergeProgress.highestTile = Math.max(0, Number(store.mergeProgress.highestTile) || 0);
    store.mergeProgress.bestScore = Math.max(0, Number(store.mergeProgress.bestScore) || 0);
    store.mergeProgress.bestMoves = Math.max(0, Number(store.mergeProgress.bestMoves) || 0);
    store.achievements = objectOrFallback(store.achievements, { unlocked: {} });
    store.achievements.unlocked = objectOrFallback(store.achievements.unlocked, {});

    const games = objectOrFallback(gameData.tabs, {
      route: '路線記憶',
      market: '市集快手',
      merge: '梅花合成',
      quiz: '生活快問'
    });
    const gameIds = Object.keys(games);
    let active = gameIds[0] || 'route';
    const locations = listOrFallback(gameData.locations, [
      { id: 'station', label: '楊梅車站', short: '車站' },
      { id: 'market', label: '楊梅市場', short: '市場' },
      { id: 'park', label: '埔心公園', short: '公園' },
      { id: 'clinic', label: '附近診所', short: '診所' }
    ]);
    const routeLevels = listOrFallback(gameData.routeLevels, [
      { id: 'starter', name: '車站生活線', difficulty: '入門', pool: locations.map((item) => item.id), routeLength: 3, decoyCount: 2, scoreMultiplier: 1 }
    ]);
    const marketMissions = listOrFallback(gameData.marketMissions, []);
    const quizQuestions = listOrFallback(gameData.quizQuestions, []);
    const quizConfig = objectOrFallback(gameData.quizConfig, {});
    const quizSets = listOrFallback(gameData.quizSets, [
      { id: 'general', label: '綜合快問', difficulty: '基礎', description: '回答楊梅生活集的基礎維護題。', questions: quizQuestions }
    ]);
    const quizQuestionLimit = Math.max(1, Number(quizConfig.questionsPerSet) || 4);
    const quizCorrectScore = Math.max(1, Number(quizConfig.correctScore) || 100);
    const quizPerfectBonus = Math.max(0, Number(quizConfig.perfectBonus) || 0);
    const quizPassAccuracy = Math.max(1, Number(quizConfig.passAccuracy) || 75);
    const mergeTiles = objectOrFallback(gameData.mergeTiles, {});
    const mergeConfig = objectOrFallback(gameData.mergeConfig, {});
    const mergeMissions = listOrFallback(gameData.mergeMissions, [
      { id: 'flower-bundle', label: '花束暖身', difficulty: '入門', description: '合出第一束花，熟悉任務模式。', targetTile: 16, moveLimit: 14, reward: 120 }
    ]);
    const mergeSpawnFourRate = Math.min(0.6, Math.max(0, Number(mergeConfig.spawnFourRate) || 0.15));
    const mergeCompletionBonus = Math.max(0, Number(mergeConfig.completionBonus) || 120);
    const mergeRemainingMoveBonus = Math.max(0, Number(mergeConfig.remainingMoveBonus) || 0);
    const badgeConfig = objectOrFallback(gameData.badgeConfig, {});
    const visualConfig = objectOrFallback(gameData.visualConfig, {});
    const routeVisualConfig = objectOrFallback(visualConfig.route, {});
    const routeLocationVisuals = objectOrFallback(routeVisualConfig.locations, {});
    const marketVisualConfig = objectOrFallback(visualConfig.market, {});
    const marketItemVisuals = objectOrFallback(marketVisualConfig.items, {});
    const mergeVisualConfig = objectOrFallback(visualConfig.merge, {});
    const mergeTileVisuals = objectOrFallback(mergeVisualConfig.tiles, {});
    const quizVisualConfig = objectOrFallback(visualConfig.quiz, {});
    const quizSetVisuals = objectOrFallback(quizVisualConfig.sets, {});
    const achievements = listOrFallback(gameData.achievements, [
      { id: 'first-play', label: '生活起步', group: '總覽', description: '完成任一局遊戲。', icon: 'spark', color: '#7c3aed', condition: { type: 'played', target: 1 } }
    ]);
    const pick = (items, index) => items[((index % items.length) + items.length) % items.length];
    const dailyChallenge = objectOrFallback(gameData.dailyChallenge, { label: '每日挑戰', bonus: 150, rotation: gameIds });
    const marketConfig = objectOrFallback(gameData.marketConfig, {});
    const marketRounds = Math.max(1, Number(marketConfig.rounds) || 6);
    const marketTimeLimit = Math.max(15, Number(marketConfig.timeLimitSeconds) || 45);
    const dailyRotation = listOrFallback(dailyChallenge.rotation, gameIds);
    const dailyGame = pick(dailyRotation, seededIndex(todayKey(), dailyRotation.length || 1));

    let route = { phase: 'idle', levelIndex: Math.min(store.routeProgress.highestLevel, routeLevels.length - 1), sequence: [], input: [], options: [], message: '選一條楊梅生活路線，記住站點後照順序點回去。' };
    const createMarket = () => ({
      round: 0,
      score: 0,
      streak: 0,
      done: false,
      started: false,
      timeLeft: marketTimeLimit,
      deadline: 0,
      lastRoundAt: 0,
      timer: null,
      message: `${marketTimeLimit} 秒內完成 ${marketRounds} 項任務，連擊與快答會提高分數。`
	    });
	    let market = createMarket();
	    const createMerge = (missionId = mergeMissions[0]?.id || 'flower-bundle') => ({
	      phase: 'select',
	      missionId,
	      board: Array(16).fill(0),
	      score: 0,
	      moves: 0,
	      finalScore: 0,
	      success: false,
	      message: '選一個任務開始合成，完成目標方塊才會結算獎勵。'
	    });
	    let merge = createMerge();
	    const createQuiz = () => ({ phase: 'select', setId: quizSets[0]?.id || 'general', index: 0, score: 0, correct: 0, answers: [], done: false, message: '選一組題庫開始挑戰，完成後會顯示正確率與錯題回顧。' });
    let quiz = createQuiz();
    let feedback = null;
    let feedbackTimer = null;
    let resetArmed = false;
    let audioContext = null;
    let motionCue = null;

    const setMotion = (scope, type, payload = {}) => {
      motionCue = { scope, type, ...payload, token: Date.now() };
    };

    const motionType = (scope, id = null) => {
      if (!motionCue || motionCue.scope !== scope) return '';
      if (id !== null) {
        const ids = listOrFallback(motionCue.ids, []);
        if (motionCue.id !== id && !ids.includes(String(id))) return '';
      }
      return motionCue.type || '';
    };

    const playFeedback = (type) => {
      try {
        if ('vibrate' in navigator) navigator.vibrate(type === 'error' ? [18, 30, 18] : [12]);
      } catch {}
      try {
        audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
        if (audioContext.state === 'suspended') audioContext.resume();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.frequency.value = type === 'error' ? 220 : type === 'success' ? 720 : 480;
        gain.gain.setValueAtTime(0.035, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.11);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.11);
      } catch {}
    };

    const setFeedback = (type, text) => {
      feedback = { type, text };
      clearTimeout(feedbackTimer);
      feedbackTimer = setTimeout(() => {
        if (feedback?.text === text) {
          feedback = null;
          render();
        }
      }, 2600);
    };

    const award = (game, score, label) => {
      const safeScore = Math.max(0, Math.round(score));
      const completedDaily = listOrFallback(store.daily.completed, []);
      const dailyBonus = game === dailyGame && !completedDaily.includes(game) ? Number(dailyChallenge.bonus) || 0 : 0;
      const finalScore = safeScore + dailyBonus;
      if (dailyBonus) store.daily.completed = [...completedDaily, game];
      store.total += finalScore;
      store.played += 1;
      store.highs[game] = Math.max(store.highs[game] || 0, finalScore);
      store.recent = [{ game, label, score: finalScore, bonus: dailyBonus, at: todayKey() }, ...store.recent].slice(0, 5);
      setFeedback('success', `${label} +${finalScore} 分${dailyBonus ? `（每日挑戰 +${dailyBonus}）` : ''}`);
      playFeedback('success');
      writeJson(storageKey, store);
      render();
    };

    const safeBadgeColor = (color) => /^#[0-9a-f]{6}$/i.test(String(color || '')) ? color : '#7c3aed';
    const badgeBackground = (color) => `${safeBadgeColor(color)}14`;
    const iconPaths = {
      spark: '<path d="M12 2v5"/><path d="M12 17v5"/><path d="M4.93 4.93l3.54 3.54"/><path d="M15.53 15.53l3.54 3.54"/><path d="M2 12h5"/><path d="M17 12h5"/><path d="M4.93 19.07l3.54-3.54"/><path d="M15.53 8.47l3.54-3.54"/>',
      calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M4 10h16"/>',
      star: '<path d="M12 3l2.7 5.47 6.03.88-4.36 4.25 1.03 6-5.4-2.84-5.4 2.84 1.03-6-4.36-4.25 6.03-.88L12 3z"/>',
      map: '<path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z"/><path d="M9 3v15"/><path d="M15 6v15"/>',
      'map-pin': '<path d="M12 21s7-5.3 7-11a7 7 0 0 0-14 0c0 5.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/>',
      bolt: '<path d="M13 2L4 14h7l-1 8 10-13h-7l1-7z"/>',
      grid: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
      diamond: '<path d="M12 3l8 7-8 11-8-11 8-7z"/><path d="M4 10h16"/><path d="M9 3l-2 7 5 11 5-11-2-7"/>',
      check: '<path d="M20 6L9 17l-5-5"/><path d="M21 12a9 9 0 1 1-2.64-6.36"/>',
      target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.6"/>',
      rail: '<path d="M6 3h12a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V5a2 2 0 0 1 2-2z"/><path d="M8 17l-2 4"/><path d="M16 17l2 4"/><path d="M8 7h8"/><path d="M7 12h.01"/><path d="M17 12h.01"/>',
      store: '<path d="M4 10h16l-1.2-5.5H5.2L4 10z"/><path d="M6 10v10h12V10"/><path d="M9 20v-5h6v5"/><path d="M4 10c1 1.3 3 1.3 4 0 1 1.3 3 1.3 4 0 1 1.3 3 1.3 4 0 1 1.3 3 1.3 4 0"/>',
      box: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M4 7.5l8 4.5 8-4.5"/><path d="M12 12v9"/>',
      tree: '<path d="M12 21v-6"/><path d="M8 15h8l-2.2-3.2H16L12 5l-4 6.8h2.2L8 15z"/>',
      book: '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3V4z"/><path d="M5 4v16a3 3 0 0 1 3-3h11"/>',
      'book-open': '<path d="M4 5.5A3.5 3.5 0 0 1 7.5 4H12v16H7.5A3.5 3.5 0 0 0 4 21.5z"/><path d="M20 5.5A3.5 3.5 0 0 0 16.5 4H12v16h4.5A3.5 3.5 0 0 1 20 21.5z"/>',
      cross: '<path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7V3z"/>',
      shop: '<path d="M5 10h14"/><path d="M6 10v10h12V10"/><path d="M8 20v-5h8v5"/><path d="M7 4h10l2 6H5l2-6z"/>',
      flag: '<path d="M5 22V4"/><path d="M5 4h13l-2 4 2 4H5"/>',
      building: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h.01"/><path d="M15 7h.01"/><path d="M9 11h.01"/><path d="M15 11h.01"/><path d="M9 15h6"/><path d="M10 21v-4h4v4"/>',
      home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
      rice: '<path d="M5 13h14l-1.2 5.2A3 3 0 0 1 14.9 21H9.1a3 3 0 0 1-2.9-2.8L5 13z"/><path d="M8 10c1-2 2.3-3 4-3s3 1 4 3"/><path d="M9 13V7"/><path d="M12 13V5"/><path d="M15 13V7"/>',
      shirt: '<path d="M8 4l4 2 4-2 4 4-3 3v9H7v-9L4 8l4-4z"/><path d="M10 5.2c.6 1 1.2 1.5 2 1.5s1.4-.5 2-1.5"/>',
      basket: '<path d="M6 10h12l-1.2 10H7.2L6 10z"/><path d="M9 10l3-6 3 6"/><path d="M9 14h6"/><path d="M10 17h4"/>',
      glove: '<path d="M7 12V6a1.5 1.5 0 0 1 3 0v5"/><path d="M10 11V4.8a1.5 1.5 0 0 1 3 0V11"/><path d="M13 11V6a1.5 1.5 0 0 1 3 0v7"/><path d="M16 13l1.2-2.4a1.5 1.5 0 0 1 2.7 1.3l-3.2 6.2A5 5 0 0 1 12.2 21H11a5 5 0 0 1-5-5v-4a1.5 1.5 0 0 1 1.5-1.5"/>',
      ticket: '<path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7z"/><path d="M9 8v8"/>',
      cards: '<rect x="6" y="5" width="10" height="14" rx="2"/><path d="M10 3h6a2 2 0 0 1 2 2v10"/><path d="M9 10h4"/><path d="M9 14h3"/>',
      pole: '<path d="M7 21L17 3"/><path d="M12 12l5 5"/><path d="M9 17l-3-3"/><path d="M15 6l3 2"/>',
      pencil: '<path d="M4 20l4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20z"/><path d="M13.5 6.5l3 3"/>',
      wrench: '<path d="M14.7 6.3A4 4 0 0 0 19 11l-8 8a3 3 0 0 1-4.2-4.2l8-8z"/><path d="M7 17l-3 3"/>',
      receipt: '<path d="M6 3h12v18l-2-1-2 1-2-1-2 1-2-1-2 1V3z"/><path d="M9 7h6"/><path d="M9 11h6"/><path d="M9 15h4"/>',
      clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      quote: '<path d="M8 11H5a4 4 0 0 1 4-4v2a2 2 0 0 0-2 2h1v4H4v-4z"/><path d="M18 11h-3a4 4 0 0 1 4-4v2a2 2 0 0 0-2 2h1v4h-4v-4z"/>',
      palette: '<path d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 1.2-3.6 1.5 1.5 0 0 1 .9-2.7H17a4 4 0 0 0 0-8 8.8 8.8 0 0 0-5-3.7z"/><path d="M7.5 10h.01"/><path d="M10 7h.01"/><path d="M14 7.5h.01"/>',
      wallet: '<path d="M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z"/><path d="M4 7l11-3v3"/><path d="M16 13h4"/>',
      menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
      phone: '<path d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="M10 18h4"/>',
      music: '<path d="M9 18V5l10-2v13"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="16" r="2"/>',
      megaphone: '<path d="M3 11v3a2 2 0 0 0 2 2h2l4 4v-6l8 2V7l-8 2V3L7 7H5a2 2 0 0 0-2 2v2z"/><path d="M20 9l1-1"/><path d="M20 14l1 1"/>',
      type: '<path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>',
      sound: '<path d="M4 10v4h4l5 4V6l-5 4H4z"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M18.5 6.5a8 8 0 0 1 0 11"/>',
      ruler: '<path d="M4 17L17 4l3 3L7 20l-3-3z"/><path d="M13 8l3 3"/><path d="M10 11l2 2"/><path d="M7 14l3 3"/>',
      layers: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 12l9 5 9-5"/><path d="M3 16l9 5 9-5"/>',
      pattern: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/><path d="M10 10l4 4"/><path d="M14 10l-4 4"/>',
      database: '<ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5"/><path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
      rounded: '<rect x="4" y="6" width="16" height="12" rx="5"/><path d="M9 12h6"/>',
      screen: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>',
      list: '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',
      folder: '<path d="M3 6h7l2 2h9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z"/>',
      sprout: '<path d="M12 21V10"/><path d="M12 10C8 10 6 8 5 5c4 0 6 2 7 5z"/><path d="M12 10c4 0 6-2 7-5-4 0-6 2-7 5z"/>',
      bud: '<path d="M12 21v-7"/><path d="M8 14c0-5 4-9 4-9s4 4 4 9a4 4 0 0 1-8 0z"/>',
      blossom: '<path d="M12 8c1.5-4 5-4 6-1 1 3-2 5-6 5"/><path d="M12 8c-1.5-4-5-4-6-1-1 3 2 5 6 5"/><path d="M12 16c1.5 4 5 4 6 1 1-3-2-5-6-5"/><path d="M12 16c-1.5 4-5 4-6 1-1-3 2-5 6-5"/><circle cx="12" cy="12" r="2"/>',
      bouquet: '<path d="M12 21l-5-8h10l-5 8z"/><path d="M8 9a3 3 0 1 1 4-4 3 3 0 1 1 4 4 3 3 0 1 1-4 4 3 3 0 1 1-4-4z"/>',
      truck: '<path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
      district: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 9h8"/><path d="M8 13h8"/><path d="M10 20v-4h4v4"/><path d="M12 2v3"/>',
      brand: '<path d="M12 3l7 4v10l-7 4-7-4V7l7-4z"/><path d="M8 9h8"/><path d="M8 13h5"/><path d="M8 17h8"/>',
      signal: '<path d="M4 18.5a11 11 0 0 1 16 0"/><path d="M7.5 15a6.5 6.5 0 0 1 9 0"/><path d="M11 11.5a2 2 0 0 1 2 0"/><path d="M12 21h.01"/>',
      trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0V4z"/><path d="M8 6H4a4 4 0 0 0 4 4"/><path d="M16 6h4a4 4 0 0 1-4 4"/><path d="M12 13v4"/><path d="M9 21h6"/><path d="M10 17h4"/>'
    };
    const buildSvgIcon = (icon) => `<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[icon] || iconPaths.spark}</svg>`;
    const achievementIcon = (icon) => buildSvgIcon(icon);
    const visualIcon = (visual, label = '') => {
      const item = objectOrFallback(visual, {});
      const color = safeBadgeColor(item.color);
      const labelAttr = label ? ` aria-label="${escapeHtml(label)}"` : ' aria-hidden="true"';
      return `<span class="yw-visual-icon" style="--yw-visual:${color};--yw-visual-bg:${badgeBackground(color)}"${labelAttr}>${buildSvgIcon(item.icon || 'spark')}</span>`;
    };
    const routeVisualFor = (item) => objectOrFallback(routeLocationVisuals[item?.id], { icon: 'map-pin', color: '#7c3aed' });
    const marketVisualFor = (label) => objectOrFallback(marketItemVisuals[label], { icon: 'box', color: '#7c3aed' });
    const mergeVisualFor = (value) => objectOrFallback(mergeTileVisuals[String(value)], { icon: 'grid', color: '#7c3aed' });
    const quizVisualFor = (set) => objectOrFallback(quizSetVisuals[set?.id], { icon: 'book-open', color: '#2563eb' });

    const achievementProgress = (achievement) => {
      const condition = objectOrFallback(achievement.condition, {});
      const type = condition.type || 'played';
      const routeTarget = condition.target === 'all' ? routeLevels.length : Number(condition.target) || 1;
      const target = Math.max(1, type === 'routeHighestLevel' ? routeTarget : Number(condition.target) || 1);
      let current = 0;
      if (type === 'played') current = Number(store.played) || 0;
      if (type === 'totalScore') current = Number(store.total) || 0;
      if (type === 'dailyCompleted') current = listOrFallback(store.daily.completed, []).length;
      if (type === 'routeHighestLevel') current = Number(store.routeProgress.highestLevel) || 0;
      if (type === 'marketHighScore') current = Number(store.highs.market) || 0;
      if (type === 'mergeCompleted') current = Number(store.mergeProgress.completed) || 0;
      if (type === 'mergeHighestTile') current = Number(store.mergeProgress.highestTile) || 0;
      if (type === 'quizBestAccuracy') current = Number(store.quizProgress.bestAccuracy) || 0;
      const percent = Math.max(0, Math.min(100, Math.round((current / target) * 100)));
      return { type, current, target, percent };
    };

    const achievementProgressText = ({ type, current, target }) => {
      if (type === 'totalScore' || type === 'marketHighScore') return `${Math.min(current, target)}/${target} 分`;
      if (type === 'quizBestAccuracy') return `${Math.min(current, target)}%/${target}%`;
      if (type === 'mergeHighestTile') return `${Math.min(current, target)}/${target}`;
      return `${Math.min(current, target)}/${target}`;
    };

    const syncAchievements = () => {
      let changed = false;
      const items = achievements.map((achievement) => {
        const progress = achievementProgress(achievement);
        const stored = Boolean(store.achievements.unlocked[achievement.id]);
        const unlocked = stored || progress.current >= progress.target;
        if (unlocked && !stored) {
          store.achievements.unlocked[achievement.id] = { label: achievement.label || achievement.id, unlockedAt: todayKey() };
          changed = true;
        }
        return { achievement, progress, unlocked };
      });
      if (changed) writeJson(storageKey, store);
      const unlockedCount = items.filter((item) => item.unlocked).length;
      return {
        items,
        unlockedCount,
        total: items.length,
        percent: items.length ? Math.round((unlockedCount / items.length) * 100) : 0
      };
    };

    const renderAchievements = () => {
      if (!achievements.length) return '';
      const state = syncAchievements();
      const cards = state.items.map(({ achievement, progress, unlocked }) => {
        const color = safeBadgeColor(achievement.color);
        return `<div class="yw-achievement-card" data-unlocked="${unlocked}" data-achievement-id="${escapeHtml(achievement.id || '')}" style="--yw-badge:${color};--yw-badge-bg:${badgeBackground(color)}">
          <div class="yw-achievement-icon">${achievementIcon(achievement.icon)}</div>
          <div>
            <div class="text-xs font-black text-slate-500">${escapeHtml(achievement.group || '成就')}</div>
            <strong>${escapeHtml(achievement.label || achievement.id || '成就')}</strong>
            <small>${escapeHtml(achievement.description || '')}</small>
            <span class="yw-achievement-status">${unlocked ? '已解鎖' : achievementProgressText(progress)}</span>
          </div>
        </div>`;
      }).join('');
      return `<section class="yw-achievement-panel" aria-label="遊戲成就徽章">
        <div class="yw-achievement-head">
          <div>
            <div class="text-sm font-black text-purple-700">${escapeHtml(badgeConfig.modeLabel || '成就徽章')}</div>
            <h2 class="text-xl font-black text-slate-950">已解鎖 ${state.unlockedCount}/${state.total}</h2>
            <p class="mt-1 text-sm text-slate-600">${escapeHtml(badgeConfig.summary || '完成遊戲後會逐步解鎖徽章。')}</p>
          </div>
          <span class="yw-pill">${state.percent}%</span>
        </div>
        <div class="yw-achievement-meter mt-3" aria-label="成就解鎖進度"><div style="width:${state.percent}%"></div></div>
        <div class="yw-achievement-grid mt-3">${cards || `<div class="yw-output">${escapeHtml(badgeConfig.emptyText || '尚未建立成就。')}</div>`}</div>
      </section>`;
    };

    const clampRouteIndex = (index) => Math.max(0, Math.min(routeLevels.length - 1, Number(index) || 0));
    const currentRouteLevel = () => objectOrFallback(routeLevels[clampRouteIndex(route.levelIndex)], routeLevels[0] || {});
    const routeLevelNumber = () => clampRouteIndex(route.levelIndex) + 1;
    const routeLocationById = (id) => locations.find((item) => item.id === id);
    const uniqueLocations = (items) => {
      const seen = new Set();
      return items.filter((item) => {
        if (!item?.id || seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
    };
    const seededOrder = (items, seed) => [...items]
      .map((item, index) => ({ item, order: seededIndex(`${seed}-${item.id || index}-${index}`, 1000000) }))
      .sort((a, b) => a.order - b.order)
      .map(({ item }) => item);
    const routePool = (level) => {
      const ids = listOrFallback(level.pool, locations.map((item) => item.id));
      const selected = uniqueLocations(ids.map(routeLocationById).filter(Boolean));
      return selected.length ? selected : locations;
    };
    const routeLengthFor = (level) => Math.max(2, Math.min(Number(level.routeLength) || 3, routePool(level).length));
    const routeDecoysFor = (level) => Math.max(0, Number(level.decoyCount) || 0);
    const routeMultiplierFor = (level) => Math.max(1, Number(level.scoreMultiplier) || 1);
    const unlockedRouteIndex = () => Math.min(routeLevels.length - 1, store.routeProgress.highestLevel);
    const buildRouteOptions = (level, sequence, seed) => {
      const sequenceIds = new Set(sequence.map((item) => item.id));
      const candidates = uniqueLocations([...routePool(level), ...locations]).filter((item) => !sequenceIds.has(item.id));
      const decoys = seededOrder(candidates, `${seed}-decoys`).slice(0, routeDecoysFor(level));
      return seededOrder(uniqueLocations([...sequence, ...decoys]), `${seed}-options`);
    };
    const renderRouteVisual = (items, mode = 'preview', completedIds = new Set()) => `<div class="yw-route-visual" aria-label="${mode === 'input' ? '路線輸入進度' : '路線預覽'}">
      ${items.map((item, index) => `<div class="yw-route-node-card" data-mode="${escapeHtml(mode)}" data-complete="${completedIds.has(item.id)}" data-motion="${escapeHtml(motionType('route', item.id))}">
        <span class="yw-route-node-index">${index + 1}</span>
        ${visualIcon(routeVisualFor(item), item.label)}
        <div>
          <strong>${escapeHtml(item.short || item.label)}</strong>
          <small>${escapeHtml(item.label || '')}</small>
        </div>
      </div>`).join('')}
    </div>`;
    const selectRouteLevel = (index) => {
      const nextIndex = clampRouteIndex(index);
      if (nextIndex > unlockedRouteIndex()) {
        setFeedback('error', '先完成前一條路線，才能解鎖這張地圖。');
        playFeedback('error');
        render();
        return;
      }
      const level = objectOrFallback(routeLevels[nextIndex], {});
      route = {
        phase: 'idle',
        levelIndex: nextIndex,
        sequence: [],
        input: [],
        options: [],
        message: `已選擇 ${level.name || `第 ${nextIndex + 1} 關`}，準備開始記憶路線。`
      };
      setMotion('game', 'enter');
      setFeedback('info', route.message);
      render();
    };
    const startRoute = () => {
      if (route.levelIndex > unlockedRouteIndex()) {
        selectRouteLevel(unlockedRouteIndex());
        return;
      }
      const level = currentRouteLevel();
      const seed = `${todayKey()}-${Date.now()}-${level.id || route.levelIndex}`;
      const pool = routePool(level);
      route.sequence = seededOrder(pool, `${seed}-sequence`).slice(0, routeLengthFor(level));
      route.options = buildRouteOptions(level, route.sequence, seed);
      route.input = [];
      route.phase = 'preview';
      route.message = `${level.name || `第 ${routeLevelNumber()} 關`}：記住 ${route.sequence.length} 個地點順序。`;
      setMotion('route', 'enter');
      setFeedback('info', '路線已生成，先看順序再開始輸入。');
      playFeedback('info');
      render();
    };

    const chooseRoute = (id) => {
      if (route.phase !== 'input') return;
      const expected = route.sequence[route.input.length];
      const chosen = route.options.find((item) => item.id === id) || routeLocationById(id);
      if (!expected || !chosen) return;
      if (chosen.id !== expected.id) {
        route.message = `路線斷掉了，正確下一站是 ${expected.short || expected.label}。`;
        route.phase = 'idle';
        route.input = [];
        route.options = [];
        setMotion('route', 'error');
        setFeedback('error', route.message);
        playFeedback('error');
        render();
        return;
      }
      route.input.push(chosen);
      if (route.input.length === route.sequence.length) {
        const level = currentRouteLevel();
        const completedIndex = clampRouteIndex(route.levelIndex);
        const score = Math.round((140 + route.sequence.length * 45 + routeLevelNumber() * 40) * routeMultiplierFor(level));
        const completedLevel = completedIndex + 1;
        store.routeProgress.highestLevel = Math.max(store.routeProgress.highestLevel, completedLevel);
        store.routeProgress.highestScore = Math.max(store.routeProgress.highestScore, score);
        store.routeProgress.highestMap = level.name || `第 ${completedLevel} 關`;
        route.lastScore = score;
        route.lastLevelName = level.name || `第 ${completedLevel} 關`;
        route.phase = 'done';
        route.levelIndex = Math.min(completedIndex + 1, routeLevels.length - 1);
        route.message = completedLevel >= routeLevels.length
          ? `完成 ${route.lastLevelName}，全地圖已通關。`
          : `完成 ${route.lastLevelName}，已解鎖下一條路線。`;
        setMotion('route', 'complete');
        award('route', score, '路線記憶');
        return;
      }
      route.message = `正確，還有 ${route.sequence.length - route.input.length} 站。`;
      setMotion('route', 'success', { id: chosen.id });
      setFeedback('info', route.message);
      playFeedback('info');
      render();
    };

    const renderRouteLevels = () => `<div class="yw-route-map">${routeLevels.map((level, index) => {
      const locked = index > unlockedRouteIndex();
      const completed = index < store.routeProgress.highestLevel;
      const selected = index === clampRouteIndex(route.levelIndex);
      const length = routeLengthFor(level);
      const decoys = routeDecoysFor(level);
      const status = completed ? '已完成' : locked ? '未解鎖' : '可挑戰';
      const primaryLocation = routePool(level)[0] || locations[0];
      return `<button class="yw-route-level" type="button" data-route-level="${index}" aria-pressed="${selected}" data-locked="${locked}" ${locked ? 'disabled' : ''}>
        <div class="yw-route-level-main">
          ${visualIcon(routeVisualFor(primaryLocation), level.name || `第 ${index + 1} 關`)}
          <div>
            <strong>${index + 1}. ${escapeHtml(level.name || `第 ${index + 1} 關`)}</strong>
            <small>${escapeHtml(level.difficulty || '路線')}｜${length} 站｜干擾 ${decoys}｜${status}</small>
          </div>
        </div>
      </button>`;
    }).join('')}</div>`;

    const renderRoute = () => {
      const level = currentRouteLevel();
      const length = route.phase === 'preview' || route.phase === 'input' ? route.sequence.length : routeLengthFor(level);
      const completed = Math.min(store.routeProgress.highestLevel, routeLevels.length);
      const progress = routeLevels.length ? Math.round((completed / routeLevels.length) * 100) : 0;
      const inputIds = new Set(route.input.map((item) => item.id));
      return `<div class="yw-grid yw-motion-surface" data-motion="${escapeHtml(motionType('route'))}">
        <div class="yw-game-head">
          <div><strong>路線記憶</strong><div class="text-sm text-slate-600">${escapeHtml(route.message)}</div></div>
          <div class="yw-pill-row"><span class="yw-pill">${escapeHtml(level.name || `第 ${routeLevelNumber()} 關`)}</span><span class="yw-pill">第 ${routeLevelNumber()}/${routeLevels.length} 關</span><span class="yw-pill">${length} 站</span></div>
        </div>
        <div class="yw-route-progress" aria-label="路線關卡進度"><div style="width:${progress}%"></div></div>
        <div class="yw-output">最高進度：${completed}/${routeLevels.length} 關｜路線最高分：${store.routeProgress.highestScore}｜目前地圖含 ${routeDecoysFor(level)} 個干擾選項。</div>
        ${route.phase === 'idle' || route.phase === 'done' ? renderRouteLevels() : ''}
        ${route.phase === 'done' ? `<div class="yw-score-banner" data-motion="${escapeHtml(motionType('route'))}"><div>${escapeHtml(route.lastLevelName || '完成路線')}</div><strong>${Number(route.lastScore) || 0}</strong></div>` : ''}
        ${route.phase === 'preview' ? `${renderRouteVisual(route.sequence, 'preview')}
          <button class="yw-btn yw-btn-primary" type="button" data-route-ready>我記住了</button>` : ''}
        ${route.phase === 'input' ? `<div class="yw-output">已輸入 ${route.input.length}/${route.sequence.length} 站。請從下方選項照順序點回去。</div>
          ${renderRouteVisual(route.sequence, 'input', inputIds)}
          <div class="yw-option-grid">${route.options.map((item) => `<button class="yw-choice" type="button" data-route-choice="${escapeHtml(item.id)}" ${inputIds.has(item.id) ? 'disabled' : ''}>
            <span class="yw-market-choice-content">${visualIcon(routeVisualFor(item), item.label)}<span>${escapeHtml(item.label)}</span></span>
          </button>`).join('')}</div>` : ''}
        ${route.phase !== 'preview' && route.phase !== 'input' ? `<button class="yw-btn yw-btn-primary" type="button" data-route-start>開始 ${escapeHtml(level.name || '新路線')}</button>` : ''}
      </div>`;
    };

    const stopMarketTimer = () => {
      clearInterval(market.timer);
      market.timer = null;
    };

    const updateMarketTime = () => {
      if (!market.started || market.done || !market.deadline) return market.timeLeft;
      market.timeLeft = Math.max(0, Math.ceil((market.deadline - Date.now()) / 1000));
      return market.timeLeft;
    };

    const finishMarket = (message) => {
      stopMarketTimer();
      market.started = false;
      market.done = true;
      market.timeLeft = updateMarketTime();
      market.message = message;
      setMotion('market', market.score > 0 ? 'complete' : 'error');
      if (market.score > 0) {
        award('market', market.score, '市集快手');
      } else {
        setFeedback('error', message);
        playFeedback('error');
        render();
      }
    };

    const scheduleMarketTimer = () => {
      stopMarketTimer();
      market.timer = setInterval(() => {
        const remaining = updateMarketTime();
        if (remaining <= 0) {
          finishMarket('時間到，本輪已依目前分數結算。');
          return;
        }
        if (active === 'market') render();
      }, 1000);
    };

    const startMarket = () => {
      stopMarketTimer();
      market = createMarket();
      market.started = true;
      market.deadline = Date.now() + marketTimeLimit * 1000;
      market.lastRoundAt = Date.now();
      market.message = '限時開始，越快答對分數越高。';
      setMotion('market', 'enter');
      setFeedback('info', `市集快手開始：${marketTimeLimit} 秒、${marketRounds} 題。`);
      playFeedback('info');
      scheduleMarketTimer();
      render();
    };

    const currentMarket = () => pick(marketMissions, market.round);
    const renderMarket = () => {
      const timeLeft = updateMarketTime();
      if (market.done) return `<div class="yw-grid yw-motion-surface" data-motion="${escapeHtml(motionType('market'))}">
        <div class="yw-game-head">
          <div><strong>市集快手</strong><div class="text-sm text-slate-600">${escapeHtml(market.message)}</div></div>
          <div class="yw-pill-row"><span class="yw-pill">限時結算</span><span class="yw-pill">${market.score} 分</span></div>
        </div>
        <div class="yw-score-banner" data-motion="${escapeHtml(motionType('market'))}"><div>本輪分數</div><strong>${market.score}</strong></div>
        <button class="yw-btn yw-btn-primary" type="button" data-market-reset>再跑一輪</button>
      </div>`;
      if (!market.started) return `<div class="yw-grid">
        <div class="yw-game-head">
          <div><strong>市集快手</strong><div class="text-sm text-slate-600">${escapeHtml(market.message)}</div></div>
          <div class="yw-pill-row"><span class="yw-pill">${escapeHtml(marketConfig.modeLabel || '限時模式')}</span><span class="yw-pill">${marketTimeLimit} 秒</span></div>
        </div>
        <div class="yw-output">目標：完成 ${marketRounds} 項在地任務。答對加 ${Number(marketConfig.correctBase) || 90} 分，連擊加成，${Number(marketConfig.fastBonusThresholdMs) || 3200}ms 內快答再加 ${Number(marketConfig.fastBonus) || 25} 分；答錯扣 ${Number(marketConfig.wrongPenalty) || 35} 分。</div>
        <button class="yw-btn yw-btn-primary" type="button" data-market-start>開始限時挑戰</button>
      </div>`;
      const mission = currentMarket();
      if (!mission) return '<div class="yw-output">市集任務資料尚未建立。</div>';
      const progress = Math.round((market.round / marketRounds) * 100);
      return `<div class="yw-grid yw-motion-surface" data-motion="${escapeHtml(motionType('market'))}">
        <div class="yw-game-head">
          <div><strong>市集快手</strong><div class="text-sm text-slate-600">${escapeHtml(market.message)}</div></div>
          <div class="yw-pill-row"><span class="yw-pill">第 ${Math.min(market.round + 1, marketRounds)}/${marketRounds} 題</span><span class="yw-pill" data-urgent="${timeLeft <= 10}">${timeLeft} 秒</span><span class="yw-pill" data-motion="${escapeHtml(motionType('market'))}">連擊 ${market.streak}</span></div>
        </div>
        <div class="mt-1 h-3 overflow-hidden rounded-full bg-slate-200"><div style="height:100%;width:${progress}%;background:#16a34a"></div></div>
        <div class="yw-output yw-motion-surface" data-motion="${escapeHtml(motionType('market'))}"><div class="yw-market-brief">${visualIcon({ icon: 'store', color: '#ea580c' }, marketVisualConfig.modeLabel || '市集任務')}<span>${escapeHtml(mission.prompt)}</span></div></div>
        <div class="yw-option-grid">${mission.options.map((item) => `<button class="yw-choice" type="button" data-market-choice="${escapeHtml(item)}">
          <span class="yw-market-choice-content">${visualIcon(marketVisualFor(item), item)}<span>${escapeHtml(item)}</span></span>
        </button>`).join('')}</div>
      </div>`;
    };

    const chooseMarket = (choice) => {
      const mission = currentMarket();
      if (!mission || market.done || !market.started) return;
      if (updateMarketTime() <= 0) {
        finishMarket('時間到，本輪已依目前分數結算。');
        return;
      }
      const responseMs = Date.now() - market.lastRoundAt;
      if (choice === mission.answer) {
        market.streak += 1;
        const fastBonus = responseMs <= (Number(marketConfig.fastBonusThresholdMs) || 3200) ? Number(marketConfig.fastBonus) || 25 : 0;
        const gain = (Number(marketConfig.correctBase) || 90) + market.streak * (Number(marketConfig.streakBonus) || 20) + fastBonus;
        market.score += gain;
        market.message = `選對，+${gain} 分${fastBonus ? '（快答）' : ''}。`;
        setMotion('market', 'success');
        setFeedback('success', market.message);
        playFeedback('success');
      } else {
        market.streak = 0;
        const penalty = Number(marketConfig.wrongPenalty) || 35;
        market.score = Math.max(0, market.score - penalty);
        market.message = `這題應該選 ${mission.answer}，-${penalty} 分。`;
        setMotion('market', 'error');
        setFeedback('error', market.message);
        playFeedback('error');
      }
      market.round += 1;
      if (market.round >= marketRounds) {
        finishMarket(`完成 ${marketRounds} 項任務，本輪結算。`);
        return;
      }
      market.lastRoundAt = Date.now();
      render();
    };

    const resetMarket = () => {
      stopMarketTimer();
      market = createMarket();
      setFeedback('info', '市集快手已重置，可重新開始限時挑戰。');
      render();
    };

    const mergeMissionById = (id) => mergeMissions.find((mission) => mission.id === id) || mergeMissions[0] || {};
    const currentMergeMission = () => mergeMissionById(merge?.missionId);
    const mergeTargetTile = (mission = currentMergeMission()) => Math.max(8, Number(mission.targetTile) || 16);
    const mergeMoveLimit = (mission = currentMergeMission()) => Math.max(4, Number(mission.moveLimit) || 14);
    const mergeRewardFor = (mission = currentMergeMission()) => Math.max(0, Number(mission.reward) || 0);
    const highestMergeTile = () => Math.max(0, ...(merge?.board || []).map((value) => Number(value) || 0));
    const mergeRemainingMoves = (mission = currentMergeMission()) => Math.max(0, mergeMoveLimit(mission) - (Number(merge?.moves) || 0));
    const mergeMissionRecord = (mission) => objectOrFallback(store.mergeProgress.completedMissions[mission.id], {});

    const initMerge = (missionId = merge?.missionId) => {
      const mission = mergeMissionById(missionId);
      if (!mission.id) {
        setFeedback('error', '梅花合成任務資料尚未建立。');
        playFeedback('error');
        render();
        return;
      }
      merge = {
        phase: 'playing',
        missionId: mission.id,
        board: Array(16).fill(0),
        score: 0,
        moves: 0,
        finalScore: 0,
        success: false,
        message: `${mission.label || '合成任務'}開始，目標合出 ${mergeTiles[mergeTargetTile(mission)] || mergeTargetTile(mission)}。`
      };
      const firstTile = addMergeTile();
      const secondTile = addMergeTile();
      setMotion('merge', 'spawn', { ids: [firstTile, secondTile].filter((index) => index !== null && index !== undefined).map(String) });
      setFeedback('info', merge.message);
      playFeedback('info');
      render();
    };

    const addMergeTile = () => {
      if (!merge) return;
      const empty = merge.board.map((value, index) => value ? null : index).filter((value) => value !== null);
      if (!empty.length) return null;
      const index = empty[Math.floor(Math.random() * empty.length)];
      merge.board[index] = Math.random() < mergeSpawnFourRate ? 4 : 2;
      return index;
    };

    const hasMergeMoves = () => {
      if (!merge?.board?.length) return false;
      if (merge.board.some((value) => !value)) return true;
      for (let row = 0; row < 4; row += 1) {
        for (let col = 0; col < 4; col += 1) {
          const value = merge.board[row * 4 + col];
          if (col < 3 && value === merge.board[row * 4 + col + 1]) return true;
          if (row < 3 && value === merge.board[(row + 1) * 4 + col]) return true;
        }
      }
      return false;
    };

    const finishMerge = (success, message) => {
      const mission = currentMergeMission();
      const target = mergeTargetTile(mission);
      const highestTile = highestMergeTile();
      const remaining = mergeRemainingMoves(mission);
      const missionReward = success ? mergeRewardFor(mission) + mergeCompletionBonus + remaining * mergeRemainingMoveBonus : 0;
      const finalScore = success ? merge.score + missionReward : 0;
      merge.phase = 'result';
      merge.success = success;
      merge.finalScore = finalScore;
      merge.message = message;
      store.mergeProgress.highestTile = Math.max(store.mergeProgress.highestTile, highestTile);
      setMotion('merge', success ? 'complete' : 'error');
      if (success) {
        const previous = mergeMissionRecord(mission);
        store.mergeProgress.completedMissions[mission.id] = {
          label: mission.label || mission.id,
          targetTile: target,
          bestMoves: previous.bestMoves ? Math.min(Number(previous.bestMoves) || merge.moves, merge.moves) : merge.moves,
          bestScore: Math.max(Number(previous.bestScore) || 0, finalScore),
          completedAt: todayKey()
        };
        store.mergeProgress.completed = Object.keys(store.mergeProgress.completedMissions).length;
        store.mergeProgress.bestScore = Math.max(store.mergeProgress.bestScore, finalScore);
        if (!store.mergeProgress.bestMoves || merge.moves < store.mergeProgress.bestMoves) store.mergeProgress.bestMoves = merge.moves;
        store.mergeProgress.bestMission = mission.label || mission.id || '梅花合成';
        award('merge', finalScore, '梅花合成');
        return;
      }
      writeJson(storageKey, store);
      setFeedback('error', message);
      playFeedback('error');
      render();
    };

    const evaluateMerge = () => {
      const mission = currentMergeMission();
      const target = mergeTargetTile(mission);
      if (highestMergeTile() >= target) {
        finishMerge(true, `完成 ${mission.label || '合成任務'}，已合出 ${mergeTiles[target] || target}。`);
        return true;
      }
      if (merge.moves >= mergeMoveLimit(mission)) {
        finishMerge(false, `步數用完，最高只合到 ${mergeTiles[highestMergeTile()] || highestMergeTile() || 0}。`);
        return true;
      }
      if (!hasMergeMoves()) {
        finishMerge(false, `盤面已滿，最高只合到 ${mergeTiles[highestMergeTile()] || highestMergeTile() || 0}。`);
        return true;
      }
      return false;
    };

    const collapseLine = (line) => {
      const values = line.filter(Boolean);
      const result = [];
      for (let i = 0; i < values.length; i += 1) {
        if (values[i] === values[i + 1]) {
          const merged = values[i] * 2;
          merge.score += merged;
          result.push(merged);
          i += 1;
        } else {
          result.push(values[i]);
        }
      }
      while (result.length < 4) result.push(0);
      return result;
    };

    const moveMerge = (direction) => {
      if (!merge || merge.phase !== 'playing') {
        setMotion('merge', 'error');
        setFeedback('info', '先選擇一個梅花合成任務。');
        render();
        return;
      }
      const before = merge.board.join(',');
      const beforeBoard = [...merge.board];
      const beforeScore = merge.score;
      const next = Array(16).fill(0);
      for (let i = 0; i < 4; i += 1) {
        let line;
        if (direction === 'left' || direction === 'right') {
          line = [0, 1, 2, 3].map((col) => merge.board[i * 4 + col]);
          if (direction === 'right') line.reverse();
          line = collapseLine(line);
          if (direction === 'right') line.reverse();
          line.forEach((value, col) => { next[i * 4 + col] = value; });
        } else if (direction === 'up' || direction === 'down') {
          line = [0, 1, 2, 3].map((row) => merge.board[row * 4 + i]);
          if (direction === 'down') line.reverse();
          line = collapseLine(line);
          if (direction === 'down') line.reverse();
          line.forEach((value, row) => { next[row * 4 + i] = value; });
        } else {
          return;
        }
      }
      merge.board = next;
      if (before !== merge.board.join(',')) {
        merge.moves += 1;
        const spawnedIndex = addMergeTile();
        const gain = merge.score - beforeScore;
        const changedIds = merge.board
          .map((value, index) => (value && value !== beforeBoard[index] ? String(index) : null))
          .filter(Boolean)
          .slice(0, 8);
        if (spawnedIndex !== null && spawnedIndex !== undefined) changedIds.push(String(spawnedIndex));
        setMotion('merge', gain ? 'merge' : 'move', { ids: [...new Set(changedIds)] });
        merge.message = gain ? `合併成功，+${gain} 分。` : `移動成功，剩 ${mergeRemainingMoves()} 步。`;
        setFeedback(gain ? 'success' : 'info', merge.message);
        playFeedback(gain ? 'success' : 'info');
        if (evaluateMerge()) return;
        render();
        return;
      }
      setMotion('merge', 'blocked');
      setFeedback('error', '這個方向沒有可移動的方塊。');
      playFeedback('error');
      render();
    };

    const selectMergeMissions = () => {
      merge = createMerge(merge?.missionId || mergeMissions[0]?.id);
      setFeedback('info', '已回到梅花合成任務選擇。');
      render();
    };

    const renderMergeMissions = () => `<div class="yw-merge-mission-grid">${mergeMissions.map((mission) => {
      const target = mergeTargetTile(mission);
      const record = mergeMissionRecord(mission);
      const status = record.bestMoves ? `最佳 ${record.bestMoves} 步` : '可挑戰';
      return `<button class="yw-merge-mission" type="button" data-merge-start="${escapeHtml(mission.id)}" aria-pressed="${merge?.missionId === mission.id}">
        <div class="yw-market-choice-content">
          ${visualIcon(mergeVisualFor(target), mergeTiles[target] || String(target))}
          <div>
            <strong>${escapeHtml(mission.label || mission.id || '合成任務')}</strong>
            <small>${escapeHtml(mission.difficulty || '任務')}｜目標 ${escapeHtml(mergeTiles[target] || String(target))}｜${mergeMoveLimit(mission)} 步｜${status}</small>
            <small>${escapeHtml(mission.description || '合出目標方塊即可完成。')}</small>
          </div>
        </div>
      </button>`;
    }).join('')}</div>`;

    const renderMergeBoard = () => `<div class="yw-merge-board" data-board-motion="${escapeHtml(motionType('merge'))}" aria-label="梅花合成棋盤">
      ${merge.board.map((value, index) => `<div class="yw-merge-cell" data-value="${value}" data-motion="${escapeHtml(motionType('merge', index))}">
        ${value ? visualIcon(mergeVisualFor(value), mergeTiles[value] || String(value)) : ''}
        <strong>${value || 0}</strong>
        <small>${escapeHtml(mergeTiles[value] || '')}</small>
      </div>`).join('')}
    </div>`;

    const renderMergeControls = () => `<div class="yw-merge-controls" aria-label="梅花合成方向控制">
      <div class="yw-merge-dir-placeholder"></div>
      <button class="yw-merge-dir" type="button" data-merge="up" aria-label="向上移動">↑</button>
      <div class="yw-merge-dir-placeholder"></div>
      <button class="yw-merge-dir" type="button" data-merge="left" aria-label="向左移動">←</button>
      <button class="yw-merge-dir" type="button" data-merge="down" aria-label="向下移動">↓</button>
      <button class="yw-merge-dir" type="button" data-merge="right" aria-label="向右移動">→</button>
    </div>`;

    const renderMerge = () => {
      if (!mergeMissions.length) return '<div class="yw-output">梅花合成任務尚未建立。</div>';
      const mission = currentMergeMission();
      const target = mergeTargetTile(mission);
      const highestTile = highestMergeTile();
      const progress = Math.min(100, Math.round((highestTile / target) * 100));
      if (merge.phase === 'select') return `<div class="yw-grid">
        <div class="yw-game-head">
          <div><strong>梅花合成</strong><div class="text-sm text-slate-600">${escapeHtml(merge.message)}</div></div>
          <div class="yw-pill-row"><span class="yw-pill">${escapeHtml(mergeConfig.modeLabel || '任務模式')}</span><span class="yw-pill">任務 ${mergeMissions.length}</span><span class="yw-pill">最高 ${store.mergeProgress.highestTile || 0}</span></div>
        </div>
        <div class="yw-output">選任務後合併相同方塊。達成目標會套用任務獎勵、完成獎勵與剩餘步數加分；鍵盤方向鍵與手機方向按鈕都可操作。</div>
        ${renderMergeMissions()}
      </div>`;
      if (merge.phase === 'result') return `<div class="yw-grid yw-motion-surface" data-motion="${escapeHtml(motionType('merge'))}">
        <div class="yw-game-head">
          <div><strong>梅花合成</strong><div class="text-sm text-slate-600">${escapeHtml(merge.message)}</div></div>
          <div class="yw-pill-row"><span class="yw-pill">${escapeHtml(mission.label || '任務')}</span><span class="yw-pill">${merge.success ? '已完成' : '未通過'}</span><span class="yw-pill">最高 ${highestTile}</span></div>
        </div>
        <div class="yw-score-banner" data-motion="${escapeHtml(motionType('merge'))}"><div>${merge.success ? '任務結算' : '本輪未結算積分'}</div><strong>${merge.finalScore || 0}</strong></div>
        <div class="yw-merge-layout">
          ${renderMergeBoard()}
          <div class="yw-grid">
            <div class="yw-output">步數 ${merge.moves}/${mergeMoveLimit(mission)}｜本輪分數 ${merge.score}｜全站最高方塊 ${store.mergeProgress.highestTile}｜最佳步數 ${store.mergeProgress.bestMoves || '尚未完成'}</div>
            <div class="yw-toolbar">
              <button class="yw-btn yw-btn-primary" type="button" data-merge-start="${escapeHtml(mission.id)}">重開本任務</button>
              <button class="yw-btn" type="button" data-merge-select>選其他任務</button>
            </div>
          </div>
        </div>
      </div>`;
      return `<div class="yw-grid yw-motion-surface" data-motion="${escapeHtml(motionType('merge'))}">
        <div class="yw-game-head">
          <div><strong>梅花合成</strong><div class="text-sm text-slate-600">${escapeHtml(merge.message)}</div></div>
          <div class="yw-pill-row"><span class="yw-pill">${escapeHtml(mission.label || '任務')}</span><span class="yw-pill">目標 ${escapeHtml(mergeTiles[target] || String(target))}</span><span class="yw-pill">剩 ${mergeRemainingMoves(mission)} 步</span></div>
        </div>
        <div class="yw-route-progress" aria-label="合成目標進度"><div style="width:${progress}%;background:#16a34a"></div></div>
        <div class="yw-merge-layout">
          ${renderMergeBoard()}
          <div class="yw-grid">
            <div class="yw-output">分數 ${merge.score}｜步數 ${merge.moves}/${mergeMoveLimit(mission)}｜目前最高 ${highestTile || 0}｜完成獎勵 ${mergeRewardFor(mission) + mergeCompletionBonus}，剩餘每步 +${mergeRemainingMoveBonus}</div>
            ${renderMergeControls()}
            <div class="yw-toolbar">
              <button class="yw-btn" type="button" data-merge-start="${escapeHtml(mission.id)}">重開</button>
              <button class="yw-btn" type="button" data-merge-select>選任務</button>
            </div>
          </div>
        </div>
      </div>`;
    };

    const quizSetById = (id) => quizSets.find((set) => set.id === id) || quizSets[0] || {};
    const quizQuestionsForSet = (set) => listOrFallback(set.questions, quizQuestions).slice(0, quizQuestionLimit);
    const currentQuizSet = () => quizSetById(quiz.setId);
    const currentQuizQuestions = () => quizQuestionsForSet(currentQuizSet());
    const currentQuiz = () => currentQuizQuestions()[quiz.index];
    const quizAccuracy = () => {
      const total = quiz.answers.length || currentQuizQuestions().length || 1;
      return Math.round((quiz.correct / total) * 100);
    };

    const startQuiz = (setId) => {
      const set = quizSetById(setId);
      const questions = quizQuestionsForSet(set);
      if (!questions.length) {
        setFeedback('error', '這組題庫尚未建立題目。');
        playFeedback('error');
        return;
      }
      quiz = {
        phase: 'answer',
        setId: set.id,
        index: 0,
        score: 0,
        correct: 0,
        answers: [],
        done: false,
        message: `${set.label || '生活快問'}開始，共 ${questions.length} 題。`
      };
      setMotion('quiz', 'enter');
      setFeedback('info', quiz.message);
      playFeedback('info');
      render();
    };

    const finishQuiz = () => {
      const set = currentQuizSet();
      const total = currentQuizQuestions().length || quiz.answers.length || 1;
      const accuracy = Math.round((quiz.correct / total) * 100);
      if (quiz.correct === total && quizPerfectBonus) quiz.score += quizPerfectBonus;
      quiz.phase = 'review';
      quiz.done = true;
      quiz.accuracy = accuracy;
      quiz.message = accuracy >= quizPassAccuracy
        ? `完成 ${set.label || '生活快問'}，正確率 ${accuracy}%。`
        : `完成 ${set.label || '生活快問'}，先看錯題回顧再挑戰。`;
      setMotion('quiz', accuracy >= quizPassAccuracy ? 'complete' : 'error');
      store.quizProgress.attempts += 1;
      if (accuracy > store.quizProgress.bestAccuracy || (accuracy === store.quizProgress.bestAccuracy && quiz.score > store.quizProgress.bestScore)) {
        store.quizProgress.bestAccuracy = accuracy;
        store.quizProgress.bestScore = quiz.score;
        store.quizProgress.bestSet = set.label || set.id || '生活快問';
      }
      award('quiz', quiz.score, '生活快問');
    };

    const chooseQuiz = (choice) => {
      const question = currentQuiz();
      if (!question || quiz.done || quiz.phase !== 'answer') return;
      const correct = choice === question.answer;
      if (correct) {
        quiz.correct += 1;
        quiz.score += quizCorrectScore;
        quiz.message = `答對，+${quizCorrectScore} 分。`;
        setMotion('quiz', 'success');
        setFeedback('success', quiz.message);
        playFeedback('success');
      } else {
        quiz.message = `答錯，正確答案是 ${question.answer}。`;
        setMotion('quiz', 'error');
        setFeedback('error', quiz.message);
        playFeedback('error');
      }
      quiz.answers.push({
        question: question.question,
        answer: question.answer,
        choice,
        correct,
        explain: question.explain || ''
      });
      quiz.index += 1;
      if (quiz.index >= currentQuizQuestions().length) {
        finishQuiz();
        return;
      }
      render();
    };

    const renderQuizSets = () => `<div class="yw-quiz-set-grid">${quizSets.map((set) => {
      const questions = quizQuestionsForSet(set);
      return `<button class="yw-quiz-set" type="button" data-quiz-start="${escapeHtml(set.id)}">
        <div class="yw-quiz-set-main">
          ${visualIcon(quizVisualFor(set), set.label || set.id || '題庫')}
          <div>
            <strong>${escapeHtml(set.label || set.id || '題庫')}</strong>
            <small>${escapeHtml(set.difficulty || '題庫')}｜${questions.length} 題｜${escapeHtml(set.description || '完成後顯示正確率與錯題回顧。')}</small>
          </div>
        </div>
      </button>`;
    }).join('')}</div>`;

    const renderQuizReview = () => {
      const wrong = quiz.answers.filter((item) => !item.correct);
      const items = (wrong.length ? wrong : quiz.answers).map((item, index) => `<div class="yw-quiz-review-item" data-correct="${item.correct}">
        <div class="text-xs font-black ${item.correct ? 'text-emerald-700' : 'text-rose-700'}">${item.correct ? '答對' : `錯題 ${index + 1}`}</div>
        <strong>${escapeHtml(item.question)}</strong>
        <div class="mt-1 text-sm text-slate-600">你的答案：${escapeHtml(item.choice)}｜正確答案：${escapeHtml(item.answer)}</div>
        ${item.explain ? `<div class="mt-1 text-sm text-slate-500">${escapeHtml(item.explain)}</div>` : ''}
      </div>`).join('');
      return `<div class="yw-quiz-review">${items || '<div class="yw-output">沒有答題紀錄。</div>'}</div>`;
    };

    const renderQuiz = () => {
      const set = currentQuizSet();
      const questions = currentQuizQuestions();
      const question = currentQuiz();
      const progress = questions.length ? Math.round((quiz.index / questions.length) * 100) : 0;
      if (!quizSets.length) return '<div class="yw-output">快問題庫尚未建立。</div>';
      if (quiz.phase === 'select') return `<div class="yw-grid">
        <div class="yw-game-head">
          <div><strong>生活快問</strong><div class="text-sm text-slate-600">${escapeHtml(quiz.message)}</div></div>
          <div class="yw-pill-row"><span class="yw-pill">${escapeHtml(quizConfig.modeLabel || '題庫模式')}</span><span class="yw-pill">題庫 ${quizSets.length}</span><span class="yw-pill">最高 ${store.quizProgress.bestAccuracy}%</span></div>
        </div>
        <div class="yw-output">每題 ${quizCorrectScore} 分，全對加 ${quizPerfectBonus} 分；達到 ${quizPassAccuracy}% 以上視為通過。本機已挑戰 ${store.quizProgress.attempts} 次。</div>
        ${renderQuizSets()}
      </div>`;
      if (quiz.phase === 'review') return `<div class="yw-grid yw-motion-surface" data-motion="${escapeHtml(motionType('quiz'))}">
        <div class="yw-game-head">
          <div><strong>生活快問</strong><div class="text-sm text-slate-600">${escapeHtml(quiz.message)}</div></div>
          <div class="yw-pill-row"><span class="yw-pill">${escapeHtml(set.label || '題庫')}</span><span class="yw-pill">正確率 ${quiz.accuracy || quizAccuracy()}%</span><span class="yw-pill">${quiz.score} 分</span></div>
        </div>
        <div class="yw-score-banner" data-motion="${escapeHtml(motionType('quiz'))}"><div>${escapeHtml(set.label || '完成快問')}</div><strong>${quiz.score}</strong></div>
        <div class="yw-output">答對 ${quiz.correct}/${questions.length} 題｜最高正確率 ${store.quizProgress.bestAccuracy}%｜最高分 ${store.quizProgress.bestScore}</div>
        ${renderQuizReview()}
        <div class="yw-toolbar">
          <button class="yw-btn yw-btn-primary" type="button" data-quiz-reset>選其他題庫</button>
          <button class="yw-btn" type="button" data-quiz-start="${escapeHtml(set.id)}">再挑戰本題庫</button>
        </div>
      </div>`;
      if (!question) return '<div class="yw-output">這組題庫尚未建立題目。</div>';
      return `<div class="yw-grid yw-motion-surface" data-motion="${escapeHtml(motionType('quiz'))}">
        <div class="yw-game-head">
          <div><strong>生活快問</strong><div class="text-sm text-slate-600">${escapeHtml(quiz.message)}</div></div>
          <div class="yw-pill-row"><span class="yw-pill">${escapeHtml(set.label || '題庫')}</span><span class="yw-pill">第 ${Math.min(quiz.index + 1, questions.length)}/${questions.length}</span><span class="yw-pill">分數 ${quiz.score}</span></div>
        </div>
        <div class="mt-1 h-3 overflow-hidden rounded-full bg-slate-200"><div style="height:100%;width:${progress}%;background:#2563eb"></div></div>
        <div class="yw-output yw-motion-surface" data-motion="${escapeHtml(motionType('quiz'))}">${escapeHtml(question.question)}</div>
        <div class="yw-option-grid">${listOrFallback(question.options, []).map((item) => `<button class="yw-choice" type="button" data-quiz-choice="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join('')}</div>
      </div>`;
    };

    const resetQuiz = () => {
      quiz = createQuiz();
      setFeedback('info', '生活快問已回到題庫選擇。');
      render();
    };

    const resetScores = () => {
      if (!resetArmed) {
        resetArmed = true;
        setFeedback('info', '再點一次「確認清除」才會重置分數。');
        render();
        return;
      }
      store.total = 0;
      store.played = 0;
      store.highs = {};
      store.recent = [];
      store.daily = { date: todayKey(), completed: [] };
      store.routeProgress = { highestLevel: 0, highestScore: 0 };
      store.quizProgress = { attempts: 0, bestAccuracy: 0, bestScore: 0, bestSet: '' };
      store.mergeProgress = { completed: 0, highestTile: 0, bestScore: 0, bestMoves: 0, bestMission: '', completedMissions: {} };
      store.achievements = { unlocked: {} };
      route = { phase: 'idle', levelIndex: 0, sequence: [], input: [], options: [], message: '選一條楊梅生活路線，記住站點後照順序點回去。' };
      merge = createMerge();
      quiz = createQuiz();
      stopMarketTimer();
      market = createMarket();
      resetArmed = false;
      setFeedback('success', '分數與今日挑戰紀錄已重置。');
      playFeedback('success');
      writeJson(storageKey, store);
      render();
    };

    const handleMergeKeydown = (event) => {
      if (active !== 'merge' || !merge || merge.phase !== 'playing') return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      const direction = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right'
      }[event.key];
      if (!direction) return;
      event.preventDefault();
      moveMerge(direction);
    };
    window.addEventListener('keydown', handleMergeKeydown);

    const renderGameArea = () => {
      if (active === 'route') return renderRoute();
      if (active === 'market') return renderMarket();
      if (active === 'merge') return renderMerge();
      return renderQuiz();
    };

    const render = () => {
      const bestScore = Math.max(0, ...Object.values(store.highs).map((value) => Number(value) || 0));
      const dailyCompleted = listOrFallback(store.daily.completed, []).includes(dailyGame);
      const dailyLabel = games[dailyGame] || dailyGame;
      const recentHtml = store.recent.length
        ? store.recent.map((item) => `<div class="yw-list-item"><strong>${escapeHtml(item.label)}</strong><div class="text-sm text-slate-600">${Number(item.score) || 0} 分${item.bonus ? `｜每日 +${item.bonus}` : ''}</div></div>`).join('')
        : '<div class="yw-list-item">完成一局後會顯示近期紀錄。</div>';
      const achievementHtml = renderAchievements();
      const widget = mountWidget(`<div class="yw-grid">
        <div class="yw-grid yw-grid-md-3">
          <div class="yw-stat"><div class="text-2xl font-black">${store.total}</div><div class="text-xs font-bold text-slate-500">總積分</div></div>
          <div class="yw-stat"><div class="text-2xl font-black">${store.played}</div><div class="text-xs font-bold text-slate-500">完成局數</div></div>
          <div class="yw-stat"><div class="text-2xl font-black">${bestScore}</div><div class="text-xs font-bold text-slate-500">單局最高</div></div>
        </div>
        ${feedback ? `<div class="yw-toast yw-toast-${escapeHtml(feedback.type)}" role="status" aria-live="polite">${escapeHtml(feedback.text)}</div>` : ''}
        <div class="yw-grid yw-grid-md-2">
          <div class="yw-daily-card">
            <div class="text-sm font-black">${escapeHtml(dailyChallenge.label || '每日挑戰')}</div>
            <h2 class="mt-1 text-xl font-black">${escapeHtml(dailyLabel)}</h2>
            <p class="mt-1 text-sm">${escapeHtml(dailyChallenge.resetText || '每日自動更換指定遊戲。')}</p>
            <div class="yw-toolbar mt-3">
              <button class="yw-btn yw-btn-primary" type="button" data-daily-game>${dailyCompleted ? '今日已完成' : `挑戰 +${Number(dailyChallenge.bonus) || 0}`}</button>
            </div>
          </div>
          <div class="yw-output">
            <div class="text-sm font-black text-slate-500">近期紀錄</div>
            <div class="yw-list mt-2">${recentHtml}</div>
          </div>
        </div>
        ${achievementHtml}
        <div class="yw-toolbar">
          ${Object.entries(games).map(([id, label]) => `<button class="yw-tab" type="button" data-game-tab="${id}" aria-pressed="${active === id}">${escapeHtml(label)}</button>`).join('')}
          <button class="yw-btn" type="button" data-reset-scores>${resetArmed ? '確認清除' : '重置分數'}</button>
        </div>
        <div id="gameArea" data-motion="${escapeHtml(motionType('game'))}">${renderGameArea()}</div>
      </div>`);

      widget.querySelectorAll('[data-game-tab]').forEach((button) => button.addEventListener('click', () => {
        active = button.dataset.gameTab;
        resetArmed = false;
        setMotion('game', 'enter');
        render();
      }));
      widget.querySelector('[data-daily-game]')?.addEventListener('click', () => {
        active = dailyGame;
        resetArmed = false;
        setMotion('game', 'enter');
        setFeedback(dailyCompleted ? 'info' : 'success', dailyCompleted ? '今日挑戰已完成，可以繼續刷新高分。' : `已切到今日挑戰：${dailyLabel}`);
        render();
      });
      widget.querySelector('[data-reset-scores]')?.addEventListener('click', resetScores);
      widget.querySelectorAll('[data-route-level]').forEach((button) => button.addEventListener('click', () => selectRouteLevel(button.dataset.routeLevel)));
      widget.querySelector('[data-route-start]')?.addEventListener('click', startRoute);
      widget.querySelector('[data-route-ready]')?.addEventListener('click', () => {
        route.phase = 'input';
        route.message = '照剛才順序點回每一站。';
        setMotion('route', 'enter');
        playFeedback('info');
        render();
      });
      widget.querySelectorAll('[data-route-choice]').forEach((button) => button.addEventListener('click', () => chooseRoute(button.dataset.routeChoice)));
      widget.querySelector('[data-market-start]')?.addEventListener('click', startMarket);
      widget.querySelectorAll('[data-market-choice]').forEach((button) => button.addEventListener('click', () => chooseMarket(button.dataset.marketChoice)));
      widget.querySelector('[data-market-reset]')?.addEventListener('click', resetMarket);
      widget.querySelectorAll('[data-merge-start]').forEach((button) => button.addEventListener('click', () => initMerge(button.dataset.mergeStart)));
      widget.querySelectorAll('[data-merge]').forEach((button) => button.addEventListener('click', () => moveMerge(button.dataset.merge)));
      widget.querySelector('[data-merge-select]')?.addEventListener('click', selectMergeMissions);
      widget.querySelectorAll('[data-quiz-start]').forEach((button) => button.addEventListener('click', () => startQuiz(button.dataset.quizStart)));
      widget.querySelectorAll('[data-quiz-choice]').forEach((button) => button.addEventListener('click', () => chooseQuiz(button.dataset.quizChoice)));
      widget.querySelector('[data-quiz-reset]')?.addEventListener('click', resetQuiz);
      motionCue = null;
    };

    render();
  };

  const renderFortune = () => {
    const fortuneData = objectOrFallback(entertainmentData.fortune, {});
    const fortunes = listOrFallback(fortuneData.fortunes, [
      { level: '穩定前進', note: '今天適合整理待辦和溝通細節，重要事情先從小步驟開始。', action: '先完成一件拖延已久的小事。', avoid: '避免臨時改變所有安排。' },
    ]);
    const tarot = listOrFallback(fortuneData.tarot, [{ name: '太陽', meaning: '把成果攤開來看' }])
      .map((item) => (typeof item === 'string' ? item : `${item.name}：${item.meaning}`));
    const colors = listOrFallback(fortuneData.colors, ['藍色']);
    const crystals = listOrFallback(fortuneData.crystals, ['白水晶']);
    const zodiacs = listOrFallback(fortuneData.zodiacs, ['水瓶']);
    const storageKey = fortuneData.storageKey || 'yangmei_fortune_history_v2';
    let history = readJson(storageKey, []);

    const buildFortune = (mode, zodiac = fortuneData.defaultZodiac || zodiacs[0]) => {
      const seed = `${todayKey()}-${mode}-${zodiac}-${Date.now()}`;
      const base = fortunes[seededIndex(seed, fortunes.length)];
      const luckyNumber = seededIndex(seed + 'num', 9) + 1;
      const luckyColor = colors[seededIndex(seed + 'color', colors.length)];
      const crystal = crystals[seededIndex(seed + 'crystal', crystals.length)];
      const cards = [0, 1, 2].map((index) => tarot[seededIndex(seed + 'tarot' + index, tarot.length)]);
      return {
        id: `${Date.now()}`,
        date: todayKey(),
        mode,
        zodiac,
        title: `${zodiac}｜${base.level}`,
        text: `${base.note} 建議：${base.action} 避免：${base.avoid}`,
        detail: `幸運數字 ${luckyNumber}｜幸運色 ${luckyColor}｜建議水晶 ${crystal}`,
        tarot: cards
      };
    };

    let current = buildFortune('today');
    const saveHistory = () => {
      history = [current, ...history.filter((item) => item.id !== current.id)].slice(0, 8);
      writeJson(storageKey, history);
      render();
    };

    const render = () => {
      const widget = mountWidget(`<div class="yw-grid">
        <div class="yw-grid yw-grid-md-3">
          <label><span class="text-sm font-black text-slate-600">星座</span><select id="fortuneZodiac" class="yw-input mt-1">${zodiacs.map((item) => `<option value="${item}" ${item === current.zodiac ? 'selected' : ''}>${item}</option>`).join('')}</select></label>
          <button class="yw-btn yw-btn-primary" type="button" data-fortune="today">抽今日運勢</button>
          <button class="yw-btn" type="button" data-fortune="tarot">抽三張塔羅</button>
        </div>
        <div class="yw-output" id="fortuneResult">
          <div class="text-sm font-black text-purple-700">${current.mode === 'tarot' ? '三張塔羅' : '今日運勢'}</div>
          <h2 class="text-xl font-black text-slate-950">${escapeHtml(current.title)}</h2>
          <p class="mt-2">${escapeHtml(current.text)}</p>
          <p class="mt-2 font-bold">${escapeHtml(current.detail)}</p>
          <ul class="mt-2 yw-list">${current.tarot.map((item) => `<li class="yw-list-item">${escapeHtml(item)}</li>`).join('')}</ul>
        </div>
        <div class="yw-toolbar">
          <button class="yw-btn" type="button" data-save-fortune>保存紀錄</button>
          <button class="yw-btn" type="button" data-copy-fortune>複製分享文字</button>
        </div>
        <div>
          <h2 class="text-lg font-black text-slate-950">最近紀錄</h2>
          <div class="yw-list mt-2">${history.length ? history.map((item) => `<div class="yw-list-item"><strong>${escapeHtml(item.title)}</strong><div class="text-sm text-slate-600">${escapeHtml(item.detail)}</div></div>`).join('') : '<div class="yw-list-item">尚未保存紀錄。</div>'}</div>
        </div>
      </div>`);
      widget.querySelectorAll('[data-fortune]').forEach((button) => button.addEventListener('click', () => {
        current = buildFortune(button.dataset.fortune, widget.querySelector('#fortuneZodiac').value);
        render();
      }));
      widget.querySelector('[data-save-fortune]')?.addEventListener('click', saveHistory);
      widget.querySelector('[data-copy-fortune]')?.addEventListener('click', async () => {
        await copyText(`${current.title}\n${current.text}\n${current.detail}`);
        widget.querySelector('[data-copy-fortune]').textContent = '已複製';
      });
    };
    render();
  };

  const renderMbti = () => {
    const mbtiData = objectOrFallback(entertainmentData.mbti, {});
    const questions = listOrFallback(mbtiData.questions, [{
      axis: 'EI',
      leftText: '聚會後你通常更有能量',
      rightText: '獨處後你通常更有能量',
      leftType: 'E',
      rightType: 'I'
    }]);
    const descriptions = Object.fromEntries(Object.entries(objectOrFallback(mbtiData.types, {}))
      .map(([type, item]) => [type, typeof item === 'string' ? item : item.summary]));
    const storageKey = mbtiData.storageKey || 'yangmei_mbti_result_v2';
    const disclaimer = mbtiData.disclaimer || '非專業心理評量，僅供自我觀察與娛樂。';
    let answers = [];
    let cursor = 0;
    let result = readJson(storageKey, null);

    const calculate = () => {
      const score = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
      answers.forEach((value) => { score[value] += 1; });
      const type = `${score.E >= score.I ? 'E' : 'I'}${score.S >= score.N ? 'S' : 'N'}${score.T >= score.F ? 'T' : 'F'}${score.J >= score.P ? 'J' : 'P'}`;
      result = { type, score, desc: descriptions[type] || '此類型描述尚未建立，請先補齊 MBTI 資料檔。', completedAt: todayKey() };
      writeJson(storageKey, result);
    };

    const render = () => {
      const question = questions[cursor];
      const progress = Math.round((answers.length / questions.length) * 100);
      const resultHtml = result ? `<div class="yw-output">
        <div class="text-sm font-black text-slate-500">最近結果</div>
        <h2 class="text-3xl font-black text-slate-950">${escapeHtml(result.type)}</h2>
        <p class="mt-2">${escapeHtml(result.desc)}</p>
        <p class="mt-2 text-sm">${escapeHtml(disclaimer)}</p>
      </div>` : '';
      const widget = mountWidget(`<div class="yw-grid">
        <div class="yw-output">
          <div class="flex items-center justify-between gap-3"><strong>測驗進度 ${answers.length}/${questions.length}</strong><span>${progress}%</span></div>
          <div class="mt-2 h-3 overflow-hidden rounded-full bg-slate-200"><div style="height:100%;width:${progress}%;background:#2563eb"></div></div>
        </div>
        ${answers.length < questions.length ? `<div class="yw-output">
          <div class="text-sm font-black text-blue-700">第 ${cursor + 1} 題</div>
          <h2 class="mt-1 text-xl font-black text-slate-950">${escapeHtml(question.leftText)}，還是 ${escapeHtml(question.rightText)}？</h2>
          <div class="yw-grid mt-4">
            <button class="yw-choice" type="button" data-mbti-choice="${question.leftType}">${escapeHtml(question.leftText)}</button>
            <button class="yw-choice" type="button" data-mbti-choice="${question.rightType}">${escapeHtml(question.rightText)}</button>
          </div>
        </div>` : resultHtml}
        <div class="yw-toolbar">
          <button class="yw-btn" type="button" data-mbti-back ${cursor === 0 ? 'disabled' : ''}>上一題</button>
          <button class="yw-btn yw-btn-primary" type="button" data-mbti-reset>重新開始</button>
        </div>
      </div>`);
      widget.querySelectorAll('[data-mbti-choice]').forEach((button) => button.addEventListener('click', () => {
        answers[cursor] = button.dataset.mbtiChoice;
        if (answers.length >= questions.length) calculate();
        else cursor = Math.min(cursor + 1, questions.length - 1);
        render();
      }));
      widget.querySelector('[data-mbti-back]')?.addEventListener('click', () => {
        if (cursor > 0) cursor -= 1;
        answers = answers.slice(0, cursor);
        render();
      });
      widget.querySelector('[data-mbti-reset]')?.addEventListener('click', () => {
        answers = [];
        cursor = 0;
        result = null;
        writeJson(storageKey, null);
        render();
      });
    };
    render();
  };

  const renderDailyQuote = () => {
    const quoteData = objectOrFallback(entertainmentData.dailyQuote, {});
    const quotes = listOrFallback(quoteData.quotes, [{
      category: 'life',
      text: '生活不需要每一刻都完美，但需要偶爾被好好整理。',
      author: '楊梅生活集'
    }]);
    const labels = objectOrFallback(quoteData.categories, { all: '全部', life: '生活' });
    const favKey = quoteData.storageKey || 'yangmei_quote_favorites_v2';
    let category = 'all';
    let query = '';
    let current = quotes[seededIndex(todayKey(), quotes.length)];
    let favorites = readJson(favKey, []).map((item) => ({
      ...item,
      quote: Array.isArray(item.quote) ? { category: item.quote[0], text: item.quote[1], author: item.quote[2] } : item.quote
    })).filter((item) => item.quote?.text);

    const quoteId = (quote) => `${quote.category}:${quote.text}`;
    const filtered = () => quotes.filter((quote) => (
      category === 'all' || quote.category === category
    ) && (
      !query || `${quote.text} ${quote.author || ''} ${labels[quote.category] || ''}`.toLowerCase().includes(query.toLowerCase())
    ));

    const setCurrent = (quote) => {
      current = quote;
      render();
    };

    const toggleFavorite = () => {
      const id = quoteId(current);
      const exists = favorites.some((item) => item.id === id);
      favorites = exists ? favorites.filter((item) => item.id !== id) : [{ id, quote: current, addedAt: Date.now() }, ...favorites].slice(0, 12);
      writeJson(favKey, favorites);
      render();
    };

    const render = () => {
      const list = filtered();
      const isFav = favorites.some((item) => item.id === quoteId(current));
      const widget = mountWidget(`<div class="yw-grid">
        <div class="yw-grid yw-grid-md-3">
          <label><span class="text-sm font-black text-slate-600">分類</span><select id="quoteCategory" class="yw-input mt-1">${Object.entries(labels).map(([id, label]) => `<option value="${id}" ${id === category ? 'selected' : ''}>${label}</option>`).join('')}</select></label>
          <label><span class="text-sm font-black text-slate-600">搜尋</span><input id="quoteSearch" class="yw-input mt-1" type="search" value="${escapeHtml(query)}" placeholder="輸入關鍵字"></label>
          <button class="yw-btn yw-btn-primary" type="button" data-random-quote>隨機金句</button>
        </div>
        <div class="yw-output">
          <div class="text-sm font-black text-green-700">${escapeHtml(labels[current.category] || current.category)}</div>
          <h2 class="mt-1 text-2xl font-black text-slate-950">${escapeHtml(current.text)}</h2>
          <p class="mt-2 text-sm text-slate-500">${escapeHtml(current.author || '楊梅生活集')}</p>
        </div>
        <div class="yw-toolbar">
          <button class="yw-btn" type="button" data-fav-quote>${isFav ? '取消收藏' : '收藏金句'}</button>
          <button class="yw-btn" type="button" data-copy-quote>複製分享文字</button>
        </div>
        <div class="yw-grid yw-grid-md-2">
          <div>
            <h2 class="text-lg font-black text-slate-950">搜尋結果 ${list.length}</h2>
            <div class="yw-list mt-2">${list.map((quote, index) => `<button class="yw-choice" type="button" data-quote-index="${index}"><strong>${escapeHtml(labels[quote.category] || quote.category)}</strong><br>${escapeHtml(quote.text)}</button>`).join('') || '<div class="yw-list-item">沒有符合的金句。</div>'}</div>
          </div>
          <div>
            <h2 class="text-lg font-black text-slate-950">收藏 ${favorites.length}</h2>
            <div class="yw-list mt-2">${favorites.map((item) => `<div class="yw-list-item">${escapeHtml(item.quote.text)}</div>`).join('') || '<div class="yw-list-item">尚未收藏。</div>'}</div>
          </div>
        </div>
      </div>`);
      widget.querySelector('#quoteCategory')?.addEventListener('change', (event) => {
        category = event.target.value;
        render();
      });
      widget.querySelector('#quoteSearch')?.addEventListener('input', (event) => {
        query = event.target.value;
        render();
      });
      widget.querySelector('[data-random-quote]')?.addEventListener('click', () => {
        const list = filtered();
        setCurrent(list[Math.floor(Math.random() * list.length)] || quotes[0]);
      });
      widget.querySelectorAll('[data-quote-index]').forEach((button) => button.addEventListener('click', () => setCurrent(filtered()[Number(button.dataset.quoteIndex)])));
      widget.querySelector('[data-fav-quote]')?.addEventListener('click', toggleFavorite);
      widget.querySelector('[data-copy-quote]')?.addEventListener('click', async () => {
        await copyText(`${current.text} - ${current.author || '楊梅生活集'}`);
        widget.querySelector('[data-copy-quote]').textContent = '已複製';
      });
    };
    render();
  };

  if (pageId === 'games') renderGames();
  if (pageId === 'fortune') renderFortune();
  if (pageId === 'mbti') renderMbti();
  if (pageId === 'daily-quote') renderDailyQuote();
})();
