import { useMemo, useState } from 'react';
import { CalendarCheck, Check, Gift, LockKeyhole, RotateCcw, X } from 'lucide-react';
import { useActivity } from '../../context/ActivityContext';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';

const DAILY_REWARDS = [
    10_000, 15_000, 20_000, 15_000, 25_000, 30_000, 20_000, 25_000, 30_000, 35_000,
    25_000, 40_000, 30_000, 35_000, 50_000, 45_000, 40_000, 50_000, 55_000, 60_000,
    50_000, 55_000, 60_000, 65_000, 80_000, 70_000, 75_000, 80_000, 90_000, 100_000, 120_000,
];

const MILESTONES = [
    { days: 5, reward: 100_000 },
    { days: 7, reward: 200_000 },
    { days: 10, reward: 500_000 },
    { days: 15, reward: 1_000_000 },
    { days: 20, reward: 2_000_000 },
    { days: 25, reward: 3_500_000 },
    { days: 30, reward: 8_888_000 },
];

const MAKEUP_COST = 100;

const DailyCheckInPanel = () => {
    const now = useMemo(() => new Date(), []);
    const today = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const monthLabel = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`;
    const { checkedDays, claimedMilestones, checkInDay, claimMilestone } = useActivity();
    const { user, updateBalance } = useAuth();
    const { showToast, triggerBalanceAnimation } = useUI();
    const [makeupTarget, setMakeupTarget] = useState<number | null>(null);
    const totalCheckIns = checkedDays.length;
    const todayChecked = checkedDays.includes(today);
    const missedDays = Array.from({ length: Math.max(0, today - 1) }, (_, index) => index + 1)
        .filter((day) => !checkedDays.includes(day));

    const addSilverReward = (amount: number) => {
        updateBalance({ silver: (user?.balance.silver ?? 0) + amount });
        triggerBalanceAnimation();
    };

    const handleTodayCheckIn = () => {
        if (!checkInDay(today)) return;
        const reward = DAILY_REWARDS[today - 1] ?? DAILY_REWARDS[0];
        addSilverReward(reward);
        showToast(`簽到成功！獲得 ${reward.toLocaleString()} 銀幣`, 'success');
    };

    const handleMilestoneClaim = (days: number, reward: number) => {
        if (totalCheckIns < days || !claimMilestone(days)) return;
        addSilverReward(reward);
        showToast(`已領取 ${days} 天里程碑：${reward.toLocaleString()} 銀幣`, 'success');
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
        const reward = DAILY_REWARDS[makeupTarget - 1] ?? DAILY_REWARDS[0];
        updateBalance({ silver: user.balance.silver - MAKEUP_COST + reward });
        triggerBalanceAnimation();
        showToast(`補簽成功！扣除 ${MAKEUP_COST} 銀幣並獲得 ${reward.toLocaleString()} 銀幣`, 'success');
        setMakeupTarget(null);
    };

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="flex items-center justify-between rounded-2xl border border-[#FFD700]/20 bg-gradient-to-r from-[#FFD700]/10 to-purple-500/5 p-4">
                <div>
                    <p className="text-[9px] font-black tracking-[0.2em] text-[#FFD700]">DAILY CHECK-IN</p>
                    <h3 className="mt-1 text-xl font-black text-white">{monthLabel} 每日任務</h3>
                    <p className="mt-1 text-xs text-slate-400">本月已簽 {totalCheckIns} 天・每日獎勵皆為銀幣</p>
                </div>
                <button
                    type="button"
                    onClick={handleTodayCheckIn}
                    disabled={todayChecked}
                    className="flex min-w-32 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-4 py-3 text-sm font-black text-black shadow-lg transition-all hover:brightness-110 active:scale-95 disabled:cursor-default disabled:bg-none disabled:bg-emerald-500/15 disabled:text-emerald-300 disabled:shadow-none"
                >
                    {todayChecked ? <Check size={17} /> : <CalendarCheck size={17} />}
                    {todayChecked ? '今日已簽到' : '立即簽到'}
                </button>
            </div>

            <section className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-black text-white"><Gift size={17} className="text-[#FFD700]" />累積簽到獎勵</div>
                    <span className="text-[10px] font-bold text-slate-500"><b className="text-[#FFD700]">{totalCheckIns}</b> / 30 DAYS</span>
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {MILESTONES.map((milestone) => {
                        const reached = totalCheckIns >= milestone.days;
                        const claimed = claimedMilestones.includes(milestone.days);
                        return (
                            <button
                                key={milestone.days}
                                type="button"
                                onClick={() => handleMilestoneClaim(milestone.days, milestone.reward)}
                                disabled={!reached || claimed}
                                className={`relative flex min-h-[72px] flex-col items-center justify-center rounded-xl border px-1 text-center transition-all ${claimed
                                    ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300'
                                    : reached
                                        ? 'border-[#FFD700]/45 bg-[#FFD700]/10 text-[#FFD700] shadow-[0_0_18px_rgba(255,215,0,0.08)] hover:-translate-y-0.5'
                                        : 'border-white/5 bg-white/[0.025] text-slate-600'
                                    }`}
                            >
                                {claimed ? <Check size={17} /> : reached ? <Gift size={17} /> : <LockKeyhole size={15} />}
                                <span className="mt-1 text-[10px] font-black">{milestone.days} 天</span>
                                <span className="mt-0.5 text-[8px] font-bold">{milestone.reward.toLocaleString()} 銀幣</span>
                            </button>
                        );
                    })}
                </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-black text-white">本月簽到</h4>
                    <div className="flex gap-3 text-[9px] font-bold text-slate-500"><span>● 今日</span><span className="text-emerald-400">● 已簽</span><span className="text-orange-300">● 可補簽</span></div>
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: daysInMonth }, (_, index) => index + 1).map((day) => {
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
                                className={`relative min-h-[54px] rounded-xl border p-1.5 text-left transition-all ${checked
                                    ? 'border-emerald-400/15 bg-emerald-500/8 text-emerald-300/70'
                                    : isToday
                                        ? 'border-[#FFD700]/60 bg-[#FFD700]/12 text-[#FFD700] shadow-[0_0_14px_rgba(255,215,0,0.1)] hover:scale-[1.03]'
                                        : missed
                                            ? 'border-orange-300/20 bg-orange-500/8 text-orange-200 hover:bg-orange-500/15'
                                            : 'border-white/5 bg-white/[0.02] text-slate-600'
                                    }`}
                            >
                                <span className="text-[9px] font-black">{day}</span>
                                <span className="absolute bottom-1.5 left-1.5 right-1.5 truncate text-center text-[8px] font-bold">
                                    {checked ? '✓ 已簽' : missed ? '補簽' : isToday ? `${DAILY_REWARDS[day - 1].toLocaleString()} 銀幣` : `${DAILY_REWARDS[day - 1].toLocaleString()}`}
                                </span>
                            </button>
                        );
                    })}
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-purple-500/5 px-3 py-2 text-[10px] text-slate-400">
                    <RotateCcw size={13} className="text-purple-300" />
                    漏簽日可支付 {MAKEUP_COST} 銀幣補簽並取得當日銀幣獎勵；目前漏簽 {missedDays.length} 天。
                </div>
            </section>

            {makeupTarget && (
                <div className="absolute inset-0 z-[150] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && setMakeupTarget(null)}>
                    <div className="relative w-full max-w-sm rounded-2xl border border-purple-300/20 bg-gradient-to-br from-[#2a1b42] to-[#140722] p-6 text-center shadow-2xl">
                        <button type="button" onClick={() => setMakeupTarget(null)} aria-label="關閉補簽確認" className="absolute right-4 top-4 text-slate-500 hover:text-white"><X size={18} /></button>
                        <RotateCcw className="mx-auto text-purple-300" size={34} />
                        <h3 className="mt-3 text-xl font-black text-white">補簽 {makeupTarget} 日</h3>
                        <p className="mt-2 text-sm text-slate-400">支付 {MAKEUP_COST} 銀幣，領取當日 {DAILY_REWARDS[makeupTarget - 1].toLocaleString()} 銀幣獎勵。</p>
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

export default DailyCheckInPanel;
