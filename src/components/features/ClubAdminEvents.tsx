import { useState } from 'react';
import { ChevronLeft, Trophy, Timer, Users, Target, Calendar, Crown, Plus, X, Loader2, Coins } from 'lucide-react';
import { CLUB_EVENTS_DATA, ClubEvent, EVENT_TEMPLATES } from '../../data/mockData';

interface ClubAdminEventsProps {
    onBack: () => void;
}

const ClubAdminEvents = ({ onBack }: ClubAdminEventsProps) => {
    const [selectedEvent, setSelectedEvent] = useState<ClubEvent>(CLUB_EVENTS_DATA[0]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsCreateModalOpen(false);
            alert('活動創建成功！(Mock)');
        }, 1500);
    };

    return (
        <div className="flex w-full h-full bg-[#120822] animate-in slide-in-from-right duration-300 relative">

            {/* Create Event Modal */}
            {isCreateModalOpen && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
                    <div className="w-full max-w-lg bg-[#1a0b2e] border-2 border-[#FFD700]/50 rounded-2xl flex flex-col relative shadow-2xl">
                        <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#150923]/50">
                            <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                <Plus className="text-[#FFD700]" size={20} />
                                創建新活動
                            </h3>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="text-slate-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                            <div>
                                <label className="block text-slate-400 text-xs font-bold mb-1.5 uppercase">活動模組</label>
                                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FFD700] appearance-none">
                                    {EVENT_TEMPLATES.map(t => (
                                        <option key={t.id} value={t.id} className="bg-[#1a0b2e]">{t.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-400 text-xs font-bold mb-1.5 uppercase">活動名稱</label>
                                <input required type="text" placeholder="例如：週末狂歡賽..." className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FFD700] transition-colors" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-400 text-xs font-bold mb-1.5 uppercase">開始時間</label>
                                    <input required type="datetime-local" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FFD700] transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-xs font-bold mb-1.5 uppercase">結束時間</label>
                                    <input required type="datetime-local" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FFD700] transition-colors" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-400 text-xs font-bold mb-1.5 uppercase">總獎金池</label>
                                <div className="relative">
                                    <input required type="number" placeholder="輸入金額..." className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FFD700] transition-colors" />
                                    <Coins className="absolute left-3 top-2.5 text-[#FFD700]" size={16} />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-[#FFD700] to-[#DAA520] text-black font-bold py-3 rounded-xl shadow-lg hover:shadow-[#FFD700]/30 active:scale-95 transition-all mt-4 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        創建中...
                                    </>
                                ) : (
                                    '確認創建'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Left Panel: Event List */}
            <div className="w-[35%] bg-[#0f061e] border-r border-white/10 flex flex-col relative z-20">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBack}
                            className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors flex items-center gap-2"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <span className="font-bold text-slate-300">Club Events</span>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="p-2 bg-[#FFD700]/10 text-[#FFD700] rounded-full hover:bg-[#FFD700] hover:text-black transition-all"
                        title="Create Event"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {CLUB_EVENTS_DATA.map((event) => (
                        <div
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all group ${selectedEvent.id === event.id
                                ? 'bg-[#2a1b42] border-[#FFD700]/50 shadow-lg shadow-[#FFD700]/10'
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

            {/* Right Panel: Event Details (Reused logic but could be "Edit" mode in future) */}
            <div className="flex-1 bg-[#160b29] flex flex-col relative overflow-hidden">
                {/* Background Effect */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFD700]/5 rounded-full blur-[100px] pointer-events-none"></div>

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
            </div>
        </div>
    );
};

export default ClubAdminEvents;
