/**
 * 巨亨ONLINE APP Prototype — Screenshot Script
 * 執行：node screenshot.mjs
 * 輸出：docs/screenshots/
 */

import { chromium } from 'playwright';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL   = 'http://127.0.0.1:5174';
const OUT_DIR    = join(__dirname, 'docs', 'screenshots');

mkdirSync(OUT_DIR, { recursive: true });

let counter = 0;
const log = [];

async function shot(page, name) {
    counter++;
    const num  = String(counter).padStart(3, '0');
    const file = `${num}_${name}.png`;
    await page.screenshot({ path: join(OUT_DIR, file) });
    console.log(`  ✅ ${file}`);
    log.push(file);
}

async function tryClick(page, selector, timeout = 3000) {
    try {
        await page.click(selector, { timeout });
        await page.waitForTimeout(400);
        return true;
    } catch { return false; }
}

/** Close any overlay that has an aria-label="關閉" / "Close" / "關閉功能" button.
 *  Falls back to clicking the backdrop (outside the modal box) if needed. */
async function closeOverlay(page) {
    const closed = await tryClick(
        page,
        'button[aria-label="Close"], button[aria-label="關閉"], button[aria-label="關閉功能"]',
        1500
    );
    if (!closed) {
        // Try clicking outside the modal (top-left corner of the backdrop)
        await page.mouse.click(20, 20).catch(() => {});
    }
    await page.waitForTimeout(500);
}

async function clickNavItem(page, label) {
    await page.click(`button:has(span:text-is("${label}"))`, { timeout: 5000 });
    await page.waitForTimeout(700);
}

// ──────────────────────────────────────────────────────────────────────────────

const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
});
const ctx  = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx.newPage();

try {
    // ════════════════════════════════════════════════════════════
    // P-01 品牌載入畫面
    // ════════════════════════════════════════════════════════════
    console.log('\n── P-01 Brand Loading ──');
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    await shot(page, 'P-01_brand-loading');

    // 等待登入畫面出現（帳號按鈕）
    await page.waitForSelector('button[aria-label="帳號登入"]', { timeout: 15000 });

    // ════════════════════════════════════════════════════════════
    // P-02 登入頁 — 各狀態
    // ════════════════════════════════════════════════════════════
    console.log('\n── P-02 Login Screen ──');
    await shot(page, 'P-02_login-default');

    // 帳號登入表單
    await tryClick(page, 'button[aria-label="帳號登入"]');
    await shot(page, 'P-02_login-account-form');
    await closeOverlay(page);   // clicks button[aria-label="關閉"] on the overlay

    // 手機登入
    await tryClick(page, 'button[aria-label="手機登入"]');
    await shot(page, 'M-09_phone-login-step1');
    await tryClick(page, 'button:has-text("取得驗證碼")', 2000);
    await shot(page, 'M-09_phone-login-step2-otp');
    await closeOverlay(page);   // clicks button[aria-label="關閉"] on PhoneLoginModal

    // Facebook 登入
    console.log('  (waiting for FB confirm state…)');
    await tryClick(page, 'button[aria-label="Facebook 登入"]');
    await page.waitForTimeout(1800);   // connecting→confirm transition takes 1500 ms
    await shot(page, 'M-10_facebook-login');
    await tryClick(page, 'button:has-text("Cancel")', 1000);

    // LINE 登入
    await tryClick(page, 'button[aria-label="LINE 登入"]');
    await page.waitForTimeout(1800);
    await shot(page, 'M-11_line-login');
    await tryClick(page, 'button:has-text("取消")', 1000);

    // Apple 登入
    await tryClick(page, 'button[aria-label="Apple 登入"]');
    await page.waitForTimeout(1800);
    await shot(page, 'M-12_apple-login');
    await tryClick(page, 'button:has-text("取消")', 1000);

    // Google 登入
    await tryClick(page, 'button[aria-label="Google 登入"]');
    await page.waitForTimeout(1800);
    await shot(page, 'M-13_google-login');
    await tryClick(page, 'button:has-text("取消")', 1000);

    // 服務條款 (M-04) — 註冊流程（帳號登入 overlay → 點「註冊帳號」→ Terms 開啟）
    await tryClick(page, 'button[aria-label="帳號登入"]');
    await tryClick(page, 'button:has-text("註冊帳號")');
    await page.waitForTimeout(500);
    await shot(page, 'M-04_terms-signup-mode');
    await closeOverlay(page);   // clicks button[aria-label="關閉"] on TermsModal

    // ════════════════════════════════════════════════════════════
    // 登入（帳號登入，取得完整 VIP 使用者）
    // ════════════════════════════════════════════════════════════
    console.log('\n── Logging in… ──');
    await tryClick(page, 'button[aria-label="帳號登入"]');
    await page.waitForSelector('input[placeholder="Enter username"]', { timeout: 5000 });
    await page.fill('input[placeholder="Enter username"]', 'demo');
    await page.fill('input[placeholder="••••••••"]', 'demo');
    await tryClick(page, 'button:has-text("LOGIN")');
    // 等待品牌載入完成（約 8 秒）
    console.log('  (waiting for brand loading ~8s…)');
    await page.waitForTimeout(9000);

    // ════════════════════════════════════════════════════════════
    // P-03 Lobby 主畫面
    // ════════════════════════════════════════════════════════════
    console.log('\n── P-03 Lobby ──');
    await shot(page, 'P-03_lobby-main');

    // 設定選單 (L-06)
    await tryClick(page, 'button[aria-label="Open settings menu"]');
    await shot(page, 'L-06_settings-menu');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);

    // 語言 Modal (M-06)
    await tryClick(page, 'button[aria-label="Open settings menu"]');
    await tryClick(page, 'button:has-text("切換語系")');
    await shot(page, 'M-06_language-modal');
    await closeOverlay(page);

    // 服務條款 Modal (M-04) — 唯讀
    await tryClick(page, 'button[aria-label="Open settings menu"]');
    await tryClick(page, 'button:has-text("使用者規章")');
    await shot(page, 'M-04_terms-readonly');
    await closeOverlay(page);

    // 用戶 Modal (M-01)
    await tryClick(page, 'button[aria-label="開啟玩家資料"]');
    await page.waitForTimeout(500);
    await shot(page, 'M-01_user-modal-info');
    await tryClick(page, 'button:has-text("成就")', 2000);
    await shot(page, 'M-01_user-modal-achievements');
    await closeOverlay(page);

    // 促銷輪播 (M-02) — SALE 按鈕
    await tryClick(page, 'button:has-text("SALE")');
    await page.waitForTimeout(400);
    await shot(page, 'M-02_promotion-modal');
    await closeOverlay(page);

    // ════════════════════════════════════════════════════════════
    // F-01 聊天介面
    // ════════════════════════════════════════════════════════════
    console.log('\n── F-01 Chat ──');
    await clickNavItem(page, '聊天');
    await shot(page, 'F-01_chat-private');
    await tryClick(page, 'button:has-text("公共頻道")');
    await shot(page, 'F-01_chat-public');
    await tryClick(page, 'button:has-text("線上客服")');
    await shot(page, 'F-01_chat-support');
    await closeOverlay(page);

    // ════════════════════════════════════════════════════════════
    // F-02 活動介面
    // ════════════════════════════════════════════════════════════
    console.log('\n── F-02 Events ──');
    await clickNavItem(page, '活動');
    await shot(page, 'F-02_events-daily-checkin');
    await tryClick(page, 'button:has-text("活動")');
    await shot(page, 'F-02_events-list');
    await tryClick(page, 'button:has-text("排行榜")');
    await shot(page, 'F-02_events-leaderboard');
    await closeOverlay(page);

    // ════════════════════════════════════════════════════════════
    // F-04 銀行介面
    // ════════════════════════════════════════════════════════════
    console.log('\n── F-04 Bank ──');
    await clickNavItem(page, '銀行');
    await shot(page, 'F-04_bank-deposit');
    for (const tab of ['優惠', '贈禮', '保險箱', '紀錄']) {
        await tryClick(page, `button:has-text("${tab}")`);
        await shot(page, `F-04_bank-${tab}`);
    }
    // Payment Modal (M-03) — 在儲值頁點購買
    await tryClick(page, 'button:has-text("儲值")');
    await page.waitForTimeout(300);
    await page.locator('button:has-text("$")').first().click().catch(() => {});
    await page.waitForTimeout(500);
    await shot(page, 'M-03_payment-modal-confirm');
    await closeOverlay(page);
    await closeOverlay(page);   // close bank overlay too

    // ════════════════════════════════════════════════════════════
    // F-03 信箱介面
    // ════════════════════════════════════════════════════════════
    console.log('\n── F-03 Inbox ──');
    await clickNavItem(page, '信箱');
    await shot(page, 'F-03_inbox');
    await closeOverlay(page);

    // ════════════════════════════════════════════════════════════
    // F-05 禮物介面
    // ════════════════════════════════════════════════════════════
    console.log('\n── F-05 Gifts ──');
    await clickNavItem(page, '禮物');
    await shot(page, 'F-05_gifts');
    await closeOverlay(page);

    // ════════════════════════════════════════════════════════════
    // P-04 遊戲室（點擊遊戲卡片進入）
    // ════════════════════════════════════════════════════════════
    console.log('\n── P-04 Game Room ──');
    const card = page.locator('button, div[role="button"]').filter({ hasText: 'Ace Blackjack' }).first();
    await card.hover().catch(() => {});
    await card.click().catch(() => {});
    await page.waitForTimeout(600);
    await shot(page, 'P-03_game-launch-modal');
    const quickPlay = await tryClick(page, 'button:has-text("快速進入")', 2000);
    if (quickPlay) {
        console.log('  (waiting for game room loading ~6s…)');
        await page.waitForTimeout(6000);
        await shot(page, 'P-04_game-room');
    }

} catch (err) {
    console.error('\n❌ Script error:', err.message);
} finally {
    await browser.close();
    console.log(`\n🎉 完成！共 ${counter} 張截圖已儲存至 docs/screenshots/`);
    console.log(log.map(f => `  • ${f}`).join('\n'));
}
