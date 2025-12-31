// Club related types

export interface ClubRewardItem {
    id: number;
    title: string;
    cost: number;
    icon: any;
    type: 'Bonus' | 'Cash' | 'Frame' | 'Prop';
    stock?: number;
}

export interface UserClubStats {
    currentPoints: number;
    totalContribution: number;
}

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

export interface EventTemplate {
    id: string;
    name: string;
}

export type ClubRewardType = 'Bonus' | 'Cash' | 'Frame' | 'Prop';
export type ClubEventStatus = 'active' | 'upcoming' | 'ended';
