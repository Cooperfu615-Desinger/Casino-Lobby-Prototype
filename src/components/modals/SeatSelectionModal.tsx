import { useEffect, useState } from 'react';
import { X, UserRound, Gamepad2 } from 'lucide-react';
import { GAME_SEATS } from '../../data/mockData';
import { useUI } from '../../context/UIContext';
import type { Game, GameSeat } from '../../types';

type SeatFilterMode = 'all' | 'available';

interface SeatSelectionModalProps {
    game: Game;
    onClose: () => void;
    onEnterSeat: (seat: GameSeat) => void;
}

const SEAT_PAGES = [1, 2, 3];

const SeatSelectionModal = ({ game, onClose, onEnterSeat }: SeatSelectionModalProps) => {
    const { showToast } = useUI();
    const [activePage, setActivePage] = useState(1);
    const [filterMode, setFilterMode] = useState<SeatFilterMode>('all');
    const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
    const [reservedSeatIds, setReservedSeatIds] = useState<string[]>([]);

    const pageSeats = GAME_SEATS.filter((seat) => seat.page === activePage);
    const visibleSeats = filterMode === 'available'
        ? pageSeats.filter((seat) => !seat.isOccupied)
        : pageSeats;
    const selectedSeat = visibleSeats.find((seat) => seat.id === selectedSeatId)
        ?? pageSeats.find((seat) => seat.id === selectedSeatId)
        ?? null;

    useEffect(() => {
        if (visibleSeats.some((seat) => seat.id === selectedSeatId && !seat.isOccupied)) {
            return;
        }

        const nextSeat = visibleSeats.find((seat) => !seat.isOccupied) ?? null;
        setSelectedSeatId(nextSeat?.id ?? null);
    }, [activePage, filterMode, selectedSeatId, visibleSeats]);

    const handleReserve = () => {
        if (!selectedSeat) return;

        if (reservedSeatIds.includes(selectedSeat.id)) {
            showToast(`座位 ${selectedSeat.seatNo} 已保留`, 'info');
            return;
        }

        setReservedSeatIds((prev) => [...prev, selectedSeat.id]);
        showToast(`已保留 ${selectedSeat.seatNo} 號座位`, 'success');
    };

    return (
        <div className="absolute inset-0 z-[140] flex items-center justify-center">
            <button
                type="button"
                aria-label="關閉選座位介面"
                className="absolute inset-0 bg-black/60 backdrop-blur-[3px]"
                onClick={onClose}
            />

            <div className="relative flex h-[660px] w-[1160px] rounded-[12px] border border-white/10 bg-[#f4f2f5] shadow-[0_28px_90px_rgba(0,0,0,0.45)] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                <div className="flex flex-1 flex-col px-6 pb-5 pt-5">
                    <div className="flex items-center justify-between border-b border-black/8 pb-2">
                        <div className="flex items-center gap-4">
                            <h2 className="text-[20px] font-black tracking-tight text-[#5f5d62]">選擇座位</h2>
                            <div className="flex items-center gap-2">
                                <FilterButton
                                    active={filterMode === 'all'}
                                    label="顯示全部"
                                    onClick={() => setFilterMode('all')}
                                />
                                <FilterButton
                                    active={filterMode === 'available'}
                                    label="顯示空位"
                                    onClick={() => setFilterMode('available')}
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            aria-label="關閉"
                            onClick={onClose}
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#77777a] text-white transition-all hover:scale-105 hover:bg-[#5e5e61]"
                        >
                            <X size={24} strokeWidth={3} />
                        </button>
                    </div>

                    <div className="grid flex-1 grid-cols-[minmax(0,1fr)_440px] gap-4 pt-4 min-h-0">
                        <div className="flex min-w-0 flex-1 flex-col">
                            <div className="grid grid-cols-6 gap-2">
                                {visibleSeats.map((seat) => {
                                    const isReserved = reservedSeatIds.includes(seat.id);
                                    const isSelected = selectedSeat?.id === seat.id;
                                    const isDisabled = seat.isOccupied;

                                    return (
                                        <button
                                            key={seat.id}
                                            type="button"
                                            onClick={() => !isDisabled && setSelectedSeatId(seat.id)}
                                            disabled={isDisabled}
                                            className={`relative flex h-[90px] flex-col items-center justify-between rounded-[8px] border px-1 py-1 text-center transition-all ${isDisabled
                                                ? 'cursor-not-allowed border-transparent bg-[#d8d6d8] text-[#c0bec2] opacity-95'
                                                : isSelected
                                                    ? 'border-[#ff7f87] bg-[#ff5f66] text-white shadow-[0_12px_28px_rgba(255,95,102,0.35)]'
                                                    : isReserved
                                                        ? 'border-[#f7a941] bg-[#fff0d8] text-[#8b5b16]'
                                                        : 'border-transparent bg-[#b9b8bc] text-white hover:scale-[1.02] hover:bg-[#aeadb2]'} `}
                                        >
                                            <span className={`text-[10px] font-black tracking-[0.08em] ${isDisabled ? 'text-[#b8b6bb]' : isSelected ? 'text-white/90' : isReserved ? 'text-[#c77c1d]' : 'text-white/85'}`}>
                                                {seat.seatNo}
                                            </span>

                                            <div className="flex flex-1 items-center justify-center">
                                                {isDisabled ? (
                                                    <div className="flex flex-col items-center gap-1">
                                                        <UserRound size={25} className="text-[#f8f7f8]" strokeWidth={1.75} />
                                                        <span className="text-[6px] font-bold uppercase tracking-[0.14em] text-[#f8f7f8]/90">Occupied</span>
                                                    </div>
                                                ) : (
                                                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${isSelected ? 'border-white/30 bg-white/10' : isReserved ? 'border-[#f5b55a]/40 bg-white/40' : 'border-white/15 bg-black/10'}`}>
                                                        <Gamepad2 size={30} className={isSelected ? 'text-white' : isReserved ? 'text-[#b17215]' : 'text-white/85'} />
                                                    </div>
                                                )}
                                            </div>

                                            <div className={`${isDisabled ? 'text-[#ecebed]' : isSelected ? 'text-white' : isReserved ? 'text-[#a96b14]' : 'text-white'} text-[11px] font-black`}>
                                                {seat.rtp.toFixed(2)}%
                                            </div>

                                            {isReserved && !isSelected && (
                                                <div className="absolute right-2 top-2 rounded-full bg-[#f7a941] px-2 py-1 text-[9px] font-black text-white">
                                                    保留中
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-3 flex items-center justify-center gap-2.5">
                                {SEAT_PAGES.map((page) => (
                                    <button
                                        key={page}
                                        type="button"
                                        onClick={() => setActivePage(page)}
                                        className={`h-11 min-w-11 rounded-2xl px-4 text-lg font-black transition-all ${activePage === page
                                            ? 'bg-[#8d8c90] text-white shadow-md'
                                            : 'bg-[#d0cfd4] text-white/80 hover:bg-[#c0bfc5]'}`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <aside className="flex flex-col min-h-0">
                            <div className="flex-1 rounded-[14px] bg-gradient-to-b from-[#ffd3d6] to-[#ffbcc2] p-3 text-[#ff4d58] shadow-inner overflow-hidden">
                                {selectedSeat ? (
                                    <>
                                        <div className="rounded-[10px] bg-white/35 px-4 py-4 shadow-sm">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <div className="text-[12px] font-black uppercase tracking-[0.28em] text-[#c76b74]">Seat Selected</div>
                                                    <div className="mt-1 text-[45px] font-black leading-none text-[#ff4d58]">{selectedSeat.seatNo}</div>
                                                </div>
                                                <div className="rounded-full bg-white/60 px-5 py-1 text-[14px] font-black text-[#d65661]">
                                                    {reservedSeatIds.includes(selectedSeat.id) ? '已保留' : '可入座'}
                                                </div>
                                            </div>
                                            <div className="mt-4 grid grid-cols-2 gap-4">
                                                <SummaryPill label="當前 RTP" value={`${selectedSeat.rtp.toFixed(2)}%`} />
                                                <SummaryPill label="座位狀態" value={selectedSeat.isOccupied ? '使用中' : '空位'} />
                                            </div>
                                        </div>

                                        <StatsTable
                                            className="mt-4"
                                            rows={[
                                                {
                                                    label: 'FreeGame',
                                                    values: [
                                                        { label: '', value: formatInteger(selectedSeat.freeGame.unopened) },
                                                        { label: '', value: formatInteger(selectedSeat.freeGame.previousOne) },
                                                        { label: '', value: formatInteger(selectedSeat.freeGame.previousTwo) },
                                                    ],
                                                },
                                                {
                                                    label: 'RTP',
                                                    values: [
                                                        { label: '', value: `${selectedSeat.rtpAverage.today.toFixed(2)}%` },
                                                        { label: '', value: `${selectedSeat.rtpAverage.threeDay.toFixed(2)}%` },
                                                        { label: '', value: `${selectedSeat.rtpAverage.sevenDay.toFixed(2)}%` },
                                                    ],
                                                },
                                                {
                                                    label: 'HitRate',
                                                    values: [
                                                        { label: '', value: `${selectedSeat.hitRate.today.toFixed(2)}%` },
                                                        { label: '', value: `${selectedSeat.hitRate.threeDay.toFixed(2)}%` },
                                                        { label: '', value: `${selectedSeat.hitRate.sevenDay.toFixed(2)}%` },
                                                    ],
                                                },
                                                {
                                                    label: 'TotalBet',
                                                    values: [
                                                        { label: '', value: formatCompactNumber(selectedSeat.totalBet.today) },
                                                        { label: '', value: formatCompactNumber(selectedSeat.totalBet.threeDay) },
                                                        { label: '', value: formatCompactNumber(selectedSeat.totalBet.sevenDay) },
                                                    ],
                                                },
                                            ]}
                                        />

                                        <div className="mt-2 rounded-2xl bg-white/35 px-4 py-2 text-[12px] font-bold leading-snug text-[#b54750]">
                                            {reservedSeatIds.includes(selectedSeat.id)
                                                ? '目前狀態：此座位已被你保留，可直接入座。'
                                                : '目前狀態：此座位空位中，可先保留或直接入座。'}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center text-center">
                                        <div className="text-6xl">{game.icon}</div>
                                        <div className="mt-5 text-3xl font-black text-[#ff5f66]">請先選擇座位</div>
                                        <p className="mt-3 text-sm leading-relaxed text-[#b85f67]">
                                            左側每個座位會顯示 RTP 與占位狀態，點選後可在這裡查看詳細資訊。
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={handleReserve}
                                    disabled={!selectedSeat}
                                    className="rounded-[24px] bg-[#f6aeb6] px-4 py-4 text-[26px] font-black text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {selectedSeat && reservedSeatIds.includes(selectedSeat.id) ? '已保留' : '保留'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => selectedSeat && onEnterSeat(selectedSeat)}
                                    disabled={!selectedSeat}
                                    className="rounded-[24px] bg-[#ff5a63] px-4 py-4 text-[26px] font-black text-white shadow-[0_12px_24px_rgba(255,90,99,0.28)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    入座
                                </button>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface FilterButtonProps {
    active: boolean;
    label: string;
    onClick: () => void;
}

const FilterButton = ({ active, label, onClick }: FilterButtonProps) => (
    <button
        type="button"
        onClick={onClick}
        className={`rounded-2xl px-5 py-2.5 text-[17px] font-black transition-all ${active
            ? 'bg-[#6d6c70] text-white shadow-md'
            : 'bg-[#d9d8dc] text-[#b7b6bb] hover:bg-[#c9c8cd]'}`}
    >
        {label}
    </button>
);

interface SummaryPillProps {
    label: string;
    value: string;
}

const SummaryPill = ({ label, value }: SummaryPillProps) => (
    <div className="rounded-2xl bg-white/45 px-4 py-2">
        <div className="text-[11px] font-black text-[#cf6b74]">{label}</div>
        <div className="mt-1 text-[20px] font-black leading-none text-[#ff4d58]">{value}</div>
    </div>
);

interface StatsTableProps {
    rows: Array<{
        label: string;
        values: Array<{
            label: string;
            value: string;
        }>;
    }>;
    className?: string;
}

const StatsTable = ({ rows, className = '' }: StatsTableProps) => (
    <div className={`overflow-hidden rounded-[12px] border border-white/12 bg-white/10 ${className}`}>
        <div className="grid grid-cols-[86px_repeat(3,minmax(0,1fr))]">
            <div className="border-b border-white/25 bg-white/10 px-2.5 py-2.5 text-[12px] font-black text-white">
                類別
            </div>
            <div className="border-b border-l border-white/25 bg-white/10 px-2 py-2.5 text-center text-[12px] font-black text-white">
                今 / 未開
            </div>
            <div className="border-b border-l border-white/25 bg-white/10 px-2 py-2.5 text-center text-[12px] font-black text-white">
                3日 / 前1
            </div>
            <div className="border-b border-l border-white/25 bg-white/10 px-2 py-2.5 text-center text-[12px] font-black text-white">
                7日 / 前2
            </div>

            {rows.map((row) => (
                <TableRow key={row.label} row={row} />
            ))}
        </div>
    </div>
);

interface TableRowProps {
    row: {
        label: string;
        values: Array<{
            label: string;
            value: string;
        }>;
    };
}

const TableRow = ({ row }: TableRowProps) => (
    <>
        <div className="border-b border-white/20 px-2.5 py-2.5 text-[13px] font-black text-white">
            {row.label}
        </div>
        {row.values.map((item, index) => (
            <div
                key={`${row.label}-${index}`}
                className={`border-b border-white/20 px-2 py-2.5 text-center ${index > 0 ? 'border-l border-white/20' : 'border-l border-white/25'}`}
            >
                <div className="text-[11px] font-bold text-white/80">{item.label}</div>
                <div className="mt-1 break-words text-[13px] font-black leading-tight text-[#ff4050]">
                    {item.value}
                </div>
            </div>
        ))}
    </>
);

const formatInteger = (value: number) => new Intl.NumberFormat('en-US').format(value);
const formatCompactNumber = (value: number) => new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
}).format(value);

export default SeatSelectionModal;
