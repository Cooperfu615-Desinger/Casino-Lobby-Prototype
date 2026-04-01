import { ChevronRight, ChevronLeft } from 'lucide-react';
import type { GameCategory } from '../../types';

export type LobbyCategoryId =
    | 'all'
    | 'event'
    | 'slots'
    | 'board'
    | 'arcade'
    | 'live'
    | 'crash'
    | 'fishing'
    | 'lottery';

export interface LobbyCategoryItem {
    id: LobbyCategoryId;
    label: string;
    shortLabel: string;
    icon: string;
    gameCategory?: GameCategory;
}

interface CategorySidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    activeCategory: LobbyCategoryId;
    onSelectCategory: (categoryId: LobbyCategoryId) => void;
    categoryCounts: Partial<Record<LobbyCategoryId, number>>;
}

export const LOBBY_CATEGORIES: LobbyCategoryItem[] = [
    { id: 'all', label: '全部遊戲 (All Games)', shortLabel: '全部', icon: '✨' },
    { id: 'event', label: '活動 (Event Games)', shortLabel: '活動', icon: '🔥' },
    { id: 'slots', label: '老虎機 (Slots)', shortLabel: '老虎機', icon: '🎰', gameCategory: 'slot' },
    { id: 'board', label: '棋牌 (Board/Card)', shortLabel: '棋牌', icon: '🃏', gameCategory: 'card' },
    { id: 'arcade', label: '電子 (Arcade)', shortLabel: '電子', icon: '🕹️' },
    { id: 'live', label: '真人 (Live Casino)', shortLabel: '真人', icon: '👩‍💼' },
    { id: 'crash', label: 'Crash(崩潰) (Crash)', shortLabel: 'Crash', icon: '📈' },
    { id: 'fishing', label: '魚機 (Fishing)', shortLabel: '魚機', icon: '🎣', gameCategory: 'fish' },
    { id: 'lottery', label: '樂透 (Lottery)', shortLabel: '樂透', icon: '🎱' },
];

const CategorySidebar = ({
    isOpen,
    onToggle,
    activeCategory,
    onSelectCategory,
    categoryCounts,
}: CategorySidebarProps) => {
    if (!isOpen) {
        return (
            <div className="absolute top-[154px] left-3 z-30">
                <button
                    type="button"
                    onClick={onToggle}
                    className="flex items-center justify-center w-10 h-10 bg-[#1a0b2e]/92 backdrop-blur-md border border-[#FFD700]/25 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.32)] text-[#FFD700] hover:text-white hover:bg-[#FFD700]/15 transition-all hover:scale-105 active:scale-95"
                    aria-label="展開分類"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 z-[120]">
            <div
                aria-hidden="true"
                className="absolute inset-0 animate-overlay-fade-in"
            />

            <div className="absolute left-3 top-[154px] w-[250px] rounded-[16px] border border-[#FFD700]/20 bg-[#140922]/96 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.52),0_0_24px_rgba(255,215,0,0.05)] overflow-hidden animate-category-panel-in">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,215,0,0.14),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(124,58,237,0.16),_transparent_36%)]" />

                <div className="relative flex items-center justify-between px-3 py-2.5 border-b border-white/10 bg-black/15">
                    <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/55">
                        Filter
                    </div>
                    <button
                        type="button"
                        onClick={onToggle}
                        className="flex h-6 w-6 items-center justify-center rounded-xl bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                        aria-label="收合分類"
                    >
                        <ChevronLeft size={14} />
                    </button>
                </div>

                <div className="relative max-h-[300px] overflow-y-auto px-2 py-2 no-scrollbar">
                    <div className="grid grid-cols-1 gap-1.2">
                        {LOBBY_CATEGORIES.map((cat) => {
                            const count = categoryCounts[cat.id] ?? 0;
                            const isActive = activeCategory === cat.id;
                            const isPlanned = cat.id !== 'all' && count === 0;

                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => onSelectCategory(cat.id)}
                                    aria-pressed={isActive}
                                    className={`flex items-center gap-2 px-2.5 py-2.5 w-full rounded-2xl text-left transition-all group active:scale-[0.98] border ${isActive
                                        ? 'bg-[#FFD700]/15 text-white border-[#FFD700]/35 shadow-[0_0_14px_rgba(255,215,0,0.08)]'
                                        : 'text-slate-300 border-transparent hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <span className="text-lg group-hover:scale-110 transition-transform">{cat.icon}</span>
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-[13px] font-bold">{cat.shortLabel}</div>
                                        <div className={`text-[12px] mt-0.5 ${isPlanned ? 'text-orange-300/80' : 'text-slate-500'}`}>
                                            {isPlanned ? 'P2' : `${count} 款`}
                                        </div>
                                    </div>
                                    <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[12px] font-bold ${isActive ? 'bg-[#FFD700] text-black' : 'bg-white/10 text-slate-300'
                                        }`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="relative border-t border-white/10 bg-black/15 px-3 py-2 text-[9px] text-slate-400">
                    <span className="text-white/45">目前：</span>
                    <span className="ml-1 font-bold text-[#FFD700]">
                        {LOBBY_CATEGORIES.find((category) => category.id === activeCategory)?.shortLabel}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CategorySidebar;
