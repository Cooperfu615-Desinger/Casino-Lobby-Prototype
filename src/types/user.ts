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
