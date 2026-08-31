// User related types

export interface Friend {
    id: number;
    playerId?: string;
    account: string;
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
    account: string;
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
    account: string;
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

export type VIPBindingRequirement = 'none' | 'phone' | 'email' | 'phone_email';
export type VIPRewardCurrency = 'bronze' | 'silver' | null;

export interface VIPLevelRule {
    level: number;
    name: string;
    accentColor: string;
    upgradeLifetimeDeposit: number | null;
    upgradeMonthlyBet: number | null;
    upgradeBinding: VIPBindingRequirement;
    retentionEnabled: boolean;
    retentionMonthlyDeposit: number | null;
    retentionMonthlyBet: number | null;
    retentionActiveDays: number | null;
    rewardCurrency: VIPRewardCurrency;
    rewardAmount: number | null;
    p2pGiftFeeRate: number;
}
