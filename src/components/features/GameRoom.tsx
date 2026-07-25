import { useMemo, useState } from 'react';
import { Armchair, CheckCircle2, Gauge, LogOut, WalletCards } from 'lucide-react';
import slotBg from '../../assets/slot_demo.jpg';
import { useAuth } from '../../context/AuthContext';
import { useRewardCards } from '../../context/RewardCardContext';
import { useUI } from '../../context/UIContext';
import type { GameSession, RewardCardCurrency } from '../../types';
import { buildGameWalletOptions, getGameWalletLabel } from '../../utils/gameWallets';
import BrandLoading from '../layout/BrandLoading';

interface GameRoomProps {
    session: GameSession;
    onExit: () => void;
}

const GameRoom = ({ session, onExit }: GameRoomProps) => {
    const { user } = useAuth();
    const {
        availableActivityGoldBalance,
        availableActivitySilverBalance,
        getActiveCardByCurrency,
        completeRewardCardConversion,
    } = useRewardCards();
    const { showToast } = useUI();
    const [isGameLoading, setIsGameLoading] = useState(true);

    const walletOptions = useMemo(() => buildGameWalletOptions({
        stored: user?.balance ?? { gold: 0, silver: 0, bronze: 0 },
        activityGold: availableActivityGoldBalance,
        activitySilver: availableActivitySilverBalance,
    }), [availableActivityGoldBalance, availableActivitySilverBalance, user?.balance]);
    const selectedWallet = walletOptions.find(option => option.key === session.wallet);
    const rewardCardCurrency: RewardCardCurrency | null = session.wallet === 'activity-gold'
        ? 'activity-gold'
        : session.wallet === 'activity-silver'
            ? 'activity-silver'
            : null;
    const activeRewardCard = rewardCardCurrency
        ? getActiveCardByCurrency(rewardCardCurrency)
        : null;

    const handleCompleteTurnover = () => {
        if (!activeRewardCard) {
            showToast('目前沒有可完成流水的啟用中獎勵卡', 'error');
            return;
        }

        const notice = completeRewardCardConversion(activeRewardCard.id);
        if (!notice) {
            showToast('流水完成操作失敗，請返回獎勵卡確認狀態', 'error');
            return;
        }
        showToast(`${notice.cardTitle} 已完成流水並自動入帳`, 'success');
    };

    if (isGameLoading) {
        return <BrandLoading onFinished={() => setIsGameLoading(false)} />;
    }

    return (
        <div className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-black text-white animate-in fade-in duration-500">
            <header className="absolute inset-x-0 top-0 z-50 flex items-start justify-between gap-4 bg-gradient-to-b from-black/90 via-black/55 to-transparent px-6 pb-12 pt-5">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#FFD700]/30 bg-[#2a163c]/90 text-2xl shadow-lg">
                        {session.game.icon}
                    </div>
                    <div className="min-w-0">
                        <p className="text-[8px] font-black tracking-[0.22em] text-[#FFD700]">LIVE GAME SESSION</p>
                        <h1 className="truncate text-lg font-black">{session.game.title}</h1>
                        <p className="text-[10px] font-bold text-slate-400">
                            {session.game.provider}{session.seat ? `・機台 ${session.seat.seatNo}` : '・快速配置機台'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-[#18092b]/90 px-3 py-2 shadow-lg backdrop-blur-md">
                        <WalletCards size={16} className="text-[#FFD700]" />
                        <div>
                            <p className="text-[8px] font-black text-slate-400">{getGameWalletLabel(session.wallet)}</p>
                            <strong className="block text-sm font-black text-white">
                                {(selectedWallet?.balance ?? 0).toLocaleString()}
                            </strong>
                        </div>
                    </div>
                    {session.seat && (
                        <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-[#18092b]/90 px-3 py-2 shadow-lg backdrop-blur-md">
                            <Armchair size={16} className="text-purple-300" />
                            <div>
                                <p className="text-[8px] font-black text-slate-400">已選機台</p>
                                <strong className="block text-sm font-black">{session.seat.seatNo}</strong>
                            </div>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={onExit}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-300/20 bg-red-600/80 text-white shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-red-500 active:scale-95"
                        title="離開遊戲"
                        aria-label="離開遊戲"
                    >
                        <LogOut size={21} />
                    </button>
                </div>
            </header>

            <main className="relative flex flex-1 items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-black opacity-10" />
                <img
                    src={slotBg}
                    alt={`${session.game.title} 遊戲畫面`}
                    className="h-full w-full object-cover"
                />

                {rewardCardCurrency && (
                    <aside className="absolute bottom-6 left-1/2 z-40 w-[min(520px,calc(100%-32px))] -translate-x-1/2 rounded-[22px] border border-[#FFD700]/25 bg-gradient-to-r from-[#21103a]/95 to-[#10051f]/95 p-3 shadow-2xl backdrop-blur-xl">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFD700]/12 text-[#FFD700]">
                                {activeRewardCard ? <Gauge size={19} /> : <CheckCircle2 size={19} />}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="text-[8px] font-black tracking-[0.18em] text-[#FFD700]">REWARD CARD MOCK</p>
                                <h2 className="truncate text-xs font-black">
                                    {activeRewardCard ? activeRewardCard.title : '本次獎勵卡已完成或失效'}
                                </h2>
                                <p className="mt-0.5 text-[9px] text-slate-400">
                                    {activeRewardCard
                                        ? '原型操作：模擬達成完整流水後自動結算'
                                        : '返回大廳可查看獎勵卡或銀行紀錄'}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleCompleteTurnover}
                                disabled={!activeRewardCard}
                                className="shrink-0 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-4 py-3 text-[10px] font-black text-black shadow-lg transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
                            >
                                模擬完成流水
                            </button>
                        </div>
                    </aside>
                )}
            </main>
        </div>
    );
};

export default GameRoom;
