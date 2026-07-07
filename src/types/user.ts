// User related types

export interface Friend {
    id: number;
    playerId?: string;
    name: string;
    avatar: string;
    status: 'online' | 'playing' | 'offline';
    lastMsg: string;
    bio?: string;
    recentGames?: { id: number; name: string; image: string }[];
    isFriend?: boolean;
}

export interface OnlinePlayer {
    id: number;
    playerId?: string;
    name: string;
    avatar: string;
    level: number;
    bio?: string;
    recentGames?: { id: number; name: string; image: string }[];
    isFriend?: boolean;
}

export type FriendStatus = 'online' | 'playing' | 'offline';

export interface PlayerProfile {
    playerId: string;
    name: string;
    avatar: string;
    level: number;
    vipLevel?: number;
    bio: string;
    recentGames: { id: number; name: string; image: string }[];
    isFriend: boolean;
}

// Three-currency system
export type CurrencyType = 'gold' | 'silver' | 'bronze';

export interface CurrencyBalance {
    gold: number;
    silver: number;
    bronze: number;
}

// User statistics for profile display
export interface UserStats {
    totalWin: number;
    maxWin: number;
    dailyStreak: number;
}

// Achievement badge
export interface Achievement {
    id: number;
    title: string;
    description: string;
    icon: string; // emoji
    achieved: boolean;
    claimed: boolean;
    condition: string;
    reward: number;
}

// VIP privilege item
export interface VIPPrivilege {
    id: number;
    title: string;
    description: string;
    icon: string; // emoji
}

export interface VIPRewardItem {
    label: string;
    value: string;
}

export interface VIPTargetDetail {
    level: number;
    name: string;
    themeColor: string;
    rebate: string;
    feeDiscount: string;
    maintainRequirement: string;
    note: string;
}

export interface VIPLevelRule {
    level: number;
    requiredDeposit: number;
    requiredBet: number;
    rewards: VIPRewardItem[];
}
