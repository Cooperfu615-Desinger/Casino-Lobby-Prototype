import { ChevronLeft, ChevronRight } from 'lucide-react';
import GameCard from '../common/GameCard';
import { GAMES } from '../../data/mockData';
import type { Game } from '../../types';
import { LOBBY_CATEGORIES, type LobbyCategoryId } from './CategorySidebar';

interface GameGridProps {
    onPlayGame: (game: Game) => void;
    activeCategory: LobbyCategoryId;
}

const ACTIVE_EVENT_GAME_IDS = new Set([2, 5, 8, 10, 14, 21]);

const GameGrid = ({ onPlayGame, activeCategory }: GameGridProps) => {
    const selectedCategory = LOBBY_CATEGORIES.find((category) => category.id === activeCategory) ?? LOBBY_CATEGORIES[0];
    const filteredGames = activeCategory === 'all'
        ? GAMES
        : activeCategory === 'event'
            ? GAMES.filter((game) => ACTIVE_EVENT_GAME_IDS.has(game.id))
            : selectedCategory.gameCategory
                ? GAMES.filter((game) => game.category === selectedCategory.gameCategory)
                : [];

    return (
        <main className="absolute top-[130px] bottom-[90px] left-0 right-0 transition-all duration-300 overflow-hidden flex flex-col px-12 no-scrollbar">
            <div className="relative flex-1 flex items-center">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 animate-pulse">
                    <ChevronLeft className="text-white/40 drop-shadow-lg" size={48} />
                </div>

                {filteredGames.length > 0 ? (
                    <div className="grid grid-rows-[180px_180px] grid-flow-col gap-4 py-4 px-8 overflow-x-auto no-scrollbar w-full h-full content-center auto-cols-max">
                        {filteredGames.map(game => (
                            <GameCard
                                key={game.id}
                                game={game}
                                onClick={() => onPlayGame(game)}
                                className={`${game.size === 'large' ? 'row-span-2' : ''}`}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="mx-auto w-full max-w-xl rounded-[28px] border border-dashed border-white/15 bg-black/20 p-10 text-center">
                        <div className="text-5xl mb-4">{selectedCategory.icon}</div>
                        <h3 className="text-2xl font-black text-white mb-3">{selectedCategory.label}</h3>
                        <p className="text-slate-300 leading-relaxed">
                            這個分類目前先作為功能與版位預留，方便美術規劃分類識別、前端安排資料結構與後台映射。
                        </p>
                        <div className="mt-5 inline-flex rounded-full bg-[#FFD700]/10 px-4 py-2 text-sm font-bold text-[#FFD700]">
                            Phase 2 Content Placeholder
                        </div>
                    </div>
                )}

                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 animate-pulse">
                    <ChevronRight className="text-white/40 drop-shadow-lg" size={48} />
                </div>
            </div>
        </main>
    );
};

export default GameGrid;
