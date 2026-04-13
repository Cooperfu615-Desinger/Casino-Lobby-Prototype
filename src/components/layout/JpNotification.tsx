import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';

// ── Mock data（原型固定 3 則，實際由後端提供）──────────────────────────────
const JP_EVENTS = [
    {
        player: '奧黛麗一本123456789',
        game: 'Lucky Tiger Rush',
        type: 'GRAND JACKPOT' as const,
        amount: '$50,000',
    },
    {
        player: 'Tom888',
        game: 'Gates of Olympus',
        type: 'MAJOR JACKPOT' as const,
        amount: '$12,800',
    },
    {
        player: '幸運女神777',
        game: "Dragon's Gold",
        type: 'MINI JACKPOT' as const,
        amount: '$3,200',
    },
];

const TYPE_STYLE = {
    'GRAND JACKPOT': {
        color: 'text-[#FFD700]',
        border: 'border-[#FFD700]/60',
        glow: 'shadow-[0_0_24px_rgba(255,215,0,0.35)]',
        badge: 'bg-[#FFD700]/15 text-[#FFD700]',
    },
    'MAJOR JACKPOT': {
        color: 'text-purple-400',
        border: 'border-purple-400/60',
        glow: 'shadow-[0_0_24px_rgba(168,85,247,0.35)]',
        badge: 'bg-purple-400/15 text-purple-400',
    },
    'MINI JACKPOT': {
        color: 'text-cyan-400',
        border: 'border-cyan-400/60',
        glow: 'shadow-[0_0_24px_rgba(34,211,238,0.35)]',
        badge: 'bg-cyan-400/15 text-cyan-400',
    },
} as const;

// ── Timing constants ───────────────────────────────────────────────────────
const INITIAL_DELAY_MS = 3000;  // 進入 Lobby 後 3 秒才顯示第一則
const VISIBLE_DURATION_MS = 2000;  // 每則顯示 2 秒
const BETWEEN_DELAY_MS = 5000;  // 消失後 5 秒再顯示下一則

const JpNotification = () => {
    const [index, setIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timers: ReturnType<typeof setTimeout>[] = [];

        const cycle = (i: number, delay: number) => {
            const showTimer = setTimeout(() => {
                setIndex(i);
                setIsVisible(true);

                const hideTimer = setTimeout(() => {
                    setIsVisible(false);

                    const nextTimer = setTimeout(() => {
                        cycle((i + 1) % JP_EVENTS.length, 0);
                    }, BETWEEN_DELAY_MS);

                    timers.push(nextTimer);
                }, VISIBLE_DURATION_MS);

                timers.push(hideTimer);
            }, delay);

            timers.push(showTimer);
        };

        cycle(0, INITIAL_DELAY_MS);

        return () => timers.forEach(clearTimeout);
    }, []);

    const event = JP_EVENTS[index];
    const style = TYPE_STYLE[event.type];

    return (
        <div
            className={`
                absolute top-[132px] right-4 z-[85] w-72
                transition-transform duration-500 ease-in-out
                ${isVisible ? 'translate-x-0' : 'translate-x-[120%]'}
            `}
        >
            <div className={`bg-[#1a0b2e]/95 backdrop-blur-md border ${style.border} rounded-2xl p-4 ${style.glow}`}>

                {/* Header row */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-[#FFD700]/10 flex-shrink-0">
                        <Trophy size={15} className="text-[#FFD700]" />
                    </div>
                    <span className="text-white/60 text-[10px] font-bold tracking-[0.25em] uppercase">
                        Jackpot Winner
                    </span>
                    {/* JP type badge */}
                    <span className={`ml-auto text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full ${style.badge}`}>
                        {event.type.replace(' JACKPOT', '')}
                    </span>
                </div>

                {/* Player name */}
                <p className="text-[#FFD700] font-bold text-sm truncate mb-0.5">
                    {event.player}
                </p>

                {/* Game name */}
                <p className="text-slate-400 text-xs truncate mb-3">
                    在 <span className="text-slate-300">{event.game}</span> 贏得
                </p>

                {/* Amount */}
                <p className={`text-2xl font-black tracking-wide ${style.color}`}>
                    {event.amount}
                </p>
            </div>
        </div>
    );
};

export default JpNotification;
