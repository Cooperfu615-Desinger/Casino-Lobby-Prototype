import { ChevronLeft, ChevronRight } from 'lucide-react';
import GameCard from '../common/GameCard';
import { GAMES } from '../../data/mockData';
import type { Game } from '../../types';

interface GameGridProps {
    onPlayGame: (game: Game) => void;
}

const GameGrid = ({ onPlayGame }: GameGridProps) => {
    return (
        <main className="absolute top-[130px] bottom-[90px] left-0 right-0 overflow-x-auto overflow-y-hidden flex items-center px-12 no-scrollbar">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 animate-pulse">
                <ChevronLeft className="text-white/40 drop-shadow-lg" size={48} />
            </div>
            <div className="grid grid-rows-[180px_180px] grid-flow-col gap-4 py-4 px-8 overflow-x-auto no-scrollbar w-full h-full content-center pt-8 auto-cols-max">
                {GAMES.map(game => (
                    <GameCard
                        key={game.id}
                        game={game}
                        onClick={() => onPlayGame(game)}
                        className={`${game.size === 'large' ? 'row-span-2' : ''}`}
                    />
                ))}
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 animate-pulse">
                <ChevronRight className="text-white/40 drop-shadow-lg" size={48} />
            </div>
        </main>
    );
};

export default GameGrid;
