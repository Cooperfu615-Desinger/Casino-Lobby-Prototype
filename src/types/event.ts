import React from 'react';
// Event related types

export interface EventItem {
    id: number;
    type: 'sale' | 'tournament' | 'vip';
    title: string;
    desc: string;
    prize: string;
    details: string;
    icon: React.ReactNode;
    bg: string;
    border: string;
    startTime: string;
    endTime: string;
    status: 'upcoming' | 'active' | 'ending' | 'ended';
}

export type EventType = 'sale' | 'tournament' | 'vip';
export type EventStatus = 'upcoming' | 'active' | 'ending' | 'ended';
