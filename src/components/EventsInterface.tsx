import React, { useState } from 'react';
import { Calendar, ChevronRight, Clock, X } from 'lucide-react';
import { EVENTS_LIST } from '../data/mockData';

interface EventsInterfaceProps {
    onOpenSale: () => void;
    onOpenTournament: () => void;
    onClose: () => void;
}

const EventsInterface = ({ onOpenSale, onOpenTournament, onClose }: EventsInterfaceProps) => {
    const [activeTab, setActiveTab] = useState<'daily' | 'events' | 'leaderboard' | 'filter'>('daily');
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'active' | 'ending'>('all');
    const [signedIn, setSignedIn] = useState(false);

    const filteredList = EVENTS_LIST.filter(event => {
        if (filter === 'all') return true;
        return event.status === filter;
    });

    const handleCheckIn = () => {
        setSignedIn(true);
        // In a real app, you would show a toast here.
        // For now, the UI update is enough feedback as per instructions.
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <span className="bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse shadow-[0_0_10px_rgba(22,163,74,0.5)]">熱烈進行</span>;
            case 'upcoming':
                return <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">即將開始</span>;
            case 'ending':
                return <span className="bg-orange-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-bounce">即將結束</span>;
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Modal Container */}
            <div className="relative w-[90%] max-w-[1000px] h-[600px] bg-[#1a0b2e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 bg-black/40 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <header className="mb-6 pr-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Calendar size={24} className="text-[#FFD700]" />
                            <h2 className="text-2xl font-bold text-white">活動中心</h2>
                        </div>

                        {/* Top Level Tabs */}
                        <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
                            {[
                                { id: 'daily', label: '每日任務' },
                                { id: 'events', label: '活動' },
                                { id: 'leaderboard', label: '排行榜' },
                                { id: 'filter', label: '篩選' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id
                                        ? 'bg-[#FFD700] text-black shadow-lg scale-105'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Events Tab - Sub Filters */}
                        {activeTab === 'events' && (
                            <div className="flex gap-2 overflow-x-auto no-scrollbar animate-in fade-in slide-in-from-left-4 duration-300">
                                {(['all', 'upcoming', 'active', 'ending'] as const).map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${filter === f
                                            ? 'bg-white/20 text-white border border-white/30'
                                            : 'bg-black/20 text-slate-500 hover:bg-white/10 hover:text-slate-300'
                                            }`}
                                    >
                                        {f === 'all' && '全部'}
                                        {f === 'upcoming' && '即將開始'}
                                        {f === 'active' && '熱烈進行'}
                                        {f === 'ending' && '即將結束'}
                                    </button>
                                ))}
                            </div>
                        )}
                    </header>

                    {/* Content Area */}
                    <div className="min-h-[300px]">
                        {/* Daily Check-in Tab */}
                        {activeTab === 'daily' && (
                            <div className="animate-in fade-in zoom-in-95 duration-300">
                                <div className="text-center mb-8">
                                    <h3 className="text-3xl font-black text-white italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                                        每日簽到 <span className="text-[#FFD700]">DAILY CHECK-IN</span>
                                    </h3>
                                    <p className="text-slate-300 mt-2">累積登入領大獎！與好友一起挑戰！</p>
                                </div>

                                <div className="grid grid-cols-4 md:grid-cols-7 gap-3 mb-8">
                                    {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                                        const isPast = day < 3;
                                        const isToday = day === 3;
                                        const isLocked = day > 3;
                                        const isBigWin = day === 7;

                                        return (
                                            <div
                                                key={day}
                                                onClick={() => isToday && !signedIn && handleCheckIn()}
                                                className={`
                                                    relative aspect-[3/4] rounded-xl flex flex-col items-center justify-between p-2 border-2 transition-all
                                                    ${isPast || (isToday && signedIn)
                                                        ? 'bg-black/40 border-white/10 opacity-60'
                                                        : isToday
                                                            ? 'bg-gradient-to-b from-[#FFD700]/20 to-[#FFD700]/5 border-[#FFD700] cursor-pointer hover:scale-105 shadow-[0_0_20px_rgba(255,215,0,0.2)] animate-pulse'
                                                            : 'bg-black/20 border-white/5 opacity-40'}
                                                `}
                                            >
                                                <span className="text-xs font-bold text-white/60">Day {day}</span>

                                                <div className="flex-1 flex items-center justify-center">
                                                    {isBigWin ? (
                                                        <div className="text-4xl animate-bounce">🎁</div>
                                                    ) : (
                                                        <div className="text-2xl">💰</div>
                                                    )}
                                                </div>

                                                {(isPast || (isToday && signedIn)) && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
                                                        <span className="text-green-400 font-bold text-xl">✓</span>
                                                    </div>
                                                )}

                                                {isLocked && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <span className="text-2xl opacity-50">🔒</span>
                                                    </div>
                                                )}

                                                <span className={`text-[10px] font-bold ${isToday && !signedIn ? 'text-[#FFD700]' : 'text-white/40'}`}>
                                                    {isBigWin ? 'Big Win' : '1000'}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex justify-center">
                                    <button
                                        onClick={handleCheckIn}
                                        disabled={signedIn}
                                        className={`
                                            px-12 py-3 rounded-full font-black text-lg transition-all
                                            ${signedIn
                                                ? 'bg-white/10 text-white/30 cursor-not-allowed'
                                                : 'bg-[#FFD700] text-black hover:scale-110 hover:shadow-[0_0_30px_rgba(255,215,0,0.4)]'}
                                        `}
                                    >
                                        {signedIn ? '今日已簽到' : '立即簽到'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Events List Tab */}
                        {activeTab === 'events' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                {filteredList.map((event) => (
                                    <div
                                        key={event.id}
                                        onClick={() => {
                                            if (event.type === 'sale') onOpenSale();
                                            if (event.type === 'tournament') onOpenTournament();
                                        }}
                                        className={`group cursor-pointer bg-gradient-to-r ${event.bg} border ${event.border} rounded-2xl p-6 flex flex-col relative overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-xl min-h-[160px]`}
                                    >
                                        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4 group-hover:scale-150 transition-transform duration-500">
                                            {React.cloneElement(event.icon as React.ReactElement, { size: 120 })}
                                        </div>

                                        <div className="flex items-start justify-between mb-4 relative z-10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center border border-white/10 shadow-lg group-hover:rotate-12 transition-transform">
                                                    {React.cloneElement(event.icon as React.ReactElement, { size: 24 })}
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        {getStatusBadge(event.status)}
                                                    </div>
                                                    <h3 className="text-xl font-bold text-white italic leading-tight">{event.title}</h3>
                                                </div>
                                            </div>

                                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:bg-[#FFD700] group-hover:text-black transition-colors">
                                                <ChevronRight size={20} />
                                            </div>
                                        </div>

                                        <div className="flex-1 relative z-10 mb-4">
                                            <p className="text-slate-200 text-sm font-medium">{event.desc}</p>
                                        </div>

                                        <div className="relative z-10 border-t border-white/10 pt-3 flex items-center gap-2 text-xs text-white/60 font-mono">
                                            <Clock size={12} />
                                            <span>{event.startTime} ~ {event.endTime}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Coming Soon Tabs */}
                        {(activeTab === 'leaderboard' || activeTab === 'filter') && (
                            <div className="flex flex-col items-center justify-center h-[400px] animate-in fade-in zoom-in-95 duration-300">
                                <div className="text-6xl mb-4 opacity-20">🚧</div>
                                <h3 className="text-2xl font-bold text-white mb-2">敬請期待</h3>
                                <p className="text-slate-400">Coming Soon...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventsInterface;
