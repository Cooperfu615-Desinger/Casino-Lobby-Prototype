import type { GameWalletKey } from './gameWallet';

export type LobbyCategoryId =
    | 'all'
    | 'event'
    | 'slots'
    | 'board'
    | 'arcade'
    | 'live'
    | 'crash'
    | 'fishing'
    | 'lottery';

export type LobbyFilterSection = 'favorites' | 'category' | 'currency' | 'provider';
export type GameCurrencyFilter = 'all' | GameWalletKey;

export interface LobbyGameFilters {
    favoritesOnly: boolean;
    category: LobbyCategoryId;
    currency: GameCurrencyFilter;
    provider: string;
}

export const DEFAULT_LOBBY_GAME_FILTERS: LobbyGameFilters = {
    favoritesOnly: false,
    category: 'all',
    currency: 'all',
    provider: 'all',
};
