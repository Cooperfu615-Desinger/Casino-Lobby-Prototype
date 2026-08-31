import { cloneElement, isValidElement, useMemo, useState } from 'react';
import { Check, ChevronRight, Clock, Trophy, X } from 'lucide-react';
import { EVENTS_LIST } from '../../data/mockData';
import { useActivity } from '../../context/ActivityContext';
import { useUI } from '../../context/UIContext';
import type { EventItem } from '../../types/event';
import { LobbyModalButton, LobbyModalSection, LobbyModalTabs } from '../common/LobbyModalPrimitives';

type EventListStatus = 'active' | 'upcoming' | 'ended';

const STATUS_TABS: Array<{ id: EventListStatus; label: string }> = [
    { id: 'active', label: '進行中' },
    { id: 'upcoming', label: '即將開始' },
    { id: 'ended', label: '已結束' },
];

const EventListPanel = () => {
    const [activeStatus, setActiveStatus] = useState<EventListStatus>('active');
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
    const { joinedEventIds, joinEvent } = useActivity();
    const { showToast } = useUI();
    const counts = useMemo(() => ({
        active: EVENTS_LIST.filter((event) => event.status === 'active' || event.status === 'ending').length,
        upcoming: EVENTS_LIST.filter((event) => event.status === 'upcoming').length,
        ended: EVENTS_LIST.filter((event) => event.status === 'ended').length,
    }), []);
    const filteredEvents = EVENTS_LIST.filter((event) => activeStatus === 'active'
        ? event.status === 'active' || event.status === 'ending'
        : event.status === activeStatus);

    const handleJoin = () => {
        if (!selectedEvent || (selectedEvent.status !== 'active' && selectedEvent.status !== 'ending')) return;
        if (!joinEvent(selectedEvent.id)) return;
        showToast(`已完成「${selectedEvent.title}」Mock 報名`, 'success');
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
            <LobbyModalTabs
                items={STATUS_TABS.map((tab) => ({ ...tab, count: counts[tab.id] }))}
                value={activeStatus}
                onChange={setActiveStatus}
                ariaLabel="活動狀態"
                variant="secondary"
                className="mb-4 mt-0"
            />

            <div className="grid grid-cols-2 gap-4 pb-6">
                {filteredEvents.map((event) => {
                    const joined = joinedEventIds.includes(event.id);
                    return (
                        <button
                            key={event.id}
                            type="button"
                            onClick={() => setSelectedEvent(event)}
                            className={`group relative min-h-[170px] overflow-hidden rounded-2xl border bg-gradient-to-r p-5 text-left shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 ${event.bg} ${event.border}`}
                        >
                            <div className="absolute -bottom-5 -right-3 opacity-10 transition-transform duration-500 group-hover:scale-125">
                                {isValidElement(event.icon) ? cloneElement(event.icon, { size: 120 } as Record<string, unknown>) : event.icon}
                            </div>
                            <div className="relative flex h-full flex-col">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/30">{event.icon}</div>
                                        <div className="min-w-0">
                                            <StatusBadge status={event.status} />
                                            <h3 className="mt-1 truncate text-lg font-black text-white">{event.title}</h3>
                                        </div>
                                    </div>
                                    <ChevronRight className="shrink-0 text-white/55 transition-transform group-hover:translate-x-0.5" size={19} />
                                </div>
                                <p className="relative mt-3 text-xs font-medium leading-relaxed text-slate-200">{event.desc}</p>
                                <div className="relative mt-auto flex items-end justify-between gap-3 border-t border-white/10 pt-3">
                                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-white/55"><Clock size={11} />{event.endTime}</div>
                                    <div className="text-right"><span className="block text-[8px] font-black tracking-wider text-white/45">PRIZE</span><strong className="text-xs text-[#FFD700]">{event.prize}</strong></div>
                                </div>
                                {joined && <span className="absolute right-0 top-8 flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-1 text-[9px] font-black text-emerald-200"><Check size={10} />已報名</span>}
                            </div>
                        </button>
                    );
                })}
            </div>

            {activeStatus === 'ended' && (
                <LobbyModalSection className="mb-6 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-black text-[#FFD700]"><Trophy size={17} />活動獲獎名單</div>
                    {[['🥇', '玩家***旺', '400,000 銀幣'], ['🥈', '玩家***福', '200,000 銀幣'], ['🥉', '玩家***星', '100,000 銀幣']].map((row) => (
                        <div key={row[1]} className="grid grid-cols-[40px_1fr_auto] border-t border-white/5 py-2 text-xs">
                            <span>{row[0]}</span><span className="font-bold text-white">{row[1]}</span><span className="font-black text-[#FFD700]">{row[2]}</span>
                        </div>
                    ))}
                </LobbyModalSection>
            )}

            {selectedEvent && (
                <div className="juheng-modal-backdrop fixed inset-0 z-[150] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md" onMouseDown={(event) => event.target === event.currentTarget && setSelectedEvent(null)}>
                    <article className="juheng-modal-panel relative w-full max-w-lg overflow-hidden rounded-[26px] border border-white/15 bg-gradient-to-br from-[#27133f] to-[#10051f] shadow-2xl">
                        <div className={`relative overflow-hidden border-b border-white/10 bg-gradient-to-r p-6 ${selectedEvent.bg}`}>
                            <div className="absolute -bottom-12 right-0 opacity-10">{isValidElement(selectedEvent.icon) ? cloneElement(selectedEvent.icon, { size: 180 } as Record<string, unknown>) : selectedEvent.icon}</div>
                            <button type="button" onClick={() => setSelectedEvent(null)} aria-label="關閉活動詳情" className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white/70 hover:text-white"><X size={18} /></button>
                            <div className="relative pr-8"><StatusBadge status={selectedEvent.status} /><h2 className="mt-3 text-2xl font-black text-white">{selectedEvent.title}</h2><p className="mt-2 text-sm text-white/75">{selectedEvent.desc}</p></div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-3">
                                <InfoCell label="活動獎勵" value={selectedEvent.prize} />
                                <InfoCell label="活動期間" value={`${selectedEvent.startTime} ～ ${selectedEvent.endTime}`} />
                            </div>
                            <p className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs leading-7 text-slate-300">{selectedEvent.details}</p>
                            <LobbyModalButton
                                onClick={handleJoin}
                                disabled={selectedEvent.status === 'upcoming' || selectedEvent.status === 'ended' || joinedEventIds.includes(selectedEvent.id)}
                                className="mt-5"
                                fullWidth
                            >
                                {joinedEventIds.includes(selectedEvent.id)
                                    ? '已完成 Mock 報名'
                                    : selectedEvent.status === 'upcoming'
                                        ? '尚未開始'
                                        : selectedEvent.status === 'ended'
                                            ? '活動已結束'
                                            : '立即參與'}
                            </LobbyModalButton>
                        </div>
                    </article>
                </div>
            )}
        </div>
    );
};

const StatusBadge = ({ status }: { status: EventItem['status'] }) => {
    const style = status === 'active'
        ? 'bg-emerald-500/20 text-emerald-200 border-emerald-300/20'
        : status === 'ending'
            ? 'bg-orange-500/20 text-orange-200 border-orange-300/20'
            : status === 'upcoming'
                ? 'bg-blue-500/20 text-blue-200 border-blue-300/20'
                : 'bg-slate-500/20 text-slate-300 border-slate-300/15';
    const label = status === 'active' ? '進行中' : status === 'ending' ? '即將結束' : status === 'upcoming' ? '即將開始' : '已結束';
    return <span className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-black ${style}`}>{label}</span>;
};

const InfoCell = ({ label, value }: { label: string; value: string }) => (
    <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
        <div className="text-[9px] font-black tracking-wider text-slate-500">{label}</div>
        <div className="mt-1 text-xs font-black leading-relaxed text-white">{value}</div>
    </div>
);

export default EventListPanel;
