import { Play, Armchair, X } from 'lucide-react';
import type { Game } from '../../types';

interface GameLaunchModalProps {
    game: Game;
    onQuickPlay: () => void;
    onChooseSeat: () => void;
    onClose: () => void;
}

const GameLaunchModal = ({ game, onQuickPlay, onChooseSeat, onClose }: GameLaunchModalProps) => {
    return (
        <div className="absolute inset-0 z-[130] flex items-center justify-center">
            <button
                type="button"
                aria-label="關閉遊戲操作彈窗"
                className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
                onClick={onClose}
            />

            <div className="relative w-[360px] rounded-[30px] border border-white/10 bg-[#19092d]/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] animate-in fade-in zoom-in-95 duration-200">
                <button
                    type="button"
                    aria-label="關閉"
                    className="absolute right-4 top-4 text-white/50 transition-colors hover:text-white"
                    onClick={onClose}
                >
                    <X size={22} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-[26px] border border-white/10 bg-gradient-to-br ${game.image} text-4xl shadow-lg`}>
                        {game.icon}
                    </div>
                    <p className="text-[11px] uppercase tracking-[0.35em] text-white/35">Launch Flow</p>
                    <h3 className="mt-2 text-2xl font-black text-white">請選擇進場方式</h3>
                    <p className="mt-2 text-sm text-slate-400">
                        這裡作為遊戲啟動前的流程分歧點，供美術與前端對照互動邏輯。
                    </p>
                </div>

                <div className="mt-6 grid gap-3">
                    <button
                        type="button"
                        onClick={onQuickPlay}
                        className="flex items-center justify-between rounded-2xl border border-[#FFD700]/30 bg-[#FFD700]/15 px-5 py-4 text-left transition-all hover:scale-[1.01] hover:bg-[#FFD700]/20 active:scale-[0.99]"
                    >
                        <div>
                            <div className="text-lg font-black text-white">立即玩</div>
                            <div className="mt-1 text-xs text-[#ffe7a3]">直接切入 loading page 並進入遊戲</div>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFD700] text-black shadow-lg">
                            <Play size={18} fill="currentColor" />
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={onChooseSeat}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left transition-all hover:scale-[1.01] hover:bg-white/10 active:scale-[0.99]"
                    >
                        <div>
                            <div className="text-lg font-black text-white">選座位</div>
                            <div className="mt-1 text-xs text-slate-400">先查看座位狀態與數據，再決定是否入座</div>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white shadow-lg">
                            <Armchair size={18} />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameLaunchModal;
