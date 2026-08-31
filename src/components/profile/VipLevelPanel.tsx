import { useState, type ReactNode } from 'react';
import { CalendarDays, ChevronRight, Crown, Percent, TrendingUp, Wallet, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { VIP_LEVEL_RULES, VIP_TARGET_DETAILS } from '../../data/mockData';

/** Existing VIP presentation isolated for the dedicated follow-up redesign. */
const VipLevelPanel = () => {
    const { user } = useAuth();
    const [showTarget, setShowTarget] = useState(false);
    const currentLevel = Math.max(0, Math.min(user?.vipLevel ?? 0, 10));
    const currentRule = VIP_LEVEL_RULES.find(rule => rule.level === currentLevel) ?? VIP_LEVEL_RULES[0];
    const currentDetail = VIP_TARGET_DETAILS.find(detail => detail.level === currentLevel) ?? VIP_TARGET_DETAILS[0];
    const nextRule = VIP_LEVEL_RULES.find(rule => rule.level === Math.min(currentLevel + 1, 10)) ?? currentRule;
    const isMaxLevel = currentLevel >= 10;
    const targetRule = isMaxLevel ? currentRule : nextRule;
    const targetDetail = VIP_TARGET_DETAILS.find(detail => detail.level === targetRule.level) ?? VIP_TARGET_DETAILS[0];
    const deposit = user?.vipDepositTotal ?? 0;
    const bet = user?.vipBetTotal ?? 0;
    const depositProgress = nextRule.requiredDeposit > 0 ? Math.min((deposit / nextRule.requiredDeposit) * 100, 100) : 100;
    const betProgress = nextRule.requiredBet > 0 ? Math.min((bet / nextRule.requiredBet) * 100, 100) : 100;

    return (
        <div className="relative flex h-full min-h-0 flex-col overflow-y-auto pr-1 custom-scrollbar">
            <section className="relative overflow-hidden rounded-3xl border border-white/18 bg-[linear-gradient(135deg,rgba(128,148,255,0.52),rgba(66,81,190,0.58))] p-5 shadow-xl">
                <Crown className="absolute -right-8 -top-9 text-white/8" size={150} />
                <div className="relative flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[9px] font-black tracking-[0.22em] text-white/60">CURRENT LEVEL</p>
                        <h3 className="mt-1 text-3xl font-black italic text-white">VIP {currentLevel}</h3>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowTarget(true)}
                        className="flex items-center gap-1 rounded-xl border border-white/18 bg-white/12 px-3 py-2 text-xs font-black text-white hover:bg-white/20"
                    >
                        {isMaxLevel ? '最高等級' : `目標 VIP ${targetRule.level}`}
                        <ChevronRight size={13} />
                    </button>
                </div>

                <div className="relative mt-5 space-y-3">
                    <VipProgressRow icon={<Wallet size={15} />} label="累積儲值" current={deposit} target={nextRule.requiredDeposit} progress={depositProgress} isMax={isMaxLevel} />
                    <VipProgressRow icon={<TrendingUp size={15} />} label="累積投注" current={bet} target={nextRule.requiredBet} progress={betProgress} isMax={isMaxLevel} />
                </div>
                <p className="relative mt-4 text-xs leading-5 text-white/65">
                    {isMaxLevel ? '已達 VIP 10，享有目前最高等級回饋。' : `需同時達成儲值與投注條件，才能升級至 VIP ${nextRule.level}。`}
                </p>
            </section>

            <section className="mt-4 grid grid-cols-2 gap-3">
                <VipBenefit icon={<TrendingUp size={18} />} label="返水" value={currentDetail.rebate} />
                <VipBenefit icon={<Percent size={18} />} label="手續費減免" value={currentDetail.feeDiscount} />
            </section>

            <p className="mt-4 rounded-2xl border border-white/12 bg-white/7 px-4 py-3 text-xs leading-5 text-white/58">
                VIP 呈現與細節規則將在下一階段需求討論後獨立調整；本頁目前保留既有計算與查看目標功能。
            </p>

            {showTarget && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#060b2a]/72 p-4 backdrop-blur-sm" onClick={() => setShowTarget(false)}>
                    <section className="lobby-modal-dialog-card max-h-full w-full max-w-[660px] overflow-hidden" onClick={event => event.stopPropagation()}>
                        <header className="relative border-b border-white/14 p-5 pr-14">
                            <button type="button" aria-label="關閉目標 VIP" onClick={() => setShowTarget(false)} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white">
                                <X size={18} />
                            </button>
                            <p className="text-[9px] font-black tracking-[0.22em] text-white/58">TARGET VIP</p>
                            <h3 className="mt-1 text-2xl font-black text-white">{targetDetail.name}</h3>
                            <p className="mt-1 text-xs text-white/62">{targetDetail.note}</p>
                        </header>

                        <div className="grid max-h-[430px] gap-4 overflow-y-auto p-5 custom-scrollbar md:grid-cols-2">
                            <div className="space-y-3">
                                <h4 className="text-sm font-black text-white">升級條件</h4>
                                <VipTargetMetric icon={<Wallet size={15} />} label="累積儲值" current={deposit} target={targetRule.requiredDeposit} progress={depositProgress} />
                                <VipTargetMetric icon={<TrendingUp size={15} />} label="累積投注" current={bet} target={targetRule.requiredBet} progress={betProgress} />
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-sm font-black text-white">等級福利</h4>
                                <VipBenefit icon={<TrendingUp size={18} />} label="返水" value={targetDetail.rebate} />
                                <VipBenefit icon={<Percent size={18} />} label="手續費減免" value={targetDetail.feeDiscount} />
                                <div className="rounded-2xl border border-white/14 bg-[#263990]/24 p-4">
                                    <div className="flex items-center gap-2 text-white"><CalendarDays size={15} /><span className="text-xs font-black">保級條件</span></div>
                                    <p className="mt-2 text-xs leading-5 text-white/68">{targetDetail.maintainRequirement}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};

const VipProgressRow = ({ icon, label, current, target, progress, isMax }: { icon: ReactNode; label: string; current: number; target: number; progress: number; isMax: boolean }) => (
    <div className="rounded-2xl border border-white/13 bg-[#263990]/22 px-4 py-3">
        <div className="flex items-center justify-between gap-3 text-xs font-bold">
            <span className="flex items-center gap-2 text-white">{icon}{label}</span>
            <span className="text-white/64">{isMax ? `${current.toLocaleString()} / MAX` : `${current.toLocaleString()} / ${target.toLocaleString()}`}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#101b62]/38"><div className="h-full rounded-full bg-white/85" style={{ width: `${isMax ? 100 : progress}%` }} /></div>
    </div>
);

const VipBenefit = ({ icon, label, value }: { icon: ReactNode; label: string; value: string }) => (
    <article className="flex items-center gap-3 rounded-2xl border border-white/15 bg-[#263990]/24 p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/18 bg-white/12 text-white">{icon}</span>
        <div><span className="text-[10px] font-black text-white/58">{label}</span><strong className="mt-0.5 block text-sm text-white">{value}</strong></div>
    </article>
);

const VipTargetMetric = ({ icon, label, current, target, progress }: { icon: ReactNode; label: string; current: number; target: number; progress: number }) => (
    <div className="rounded-2xl border border-white/14 bg-[#263990]/24 p-4">
        <div className="flex items-center justify-between gap-3 text-xs font-bold"><span className="flex items-center gap-2 text-white">{icon}{label}</span><span className="text-white/58">{Math.max(target - current, 0).toLocaleString()} 尚未達成</span></div>
        <div className="mt-2 flex justify-between text-[9px] text-white/48"><span>{current.toLocaleString()}</span><span>{target.toLocaleString()}</span></div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#101b62]/38"><div className="h-full rounded-full bg-white/85" style={{ width: `${Math.min(progress, 100)}%` }} /></div>
    </div>
);

export default VipLevelPanel;
