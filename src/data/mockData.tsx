// React is implicitly imported by the JSX transform
import { Flame, Swords, Crown, Coins, Wrench, Star, Stars } from 'lucide-react';

// Import types from dedicated type files
import type { Game, GameSeat } from '../types/game';
import type { Friend, OnlinePlayer, UserStats, Achievement, VIPPrivilege, PlayerProfile, VIPLevelRule } from '../types/user';
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

// --- Mock Data ---
export const GAMES: Game[] = [
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
    { id: 1, name: 'Jessica_99', avatar: 'bg-pink-500', status: 'online', lastMsg: '要一起玩嗎？' },
    { id: 2, name: 'Tom888', avatar: 'bg-blue-500', status: 'playing', lastMsg: '我剛中了Jackpot!' },
    { id: 3, name: 'GM_Support', avatar: 'bg-yellow-600', status: 'online', lastMsg: '您好，有什麼能幫您的？' },
    { id: 4, name: 'David_King', avatar: 'bg-green-600', status: 'offline', lastMsg: '下次見' },
    { id: 5, name: 'LuckyGirl', avatar: 'bg-purple-500', status: 'playing', lastMsg: '這個機台很軟！' },
];

export const ONLINE_PLAYERS: OnlinePlayer[] = [
    { id: 101, name: 'DragonSlayer', avatar: 'bg-red-600', level: 50 },
    { id: 102, name: 'PokerFace_X', avatar: 'bg-slate-600', level: 22 },
    { id: 103, name: 'SlotQueen', avatar: 'bg-purple-600', level: 15 },
    { id: 104, name: 'RichMan99', avatar: 'bg-yellow-600', level: 88 },
    { id: 105, name: 'Newbie01', avatar: 'bg-green-600', level: 2 },
    { id: 106, name: 'WinnerWinner', avatar: 'bg-blue-600', level: 34 },
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
    { id: 1, title: '新春紅包禮', description: '每日登入領取紅包金幣', coins: '888,888', price: '$1.99', original: '$9.99', tag: '限時 80% OFF', gradient: 'from-red-600 to-orange-500', expireTime: '3天後結束' },
    { id: 2, title: 'VIP 專屬儲值', description: 'VIP 5+ 專屬加碼優惠', coins: '2,500,000', price: '$19.99', original: '$49.99', tag: 'VIP 限定', gradient: 'from-purple-600 to-indigo-500' },
    { id: 3, title: '週末狂歡包', description: '週六日限定超值禮包', coins: '1,200,000', price: '$9.99', original: '$24.99', tag: '週末限定', gradient: 'from-pink-500 to-rose-500', expireTime: '週日 23:59 截止' },
    { id: 4, title: '首充雙倍送', description: '首次儲值享 200% 回饋', coins: '500,000', price: '$4.99', original: '$9.99', tag: '首充限定', gradient: 'from-amber-500 to-yellow-400' },
    { id: 5, title: '月卡尊享', description: '每日自動領取獎勵', coins: '3,000,000', price: '$29.99', original: '$99.99', tag: '-70%', gradient: 'from-cyan-500 to-blue-500' },
    { id: 6, title: '幸運轉盤加碼', description: '購買後獲得 10 次免費轉盤', coins: '100,000', price: '$2.99', original: '$5.99', tag: '熱門', gradient: 'from-emerald-500 to-green-500', expireTime: '限量 100 份' },
];

export const EVENTS_LIST: EventItem[] = [
    { id: 1, type: 'sale', title: '限時儲值優惠', desc: '全場 200% 回饋，僅剩 3 小時！', icon: <Flame className="text-red-500" />, bg: 'from-red-900/50 to-orange-900/50', border: 'border-red-500/50', status: 'ending', startTime: '2025/11/01 12:00', endTime: '2025/11/01 15:00' },
    { id: 2, type: 'tournament', title: '雷神之錘爭霸戰', desc: '總獎金 10,000,000 金幣，即刻開戰！', icon: <Swords className="text-yellow-400" />, bg: 'from-yellow-900/50 to-amber-900/50', border: 'border-yellow-500/50', status: 'active', startTime: '2025/11/01 00:00', endTime: '2025/11/07 23:59' },
    { id: 3, type: 'vip', title: 'VIP 尊榮升級', desc: '升級 VIP 5 即可獲得專屬經理服務。', icon: <Crown className="text-purple-400" />, bg: 'from-purple-900/50 to-indigo-900/50', border: 'border-purple-500/50', status: 'active', startTime: '2025/10/01 00:00', endTime: '2025/12/31 23:59' },
    { id: 4, type: 'tournament', title: '深海捕魚祭', desc: '捕獲特殊魚種積分翻倍！', icon: <Swords className="text-cyan-400" />, bg: 'from-cyan-900/50 to-blue-900/50', border: 'border-cyan-500/50', status: 'active', startTime: '2025/11/02 10:00', endTime: '2025/11/05 10:00' },
    { id: 5, type: 'sale', title: '週末狂歡包', desc: '週末限定，買一送一！', icon: <Flame className="text-pink-500" />, bg: 'from-pink-900/50 to-rose-900/50', border: 'border-pink-500/50', status: 'upcoming', startTime: '2025/11/08 00:00', endTime: '2025/11/09 23:59' },
    { id: 6, type: 'vip', title: '黑卡會員邀請', desc: '僅限 VIP 7 以上玩家參與。', icon: <Crown className="text-slate-400" />, bg: 'from-slate-900/50 to-gray-900/50', border: 'border-slate-500/50', status: 'upcoming', startTime: '2025/11/15 12:00', endTime: '2025/11/20 12:00' },
    { id: 7, type: 'tournament', title: '百家樂連勝王', desc: '挑戰最高連勝紀錄，奪取獎金。', icon: <Swords className="text-emerald-400" />, bg: 'from-emerald-900/50 to-green-900/50', border: 'border-emerald-500/50', status: 'ending', startTime: '2025/10/28 12:00', endTime: '2025/11/01 18:00' },
    { id: 8, type: 'sale', title: '幸運輪盤加碼', desc: '每日登入免費轉一次！', icon: <Stars className="text-yellow-300" />, bg: 'from-orange-900/50 to-yellow-900/50', border: 'border-orange-500/50', status: 'active', startTime: '2025/11/01 00:00', endTime: '2025/11/30 23:59' },
    { id: 9, type: 'tournament', title: '新手衝等賽', desc: '新註冊玩家專屬，快速升級。', icon: <Swords className="text-blue-400" />, bg: 'from-blue-900/50 to-sky-900/50', border: 'border-blue-500/50', status: 'upcoming', startTime: '2025/11/10 00:00', endTime: '2025/11/17 23:59' },
    { id: 10, type: 'vip', title: '生日禮金加倍', desc: '本月壽星儲值回饋 300%。', icon: <Crown className="text-red-400" />, bg: 'from-red-900/50 to-pink-900/50', border: 'border-red-500/50', status: 'ending', startTime: '2025/10/01 00:00', endTime: '2025/11/01 23:59' },
];

export const INBOX_MESSAGES: InboxMessage[] = [
    { id: 1, type: 'system', title: '【系統公告】伺服器維護通知', date: '2025-10-30', content: '親愛的玩家您好：\n\n為了提供更優質的遊戲體驗，我們將於 2025/11/01 03:00 (GMT+8) 進行例行性維護，預計維護時間為 2 小時。維護期間將無法登入遊戲，造成不便敬請見諒。\n\n維護補償將於開機後發送至您的信箱。\n\nGolden Bet 營運團隊 敬上', read: false, attachment: { type: 'coins', label: '維護補償', amount: '50,000 金幣' } },
    { id: 2, type: 'promo', title: '🔥 週末狂歡！儲值回饋 200%', date: '2025-10-29', content: '週末限定活動開跑！\n\n凡於本週六、日進行儲值，即可享有 200% 的金幣回饋！\n機會難得，錯過不再！快去商店查看詳情吧！', read: true },
    { id: 3, type: 'system', title: '恭喜晉升 VIP 7！', date: '2025-10-25', content: '恭喜您！\n\n您已成功晉升為 VIP 7 會員。現在您可以享受更高的返水比例與專屬客戶經理服務。\n\n我們已發送一份晉升禮包到您的「禮物中心」，請記得去領取喔！', read: true, attachment: { type: 'coins', label: 'VIP 晉升禮包', amount: '1,000,000 金幣' } },
    { id: 4, type: 'personal', title: '好友邀請通知', date: '2025-10-20', content: '玩家 Tom888 邀請您加入「贏家俱樂部」公會。', read: true },
];

export const GIFT_ITEMS: GiftItem[] = [
    { id: 1, title: '每日登入獎勵', amount: '10,000 金幣', icon: <Coins className="text-[#FFD700]" size={40} />, expire: '23小時後過期', claimed: false },
    { id: 2, title: 'VIP 7 晉升禮包', amount: '1,000,000 金幣', icon: <Crown className="text-purple-400" size={40} />, expire: '永久有效', claimed: false },
    { id: 3, title: '維護補償', amount: '50,000 金幣', icon: <Wrench className="text-slate-400" size={40} />, expire: '6天後過期', claimed: true },
    { id: 4, title: '新手幸運符', amount: '幸運加成 x3', icon: <Star className="text-yellow-300" size={40} />, expire: '2天後過期', claimed: false },
];

export const TRANSACTION_HISTORY: Transaction[] = [
    { id: 'TX-20251225-000', date: '2025-12-25 08:30', type: 'vault_deposit', amount: '10,000 金幣', status: 'success', method: '錢包存入' },
    { id: 'TX-20251224-001', date: '2025-12-24 19:30', type: 'deposit', amount: '$4.99', status: 'success', method: 'Apple Pay' },
    { id: 'TX-20251224-002', date: '2025-12-24 15:15', type: 'deposit', amount: '$9.99', status: 'processing', method: 'Credit Card' },
    { id: 'TX-20251224-003', date: '2025-12-24 10:00', type: 'free_reward', amount: '10,000 金幣', status: 'success', method: '每日登入獎勵' },
    { id: 'TX-20251224-005', date: '2025-12-24 09:00', type: 'currency_conversion', amount: '100,000 銀幣', status: 'success', method: '金幣轉銀幣' },
    { id: 'TX-20251223-004', date: '2025-12-23 21:00', type: 'gift_transfer', amount: '50,000 金幣', status: 'success', method: '贈送給 Tom888' },
    { id: 'TX-20251222-005', date: '2025-12-22 10:05', type: 'deposit', amount: '$19.99', status: 'failed', method: 'Apple Pay' },
    { id: 'TX-20251221-006', date: '2025-12-21 23:30', type: 'gift_package', amount: '1,000,000 金幣', status: 'success', method: 'VIP 7 晉升禮包' },
    { id: 'TX-20251220-007', date: '2025-12-20 09:30', type: 'deposit', amount: '$4.99', status: 'success', method: 'App Store' },
    { id: 'TX-20251219-008', date: '2025-12-19 18:45', type: 'free_reward', amount: '5,000 金幣', status: 'success', method: '活動獎勵' },
    { id: 'TX-20251218-009', date: '2025-12-18 14:20', type: 'gift_transfer', amount: '100,000 金幣', status: 'success', method: '贈送給 Jessica_99' },
    { id: 'TX-20251217-010', date: '2025-12-17 08:00', type: 'free_reward', amount: '2,000 金幣', status: 'success', method: '每日登入獎勵' },
    { id: 'TX-20251216-011', date: '2025-12-16 12:45', type: 'deposit', amount: '$49.99', status: 'success', method: 'Google Play' },
    { id: 'TX-20251215-012', date: '2025-12-15 16:20', type: 'gift_package', amount: '50,000 金幣', status: 'success', method: '維護補償禮包' },
    { id: 'TX-20251214-013', date: '2025-12-14 09:10', type: 'deposit', amount: '$4.99', status: 'success', method: 'Apple Pay' },
    { id: 'TX-20251213-014', date: '2025-12-13 22:15', type: 'free_reward', amount: '8,888 金幣', status: 'success', method: '新春紅包' },
    { id: 'TX-20251212-015', date: '2025-12-12 11:30', type: 'deposit', amount: '$19.99', status: 'processing', method: 'Credit Card' },
    { id: 'TX-20251211-016', date: '2025-12-11 14:50', type: 'gift_transfer', amount: '25,000 金幣', status: 'success', method: '贈送給 LuckyGirl' },
    { id: 'TX-20251210-017', date: '2025-12-10 10:00', type: 'deposit', amount: '$9.99', status: 'success', method: 'Apple Pay' },
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
    { id: 1, title: '贈禮手續費優惠', description: '贈禮手續費僅 5%', icon: '🎁' },
    { id: 2, title: '每日登入禮金加成', description: '每日登入禮金 +10%', icon: '💰' },
    { id: 3, title: '專屬客服', description: '優先處理通道', icon: '🎧' },
    { id: 4, title: '特殊活動資格', description: 'VIP 專屬活動邀請', icon: '🎪' }
];

export const VIP_LEVEL_RULES: VIPLevelRule[] = [
    {
        level: 0,
        requiredDeposit: 0,
        requiredBet: 0,
        rewards: [
            { label: '送銀幣', value: '5,000' },
            { label: '手續費減免', value: '0%' },
            { label: '月月收獎', value: '未開放' },
            { label: '發財金', value: '8,888' },
            { label: '登入禮', value: '每日 1,000' },
        ],
    },
    {
        level: 1,
        requiredDeposit: 5000,
        requiredBet: 120000,
        rewards: [
            { label: '送銀幣', value: '15,000' },
            { label: '手續費減免', value: '1%' },
            { label: '月月收獎', value: '每月 1 次' },
            { label: '發財金', value: '18,888' },
            { label: '登入禮', value: '每日 1,500' },
        ],
    },
    {
        level: 2,
        requiredDeposit: 12000,
        requiredBet: 350000,
        rewards: [
            { label: '送銀幣', value: '35,000' },
            { label: '手續費減免', value: '2%' },
            { label: '月月收獎', value: '每月 1 次' },
            { label: '發財金', value: '28,888' },
            { label: '登入禮', value: '每日 2,000' },
        ],
    },
    {
        level: 3,
        requiredDeposit: 25000,
        requiredBet: 800000,
        rewards: [
            { label: '送銀幣', value: '60,000' },
            { label: '手續費減免', value: '3%' },
            { label: '月月收獎', value: '每月 2 次' },
            { label: '發財金', value: '38,888' },
            { label: '登入禮', value: '每日 3,000' },
        ],
    },
    {
        level: 4,
        requiredDeposit: 45000,
        requiredBet: 1400000,
        rewards: [
            { label: '送銀幣', value: '90,000' },
            { label: '手續費減免', value: '4%' },
            { label: '月月收獎', value: '每月 2 次' },
            { label: '發財金', value: '58,888' },
            { label: '登入禮', value: '每日 4,000' },
        ],
    },
    {
        level: 5,
        requiredDeposit: 70000,
        requiredBet: 2100000,
        rewards: [
            { label: '送銀幣', value: '130,000' },
            { label: '手續費減免', value: '5%' },
            { label: '月月收獎', value: '每月 3 次' },
            { label: '發財金', value: '88,888' },
            { label: '登入禮', value: '每日 5,500' },
        ],
    },
    {
        level: 6,
        requiredDeposit: 105000,
        requiredBet: 3000000,
        rewards: [
            { label: '送銀幣', value: '180,000' },
            { label: '手續費減免', value: '6%' },
            { label: '月月收獎', value: '每月 3 次' },
            { label: '發財金', value: '128,888' },
            { label: '登入禮', value: '每日 7,000' },
        ],
    },
    {
        level: 7,
        requiredDeposit: 150000,
        requiredBet: 4200000,
        rewards: [
            { label: '送銀幣', value: '240,000' },
            { label: '手續費減免', value: '7%' },
            { label: '月月收獎', value: '每月 4 次' },
            { label: '發財金', value: '168,888' },
            { label: '登入禮', value: '每日 8,500' },
        ],
    },
    {
        level: 8,
        requiredDeposit: 210000,
        requiredBet: 5600000,
        rewards: [
            { label: '送銀幣', value: '320,000' },
            { label: '手續費減免', value: '8%' },
            { label: '月月收獎', value: '每月 4 次' },
            { label: '發財金', value: '228,888' },
            { label: '登入禮', value: '每日 10,000' },
        ],
    },
    {
        level: 9,
        requiredDeposit: 280000,
        requiredBet: 7300000,
        rewards: [
            { label: '送銀幣', value: '420,000' },
            { label: '手續費減免', value: '9%' },
            { label: '月月收獎', value: '每月 5 次' },
            { label: '發財金', value: '288,888' },
            { label: '登入禮', value: '每日 12,500' },
        ],
    },
    {
        level: 10,
        requiredDeposit: 360000,
        requiredBet: 9200000,
        rewards: [
            { label: '送銀幣', value: '550,000' },
            { label: '手續費減免', value: '10%' },
            { label: '月月收獎', value: '每月 6 次' },
            { label: '發財金', value: '388,888' },
            { label: '登入禮', value: '每日 15,000' },
        ],
    },
];

export const getMockPlayerProfile = (name: string): PlayerProfile => {
    // try to find in friends or online players for base data
    const isFriend = FRIENDS.some(f => f.name === name);
    const friendData = FRIENDS.find(f => f.name === name);
    const onlineData = ONLINE_PLAYERS.find(p => p.name === name);

    return {
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
