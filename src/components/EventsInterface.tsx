import React, { useState } from 'react';
import { Calendar, ChevronRight, Clock, X, Gift, Lock, Check, SlidersHorizontal, Medal, Crown } from 'lucide-react';
import { EVENTS_LIST } from '../data/mockData';

interface EventsInterfaceProps {
    onOpenSale: () => void;
    onOpenTournament: () => void;
    onClose: () => void;
}

const EventsInterface = ({ onOpenSale, onOpenTournament, onClose }: EventsInterfaceProps) => {
    const [activeTab, setActiveTab] = useState<'daily' | 'events' | 'leaderboard' | 'filter'>('daily');
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'active' | 'ending'>('all');
    const [leaderboardType, setLeaderboardType] = useState<'jackpot' | 'multiplier' | 'win' | 'rich'>('jackpot');
    const [signedIn, setSignedIn] = useState(false);

    const filteredList = EVENTS_LIST.filter(event => {
        if (filter === 'all') return true;
        return event.status === filter;
    });

    const getLeaderboardData = () => {
        return Array.from({ length: 20 }, (_, i) => {
            const rank = i + 1;
            let score = '';

            switch (leaderboardType) {
                case 'jackpot':
                    score = `$${(1000000 - i * 40000).toLocaleString()}`;
                    break;
                case 'multiplier':
                    score = `${(5000 - i * 150)}x`; // e.g. 5000x
                    break;
                case 'win':
                    score = `$${(500000 - i * 20000).toLocaleString()}`;
                    break;
                case 'rich':
                    score = `$${(99999999 - i * 3000000).toLocaleString()}`;
                    break;
            }

            return {
                rank,
                name: `Player_${1000 + i}`,
                avatarColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
                score
            };
        });
    };

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

                {/* Part A: Header Section (Fixed) */}
                <div className="flex-none p-6 pb-0 bg-[#1a0b2e] z-20 relative">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-20 bg-black/40 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-center gap-3 mb-6 pr-10">
                        <Calendar size={24} className="text-[#FFD700]" />
                        <h2 className="text-2xl font-bold text-white">活動中心</h2>
                    </div>

                    {/* Navigation Bar */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        {/* Left: Tabs */}
                        <div className="flex gap-2">
                            {[
                                { id: 'daily', label: '每日任務' },
                                { id: 'events', label: '活動' },
                                { id: 'leaderboard', label: '排行榜' }
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

                        {/* Right: Filter Action */}
                        <button
                            onClick={() => setActiveTab('filter')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border border-white/10 hover:bg-white/5 ${activeTab === 'filter' ? 'text-[#FFD700] border-[#FFD700]' : 'text-slate-400 hover:text-white'}`}
                        >
                            <SlidersHorizontal size={16} />
                            <span>篩選</span>
                        </button>
                    </div>

                    {/* Sub Filters for Events Tab (Conditional Render within Header to keep it fixed) */}
                    {activeTab === 'events' && (
                        <div className="flex gap-2 overflow-x-auto no-scrollbar py-4 animate-in fade-in slide-in-from-left-4 duration-300">
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
                </div>

                {/* Part B: Content Section (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <div className="min-h-[300px]">
                        {/* Daily Check-in Tab */}
                        {activeTab === 'daily' && (
                            <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
                                {/* Block A: Cumulative Progress */}
                                <div className="flex-none bg-black/20 rounded-2xl p-6 border border-white/10 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Calendar size={100} />
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <Gift className="text-[#FFD700]" size={24} />
                                        累積簽到獎勵 <span className="text-white/40 text-sm font-normal">(Total Check-ins)</span>
                                    </h3>

                                    <div className="relative h-4 bg-white/10 rounded-full mb-8 mx-4">
                                        <div
                                            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#FFD700] to-orange-500 rounded-full shadow-[0_0_15px_rgba(255,215,0,0.5)] transition-all duration-1000"
                                            style={{ width: `${(12 / 30) * 100}%` }}
                                        />

                                        {[5, 7, 10, 15, 20, 25, 30].map((milestone) => {
                                            const isUnlocked = 12 >= milestone;
                                            return (
                                                <div
                                                    key={milestone}
                                                    className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 transform -translate-x-1/2"
                                                    style={{ left: `${(milestone / 30) * 100}%` }}
                                                >
                                                    <div
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10
                                                            ${isUnlocked
                                                                ? 'bg-[#FFD700] border-[#FFD700] text-black shadow-lg scale-110'
                                                                : 'bg-black/80 border-white/20 text-white/20'}`}
                                                    >
                                                        {isUnlocked ? <Check size={20} strokeWidth={3} /> : <Gift size={18} />}
                                                    </div>
                                                    <span className={`text-[10px] font-bold ${isUnlocked ? 'text-[#FFD700]' : 'text-white/30'}`}>
                                                        {milestone}天
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="text-right text-xs text-white/40 font-mono">
                                        Progress: <span className="text-[#FFD700] text-base font-bold">12</span> / 30 Days
                                    </div>
                                </div>

                                {/* Block B: Monthly Grid */}
                                <div className="flex-1 bg-black/20 rounded-2xl p-6 border border-white/10 overflow-hidden flex flex-col">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold text-white">本月簽到 <span className="text-white/40 text-sm font-normal">(Daily Check-in)</span></h3>
                                        <div className="flex items-center gap-2 text-xs text-white/40">
                                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#FFD700]" />今日</div>
                                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-600" />已領</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-6 gap-3 pb-4">
                                        {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                                            const currentDay = 12;
                                            const isPast = day < currentDay;
                                            const isToday = day === currentDay;
                                            const isLocked = day > currentDay;

                                            // Specific milestones visual
                                            const isSpecial = [5, 10, 15, 20, 25, 30].includes(day);

                                            return (
                                                <div
                                                    key={day}
                                                    onClick={() => isToday && !signedIn && handleCheckIn()}
                                                    className={`
                                                        aspect-square rounded-xl relative flex flex-col items-center justify-center p-1 border transition-all duration-300
                                                        ${isPast || (isToday && signedIn)
                                                            ? 'bg-white/5 border-white/5 opacity-50'
                                                            : isToday
                                                                ? 'bg-gradient-to-br from-[#FFD700]/20 to-orange-500/20 border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.3)] cursor-pointer hover:scale-105 animate-pulse'
                                                                : 'bg-black/40 border-white/5 opacity-30'}
                                                    `}
                                                >
                                                    <span className={`absolute top-1 left-2 text-[10px] font-bold ${isToday ? 'text-[#FFD700]' : 'text-white/30'}`}>
                                                        {day}
                                                    </span>

                                                    <div className="transform scale-90">
                                                        {isSpecial ? (
                                                            <span className="text-2xl drop-shadow-md">🎁</span>
                                                        ) : (
                                                            <span className="text-xl drop-shadow-md">💰</span>
                                                        )}
                                                    </div>

                                                    {isToday && !signedIn && (
                                                        <div className="absolute inset-x-0 -bottom-2 flex justify-center">
                                                            <span className="bg-[#FFD700] text-black text-[8px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                                                                領取
                                                            </span>
                                                        </div>
                                                    )}

                                                    {(isPast || (isToday && signedIn)) && (
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl">
                                                            <Check className="text-green-500" size={24} strokeWidth={4} />
                                                        </div>
                                                    )}

                                                    {isLocked && <Lock className="absolute bottom-1 right-1 text-white/10" size={12} />}
                                                </div>
                                            );
                                        })}
                                    </div>
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

                        {/* Leaderboard Tab */}
                        {activeTab === 'leaderboard' && (
                            <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
                                {/* Sub Navigation */}
                                <div className="flex gap-2 mb-6">
                                    {[
                                        { id: 'jackpot', label: '彩金榜' },
                                        { id: 'multiplier', label: '倍數榜' },
                                        { id: 'win', label: '贏分榜' },
                                        { id: 'rich', label: '富豪榜' }
                                    ].map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => setLeaderboardType(type.id as any)}
                                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all border border-white/5 ${leaderboardType === type.id
                                                ? 'bg-white/10 text-[#FFD700] border-[#FFD700]/50 shadow-[0_0_10px_rgba(255,215,0,0.1)]'
                                                : 'bg-black/20 text-slate-400 hover:bg-white/5 hover:text-white'
                                                }`}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>

                                {/* List Header */}
                                <div className="flex items-center text-xs text-white/40 px-4 mb-2 uppercase font-bold tracking-wider">
                                    <div className="w-16 text-center">Rank</div>
                                    <div className="flex-1 pl-4">Player</div>
                                    <div className="w-32 text-right">Score</div>
                                </div>

                                {/* Ranking List */}
                                <div className="flex flex-col gap-2 pb-20">
                                    {getLeaderboardData().map((item) => {
                                        const isTop1 = item.rank === 1;
                                        const isTop2 = item.rank === 2;
                                        const isTop3 = item.rank === 3;

                                        return (
                                            <div
                                                key={item.rank}
                                                className={`flex items-center p-3 rounded-xl transition-all hover:bg-white/5 ${isTop1 ? 'bg-gradient-to-r from-[#FFD700]/20 to-transparent border border-[#FFD700]/30' :
                                                    isTop2 ? 'bg-gradient-to-r from-slate-300/10 to-transparent border border-white/10' :
                                                        isTop3 ? 'bg-gradient-to-r from-orange-700/10 to-transparent border border-white/5' :
                                                            'bg-black/20 border border-transparent'
                                                    }`}
                                            >
                                                {/* Rank Column */}
                                                <div className="w-16 flex justify-center">
                                                    {isTop1 ? <Crown size={24} className="text-[#FFD700] fill-[#FFD700] animate-bounce" /> :
                                                        isTop2 ? <Medal size={24} className="text-slate-300" /> :
                                                            isTop3 ? <Medal size={24} className="text-orange-600" /> :
                                                                <span className="text-slate-500 font-bold font-mono text-lg">#{item.rank}</span>
                                                    }
                                                </div>

                                                {/* Player Info */}
                                                <div className="flex-1 flex items-center gap-3 pl-4">
                                                    <div
                                                        className="w-10 h-10 rounded-full border-2 border-white/10 shadow-lg"
                                                        style={{ backgroundColor: item.avatarColor }}
                                                    />
                                                    <span className={`font-bold ${isTop1 ? 'text-[#FFD700]' : 'text-white'}`}>
                                                        {item.name}
                                                    </span>
                                                </div>

                                                {/* Score */}
                                                <div className="w-32 text-right font-mono font-bold text-[#FFD700]">
                                                    {item.score}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Coming Soon Tabs - Filter Only */}
                        {activeTab === 'filter' && (
                            <div className="flex flex-col items-center justify-center h-[400px] animate-in fade-in zoom-in-95 duration-300">
                                <div className="text-6xl mb-4 opacity-20">🚧</div>
                                <h3 className="text-2xl font-bold text-white mb-2">篩選</h3>
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
