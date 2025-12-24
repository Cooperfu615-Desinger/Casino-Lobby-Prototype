import { Game } from '../data/mockData';

interface GameCardProps {
    game: Game;
}

const GameCard = ({ game }: GameCardProps) => (
    <div className="relative group w-[180px] h-[180px] flex-shrink-0 cursor-pointer transform transition-all hover:scale-105 active:scale-95">
        {/* Card Frame (Glossy Gold Border) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700] via-[#B8860B] to-[#8B4513] rounded-xl p-[3px] shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-50 rounded-xl pointer-events-none"></div>
        </div>

        {/* Inner Content - Colors Only, No Icon */}
        <div className={`absolute inset-[3px] rounded-[9px] ${game.image} flex flex-col items-center justify-center overflow-hidden border border-black/50`}>
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>

            <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-3 px-1 backdrop-blur-[2px]">
                <p className="text-white text-sm text-center font-bold truncate leading-tight tracking-wide drop-shadow-md">
                    {game.title}
                </p>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-[#FFD700] rounded-full p-3 shadow-lg scale-0 group-hover:scale-100 transition-transform duration-200">
                    <span className="text-black font-bold text-sm">PLAY</span>
                </div>
            </div>
        </div>
    </div>
);

export default GameCard;
