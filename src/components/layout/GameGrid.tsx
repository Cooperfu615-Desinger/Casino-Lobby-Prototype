import { useMemo } from 'react';
import { ChevronLeft, ChevronRight, Heart, SearchX } from 'lucide-react';
import GameCard from '../common/GameCard';
import { GAMES } from '../../data/mockData';
import type { Game, LobbyGameFilters } from '../../types';
import { filterGamesByLobbyFilters } from '../../utils/gameFilters';

interface GameGridProps {
    onPlayGame: (game: Game) => void;
    filters: LobbyGameFilters;
    favoriteGameIds: number[];
    onToggleFavorite: (gameId: number) => void;
}

const GameGrid = ({
    onPlayGame,
    filters,
    favoriteGameIds,
    onToggleFavorite,
}: GameGridProps) => {
    const filteredGames = useMemo(
        () => filterGamesByLobbyFilters(GAMES, filters, favoriteGameIds),
        [favoriteGameIds, filters],
    );

    return (
        <main className="lobby-game-grid absolute bottom-[90px] left-0 right-0 top-[130px] z-10 flex flex-col overflow-hidden px-12 transition-all duration-300 no-scrollbar">
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
                                : <SearchX size={24} />}
                        </div>
                        <h3 className="mb-2 text-xl font-black text-white">
                            {filters.favoritesOnly && favoriteGameIds.length === 0
                                ? '尚無我的最愛'
                                : '找不到符合條件的遊戲'}
                        </h3>
                        <p className="text-sm leading-relaxed text-slate-400">
                            {filters.favoritesOnly && favoriteGameIds.length === 0
                                ? '點擊遊戲卡右上角愛心，即可建立你的收藏清單。'
                                : '請調整左側篩選條件後再試一次。'}
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
