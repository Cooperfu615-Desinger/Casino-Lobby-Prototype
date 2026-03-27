import { ChevronRight, ChevronLeft } from 'lucide-react';
import type { GameCategory } from '../../types';

export type LobbyCategoryId =
    | 'all'
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
    { id: 'all', label: '全部遊戲 (All Games)', icon: '✨' },
    { id: 'slots', label: '老虎機 (Slots)', icon: '🎰', gameCategory: 'slot' },
    { id: 'board', label: '棋牌 (Board/Card)', icon: '🃏', gameCategory: 'card' },
    { id: 'arcade', label: '電子 (Arcade)', icon: '🕹️' },
    { id: 'live', label: '真人 (Live Casino)', icon: '👩‍💼' },
    { id: 'crash', label: 'Crash(崩潰) (Crash)', icon: '📈' },
    { id: 'fishing', label: '魚機 (Fishing)', icon: '🎣', gameCategory: 'fish' },
    { id: 'lottery', label: '樂透 (Lottery)', icon: '🎱' },
];

const CategorySidebar = ({
    isOpen,
    onToggle,
    activeCategory,
    onSelectCategory,
    categoryCounts,
}: CategorySidebarProps) => {
    return (
        <div
            className={`absolute top-[130px] bottom-[90px] z-30 flex transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-[240px]'
                }`}
        >
            {/* Sidebar Content */}
            <div className="w-[240px] h-full bg-[#1a0b2e]/95 backdrop-blur-md border-r border-[#FFD700]/20 shadow-[4px_0_24px_rgba(0,0,0,0.5)] flex flex-col py-4 px-3 overflow-y-auto no-scrollbar">
                <div className="text-white/60 text-xs font-bold uppercase tracking-widest pl-2 mb-4">
                    遊戲分類
                </div>
                <div className="flex flex-col gap-2">
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
                                className={`flex items-center gap-3 px-3 py-3 w-full rounded-xl text-left text-sm font-medium transition-all group active:scale-[0.98] border ${
                                    isActive
                                        ? 'bg-[#FFD700]/15 text-white border-[#FFD700]/40 shadow-[0_0_20px_rgba(255,215,0,0.08)]'
                                        : 'text-slate-300 border-transparent hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                <span className="text-xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                                <div className="min-w-0 flex-1">
                                    <div className="truncate">{cat.label}</div>
                                    <div className={`text-[10px] mt-0.5 ${isPlanned ? 'text-orange-300/80' : 'text-slate-500'}`}>
                                        {isPlanned ? 'Phase 2 規劃中' : `目前展示 ${count} 款`}
                                    </div>
                                </div>
                                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                    isActive ? 'bg-[#FFD700] text-black' : 'bg-white/10 text-slate-300'
                                }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Toggle Button */}
            <div className="absolute top-6 -right-10">
                <button
                    onClick={onToggle}
                    className="flex items-center justify-center w-10 h-12 bg-[#1a0b2e]/90 backdrop-blur-md border-y border-r border-[#FFD700]/30 
                             rounded-r-xl shadow-[4px_0_12px_rgba(0,0,0,0.5)] text-[#FFD700] hover:text-white hover:bg-[#FFD700]/20 transition-all"
                    aria-label={isOpen ? "收合分類" : "展開分類"}
                >
                    {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
                </button>
            </div>
        </div>
    );
};

export default CategorySidebar;
