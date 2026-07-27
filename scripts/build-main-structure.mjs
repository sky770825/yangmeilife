import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import servicePageEnhancements from '../data/service-page-source.mjs';
import { assertValidVendorData } from './validate-vendor-data.mjs';

const root = process.cwd();
const generatedAt = process.env.BUILD_TIMESTAMP || new Date().toISOString();
const internalCategoryIds = new Set(['site-core', 'vendors-admin']);

const isPublicCategory = (categoryOrId) => {
  const id = typeof categoryOrId === 'string' ? categoryOrId : categoryOrId?.id;
  return Boolean(id) && !internalCategoryIds.has(id);
};

const readJson = async (file) => JSON.parse(await readFile(path.join(root, file), 'utf8'));
const exists = async (file) => {
  try {
    await stat(path.join(root, file));
    return true;
  } catch {
    return false;
  }
};

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const writeText = async (file, content) => {
  await mkdir(path.dirname(path.join(root, file)), { recursive: true });
  await writeFile(path.join(root, file), content);
};

const servicePageSet = new Set(Object.keys(servicePageEnhancements));
const slugFromPage = (page) => page.replace(/\.html$/, '');
const rootHref = (file) => `../../${file}`;

const externalTargetUrl = (fn) => {
  const candidate = fn.externalUrl || fn.currentUrl;
  return isExternalUrl(candidate) ? candidate : null;
};

const implementationStatus = (fn, localPageExists, vendorPageSet) => {
  if (fn.implementationStatus) return fn.implementationStatus;
  if (vendorPageSet.has(fn.page)) return 'vendor-page';
  if (servicePageSet.has(fn.id)) return 'service-page';
  if (fn.status === 'current-page') return 'current-page';
  if (localPageExists) return 'bridge-page';
  if (fn.archivePath) return 'archive-only';
  return 'none';
};

const statusText = (fn, localPageExists, vendorPageSet) => {
  const implementation = implementationStatus(fn, localPageExists, vendorPageSet);
  if (implementation === 'vendor-page') return '店家資訊';
  if (implementation === 'service-page') return '可使用';
  if (implementation === 'current-page') return '可使用';
  if (implementation === 'bridge-page' && fn.primaryTarget !== 'external-link') return '可使用';
  if (fn.targetType === 'external-link' || fn.primaryTarget === 'external-link' || fn.external) return '外部服務';
  if (implementation === 'bridge-page') return '可使用';
  if (fn.archivePath) return '整理中';
  return '準備中';
};

const statusClass = (status) => {
  if (status === '店家資訊') return 'bg-emerald-50 text-emerald-700';
  if (status === '可使用') return 'bg-emerald-50 text-emerald-700';
  if (status === '外部服務') return 'bg-amber-50 text-amber-700';
  if (status === '整理中') return 'bg-slate-100 text-slate-700';
  return 'bg-rose-50 text-rose-700';
};

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

const serviceDataStatus = (enhancement = {}) => {
  const status = enhancement.dataStatus || {};
  return {
    dataReadiness: status.dataReadiness || enhancement.dataReadiness || '展示資料',
    verificationStatus: status.verificationStatus || enhancement.verificationStatus || '待核實',
    needsVerification: status.needsVerification ?? enhancement.needsVerification ?? true,
    sourceFile: status.sourceFile || 'data/service-page-source.mjs',
    sourceNote: status.sourceNote || enhancement.sourceNote || '此頁目前為新版功能架構與示範資料，尚未完成官方資料、商家資訊或 API 來源核實。',
    lastVerifiedAt: status.lastVerifiedAt || enhancement.lastVerifiedAt || null,
    updatedAt: status.updatedAt || enhancement.updatedAt || generatedAt
  };
};

const vendorCategoryDataStatus = (category) => {
  const status = category.dataStatus || {};
  return {
    dataReadiness: status.dataReadiness || '展示資料',
    verificationStatus: status.verificationStatus || '待核實',
    needsVerification: status.needsVerification ?? true,
    sourceFile: status.sourceFile || `${category.dataFolder}/vendors.json`,
    sourceNote: status.sourceNote || '此頁商家為展示資料，店名、價格、評分與照片尚未完成商家授權或人工核實。',
    lastVerifiedAt: status.lastVerifiedAt || null,
    updatedAt: status.updatedAt || generatedAt
  };
};

const emptyish = (value) => value === null || value === undefined || value === '';

const hasOfficialSource = (vendor) =>
  !emptyish(vendor.officialUrl)
  || !emptyish(vendor.officialSource)
  || (Array.isArray(vendor.sourceUrls) && vendor.sourceUrls.length > 0);

const computeMissingFields = (vendor) => {
  const missing = [];
  if (emptyish(vendor.phone)) missing.push('phone');
  if (emptyish(vendor.address)) missing.push('address');
  if (!hasOfficialSource(vendor)) missing.push('officialSource');
  return missing;
};

const resolveVerificationLevel = (vendor, verified) => {
  if (verified) return 'verified';
  if (hasOfficialSource(vendor)) {
    return vendor.verificationLevel === 'verified' ? 'verified' : 'source_found';
  }
  if ((vendor.dataReadiness || '展示資料') === '展示資料') return 'demo';
  return 'needs_contact';
};

const normalizeVendorRecord = (vendor, category) => {
  const verified = vendor.verified === true;
  const missingFields = computeMissingFields(vendor);
  const verificationLevel = resolveVerificationLevel(vendor, verified);
  const dataSource = vendor.dataSource || `${category.dataFolder}/vendors.json`;
  return {
    ...vendor,
    phone: vendor.phone ?? null,
    address: vendor.address ?? null,
    businessHours: vendor.businessHours ?? null,
    officialUrl: vendor.officialUrl ?? null,
    mapUrl: vendor.mapUrl ?? null,
    lineUrl: vendor.lineUrl ?? null,
    contactNote: emptyish(vendor.contactNote)
      ? (missingFields.includes('phone') ? '待補官方聯絡資料' : '')
      : vendor.contactNote,
    verified,
    needsVerification: vendor.needsVerification ?? !verified,
    verificationStatus: vendor.verificationStatus || (verified ? '已核實' : '待核實'),
    verificationLevel,
    missingFields,
    dataReadiness: vendor.dataReadiness || '展示資料',
    dataSource,
    sourceNote: vendor.sourceNote || '展示資料，尚未完成店家或平台核實。',
    officialSource: vendor.officialSource ?? null,
    sourceUrls: Array.isArray(vendor.sourceUrls) ? vendor.sourceUrls : [],
    lastVerifiedAt: vendor.lastVerifiedAt ?? null,
    updatedAt: vendor.updatedAt || generatedAt
  };
};

const readCategoryVendorSource = async (slug, category) => {
  const vendorFilePath = `data/vendors/categories/${slug}/vendors.json`;
  const vendorFile = await readJson(vendorFilePath);

  return {
    sourceFile: vendorFilePath,
    vendorFile,
    vendors: vendorFile.vendors
      .filter((vendor) => vendor.publicationStatus === 'published')
      .map((vendor) => normalizeVendorRecord(vendor, category)),
    candidateVendors: Array.isArray(vendorFile.candidateVendors) ? vendorFile.candidateVendors : []
  };
};

const vendorVerificationCounts = (vendors) => ({
  total: vendors.length,
  verified: vendors.filter((vendor) => vendor.verified).length,
  needsVerification: vendors.filter((vendor) => vendor.needsVerification).length,
  missingPhone: vendors.filter((vendor) => emptyish(vendor.phone)).length,
  missingAddress: vendors.filter((vendor) => emptyish(vendor.address)).length,
  missingOfficialSource: vendors.filter((vendor) => vendor.missingFields.includes('officialSource')).length
});

const vendorCandidateCounts = (candidateVendors = []) => ({
  total: candidateVendors.length,
  needsSource: candidateVendors.filter((vendor) => !hasOfficialSource(vendor)).length,
  needsPhone: candidateVendors.filter((vendor) => emptyish(vendor.phone)).length,
  needsAddress: candidateVendors.filter((vendor) => emptyish(vendor.address)).length
});

const vendorCategoryDataStatusFromVendors = (category, vendors) => {
  const current = category.dataStatus || {};
  const counts = vendorVerificationCounts(vendors);
  const allVerified = counts.total > 0 && counts.verified === counts.total;
  const partiallyVerified = counts.verified > 0 && !allVerified;
  const emptyActive = counts.total === 0;
  const sourceNote = allVerified
    ? '此分類已有店家完成電話、地址與來源核實；未有官方來源的欄位維持空值。'
    : partiallyVerified
      ? `此分類已有 ${counts.verified} 筆店家完成來源核實，仍有 ${counts.needsVerification} 筆待補。`
      : emptyActive
        ? '此分類尚未收錄已核實店家；展示資料已移出前台，待確認官方來源後再上架。'
      : current.sourceNote || '此頁商家為展示資料，店名、價格、評分與照片尚未完成商家授權或人工核實。';

  return {
    dataReadiness: allVerified ? '已核實資料' : partiallyVerified ? '部分核實資料' : emptyActive ? '資料建置中' : current.dataReadiness || '展示資料',
    verificationStatus: allVerified ? '已核實' : partiallyVerified ? '部分核實' : emptyActive ? '待收錄' : current.verificationStatus || '待核實',
    needsVerification: !allVerified,
    sourceFile: current.sourceFile || `${category.dataFolder}/vendors.json`,
    sourceNote,
    lastVerifiedAt: counts.verified > 0
      ? vendors.filter((vendor) => vendor.verified && vendor.lastVerifiedAt).map((vendor) => vendor.lastVerifiedAt).sort().at(-1) || current.lastVerifiedAt || generatedAt.slice(0, 10)
      : current.lastVerifiedAt || null,
    updatedAt: generatedAt
  };
};

const buildVendorUpdates = (vendorCategory, vendors, candidateVendors = []) => {
  const counts = vendorVerificationCounts(vendors);
  const candidateCounts = vendorCandidateCounts(candidateVendors);
  return {
    generatedAt,
    owner: '商家營運維護',
    page: vendorCategory.page,
    title: vendorCategory.title,
    source: `${vendorCategory.dataFolder}/vendors.json`,
    summary: `前台共 ${counts.total} 筆廠商；已核實 ${counts.verified} 筆、待核實 ${counts.needsVerification} 筆；待補候選 ${candidateCounts.total} 筆。`,
    counts,
    candidateCounts,
    updateChecklist: [
      '店名與服務地區',
      '電話（官方或平台可確認來源）',
      '地址（官方或地圖可確認來源）',
      '官方網站 / 地圖 / LINE 連結',
      '營業時間（有官方來源才可填）',
      '價格區間與服務標籤',
      '照片網址（需授權）',
      '核實狀態與 lastVerifiedAt'
    ],
    vendors: vendors.map((vendor) => ({
      id: vendor.id,
      name: vendor.name,
      verificationStatus: vendor.verificationStatus,
      verificationLevel: vendor.verificationLevel,
      needsVerification: vendor.needsVerification,
      missingFields: vendor.missingFields,
      lastVerifiedAt: vendor.lastVerifiedAt,
      updatedAt: vendor.updatedAt
    })),
    candidateVendors: candidateVendors.map((vendor) => ({
      id: vendor.id,
      name: vendor.name,
      area: vendor.area,
      reason: vendor.removalReason || vendor.sourceNote || '展示資料未核實，暫不於前台顯示。',
      verificationStatus: vendor.verificationStatus || '待核實',
      missingFields: Array.isArray(vendor.missingFields) ? vendor.missingFields : computeMissingFields(vendor)
    }))
  };
};

const buildVendorCategoryReadme = (vendorCategory, vendors, candidateVendors = []) => {
  const counts = vendorVerificationCounts(vendors);
  const candidateCounts = vendorCandidateCounts(candidateVendors);
  return `# ${vendorCategory.title}

## 對應頁面

- 前台頁面：\`${vendorCategory.page}\`
- 所屬主分類：${vendorCategory.categoryTitle}
- 主分類入口：\`${vendorCategory.categoryUrl}\`

## 資料來源

- 廠商資料：\`vendors.json\`（**正式更新入口**）
- 核實清單：\`updates.json\`（由產生器依 \`vendors.json\` 產出）
- 前台顯示：只讀取 \`vendors\` 陣列
- 待補清單：\`candidateVendors\`，不會顯示於前台廠商卡片

## 更新流程

1. 編輯本資料夾的 \`vendors.json\`。
2. 有官方或平台可確認來源時，才填入電話、地址、營業時間與官方連結。
3. 從專案根目錄執行 \`node scripts/build-main-structure.mjs\` 同步前台與 \`updates.json\`。
4. 人工核實完成後，更新 \`verified\`、\`verificationStatus\`、\`verificationLevel\` 與 \`lastVerifiedAt\`。

## 重要提醒

- **不可**把展示資料標為已核實（\`verified: true\`）。
- **不可**自行編造電話、地址、官方來源或營業時間。
- 沒有可確認來源時，欄位保留 \`null\` 或空字串，並維持 \`verificationStatus: "待核實"\`。

## 必填欄位清單

| 欄位 | 說明 |
| --- | --- |
| \`id\` | 分類內唯一識別 |
| \`name\` | 店名 |
| \`area\` | 服務地區 |
| \`phone\` | 電話（無來源則 \`null\`） |
| \`address\` | 地址（無來源則 \`null\`） |
| \`officialUrl\` / \`officialSource\` / \`sourceUrls\` | 官方來源（無則 \`null\` / \`[]\`） |
| \`verificationStatus\` | \`待核實\` 或 \`已核實\` |
| \`verificationLevel\` | \`demo\` / \`needs_contact\` / \`source_found\` / \`verified\` |
| \`missingFields\` | 由產生器自動計算，亦可手動對照 |

## 核實狀態說明

| 狀態 | 意義 |
| --- | --- |
| \`demo\` | 展示資料，不可當真實商家 |
| \`needs_contact\` | 有店名但缺聯絡與官方來源 |
| \`source_found\` | 找到官方來源但尚未人工確認 |
| \`verified\` | 已由官方來源或人工確認 |

## 目前統計

- 廠商總數：${counts.total}
- 已核實：${counts.verified}
- 待核實：${counts.needsVerification}
- 缺電話：${counts.missingPhone}
- 缺地址：${counts.missingAddress}
- 缺官方來源：${counts.missingOfficialSource}
- 待補候選：${candidateCounts.total}
- 最後同步：${generatedAt}
`;
};

const vendorsReadme = (categories) => `# 廠商資料分類

## 資料邊界

- **正式更新入口**：\`data/vendors/categories/<slug>/vendors.json\`
- **分類 metadata 與 runtime 匯總**：\`data/vendors/vendor-categories.json\`（由產生器輸出）
- **核實清單產出**：\`data/vendors/categories/<slug>/updates.json\`
- **前端載入**：\`assets/js/vendor-data.js\`、\`assets/js/vendor-page.js\`

分類數：${categories.length}
廠商數：${categories.reduce((sum, item) => sum + item.vendors.length, 0)}

## 更新流程

1. 到對應分類資料夾編輯 \`vendors.json\`。
2. 執行：

\`\`\`bash
node scripts/build-main-structure.mjs
\`\`\`

3. 產生器會讀取各分類 \`vendors.json\`，**不會**用 \`vendor-categories.json\` 內嵌資料覆蓋分類資料夾內容。

## 不可造假提醒

- 展示資料維持 \`verificationStatus: "待核實"\`、\`verified: false\`。
- 沒有官方或平台可確認來源時，電話、地址、營業時間與官方連結保留 \`null\`。

| 分類頁 | 分類名稱 | 資料夾 | 廠商數 |
| --- | --- | --- | --- |
${categories.map((category) => `| ${category.page} | ${category.title} | \`${category.dataFolder}\` | ${category.vendors.length} |`).join('\n')}
`;

const isExternalUrl = (url = '') => /^https?:\/\//.test(url);

const localTargetUrl = (fn, localPageExists = Boolean(fn.page)) => {
  if (localPageExists && fn.page) return fn.page;
  if (fn.currentUrl && !isExternalUrl(fn.currentUrl)) return fn.currentUrl;
  return null;
};

const formatHref = (url, fromRoot = false) => {
  if (!url) return '#';
  return isExternalUrl(url) || fromRoot ? url : rootHref(url);
};

const primaryTargetUrl = (fn, localPageExists = Boolean(fn.page)) => {
  const externalUrl = externalTargetUrl(fn);
  const localUrl = localTargetUrl(fn, localPageExists);

  if (fn.targetType === 'dual-entry') {
    return fn.primaryTarget === 'local-page'
      ? (localUrl || externalUrl || fn.archivePath || '#')
      : (externalUrl || localUrl || fn.archivePath || '#');
  }

  if (fn.targetType === 'local-page') return localUrl || fn.archivePath || '#';
  if (fn.targetType === 'external-link') return externalUrl || localUrl || fn.archivePath || '#';
  if (fn.targetType === 'archive-fallback') return fn.archivePath || localUrl || externalUrl || '#';

  return externalUrl || localUrl || fn.archivePath || '#';
};

const secondaryTargetUrl = (fn, localPageExists = Boolean(fn.page)) => {
  if (fn.targetType !== 'dual-entry') return null;
  if (fn.secondaryTargetUrl) return fn.secondaryTargetUrl;
  return fn.primaryTarget === 'local-page' ? externalTargetUrl(fn) : localTargetUrl(fn, localPageExists);
};

const buildLocalHref = (fn, fromRoot = false, localPageExists = Boolean(fn.page)) => {
  const target = primaryTargetUrl(fn, localPageExists);
  return formatHref(target, fromRoot);
};

const buildSecondaryHref = (fn, fromRoot = false, localPageExists = Boolean(fn.page)) => {
  const target = secondaryTargetUrl(fn, localPageExists);
  if (!target) return null;
  return formatHref(target, fromRoot);
};

const targetLabel = (targetType) => {
  if (targetType === 'external-link') return '前往服務';
  if (targetType === 'local-page') return '查看內容';
  return '更多資訊';
};

const routingStatusFields = (fn, localPageExists = Boolean(fn.page)) => ({
  implementationStatus: fn.implementationStatus || null,
  targetType: fn.targetType || null,
  externalUrl: externalTargetUrl(fn),
  primaryTarget: fn.primaryTarget || null,
  primaryTargetUrl: primaryTargetUrl(fn, localPageExists),
  secondaryTargetType: fn.secondaryTargetType || null,
  secondaryTargetUrl: secondaryTargetUrl(fn, localPageExists)
});

const tagList = (tags = []) =>
  tags
    .map((tag) => `<span class="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">${escapeHtml(tag)}</span>`)
    .join('');

const pageHead = ({ title, description, cssHref }) => `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>${escapeHtml(title)} - 楊梅人在地生活集</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="icon" type="image/svg+xml" href="${cssHref.replace(/assets\/css\/tailwind\.min\.css$/, 'assets/favicon.svg')}">
<link rel="stylesheet" href="${cssHref}">
<style>
html,body{width:100%;max-width:100%;overflow-x:hidden}
body{min-height:100vh;background:linear-gradient(135deg,#f8fafc 0%,#eef2ff 46%,#fff7ed 100%);color:#0f172a;overscroll-behavior-x:none}
main,section,article,header,footer,nav{max-width:100%;min-width:0}
img,svg,video,canvas{max-width:100%;height:auto}
.panel{background:rgba(255,255,255,.88);border:1px solid rgba(148,163,184,.24);box-shadow:0 18px 50px rgba(15,23,42,.08)}
.card{background:rgba(255,255,255,.94);border:1px solid rgba(148,163,184,.24);box-shadow:0 8px 24px rgba(15,23,42,.06)}
.result-card{background:rgba(255,255,255,.96);border:1px solid rgba(148,163,184,.24);box-shadow:0 6px 18px rgba(15,23,42,.055)}
.nav-link{min-height:44px;display:inline-flex;align-items:center;justify-content:center;border-radius:.7rem;padding:0 .85rem;font-weight:800;text-decoration:none}
.nav-link.bg-white{background:#fff;color:#4338ca}
.nav-link.bg-slate-900{background:#0f172a;color:#fff}
.nav-link:hover{filter:brightness(.98)}
.ui-break-anywhere{overflow-wrap:anywhere;word-break:break-word}
.ui-table-fixed{width:100%;table-layout:fixed}
.ui-min-w-0{min-width:0}
.compact-desc{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}
.compact-desc--2{-webkit-line-clamp:2}
.compact-desc--3{-webkit-line-clamp:3}
.compact-title{overflow-wrap:anywhere}
.compact-count-badge{display:inline-flex;min-width:2.55rem;min-height:28px;align-items:center;justify-content:center;text-align:center;line-height:1.05}
.compact-stat{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.search-hero-grid,.search-form{display:grid;gap:.5rem}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.panel,.card,.result-card{min-width:0;overflow-wrap:anywhere}
.vendor-card-grid{display:grid;gap:12px;grid-template-columns:minmax(0,1fr)}
.vendor-card-grid--single{max-width:560px;margin-inline:auto;grid-template-columns:minmax(0,1fr)!important}
.vendor-card{display:flex;min-width:0;overflow:hidden;flex-direction:column;border:1px solid rgba(148,163,184,.28);border-radius:10px;background:#fff;box-shadow:0 8px 18px rgba(15,23,42,.055)}
.vendor-card-image{display:block;width:100%;aspect-ratio:2/1;height:auto;object-fit:cover;background:#e2e8f0}
.vendor-card-body{display:flex;min-width:0;flex:1;flex-direction:column;padding:12px}
.vendor-card-heading{display:flex;min-width:0;align-items:flex-start;justify-content:space-between;gap:8px}
.vendor-card-title{min-width:0;font-size:17px;line-height:1.28;font-weight:900;color:#020617;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.vendor-card-status{flex-shrink:0;border-radius:9999px;padding:4px 7px;font-size:11px;line-height:1;font-weight:900}
.vendor-card-status--verified{background:#ecfdf5;color:#047857}
.vendor-card-status--pending{background:#fff1f2;color:#be123c}
.vendor-card-meta{margin-top:5px;display:flex;flex-wrap:wrap;gap:6px;font-size:13px;line-height:1.25;font-weight:800;color:#475569}
.vendor-card-links{margin-top:9px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.vendor-card-link{display:flex;min-height:44px;min-width:0;align-items:center;justify-content:center;gap:5px;border:1px solid rgba(203,213,225,.95);border-radius:9px;background:#f8fafc;padding:0 7px;color:#334155;font-size:12px;font-weight:900;line-height:1;text-decoration:none;touch-action:manipulation}
.vendor-card-link:hover{border-color:rgba(99,102,241,.45);background:#eef2ff;color:#3730a3}
.vendor-card-link:focus-visible{outline:3px solid rgba(99,102,241,.35);outline-offset:2px}
.vendor-card-link svg,.vendor-card-action svg{display:block;width:15px;height:15px;flex:0 0 15px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}
.vendor-card-link-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.vendor-card-link--disabled{border-color:#e2e8f0;background:#f8fafc;color:#94a3b8}
.vendor-card-tags{margin-top:9px;display:flex;flex-wrap:wrap;gap:6px}
.vendor-card-tag{border-radius:9999px;padding:4px 7px;font-size:11px;line-height:1;font-weight:900}
.vendor-card-actions{margin-top:auto;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding-top:10px}
.vendor-card-action{display:flex;min-height:44px;align-items:center;justify-content:center;gap:6px;border-radius:8px;padding:0 10px;font-size:13px;font-weight:900;line-height:1.2;text-align:center;touch-action:manipulation}
.vendor-card-action--primary{color:#fff}
.vendor-card-action--secondary{background:#f1f5f9;color:#334155}
.vendor-card-action:focus-visible{outline:3px solid rgba(99,102,241,.35);outline-offset:2px}
@media (min-width:640px){.vendor-card-grid--gallery{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (min-width:900px){.search-hero-grid{grid-template-columns:minmax(0,1fr) minmax(420px,520px);align-items:end}.search-form{grid-template-columns:minmax(0,1fr) 160px 96px}}
@media (min-width:1024px){.vendor-card-grid--compact{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (min-width:1180px){.category-card-grid,#serviceGrid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (min-width:1280px){.vendor-card-grid--gallery{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:640px){
main{padding-inline:16px!important;padding-top:24px!important;padding-bottom:28px!important}
.panel{border-radius:16px!important;box-shadow:0 12px 30px rgba(15,23,42,.07)}
.card,.result-card{border-radius:14px!important;box-shadow:0 6px 16px rgba(15,23,42,.055)}
.entry-hero{padding:20px!important}
.entry-hero-title{font-size:1.75rem!important;line-height:1.1!important;letter-spacing:0!important}
.entry-hero-text{margin-top:.65rem!important;font-size:.95rem!important;line-height:1.55!important}
.entry-pill-row{margin-top:.9rem!important;gap:.4rem!important}
.entry-pill{padding:.42rem .65rem!important;font-size:.8rem!important;line-height:1.1!important}
.category-card-grid{margin-top:1rem!important;gap:.75rem!important}
.category-overview-card,.category-function-card,.result-card,.service-card{padding:14px!important}
.category-card-icon{font-size:1.5rem!important;line-height:1!important}
.category-card-title{margin-top:.45rem!important;font-size:1.08rem!important;line-height:1.25!important}
.compact-desc{margin-top:.45rem!important;line-height:1.45!important}
.compact-count-badge{min-width:34px;min-height:26px;padding-inline:7px!important}
.compact-stat{padding:.45rem .5rem!important}
.service-card{padding:12px!important}
.service-card .compact-desc{margin-top:.35rem!important;-webkit-line-clamp:2!important}
.service-card-tags{margin-top:.5rem!important;gap:.25rem!important}
.search-shell{border-radius:14px!important;padding:12px!important}
}
@media (max-width:480px){.vendor-card-body{padding:12px}.vendor-card-title{font-size:16px}.vendor-card-links{gap:6px}.vendor-card-link{padding:0 6px;font-size:12px}.vendor-card-actions{padding-top:10px}}
@media (max-width:380px){.entry-hero-title{font-size:1.62rem!important}.nav-link{padding:0 .7rem}.entry-pill{font-size:.76rem!important}.compact-count-badge{min-width:32px}}
</style>
</head>`;

const categoryPage = ({ category, functions, localPageMap, vendorPageSet }) => {
  const cards = functions.map((fn) => {
    const localPageExists = localPageMap.get(fn.page) || false;
    const status = statusText(fn, localPageExists, vendorPageSet);
    const href = buildLocalHref(fn, false, localPageExists);
    const secondaryHref = buildSecondaryHref(fn, false, localPageExists);
    const externalAttrs = href.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
    const secondaryAttrs = secondaryHref?.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
    const secondaryAction = secondaryHref
      ? `<a class="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-black text-slate-700 hover:border-indigo-300" href="${escapeHtml(secondaryHref)}"${secondaryAttrs}>${escapeHtml(targetLabel(fn.secondaryTargetType))}</a>`
      : '';
    const primaryLabel = href.startsWith('http') ? '前往服務' : '查看內容';
    const archive = '';
    return `<article class="category-function-card card rounded-xl p-4 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md">
  <div class="flex items-start justify-between gap-3">
    <div class="min-w-0">
      <h3 class="compact-title text-base font-black leading-snug text-slate-950 sm:text-lg">${escapeHtml(fn.title)}</h3>
      <p class="compact-desc compact-desc--2 mt-1 text-sm leading-5 text-slate-600">${escapeHtml(fn.description)}</p>
    </div>
    <span class="shrink-0 rounded-full px-2 py-1 text-xs font-black ${statusClass(status)}">${escapeHtml(status)}</span>
  </div>
  <div class="mt-3 flex flex-wrap gap-2">${tagList(fn.tags)}</div>
  ${archive}
  <div class="mt-3 flex flex-wrap gap-2">
    <a class="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-900 px-3 text-sm font-black text-white hover:bg-indigo-700" href="${escapeHtml(href)}"${externalAttrs}>${escapeHtml(primaryLabel)}</a>
    ${secondaryAction}
  </div>
</article>`;
  }).join('\n');

  const active = functions.filter((fn) => primaryTargetUrl(fn, localPageMap.get(fn.page) || false) !== '#').length;
  const vendorCount = functions.filter((fn) => vendorPageSet.has(fn.page)).length;
  return `${pageHead({
    title: category.title,
    description: category.description,
    cssHref: '../../assets/css/tailwind.min.css'
  })}
<body>
<main class="mx-auto max-w-6xl px-4 py-8 sm:py-10">
  <nav class="mb-5 flex flex-wrap gap-2 text-sm">
    <a class="nav-link bg-white text-indigo-700 shadow-sm" href="../../index.html">首頁</a>
    <a class="nav-link bg-white text-indigo-700 shadow-sm" href="../index.html">功能分類</a>
  </nav>
  <header class="entry-hero panel rounded-2xl p-6 sm:p-8">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div class="category-card-icon text-3xl font-black text-indigo-600 sm:text-4xl">${escapeHtml(category.icon)}</div>
        <h1 class="entry-hero-title mt-2 text-3xl font-black tracking-tight sm:text-4xl">${escapeHtml(category.title)}</h1>
        <p class="entry-hero-text mt-3 max-w-3xl text-slate-600">${escapeHtml(category.description)}</p>
      </div>
      <div class="grid grid-cols-3 gap-2 text-center text-sm">
        <div class="rounded-xl bg-white px-3 py-2 shadow-sm"><div class="font-black text-slate-950">${functions.length}</div><div class="text-xs text-slate-500">功能</div></div>
        <div class="rounded-xl bg-white px-3 py-2 shadow-sm"><div class="font-black text-slate-950">${active}</div><div class="text-xs text-slate-500">可使用</div></div>
        <div class="rounded-xl bg-white px-3 py-2 shadow-sm"><div class="font-black text-slate-950">${vendorCount}</div><div class="text-xs text-slate-500">店家</div></div>
      </div>
    </div>
  </header>
  <section class="category-card-grid mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
${cards}
  </section>
</main>
</body>
</html>
`;
};

const updatesJson = ({ category, functions, localPageMap, vendorPageSet }) => ({
  generatedAt,
  category: {
    id: category.id,
    title: category.title,
    owner: category.updateOwner,
    folder: `pages/${category.id}/`
  },
  files: {
    index: `pages/${category.id}/index.html`,
    updatesPage: `pages/${category.id}/updates.html`,
    updatesData: `pages/${category.id}/updates.json`
  },
  functions: functions.map((fn) => {
    const localPageExists = localPageMap.get(fn.page) || false;
    const primaryUrl = primaryTargetUrl(fn, localPageExists);
    return {
      id: fn.id,
      title: fn.title,
      status: statusText(fn, localPageExists, vendorPageSet),
      ...routingStatusFields(fn, localPageExists),
      page: fn.page || null,
      currentUrl: primaryUrl === '#' ? null : primaryUrl,
      archivePath: fn.archivePath || null,
      updateType: fn.updateType || 'content',
      tags: fn.tags || []
    };
  })
});

const updatesPage = ({ category, functions, localPageMap, vendorPageSet }) => {
  const rows = functions.map((fn) => {
    const localPageExists = localPageMap.get(fn.page) || false;
    const status = statusText(fn, localPageExists, vendorPageSet);
    const primary = primaryTargetUrl(fn, localPageExists);
    const secondary = secondaryTargetUrl(fn, localPageExists);
    const current = primary === '#' ? '待建立' : primary;
    const secondaryText = secondary ? `<div class="mt-1 text-xs text-slate-500">次入口：${escapeHtml(secondary)}</div>` : '';
    const archive = fn.archivePath || '-';
    return `<tr class="border-b border-slate-200 align-top">
  <td class="ui-break-anywhere break-words py-3 pr-3 font-black">${escapeHtml(fn.title)}</td>
  <td class="px-3 py-3"><span class="rounded-full px-2 py-1 text-xs font-black ${statusClass(status)}">${escapeHtml(status)}</span></td>
  <td class="ui-break-anywhere break-all px-3 py-3 text-slate-600">${escapeHtml(current)}${secondaryText}</td>
  <td class="ui-break-anywhere break-all py-3 pl-3 text-slate-600">${escapeHtml(archive)}</td>
</tr>`;
  }).join('\n');

  return `${pageHead({
    title: `${category.title}資訊更新`,
    description: `${category.title}的功能維護與內容更新清單`,
    cssHref: '../../assets/css/tailwind.min.css'
  })}
<body>
<main class="mx-auto max-w-6xl px-4 py-8 sm:py-10">
  <nav class="mb-5 flex flex-wrap gap-2 text-sm">
    <a class="nav-link bg-white text-indigo-700 shadow-sm" href="../../index.html">首頁</a>
    <a class="nav-link bg-white text-indigo-700 shadow-sm" href="../index.html">功能分類</a>
    <a class="nav-link bg-slate-900 text-white shadow-sm" href="index.html">${escapeHtml(category.title)}</a>
  </nav>
  <header class="panel rounded-2xl p-6 sm:p-8">
    <div class="text-sm font-black text-indigo-600">資訊更新中心</div>
    <h1 class="mt-2 text-3xl font-black tracking-tight sm:text-4xl">${escapeHtml(category.title)}｜資訊更新</h1>
    <p class="mt-3 max-w-3xl text-slate-600">這個頁面對應同資料夾內的 <code class="rounded bg-white px-1.5 py-0.5">updates.json</code>，之後更新內容先改資料檔，再同步到正式頁。</p>
    <div class="mt-5 flex flex-wrap gap-2 text-sm font-bold text-slate-600">
      <span class="rounded-full bg-white px-3 py-1">維護：${escapeHtml(category.updateOwner)}</span>
      <span class="rounded-full bg-white px-3 py-1">功能：${functions.length}</span>
      <span class="rounded-full bg-white px-3 py-1">生成：${generatedAt}</span>
    </div>
  </header>
  <section class="mt-6 max-w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <table class="ui-table-fixed w-full table-fixed text-left text-sm">
      <thead>
        <tr class="border-b border-slate-300 text-slate-500">
          <th class="ui-break-anywhere w-[22%] break-words py-2 pr-3">功能</th>
          <th class="ui-break-anywhere w-[22%] break-words px-3 py-2">狀態</th>
          <th class="ui-break-anywhere w-[30%] break-words px-3 py-2">目前頁/連結</th>
          <th class="ui-break-anywhere w-[26%] break-words py-2 pl-3">舊版來源</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </section>
</main>
</body>
</html>
`;
};

const rootBridgePage = ({ fn, category, localPageExists, vendorPageSet }) => {
  const status = statusText(fn, localPageExists, vendorPageSet);
  const externalUrl = externalTargetUrl(fn);
  const externalButton = externalUrl
    ? `<a class="inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-600 px-4 font-bold text-white hover:bg-emerald-700" href="${escapeHtml(externalUrl)}" target="_blank" rel="noopener noreferrer">前往服務</a>`
    : '';
  const archiveButton = '';
  return `${pageHead({
    title: fn.title,
    description: fn.description,
    cssHref: 'assets/css/tailwind.min.css'
  })}
<body>
<main class="mx-auto flex min-h-screen max-w-4xl items-center px-4 py-8">
  <section class="panel w-full rounded-2xl p-6 sm:p-8">
    <nav class="flex flex-wrap gap-2 text-sm">
      <a class="nav-link bg-white text-indigo-700 shadow-sm" href="index.html">首頁</a>
      <a class="nav-link bg-white text-indigo-700 shadow-sm" href="pages/index.html">功能分類</a>
      <a class="nav-link bg-slate-900 text-white shadow-sm" href="pages/${escapeHtml(category.id)}/index.html">${escapeHtml(category.title)}</a>
    </nav>
    <div class="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div class="text-sm font-black text-indigo-600">${escapeHtml(category.title)}</div>
        <h1 class="mt-2 text-3xl font-black tracking-tight sm:text-4xl">${escapeHtml(fn.title)}</h1>
        <p class="mt-3 text-slate-600">${escapeHtml(fn.description)}</p>
      </div>
      <span class="shrink-0 rounded-full px-3 py-1 text-sm font-black ${statusClass(status)}">${escapeHtml(status)}</span>
    </div>
    <div class="mt-5 flex flex-wrap gap-2">${tagList(fn.tags)}</div>
    <div class="mt-6 flex flex-wrap gap-3">
      <a class="inline-flex min-h-11 items-center justify-center rounded-lg bg-indigo-600 px-4 font-bold text-white hover:bg-indigo-700" href="pages/${escapeHtml(category.id)}/index.html">查看分類入口</a>
      ${archiveButton}
      ${externalButton}
    </div>
  </section>
</main>
</body>
</html>
`;
};

const serviceFunctionPage = ({ fn, category }) => {
  const config = servicePageConfig(fn, category);
  return `${pageHead({
    title: fn.title,
    description: config.summary || fn.description,
    cssHref: 'assets/css/tailwind.min.css'
  })}
<body>
<main id="servicePageApp" class="mx-auto max-w-6xl px-4 py-8 sm:py-10" data-service-page="${escapeHtml(fn.id)}">
  <section class="panel rounded-2xl p-6">
    <div class="text-sm font-black text-indigo-600">功能頁載入中</div>
    <h1 class="mt-2 text-2xl font-black">${escapeHtml(fn.title)}</h1>
  </section>
</main>
<script src="assets/js/service-page-data.js"></script>
<script src="assets/js/service-page.js"></script>
<script src="assets/js/entertainment-data.js"></script>
<script src="assets/js/entertainment-widgets.js"></script>
</body>
</html>
`;
};

const categoryOverviewPage = ({ categories, functionsByCategory, localPageMap, vendorPageSet }) => {
  const cards = categories.map((category) => {
    const fns = functionsByCategory.get(category.id) || [];
    const active = fns.filter((fn) => fn.external || localPageMap.get(fn.page)).length;
    const vendorCount = fns.filter((fn) => vendorPageSet.has(fn.page)).length;
    return `<a class="category-overview-card card block rounded-xl p-4 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md" href="${escapeHtml(category.id)}/index.html">
  <div class="flex items-start justify-between gap-3">
    <div class="min-w-0">
      <div class="category-card-icon text-2xl font-black text-indigo-600 sm:text-3xl">${escapeHtml(category.icon)}</div>
      <h2 class="category-card-title compact-title mt-2 text-lg font-black leading-snug sm:text-xl">${escapeHtml(category.title)}</h2>
      <p class="compact-desc compact-desc--2 mt-2 text-sm leading-5 text-slate-600">${escapeHtml(category.description)}</p>
    </div>
    <span class="compact-count-badge shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs font-black text-slate-600">${fns.length}<span class="ml-0.5">項</span></span>
  </div>
  <div class="mt-3 grid grid-cols-2 gap-2 text-center text-xs font-bold text-slate-600">
    <span class="compact-stat rounded-lg bg-slate-50 px-2 py-2">可使用 ${active}</span>
    <span class="compact-stat rounded-lg bg-slate-50 px-2 py-2">店家 ${vendorCount}</span>
  </div>
</a>`;
  }).join('\n');

  const totalFunctions = Array.from(functionsByCategory.values()).reduce((sum, fns) => sum + fns.length, 0);
  const totalActive = Array.from(functionsByCategory.values()).flat().filter((fn) => fn.external || localPageMap.get(fn.page)).length;
  return `${pageHead({
    title: '功能分類總覽',
    description: '楊梅人在地生活集功能分類總覽',
    cssHref: '../assets/css/tailwind.min.css'
  })}
<body>
<main class="mx-auto max-w-6xl px-4 py-8 sm:py-10">
  <nav class="mb-5 flex flex-wrap gap-2 text-sm">
    <a class="nav-link bg-white text-indigo-700 shadow-sm" href="../index.html">首頁</a>
  </nav>
  <header class="entry-hero panel rounded-2xl p-6 sm:p-8">
    <h1 class="entry-hero-title text-3xl font-black tracking-tight sm:text-4xl">楊梅人在地生活集｜功能分類總覽</h1>
    <p class="entry-hero-text mt-3 max-w-3xl text-slate-600">依生活場景整理常用服務、店家與工具，快速找到需要的在地資訊。</p>
    <div class="entry-pill-row mt-5 flex flex-wrap gap-2 text-sm font-bold text-slate-600">
      <span class="entry-pill rounded-full bg-white px-3 py-1">分類 ${categories.length}</span>
      <span class="entry-pill rounded-full bg-white px-3 py-1">功能 ${totalFunctions}</span>
      <span class="entry-pill rounded-full bg-white px-3 py-1">可使用 ${totalActive}</span>
    </div>
  </header>
  <section class="category-card-grid mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
${cards}
  </section>
</main>
</body>
</html>
`;
};

const vendorPageCss = `
#vendorPageApp{min-width:0}
#vendorPageApp .vendor-directory-toolbar{display:grid;grid-template-columns:minmax(0,1fr);gap:8px;align-items:center;margin-top:20px;padding:10px;border:1px solid #dbe3ed;border-radius:10px;background:#fff}
#vendorPageApp .vendor-directory-search,#vendorPageApp .vendor-directory-sort{min-width:0;min-height:44px;border:1px solid #cbd5e1;border-radius:8px;background:#fff;padding:0 12px;font:inherit;font-weight:700;color:#0f172a;outline:none}
#vendorPageApp .vendor-directory-search:focus,#vendorPageApp .vendor-directory-sort:focus,#vendorPageApp .vendor-view-button:focus-visible,#vendorPageApp .vendor-card-action:focus-visible{outline:3px solid #bfdbfe;outline-offset:2px}
#vendorPageApp .vendor-view-switch{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
#vendorPageApp .vendor-view-button{min-width:44px;min-height:44px;border:1px solid transparent;border-radius:8px;background:#f1f5f9;padding:8px;color:#334155;font:inherit;font-weight:800;cursor:pointer}
#vendorPageApp .vendor-view-button[aria-pressed="true"]{border-color:#1d4ed8;background:#dbeafe;color:#1e3a8a}
#vendorPageApp .vendor-card-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:12px;align-items:start}
#vendorPageApp .vendor-card-grid--gallery{grid-template-columns:minmax(0,1fr)}
#vendorPageApp .vendor-card-grid--single{width:100%;max-width:620px;margin-inline:auto;grid-template-columns:minmax(0,1fr)!important}
#vendorPageApp .vendor-card{display:flex;min-width:0;align-self:start;flex-direction:column;overflow:hidden;border:1px solid #dbe3ed;border-radius:8px;background:#fff;box-shadow:0 1px 2px rgb(15 23 42 / 8%)}
#vendorPageApp .vendor-card-media{display:flex;width:100%;aspect-ratio:2/1;align-items:center;justify-content:center;overflow:hidden;border-bottom:1px solid #e2e8f0;background:#f8fafc;color:#64748b}
#vendorPageApp .vendor-card-media img{display:block;width:100%;height:100%;object-fit:cover}
#vendorPageApp .vendor-card-media--fallback svg{width:30px;height:30px;fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.6}
#vendorPageApp .vendor-card-media--fallback::before{content:'店家資訊';font-size:13px;font-weight:800;letter-spacing:0;color:#64748b}
#vendorPageApp .vendor-card-body{min-width:0;padding:12px}
#vendorPageApp .vendor-card-heading{min-width:0}
#vendorPageApp .vendor-card-title{margin:0;overflow-wrap:anywhere;word-break:break-word;font-size:18px;line-height:1.35;font-weight:900;color:#0f172a}
#vendorPageApp .vendor-card-meta{display:flex;min-width:0;flex-wrap:wrap;gap:8px;margin-top:6px;color:#475569;font-size:14px;line-height:1.45}
#vendorPageApp .vendor-card-meta span{min-width:0;overflow-wrap:anywhere}
#vendorPageApp .vendor-card-tags{display:flex;min-width:0;flex-wrap:wrap;gap:8px;margin-top:10px}
#vendorPageApp .vendor-card-tag{max-width:100%;overflow-wrap:anywhere;border-radius:999px;padding:4px 8px;font-size:12px;font-weight:800;line-height:1.3}
#vendorPageApp .vendor-card-actions{display:grid;grid-template-columns:repeat(4,minmax(44px,1fr));gap:8px;margin-top:12px}
#vendorPageApp .vendor-card-action{display:inline-flex;min-width:44px;min-height:44px;align-items:center;justify-content:center;gap:6px;overflow:hidden;border:1px solid #cbd5e1;border-radius:8px;background:#fff;padding:6px;color:#0f172a;font:inherit;font-size:13px;font-weight:800;line-height:1.15;text-decoration:none}
#vendorPageApp .vendor-card-action svg{width:18px;height:18px;flex:0 0 auto;fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.8}
#vendorPageApp .vendor-card-action-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#vendorPageApp .vendor-card-action--disabled{cursor:not-allowed;background:#f8fafc;color:#94a3b8}
#vendorPageApp .favorite-btn{cursor:pointer}
@media (min-width:768px){#vendorPageApp .vendor-directory-toolbar{grid-template-columns:minmax(0,1fr) 168px 184px}#vendorPageApp .vendor-card-grid--gallery{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (min-width:1024px){#vendorPageApp .vendor-card-grid--compact{grid-template-columns:repeat(2,minmax(0,1fr))}#vendorPageApp .vendor-card-grid--compact .vendor-card{flex-direction:row}#vendorPageApp .vendor-card-grid--compact .vendor-card-media{width:38%;flex:0 0 38%;align-self:flex-start;border-right:1px solid #e2e8f0;border-bottom:0}#vendorPageApp .vendor-card-grid--compact .vendor-card-body{flex:1}}
@media (min-width:1180px){#vendorPageApp .vendor-card-grid--gallery{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:430px){#vendorPageApp .vendor-card-action-label{display:none}#vendorPageApp .vendor-card-action{padding:6px}}
`;

const vendorPageJs = `(() => {
  const LINE_URL = 'https://line.me/ti/p/@931aeinu';
  const app = document.getElementById('vendorPageApp');
  if (!app) return;

  const vendorPageStyleId = 'vendor-page-responsive-styles';
  if (document.head && !document.getElementById(vendorPageStyleId)) {
    const style = document.createElement('style');
    style.id = vendorPageStyleId;
    style.textContent = ${JSON.stringify(vendorPageCss)};
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

  const quickAction = (icon, label, href, options = {}) => {
    const { external = false, title = null, ariaLabel = label } = options;
    const iconMarkup = iconSvg(icon);
    const labelMarkup = \`<span class="vendor-card-action-label">\${escapeHtml(label)}</span>\`;
    const titleAttr = title ? \` title="\${escapeHtml(title)}"\` : '';
    if (emptyish(href)) {
      return \`<span class="vendor-card-action vendor-card-action--disabled" aria-disabled="true"\${titleAttr || \` title="\${escapeHtml(label)}"\`} aria-label="\${escapeHtml(ariaLabel)}">\${iconMarkup}\${labelMarkup}</span>\`;
    }
    return \`<a class="vendor-card-action" href="\${escapeHtml(href)}"\${external ? ' target="_blank" rel="noopener noreferrer"' : ''}\${titleAttr} aria-label="\${escapeHtml(ariaLabel)}">\${iconMarkup}\${labelMarkup}</a>\`;
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
      ? '<div class="vendor-card-media"><img class="vendor-card-image" src="' + escapeHtml(imageUrl) + '" alt="' + escapeHtml(vendor.name) + '" loading="lazy" decoding="async" width="640" height="360" onerror="this.onerror=null;this.parentElement.classList.add(\\'vendor-card-media--fallback\\');this.parentElement.setAttribute(\\'role\\',\\'img\\');this.parentElement.setAttribute(\\'aria-label\\',this.alt+\\'：圖片無法載入\\');this.remove()"></div>'
      : '<div class="vendor-card-media vendor-card-media--fallback" role="img" aria-label="' + escapeHtml(vendor.name) + '：暫無核可圖片">' + iconSvg('store') + '</div>';
  return \`<article class="vendor-card" data-search="\${escapeHtml(searchHaystack(vendor))}">
      \${imageMarkup}
      <div class="vendor-card-body">
        <div class="vendor-card-heading">
          <h2 class="vendor-card-title">\${escapeHtml(vendor.name)}</h2>
        </div>
        <div class="vendor-card-meta">
          \${metaItems.map((item) => \`<span>\${escapeHtml(item)}</span>\`).join('')}
        </div>
        <div class="vendor-card-tags">
          \${vendor.tags.slice(0, 3).map((tag) => \`<span class="vendor-card-tag" style="background:\${category.accent}16;color:\${category.accent}">\${escapeHtml(tag)}</span>\`).join('')}
        </div>
        <div class="vendor-card-actions">
          \${quickAction('phone', '電話', phoneHref, { title: vendor.phone || '電話待補', ariaLabel: vendor.phone ? '撥打電話：' + vendor.phone : '電話待補' })}
          \${quickAction('map', '導航', vendor.mapUrl || null, { external: Boolean(vendor.mapUrl), title: vendor.address || '地址待補', ariaLabel: vendor.address ? '導航到：' + vendor.address : '地址待補' })}
          \${quickAction('message', contactLabel, contactHref, { external: Boolean(contactHref), title: contactTitle, ariaLabel: contactAriaLabel })}
          <button class="favorite-btn vendor-card-action" type="button" data-vendor-id="\${escapeHtml(vendor.id)}" aria-label="收藏 \${escapeHtml(vendor.name)}" title="收藏 \${escapeHtml(vendor.name)}" aria-pressed="\${favored}">\${iconSvg('bookmark')}<span class="vendor-card-action-label">\${favored ? '已收藏' : '收藏'}</span></button>
        </div>
      </div>
    </article>\`;
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
    count.textContent = \`\${vendors.length} 家\`;
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
    app.innerHTML = \`
      <nav class="mb-5 flex flex-wrap gap-2 text-sm">
        <a class="nav-link bg-white text-indigo-700 shadow-sm" href="index.html">首頁</a>
        <a class="nav-link bg-white text-indigo-700 shadow-sm" href="pages/index.html">功能分類</a>
        <a class="nav-link bg-slate-900 text-white shadow-sm" href="\${escapeHtml(category.categoryUrl)}">\${escapeHtml(displayCategoryTitle)}</a>
      </nav>
      <header class="panel rounded-2xl p-6 sm:p-8">
        <div class="ui-min-w-0 flex min-w-0 flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div class="ui-min-w-0 min-w-0">
            <div class="text-sm font-black" style="color:\${category.accent}">店家分類</div>
            <h1 class="mt-2 text-3xl font-black tracking-tight sm:text-4xl">\${escapeHtml(displayTitle)}</h1>
            <p class="mt-3 max-w-3xl text-slate-600">\${escapeHtml(displayIntro)}</p>
          </div>
          <div class="ui-min-w-0 grid min-w-0 grid-cols-1 gap-2 text-center text-sm">
            <div class="ui-min-w-0 min-w-0 rounded-xl bg-white px-3 py-2 shadow-sm"><div id="vendorCount" class="font-black text-slate-950">0 家</div><div class="text-xs text-slate-500">店家</div></div>
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
          <button class="vendor-view-button" type="button" data-view="compact" aria-pressed="\${state.view === 'compact'}" aria-label="精簡檢視" title="精簡檢視">精簡</button>
          <button class="vendor-view-button" type="button" data-view="gallery" aria-pressed="\${state.view === 'gallery'}" aria-label="圖庫檢視" title="圖庫檢視">大圖</button>
        </div>
      </section>
      <section id="vendorGrid" class="mt-5"></section>
      <p id="vendorEmpty" class="mt-5 rounded-xl bg-white p-5 text-center font-bold text-slate-500" hidden>沒有符合的廠商</p>
      <section class="mt-5 flex flex-col gap-3 rounded-2xl bg-white/80 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="font-black text-slate-950">想讓店家出現在這裡？</h2>
          <p class="mt-1 text-sm leading-6 text-slate-600">提供店名、地址、電話與官方連結，我們會協助整理成店家卡片。</p>
        </div>
        <a class="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-950 px-4 font-black text-white" href="\${LINE_URL}" target="_blank" rel="noopener noreferrer">新增我的店</a>
      </section>\`;
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
      if (!category) throw new Error(\`找不到廠商分類：\${page}\`);
      render(category);
    })
    .catch((error) => {
      app.innerHTML = \`<section class="panel rounded-2xl p-6"><h1 class="text-2xl font-black">廠商資料載入失敗</h1><p class="mt-2 text-slate-600">\${escapeHtml(error.message)}</p></section>\`;
    });
})();
`;

const servicePageConfig = (fn, category) => {
  const enhancement = servicePageEnhancements[fn.id];
  const dataStatus = serviceDataStatus(enhancement);
  return {
    id: fn.id,
    page: fn.page,
    title: fn.title,
    description: fn.description,
    tags: fn.tags || [],
    categoryId: category.id,
    categoryTitle: category.title,
    categoryUrl: `pages/${category.id}/index.html`,
    updatesUrl: `pages/${category.id}/updates.html`,
    archivePath: fn.archivePath || null,
    status: '正式功能頁',
    ...enhancement,
    dataStatus
  };
};

const servicePageJs = `(() => {
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

  const renderCard = (item) => \`<article class="service-card rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4" data-search="\${escapeHtml([item.title, item.meta, item.desc, ...(item.tags || [])].join(' ').toLowerCase())}">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h2 class="compact-title text-base font-black leading-snug text-slate-950 sm:text-lg">\${escapeHtml(item.title)}</h2>
        <p class="mt-1 text-sm font-bold" style="color:\${config.accent}">\${escapeHtml(item.meta)}</p>
      </div>
      <span class="h-3 w-3 shrink-0 rounded-full" style="background:\${config.accent}"></span>
    </div>
    <p class="compact-desc compact-desc--3 mt-2 text-sm leading-5 text-slate-600">\${escapeHtml(item.desc)}</p>
    <div class="service-card-tags mt-2 flex flex-wrap gap-1">
      \${(item.tags || []).map((tag) => \`<span class="rounded-full px-2 py-1 text-xs font-black" style="background:\${config.accent}14;color:\${config.accent}">\${escapeHtml(tag)}</span>\`).join('')}
    </div>
    \${item.href ? \`<a class="mt-3 inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-950 px-3 text-sm font-black text-white hover:bg-indigo-700" href="\${escapeHtml(item.href)}"\${String(item.href).startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''}>開啟相關功能</a>\` : ''}
  </article>\`;

  const renderChecklist = () => {
    const checks = readChecks();
    const items = config.checklist || [];
    const completed = items.filter((_, index) => checks[index]).length;
    const percent = items.length ? Math.round((completed / items.length) * 100) : 0;
    return \`<section class="mt-4 rounded-xl bg-white p-4 shadow-sm">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-lg font-black text-slate-950 sm:text-xl">處理清單</h2>
          <p class="mt-1 text-sm text-slate-600">目前進度 \${completed}/\${items.length}</p>
        </div>
        <div class="h-3 w-full overflow-hidden rounded-full bg-slate-100 sm:w-52">
          <div id="checkProgressBar" class="h-full rounded-full" style="width:\${percent}%;background:\${config.accent}"></div>
        </div>
      </div>
      <div class="mt-3 grid gap-2">
        \${items.map((item, index) => \`<label class="flex min-h-11 items-center gap-3 rounded-xl bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700">
          <input class="service-check h-5 w-5 rounded border-slate-300" type="checkbox" data-check-index="\${index}" \${checks[index] ? 'checked' : ''}>
          <span>\${escapeHtml(item)}</span>
        </label>\`).join('')}
      </div>
    </section>\`;
  };

  const renderCalculator = () => {
    if (!config.calculator) return '';
    const calculator = config.calculator;
    return \`<section class="mt-4 rounded-xl bg-slate-950 p-4 text-white shadow-sm sm:p-5">
      <div class="grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
        <div>
          <div class="text-sm font-black text-indigo-200">\${escapeHtml(calculator.label)}</div>
          <h2 class="mt-1 text-xl font-black sm:text-2xl">預算快速估算</h2>
          <div class="mt-3 grid gap-3 sm:grid-cols-2">
            <label class="block">
              <span class="text-sm font-bold text-slate-300">數量 / \${escapeHtml(calculator.unit)}</span>
              <input id="calcQuantity" class="mt-1 min-h-11 w-full rounded-xl border border-white/20 bg-white px-4 font-black text-slate-950 outline-none" type="number" min="1" value="\${calculator.defaultQuantity}">
            </label>
            <div class="rounded-xl bg-white/10 p-3">
              <div class="text-sm font-bold text-slate-300">估算結果</div>
              <div id="calcTotal" class="mt-1 text-2xl font-black">NT$0</div>
            </div>
          </div>
          <div class="mt-3 grid gap-2 sm:grid-cols-2">
            \${calculator.options.map((option, index) => \`<label class="flex min-h-11 items-center gap-3 rounded-xl bg-white/10 px-3 py-2 text-sm font-bold">
              <input class="calc-option h-5 w-5" type="checkbox" data-calc-index="\${index}" checked>
              <span class="min-w-0 flex-1">\${escapeHtml(option.label)}</span>
              <span class="text-slate-300">\${formatMoney(option.price)}\${option.mode === 'perUnit' ? '/' + escapeHtml(calculator.unit) : ''}</span>
            </label>\`).join('')}
          </div>
        </div>
        <div class="rounded-xl bg-white/10 p-4 text-sm leading-6 text-slate-200">
          實際報價會因材料、樓層、動線、施工時段與現場條件調整。這裡先做內容頁的基本估算比例。
        </div>
      </div>
    </section>\`;
  };

  const updateChecklist = () => {
    const checks = Array.from(app.querySelectorAll('.service-check')).map((input) => input.checked);
    saveChecks(checks);
    const items = config.checklist || [];
    const completed = checks.filter(Boolean).length;
    const percent = items.length ? Math.round((completed / items.length) * 100) : 0;
    const text = app.querySelector('#checkProgressText');
    const bar = app.querySelector('#checkProgressBar');
    if (text) text.textContent = \`\${completed}/\${items.length}\`;
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

    app.innerHTML = \`
      <nav class="mb-5 flex flex-wrap gap-2 text-sm">
        <a class="nav-link bg-white text-indigo-700 shadow-sm" href="index.html">首頁</a>
        <a class="nav-link bg-white text-indigo-700 shadow-sm" href="pages/index.html">功能分類</a>
        <a class="nav-link bg-slate-900 text-white shadow-sm" href="\${escapeHtml(config.categoryUrl)}">\${escapeHtml(config.categoryTitle)}</a>
      </nav>
      <header class="entry-hero panel rounded-2xl p-6 sm:p-8">
        <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
          <div>
            <div class="text-sm font-black" style="color:\${config.accent}">\${escapeHtml(config.categoryTitle)}</div>
            <h1 class="entry-hero-title mt-2 text-3xl font-black tracking-tight sm:text-4xl">\${escapeHtml(config.title)}</h1>
            <p class="entry-hero-text mt-3 max-w-3xl text-slate-600">\${escapeHtml(config.summary || config.description)}</p>
          </div>
          <div class="grid grid-cols-3 gap-2 text-center text-sm">
            \${(config.highlights || []).slice(0, 3).map((item) => \`<div class="rounded-xl bg-white px-2 py-2 shadow-sm"><div class="font-black leading-tight text-slate-950">\${escapeHtml(item)}</div><div class="text-xs text-slate-500">重點</div></div>\`).join('')}
          </div>
        </div>
      </header>
      \${renderCalculator()}
      <section class="search-shell mt-4 rounded-2xl bg-white/80 p-3 shadow-sm">
        <input id="serviceSearch" class="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 font-bold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" type="search" placeholder="搜尋此頁項目">
      </section>
      <section id="serviceGrid" class="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        \${(config.items || []).map(renderCard).join('')}
      </section>
      <p id="serviceEmpty" class="mt-4 rounded-xl bg-white p-4 text-center font-bold text-slate-500" hidden>沒有符合的項目</p>
      \`;

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
`;

const siteSearchJs = `(() => {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('results');
  const summary = document.getElementById('resultSummary');
  const form = document.getElementById('searchForm');
  const categoryFilter = document.getElementById('categoryFilter');
  const services = Array.isArray(window.YANGMEI_SEARCH_SERVICES) ? window.YANGMEI_SEARCH_SERVICES : [];

  const normalize = (value) => String(value || '').trim().toLowerCase();
  const renderCategories = () => {
    const categories = [...new Map(services.map((item) => [item.category, item.categoryTitle])).entries()];
    categoryFilter.innerHTML = '<option value="">全部分類</option>' + categories.map(([id, title]) => \`<option value="\${id}">\${title}</option>\`).join('');
  };

  const render = () => {
    const query = normalize(input.value);
    const category = categoryFilter.value;
    const matched = services.filter((item) => {
      const haystack = [item.title, item.desc, item.categoryTitle, item.status, ...(item.tags || [])].join(' ').toLowerCase();
      return (!query || haystack.includes(query)) && (!category || item.category === category);
    });

    summary.textContent = query || category
      ? \`找到 \${matched.length} 筆結果\`
      : \`目前收錄 \${services.length} 個功能，可直接搜尋或依分類篩選。\`;

    results.innerHTML = matched.map((item) => {
      const isExternal = item.url.startsWith('http');
      const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      const secondaryUrl = item.secondaryTargetUrl || '';
      const hasSecondary = Boolean(secondaryUrl);
      const secondaryTarget = secondaryUrl.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
      const secondaryLabel = item.secondaryTargetType === 'external-link' ? '前往服務' : '查看內容';
      const primaryLabel = isExternal ? '前往服務' : '查看內容';
      return \`<article class="result-card rounded-xl p-3 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg sm:p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="text-xs font-black text-indigo-700">\${item.categoryTitle}</div>
            <div class="compact-title mt-1 text-base font-black leading-snug text-gray-900 sm:text-lg">\${item.title}</div>
          </div>
          <span class="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs font-black text-slate-600">\${item.status}</span>
        </div>
        <div class="compact-desc compact-desc--2 mt-2 text-sm leading-5 text-gray-600">\${item.desc}</div>
        <div class="mt-2 flex flex-wrap gap-1">
          \${(item.tags || []).map((tag) => \`<span class="rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700">\${tag}</span>\`).join('')}
        </div>
        <div class="mt-3 flex flex-wrap gap-2">
          <a class="inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-sm font-black" style="background:#0f172a;color:#fff" href="\${item.url}"\${target}>\${primaryLabel}</a>
          \${hasSecondary ? \`<a class="inline-flex min-h-11 items-center justify-center rounded-lg border px-3 text-sm font-black" style="border-color:#cbd5e1;background:#fff;color:#334155" href="\${secondaryUrl}"\${secondaryTarget}>\${secondaryLabel}</a>\` : ''}
        </div>
      </article>\`;
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
`;

const searchHtml = () => `${pageHead({
  title: '搜尋',
  description: '搜尋楊梅人在地生活集的生活服務、房產工具與在地資訊。',
  cssHref: 'assets/css/tailwind.min.css'
})}
<body>
<main class="mx-auto max-w-6xl px-4 py-8 sm:py-10">
  <header class="entry-hero panel mb-5 rounded-2xl p-6 sm:p-8">
    <nav class="mb-5 flex flex-wrap gap-2 text-sm">
      <a class="nav-link bg-white text-indigo-700 shadow-sm" href="index.html">首頁</a>
      <a class="nav-link bg-slate-900 text-white shadow-sm" href="pages/index.html">功能分類</a>
    </nav>
    <div class="search-hero-grid">
      <div>
        <h1 class="entry-hero-title text-3xl font-black tracking-tight sm:text-4xl">搜尋服務</h1>
        <p class="entry-hero-text mt-3 max-w-3xl text-slate-600">輸入關鍵字，快速找到生活服務、店家資訊與常用工具。</p>
      </div>
      <form id="searchForm" class="search-form">
        <input id="searchInput" type="search" class="min-h-11 min-w-0 rounded-xl border border-gray-300 bg-white px-4 text-base font-bold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" placeholder="搜尋功能、服務或工具">
        <select id="categoryFilter" class="min-h-11 rounded-xl border border-gray-300 bg-white px-3 font-bold outline-none focus:border-indigo-500" aria-label="依分類篩選"></select>
        <button class="min-h-11 rounded-xl bg-indigo-600 px-5 font-black text-white hover:bg-indigo-700" type="submit">搜尋</button>
      </form>
    </div>
  </header>
  <section>
    <p id="resultSummary" class="mb-4 text-sm font-bold text-gray-600"></p>
    <div id="results" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"></div>
  </section>
</main>
<script src="assets/js/site-search-data.js"></script>
<script src="assets/js/site-search.js"></script>
</body>
</html>
`;

const searchRedirectHtml = () => `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="robots" content="noindex,nofollow">
<meta http-equiv="refresh" content="0; url=pages/index.html">
<title>前往功能分類 - 楊梅人在地生活集</title>
<link rel="stylesheet" href="assets/css/tailwind.min.css">
<style>
body{min-height:100vh;display:grid;place-items:center;background:#f8fafc;color:#0f172a}
.panel{max-width:420px;margin:24px;padding:24px;border:1px solid #e2e8f0;border-radius:16px;background:#fff;box-shadow:0 16px 40px rgba(15,23,42,.08);text-align:center}
a{display:inline-flex;min-height:44px;align-items:center;justify-content:center;margin-top:16px;border-radius:12px;background:#0f172a;padding:0 18px;color:#fff;font-weight:900;text-decoration:none}
</style>
<script>window.location.replace('pages/index.html');</script>
</head>
<body>
  <main class="panel">
    <h1>前往功能分類</h1>
    <p>這個入口已整理到功能分類頁。</p>
    <a href="pages/index.html">查看功能分類</a>
  </main>
</body>
</html>
`;

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#2563eb"/><stop offset="55%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#f97316"/></linearGradient></defs>
  <rect width="64" height="64" rx="14" fill="url(#g)"/>
  <text x="32" y="43" font-family="Arial, sans-serif" font-size="30" font-weight="900" fill="white" text-anchor="middle">楊</text>
</svg>
`;

const run = async () => {
  await assertValidVendorData({ root });

  const siteCategories = await readJson('data/site-categories.json');
  const siteFunctions = await readJson('data/site-functions.json');
  const vendorData = await readJson('data/vendors/vendor-categories.json');
  const entertainmentData = {
    generatedAt,
    sourceFolder: 'data/entertainment/',
    games: await readJson('data/entertainment/games.json'),
    fortune: await readJson('data/entertainment/fortune.json'),
    mbti: await readJson('data/entertainment/mbti.json'),
    dailyQuote: await readJson('data/entertainment/daily-quotes.json')
  };

  const categories = siteCategories.categories;
  const functions = siteFunctions.functions;
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const functionsByCategory = new Map(categories.map((category) => [category.id, []]));
  functions.forEach((fn) => {
    if (!functionsByCategory.has(fn.category)) functionsByCategory.set(fn.category, []);
    functionsByCategory.get(fn.category).push(fn);
  });
  const publicCategories = categories.filter(isPublicCategory);
  const publicFunctions = functions.filter((fn) => isPublicCategory(fn.category));
  const publicFunctionsByCategory = new Map(publicCategories.map((category) => [category.id, []]));
  publicFunctions.forEach((fn) => {
    if (!publicFunctionsByCategory.has(fn.category)) publicFunctionsByCategory.set(fn.category, []);
    publicFunctionsByCategory.get(fn.category).push(fn);
  });

  const vendorPageSet = new Set(vendorData.categories.map((category) => category.page));
  const localPageMap = new Map();
  for (const fn of functions) {
    if (fn.page) localPageMap.set(fn.page, await exists(fn.page));
  }

  const vendorCategoryByPage = new Map(vendorData.categories.map((category) => [category.page, category]));
  for (const vendorCategory of vendorData.categories) {
    const slug = slugFromPage(vendorCategory.page);
    const fn = functions.find((item) => item.page === vendorCategory.page);
    const siteCategory = fn ? categoryById.get(fn.category) : null;
    vendorCategory.categoryId = siteCategory?.id || 'vendors-admin';
    vendorCategory.categoryTitle = siteCategory?.title || '廠商進駐與後台管理';
    vendorCategory.categoryUrl = `pages/${vendorCategory.categoryId}/index.html`;
    vendorCategory.updatesUrl = `pages/${vendorCategory.categoryId}/updates.html`;
    vendorCategory.dataFolder = `data/vendors/categories/${slug}`;
    vendorCategory.dataStatus = vendorCategoryDataStatus(vendorCategory);

    const { vendors, vendorFile, candidateVendors } = await readCategoryVendorSource(slug, vendorCategory);
    vendorCategory.vendors = vendors;
    vendorCategory.candidateVendors = candidateVendors;
    vendorCategory.vendorCount = vendors.length;
    vendorCategory.intro = vendorFile?.intro || vendorCategory.intro;
    if (vendors.length === 0 && candidateVendors.length > 0) {
      vendorCategory.intro = '此分類正在建置真實店家資料，展示店名已移至待補清單，待官方來源確認後再上架。';
    }
    vendorCategory.displayTitle = consumerVendorTitle(vendorCategory.title);
    vendorCategory.displayIntro = consumerVendorIntro(vendorCategory.intro);
    vendorCategory.dataStatus = vendorCategoryDataStatusFromVendors(vendorCategory, vendors);

    const dir = vendorCategory.dataFolder;
    await writeText(`${dir}/updates.json`, `${JSON.stringify(buildVendorUpdates(vendorCategory, vendors, candidateVendors), null, 2)}\n`);
    await writeText(`${dir}/README.md`, buildVendorCategoryReadme(vendorCategory, vendors, candidateVendors));
  }

  const serviceConfigs = functions
    .filter((fn) => servicePageSet.has(fn.id))
    .map((fn) => servicePageConfig(fn, categoryById.get(fn.category)))
    .filter(Boolean);

  await writeText('assets/favicon.svg', faviconSvg);
  await writeText('assets/js/vendor-page.js', vendorPageJs);
  await writeText('assets/js/service-page.js', servicePageJs);
  await writeText('assets/js/site-search.js', siteSearchJs);
  await writeText('assets/js/entertainment-data.js', `window.YANGMEI_ENTERTAINMENT_DATA = ${JSON.stringify(entertainmentData, null, 2)};\n`);
  await writeText('data/entertainment/manifest.json', `${JSON.stringify({
    generatedAt,
    runtimeFile: 'assets/js/entertainment-data.js',
    sourceFolder: 'data/entertainment/',
    files: [
      'data/entertainment/games.json',
      'data/entertainment/fortune.json',
      'data/entertainment/mbti.json',
      'data/entertainment/daily-quotes.json'
    ],
    pages: ['games.html', 'fortune.html', 'mbti.html', 'daily-quote.html']
  }, null, 2)}\n`);

  const enrichedVendorData = {
    generatedAt,
    categories: vendorData.categories.map((category) => {
      const { vendors, candidateVendors, ...metadata } = category;
      return {
        ...metadata,
        vendorCount: category.vendorCount ?? vendors.length,
        vendors: category.vendors
      };
    })
  };
  await writeText('data/vendors/vendor-categories.json', `${JSON.stringify(enrichedVendorData, null, 2)}\n`);
  await writeText('assets/js/vendor-data.js', `window.YANGMEI_VENDOR_CATEGORIES = ${JSON.stringify(enrichedVendorData.categories, null, 2)};\n`);
  await writeText('data/vendors/README.md', vendorsReadme(enrichedVendorData.categories));
  await writeText('data/vendors/vendor-summary.json', `${JSON.stringify({
    source: 'data/vendors/categories/*/vendors.json',
    generatedAt,
    categoryCount: enrichedVendorData.categories.length,
    vendorCount: enrichedVendorData.categories.reduce((sum, item) => sum + item.vendors.length, 0),
    candidateVendorCount: vendorData.categories.reduce((sum, item) => sum + (item.candidateVendors?.length || 0), 0),
    verification: enrichedVendorData.categories.reduce((summary, category) => {
      const counts = vendorVerificationCounts(category.vendors);
      summary.total += counts.total;
      summary.verified += counts.verified;
      summary.needsVerification += counts.needsVerification;
      summary.missingPhone += counts.missingPhone;
      summary.missingAddress += counts.missingAddress;
      summary.missingOfficialSource += counts.missingOfficialSource;
      return summary;
    }, {
      total: 0,
      verified: 0,
      needsVerification: 0,
      missingPhone: 0,
      missingAddress: 0,
      missingOfficialSource: 0
    }),
    categories: enrichedVendorData.categories.map((category) => ({
      page: category.page,
      title: category.title,
      vendorCount: category.vendors.length,
      ...vendorVerificationCounts(category.vendors)
    }))
  }, null, 2)}\n`);
  await writeText('data/service-pages.json', `${JSON.stringify({
    generatedAt,
    pages: serviceConfigs
  }, null, 2)}\n`);
  await writeText('assets/js/service-page-data.js', `window.YANGMEI_SERVICE_PAGES = ${JSON.stringify(serviceConfigs, null, 2)};\n`);

  const navigation = {
    generatedAt,
    totals: {
      categories: categories.length,
      functions: functions.length,
      servicePages: serviceConfigs.length,
      vendorCategories: enrichedVendorData.categories.length,
      vendorRecords: enrichedVendorData.categories.reduce((sum, item) => sum + item.vendors.length, 0)
    },
    entrypoints: {
      home: 'index.html',
      search: 'search.html',
      categories: 'pages/index.html',
      vendorData: 'data/vendors/categories/'
    },
    categories: categories.map((category) => {
      const fns = functionsByCategory.get(category.id) || [];
      return {
        id: category.id,
        title: category.title,
        icon: category.icon,
        folder: `pages/${category.id}/`,
        index: `pages/${category.id}/index.html`,
        updatesPage: `pages/${category.id}/updates.html`,
        updatesData: `pages/${category.id}/updates.json`,
        functionCount: fns.length,
        localPageCount: fns.filter((fn) => localPageMap.get(fn.page)).length,
        externalCount: fns.filter((fn) => fn.external).length,
        vendorPageCount: fns.filter((fn) => vendorPageSet.has(fn.page)).length,
        servicePageCount: fns.filter((fn) => servicePageSet.has(fn.id)).length
      };
    })
  };
  await writeText('data/site-navigation.json', `${JSON.stringify(navigation, null, 2)}\n`);

  const searchServices = publicFunctions.map((fn) => {
    const category = categoryById.get(fn.category);
    const localPageExists = localPageMap.get(fn.page) || false;
    const status = statusText(fn, localPageExists, vendorPageSet);
    const url = buildLocalHref(fn, true, localPageExists);
    return {
      id: fn.id,
      title: fn.title,
      desc: consumerVendorIntro(fn.description),
      url,
      tags: (fn.tags || []).map((tag) => String(tag).replace(/廠商/g, '店家')),
      category: fn.category,
      categoryTitle: consumerVendorTitle(category?.title || fn.category),
      status,
      ...routingStatusFields(fn, localPageExists),
      external: String(url).startsWith('http')
    };
  });
  await writeText('assets/js/site-search-data.js', `window.YANGMEI_SEARCH_SERVICES = ${JSON.stringify(searchServices, null, 2)};\n`);
  await writeText('search.html', searchRedirectHtml());

  await writeText('pages/index.html', categoryOverviewPage({ categories: publicCategories, functionsByCategory: publicFunctionsByCategory, localPageMap, vendorPageSet }));

  for (const category of categories) {
    const fns = functionsByCategory.get(category.id) || [];
    await writeText(`pages/${category.id}/index.html`, categoryPage({ category, functions: fns, localPageMap, vendorPageSet }));
    await writeText(`pages/${category.id}/updates.json`, `${JSON.stringify(updatesJson({ category, functions: fns, localPageMap, vendorPageSet }), null, 2)}\n`);
    await writeText(`pages/${category.id}/updates.html`, updatesPage({ category, functions: fns, localPageMap, vendorPageSet }));
    await writeText(`pages/${category.id}/README.md`, `# ${category.title}

${category.description}

- 入口頁：\`index.html\`
- 資訊更新頁：\`updates.html\`
- 資訊更新資料：\`updates.json\`
- 維護角色：${category.updateOwner}
- 生成時間：${generatedAt}
`);
  }

  for (const fn of functions) {
    if (!fn.page || fn.page === 'index.html' || fn.page === 'search.html') continue;
    const category = categoryById.get(fn.category);
    if (!category) continue;
    if (servicePageSet.has(fn.id)) {
      await writeText(fn.page, serviceFunctionPage({ fn, category }));
    } else if (vendorPageSet.has(fn.page)) {
      const vendorCategory = vendorCategoryByPage.get(fn.page);
      await writeText(fn.page, `${pageHead({
        title: vendorCategory.displayTitle || consumerVendorTitle(vendorCategory.title),
        description: vendorCategory.displayIntro || consumerVendorIntro(vendorCategory.intro),
        cssHref: 'assets/css/tailwind.min.css'
      })}
<body>
<main id="vendorPageApp" class="mx-auto max-w-6xl px-4 py-8 sm:py-10" data-vendor-page="${escapeHtml(fn.page)}">
  <section class="panel rounded-2xl p-6">
    <div class="text-sm font-black text-indigo-600">店家資料載入中</div>
    <h1 class="mt-2 text-2xl font-black">${escapeHtml(vendorCategory.displayTitle || consumerVendorTitle(vendorCategory.title))}</h1>
  </section>
</main>
<script src="assets/js/vendor-data.js"></script>
<script src="assets/js/vendor-page.js"></script>
</body>
</html>
`);
    } else {
      await writeText(fn.page, rootBridgePage({ fn, category, localPageExists: true, vendorPageSet }));
    }
  }

  await writeText('reports/main-structure.md', `# 主架構整理報告

生成時間：${generatedAt}

## 已完成

- 建立中央導覽資料：\`data/site-navigation.json\`
- 重建功能分類總覽：\`pages/index.html\`
- 重建 11 個主分類入口與 \`updates.html / updates.json\`
- 將 11 個廠商分類拆成子資料夾：\`data/vendors/categories/*\`
- 將 11 個廠商頁改成正式資料驅動頁：\`beauty-skin.html\` 等
- 將 \`daily-info\`、\`home-services\`、\`personal-tools\` 與 \`community-content\` 共 ${serviceConfigs.length} 個頁面升級成正式功能頁
- 新增正式功能頁源資料：\`data/service-page-source.mjs\`
- 新增正式功能頁資料：\`data/service-pages.json\`
- 新增正式功能頁前端資料：\`assets/js/service-page-data.js\`
- 新增正式功能頁渲染器：\`assets/js/service-page.js\`
- 新增娛樂互動資料來源：\`data/entertainment/*.json\`
- 新增娛樂互動前端資料：\`assets/js/entertainment-data.js\`
- 將 \`search.html\` 改為使用 \`assets/js/site-search-data.js\`，來源為 \`data/site-functions.json\`
- 新增共用圖示：\`assets/favicon.svg\`

## 數量

- 主分類：${categories.length}
- 功能：${functions.length}
- 正式功能頁：${serviceConfigs.length}
- 廠商分類：${enrichedVendorData.categories.length}
- 廠商資料：${enrichedVendorData.categories.reduce((sum, item) => sum + item.vendors.length, 0)}

## 下一步

1. 逐頁檢查 32 個正式功能頁的真實資料來源，把示範資訊換成可發布內容。
2. 正式功能頁內容先維護 \`data/service-page-source.mjs\`，再跑 \`node scripts/build-main-structure.mjs\` 同步。
3. 廠商資料先維護 \`data/vendors/categories/<分類>/vendors.json\`，再跑 \`node scripts/build-main-structure.mjs\` 同步。
4. 下一批可升級 \`site-core\`、\`real-estate\`、\`leisure\`、\`vendors-admin\` 與 \`health-care\` 的剩餘橋接頁。
`);

  console.log(JSON.stringify({
    generatedAt,
    categories: categories.length,
    functions: functions.length,
    vendorCategories: enrichedVendorData.categories.length,
    vendorRecords: enrichedVendorData.categories.reduce((sum, item) => sum + item.vendors.length, 0)
  }, null, 2));
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
