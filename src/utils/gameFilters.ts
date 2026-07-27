import type {
    Game,
    GameCurrencyFilter,
    GameWalletKey,
    LobbyCategoryId,
    LobbyGameFilters,
} from '../types';

export const ACTIVE_EVENT_GAME_IDS = new Set([2, 5, 8, 10, 14, 21]);

export const GAME_CURRENCY_OPTIONS: Array<{
    key: GameCurrencyFilter;
    label: string;
    shortLabel: string;
}> = [
    { key: 'all', label: '全部幣別', shortLabel: '全部' },
    { key: 'stored-gold', label: '金幣', shortLabel: '金幣' },
    { key: 'stored-silver', label: '銀幣', shortLabel: '銀幣' },
    { key: 'activity-gold', label: '活動金幣', shortLabel: '活動金' },
    { key: 'activity-silver', label: '活動銀幣', shortLabel: '活動銀' },
    { key: 'bronze', label: '銅幣', shortLabel: '銅幣' },
];

export const matchesLobbyCategory = (game: Game, category: LobbyCategoryId) => {
    if (category === 'all') return true;
    if (category === 'event') return ACTIVE_EVENT_GAME_IDS.has(game.id);
    if (category === 'slots') return game.category === 'slot';
    if (category === 'board') return game.category === 'card';
    if (category === 'fishing') return game.category === 'fish';
    return false;
};

export const filterGamesByLobbyFilters = (
    games: Game[],
    filters: LobbyGameFilters,
    favoriteGameIds: number[],
) => {
    const favorites = new Set(favoriteGameIds);
    return games.filter((game) => {
        if (filters.favoritesOnly && !favorites.has(game.id)) return false;
        if (!matchesLobbyCategory(game, filters.category)) return false;
        if (filters.provider !== 'all' && game.provider !== filters.provider) return false;
        if (filters.currency !== 'all' && !game.supportedWallets.includes(filters.currency)) return false;
        return true;
    });
};

export const countGamesByCategory = (games: Game[], category: LobbyCategoryId) =>
    games.filter((game) => matchesLobbyCategory(game, category)).length;

export const countGamesByWallet = (games: Game[], wallet: GameWalletKey) =>
    games.filter((game) => game.supportedWallets.includes(wallet)).length;
