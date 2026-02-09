// User related types

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

export type FriendStatus = 'online' | 'playing' | 'offline';

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
