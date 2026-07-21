import { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import DailyCheckInPanel from '../activity/DailyCheckInPanel';
import EventListPanel from '../activity/EventListPanel';
import LeaderboardPanel, { type LeaderboardType } from '../activity/LeaderboardPanel';

interface EventsInterfaceProps {
    onClose: () => void;
    initialTab?: 'daily' | 'events' | 'leaderboard' | 'filter';
}

type MainTab = 'daily' | 'events' | 'leaderboard';

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

export default EventsInterface;
