import { useState } from 'react';
import { ChevronLeft, Trophy, Timer, Users, Target, Calendar, Crown, ArrowRight } from 'lucide-react';
import { CLUB_EVENTS_DATA, ClubEvent } from '../data/mockData';

interface ClubEventsProps {
    onBack: () => void;
}

const ClubEvents = ({ onBack }: ClubEventsProps) => {
    const [selectedEvent, setSelectedEvent] = useState<ClubEvent>(CLUB_EVENTS_DATA[0]);

    const getStatusColor = (status: ClubEvent['status']) => {
        switch (status) {
            case 'active': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'upcoming': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'ended': return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    };

    const getStatusText = (status: ClubEvent['status']) => {
        switch (status) {
            case 'active': return '進行中';
            case 'upcoming': return '即將開始';
            case 'ended': return '已結束';
        }
    };

    return (
        <div className="flex w-full h-full bg-[#120822] animate-in slide-in-from-right duration-300 relative">

            {/* Left Panel: Event List */}
            <div className="w-[35%] bg-[#0f061e] border-r border-white/10 flex flex-col relative z-20">
                <div className="p-6 border-b border-white/5 flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors flex items-center gap-2"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <span className="font-bold text-slate-300">Club Events</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {CLUB_EVENTS_DATA.map((event) => (
                        <div
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all group ${selectedEvent.id === event.id
                                ? 'bg-[#2a1b42] border-blue-500/50 shadow-lg shadow-blue-500/10'
                                : 'bg-[#1a0b2e] border-white/5 hover:bg-[#221038] hover:border-white/10'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(event.status)}`}>
                                    {getStatusText(event.status)}
                                </span>
                                {event.status === 'active' && (
                                    <span className="flex items-center gap-1 text-[10px] text-red-400 animate-pulse font-bold">
                                        <Timer size={10} /> {event.timeLeft}
                                    </span>
                                )}
                            </div>
                            <h3 className={`font-bold mb-1 group-hover:text-white transition-colors ${selectedEvent.id === event.id ? 'text-white' : 'text-slate-300'}`}>
                                {event.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Trophy size={12} className="text-[#FFD700]" />
                                <span className="text-[#FFD700] font-mono font-bold">{event.prizePool.toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel: Event Details */}
            <div className="flex-1 bg-[#160b29] flex flex-col relative overflow-hidden">
                {/* Background Effect */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="flex-1 overflow-y-auto p-8 relative z-10 w-full">
                    <div className="max-w-3xl mx-auto w-full">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-black text-white italic tracking-wide mb-2 flex items-center gap-3">
                                    {selectedEvent.title}
                                    {selectedEvent.status === 'active' && (
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                        </span>
                                    )}
                                </h1>
                                <p className="text-slate-400 text-sm max-w-lg leading-relaxed">{selectedEvent.description}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Total Prize Pool</p>
                                <div className="text-5xl font-black text-[#FFD700] drop-shadow-[0_0_25px_rgba(234,179,8,0.4)] flex items-center justify-end gap-3 filter">
                                    <Trophy size={48} className="fill-[#FFD700]" />
                                    ${selectedEvent.prizePool.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="bg-[#1a0b2e]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center">
                                <Timer className="text-blue-400 mb-2" size={24} />
                                <span className="text-2xl font-bold text-white font-mono">{selectedEvent.timeLeft}</span>
                                <span className="text-[10px] text-slate-500 uppercase mt-1">Time Remaining</span>
                            </div>
                            <div className="bg-[#1a0b2e]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center">
                                <Users className="text-green-400 mb-2" size={24} />
                                <span className="text-2xl font-bold text-white font-mono">{selectedEvent.participants}</span>
                                <span className="text-[10px] text-slate-500 uppercase mt-1">Participants</span>
                            </div>
                            <div className="bg-[#1a0b2e]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center">
                                <Target className="text-red-400 mb-2" size={24} />
                                <span className="text-2xl font-bold text-white font-mono">Winner Takes All</span>
                                <span className="text-[10px] text-slate-500 uppercase mt-1">Mode</span>
                            </div>
                        </div>

                        {/* Leaderboard */}
                        {selectedEvent.leaderboard.length > 0 ? (
                            <div className="bg-[#1a0b2e]/80 backdrop-blur-sm border border-white/10 rounded-3xl p-6 mb-8">
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <Crown className="text-[#FFD700]" size={20} />
                                    Live Leaderboard
                                </h3>
                                <div className="space-y-3">
                                    {selectedEvent.leaderboard.map((entry, index) => (
                                        <div key={index} className="flex items-center bg-black/40 rounded-xl p-3 border border-white/5">
                                            <div className="w-8 h-8 flex items-center justify-center font-black text-lg italic mr-4" style={{
                                                color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'
                                            }}>
                                                #{entry.rank}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-bold text-sm">{entry.name}</p>
                                                {index === 0 && <span className="text-[10px] text-[#FFD700] bg-[#FFD700]/10 px-1.5 py-0.5 rounded">Current Leader</span>}
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-white font-mono font-bold text-lg">{entry.score.toLocaleString()}</span>
                                                <span className="text-[10px] text-slate-500">Score</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[#1a0b2e]/80 backdrop-blur-sm border border-white/10 rounded-3xl p-12 mb-8 flex flex-col items-center justify-center text-slate-500">
                                <Calendar size={48} className="mb-4 opacity-50" />
                                <p>Leaderboard will originate once the event starts.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 bg-[#1a0b2e] border-t border-white/10 flex justify-end relative z-20">
                    <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 px-12 rounded-xl shadow-lg shadow-blue-500/30 active:scale-95 transition-all text-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={selectedEvent.status === 'ended'}
                    >
                        {selectedEvent.status === 'active' ? '立即參加 (Enter Now)' : selectedEvent.status === 'upcoming' ? '預約報名 (Register)' : '活動已結束 (Ended)'}
                        {selectedEvent.status !== 'ended' && <ArrowRight size={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClubEvents;
