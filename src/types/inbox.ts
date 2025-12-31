// Inbox related types

export interface InboxAttachment {
    type: 'coins' | 'item' | 'bonus';
    label: string;
    amount: string;
}

export interface InboxMessage {
    id: number;
    type: 'system' | 'promo' | 'personal';
    title: string;
    date: string;
    content: string;
    read: boolean;
    /** Optional attachment for claimable rewards */
    attachment?: InboxAttachment;
}

export type InboxMessageType = 'system' | 'promo' | 'personal';

