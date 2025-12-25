import { Game } from '../data/mockData';
import JackpotTicker from './JackpotTicker';

interface GameCardProps {
    game: Game;
    onClick?: () => void;
    className?: string; // Add className prop for external grid positioning
}

const GameCard = ({ game, onClick, className }: GameCardProps) => {
    const isLarge = game.size === 'large';

    // Size classes: Standard is fixed w/h, Large is wider and full height
    const sizeClasses = isLarge
        ? "w-[300px] h-full"
        : "w-[200px] h-[200px]";

    return (
        <div
            onClick={onClick}
            className={`relative group ${sizeClasses} flex-shrink-0 cursor-pointer transform transition-all hover:scale-[1.02] active:scale-95 ${className || ''}`}
        >
            {/* Jackpot Ticker */}
            {game.hasJackpot && <JackpotTicker />}

            {/* Card Frame (Glossy Gold Border) */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700] via-[#B8860B] to-[#8B4513] rounded-xl p-[3px] shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-50 rounded-xl pointer-events-none"></div>
            </div>

            {/* Inner Content - Colors Only, No Icon */}
            <div className={`absolute inset-[3px] rounded-[9px] ${game.image} flex flex-col items-center justify-center overflow-hidden border border-black/50`}>
                {/* Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>

                <div className={`absolute bottom-0 left-0 right-0 bg-black/60 ${isLarge ? 'py-4' : 'py-3'} px-2 backdrop-blur-[2px]`}>
                    <p className={`text-white text-center font-bold truncate leading-tight tracking-wide drop-shadow-md ${isLarge ? 'text-lg' : 'text-sm'}`}>
                        {game.title}
                    </p>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                    <div className={`bg-[#FFD700] rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform duration-200 ${isLarge ? 'p-4' : 'p-3'}`}>
                        <span className={`text-black font-bold ${isLarge ? 'text-xl' : 'text-sm'}`}>PLAY</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameCard;
