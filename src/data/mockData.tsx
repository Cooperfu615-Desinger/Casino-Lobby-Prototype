import React from 'react';
import { Flame, Swords, Crown, Coins, Wrench, Star } from 'lucide-react';

// --- Types ---
export interface Game {
    id: number;
    title: string;
    category: 'card' | 'slot' | 'fish';
    image: string;
    icon: string;
    size?: 'standard' | 'large';
    hasJackpot?: boolean;
}

export interface Friend {
    id: number;
    name: string;
    avatar: string;
    status: 'online' | 'playing' | 'offline';
    lastMsg: string;
}

export interface OnlinePlayer {
    id: number;
    name: string;
    avatar: string;
    level: number;
}

export interface ChatMessage {
    id: number;
    sender: string;
    text: string;
    isMe: boolean;
    time: string;
    isSystem?: boolean;
}

export interface Package {
    id: number;
    coins: string;
    price: string;
    bonus: string | null;
    best?: boolean;
}

export interface SalePackage {
    id: number;
    title: string;
    coins: string;
    price: string;
    original: string;
    tag: string;
}

export interface EventItem {
    id: number;
    type: 'sale' | 'tournament' | 'vip';
    title: string;
    desc: string;
    icon: React.ReactNode;
    bg: string;
    border: string;
}

export interface InboxMessage {
    id: number;
    type: 'system' | 'promo' | 'personal';
    title: string;
    date: string;
    content: string;
    read: boolean;
}

export interface GiftItem {
    id: number;
    title: string;
    amount: string;
    icon: React.ReactNode;
    expire: string;
    claimed: boolean;
}

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
    // New additions (id 13-22)
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

export const EVENTS_LIST: EventItem[] = [
    { id: 1, type: 'sale', title: '限時儲值優惠', desc: '全場 200% 回饋，僅剩 3 小時！', icon: <Flame className="text-red-500" />, bg: 'from-red-900/50 to- orange - 900 / 50', border: 'border - red - 500 / 50' },
    { id: 2, type: 'tournament', title: '雷神之錘爭霸戰', desc: '總獎金 10,000,000 金幣，即刻開戰！', icon: <Swords className="text-yellow-400" />, bg: 'from-yellow-900/50 to- amber - 900 / 50', border: 'border - yellow - 500 / 50' },
    { id: 3, type: 'vip', title: 'VIP 尊榮升級', desc: '升級 VIP 5 即可獲得專屬經理服務。', icon: <Crown className="text-purple-400" />, bg: 'from-purple-900/50 to- indigo - 900 / 50', border: 'border - purple - 500 / 50' },
];

export const INBOX_MESSAGES: InboxMessage[] = [
    { id: 1, type: 'system', title: '【系統公告】伺服器維護通知', date: '2025-10-30', content: '親愛的玩家您好：\n\n為了提供更優質的遊戲體驗，我們將於 2025/11/01 03:00 (GMT+8) 進行例行性維護，預計維護時間為 2 小時。維護期間將無法登入遊戲，造成不便敬請見諒。\n\n維護補償將於開機後發送至您的信箱。\n\nGolden Bet 營運團隊 敬上', read: false },
    { id: 2, type: 'promo', title: '🔥 週末狂歡！儲值回饋 200%', date: '2025-10-29', content: '週末限定活動開跑！\n\n凡於本週六、日進行儲值，即可享有 200% 的金幣回饋！\n機會難得，錯過不再！快去商店查看詳情吧！', read: true },
    { id: 3, type: 'system', title: '恭喜晉升 VIP 7！', date: '2025-10-25', content: '恭喜您！\n\n您已成功晉升為 VIP 7 會員。現在您可以享受更高的返水比例與專屬客戶經理服務。\n\n我們已發送一份晉升禮包到您的「禮物中心」，請記得去領取喔！', read: true },
    { id: 4, type: 'personal', title: '好友邀請通知', date: '2025-10-20', content: '玩家 Tom888 邀請您加入「贏家俱樂部」公會。', read: true },
];

export const GIFT_ITEMS: GiftItem[] = [
    { id: 1, title: '每日登入獎勵', amount: '10,000 金幣', icon: <Coins className="text-[#FFD700]" size={40} />, expire: '23小時後過期', claimed: false },
    { id: 2, title: 'VIP 7 晉升禮包', amount: '1,000,000 金幣', icon: <Crown className="text-purple-400" size={40} />, expire: '永久有效', claimed: false },
    { id: 3, title: '維護補償', amount: '50,000 金幣', icon: <Wrench className="text-slate-400" size={40} />, expire: '6天後過期', claimed: true },
    { id: 4, title: '新手幸運符', amount: '幸運加成 x3', icon: <Star className="text-yellow-300" size={40} />, expire: '2天後過期', claimed: false },
];

export interface Transaction {
    id: string;
    date: string;
    type: 'Deposit' | 'Withdraw';
    amount: string;
    status: 'Success' | 'Pending';
    method: 'Apple Pay' | 'Credit Card' | 'PayPal' | 'App Store';
}

export const TRANSACTION_HISTORY: Transaction[] = [
    { id: 'TX-20251224-001', date: '2025-12-24 19:30', type: 'Deposit', amount: '.99', status: 'Success', method: 'Apple Pay' },
    { id: 'TX-20251224-002', date: '2025-12-24 15:15', type: 'Deposit', amount: '.99', status: 'Pending', method: 'Credit Card' },
    { id: 'TX-20251223-003', date: '2025-12-23 21:00', type: 'Withdraw', amount: '.00', status: 'Success', method: 'PayPal' },
    { id: 'TX-20251222-004', date: '2025-12-22 10:05', type: 'Deposit', amount: '.99', status: 'Success', method: 'Apple Pay' },
    { id: 'TX-20251220-005', date: '2025-12-20 09:30', type: 'Deposit', amount: '.99', status: 'Success', method: 'App Store' },
    { id: 'TX-20251219-006', date: '2025-12-19 18:45', type: 'Deposit', amount: '.99', status: 'Success', method: 'Apple Pay' },
    { id: 'TX-20251218-007', date: '2025-12-18 14:20', type: 'Deposit', amount: '.99', status: 'Success', method: 'Credit Card' },
    { id: 'TX-20251215-008', date: '2025-12-15 08:00', type: 'Deposit', amount: '.99', status: 'Success', method: 'App Store' },
];

export interface ClubChatMessage {
    id: number;
    sender: string;
    text: string;
    isMe: boolean;
    time: string;
    role: 'member' | 'leader' | 'admin';
}

export const CLUB_CHAT_HISTORY: ClubChatMessage[] = [
    { id: 1, sender: 'GodOfGamblers', text: '各位戰友早安！昨晚戰績不錯喔！', isMe: false, time: '09:00', role: 'leader' },
    { id: 2, sender: 'DragonSlayer', text: '會長早，今天晚上打公會戰嗎？', isMe: false, time: '09:05', role: 'admin' },
    { id: 3, sender: 'Me', text: '大家早！昨天我在雷神贏了5000倍！', isMe: true, time: '09:10', role: 'member' },
    { id: 4, sender: 'GodOfGamblers', text: '太強了吧！截圖發到群組給大家沾沾喜氣', isMe: false, time: '09:12', role: 'leader' },
    { id: 5, sender: 'SlotQueen', text: '恭喜恭喜！分紅分紅 😂', isMe: false, time: '09:15', role: 'member' },
    { id: 6, sender: 'Me', text: '沒問題，等等發紅包 🧧', isMe: true, time: '09:16', role: 'member' },
    { id: 7, sender: 'RichMan99', text: '坐等紅包', isMe: false, time: '09:18', role: 'member' },
];

export interface ClubRewardItem {
    id: number;
    title: string;
    cost: number;
    icon: any; // We will use generic render or handle in component
    type: 'Bonus' | 'Cash' | 'Frame' | 'Prop';
    stock?: number;
}

export const CLUB_REWARDS_ITEMS: ClubRewardItem[] = [
    { id: 1, title: '50 Free Spins', cost: 1000, icon: 'Spin', type: 'Bonus' },
    { id: 2, title: ' Bonus Cash', cost: 2500, icon: 'Cash', type: 'Cash' },
    { id: 3, title: '俱樂部專屬頭像框', cost: 5000, icon: 'Frame', type: 'Frame' },
    { id: 4, title: '2小時 雙倍經驗卡', cost: 800, icon: 'Exp', type: 'Prop', stock: 5 },
    { id: 5, title: ' Bonus Cash', cost: 10000, icon: 'Cash', type: 'Cash' },
    { id: 6, title: '限量傳奇徽章', cost: 50000, icon: 'Badge', type: 'Frame', stock: 1 },
];

export interface UserClubStats {
    currentPoints: number;
    totalContribution: number;
}

export const USER_CLUB_STATS: UserClubStats = {
    currentPoints: 3450,
    totalContribution: 15000
};

export interface ClubEvent {
    id: number;
    title: string;
    prizePool: number;
    status: 'active' | 'upcoming' | 'ended';
    timeLeft: string;
    participants: number;
    description: string;
    leaderboard: { name: string; score: number; rank: number }[];
}

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
