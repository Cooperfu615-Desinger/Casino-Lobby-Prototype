# 巨亨ONLINE APP Prototype 專案完整分析報告

原始分析日期：2026-06-15  
最新更新日期：2026-06-22  
產品正式名稱：巨亨ONLINE
分析分支：`phase-1-mvp`  
專案路徑：`/Users/cooperfu/Desktop/casino-lobby-prototype`

## 1. 執行摘要

目前專案是一個以 React 18、TypeScript、Vite、Tailwind CSS 建立的 casino lobby 互動原型。它的定位已經不只是視覺稿展示，而是可以讓產品、設計與前端共同對齊流程的 living specification。

截至 2026-06-22，原先最高優先級的幾個工程風險已有明顯改善：

1. `vite.config.ts` 已支援 Vercel 與 GitHub Pages 不同部署 base。
2. `package.json` 已建立 `typecheck`、`lint`、`check`、`predeploy` 等品質閘門。
3. App 外層已改用 `PrototypeStage` 管理 1280 x 720 固定畫布縮放。
4. Auth / signup 類 overlay 已開始共用 `PrototypeOverlay`。
5. 聊天玩家資訊彈窗已加入聊天、黑名單、檢舉流程，並新增 `SocialContext` 作為全域 mock social state。

專案現在比較接近「後半段開發原型」：功能故事線完整、視覺語言穩定，後續重點應放在狀態模型、modal / route 型別化、mock data / asset 產品化，以及黑名單管理等功能補齊。

## 2. 專案現況

### 2.1 技術棧

| 類別 | 現況 |
| --- | --- |
| Framework | React 18.3.1 |
| Language | TypeScript 5.6.x |
| Build Tool | Vite 6.x |
| Styling | Tailwind CSS 3.4.x |
| Icons | lucide-react |
| State | React Context API |
| Deployment | Vercel 根路徑、GitHub Pages project path 雙模式 |
| Browser automation | Playwright 已加入 devDependencies |

### 2.2 套件與 scripts

`package.json` 目前版本為 `1.000.18`。主要 scripts：

| Script | 用途 |
| --- | --- |
| `npm run dev` | 啟動 Vite dev server |
| `npm run typecheck` | 執行 `tsc -b --pretty false` |
| `npm run lint` | 檢查 `src`、`vite.config.ts`、`eslint.config.js` |
| `npm run build` | 先 typecheck，再執行 Vite build |
| `npm run check` | typecheck、lint、Vite build 一次跑完 |
| `npm run deploy` | 使用 `gh-pages -d dist` 發佈 GitHub Pages |

`package-lock.json` 已同步：

1. root package version：`1.000.18`
2. devDependency：`playwright@^1.59.1`
3. `playwright-core` 與 macOS optional `fsevents`

### 2.3 程式量與檔案分布

| 項目 | 數量 / 規模 |
| --- | --- |
| `src` TypeScript/TSX 檔案 | 72 |
| `.tsx` 檔案 | 61 |
| `.ts` 檔案 | 11 |
| `src` 大小 | 約 6.9 MB |
| `docs` 大小 | 約 6.2 MB |
| `docs/screenshots` | 32 張 |

### 2.4 本機工具設定

`.claude/launch.json` 已加入可共用的 dev server 啟動設定，固定使用：

```bash
npm run dev -- --host 0.0.0.0 --port 5200
```

`.claude/settings.local.json` 是本機權限白名單，已在專案 `.gitignore` 中明確忽略，不建議提交到遠端。

## 3. 架構分析

### 3.1 App 組裝方式

`src/App.tsx` 目前負責：

1. 透過 `PrototypeStage` 固定 1280 x 720 原型畫布與縮放。
2. 根據 loading、登入狀態、active game 決定顯示 `LoginScreen`、`LobbyLayout` 或 `GameRoom`。
3. 裝配全域 Provider：`UserPreferencesProvider`、`AudioProvider`、`UIProvider`、`NavigationProvider`、`AuthProvider`、`SocialProvider`。
4. 掛載 `ModalContainer`、`ToastContainer`、`LoadingOverlay`。

Provider 分工比早期更完整，尤其是 `SocialProvider` 讓黑名單、玩家互動狀態有了後續擴充點。

### 3.2 Context 分工

| Context | 職責 | 評估 |
| --- | --- | --- |
| `AuthContext` | mock 登入、登出、玩家資料、餘額、頭像 | 可支援目前原型；仍是前端 mock session |
| `UIContext` | modal stack、loading、toast、balance animation | 功能完整，但 modal props 仍是 `any` |
| `NavigationContext` | current view、sub-tab 初始狀態、chat target、support draft、history | 已能支援私聊/檢舉跳轉，但還不是完整 route object |
| `SocialContext` | blocked players mock state、block/unblock/isBlocked | 已支援下一步黑名單列表 |
| `UserPreferencesContext` | language、sound、music、themeMode，寫入 localStorage | 分工正確；push notification 尚未納入 |
| `AudioContext` | BGM、button SFX、autoplay fallback | 可用；未來可再細分不同操作音效 |

### 3.3 目錄結構

目前 `src/components` 主要分為：

| 目錄 | 內容 |
| --- | --- |
| `common` | `PrototypeStage`、`PrototypeOverlay`、GameCard、AvatarDisplay、Toast、Loading 等 |
| `layout` | Header、LobbyLayout、GameGrid、BottomNavigation、SettingsMenu 等 |
| `features` | Login、Chat、Events、Bank、Inbox、Gifts、Club、GameRoom 等 |
| `modals` | Signup、Terms、Payment、Promotion、User、PlayerProfile、SeatSelection、社群登入等 |

這個分層仍適合目前原型。若接近正式產品化，建議再往 feature domain 分層，例如 `features/chat`、`features/bank`、`features/profile`。

## 4. 近期已完成的重點改善

### 4.1 部署 base 修正

`vite.config.ts` 現在以 build 環境決定 asset base：

| 情境 | base |
| --- | --- |
| Dev server | `/` |
| Vercel build | `/` |
| 一般 production build / GitHub Pages | `/Casino-Lobby-Prototype/` |

這修正了 Vercel 預覽網址空白頁的主因：GitHub Pages 子路徑 base 被套用到 Vercel 根路徑部署時，JS/CSS asset 會載入失敗。

### 4.2 品質閘門整理

目前 `npm run check` 是主要驗證入口，會依序執行：

1. TypeScript build mode typecheck
2. ESLint
3. Vite production build

先前出現本機 `curl localhost` 卡住、lint/build 長時間未完成的情況，主要與當時 local dev server / local network / tool process 狀態有關，不是目前程式碼的固定錯誤。後續仍建議把 Playwright smoke test 納入 scripts，避免只靠手動預覽。

### 4.3 原型畫布與 overlay 收斂

新增 `PrototypeStage` 後，固定 1280 x 720 畫布縮放已集中處理，不再散在 `App.tsx`。新增 `PrototypeOverlay` 後，登入、註冊、條款與社群登入 modal 已開始共用一致的 overlay layer。

這解決了早期 overlay 尺寸、z-index、背景遮罩不一致的一部分問題。不過 `UIContext` modal stack、`LobbyLayout` local modal、`LoginScreen` local modal 仍尚未完全收斂。

### 4.4 註冊流程更新

註冊流程已新增：

1. 暱稱輸入欄位
2. 推廣碼輸入欄位
3. 紫黑色系視覺回復
4. 固定高度內完整呈現內容，避免 720 畫布內必須拖曳

此流程符合目前 CocosCreator 後半段開發原型的修補定位。

### 4.5 聊天玩家資訊彈窗更新

`PlayerProfileCard` 已重新設計並加入：

1. `聊天`：可跳轉私人頻道，非好友也可私聊。
2. `黑名單`：先以全域 mock state 標記封鎖，不移除好友，不隱藏公共頻道訊息。
3. `檢舉`：跳轉客服聊天，預設標題為 `檢舉：暱稱 #穩定ID`。
4. 被封鎖玩家無法再私訊，也不能打開完整個人資料。

下一步最自然的功能就是黑名單管理列表。

## 5. 主要功能地圖

| 模組 | 狀態 |
| --- | --- |
| Brand loading | 有進度條、文案與進入 Login flow |
| Login | 帳號、遊客、手機、Facebook、LINE、Apple、Google mock flow |
| Terms / Signup | 條款審閱、註冊表單、暱稱、推廣碼、唯讀法律文件 |
| Lobby | Header、ticker、遊戲分類、遊戲格、浮動活動按鈕、底部導航 |
| Game launch | 點遊戲後可 quick play 或選座位 |
| Seat selection | 座位資料、RTP、占用狀態與進入遊戲流程 |
| Game room | 顯示 slot demo 與離開流程 |
| Chat | 公共頻道、私聊、客服、自動發送設定、玩家 profile card、檢舉 draft |
| Social safety | 黑名單 mock state 已有，黑名單列表尚未實作 |
| Events | 每日簽到、活動列表、排行榜、filter placeholder |
| Bank | 儲值、優惠、贈禮、保險箱、紀錄 |
| Inbox | 信件列表、附件領取、刪除確認 |
| Gifts | 禮物領取、全部領取 |
| User modal | 個資、VIP 進度、成就、頭像選擇、帳號綁定 mock |
| Audio / settings | BGM、SFX、語言、日夜模式、登出 |

## 6. 目前仍需追蹤的風險

### P0. 黑名單管理列表尚未完成

目前已能封鎖玩家，但玩家還沒有地方可以查看與解除封鎖。

建議下一步：

1. 在設定或個人中心加入 `黑名單管理` 入口。
2. 列表顯示頭像、暱稱、穩定 ID、封鎖時間。
3. 提供 `解除封鎖`。
4. 空狀態顯示 `目前沒有黑名單玩家`。

### P1. Modal props 尚未型別化

`UIContext` 的 `ModalItem.props` 與 `openModal` 仍使用 `any`。這會讓 `bankTab`、`chatTarget`、`profile` 等跨模組參數在編譯期不容易被檢查。

建議建立 typed modal props map：

```ts
type ModalPropsMap = {
  bank: BankModalProps;
  playerProfile: PlayerProfileProps;
  settings: SettingsModalProps;
};
```

### P1. Navigation 還不是完整 route object

`NavigationContext` 已支援 `chatTarget` 與 `supportDraft`，但 history 仍以 `ViewType[]` 為主，sub-tab 與 target 不是完整 route。

未來若要支援更精準的返回語意、deep link 或瀏覽器 history，建議改成：

```ts
type AppRoute =
  | { view: 'games' }
  | { view: 'chat'; tab: 'public' | 'chat' | 'support'; targetId?: string }
  | { view: 'bank'; tab: 'deposit' | 'offers' | 'gifts' | 'vault' | 'records'; receiverId?: string }
  | { view: 'events'; tab: 'daily' | 'events' | 'leaderboard' | 'filter' };
```

### P1. mock data 仍過度集中

`src/data/mockData.tsx` 橫跨 avatar、game、seat、friends、chat、bank、events、inbox、gifts、club、profile 等多個 domain。現在對 demo 很方便，但未來接 API 或切換測試資料會變重。

建議拆成：

1. `data/games.ts`
2. `data/chat.ts`
3. `data/bank.ts`
4. `data/events.ts`
5. `data/profile.ts`
6. `data/club.ts`

### P1. 資產策略仍偏 prototype

目前遊戲卡仍多以樣式與符號表示，真正產品化會需要更完整的遊戲封面、供應商資訊、玩法標籤與本地化素材。外部背景紋理與大型 BGM 也建議整理。

建議：

1. 將外部紋理本地化。
2. 為遊戲補可檢視封面圖。
3. 壓縮或 lazy load `bgm.mp3`。

### P2. i18n 尚未真正形成字典層

專案已有 language state 與 `LanguageModal`，但多數文案仍散落在各元件中。若後續多語系會持續發展，應逐步建立 `messages/zh-TW.ts`、`messages/en.ts`、`messages/ja.ts`。

### P2. Accessibility / focus management 可再補強

Modal focus trap、開啟後焦點落點、ESC 一致關閉、關閉後 focus return 尚未成為系統級能力。這件事可與 typed modal registry 一起做。

## 7. 建議路線圖

### Phase 1：社群安全功能補齊

1. 實作黑名單管理列表。
2. 補 `blockedAt` 或 mock 封鎖時間。
3. 從設定或個人中心提供入口。
4. 確認解除封鎖後可恢復私聊與個人資料查看。

### Phase 2：Modal / Navigation 收斂

1. 建立 typed modal props map。
2. 將 `LoginScreen` / `LobbyLayout` local modal flow 逐步接入統一 dialog system。
3. 將 `NavigationContext` 升級為 route object。
4. 統一 backdrop、ESC、focus trap、focus return。

### Phase 3：資料與資產產品化

1. 拆分 `mockData.tsx`。
2. 補遊戲封面與 game metadata。
3. 本地化外部紋理。
4. 壓縮或 lazy load 音訊。
5. 建立 design token 或 Tailwind theme token。

### Phase 4：驗證與自動化

1. 將 Playwright smoke test 加入 scripts。
2. 建立最小測試流程：登入、大廳、銀行、活動、聊天、進遊戲。
3. 針對 Vercel 與 GitHub Pages 各保留一組部署檢查。
4. 將 screenshot automation 與重要畫面 regression checklist 文件化。

## 8. 總結

這個專案目前已經是一份成熟的 casino lobby living spec。近期已完成部署 base、品質閘門、固定畫布、註冊流程、玩家資訊彈窗與社群安全 mock state 等關鍵改善。

下一階段最適合優先處理黑名單管理列表，因為它直接承接剛完成的玩家資訊彈窗與 `SocialContext`。之後再進入 typed modal、route object、mock data 拆分與資產產品化，會讓原型更接近可長期維護的前端基底。
