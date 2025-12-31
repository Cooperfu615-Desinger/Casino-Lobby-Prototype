// Chat related types

export interface ChatMessage {
    id: number;
    sender: string;
    text: string;
    isMe: boolean;
    time: string;
    isSystem?: boolean;
}

export interface ClubChatMessage {
    id: number;
    sender: string;
    text: string;
    isMe: boolean;
    time: string;
    role: 'member' | 'leader' | 'admin';
}

export type ClubRole = 'member' | 'leader' | 'admin';
