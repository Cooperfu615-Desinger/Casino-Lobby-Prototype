import { ChevronRight, ChevronLeft } from 'lucide-react';

interface CategorySidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

const CATEGORIES = [
    { id: 'slots', label: '老虎機 (Slots)', icon: '🎰' },
    { id: 'board', label: '棋牌 (Board/Card)', icon: '🃏' },
    { id: 'arcade', label: '電子 (Arcade)', icon: '🕹️' },
    { id: 'live', label: '真人 (Live Casino)', icon: '👩‍💼' },
    { id: 'crash', label: 'Crash(崩潰) (Crash)', icon: '📈' },
    { id: 'fishing', label: '魚機 (Fishing)', icon: '🎣' },
    { id: 'lottery', label: '樂透 (Lottery)', icon: '🎱' },
];

const CategorySidebar = ({ isOpen, onToggle }: CategorySidebarProps) => {
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
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => console.log('篩選類別:', cat.label)}
                            className="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-left text-sm text-slate-300 font-medium
                                     hover:bg-white/10 hover:text-white transition-all group active:scale-[0.98]"
                        >
                            <span className="text-xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                            <span className="truncate">{cat.label}</span>
                        </button>
                    ))}
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
