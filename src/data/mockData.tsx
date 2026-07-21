// React is implicitly imported by the JSX transform
import { Flame, Swords, Crown, Coins, Wrench, Star, Stars } from 'lucide-react';

// Import types from dedicated type files
import type { Game, GameSeat } from '../types/game';
import type { Friend, OnlinePlayer, UserStats, Achievement, VIPPrivilege, PlayerProfile, VIPLevelRule, VIPTargetDetail } from '../types/user';
import type { ChatMessage, ClubChatMessage } from '../types/chat';
import type { Package, SalePackage, Transaction, OfferPackage } from '../types/transaction';
import type { EventItem, GiftItem } from '../types/event';
import type { InboxMessage } from '../types/inbox';
import type { ClubRewardItem, UserClubStats, ClubEvent, EventTemplate } from '../types/club';

// Re-export types for backward compatibility
export type { Game } from '../types/game';
export type { Friend, OnlinePlayer, UserStats, Achievement, VIPPrivilege, PlayerProfile } from '../types/user';

export type { ChatMessage, ClubChatMessage } from '../types/chat';
export type { Package, SalePackage, Transaction, OfferPackage } from '../types/transaction';
export type { EventItem, GiftItem } from '../types/event';
export type { InboxMessage } from '../types/inbox';
export type { ClubRewardItem, UserClubStats, ClubEvent, EventTemplate } from '../types/club';

export const getStablePlayerId = (name: string, seed?: number): string => {
    if (seed) return `P${String(seed).padStart(5, '0')}`;

    const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `P${String(10000 + (hash % 90000)).padStart(5, '0')}`;
};

// ─── Avatar Data ────────────────────────────────────────────────────────────
export interface AvatarItem {
    id: number;
    emoji: string;
    label: string;
    bgClass: string;   // full Tailwind gradient class string
    locked: boolean;
    unlockHint?: string;
}

export const AVATARS: AvatarItem[] = [
    // ── Default avatars (1–10) ──
    { id: 1,  emoji: '🐯', label: '猛虎',    bgClass: 'bg-gradient-to-br from-orange-400 to-amber-600',   locked: false },
    { id: 2,  emoji: '🦁', label: '雄獅',    bgClass: 'bg-gradient-to-br from-yellow-400 to-amber-500',   locked: false },
    { id: 3,  emoji: '🐉', label: '神龍',    bgClass: 'bg-gradient-to-br from-violet-500 to-purple-700',  locked: false },
    { id: 4,  emoji: '🦊', label: '狐狸',    bgClass: 'bg-gradient-to-br from-red-400 to-orange-600',     locked: false },
    { id: 5,  emoji: '🐺', label: '惡狼',    bgClass: 'bg-gradient-to-br from-slate-400 to-slate-700',    locked: false },
    { id: 6,  emoji: '🦅', label: '老鷹',    bgClass: 'bg-gradient-to-br from-sky-500 to-blue-700',       locked: false },
    { id: 7,  emoji: '🐼', label: '熊貓',    bgClass: 'bg-gradient-to-br from-zinc-200 to-zinc-600',      locked: false },
    { id: 8,  emoji: '🦄', label: '獨角獸',  bgClass: 'bg-gradient-to-br from-pink-400 to-fuchsia-500',   locked: false },
    { id: 9,  emoji: '🔥', label: '鳳凰',    bgClass: 'bg-gradient-to-br from-red-500 to-yellow-400',     locked: false },
    { id: 10, emoji: '🎭', label: '謎面',    bgClass: 'bg-gradient-to-br from-indigo-600 to-violet-800',  locked: false },
    // ── Locked avatars (11–20) ──
    { id: 11, emoji: '🔒', label: '???', bgClass: 'bg-gradient-to-br from-slate-600 to-slate-800', locked: true, unlockHint: 'VIP 5+' },
    { id: 12, emoji: '🔒', label: '???', bgClass: 'bg-gradient-to-br from-slate-600 to-slate-800', locked: true, unlockHint: 'VIP 10+' },
    { id: 13, emoji: '🔒', label: '???', bgClass: 'bg-gradient-to-br from-slate-600 to-slate-800', locked: true, unlockHint: 'VIP 10+' },
    { id: 14, emoji: '🔒', label: '???', bgClass: 'bg-gradient-to-br from-slate-600 to-slate-800', locked: true, unlockHint: 'VIP 10+' },
    { id: 15, emoji: '🔒', label: '???', bgClass: 'bg-gradient-to-br from-slate-600 to-slate-800', locked: true, unlockHint: 'VIP 10+' },
    { id: 16, emoji: '🔒', label: '???', bgClass: 'bg-gradient-to-br from-slate-600 to-slate-800', locked: true, unlockHint: '活動獎勵' },
    { id: 17, emoji: '🔒', label: '???', bgClass: 'bg-gradient-to-br from-slate-600 to-slate-800', locked: true, unlockHint: '活動獎勵' },
    { id: 18, emoji: '🔒', label: '???', bgClass: 'bg-gradient-to-br from-slate-600 to-slate-800', locked: true, unlockHint: '活動獎勵' },
    { id: 19, emoji: '🔒', label: '???', bgClass: 'bg-gradient-to-br from-slate-600 to-slate-800', locked: true, unlockHint: '活動獎勵' },
    { id: 20, emoji: '🔒', label: '???', bgClass: 'bg-gradient-to-br from-slate-600 to-slate-800', locked: true, unlockHint: '活動獎勵' },
];

// --- Mock Data ---
const BASE_GAMES: Array<Omit<Game, 'provider' | 'description' | 'rtp' | 'volatility' | 'paylines' | 'maxMultiplier'>> = [
    { id: 1, title: 'Ace Blackjack', category: 'card', image: 'bg-red-900', icon: '♠️', size: 'large', hasJackpot: true },
    { id: 2, title: 'Gates of Olympus', category: 'slot', image: 'bg-purple-800', icon: '⚡', size: 'large', hasJackpot: true },
    { id: 3, title: 'Mystic Genie', category: 'slot', image: 'bg-indigo-800', icon: '🧞' },
    { id: 4, title: 'Lucky Tiger Rush', category: 'slot', image: 'bg-orange-700', icon: '🐯' },
    { id: 5, title: "Captain's Treasure", category: 'slot', image: 'bg-blue-800', icon: '🏴‍☠️', hasJackpot: true },
    { id: 6, title: 'Pineapple Lemur', category: 'slot', image: 'bg-green-700', icon: '🐒' },
    { id: 7, title: 'Shark Hunter', category: 'fish', image: 'bg-cyan-800', icon: '🦈' },
    { id: 8, title: 'Fiesta Spirits', category: 'slot', image: 'bg-pink-800', icon: '💀', hasJackpot: true },
    { id: 9, title: 'Arcane Wizardry', category: 'slot', image: 'bg-violet-900', icon: '🔮' },
    { id: 10, title: 'Fortune Expedition', category: 'slot', image: 'bg-yellow-800', icon: '🧭', hasJackpot: true },
    { id: 11, title: 'Golden Empire', category: 'slot', image: 'bg-amber-700', icon: '🏛️' },
    { id: 12, title: 'Super Ace', category: 'card', image: 'bg-emerald-800', icon: '🃏' },
    { id: 13, title: 'Neon Nights', category: 'slot', image: 'bg-fuchsia-900', icon: '🌃' },
    { id: 14, title: "Dragon's Gold", category: 'slot', image: 'bg-red-950', icon: '🐉', hasJackpot: true },
    { id: 15, title: 'Space Odyssey', category: 'slot', image: 'bg-slate-900', icon: '🚀' },
    { id: 16, title: "Vampire's Ball", category: 'slot', image: 'bg-rose-950', icon: '🦇' },
    { id: 17, title: 'Jungle King', category: 'slot', image: 'bg-green-900', icon: '🦍' },
    { id: 18, title: 'Arctic Freeze', category: 'slot', image: 'bg-sky-800', icon: '❄️' },
    { id: 19, title: 'Pharaoh\'s Tomb', category: 'slot', image: 'bg-amber-900', icon: '⚰️' },
    { id: 20, title: 'Cyber City', category: 'slot', image: 'bg-cyan-900', icon: '🤖' },
    { id: 21, title: 'Cowboy Duel', category: 'card', image: 'bg-orange-950', icon: '🤠' },
    { id: 22, title: 'Deep Sea Pearl', category: 'fish', image: 'bg-blue-950', icon: '🐚' },
];

const GAME_PROVIDERS = ['JH Gaming', 'PG Soft', 'Evolution'] as const;
const GAME_DESCRIPTIONS: Record<Game['category'], string> = {
    slot: '多線獎勵與特色回合，累積連線可觸發額外加成。',
    card: '經典牌桌規則搭配快速節奏，適合策略型玩家。',
    fish: '瞄準不同倍率魚種，特殊武器可觸發連鎖獎勵。',
};

export const GAMES: Game[] = BASE_GAMES.map((game, index) => ({
    ...game,
    provider: GAME_PROVIDERS[index % GAME_PROVIDERS.length],
    description: GAME_DESCRIPTIONS[game.category],
    rtp: Number((95.5 + ((game.id * 17) % 35) / 10).toFixed(1)),
    volatility: (['中', '高', '低', '極高'] as const)[index % 4],
    paylines: game.category === 'slot' ? (index % 2 === 0 ? '25 線' : '243 線') : 'N/A',
    maxMultiplier: game.category === 'card'
        ? `${8 + (game.id % 5) * 8}x`
        : game.category === 'fish'
            ? `${1_000 + game.id * 100}x`
            : `${4_000 + game.id * 500}x`,
    isNew: game.id >= 18,
}));

const OCCUPIED_SEAT_IDS = new Set([
    '003', '011', '016', '023', '029', '034', '041', '049', '057', '062', '071', '079',
]);

const formatSeatNo = (value: number) => value.toString().padStart(3, '0');

const createSeatRecord = (page: number, index: number): GameSeat => {
    const seatIndex = (page - 1) * 28 + index + 1;
    const seatNo = formatSeatNo(seatIndex);
    const baseRtp = 95 + (((page * 41) + (index * 17)) % 420) / 100;
    const baseHitRate = 22 + (((page * 9) + (index * 5)) % 160) / 10;
    const totalBetBase = 5800000 + seatIndex * 91357;

    return {
        id: `seat-${seatNo}`,
        page,
        seatNo,
        rtp: Number(baseRtp.toFixed(2)),
        isOccupied: OCCUPIED_SEAT_IDS.has(seatNo),
        occupantName: OCCUPIED_SEAT_IDS.has(seatNo) ? `Player_${seatNo}` : undefined,
        freeGame: {
            unopened: (seatIndex * 3) % 8,
            previousOne: 28 + ((seatIndex * 19) % 240),
            previousTwo: 55 + ((seatIndex * 31) % 360),
        },
        rtpAverage: {
            today: Number((baseRtp - 0.34 + (index % 3) * 0.21).toFixed(2)),
            threeDay: Number((baseRtp + 0.62 - (page % 2) * 0.15).toFixed(2)),
            sevenDay: Number((baseRtp - 0.48 + (seatIndex % 5) * 0.18).toFixed(2)),
        },
        hitRate: {
            today: Number((baseHitRate - 1.2 + (page % 3) * 0.9).toFixed(2)),
            threeDay: Number((baseHitRate + 0.8).toFixed(2)),
            sevenDay: Number((baseHitRate + 2.1 - (index % 4) * 0.4).toFixed(2)),
        },
        totalBet: {
            today: totalBetBase,
            threeDay: totalBetBase * 3 + seatIndex * 54000,
            sevenDay: totalBetBase * 7 + seatIndex * 195000,
        },
    };
};

export const GAME_SEATS: GameSeat[] = Array.from({ length: 3 }, (_, pageIndex) =>
    Array.from({ length: 28 }, (_, seatIndex) => createSeatRecord(pageIndex + 1, seatIndex))
).flat();

export const FRIENDS: Friend[] = [
    { id: 1, playerId: getStablePlayerId('Jessica_99', 10001), name: 'Jessica_99', avatar: 'bg-pink-500', status: 'online', lastMsg: '要一起玩嗎？' },
    { id: 2, playerId: getStablePlayerId('Tom888', 10002), name: 'Tom888', avatar: 'bg-blue-500', status: 'playing', lastMsg: '我剛中了Jackpot!' },
    { id: 3, playerId: getStablePlayerId('GM_Support', 10003), name: 'GM_Support', avatar: 'bg-yellow-600', status: 'online', lastMsg: '您好，有什麼能幫您的？' },
    { id: 4, playerId: getStablePlayerId('David_King', 10004), name: 'David_King', avatar: 'bg-green-600', status: 'offline', lastMsg: '下次見' },
    { id: 5, playerId: getStablePlayerId('LuckyGirl', 10005), name: 'LuckyGirl', avatar: 'bg-purple-500', status: 'playing', lastMsg: '這個機台很軟！' },
];

export const ONLINE_PLAYERS: OnlinePlayer[] = [
    { id: 101, playerId: getStablePlayerId('DragonSlayer', 10101), name: 'DragonSlayer', avatar: 'bg-red-600', level: 50 },
    { id: 102, playerId: getStablePlayerId('PokerFace_X', 10102), name: 'PokerFace_X', avatar: 'bg-slate-600', level: 22 },
    { id: 103, playerId: getStablePlayerId('SlotQueen', 10103), name: 'SlotQueen', avatar: 'bg-purple-600', level: 15 },
    { id: 104, playerId: getStablePlayerId('RichMan99', 10104), name: 'RichMan99', avatar: 'bg-yellow-600', level: 88 },
    { id: 105, playerId: getStablePlayerId('Newbie01', 10105), name: 'Newbie01', avatar: 'bg-green-600', level: 2 },
    { id: 106, playerId: getStablePlayerId('WinnerWinner', 10106), name: 'WinnerWinner', avatar: 'bg-blue-600', level: 34 },
];

export const CHAT_HISTORY: ChatMessage[] = [
    { id: 1, sender: 'Tom888', text: '嘿！兄弟，最近手氣如何？', isMe: false, time: '10:30' },
    { id: 2, sender: 'Me', text: '還不錯，剛在雷神贏了一把大的！', isMe: true, time: '10:31' },
    { id: 3, sender: 'Tom888', text: '真假！我也要去試試看', isMe: false, time: '10:32' },
    { id: 4, sender: 'Tom888', text: '這台機台最近很熱門', isMe: false, time: '10:32' },
    { id: 5, sender: 'Me', text: '祝你好運！發財了記得分紅 😂', isMe: true, time: '10:33' },
];

export const PUBLIC_CHAT_HISTORY: ChatMessage[] = [
    { id: 1, sender: 'DragonSlayer', text: '有人要在 VIP 房開局嗎？', isMe: false, time: '10:28' },
    { id: 2, sender: 'SlotQueen', text: '剛剛老虎機爆大獎了！太爽了', isMe: false, time: '10:29' },
    { id: 3, sender: 'RichMan99', text: '恭喜恭喜！分點喜氣', isMe: false, time: '10:29' },
    { id: 4, sender: 'System', text: '玩家 [Tom888] 在雷神之錘贏得 50,000 金幣！', isMe: false, isSystem: true, time: '10:30' },
];

export const PACKAGES: Package[] = [
    { id: 1, coins: '100,000', price: '$4.99', bonus: null },
    { id: 2, coins: '500,000', price: '$19.99', bonus: '+10%' },
    { id: 3, coins: '1,200,000', price: '$49.99', bonus: '+20%' },
    { id: 4, coins: '3,000,000', price: '$99.99', bonus: '+50%', best: true },
    { id: 5, coins: '7,500,000', price: '$199.99', bonus: '+80%' },
    { id: 6, coins: '20,000,000', price: '$499.99', bonus: '+100%' },
];

export const SALE_PACKAGES: SalePackage[] = [
    { id: 1, title: '新手禮包', coins: '1,000,000', price: '$0.99', original: '$4.99', tag: '-80% OFF' },
    { id: 2, title: '限時特賣', coins: '5,000,000', price: '$9.99', original: '$19.99', tag: 'HOT DEAL' },
    { id: 3, title: '破產救援', coins: '500,000', price: '$1.99', original: '$2.99', tag: 'DAILY' },
];

/** 專屬優惠方案卡片 - 用於銀行中心「優惠」分頁 */
export const OFFER_PACKAGES: OfferPackage[] = [
    { id: 1, title: '新春紅包禮', description: '購買即享限時紅包金幣', coins: '888,888', price: '$1.99', original: '$9.99', tag: '限時 80% OFF', gradient: 'from-red-600 to-orange-500', expireTime: '3天後結束' },
    { id: 2, title: 'VIP 專屬儲值', description: 'VIP 5+ 專屬加碼優惠', coins: '2,500,000', price: '$19.99', original: '$49.99', tag: 'VIP 限定', gradient: 'from-purple-600 to-indigo-500' },
    { id: 3, title: '週末狂歡包', description: '週六日限定超值禮包', coins: '1,200,000', price: '$9.99', original: '$24.99', tag: '週末限定', gradient: 'from-pink-500 to-rose-500', expireTime: '週日 23:59 截止' },
    { id: 4, title: '首充雙倍送', description: '首次儲值享 200% 回饋', coins: '500,000', price: '$4.99', original: '$9.99', tag: '首充限定', gradient: 'from-amber-500 to-yellow-400' },
    { id: 5, title: '月卡尊享', description: '每日自動領取獎勵', coins: '3,000,000', price: '$29.99', original: '$99.99', tag: '-70%', gradient: 'from-cyan-500 to-blue-500' },
    { id: 6, title: '幸運轉盤加碼', description: '購買後獲得 10 次免費轉盤', coins: '100,000', price: '$2.99', original: '$5.99', tag: '熱門', gradient: 'from-emerald-500 to-green-500', expireTime: '限量 100 份' },
];

export const EVENTS_LIST: EventItem[] = [
    { id: 1, type: 'sale', title: '限時儲值優惠', desc: 'App Store／Google Play 儲值限時加碼。', prize: '+20%', details: '活動期間完成指定商店儲值，即可依方案取得對應加碼銀幣。實際付款仍使用 APP 既有商店流程。', icon: <Flame className="text-red-500" />, bg: 'from-red-900/50 to-orange-900/50', border: 'border-red-500/50', status: 'ending', startTime: '2026/07/20 12:00', endTime: '2026/07/22 23:59' },
    { id: 2, type: 'tournament', title: '雷神之錘爭霸戰', desc: '累積贏分競賽，即刻加入挑戰！', prize: '10,000,000 銀幣', details: '活動期間遊玩指定老虎機，依累積贏分進行排名。活動結束後由系統結算 Mock 名次。', icon: <Swords className="text-yellow-400" />, bg: 'from-yellow-900/50 to-amber-900/50', border: 'border-yellow-500/50', status: 'active', startTime: '2026/07/15 00:00', endTime: '2026/07/31 23:59' },
    { id: 3, type: 'vip', title: 'VIP 尊榮升級', desc: '同時達成儲值與投注門檻，提升兩項核心回饋。', prize: '返水／手續費減免', details: '活動期間依 APP VIP0～VIP10 規格計算；升級需同時達成儲值與投注，保級則擇一達成。', icon: <Crown className="text-purple-400" />, bg: 'from-purple-900/50 to-indigo-900/50', border: 'border-purple-500/50', status: 'active', startTime: '2026/01/01 00:00', endTime: '長期' },
    { id: 4, type: 'tournament', title: '深海捕魚祭', desc: '捕獲特殊魚種，活動積分翻倍。', prize: '3,000,000 銀幣', details: '遊玩捕魚分類並捕獲活動魚種即可累積積分；Boss 魚種提供額外倍率。', icon: <Swords className="text-cyan-400" />, bg: 'from-cyan-900/50 to-blue-900/50', border: 'border-cyan-500/50', status: 'active', startTime: '2026/07/18 10:00', endTime: '2026/07/28 10:00' },
    { id: 5, type: 'sale', title: '週末狂歡包', desc: '週末限定商店加碼活動。', prize: '最高 +15%', details: '活動開始後，指定 App Store／Google Play 方案會顯示週末加碼內容。', icon: <Flame className="text-pink-500" />, bg: 'from-pink-900/50 to-rose-900/50', border: 'border-pink-500/50', status: 'upcoming', startTime: '2026/07/25 00:00', endTime: '2026/07/26 23:59' },
    { id: 6, type: 'vip', title: '黑卡會員邀請', desc: '限 VIP7 以上玩家參與的排名活動。', prize: '限定頭像框', details: '符合 VIP 等級即可於活動開始後報名，最終依活動積分決定限定獎勵。', icon: <Crown className="text-slate-400" />, bg: 'from-slate-900/50 to-gray-900/50', border: 'border-slate-500/50', status: 'upcoming', startTime: '2026/08/01 12:00', endTime: '2026/08/07 12:00' },
    { id: 7, type: 'tournament', title: '百家樂連勝王', desc: '挑戰最高連勝紀錄，奪取排名獎金。', prize: '5,000,000 銀幣', details: '依活動期間內單次最高連勝局數排名，相同局數則以先達成者優先。', icon: <Swords className="text-emerald-400" />, bg: 'from-emerald-900/50 to-green-900/50', border: 'border-emerald-500/50', status: 'ended', startTime: '2026/06/01 12:00', endTime: '2026/06/15 18:00' },
    { id: 8, type: 'sale', title: '幸運輪盤加碼', desc: '每日完成指定任務即可獲得一次轉盤機會。', prize: '最高 888,888 銀幣', details: '每日任務完成後可參加一次 Mock 輪盤；獎勵與簽到獎勵分開計算。', icon: <Stars className="text-yellow-300" />, bg: 'from-orange-900/50 to-yellow-900/50', border: 'border-orange-500/50', status: 'active', startTime: '2026/07/01 00:00', endTime: '2026/07/31 23:59' },
    { id: 9, type: 'tournament', title: '新手衝等賽', desc: '新註冊玩家限定的成長競賽。', prize: '1,000,000 銀幣', details: '活動開始後完成遊戲與社交任務即可累積成長積分。', icon: <Swords className="text-blue-400" />, bg: 'from-blue-900/50 to-sky-900/50', border: 'border-blue-500/50', status: 'upcoming', startTime: '2026/08/10 00:00', endTime: '2026/08/17 23:59' },
    { id: 10, type: 'vip', title: '夏季回饋賽', desc: '夏季限定累積投注回饋活動。', prize: '2,000,000 銀幣', details: '活動已結束，最終排名與獎勵皆為本機 Mock 展示資料。', icon: <Crown className="text-red-400" />, bg: 'from-red-900/50 to-pink-900/50', border: 'border-red-500/50', status: 'ended', startTime: '2026/06/01 00:00', endTime: '2026/06/30 23:59' },
];

export const INBOX_MESSAGES: InboxMessage[] = [
    { id: 1, type: 'system', title: '【系統公告】伺服器維護通知', date: '2025-10-30', content: '親愛的玩家您好：\n\n為了提供更優質的遊戲體驗，我們將於 2025/11/01 03:00 (GMT+8) 進行例行性維護，預計維護時間為 2 小時。維護期間將無法登入遊戲，造成不便敬請見諒。\n\n維護補償將於開機後發送至您的信箱。\n\nGolden Bet 營運團隊 敬上', read: false, attachment: { type: 'coins', label: '維護補償', amount: '50,000 金幣' } },
    { id: 2, type: 'promo', title: '🔥 週末狂歡！儲值回饋 200%', date: '2025-10-29', content: '週末限定活動開跑！\n\n凡於本週六、日進行儲值，即可享有 200% 的金幣回饋！\n機會難得，錯過不再！快去商店查看詳情吧！', read: true },
    { id: 3, type: 'system', title: '恭喜晉升 VIP 7！', date: '2025-10-25', content: '恭喜您！\n\n您已成功晉升為 VIP 7 會員，現在可享有 1.4% 返水與 7% 手續費減免。\n\n保級只需達成每月有效投注或月儲值其中一項條件。', read: true },
    { id: 4, type: 'personal', title: '好友邀請通知', date: '2025-10-20', content: '玩家 Tom888 邀請您加入「贏家俱樂部」公會。', read: true },
];

export const GIFT_ITEMS: GiftItem[] = [
    { id: 1, title: '每日登入獎勵', amount: '10,000 銀幣', icon: <Coins className="text-slate-200" size={40} />, expire: '23小時後過期', claimed: false, reward: { currency: 'silver', amount: 10_000 } },
    { id: 2, title: '限時活動獎勵', amount: '1,000,000 金幣', icon: <Crown className="text-purple-400" size={40} />, expire: '永久有效', claimed: false, reward: { currency: 'gold', amount: 1_000_000 } },
    { id: 3, title: '維護補償', amount: '50,000 金幣', icon: <Wrench className="text-slate-400" size={40} />, expire: '6天後過期', claimed: true },
    { id: 4, title: '新手幸運符', amount: '幸運加成 x3', icon: <Star className="text-yellow-300" size={40} />, expire: '2天後過期', claimed: false },
];

export const TRANSACTION_HISTORY: Transaction[] = [
    { id: 'TX-20251225-000', date: '2025-12-25 08:30', type: 'vault_deposit', amount: '10,000 金幣', status: 'success', method: '錢包存入' },
    { id: 'TX-20251224-001', date: '2025-12-24 19:30', type: 'deposit', amount: '100,000 金幣', status: 'success', method: 'App Store・$4.99' },
    { id: 'TX-20251224-002', date: '2025-12-24 15:15', type: 'deposit', amount: '500,000 金幣', status: 'processing', method: 'Google Play・$19.99' },
    { id: 'TX-20251224-003', date: '2025-12-24 10:00', type: 'free_reward', amount: '10,000 銀幣', status: 'success', method: '每日登入獎勵' },
    { id: 'TX-20251224-005', date: '2025-12-24 09:00', type: 'currency_conversion', amount: '100,000 銀幣', status: 'success', method: '金幣轉銀幣' },
    { id: 'TX-20251223-004', date: '2025-12-23 21:00', type: 'gift_transfer', amount: '50,000 金幣', status: 'success', method: '贈送給 Tom888' },
    { id: 'TX-20251222-005', date: '2025-12-22 10:05', type: 'deposit', amount: '500,000 金幣', status: 'failed', method: 'App Store・$19.99' },
    { id: 'TX-20251221-006', date: '2025-12-21 23:30', type: 'gift_package', amount: '1,000,000 金幣', status: 'success', method: '限時活動獎勵' },
    { id: 'TX-20251220-007', date: '2025-12-20 09:30', type: 'deposit', amount: '100,000 金幣', status: 'success', method: 'App Store・$4.99' },
    { id: 'TX-20251219-008', date: '2025-12-19 18:45', type: 'free_reward', amount: '5,000 金幣', status: 'success', method: '活動獎勵' },
    { id: 'TX-20251218-009', date: '2025-12-18 14:20', type: 'gift_transfer', amount: '100,000 金幣', status: 'success', method: '贈送給 Jessica_99' },
    { id: 'TX-20251217-010', date: '2025-12-17 08:00', type: 'free_reward', amount: '2,000 銀幣', status: 'success', method: '每日登入獎勵' },
    { id: 'TX-20251216-011', date: '2025-12-16 12:45', type: 'deposit', amount: '1,200,000 金幣', status: 'success', method: 'Google Play・$49.99' },
    { id: 'TX-20251215-012', date: '2025-12-15 16:20', type: 'gift_package', amount: '50,000 金幣', status: 'success', method: '維護補償禮包' },
    { id: 'TX-20251214-013', date: '2025-12-14 09:10', type: 'deposit', amount: '100,000 金幣', status: 'success', method: 'App Store・$4.99' },
    { id: 'TX-20251213-014', date: '2025-12-13 22:15', type: 'free_reward', amount: '8,888 金幣', status: 'success', method: '新春紅包' },
    { id: 'TX-20251212-015', date: '2025-12-12 11:30', type: 'deposit', amount: '500,000 金幣', status: 'processing', method: 'Google Play・$19.99' },
    { id: 'TX-20251211-016', date: '2025-12-11 14:50', type: 'gift_transfer', amount: '25,000 金幣', status: 'success', method: '贈送給 LuckyGirl' },
    { id: 'TX-20251210-017', date: '2025-12-10 10:00', type: 'deposit', amount: '500,000 金幣', status: 'success', method: 'App Store・$9.99' },
    { id: 'TX-20251209-018', date: '2025-12-09 19:40', type: 'gift_package', amount: '200,000 金幣', status: 'success', method: '新手禮包' },
];

export const CLUB_CHAT_HISTORY: ClubChatMessage[] = [
    { id: 1, sender: 'GodOfGamblers', text: '各位戰友早安！昨晚戰績不錯喔！', isMe: false, time: '09:00', role: 'leader' },
    { id: 2, sender: 'DragonSlayer', text: '會長早，今天晚上打公會戰嗎？', isMe: false, time: '09:05', role: 'admin' },
    { id: 3, sender: 'Me', text: '大家早！昨天我在雷神贏了5000倍！', isMe: true, time: '09:10', role: 'member' },
    { id: 4, sender: 'GodOfGamblers', text: '太強了吧！截圖發到群組給大家沾沾喜氣', isMe: false, time: '09:12', role: 'leader' },
    { id: 5, sender: 'SlotQueen', text: '恭喜恭喜！分紅分紅 😂', isMe: false, time: '09:15', role: 'member' },
    { id: 6, sender: 'Me', text: '沒問題，等等發紅包 🧧', isMe: true, time: '09:16', role: 'member' },
    { id: 7, sender: 'RichMan99', text: '坐等紅包', isMe: false, time: '09:18', role: 'member' },
];

export const CLUB_REWARDS_ITEMS: ClubRewardItem[] = [
    { id: 1, title: '50 Free Spins', cost: 1000, icon: 'Spin', type: 'Bonus' },
    { id: 2, title: ' Bonus Cash', cost: 2500, icon: 'Cash', type: 'Cash' },
    { id: 3, title: '俱樂部專屬頭像框', cost: 5000, icon: 'Frame', type: 'Frame' },
    { id: 4, title: '2小時 雙倍經驗卡', cost: 800, icon: 'Exp', type: 'Prop', stock: 5 },
    { id: 5, title: ' Bonus Cash', cost: 10000, icon: 'Cash', type: 'Cash' },
    { id: 6, title: '限量傳奇徽章', cost: 50000, icon: 'Badge', type: 'Frame', stock: 1 },
];

export const USER_CLUB_STATS: UserClubStats = {
    currentPoints: 3450,
    totalContribution: 15000
};

export const CLUB_EVENTS_DATA: ClubEvent[] = [
    {
        id: 1,
        title: "週末老虎機爭霸戰",
        prizePool: 1000000,
        status: "active",
        timeLeft: "02:14:59",
        participants: 128,
        description: "在活動期間內，累積贏分最高的玩家將獨得所有獎金！本週加碼，前三名額外獲得限量頭像框。",
        leaderboard: [
            { name: "GodOfGamblers", score: 885000, rank: 1 },
            { name: "LuckyStar", score: 720000, rank: 2 },
            { name: "SlotMachinePro", score: 650000, rank: 3 }
        ]
    },
    {
        id: 2,
        title: "百家樂連勝挑戰",
        prizePool: 500000,
        status: "upcoming",
        timeLeft: "12:00:00",
        participants: 56,
        description: "連續獲勝局數最多的玩家獲勝。中斷連勝則重新計算。",
        leaderboard: []
    },
    {
        id: 3,
        title: "捕魚達人競賽",
        prizePool: 300000,
        status: "ended",
        timeLeft: "00:00:00",
        participants: 245,
        description: "累積捕獲魚種價值最高的玩家獲勝。",
        leaderboard: [
            { name: "FisherMan99", score: 1200000, rank: 1 },
            { name: "DeepBlue", score: 980000, rank: 2 },
            { name: "SharkHunter", score: 850000, rank: 3 }
        ]
    }
];

export const EVENT_TEMPLATES: EventTemplate[] = [
    { id: 'tournament', name: '老虎機爭霸戰 (Tournament)' },
    { id: 'mission', name: '全員達成任務 (Co-op Mission)' },
    { id: 'login', name: '登入簽到獎勵 (Login Bonus)' }
];

// --- Profile & Achievement Data ---
export const USER_STATS: UserStats = {
    totalWin: 12580000,
    maxWin: 888888,
    dailyStreak: 15
};

export const ACHIEVEMENTS: Achievement[] = [
    { id: 1, title: '初來乍到', description: '首次登入遊戲', icon: '🎉', achieved: true, claimed: true, condition: '首次登入', reward: 10000 },
    { id: 2, title: '贏家起步', description: '累積贏分達 100,000', icon: '🏆', achieved: true, claimed: true, condition: '贏分累計達 100K', reward: 50000 },
    { id: 3, title: '財星高照', description: '累積贏分達 1,000,000', icon: '💎', achieved: true, claimed: false, condition: '贏分累計達 1M', reward: 100000 },
    { id: 4, title: '日進斗金', description: '連續登入 7 天', icon: '🔥', achieved: true, claimed: false, condition: '連續登入 7 天', reward: 77777 },
    { id: 5, title: '富可敵國', description: '累積贏分達 10,000,000', icon: '👑', achieved: false, claimed: false, condition: '贏分累計達 10M', reward: 500000 },
    { id: 6, title: '傳奇玩家', description: '達到 VIP 等級 10', icon: '⭐', achieved: false, claimed: false, condition: 'VIP 等級達 10', reward: 1000000 }
];

export const VIP_PRIVILEGES: VIPPrivilege[] = [
    { id: 1, title: '返水', description: '依 VIP 等級享有對應返水比例', icon: '↗' },
    { id: 2, title: '手續費減免', description: '依 VIP 等級享有對應手續費減免', icon: '%' },
];

export const VIP_TARGET_DETAILS: VIPTargetDetail[] = [
    {
        level: 0,
        name: 'VIP 0',
        themeColor: '#94A3B8',
        rebate: '0%',
        feeDiscount: '無折扣',
        maintainRequirement: '無保級條件',
        note: '完成首次儲值與投注即可開始累積 VIP 進度。',
    },
    {
        level: 1,
        name: 'VIP 1',
        themeColor: '#CD7F32',
        rebate: '0.2%',
        feeDiscount: '減免 1%',
        maintainRequirement: '每月有效投注 80,000，或月儲值 2,000',
        note: '完成基礎儲值與投注門檻後，開始享有返水與手續費減免。',
    },
    {
        level: 2,
        name: 'VIP 2',
        themeColor: '#C0C7D1',
        rebate: '0.4%',
        feeDiscount: '減免 2%',
        maintainRequirement: '每月有效投注 160,000，或月儲值 5,000',
        note: '開始取得穩定回饋，適合中低頻但持續遊玩的玩家。',
    },
    {
        level: 3,
        name: 'VIP 3',
        themeColor: '#F5C842',
        rebate: '0.6%',
        feeDiscount: '減免 3%',
        maintainRequirement: '每月有效投注 320,000，或月儲值 12,000',
        note: '返水與手續費減免隨等級穩定提升。',
    },
    {
        level: 4,
        name: 'VIP 4',
        themeColor: '#60A5FA',
        rebate: '0.8%',
        feeDiscount: '減免 4%',
        maintainRequirement: '每月有效投注 560,000，或月儲值 22,000',
        note: '持續累積儲值與投注，可提高兩項核心回饋。',
    },
    {
        level: 5,
        name: 'VIP 5',
        themeColor: '#A855F7',
        rebate: '1.0%',
        feeDiscount: '減免 5%',
        maintainRequirement: '每月有效投注 900,000，或月儲值 35,000',
        note: '進入高階會員層級，返水與手續費減免同步提升。',
    },
    {
        level: 6,
        name: 'VIP 6',
        themeColor: '#EC4899',
        rebate: '1.2%',
        feeDiscount: '減免 6%',
        maintainRequirement: '每月有效投注 1,300,000，或月儲值 50,000',
        note: '適合穩定投注與儲值玩家，開始享有高階回饋節奏。',
    },
    {
        level: 7,
        name: 'VIP 7',
        themeColor: '#F97316',
        rebate: '1.4%',
        feeDiscount: '減免 7%',
        maintainRequirement: '每月有效投注 1,800,000，或月儲值 75,000',
        note: '高階 VIP 目標，享有更高返水與手續費減免。',
    },
    {
        level: 8,
        name: 'VIP 8',
        themeColor: '#22D3EE',
        rebate: '1.6%',
        feeDiscount: '減免 8%',
        maintainRequirement: '每月有效投注 2,400,000，或月儲值 105,000',
        note: '針對核心玩家提供更高且穩定的核心回饋。',
    },
    {
        level: 9,
        name: 'VIP 9',
        themeColor: '#FACC15',
        rebate: '1.8%',
        feeDiscount: '減免 9%',
        maintainRequirement: '每月有效投注 3,100,000，或月儲值 140,000',
        note: '接近最高層級，兩項核心回饋進一步提升。',
    },
    {
        level: 10,
        name: 'VIP 10',
        themeColor: '#FFFFFF',
        rebate: '2.0%',
        feeDiscount: '減免 10%',
        maintainRequirement: '每月有效投注 4,000,000，或月儲值 180,000',
        note: '最高 VIP 等級，享有最高返水與手續費減免。',
    },
];

export const VIP_LEVEL_RULES: VIPLevelRule[] = [
    {
        level: 0,
        requiredDeposit: 0,
        requiredBet: 0,
        rewards: [
            { label: '返水', value: '0%' },
            { label: '手續費減免', value: '無折扣' },
        ],
    },
    {
        level: 1,
        requiredDeposit: 5000,
        requiredBet: 120000,
        rewards: [
            { label: '返水', value: '0.2%' },
            { label: '手續費減免', value: '減免 1%' },
        ],
    },
    {
        level: 2,
        requiredDeposit: 12000,
        requiredBet: 350000,
        rewards: [
            { label: '返水', value: '0.4%' },
            { label: '手續費減免', value: '減免 2%' },
        ],
    },
    {
        level: 3,
        requiredDeposit: 25000,
        requiredBet: 800000,
        rewards: [
            { label: '返水', value: '0.6%' },
            { label: '手續費減免', value: '減免 3%' },
        ],
    },
    {
        level: 4,
        requiredDeposit: 45000,
        requiredBet: 1400000,
        rewards: [
            { label: '返水', value: '0.8%' },
            { label: '手續費減免', value: '減免 4%' },
        ],
    },
    {
        level: 5,
        requiredDeposit: 70000,
        requiredBet: 2100000,
        rewards: [
            { label: '返水', value: '1.0%' },
            { label: '手續費減免', value: '減免 5%' },
        ],
    },
    {
        level: 6,
        requiredDeposit: 105000,
        requiredBet: 3000000,
        rewards: [
            { label: '返水', value: '1.2%' },
            { label: '手續費減免', value: '減免 6%' },
        ],
    },
    {
        level: 7,
        requiredDeposit: 150000,
        requiredBet: 4200000,
        rewards: [
            { label: '返水', value: '1.4%' },
            { label: '手續費減免', value: '減免 7%' },
        ],
    },
    {
        level: 8,
        requiredDeposit: 210000,
        requiredBet: 5600000,
        rewards: [
            { label: '返水', value: '1.6%' },
            { label: '手續費減免', value: '減免 8%' },
        ],
    },
    {
        level: 9,
        requiredDeposit: 280000,
        requiredBet: 7300000,
        rewards: [
            { label: '返水', value: '1.8%' },
            { label: '手續費減免', value: '減免 9%' },
        ],
    },
    {
        level: 10,
        requiredDeposit: 360000,
        requiredBet: 9200000,
        rewards: [
            { label: '返水', value: '2.0%' },
            { label: '手續費減免', value: '減免 10%' },
        ],
    },
];

export const getMockPlayerProfile = (name: string): PlayerProfile => {
    // try to find in friends or online players for base data
    const isFriend = FRIENDS.some(f => f.name === name);
    const friendData = FRIENDS.find(f => f.name === name);
    const onlineData = ONLINE_PLAYERS.find(p => p.name === name);

    return {
        playerId: friendData?.playerId || onlineData?.playerId || getStablePlayerId(name),
        name,
        avatar: friendData?.avatar || onlineData?.avatar || 'bg-slate-700',
        level: onlineData?.level || Math.floor(Math.random() * 50) + 1,
        vipLevel: Math.floor(Math.random() * 11),
        bio: isFriend ? '我們已經是好友了，一起來玩吧！' : '我是個熱愛老虎機的玩家，希望能多交點朋友。',
        recentGames: [
            { id: 1, name: 'Ace Blackjack', image: 'bg-red-900' },
            { id: 2, name: 'Gates of Olympus', image: 'bg-purple-800' },
            { id: 3, name: 'Shark Hunter', image: 'bg-cyan-800' }
        ],
        isFriend
    };
};
