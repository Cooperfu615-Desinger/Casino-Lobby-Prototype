import { useMemo, useState } from 'react';
import { Calendar, Crown, Medal, X } from 'lucide-react';
import DailyCheckInPanel from '../activity/DailyCheckInPanel';
import EventListPanel from '../activity/EventListPanel';

interface EventsInterfaceProps {
    onClose: () => void;
    initialTab?: 'daily' | 'events' | 'leaderboard' | 'filter';
}

type MainTab = 'daily' | 'events' | 'leaderboard';
type LeaderboardType = 'multiplier' | 'win' | 'rich';

const EventsInterface = ({ onClose, initialTab = 'events' }: EventsInterfaceProps) => {
    const resolvedInitialTab: MainTab = initialTab === 'filter' ? 'events' : initialTab;
    const [activeTab, setActiveTab] = useState<MainTab>(resolvedInitialTab);
    const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('multiplier');

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative flex h-[600px] w-[90%] max-w-[1000px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1a0b2e] shadow-2xl animate-in zoom-in-95 duration-200">
                <header className="relative z-20 flex-none bg-[#1a0b2e] p-6 pb-0">
                    <button
                        type="button"
                        aria-label="關閉活動中心"
                        onClick={onClose}
                        className="absolute right-6 top-6 z-20 rounded-full bg-black/40 p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                    >
                        <X size={20} />
                    </button>

                    <div className="mb-6 flex items-center gap-3 pr-10">
                        <Calendar size={24} className="text-[#FFD700]" />
                        <div>
                            <p className="text-[9px] font-black tracking-[0.22em] text-[#FFD700]/70">REWARDS & EVENTS</p>
                            <h2 className="text-2xl font-bold text-white">活動中心</h2>
                        </div>
                    </div>

                    <nav className="flex gap-2 border-b border-white/10 pb-4" aria-label="活動中心分類">
                        {[
                            { id: 'daily' as const, label: '每日任務' },
                            { id: 'events' as const, label: '活動' },
                            { id: 'leaderboard' as const, label: '排行榜' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                aria-pressed={activeTab === tab.id}
                                className={`rounded-lg px-6 py-2 text-sm font-bold transition-all ${activeTab === tab.id
                                    ? 'scale-105 bg-[#FFD700] text-black shadow-lg'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>

                    {activeTab === 'leaderboard' && (
                        <div className="flex gap-2 py-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            {[
                                { id: 'multiplier' as const, label: '倍數榜' },
                                { id: 'win' as const, label: '贏分榜' },
                                { id: 'rich' as const, label: '富豪榜' },
                            ].map((type) => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => setLeaderboardType(type.id)}
                                    className={`flex-1 rounded-lg border py-2 text-sm font-bold transition-all ${leaderboardType === type.id
                                        ? 'border-[#FFD700]/50 bg-white/10 text-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.1)]'
                                        : 'border-white/5 bg-black/20 text-slate-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    )}
                </header>

                <div className="relative flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {activeTab === 'daily' && <DailyCheckInPanel />}
                    {activeTab === 'events' && <EventListPanel />}
                    {activeTab === 'leaderboard' && <LeaderboardPanel type={leaderboardType} />}
                </div>
            </div>
        </div>
    );
};

const LeaderboardPanel = ({ type }: { type: LeaderboardType }) => {
    const entries = useMemo(() => Array.from({ length: 20 }, (_, index) => {
        const rank = index + 1;
        const score = type === 'multiplier'
            ? `${5_000 - index * 150}x`
            : type === 'win'
                ? `${(5_000_000 - index * 180_000).toLocaleString()} 銀幣`
                : `${(99_999_999 - index * 3_000_000).toLocaleString()} 銀幣`;
        return { rank, name: `Player_${1000 + index}`, score, hue: (index * 47 + 18) % 360 };
    }), [type]);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="mb-2 flex items-center px-4 text-[10px] font-black uppercase tracking-wider text-white/35"><span className="w-16 text-center">Rank</span><span className="flex-1 pl-4">Player</span><span className="w-44 text-right">Score</span></div>
            <div className="space-y-2 pb-6">
                {entries.map((entry) => (
                    <div key={entry.rank} className={`flex items-center rounded-xl border p-3 ${entry.rank === 1 ? 'border-[#FFD700]/30 bg-gradient-to-r from-[#FFD700]/20 to-transparent' : 'border-white/5 bg-black/20'}`}>
                        <div className="flex w-16 justify-center">{entry.rank === 1 ? <Crown size={23} className="fill-[#FFD700] text-[#FFD700]" /> : entry.rank <= 3 ? <Medal size={22} className={entry.rank === 2 ? 'text-slate-300' : 'text-orange-500'} /> : <span className="font-mono text-lg font-bold text-slate-500">#{entry.rank}</span>}</div>
                        <div className="flex flex-1 items-center gap-3 pl-4"><span className="h-9 w-9 rounded-full border-2 border-white/10" style={{ backgroundColor: `hsl(${entry.hue} 70% 45%)` }} /><span className={`font-bold ${entry.rank === 1 ? 'text-[#FFD700]' : 'text-white'}`}>{entry.name}</span></div>
                        <div className="w-44 text-right font-mono text-sm font-black text-[#FFD700]">{entry.score}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventsInterface;
