import React from 'react';

// Event related types

export interface EventItem {
    id: number;
    type: 'sale' | 'tournament' | 'vip';
    title: string;
    desc: string;
    icon: React.ReactNode;
    bg: string;
    border: string;
    startTime: string;
    endTime: string;
    status: 'upcoming' | 'active' | 'ending';
}

export interface GiftItem {
    id: number;
    title: string;
    amount: string;
    icon: React.ReactNode;
    expire: string;
    claimed: boolean;
}

export type EventType = 'sale' | 'tournament' | 'vip';
export type EventStatus = 'upcoming' | 'active' | 'ending';
