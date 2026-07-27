import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock3, Heart, Search, SearchX, SlidersHorizontal, X } from 'lucide-react';
import GameCard from '../common/GameCard';
import { GAMES } from '../../data/mockData';
import type { Game, LobbyGameFilters } from '../../types';
import { filterGamesByLobbyFilters } from '../../utils/gameFilters';

interface GameGridProps {
    onPlayGame: (game: Game) => void;
    filters: LobbyGameFilters;
    recentGameIds: number[];
    favoriteGameIds: number[];
    onToggleFavorite: (gameId: number) => void;
}

type SortMode = 'hot' | 'az' | 'za' | 'latest';

const GameGrid = ({
    onPlayGame,
    filters,
    recentGameIds,
    favoriteGameIds,
    onToggleFavorite,
}: GameGridProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortMode, setSortMode] = useState<SortMode>('hot');
    const [showRecentOnly, setShowRecentOnly] = useState(false);

    const filteredGames = useMemo(() => {
        const lobbyFilteredGames = filterGamesByLobbyFilters(GAMES, filters, favoriteGameIds);
        const normalizedQuery = searchQuery.trim().toLowerCase();
        const recentOrder = new Map(recentGameIds.map((id, index) => [id, index]));
        const result = lobbyFilteredGames.filter((game) => {
            if (showRecentOnly && !recentOrder.has(game.id)) return false;
            if (!normalizedQuery) return true;
            return [game.title, game.description, game.provider]
                .some((value) => value.toLowerCase().includes(normalizedQuery));
        });

        if (showRecentOnly) {
            return result.sort((a, b) => (recentOrder.get(a.id) ?? 99) - (recentOrder.get(b.id) ?? 99));
        }
        if (sortMode === 'az') return result.sort((a, b) => a.title.localeCompare(b.title));
        if (sortMode === 'za') return result.sort((a, b) => b.title.localeCompare(a.title));
        if (sortMode === 'latest') return result.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)) || b.id - a.id);
        return result.sort((a, b) => Number(Boolean(b.hasJackpot)) - Number(Boolean(a.hasJackpot)) || a.id - b.id);
    }, [favoriteGameIds, filters, recentGameIds, searchQuery, showRecentOnly, sortMode]);

    return (
        <main className="absolute bottom-[90px] left-0 right-0 top-[130px] flex flex-col overflow-hidden px-12 transition-all duration-300 no-scrollbar">
            <section className="relative z-20 mt-2 rounded-2xl border border-white/10 bg-[#10051f]/88 px-3 py-2.5 shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                <div className="flex items-center gap-2">
                    <div className="relative min-w-0 flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="搜尋遊戲、玩法或廠商"
                            className="h-9 w-full rounded-xl border border-white/10 bg-black/25 pl-9 pr-9 text-xs font-bold text-white outline-none transition-colors placeholder:text-slate-600 focus:border-[#FFD700]/60"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                aria-label="清除搜尋"
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowRecentOnly((current) => !current)}
                        aria-pressed={showRecentOnly}
                        className={`flex h-9 shrink-0 items-center gap-2 rounded-xl border px-3 text-xs font-black transition-all ${showRecentOnly
                            ? 'border-[#FFD700]/50 bg-[#FFD700] text-black'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        <Clock3 size={14} />
                        最近遊戲
                        <span className={`rounded-full px-1.5 py-0.5 text-[9px] ${showRecentOnly ? 'bg-black/15' : 'bg-white/10'}`}>{recentGameIds.length}</span>
                    </button>

                    <label className="relative flex h-9 shrink-0 items-center rounded-xl border border-white/10 bg-white/5 pl-3 text-slate-400">
                        <SlidersHorizontal size={14} />
                        <select
                            value={sortMode}
                            onChange={(event) => setSortMode(event.target.value as SortMode)}
                            disabled={showRecentOnly}
                            aria-label="遊戲排序"
                            className="h-full appearance-none bg-transparent px-2 pr-7 text-xs font-black text-white outline-none disabled:text-slate-500"
                        >
                            <option value="hot">熱門優先</option>
                            <option value="latest">最新優先</option>
                            <option value="az">名稱 A–Z</option>
                            <option value="za">名稱 Z–A</option>
                        </select>
                        <ChevronRight className="pointer-events-none absolute right-2 rotate-90" size={12} />
                    </label>
                    <span className="flex h-9 min-w-14 shrink-0 items-center justify-center rounded-xl border border-[#FFD700]/20 bg-[#FFD700]/8 px-3 text-[10px] font-black text-[#FFD700]">
                        {filteredGames.length} 款
                    </span>
                </div>
            </section>

            <div className="relative flex min-h-0 flex-1 items-center">
                <div className="absolute left-4 top-1/2 z-20 -translate-y-1/2 animate-pulse">
                    <ChevronLeft className="text-white/40 drop-shadow-lg" size={48} />
                </div>

                {filteredGames.length > 0 ? (
                    <div className="grid h-full w-full auto-cols-max grid-flow-col grid-rows-[150px_150px] content-center gap-4 overflow-x-auto px-8 py-3 no-scrollbar">
                        {filteredGames.map((game) => (
                            <GameCard
                                key={game.id}
                                game={game}
                                onClick={() => onPlayGame(game)}
                                className={game.size === 'large' ? 'row-span-2' : ''}
                                compact
                                isFavorite={favoriteGameIds.includes(game.id)}
                                onToggleFavorite={() => onToggleFavorite(game.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="mx-auto w-full max-w-xl rounded-[28px] border border-dashed border-white/15 bg-black/20 p-8 text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-400">
                            {filters.favoritesOnly
                                ? <Heart size={24} className="fill-current text-[#FFD700]" />
                                : showRecentOnly
                                    ? <Clock3 size={24} />
                                    : <SearchX size={24} />}
                        </div>
                        <h3 className="mb-2 text-xl font-black text-white">
                            {filters.favoritesOnly && favoriteGameIds.length === 0
                                ? '尚無我的最愛'
                                : showRecentOnly && recentGameIds.length === 0
                                    ? '尚無最近遊戲'
                                    : '找不到符合條件的遊戲'}
                        </h3>
                        <p className="text-sm leading-relaxed text-slate-400">
                            {filters.favoritesOnly && favoriteGameIds.length === 0
                                ? '點擊遊戲卡右上角愛心，即可建立你的收藏清單。'
                                : showRecentOnly && recentGameIds.length === 0
                                ? '開啟任一遊戲後，便會顯示在最近遊戲清單。'
                                : '請調整搜尋、最近遊戲或左側篩選條件後再試一次。'}
                        </p>
                    </div>
                )}

                <div className="absolute right-4 top-1/2 z-20 -translate-y-1/2 animate-pulse">
                    <ChevronRight className="text-white/40 drop-shadow-lg" size={48} />
                </div>
            </div>
        </main>
    );
};

export default GameGrid;
