import { useMemo, useState } from 'react';
import {
    CalendarCheck,
    Check,
    Coins,
    CreditCard,
    Gift,
    LockKeyhole,
    RotateCcw,
    X,
} from 'lucide-react';
import { useActivity } from '../../context/ActivityContext';
import { useAuth } from '../../context/AuthContext';
import { useRewardCards } from '../../context/RewardCardContext';
import { useUI } from '../../context/UIContext';

type MilestoneReward =
    | { type: 'checkpoint'; label: '里程碑' }
    | { type: 'bronze'; label: '銅幣'; amount: number }
    | { type: 'card'; label: '活動銀幣' | '活動金幣'; amount: number };

const MILESTONES: Array<{ days: number; reward: MilestoneReward }> = [
    { days: 5, reward: { type: 'checkpoint', label: '里程碑' } },
    { days: 7, reward: { type: 'checkpoint', label: '里程碑' } },
    { days: 10, reward: { type: 'bronze', label: '銅幣', amount: 10_000_000 } },
    { days: 15, reward: { type: 'card', label: '活動銀幣', amount: 10_000 } },
    { days: 20, reward: { type: 'card', label: '活動金幣', amount: 5_000 } },
    { days: 25, reward: { type: 'checkpoint', label: '里程碑' } },
    { days: 30, reward: { type: 'checkpoint', label: '里程碑' } },
];

const MAKEUP_COST = 100;

const DailyCheckInPanel = () => {
    const now = useMemo(() => new Date(), []);
    const today = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const monthLabel = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`;
    const { checkedDays, claimedMilestones, checkInDay, claimMilestone } = useActivity();
    const { user, updateBalance, addWalletReward } = useAuth();
    const { claimRewardCard } = useRewardCards();
    const { showToast, triggerBalanceAnimation } = useUI();
    const [makeupTarget, setMakeupTarget] = useState<number | null>(null);
    const totalCheckIns = checkedDays.length;
    const todayChecked = checkedDays.includes(today);
    const missedDays = Array.from({ length: Math.max(0, today - 1) }, (_, index) => index + 1)
        .filter(day => !checkedDays.includes(day));

    const handleTodayCheckIn = () => {
        if (!checkInDay(today)) return;
        showToast('今日任務簽到完成，里程碑進度已更新', 'success');
    };

    const handleMilestoneClaim = (days: number, reward: MilestoneReward) => {
        if (totalCheckIns < days || claimedMilestones.includes(days)) return;

        if (reward.type === 'bronze') {
            if (!addWalletReward('bronze', reward.amount, `每日任務・第 ${days} 天`)) return;
            claimMilestone(days);
            triggerBalanceAnimation();
            showToast(`已領取 ${reward.amount.toLocaleString()} 銅幣`, 'success');
            return;
        }

        if (reward.type === 'card') {
            const card = claimRewardCard(days);
            if (!card) return;
            claimMilestone(days);
            showToast(`已取得「${card.title}」獎勵卡`, 'success');
            return;
        }

        if (!claimMilestone(days)) return;
        showToast(`第 ${days} 天里程碑已完成`, 'success');
    };

    const handleMakeup = () => {
        if (!makeupTarget || !user) return;
        if (user.balance.silver < MAKEUP_COST) {
            showToast('銀幣不足，無法補簽', 'error');
            return;
        }
        if (!checkInDay(makeupTarget)) {
            setMakeupTarget(null);
            return;
        }
        updateBalance({ silver: user.balance.silver - MAKEUP_COST });
        triggerBalanceAnimation();
        showToast(`補簽成功，已扣除 ${MAKEUP_COST.toLocaleString()} 銀幣`, 'success');
        setMakeupTarget(null);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
            <section className="mb-3 flex items-center justify-between gap-4 rounded-2xl border border-[#FFD700]/20 bg-gradient-to-r from-[#FFD700]/10 via-purple-500/5 to-transparent px-4 py-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="text-[8px] font-black tracking-[0.22em] text-[#FFD700]">DAILY MISSION</p>
                        <span className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[8px] font-bold text-slate-400">{monthLabel}</span>
                    </div>
                    <h3 className="mt-1 text-lg font-black text-white">本月已完成 {totalCheckIns} 天</h3>
                    <p className="mt-0.5 text-[10px] text-slate-400">完成簽到以推進銅幣與活動幣獎勵卡里程碑</p>
                </div>
                <button
                    type="button"
                    onClick={handleTodayCheckIn}
                    disabled={todayChecked}
                    className="flex min-w-28 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-4 py-2.5 text-xs font-black text-black shadow-lg transition-all hover:brightness-110 active:scale-95 disabled:cursor-default disabled:bg-none disabled:bg-emerald-500/15 disabled:text-emerald-300 disabled:shadow-none"
                >
                    {todayChecked ? <Check size={15} /> : <CalendarCheck size={15} />}
                    {todayChecked ? '今日已簽到' : '立即簽到'}
                </button>
            </section>

            <div className="grid gap-3 xl:grid-cols-[0.92fr_1.08fr]">
                <section className="rounded-2xl border border-white/10 bg-black/20 p-3.5">
                    <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-black text-white">
                            <Gift size={15} className="text-[#FFD700]" />
                            累積任務獎勵
                        </div>
                        <span className="text-[9px] font-bold text-slate-500"><b className="text-[#FFD700]">{totalCheckIns}</b> / 30 DAYS</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-2">
                        {MILESTONES.map(({ days, reward }) => {
                            const reached = totalCheckIns >= days;
                            const claimed = claimedMilestones.includes(days);
                            return (
                                <button
                                    key={days}
                                    type="button"
                                    onClick={() => handleMilestoneClaim(days, reward)}
                                    disabled={!reached || claimed}
                                    className={`relative flex min-h-[62px] items-center gap-2.5 rounded-xl border px-3 text-left transition-all ${claimed
                                        ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300'
                                        : reached
                                            ? 'border-[#FFD700]/40 bg-[#FFD700]/8 text-[#FFD700] hover:-translate-y-0.5 hover:bg-[#FFD700]/12'
                                            : 'border-white/5 bg-white/[0.025] text-slate-600'
                                        }`}
                                >
                                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${claimed ? 'bg-emerald-400/10' : reached ? 'bg-[#FFD700]/10' : 'bg-white/[0.03]'}`}>
                                        {claimed
                                            ? <Check size={15} />
                                            : reached
                                                ? reward.type === 'card' ? <CreditCard size={15} /> : reward.type === 'bronze' ? <Coins size={15} /> : <Gift size={15} />
                                                : <LockKeyhole size={14} />}
                                    </span>
                                    <span className="min-w-0">
                                        <strong className="block text-[10px] font-black">{days} 天</strong>
                                        <small className="mt-0.5 block truncate text-[8px] font-bold">
                                            {reward.type === 'checkpoint'
                                                ? '完成里程碑'
                                                : `${reward.amount.toLocaleString()} ${reward.label}`}
                                        </small>
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                        <RewardLegend tone="bronze" label="銅幣" detail="第 10 天" />
                        <RewardLegend tone="silver" label="活動銀幣" detail="第 15 天" />
                        <RewardLegend tone="gold" label="活動金幣" detail="第 20 天" />
                    </div>
                </section>

                <section className="rounded-2xl border border-white/10 bg-black/20 p-3.5">
                    <div className="mb-2.5 flex items-center justify-between">
                        <h4 className="text-xs font-black text-white">本月簽到</h4>
                        <div className="flex gap-2 text-[8px] font-bold text-slate-500">
                            <span className="text-[#FFD700]">● 今日</span>
                            <span className="text-emerald-400">● 已簽</span>
                            <span className="text-orange-300">● 可補簽</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1.5">
                        {Array.from({ length: daysInMonth }, (_, index) => index + 1).map(day => {
                            const checked = checkedDays.includes(day);
                            const isToday = day === today;
                            const missed = day < today && !checked;
                            const future = day > today;
                            return (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => missed ? setMakeupTarget(day) : isToday && !checked ? handleTodayCheckIn() : undefined}
                                    disabled={checked || future}
                                    className={`relative min-h-[42px] rounded-lg border p-1 text-left transition-all ${checked
                                        ? 'border-emerald-400/15 bg-emerald-500/8 text-emerald-300/70'
                                        : isToday
                                            ? 'border-[#FFD700]/60 bg-[#FFD700]/12 text-[#FFD700] hover:scale-[1.03]'
                                            : missed
                                                ? 'border-orange-300/20 bg-orange-500/8 text-orange-200 hover:bg-orange-500/15'
                                                : 'border-white/5 bg-white/[0.02] text-slate-600'
                                        }`}
                                >
                                    <span className="text-[8px] font-black">{day}</span>
                                    <span className="absolute inset-x-1 bottom-1 truncate text-center text-[7px] font-bold">
                                        {checked ? '✓' : missed ? '補簽' : isToday ? '今日' : ''}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    <div className="mt-2.5 flex items-center gap-2 rounded-lg bg-purple-500/5 px-3 py-2 text-[9px] text-slate-400">
                        <RotateCcw size={12} className="text-purple-300" />
                        漏簽日可支付 {MAKEUP_COST} 銀幣補簽；目前漏簽 {missedDays.length} 天。
                    </div>
                </section>
            </div>

            {makeupTarget && (
                <div className="juheng-modal-backdrop absolute inset-0 z-[150] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onMouseDown={event => event.target === event.currentTarget && setMakeupTarget(null)}>
                    <div className="juheng-modal-panel relative w-full max-w-sm rounded-2xl border border-purple-300/20 bg-gradient-to-br from-[#2a1b42] to-[#140722] p-6 text-center shadow-2xl">
                        <button type="button" onClick={() => setMakeupTarget(null)} aria-label="關閉補簽確認" className="absolute right-4 top-4 text-slate-500 hover:text-white"><X size={18} /></button>
                        <RotateCcw className="mx-auto text-purple-300" size={32} />
                        <h3 className="mt-3 text-xl font-black text-white">補簽 {makeupTarget} 日</h3>
                        <p className="mt-2 text-sm text-slate-400">支付 {MAKEUP_COST} 銀幣補回任務進度，不另外發放每日獎勵。</p>
                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <button type="button" onClick={() => setMakeupTarget(null)} className="rounded-xl bg-white/5 py-3 text-sm font-bold text-slate-300 hover:bg-white/10">取消</button>
                            <button type="button" onClick={handleMakeup} className="rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 py-3 text-sm font-black text-black hover:brightness-110">確認補簽</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const RewardLegend = ({ tone, label, detail }: { tone: 'bronze' | 'silver' | 'gold'; label: string; detail: string }) => {
    const toneClass = {
        bronze: 'border-orange-400/20 bg-orange-500/8 text-orange-200',
        silver: 'border-slate-300/20 bg-slate-300/8 text-slate-200',
        gold: 'border-[#FFD700]/25 bg-[#FFD700]/8 text-[#FFD700]',
    }[tone];
    return (
        <div className={`rounded-lg border px-2 py-2 text-center ${toneClass}`}>
            <strong className="block text-[9px] font-black">{label}</strong>
            <span className="text-[7px] opacity-65">{detail}</span>
        </div>
    );
};

export default DailyCheckInPanel;
