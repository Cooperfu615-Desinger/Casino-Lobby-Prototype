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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative flex h-[min(680px,92vh)] w-[94%] max-w-[1100px] flex-col overflow-hidden rounded-[26px] border border-white/10 bg-[#1a0b2e] shadow-2xl animate-in zoom-in-95 duration-200">
                <header className="relative z-20 flex-none border-b border-white/10 bg-gradient-to-r from-[#2a1244] via-[#1a0b2e] to-[#130720] px-5 pt-3.5">
                    <button
                        type="button"
                        aria-label="關閉活動中心"
                        onClick={onClose}
                        className="absolute right-5 top-3.5 z-20 rounded-full bg-black/40 p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                    >
                        <X size={20} />
                    </button>

                    <div className="mb-2 flex items-center gap-2.5 pr-10">
                        <Calendar size={20} className="text-[#FFD700]" />
                        <div>
                            <p className="text-[7px] font-black tracking-[0.22em] text-[#FFD700]/70">REWARDS & EVENTS</p>
                            <h2 className="text-lg font-black text-white">{activeTab === 'daily' ? '每日任務' : activeTab === 'leaderboard' ? '排行榜' : '活動中心'}</h2>
                        </div>
                    </div>

                    <nav className="flex gap-1.5 pb-2.5" aria-label="活動中心分類">
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
                                className={`rounded-lg px-5 py-1.5 text-xs font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-[#FFD700] text-black shadow-lg'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>

                    {activeTab === 'leaderboard' && (
                        <div className="flex gap-2 pb-3 animate-in fade-in slide-in-from-right-4 duration-300">
                            {[
                                { id: 'multiplier' as const, label: '倍數榜' },
                                { id: 'win' as const, label: '贏分榜' },
                                { id: 'rich' as const, label: '富豪榜' },
                            ].map((type) => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => setLeaderboardType(type.id)}
                                    className={`flex-1 rounded-lg border py-1.5 text-xs font-bold transition-all ${leaderboardType === type.id
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

                <div className="relative flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {activeTab === 'daily' && <DailyCheckInPanel />}
                    {activeTab === 'events' && <EventListPanel />}
                    {activeTab === 'leaderboard' && <LeaderboardPanel type={leaderboardType} />}
                </div>
            </div>
        </div>
    );
};

export default EventsInterface;
