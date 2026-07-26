import type { Game } from './game';

export type GameWalletKey =
    | 'stored-gold'
    | 'activity-gold'
    | 'stored-silver'
    | 'activity-silver'
    | 'bronze';

export interface GameSession {
    game: Game;
    wallet: GameWalletKey;
}

export interface GameWalletOption {
    key: GameWalletKey;
    label: string;
    shortLabel: string;
    balance: number;
    tone: 'gold' | 'silver' | 'bronze';
    isActivity: boolean;
    enabled: boolean;
    unavailableReason?: string;
}
