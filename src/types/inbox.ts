// Inbox related types

export interface InboxMessage {
    id: number;
    type: 'system' | 'promo' | 'personal';
    title: string;
    date: string;
    content: string;
    read: boolean;
}

export type InboxMessageType = 'system' | 'promo' | 'personal';
