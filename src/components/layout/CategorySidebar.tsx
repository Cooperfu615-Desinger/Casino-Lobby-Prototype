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
    if (!isOpen) {
        return (
            <div className="absolute top-[142px] left-6 z-30">
                <button
                    type="button"
                    onClick={onToggle}
                    className="flex items-center justify-center w-12 h-12 bg-[#1a0b2e]/92 backdrop-blur-md border border-[#FFD700]/30 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] text-[#FFD700] hover:text-white hover:bg-[#FFD700]/20 transition-all hover:scale-105 active:scale-95"
                    aria-label="展開分類"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 z-40">
            <button
                type="button"
                aria-label="關閉分類選單"
                className="absolute inset-0 bg-black/55 backdrop-blur-[3px] animate-overlay-fade-in"
                onClick={onToggle}
            />

            <div className="absolute left-6 top-[142px] w-[340px] rounded-[28px] border border-[#FFD700]/20 bg-[#1a0b2e]/96 backdrop-blur-xl shadow-[0_28px_80px_rgba(0,0,0,0.55),0_0_50px_rgba(255,215,0,0.08)] overflow-hidden animate-category-panel-in">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,215,0,0.16),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(124,58,237,0.22),_transparent_36%)]" />
                <div className="border-b border-white/10 bg-black/20 px-5 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <div className="text-white/60 text-[11px] font-bold uppercase tracking-[0.3em]">
                                Game Filter
                            </div>
                            <div className="mt-1 text-xl font-black text-white">遊戲分類</div>
                            <p className="mt-1 text-xs leading-relaxed text-slate-400">
                                以覆蓋式面板展示分類，方便快速切換而不影響主畫面閱讀。
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onToggle}
                            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                            aria-label="收合分類"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    </div>
                </div>

                <div className="relative max-h-[420px] overflow-y-auto px-4 py-4 no-scrollbar">
                    <div className="grid grid-cols-1 gap-2.5">
                        {LOBBY_CATEGORIES.map((cat) => {
                            const count = categoryCounts[cat.id] ?? 0;
                            const isActive = activeCategory === cat.id;
                            const isPlanned = cat.id !== 'all' && count === 0;

                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => {
                                        onSelectCategory(cat.id);
                                        onToggle();
                                    }}
                                    aria-pressed={isActive}
                                    className={`flex items-center gap-3 px-4 py-3.5 w-full rounded-2xl text-left text-sm font-medium transition-all group active:scale-[0.98] border ${
                                        isActive
                                            ? 'bg-[#FFD700]/15 text-white border-[#FFD700]/40 shadow-[0_0_20px_rgba(255,215,0,0.08)]'
                                            : 'text-slate-300 border-transparent hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate font-bold">{cat.label}</div>
                                        <div className={`text-[11px] mt-1 ${isPlanned ? 'text-orange-300/80' : 'text-slate-500'}`}>
                                            {isPlanned ? 'Phase 2 規劃中' : `目前展示 ${count} 款`}
                                        </div>
                                    </div>
                                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                        isActive ? 'bg-[#FFD700] text-black' : 'bg-white/10 text-slate-300'
                                    }`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="border-t border-white/10 bg-black/20 px-5 py-3.5 text-xs text-slate-400">
                    目前選擇：
                    <span className="ml-2 font-bold text-[#FFD700]">
                        {LOBBY_CATEGORIES.find((category) => category.id === activeCategory)?.label}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CategorySidebar;
