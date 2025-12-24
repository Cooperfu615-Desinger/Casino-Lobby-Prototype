import { useState } from 'react';
import { ChevronLeft, Trophy, Coins, Zap, LayoutTemplate, Banknote, Timer, Gift, CheckCircle } from 'lucide-react';
import { CLUB_REWARDS_ITEMS, USER_CLUB_STATS, ClubRewardItem } from '../data/mockData';

interface ClubRewardsProps {
    onBack: () => void;
}

const ClubRewards = ({ onBack }: ClubRewardsProps) => {
    const [stats, setStats] = useState(USER_CLUB_STATS);
    const [toast, setToast] = useState<{ show: boolean, msg: string } | null>(null);

    const handleRedeem = (item: ClubRewardItem) => {
        if (stats.currentPoints >= item.cost) {
            setStats(prev => ({
                ...prev,
                currentPoints: prev.currentPoints - item.cost
            }));

            setToast({ show: true, msg: `成功兌換：${item.title}` });
            setTimeout(() => setToast(null), 3000);
        }
    };

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Spin': return <Timer className="text-purple-400" size={32} />;
            case 'Cash': return <Banknote className="text-green-400" size={32} />;
            case 'Frame': return <LayoutTemplate className="text-[#FFD700]" size={32} />;
            case 'Exp': return <Zap className="text-blue-400" size={32} />;
            default: return <Gift className="text-pink-400" size={32} />;
        }
    };

    const contributionProgress = (stats.currentPoints % 1000) / 1000 * 100;

    return (
        <div className="flex w-full h-full bg-[#120822] animate-in slide-in-from-right duration-300 relative">

            {/* Left Panel: Stats & Navigation */}
            <div className="w-[35%] bg-[#0f061e] border-r border-white/10 flex flex-col p-6 relative">
                <button
                    onClick={onBack}
                    className="absolute top-6 left-6 p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors flex items-center gap-2"
                >
                    <ChevronLeft size={24} />
                    <span className="text-sm font-bold">Back</span>
                </button>

                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="mb-2">
                        <Trophy size={48} className="text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]" />
                    </div>
                    <h2 className="text-2xl font-black text-white italic tracking-wider mb-8">CLUB REWARDS</h2>

                    <div className="bg-[#1a0b2e] rounded-3xl p-8 border border-white/5 shadow-2xl w-full">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">Your Balance</p>
                        <div className="flex items-center justify-center gap-3 mb-8">
                            <Coins size={36} className="text-[#FFD700]" />
                            <span className="text-5xl font-black text-white tracking-tighter">
                                {stats.currentPoints.toLocaleString()}
                            </span>
                        </div>

                        <div className="text-left bg-black/40 rounded-xl p-4 border border-white/5">
                            <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="text-slate-300">本週貢獻</span>
                                <span className="text-[#FFD700]">{Math.floor(contributionProgress * 10)} / 1000</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                                <div
                                    className="h-full bg-gradient-to-r from-[#FFD700] to-orange-500 transition-all duration-500"
                                    style={{ width: `${contributionProgress}%` }}
                                ></div>
                            </div>
                            <p className="text-[10px] text-slate-500 text-right">
                                再獲得 {1000 - Math.floor(contributionProgress * 10)} 積分可解鎖每週禮包
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel: Shop Grid */}
            <div className="flex-1 bg-[#160b29] flex flex-col overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <h3 className="text-white font-bold text-xl flex items-center gap-2">
                        <Gift size={24} className="text-pink-500" />
                        兌換商店
                    </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {CLUB_REWARDS_ITEMS.map((item) => {
                            const canAfford = stats.currentPoints >= item.cost;
                            return (
                                <div key={item.id} className="bg-[#1a0b2e] border border-white/10 rounded-2xl p-4 flex flex-col items-center hover:border-blue-500/30 transition-colors group relative overflow-hidden">
                                    {item.stock && (
                                        <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm">
                                            剩 {item.stock}
                                        </div>
                                    )}

                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors group-hover:scale-110 duration-300">
                                        {getIcon(item.icon)}
                                    </div>
                                    <h4 className="text-white font-bold text-sm text-center mb-1 line-clamp-1">{item.title}</h4>
                                    <div className="flex items-center gap-1 mb-4">
                                        <Coins size={12} className={canAfford ? "text-[#FFD700]" : "text-slate-500"} />
                                        <span className={`text-sm font-mono font-bold ${canAfford ? "text-[#FFD700]" : "text-slate-500"}`}>
                                            {item.cost.toLocaleString()}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleRedeem(item)}
                                        disabled={!canAfford}
                                        className={`w-full py-2 rounded-lg font-bold text-xs transition-all ${canAfford
                                                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg active:scale-95'
                                                : 'bg-white/5 text-slate-600 cursor-not-allowed'
                                            }`}
                                    >
                                        {canAfford ? '兌換' : '積分不足'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {toast && (
                <div className="absolute top-8 right-8 bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-in slide-in-from-right-5 fade-in z-50">
                    <CheckCircle size={20} className="text-white" />
                    <span className="font-bold text-sm">{toast.msg}</span>
                </div>
            )}
        </div>
    );
};

export default ClubRewards;
