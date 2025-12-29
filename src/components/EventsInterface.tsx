import React, { useState } from 'react';
import { Calendar, ChevronRight, Clock, X } from 'lucide-react';
import { EVENTS_LIST } from '../data/mockData';

interface EventsInterfaceProps {
    onOpenSale: () => void;
    onOpenTournament: () => void;
    onClose: () => void;
}

const EventsInterface = ({ onOpenSale, onOpenTournament, onClose }: EventsInterfaceProps) => {
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'active' | 'ending'>('all');

    const filteredList = EVENTS_LIST.filter(event => {
        if (filter === 'all') return true;
        return event.status === filter;
    });

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
                        <div className="flex items-center gap-3 mb-4">
                            <Calendar size={24} className="text-[#FFD700]" />
                            <h2 className="text-2xl font-bold text-white">活動中心</h2>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex gap-2 overflow-x-auto no-scrollbar">
                            {(['all', 'upcoming', 'active', 'ending'] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${filter === f
                                        ? 'bg-[#FFD700] text-black shadow-lg scale-105'
                                        : 'bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white'
                                        }`}
                                >
                                    {f === 'all' && '全部'}
                                    {f === 'upcoming' && '即將開始'}
                                    {f === 'active' && '熱烈進行'}
                                    {f === 'ending' && '即將結束'}
                                </button>
                            ))}
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
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
                </div>
            </div>
        </div>
    );
};

export default EventsInterface;
