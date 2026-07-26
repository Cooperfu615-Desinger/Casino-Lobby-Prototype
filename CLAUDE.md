# CLAUDE.md — 巨亨ONLINE APP Prototype

## 專案簡介

這是 **巨亨ONLINE** 的 APP Lobby 互動原型，定位為「活文件規格（Living Specification）」。
主要用途是提供給**美術、前端工程師**參考，對齊頁面版位、功能流程與跨模組互動節點。

- 畫布尺寸：**1280 × 720 px**（固定解析度，動態縮放適配視口）
- 部署：GitHub Pages

## 技術棧

- **Framework**：React 18 + TypeScript 5.6
- **Build Tool**：Vite 6
- **Styling**：Tailwind CSS 3
- **Icons**：Lucide React
- **狀態管理**：React Context API（無第三方 store）

## 常用指令

```bash
npm run dev        # 啟動開發伺服器
npm run build      # 型別檢查 + 打包
npm run deploy     # 打包並部署至 GitHub Pages
```

## 專案結構

```
src/
├── components/
│   ├── layout/      # 頁面骨架：Header、BottomNavigation、CategorySidebar、GameGrid 等
│   ├── features/    # 功能介面：ChatInterface、EventsInterface、BankInterface 等
│   ├── modals/      # 彈窗：UserModal、PromotionModal、PaymentModal 等
│   ├── common/      # 通用元件：GameCard、ActionButton、JackpotTicker 等
│   └── ModalContainer.tsx  # 彈窗統一管理入口
├── context/
│   ├── AuthContext.tsx           # 登入狀態、用戶資料、餘額
│   ├── UIContext.tsx             # Modal 堆疊、Toast、Loading 遮罩
│   ├── NavigationContext.tsx     # 底部導航路由、歷史追蹤
│   ├── UserPreferencesContext.tsx # 語言、音效設定（持久化至 localStorage）
│   └── AudioContext.tsx          # BGM / SFX 播放
├── data/
│   └── mockData.tsx  # 所有 mock 資料集中於此
└── types/            # TypeScript 型別定義
docs/
└── art-design-checklist.md  # 美術製作清單（含進度追蹤）
```

## 核心概念

### 5 大 Context

| Context | 職責 | localStorage |
|---------|------|:---:|
| `AuthContext` | 登入/登出、用戶資料、三幣制餘額 | 否 |
| `UIContext` | Modal 堆疊（openModal/closeModal）、Toast、Loading | 否 |
| `NavigationContext` | 底部導航視圖切換、子 Tab 狀態 | 否 |
| `UserPreferencesContext` | 語言、音效/音樂開關 | 是 |
| `AudioContext` | BGM/SFX，整合 UserPreferences | 否 |

### Modal 系統

所有彈窗透過 `UIContext` 的 `openModal(type, props)` 統一觸發，由 `ModalContainer.tsx` 渲染。支援堆疊，ESC 關閉最上層。

```ts
openModal('promotion', { startIndex: 0 })  // 開啟促銷輪播
openModal('user')                           // 開啟用戶資料
```

### 導航系統

底部導航視圖（games / chat / events / bank / inbox / gifts）由 `NavigationContext` 控制，功能介面以 Overlay 方式疊加在 Lobby 主畫面上，而非換頁。

## 已知孤立元件（未掛入任何入口）

下列元件有程式碼但目前無觸發入口，**後續規劃再補**：

| 元件 | 說明 |
|------|------|
| `LobbyGuideModal.tsx` | Lobby 新手導覽，屬於 Prototype 說明用途，非正式產品功能 |
| `HistoryModal.tsx` | 帳戶交易明細彈窗，功能已整合至 F-04 銀行介面「紀錄」分頁 |

## 美術文件

`/docs/art-design-checklist.md` 為美術製作進度清單，包含所有頁面、功能介面、彈窗、元件的設計需求與狀態追蹤（⬜ 未開始 / 🔄 製作中 / ✅ 完成 / ⏸ 暫緩）。

## 設計規格速查

| 項目 | 規格 |
|------|------|
| 主背景色 | `#1a0b2e` / `#120822` |
| 強調色（金） | `#FFD700` |
| 視覺風格 | 毛玻璃（glassmorphism）+ 多層漸層 + 金色光澤邊框 |
| 字型 | 貨幣數字用等寬字體，其餘無襯線體 |
| 動畫 | Tailwind animate-in（fade、zoom、slide）+ Pulse、Bounce |
