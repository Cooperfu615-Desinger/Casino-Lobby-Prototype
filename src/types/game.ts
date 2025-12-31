// Game related types

export interface Game {
    id: number;
    title: string;
    category: 'card' | 'slot' | 'fish';
    image: string;
    icon: string;
    size?: 'standard' | 'large';
    hasJackpot?: boolean;
}

export type GameCategory = 'card' | 'slot' | 'fish';
