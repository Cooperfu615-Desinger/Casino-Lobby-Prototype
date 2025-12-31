import { X } from 'lucide-react';

interface TournamentModalProps {
    onClose: () => void;
}

const TournamentModal = ({ onClose }: TournamentModalProps) => (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
        <div className="w-[80%] max-w-2xl bg-[#1a0b2e] rounded-3xl border-2 border-[#FFD700] shadow-[0_0_50px_rgba(255,215,0,0.2)] flex flex-col overflow-hidden relative">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-2 transition-all"
            >
                <X size={24} />
            </button>

            <div className="h-32 bg-gradient-to-r from-orange-600 to-red-600 flex items-center px-8 relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="relative z-10">
                    <span className="bg-black/30 text-[#FFD700] text-xs font-bold px-3 py-1 rounded-full border border-[#FFD700]/30 mb-2 inline-block">
                        SEASON 8
                    </span>
                    <h2 className="text-3xl font-black text-white italic">TIGER RUSH CUP</h2>
                    <p className="text-white/80 text-sm">爭奪總獎金 10,000,000</p>
                </div>
            </div>

            <div className="flex-1 p-8 flex gap-8 items-center">
                <div className="w-40 h-40 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-[#FFD700] transform rotate-3">
                    <span className="text-6xl">🐯</span>
                </div>

                <div className="flex-1 space-y-4">
                    <div>
                        <h4 className="text-[#FFD700] font-bold text-sm uppercase mb-1">比賽規則</h4>
                        <p className="text-slate-300 text-xs leading-relaxed">
                            在活動期間內遊玩《Lucky Tiger Rush》，單筆中獎倍率越高，積分越高。前 100 名玩家將瓜分千萬獎金池！
                        </p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-3 flex justify-between items-center border border-white/10">
                        <div className="text-center">
                            <div className="text-xs text-slate-500">目前排名</div>
                            <div className="text-white font-bold">--</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xs text-slate-500">我的積分</div>
                            <div className="text-[#FFD700] font-bold">0</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xs text-slate-500">剩餘時間</div>
                            <div className="text-white font-bold">23h 15m</div>
                        </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-[#FFD700] to-[#DAA520] text-black font-black py-3 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all">
                        立即參賽
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default TournamentModal;
