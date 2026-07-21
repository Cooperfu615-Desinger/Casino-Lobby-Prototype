import { useEffect, useState } from 'react';
import { Crown } from 'lucide-react';

export type LeaderboardType = 'multiplier' | 'win' | 'rich';

interface LeaderboardEntry {
    rank: number;
    name: string;
    amount: string;
    game: string;
    time?: string;
}

const LEADERBOARD_DATA: Record<LeaderboardType, LeaderboardEntry[]> = {
    multiplier: [
        { rank: 1, name: '玩家***龍', amount: '×2,560 倍', game: '水果老虎機', time: '5 分鐘前' },
        { rank: 2, name: '玩家***鳳', amount: '×1,888 倍', game: 'Lucky Tiger Rush', time: '2 小時前' },
        { rank: 3, name: '玩家***虎', amount: '×1,280 倍', game: 'Shark Hunter', time: '4 小時前' },
        { rank: 4, name: '玩家***風', amount: '×1,100 倍', game: '老虎機' },
        { rank: 5, name: '玩家***雲', amount: '×1,000 倍', game: '捕魚機' },
        { rank: 6, name: '玩家***雷', amount: '×900 倍', game: '老虎機' },
        { rank: 7, name: '玩家***電', amount: '×800 倍', game: '棋牌' },
        { rank: 8, name: '玩家***水', amount: '×700 倍', game: '老虎機' },
        { rank: 9, name: '玩家***火', amount: '×600 倍', game: '捕魚機' },
        { rank: 10, name: '玩家***土', amount: '×500 倍', game: '老虎機' },
    ],
    win: [
        { rank: 1, name: '玩家***旺', amount: '2,580,000 分', game: '老虎機', time: '最近活躍' },
        { rank: 2, name: '玩家***福', amount: '1,820,000 分', game: '棋牌', time: '3 小時前' },
        { rank: 3, name: '玩家***星', amount: '960,000 分', game: '老虎機', time: '1 天前' },
        { rank: 4, name: '玩家***財', amount: '800,000 分', game: '老虎機' },
        { rank: 5, name: '玩家***祿', amount: '720,000 分', game: '棋牌' },
        { rank: 6, name: '玩家***壽', amount: '640,000 分', game: '捕魚機' },
        { rank: 7, name: '玩家***喜', amount: '560,000 分', game: '老虎機' },
        { rank: 8, name: '玩家***吉', amount: '480,000 分', game: '棋牌' },
        { rank: 9, name: '玩家***順', amount: '400,000 分', game: '老虎機' },
        { rank: 10, name: '玩家***發', amount: '320,000 分', game: '捕魚機' },
    ],
    rich: [
        { rank: 1, name: '玩家***王', amount: '128,800,000 金幣', game: '總資產', time: '最近活躍' },
        { rank: 2, name: '玩家***侯', amount: '96,600,000 金幣', game: '總資產', time: '1 小時前' },
        { rank: 3, name: '玩家***將', amount: '78,300,000 金幣', game: '總資產', time: '3 小時前' },
        { rank: 4, name: '玩家***相', amount: '65,200,000 金幣', game: '總資產' },
        { rank: 5, name: '玩家***士', amount: '54,900,000 金幣', game: '總資產' },
        { rank: 6, name: '玩家***兵', amount: '46,600,000 金幣', game: '總資產' },
        { rank: 7, name: '玩家***車', amount: '39,300,000 金幣', game: '總資產' },
        { rank: 8, name: '玩家***馬', amount: '34,000,000 金幣', game: '總資產' },
        { rank: 9, name: '玩家***砲', amount: '29,700,000 金幣', game: '總資產' },
        { rank: 10, name: '玩家***卒', amount: '24,400,000 金幣', game: '總資產' },
    ],
};

const LeaderboardPanel = ({ type }: { type: LeaderboardType }) => {
    const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0);
    const entries = LEADERBOARD_DATA[type];
    const topThree = entries.slice(0, 3);
    const rest = entries.slice(3);

    useEffect(() => {
        const timer = window.setInterval(() => setSecondsSinceUpdate((seconds) => seconds + 1), 1_000);
        return () => window.clearInterval(timer);
    }, []);

    const lastUpdate = secondsSinceUpdate < 60
        ? `${secondsSinceUpdate} 秒前`
        : `${Math.floor(secondsSinceUpdate / 60)} 分鐘前`;

    return (
        <div key={type} className="animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="mb-4 flex items-center justify-between rounded-xl border border-white/10 bg-black/15 px-4 py-2.5">
                <div>
                    <p className="text-[9px] font-black tracking-[0.2em] text-[#FFD700]">LIVE RANKING</p>
                    <p className="mt-0.5 text-xs font-bold text-slate-400">榜單顯示前 10 名玩家</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.65)]" />
                    {lastUpdate}更新
                </div>
            </div>

            <div className="mx-auto mb-4 grid max-w-2xl grid-cols-3 items-end gap-3 px-3 pt-4">
                <PodiumEntry entry={topThree[1]} place="second" />
                <PodiumEntry entry={topThree[0]} place="first" />
                <PodiumEntry entry={topThree[2]} place="third" />
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                <div className="grid grid-cols-[56px_1fr_170px] px-4 py-2 text-[9px] font-black uppercase tracking-wider text-slate-600">
                    <span className="text-center">Rank</span><span>Player / Game</span><span className="text-right">Score</span>
                </div>
                {rest.map((entry) => (
                    <div key={entry.rank} className="grid grid-cols-[56px_1fr_170px] items-center border-t border-white/5 px-4 py-2.5 transition-colors hover:bg-white/[0.035]">
                        <span className="text-center font-mono text-sm font-black text-slate-500">#{entry.rank}</span>
                        <div className="flex min-w-0 items-center gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-purple-300/15 bg-purple-500/10 text-sm">👤</span>
                            <div className="min-w-0"><div className="truncate text-xs font-black text-white">{entry.name}</div><div className="mt-0.5 truncate text-[9px] font-bold text-slate-500">{entry.game}</div></div>
                        </div>
                        <span className="text-right font-mono text-xs font-black text-purple-200">{entry.amount}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PodiumEntry = ({ entry, place }: { entry: LeaderboardEntry; place: 'first' | 'second' | 'third' }) => {
    const isFirst = place === 'first';
    const rankStyle = place === 'first'
        ? 'from-[#FFD700] to-[#9a6510] border-[#FFD700]/55 text-[#241400] h-[92px]'
        : place === 'second'
            ? 'from-slate-300 to-slate-600 border-slate-200/35 text-white h-[72px]'
            : 'from-orange-400 to-orange-800 border-orange-300/35 text-white h-[58px]';

    return (
        <div className={`flex min-w-0 flex-col items-center ${isFirst ? '-mt-4' : ''}`}>
            {isFirst && <Crown size={23} className="mb-1 fill-[#FFD700] text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.55)]" />}
            <div className={`flex items-center justify-center rounded-full border-2 bg-gradient-to-br from-purple-500 to-indigo-900 text-xl shadow-lg ${isFirst ? 'h-14 w-14 border-[#FFD700]' : 'h-12 w-12 border-white/25'}`}>👤</div>
            <div className={`mt-1 max-w-full truncate text-[10px] font-black ${isFirst ? 'text-[#FFD700]' : 'text-slate-300'}`}>{entry.name}</div>
            <div className={`mt-2 flex w-full flex-col items-center justify-end rounded-t-xl border bg-gradient-to-b pb-2 ${rankStyle}`}>
                <strong className="text-lg font-black">{entry.rank}</strong>
                <span className="max-w-[95%] truncate text-[9px] font-black">{entry.amount}</span>
                <span className="max-w-[95%] truncate text-[8px] font-bold opacity-70">{entry.game}</span>
            </div>
            <span className="mt-1 text-[8px] font-bold text-slate-600">{entry.time}</span>
        </div>
    );
};

export default LeaderboardPanel;
