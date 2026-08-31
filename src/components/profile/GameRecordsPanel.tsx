import { useMemo, useState, type ReactNode } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { GAMES } from '../../data/mockData';
import { LobbyModalButton } from '../common/LobbyModalPrimitives';

interface GameRecord {
    id: number;
    time: number;
    game: string;
    bet: number;
    win: number;
    balance: number;
}

const PAGE_SIZE = 10;
const DAY_IN_MS = 86_400_000;
const BET_OPTIONS = [50, 100, 200, 500, 1000];

const formatInputDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const createMockRecords = (today: Date): GameRecord[] => {
    let balance = 10_000_000;

    return Array.from({ length: 100 }, (_, index) => {
        const seed = (index * 37 + 17) % 101;
        const bet = BET_OPTIONS[seed % BET_OPTIONS.length];
        const win = ((seed * 73) % (bet * 4 + 1)) - bet;
        const dayOffset = (index * 11 + seed) % 31;
        const minuteOffset = (index * 47) % 1_440;
        balance = Math.max(balance + win, 0);

        return {
            id: index + 1,
            time: today.getTime() - dayOffset * DAY_IN_MS - minuteOffset * 60_000,
            game: GAMES[seed % GAMES.length]?.title ?? '未命名遊戲',
            bet,
            win,
            balance,
        };
    }).sort((a, b) => b.time - a.time);
};

const GameRecordsPanel = () => {
    const today = useMemo(() => new Date(), []);
    const earliestDate = useMemo(() => {
        const date = new Date(today);
        date.setDate(date.getDate() - 30);
        return date;
    }, [today]);
    const minDate = formatInputDate(earliestDate);
    const maxDate = formatInputDate(today);
    const [startDate, setStartDate] = useState(minDate);
    const [endDate, setEndDate] = useState(maxDate);
    const [records] = useState<GameRecord[]>(() => createMockRecords(today));
    const [results, setResults] = useState<GameRecord[]>([]);
    const [hasQueried, setHasQueried] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const rangeValid = Boolean(startDate && endDate && startDate <= endDate);
    const totalPages = Math.ceil(results.length / PAGE_SIZE);
    const pageStart = (currentPage - 1) * PAGE_SIZE;
    const pagedResults = results.slice(pageStart, pageStart + PAGE_SIZE);

    const handleQuery = () => {
        if (!rangeValid) return;
        const rangeStart = new Date(`${startDate}T00:00:00`).getTime();
        const rangeEnd = new Date(`${endDate}T23:59:59`).getTime();
        setResults(records.filter((record) => record.time >= rangeStart && record.time <= rangeEnd));
        setCurrentPage(1);
        setHasQueried(true);
    };

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div className="flex h-full min-h-0 flex-col animate-in slide-in-from-right duration-300">
            <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                    <p className="text-[9px] font-black tracking-[0.22em] text-white/55">GAME HISTORY</p>
                    <h3 className="mt-1 text-xl font-black text-white">遊戲紀錄</h3>
                    <p className="mt-1 text-xs leading-5 text-white/58">選擇最近 30 天內的開始與結束日期，查詢 Mock 遊戲紀錄。</p>
                </div>
                <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/16 bg-white/8 px-3 py-1.5 text-[10px] font-black text-white/54">
                    <CalendarDays size={12} /> 最近 30 天
                </span>
            </div>

            <div className="rounded-2xl border border-white/14 bg-[#263990]/24 p-4">
                <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
                    <DateField
                        id="game-record-start"
                        label="開始日期"
                        value={startDate}
                        min={minDate}
                        max={maxDate}
                        onChange={setStartDate}
                    />
                    <DateField
                        id="game-record-end"
                        label="結束日期"
                        value={endDate}
                        min={minDate}
                        max={maxDate}
                        onChange={setEndDate}
                    />
                    <LobbyModalButton onClick={handleQuery} disabled={!rangeValid} className="h-[42px] min-w-[105px] px-5">
                        <Search size={15} />
                        查詢
                    </LobbyModalButton>
                </div>
                {!rangeValid && startDate && endDate && (
                    <p className="mt-2 text-xs font-bold text-red-300">開始日期不可晚於結束日期</p>
                )}
            </div>

            <div className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/14 bg-[#263990]/24">
                {!hasQueried ? (
                    <EmptyState text="請選擇日期區間後查詢" />
                ) : results.length === 0 ? (
                    <EmptyState text="查無紀錄" />
                ) : (
                    <>
                        <div className="min-h-0 flex-1 overflow-auto custom-scrollbar">
                            <table className="w-full border-collapse text-xs">
                                <thead className="sticky top-0 z-10 bg-[#3449a6]/95 text-white/58 backdrop-blur-md">
                                    <tr>
                                        <th className="px-3 py-3 text-center font-bold">編號</th>
                                        <th className="px-3 py-3 text-left font-bold">遊戲名稱</th>
                                        <th className="px-3 py-3 text-right font-bold">投注額</th>
                                        <th className="px-3 py-3 text-right font-bold">贏分</th>
                                        <th className="px-3 py-3 text-right font-bold">錢包餘額</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pagedResults.map((record, index) => (
                                        <tr key={record.id} className="border-t border-white/7 text-white transition-colors hover:bg-white/7">
                                            <td className="px-3 py-2.5 text-center text-white/42">{pageStart + index + 1}</td>
                                            <td className="max-w-36 truncate px-3 py-2.5 font-bold">{record.game}</td>
                                            <td className="px-3 py-2.5 text-right font-mono">{record.bet.toLocaleString()}</td>
                                            <td className={`px-3 py-2.5 text-right font-mono font-black ${record.win > 0 ? 'text-emerald-200' : record.win < 0 ? 'text-red-200' : 'text-white/48'}`}>
                                                {record.win > 0 ? '+' : ''}{record.win.toLocaleString()}
                                            </td>
                                            <td className="px-3 py-2.5 text-right font-mono">{record.balance.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 border-t border-white/12 px-3 py-3">
                                <PageButton
                                    label="上一頁"
                                    disabled={currentPage === 1}
                                    onClick={() => goToPage(currentPage - 1)}
                                >
                                    <ChevronLeft size={15} />
                                </PageButton>
                                <span className="min-w-20 text-center text-xs font-bold text-white/68">
                                    {currentPage} / {totalPages}
                                </span>
                                <PageButton
                                    label="下一頁"
                                    disabled={currentPage === totalPages}
                                    onClick={() => goToPage(currentPage + 1)}
                                >
                                    <ChevronRight size={15} />
                                </PageButton>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

interface DateFieldProps {
    id: string;
    label: string;
    value: string;
    min: string;
    max: string;
    onChange: (value: string) => void;
}

const DateField = ({ id, label, value, min, max, onChange }: DateFieldProps) => (
    <label htmlFor={id} className="min-w-0">
        <span className="mb-1.5 block text-[10px] font-black tracking-wider text-white/55">{label}</span>
        <input
            id={id}
            type="date"
            value={value}
            min={min}
            max={max}
            onChange={(event) => onChange(event.target.value)}
            className="lobby-profile-field__input h-[42px] w-full rounded-xl px-3 text-xs font-bold"
        />
    </label>
);

interface PageButtonProps {
    label: string;
    disabled: boolean;
    onClick: () => void;
    children: ReactNode;
}

const PageButton = ({ label, disabled, onClick, children }: PageButtonProps) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/18 bg-white/9 text-white transition-colors hover:bg-white/16 disabled:cursor-not-allowed disabled:opacity-30"
    >
        {children}
    </button>
);

const EmptyState = ({ text }: { text: string }) => (
    <div className="flex flex-1 items-center justify-center px-4 py-12 text-center text-sm font-bold text-white/42">
        {text}
    </div>
);

export default GameRecordsPanel;
