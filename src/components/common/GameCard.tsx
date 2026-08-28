import { Heart } from 'lucide-react';
import type { Game } from '../../types';
import JackpotTicker from './JackpotTicker';

interface GameCardProps {
    game: Game;
    onClick?: () => void;
    className?: string;
    compact?: boolean;
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
}

const GameCard = ({
    game,
    onClick,
    className,
    compact = false,
    isFavorite = false,
    onToggleFavorite,
}: GameCardProps) => {
    const isLarge = game.size === 'large';
    const categoryLabel = game.category === 'slot' ? 'Slot' : game.category === 'card' ? 'Card' : 'Fishing';

    // Size classes: Standard is fixed w/h, Large is wider and full height
    const sizeClasses = isLarge
        ? compact ? 'h-[316px] w-[250px]' : 'h-[376px] w-[280px]'
        : compact ? 'h-[150px] w-[160px]' : 'h-[180px] w-[180px]';

    return (
        <article
            className={`relative group ${sizeClasses} flex-shrink-0 transform transition-all hover:scale-[1.02] ${className || ''}`}
        >
            <button
                type="button"
                onClick={onClick}
                aria-label={`開啟 ${game.title}`}
                className="absolute inset-0 cursor-pointer rounded-xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a0b2e] active:scale-95"
            >
                {/* Jackpot Ticker */}
                {game.hasJackpot && <JackpotTicker />}

                {/* Card Frame (Glossy White Border) */}
                <div className="absolute inset-0 rounded-xl bg-white p-[3px] shadow-lg">
                    <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/30 to-transparent opacity-50"></div>
                </div>

                {/* Inner Content - Colors Only, No Icon */}
                <div className={`absolute inset-[3px] flex flex-col items-center justify-center overflow-hidden rounded-[9px] border border-black/50 ${game.image}`}>
                    {/* Glossy Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>

                    <div className="absolute left-3 top-3 flex items-center gap-2">
                        <div className="rounded-full border border-white/10 bg-black/45 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                            {categoryLabel}
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/35 text-lg backdrop-blur-sm">
                            {game.icon}
                        </div>
                    </div>

                    {game.isNew && (
                        <div className="absolute right-2.5 top-12 rounded-full border border-cyan-200/30 bg-cyan-400/90 px-2 py-0.5 text-[9px] font-black text-cyan-950 shadow-lg">
                            NEW
                        </div>
                    )}

                    <div className={`absolute bottom-0 left-0 right-0 bg-black/70 ${isLarge ? 'py-4' : compact ? 'py-2' : 'py-3'} px-2 backdrop-blur-[3px]`}>
                        <p className={`truncate text-center font-bold leading-tight tracking-wide text-white drop-shadow-md ${isLarge ? 'text-lg' : 'text-sm'}`}>
                            {game.title}
                        </p>
                        <div className="mt-1 flex items-center justify-center gap-2 text-[9px] font-bold text-white/55">
                            <span className="max-w-[90px] truncate">{game.provider}</span>
                            <span className="text-[#FFD700]">RTP {game.rtp}%</span>
                        </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className={`scale-0 rounded-full bg-[#FFD700] shadow-lg transition-transform duration-200 group-hover:scale-100 ${isLarge ? 'p-4' : 'p-3'}`}>
                            <span className={`font-bold text-black ${isLarge ? 'text-xl' : 'text-sm'}`}>PLAY</span>
                        </div>
                    </div>
                </div>
            </button>

            {onToggleFavorite && (
                <button
                    type="button"
                    onClick={onToggleFavorite}
                    aria-label={`${isFavorite ? '移除我的最愛' : '加入我的最愛'}：${game.title}`}
                    aria-pressed={isFavorite}
                    title={isFavorite ? '移除我的最愛' : '加入我的最愛'}
                    className={`absolute right-2.5 top-2.5 z-30 flex h-8 w-8 items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition-all hover:scale-110 active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] ${isFavorite
                        ? 'border-[#FFD700]/65 bg-[#FFD700] text-[#3a1600]'
                        : 'border-white/20 bg-black/45 text-white/75 hover:border-[#FFD700]/60 hover:text-[#FFD700]'
                        }`}
                >
                    <Heart size={15} className={isFavorite ? 'fill-current' : ''} />
                </button>
            )}
        </article>
    );
};

export default GameCard;
