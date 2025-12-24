import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { EVENTS_LIST } from '../data/mockData';

interface EventsInterfaceProps {
    onOpenSale: () => void;
    onOpenTournament: () => void;
}

const EventsInterface = ({ onOpenSale, onOpenTournament }: EventsInterfaceProps) => {
    return (
        <div className="absolute top-[130px] bottom-[90px] left-0 right-0 z-20 bg-[#120822]/95 border-t border-white/10 animate-in fade-in zoom-in-95 duration-300 overflow-y-auto p-8">
            <header className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Calendar size={24} className="text-[#FFD700]" />
                    <h2 className="text-2xl font-bold text-white">活動中心</h2>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {EVENTS_LIST.map((event) => (
                    <div
                        key={event.id}
                        onClick={() => {
                            if (event.type === 'sale') onOpenSale();
                            if (event.type === 'tournament') onOpenTournament();
                        }}
                        className={`group cursor-pointer bg-gradient-to-r ${event.bg} border ${event.border} rounded-2xl p-6 flex items-center gap-6 relative overflow-hidden transition-all hover:scale-[1.02] shadow-xl`}
                    >
                        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4 group-hover:scale-150 transition-transform">
                            {React.cloneElement(event.icon as React.ReactElement, { size: 120 })}
                        </div>

                        <div className="w-16 h-16 rounded-full bg-black/40 flex items-center justify-center border border-white/10 shadow-lg relative z-10 group-hover:rotate-12 transition-transform">
                            {React.cloneElement(event.icon as React.ReactElement, { size: 32 })}
                        </div>

                        <div className="flex-1 relative z-10">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-bold text-white italic">{event.title}</h3>
                                {event.type === 'sale' && <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">HOT</span>}
                            </div>
                            <p className="text-slate-300 text-sm">{event.desc}</p>
                        </div>

                        <div className="relative z-10">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-[#FFD700] group-hover:text-black transition-colors">
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventsInterface;
