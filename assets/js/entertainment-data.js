window.YANGMEI_ENTERTAINMENT_DATA = {
  "generatedAt": "2026-07-03T09:23:39+0800",
  "sourceFolder": "data/entertainment/",
  "games": {
    "updatedAt": "2026-07-03T03:02:18+08:00",
    "sourceNote": "遊戲大廳第二階段重做版。以楊梅生活場景包裝四個完整度較高的小遊戲，並逐步加深核心玩法、視覺資產、操作回饋節奏與分數難度平衡。",
    "storageKey": "yangmei_games_v3",
    "tabs": {
      "route": "路線記憶",
      "market": "市集快手",
      "merge": "梅花合成",
      "quiz": "生活快問"
    },
    "dailyChallenge": {
      "label": "每日挑戰",
      "bonus": 120,
      "resetText": "每日 00:00 依日期自動更換指定遊戲。",
      "rotation": [
        "route",
        "market",
        "quiz",
        "merge"
      ]
    },
    "marketConfig": {
      "modeLabel": "45 秒限時",
      "rounds": 8,
      "timeLimitSeconds": 45,
      "correctBase": 70,
      "streakBonus": 12,
      "fastBonusThresholdMs": 3000,
      "fastBonus": 18,
      "wrongPenalty": 45
    },
    "quizConfig": {
      "modeLabel": "題庫模式",
      "questionsPerSet": 4,
      "correctScore": 110,
      "perfectBonus": 120,
      "passAccuracy": 75
    },
    "mergeConfig": {
      "modeLabel": "任務模式",
      "boardSize": 4,
      "spawnFourRate": 0.15,
      "completionBonus": 150,
      "remainingMoveBonus": 10
    },
    "motionConfig": {
      "modeLabel": "動效節奏",
      "summary": "所有遊戲內微互動使用 150-300ms 的 transform / opacity 動效，並尊重 prefers-reduced-motion。",
      "durationMs": {
        "screen": 220,
        "feedback": 240,
        "tile": 180,
        "shake": 220
      },
      "rules": [
        "只使用 transform 與 opacity，不用 width、height、top、left 做動畫。",
        "每次互動只強調關鍵元素，避免整頁同時晃動。",
        "reduced-motion 啟用時停用動畫與 transition，但保留顏色、文字與狀態提示。"
      ]
    },
    "balanceConfig": {
      "modeLabel": "平衡版本 2026-07-03",
      "summary": "降低市集快手單局爆分，讓路線、快問與合成在不同投入時間下都有接近的成長價值。",
      "targetScoreBands": {
        "route": "315-1083",
        "market": "560-1136",
        "merge": "400-1400+",
        "quiz": "330-560"
      },
      "rules": [
        "每日挑戰 bonus 不應高於入門局核心分數的一半。",
        "限時市集仍可高分，但全對快答不應超過最高路線關卡太多。",
        "合成任務用步數限制控制難度，入門任務要可在手機上穩定完成。",
        "生活快問全對要比普通通過更有感，但不取代長玩法分數。"
      ]
    },
    "mergeMissions": [
      {
        "id": "flower-bundle",
        "label": "花束暖身",
        "difficulty": "入門",
        "description": "先合出花束，熟悉任務模式與步數限制。",
        "targetTile": 16,
        "moveLimit": 16,
        "reward": 140
      },
      {
        "id": "market-stall",
        "label": "市集攤位",
        "difficulty": "熟悉",
        "description": "把花車推進市集，練習保留空格與合併路線。",
        "targetTile": 64,
        "moveLimit": 34,
        "reward": 260
      },
      {
        "id": "life-circle",
        "label": "生活圈串接",
        "difficulty": "進階",
        "description": "合出生活圈，讓遊戲目標貼近區域功能整理。",
        "targetTile": 256,
        "moveLimit": 58,
        "reward": 470
      },
      {
        "id": "yangmei-brand",
        "label": "大楊梅品牌",
        "difficulty": "挑戰",
        "description": "挑戰高階方塊，追求最高方塊與最佳步數。",
        "targetTile": 512,
        "moveLimit": 78,
        "reward": 740
      }
    ],
    "badgeConfig": {
      "modeLabel": "成就徽章",
      "summary": "完成四個核心遊戲會逐步解鎖徽章，方便使用者知道還有哪些玩法可以挑戰。",
      "emptyText": "先完成任一局遊戲，就會開始累積成就進度。"
    },
    "visualConfig": {
      "route": {
        "modeLabel": "路線節點",
        "locations": {
          "station": {
            "icon": "rail",
            "color": "#7c3aed"
          },
          "market": {
            "icon": "store",
            "color": "#ea580c"
          },
          "park": {
            "icon": "tree",
            "color": "#16a34a"
          },
          "school": {
            "icon": "book",
            "color": "#2563eb"
          },
          "clinic": {
            "icon": "cross",
            "color": "#dc2626"
          },
          "vendor": {
            "icon": "shop",
            "color": "#9333ea"
          },
          "library": {
            "icon": "book-open",
            "color": "#4f46e5"
          },
          "sports": {
            "icon": "flag",
            "color": "#0891b2"
          },
          "district": {
            "icon": "building",
            "color": "#475569"
          },
          "family": {
            "icon": "home",
            "color": "#db2777"
          }
        }
      },
      "market": {
        "modeLabel": "市集物件",
        "items": {
          "飯糰": {
            "icon": "rice",
            "color": "#ea580c"
          },
          "大型盆栽": {
            "icon": "tree",
            "color": "#16a34a"
          },
          "冬季外套": {
            "icon": "shirt",
            "color": "#2563eb"
          },
          "洗衣籃": {
            "icon": "basket",
            "color": "#64748b"
          },
          "清潔手套": {
            "icon": "glove",
            "color": "#0891b2"
          },
          "電影票": {
            "icon": "ticket",
            "color": "#db2777"
          },
          "桌遊卡": {
            "icon": "cards",
            "color": "#7c3aed"
          },
          "登山杖": {
            "icon": "pole",
            "color": "#475569"
          },
          "色鉛筆": {
            "icon": "pencil",
            "color": "#ca8a04"
          },
          "扳手": {
            "icon": "wrench",
            "color": "#475569"
          },
          "停車證": {
            "icon": "ticket",
            "color": "#2563eb"
          },
          "收據夾": {
            "icon": "receipt",
            "color": "#64748b"
          },
          "營業時間": {
            "icon": "clock",
            "color": "#16a34a"
          },
          "星座運勢": {
            "icon": "star",
            "color": "#9333ea"
          },
          "今日金句": {
            "icon": "quote",
            "color": "#db2777"
          },
          "桌布顏色": {
            "icon": "palette",
            "color": "#0891b2"
          },
          "預算範圍": {
            "icon": "wallet",
            "color": "#7c3aed"
          },
          "晚餐菜單": {
            "icon": "menu",
            "color": "#ea580c"
          },
          "遊戲分數": {
            "icon": "target",
            "color": "#16a34a"
          },
          "生日賀卡": {
            "icon": "card",
            "color": "#db2777"
          },
          "院所電話": {
            "icon": "phone",
            "color": "#dc2626"
          },
          "遊戲規則": {
            "icon": "book-open",
            "color": "#2563eb"
          },
          "背景音樂": {
            "icon": "music",
            "color": "#9333ea"
          },
          "抽獎口號": {
            "icon": "megaphone",
            "color": "#ca8a04"
          },
          "日期時間": {
            "icon": "calendar",
            "color": "#0891b2"
          },
          "字體粗細": {
            "icon": "type",
            "color": "#475569"
          },
          "遊戲音效": {
            "icon": "sound",
            "color": "#9333ea"
          },
          "頁尾高度": {
            "icon": "ruler",
            "color": "#64748b"
          },
          "核實狀態": {
            "icon": "check",
            "color": "#16a34a"
          },
          "隨機貼紙": {
            "icon": "spark",
            "color": "#ca8a04"
          },
          "卡片陰影": {
            "icon": "layers",
            "color": "#64748b"
          },
          "背景圖案": {
            "icon": "pattern",
            "color": "#7c3aed"
          },
          "資料來源": {
            "icon": "database",
            "color": "#2563eb"
          },
          "按鈕圓角": {
            "icon": "rounded",
            "color": "#475569"
          },
          "動畫速度": {
            "icon": "bolt",
            "color": "#ea580c"
          },
          "遊戲關卡": {
            "icon": "flag",
            "color": "#0891b2"
          },
          "水平溢出": {
            "icon": "screen",
            "color": "#dc2626"
          },
          "檔案順序": {
            "icon": "list",
            "color": "#64748b"
          },
          "註解多寡": {
            "icon": "quote",
            "color": "#475569"
          },
          "資料夾顏色": {
            "icon": "folder",
            "color": "#ca8a04"
          }
        }
      },
      "merge": {
        "modeLabel": "合成階段",
        "tiles": {
          "2": {
            "icon": "sprout",
            "color": "#16a34a"
          },
          "4": {
            "icon": "bud",
            "color": "#22c55e"
          },
          "8": {
            "icon": "blossom",
            "color": "#db2777"
          },
          "16": {
            "icon": "bouquet",
            "color": "#ea580c"
          },
          "32": {
            "icon": "truck",
            "color": "#0891b2"
          },
          "64": {
            "icon": "store",
            "color": "#7c3aed"
          },
          "128": {
            "icon": "district",
            "color": "#2563eb"
          },
          "256": {
            "icon": "map",
            "color": "#16a34a"
          },
          "512": {
            "icon": "brand",
            "color": "#9333ea"
          },
          "1024": {
            "icon": "signal",
            "color": "#dc2626"
          },
          "2048": {
            "icon": "trophy",
            "color": "#ca8a04"
          }
        }
      },
      "quiz": {
        "modeLabel": "題庫徽章",
        "sets": {
          "data-governance": {
            "icon": "database",
            "color": "#7c3aed"
          },
          "mobile-ui": {
            "icon": "screen",
            "color": "#2563eb"
          },
          "vendor-verification": {
            "icon": "check",
            "color": "#16a34a"
          },
          "local-life": {
            "icon": "map",
            "color": "#ea580c"
          }
        }
      }
    },
    "achievements": [
      {
        "id": "first-play",
        "label": "生活起步",
        "group": "總覽",
        "description": "完成任一局遊戲。",
        "icon": "spark",
        "color": "#7c3aed",
        "condition": {
          "type": "played",
          "target": 1
        }
      },
      {
        "id": "daily-check",
        "label": "每日出勤",
        "group": "每日",
        "description": "完成今日指定遊戲。",
        "icon": "calendar",
        "color": "#16a34a",
        "condition": {
          "type": "dailyCompleted",
          "target": 1
        }
      },
      {
        "id": "score-500",
        "label": "在地積分",
        "group": "總覽",
        "description": "累積總積分達到 500 分。",
        "icon": "star",
        "color": "#ca8a04",
        "condition": {
          "type": "totalScore",
          "target": 500
        }
      },
      {
        "id": "route-open",
        "label": "路線開拓",
        "group": "路線",
        "description": "完成任一張路線地圖。",
        "icon": "map",
        "color": "#7c3aed",
        "condition": {
          "type": "routeHighestLevel",
          "target": 1
        }
      },
      {
        "id": "route-master",
        "label": "全城熟路",
        "group": "路線",
        "description": "完成全部路線地圖。",
        "icon": "map-pin",
        "color": "#4f46e5",
        "condition": {
          "type": "routeHighestLevel",
          "target": "all"
        }
      },
      {
        "id": "market-sprint",
        "label": "市集快手",
        "group": "市集",
        "description": "市集快手單局達到 800 分。",
        "icon": "bolt",
        "color": "#ea580c",
        "condition": {
          "type": "marketHighScore",
          "target": 800
        }
      },
      {
        "id": "merge-start",
        "label": "花束成形",
        "group": "合成",
        "description": "完成任一個梅花合成任務。",
        "icon": "grid",
        "color": "#16a34a",
        "condition": {
          "type": "mergeCompleted",
          "target": 1
        }
      },
      {
        "id": "merge-brand",
        "label": "品牌合成",
        "group": "合成",
        "description": "梅花合成最高方塊達到 512。",
        "icon": "diamond",
        "color": "#9333ea",
        "condition": {
          "type": "mergeHighestTile",
          "target": 512
        }
      },
      {
        "id": "quiz-pass",
        "label": "快問通過",
        "group": "快問",
        "description": "生活快問最高正確率達到 75%。",
        "icon": "check",
        "color": "#2563eb",
        "condition": {
          "type": "quizBestAccuracy",
          "target": 75
        }
      },
      {
        "id": "quiz-perfect",
        "label": "全對達人",
        "group": "快問",
        "description": "生活快問最高正確率達到 100%。",
        "icon": "target",
        "color": "#db2777",
        "condition": {
          "type": "quizBestAccuracy",
          "target": 100
        }
      }
    ],
    "locations": [
      {
        "id": "station",
        "label": "楊梅車站",
        "short": "車站"
      },
      {
        "id": "market",
        "label": "楊梅市場",
        "short": "市場"
      },
      {
        "id": "park",
        "label": "埔心公園",
        "short": "公園"
      },
      {
        "id": "school",
        "label": "社區學校",
        "short": "學校"
      },
      {
        "id": "clinic",
        "label": "附近診所",
        "short": "診所"
      },
      {
        "id": "vendor",
        "label": "合作店家",
        "short": "店家"
      },
      {
        "id": "library",
        "label": "楊梅圖書館",
        "short": "圖書館"
      },
      {
        "id": "sports",
        "label": "體育園區",
        "short": "體育"
      },
      {
        "id": "district",
        "label": "區公所服務台",
        "short": "區公所"
      },
      {
        "id": "family",
        "label": "親子活動館",
        "short": "親子館"
      }
    ],
    "routeLevels": [
      {
        "id": "station-core",
        "name": "車站商圈線",
        "difficulty": "入門",
        "pool": [
          "station",
          "market",
          "vendor",
          "clinic",
          "park"
        ],
        "routeLength": 3,
        "decoyCount": 2,
        "scoreMultiplier": 1
      },
      {
        "id": "family-loop",
        "name": "親子生活線",
        "difficulty": "熟悉",
        "pool": [
          "park",
          "school",
          "family",
          "library",
          "clinic",
          "market"
        ],
        "routeLength": 4,
        "decoyCount": 3,
        "scoreMultiplier": 1.25
      },
      {
        "id": "service-grid",
        "name": "公共服務線",
        "difficulty": "進階",
        "pool": [
          "district",
          "library",
          "sports",
          "station",
          "school",
          "clinic",
          "vendor"
        ],
        "routeLength": 5,
        "decoyCount": 3,
        "scoreMultiplier": 1.55
      },
      {
        "id": "full-city",
        "name": "大楊梅生活圈",
        "difficulty": "挑戰",
        "pool": [
          "station",
          "market",
          "park",
          "school",
          "clinic",
          "vendor",
          "library",
          "sports",
          "district",
          "family"
        ],
        "routeLength": 6,
        "decoyCount": 4,
        "scoreMultiplier": 1.9
      }
    ],
    "marketMissions": [
      {
        "prompt": "早餐攤缺一個高翻桌率主品項",
        "answer": "飯糰",
        "options": [
          "飯糰",
          "大型盆栽",
          "冬季外套",
          "洗衣籃"
        ]
      },
      {
        "prompt": "家庭清潔服務今天最需要補哪一項",
        "answer": "清潔手套",
        "options": [
          "清潔手套",
          "電影票",
          "桌遊卡",
          "登山杖"
        ]
      },
      {
        "prompt": "親子活動攤位要補吸引孩子停留的物件",
        "answer": "色鉛筆",
        "options": [
          "色鉛筆",
          "扳手",
          "停車證",
          "收據夾"
        ]
      },
      {
        "prompt": "外送合作店家要先確認哪個核心資訊",
        "answer": "營業時間",
        "options": [
          "營業時間",
          "星座運勢",
          "今日金句",
          "桌布顏色"
        ]
      },
      {
        "prompt": "房屋看屋前最該先準備哪份資料",
        "answer": "預算範圍",
        "options": [
          "預算範圍",
          "晚餐菜單",
          "遊戲分數",
          "生日賀卡"
        ]
      },
      {
        "prompt": "醫療資訊頁更新前最需要核對",
        "answer": "院所電話",
        "options": [
          "院所電話",
          "遊戲規則",
          "背景音樂",
          "抽獎口號"
        ]
      },
      {
        "prompt": "活動頁上架前，哪個資訊最會影響居民是否出門",
        "answer": "日期時間",
        "options": [
          "日期時間",
          "字體粗細",
          "遊戲音效",
          "頁尾高度"
        ]
      },
      {
        "prompt": "廠商分類頁要提升可信度，優先補哪一項",
        "answer": "核實狀態",
        "options": [
          "核實狀態",
          "隨機貼紙",
          "卡片陰影",
          "背景圖案"
        ]
      },
      {
        "prompt": "生活服務頁要降低誤導風險，應先標示什麼",
        "answer": "資料來源",
        "options": [
          "資料來源",
          "按鈕圓角",
          "動畫速度",
          "遊戲關卡"
        ]
      },
      {
        "prompt": "手機版更新後，最該馬上檢查的 UI 問題",
        "answer": "水平溢出",
        "options": [
          "水平溢出",
          "檔案順序",
          "註解多寡",
          "資料夾顏色"
        ]
      }
    ],
    "mergeTiles": {
      "2": "花芽",
      "4": "花苞",
      "8": "小花",
      "16": "花束",
      "32": "花車",
      "64": "市集",
      "128": "商圈",
      "256": "生活圈",
      "512": "大楊梅",
      "1024": "區域品牌",
      "2048": "生活集"
    },
    "quizQuestions": [
      {
        "question": "廠商資料正式上線前，最重要的欄位狀態是什麼？",
        "answer": "是否已核實",
        "options": [
          "是否已核實",
          "卡片顏色",
          "遊戲分數",
          "隨機排序"
        ]
      },
      {
        "question": "在地功能頁若只是展示資料，應該怎麼標示？",
        "answer": "展示資料 / 待核實",
        "options": [
          "展示資料 / 待核實",
          "永久官方資料",
          "不需要標示",
          "只放外部連結"
        ]
      },
      {
        "question": "更新金句、運勢或題庫，現在應優先修改哪裡？",
        "answer": "data/entertainment",
        "options": [
          "data/entertainment",
          "archive",
          "favicon",
          "README 截圖"
        ]
      },
      {
        "question": "手機版 UI 輪詢最常檢查的版面問題是什麼？",
        "answer": "水平溢出",
        "options": [
          "水平溢出",
          "檔名太短",
          "資料太新",
          "圖片太少"
        ]
      }
    ],
    "quizSets": [
      {
        "id": "data-governance",
        "label": "資料治理",
        "difficulty": "基礎",
        "description": "判斷資料來源、核實狀態與更新入口。",
        "questions": [
          {
            "question": "正式功能頁的資料狀態目前主要寫在哪個欄位群？",
            "answer": "dataStatus",
            "options": [
              "dataStatus",
              "themeColor",
              "randomSeed",
              "iconSize"
            ],
            "explain": "dataStatus 用來標示資料成熟度、核實狀態、來源檔與說明。"
          },
          {
            "question": "娛樂互動資料更新時，應優先修改哪個資料夾？",
            "answer": "data/entertainment",
            "options": [
              "data/entertainment",
              "assets/favicon.svg",
              "archive",
              ".playwright-cli"
            ],
            "explain": "娛樂資料已拆到 data/entertainment，再由產生器輸出 runtime data。"
          },
          {
            "question": "廠商資料若尚未人工核對，頁面應標示什麼？",
            "answer": "待核實",
            "options": [
              "待核實",
              "官方保證",
              "永久有效",
              "免更新"
            ],
            "explain": "待核實能降低誤導風險，也方便後續資料補齊。"
          },
          {
            "question": "重建正式頁資料後，哪個檔案會提供前端頁面資料？",
            "answer": "assets/js/service-page-data.js",
            "options": [
              "assets/js/service-page-data.js",
              "README 截圖",
              "package-lock.json",
              "robots.txt"
            ],
            "explain": "產生器會把 data/service-page-source.mjs 內容輸出到 service-page-data.js。"
          }
        ]
      },
      {
        "id": "mobile-ui",
        "label": "手機 UI",
        "difficulty": "實作",
        "description": "檢查手機固定、觸控尺寸與版面溢出。",
        "questions": [
          {
            "question": "手機版最先要避免哪一種版面問題？",
            "answer": "水平滑動",
            "options": [
              "水平滑動",
              "字太黑",
              "卡片太方",
              "資料太完整"
            ],
            "explain": "手機頁面應固定在 viewport 內，不能讓使用者左右滑。"
          },
          {
            "question": "手機可點擊按鈕的建議最小高度是多少？",
            "answer": "44px",
            "options": [
              "44px",
              "18px",
              "24px",
              "32px"
            ],
            "explain": "44px 是常見行動觸控目標下限，能降低誤觸。"
          },
          {
            "question": "底部固定導覽需要額外顧到什麼區域？",
            "answer": "safe-area",
            "options": [
              "safe-area",
              "檔案排序",
              "音效大小",
              "卡片數量"
            ],
            "explain": "iPhone 手勢區可能遮住底部內容，需要 safe-area padding。"
          },
          {
            "question": "行動版輪詢最直接的自動化檢查是什麼？",
            "answer": "scrollWidth 是否大於 clientWidth",
            "options": [
              "scrollWidth 是否大於 clientWidth",
              "圖片顏色是否鮮豔",
              "檔名是否短",
              "文字是否置中"
            ],
            "explain": "scrollWidth 大於 clientWidth 通常代表頁面有水平溢出。"
          }
        ]
      },
      {
        "id": "vendor-verification",
        "label": "廠商核實",
        "difficulty": "營運",
        "description": "判斷廠商資料可信度與補齊優先順序。",
        "questions": [
          {
            "question": "廠商頁最應優先補齊的可信資訊是什麼？",
            "answer": "電話與地址",
            "options": [
              "電話與地址",
              "卡片陰影",
              "背景漸層",
              "遊戲分數"
            ],
            "explain": "電話與地址直接影響居民能否聯絡與查找服務。"
          },
          {
            "question": "廠商資料分類時，哪一類最適合優先處理？",
            "answer": "缺電話或缺地址",
            "options": [
              "缺電話或缺地址",
              "卡片圓角不同",
              "標籤太少",
              "排名太平均"
            ],
            "explain": "缺聯絡資訊會直接影響可用性，應優先補齊。"
          },
          {
            "question": "廠商資料未取得授權前，照片與評分應如何處理？",
            "answer": "標示展示資料",
            "options": [
              "標示展示資料",
              "寫成官方資料",
              "直接隱藏來源",
              "永久不更新"
            ],
            "explain": "展示資料標示能區分正式核實與示範內容。"
          },
          {
            "question": "廠商頁要降低誤導風險，最重要的是保留什麼？",
            "answer": "來源與核實狀態",
            "options": [
              "來源與核實狀態",
              "動畫速度",
              "按鈕圖示",
              "卡片高度"
            ],
            "explain": "來源與核實狀態能讓使用者知道資料可信程度。"
          }
        ]
      },
      {
        "id": "local-life",
        "label": "在地生活",
        "difficulty": "情境",
        "description": "把楊梅生活資訊轉成可維護的功能頁。",
        "questions": [
          {
            "question": "垃圾車、客運、天氣這類頁面最需要哪種更新方式？",
            "answer": "定期核對來源",
            "options": [
              "定期核對來源",
              "只換背景色",
              "刪除所有提示",
              "固定不變"
            ],
            "explain": "生活資訊會變動，應定期核對官方或可信來源。"
          },
          {
            "question": "活動頁上架前，哪個資訊最影響居民是否參加？",
            "answer": "日期時間與地點",
            "options": [
              "日期時間與地點",
              "字體粗細",
              "檔案大小",
              "頁尾顏色"
            ],
            "explain": "活動資訊最核心的是何時、何地、如何參與。"
          },
          {
            "question": "首頁功能很多時，手機版最應先整理什麼？",
            "answer": "分組與首屏優先順序",
            "options": [
              "分組與首屏優先順序",
              "隨機排序",
              "全部變大",
              "全部藏起來"
            ],
            "explain": "功能多時要讓使用者先看見核心入口，再往下找細項。"
          },
          {
            "question": "區域生活網站要長期維護，最重要的資料習慣是什麼？",
            "answer": "把內容放在可更新資料檔",
            "options": [
              "把內容放在可更新資料檔",
              "每次手改產生檔",
              "只留截圖",
              "不做分類"
            ],
            "explain": "資料檔集中管理，後續更新與驗證才不會分散。"
          }
        ]
      }
    ]
  },
  "fortune": {
    "updatedAt": "2026-07-02T17:42:30+08:00",
    "sourceNote": "娛樂互動內容，僅供生活趣味使用。若改為正式內容需再補來源與授權。",
    "storageKey": "yangmei_fortune_history_v2",
    "defaultZodiac": "水瓶",
    "zodiacs": [
      "牡羊",
      "金牛",
      "雙子",
      "巨蟹",
      "獅子",
      "處女",
      "天秤",
      "天蠍",
      "射手",
      "摩羯",
      "水瓶",
      "雙魚"
    ],
    "fortunes": [
      {
        "level": "穩定前進",
        "note": "今天適合整理待辦和溝通細節，重要事情先從小步驟開始。",
        "action": "先完成一件拖延已久的小事。",
        "avoid": "避免臨時改變所有安排。"
      },
      {
        "level": "機會打開",
        "note": "容易遇到新的資訊或人脈，主動詢問會比等待更有效。",
        "action": "把一個想法講清楚。",
        "avoid": "避免只靠猜測做決定。"
      },
      {
        "level": "需要休整",
        "note": "能量偏散，適合把節奏放慢，先補足睡眠和水分。",
        "action": "安排 20 分鐘不被打擾的整理時間。",
        "avoid": "避免過度承諾。"
      },
      {
        "level": "靈感增加",
        "note": "適合做內容、設計、企劃或生活佈置，直覺會提供方向。",
        "action": "記下一個可執行的點子。",
        "avoid": "避免同時開太多新坑。"
      }
    ],
    "tarot": [
      {
        "name": "太陽",
        "meaning": "把成果攤開來看"
      },
      {
        "name": "節制",
        "meaning": "調整比例比硬衝有效"
      },
      {
        "name": "星星",
        "meaning": "適合長期布局"
      },
      {
        "name": "力量",
        "meaning": "用溫和方式堅持"
      },
      {
        "name": "隱者",
        "meaning": "先查證再發表"
      },
      {
        "name": "戀人",
        "meaning": "選擇要回到核心價值"
      }
    ],
    "colors": [
      "藍色",
      "綠色",
      "米白",
      "橙色",
      "紫色",
      "銀灰"
    ],
    "crystals": [
      "白水晶",
      "紫水晶",
      "黃水晶",
      "粉晶",
      "虎眼石",
      "黑曜石"
    ]
  },
  "mbti": {
    "updatedAt": "2026-07-02T17:42:30+08:00",
    "sourceNote": "娛樂性 MBTI 類型測驗內容。非專業心理評量。",
    "storageKey": "yangmei_mbti_result_v2",
    "disclaimer": "非專業心理評量，僅供自我觀察與娛樂。",
    "questions": [
      {
        "axis": "EI",
        "leftText": "聚會後你通常更有能量",
        "rightText": "獨處後你通常更有能量",
        "leftType": "E",
        "rightType": "I"
      },
      {
        "axis": "SN",
        "leftText": "你更相信具體經驗",
        "rightText": "你更喜歡抽象可能性",
        "leftType": "S",
        "rightType": "N"
      },
      {
        "axis": "TF",
        "leftText": "做決定先看邏輯",
        "rightText": "做決定先看感受",
        "leftType": "T",
        "rightType": "F"
      },
      {
        "axis": "JP",
        "leftText": "你喜歡提早規劃",
        "rightText": "你喜歡保留彈性",
        "leftType": "J",
        "rightType": "P"
      },
      {
        "axis": "EI",
        "leftText": "你傾向先說出想法",
        "rightText": "你傾向先在心裡整理",
        "leftType": "E",
        "rightType": "I"
      },
      {
        "axis": "SN",
        "leftText": "你重視可驗證的細節",
        "rightText": "你重視整體模式",
        "leftType": "S",
        "rightType": "N"
      },
      {
        "axis": "TF",
        "leftText": "衝突中你先找原則",
        "rightText": "衝突中你先顧關係",
        "leftType": "T",
        "rightType": "F"
      },
      {
        "axis": "JP",
        "leftText": "期限明確會讓你安心",
        "rightText": "開放式安排讓你自在",
        "leftType": "J",
        "rightType": "P"
      },
      {
        "axis": "EI",
        "leftText": "你容易主動認識新朋友",
        "rightText": "你多半等熟悉後再靠近",
        "leftType": "E",
        "rightType": "I"
      },
      {
        "axis": "SN",
        "leftText": "你偏好實作範例",
        "rightText": "你偏好概念框架",
        "leftType": "S",
        "rightType": "N"
      },
      {
        "axis": "TF",
        "leftText": "你常被說很客觀",
        "rightText": "你常被說很體貼",
        "leftType": "T",
        "rightType": "F"
      },
      {
        "axis": "JP",
        "leftText": "桌面整理代表效率",
        "rightText": "桌面彈性代表靈感",
        "leftType": "J",
        "rightType": "P"
      },
      {
        "axis": "EI",
        "leftText": "腦力激盪時你越聊越清楚",
        "rightText": "安靜思考時你越想越清楚",
        "leftType": "E",
        "rightType": "I"
      },
      {
        "axis": "SN",
        "leftText": "你喜歡一步一步確認",
        "rightText": "你喜歡先抓大方向",
        "leftType": "S",
        "rightType": "N"
      },
      {
        "axis": "TF",
        "leftText": "你願意指出問題核心",
        "rightText": "你願意先安撫情緒",
        "leftType": "T",
        "rightType": "F"
      },
      {
        "axis": "JP",
        "leftText": "出門前你會先列好路線",
        "rightText": "出門後你會邊走邊調整",
        "leftType": "J",
        "rightType": "P"
      },
      {
        "axis": "EI",
        "leftText": "你習慣把近況分享出去",
        "rightText": "你習慣保留給少數人",
        "leftType": "E",
        "rightType": "I"
      },
      {
        "axis": "SN",
        "leftText": "你注意現在能做什麼",
        "rightText": "你注意未來可能變成什麼",
        "leftType": "S",
        "rightType": "N"
      },
      {
        "axis": "TF",
        "leftText": "你比較怕判斷失準",
        "rightText": "你比較怕傷到別人",
        "leftType": "T",
        "rightType": "F"
      },
      {
        "axis": "JP",
        "leftText": "完成清單會讓你放鬆",
        "rightText": "保持選項會讓你放鬆",
        "leftType": "J",
        "rightType": "P"
      }
    ],
    "types": {
      "INTJ": {
        "summary": "策略型，擅長建立長期架構。"
      },
      "INTP": {
        "summary": "分析型，喜歡拆解概念和規則。"
      },
      "ENTJ": {
        "summary": "指揮型，擅長推進目標。"
      },
      "ENTP": {
        "summary": "發想型，喜歡挑戰既有做法。"
      },
      "INFJ": {
        "summary": "洞察型，重視價值與方向。"
      },
      "INFP": {
        "summary": "理想型，重視真誠與意義。"
      },
      "ENFJ": {
        "summary": "引導型，擅長凝聚團隊。"
      },
      "ENFP": {
        "summary": "探索型，擅長連結人和機會。"
      },
      "ISTJ": {
        "summary": "秩序型，重視可靠流程。"
      },
      "ISFJ": {
        "summary": "守護型，重視照顧與細節。"
      },
      "ESTJ": {
        "summary": "管理型，擅長落實制度。"
      },
      "ESFJ": {
        "summary": "協調型，擅長照顧現場氣氛。"
      },
      "ISTP": {
        "summary": "實作型，擅長快速排除問題。"
      },
      "ISFP": {
        "summary": "感受型，重視美感與當下體驗。"
      },
      "ESTP": {
        "summary": "行動型，擅長現場反應。"
      },
      "ESFP": {
        "summary": "表演型，擅長帶動情緒與互動。"
      }
    }
  },
  "dailyQuote": {
    "updatedAt": "2026-07-02T17:42:30+08:00",
    "sourceNote": "金句內容目前為站內展示文案。若加入外部名言，需先核實作者與授權狀態。",
    "storageKey": "yangmei_quote_favorites_v2",
    "categories": {
      "all": "全部",
      "success": "成功",
      "motivation": "勵志",
      "wisdom": "智慧",
      "life": "生活",
      "work": "工作",
      "health": "健康",
      "friendship": "友情"
    },
    "quotes": [
      {
        "category": "success",
        "text": "成功不是一次衝刺，而是每天把方向校正回來。",
        "author": "楊梅生活集",
        "sourceStatus": "站內展示文案"
      },
      {
        "category": "success",
        "text": "把能做的事做穩，機會會比較容易被看見。",
        "author": "楊梅生活集",
        "sourceStatus": "站內展示文案"
      },
      {
        "category": "motivation",
        "text": "今天先前進一小步，明天就少一點重量。",
        "author": "楊梅生活集",
        "sourceStatus": "站內展示文案"
      },
      {
        "category": "motivation",
        "text": "低潮不是結論，只是提醒你需要換一個節奏。",
        "author": "楊梅生活集",
        "sourceStatus": "站內展示文案"
      },
      {
        "category": "wisdom",
        "text": "真正的效率，是知道什麼事情現在不用做。",
        "author": "楊梅生活集",
        "sourceStatus": "站內展示文案"
      },
      {
        "category": "wisdom",
        "text": "資訊越多，越要保留判斷的安靜。",
        "author": "楊梅生活集",
        "sourceStatus": "站內展示文案"
      },
      {
        "category": "life",
        "text": "生活不需要每一刻都完美，但需要偶爾被好好整理。",
        "author": "楊梅生活集",
        "sourceStatus": "站內展示文案"
      },
      {
        "category": "life",
        "text": "把日子過穩，也是一種很深的能力。",
        "author": "楊梅生活集",
        "sourceStatus": "站內展示文案"
      },
      {
        "category": "work",
        "text": "好的工作流程，會讓人少一點消耗，多一點完成。",
        "author": "楊梅生活集",
        "sourceStatus": "站內展示文案"
      },
      {
        "category": "work",
        "text": "先把問題說清楚，解法才會開始變簡單。",
        "author": "楊梅生活集",
        "sourceStatus": "站內展示文案"
      },
      {
        "category": "health",
        "text": "身體的提醒通常很小聲，但不能一直忽略。",
        "author": "楊梅生活集",
        "sourceStatus": "站內展示文案"
      },
      {
        "category": "friendship",
        "text": "舒服的關係，是彼此都不用過度證明。",
        "author": "楊梅生活集",
        "sourceStatus": "站內展示文案"
      }
    ]
  }
};
