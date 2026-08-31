import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
    CalendarDays,
    Check,
    ChevronRight,
    Clock3,
    Coins,
    Crown,
    Gift,
    ShieldCheck,
    Sparkles,
    Table2,
    Trophy,
    WalletCards,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { VIP_LEVEL_RULES } from '../../data/mockData';
import type { VIPBindingRequirement, VIPLevelRule } from '../../types/user';
import LobbyModalShell from '../common/LobbyModalShell';

const MAX_VIP_LEVEL = VIP_LEVEL_RULES[VIP_LEVEL_RULES.length - 1]?.level ?? 15;

const VipLevelPanel = () => {
    const { user } = useAuth();
    const [showLevelTable, setShowLevelTable] = useState(false);
    const currentLevel = Math.max(0, Math.min(user?.vipLevel ?? 0, MAX_VIP_LEVEL));
    const currentRule = getLevelRule(currentLevel);
    const nextRule = VIP_LEVEL_RULES.find(rule => rule.level > currentLevel) ?? null;
    const isMaxLevel = nextRule === null;
    const lifetimeDeposit = user?.vipLifetimeDeposit ?? 0;
    const monthlyBet = user?.vipMonthlyBet ?? 0;

    return (
        <div className="relative flex h-full min-h-0 flex-col overflow-y-auto pr-1 custom-scrollbar">
            <div className="grid shrink-0 gap-3 md:grid-cols-[1.35fr_0.65fr]">
                <section className="relative min-h-[220px] overflow-hidden rounded-[22px] border border-white/35 bg-[linear-gradient(135deg,rgba(130,157,255,0.56),rgba(61,78,187,0.64))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_16px_38px_rgba(24,32,112,0.2)]">
                    <Crown className="absolute -left-8 -bottom-12 text-white/[0.055]" size={174} />
                    <div className="relative grid h-full grid-cols-[minmax(0,1fr)_168px] gap-4">
                        <div className="flex min-w-0 flex-col">
                            <div className="flex min-w-0 items-center gap-3">
                                <LevelMedallion rule={currentRule} />
                                <div className="min-w-0">
                                    <p className="text-[8px] font-normal tracking-[0.22em] text-white/52">CURRENT VIP</p>
                                    <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2">
                                        <h3 className="text-4xl font-black italic leading-none text-white">VIP {currentLevel}</h3>
                                        <span className="text-lg font-medium" style={{ color: currentRule.accentColor }}>{currentRule.name}</span>
                                    </div>
                                    <p className="mt-2 text-[10px] font-normal text-white/56">歷史最高 VIP {user?.vipHighestLevel ?? currentLevel}</p>
                                </div>
                            </div>

                            <div className="mt-4 space-y-1.5 text-[9px] font-normal text-white/52">
                                <span className="flex items-center gap-1.5"><Clock3 size={12} />每日 00:00 自動審核升級</span>
                                <span className="flex items-center gap-1.5"><CalendarDays size={12} />每月 1 日結算保級</span>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowLevelTable(true)}
                                className="mt-auto flex w-fit items-center gap-1.5 rounded-xl bg-[#263990]/42 px-3 py-2 text-[10px] font-medium text-white transition hover:bg-[#263990]/62"
                            >
                                <Table2 size={13} />
                                查看全部等級
                                <ChevronRight size={12} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-2">
                            <HeroStat label="歷史累積儲值" value={formatNumber(user?.vipLifetimeDeposit ?? 0)} />
                            <HeroStat label="歷史累積投注" value={formatNumber(user?.vipLifetimeBet ?? 0)} />
                            <HeroStat label="本月活躍天數" value={`${user?.vipMonthlyActiveDays ?? 0} 天`} />
                        </div>
                    </div>
                </section>

                <section className="min-h-[220px] rounded-[22px] border border-white/35 bg-[#263990]/28 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                    <div className="flex items-center gap-2 text-white/72">
                        <Gift size={16} />
                        <h4 className="text-sm font-normal text-white">等級權益</h4>
                    </div>

                    <div className="mt-3 flex flex-col gap-2">
                        <BenefitRow label="P2P 贈禮手續費" value={`${currentRule.p2pGiftFeeRate}%`} />
                        <BenefitRow label="本級升級獎勵" value={rewardLabel(currentRule)} />
                        <BenefitRow label="獎勵狀態" value={currentLevel === 0 ? '不適用' : '已發放'} />
                    </div>

                    <p className="mt-3 rounded-xl bg-[#1c2a77]/24 px-3 py-2 text-[9px] font-normal leading-4 text-white/44">已取得的等級獎勵不會因重新升級而重複發放。</p>
                </section>
            </div>

            <div className="mt-3 grid shrink-0 items-stretch gap-3 md:grid-cols-2">
                <section className="h-full rounded-[20px] border border-white/35 bg-[#263990]/24 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-sm font-normal text-white/66">升級條件</p>
                            <h4 className="mt-1 text-xl font-black text-white">
                                {isMaxLevel ? '已達目前最高等級' : `VIP ${nextRule.level} · ${nextRule.name}`}
                            </h4>
                        </div>
                        {!isMaxLevel && (
                            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-normal text-white/58">需全部達成</span>
                        )}
                    </div>

                    {isMaxLevel ? (
                        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-[#1d2b79]/34 p-4">
                            <Trophy className="text-[#FFF2A8]" size={24} />
                            <p className="text-xs font-normal leading-5 text-white/68">您已達 VIP {MAX_VIP_LEVEL}，目前沒有更高等級條件。</p>
                        </div>
                    ) : isUpgradePending(nextRule) ? (
                        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-[#1d2b79]/34 p-4">
                            <Sparkles className="text-white/78" size={22} />
                            <div>
                                <strong className="text-xl text-white">條件待設定</strong>
                                <p className="mt-1 text-[10px] font-normal leading-4 text-white/52">VIP 2 升級數值尚未完成後台設定，暫不計算進度。</p>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-3 space-y-2.5">
                            <ProgressCondition
                                icon={<WalletCards size={14} />}
                                label="歷史累積儲值"
                                current={lifetimeDeposit}
                                target={nextRule.upgradeLifetimeDeposit ?? 0}
                            />
                            <ProgressCondition
                                icon={<Coins size={14} />}
                                label="本月有效投注"
                                current={monthlyBet}
                                target={nextRule.upgradeMonthlyBet ?? 0}
                            />
                            <div className="flex items-center justify-between gap-3 rounded-xl bg-[#1d2b79]/30 px-3 py-2.5">
                                <span className="text-[10px] font-normal text-white/52">資料要求</span>
                                <strong className="text-sm text-white">{bindingRequirementLabel(nextRule.upgradeBinding)}</strong>
                            </div>
                        </div>
                    )}
                </section>

                <RetentionCard rule={currentRule} user={user} />
            </div>

            {showLevelTable && createPortal(
                <VipLevelTableModal currentLevel={currentLevel} onClose={() => setShowLevelTable(false)} />,
                document.body,
            )}
        </div>
    );
};

const RetentionCard = ({ rule, user }: { rule: VIPLevelRule; user: ReturnType<typeof useAuth>['user'] }) => {
    const monthlyDeposit = user?.vipMonthlyDeposit ?? 0;
    const monthlyBet = user?.vipMonthlyBet ?? 0;
    const activeDays = user?.vipMonthlyActiveDays ?? 0;
    const retentionPassed = !rule.retentionEnabled || (
        meetsOptionalTarget(monthlyDeposit, rule.retentionMonthlyDeposit)
        && meetsOptionalTarget(monthlyBet, rule.retentionMonthlyBet)
        && meetsOptionalTarget(activeDays, rule.retentionActiveDays)
    );
    const status = user?.vipUpgradeProtected
        ? '本月升級保護中'
        : rule.retentionEnabled
            ? retentionPassed ? '目前已達標' : '尚未達標'
            : '無條件保級';

    return (
        <section className="h-full rounded-[20px] border border-white/35 bg-[#263990]/24 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-white/78" />
                    <div>
                        <h4 className="text-sm font-normal text-white">保級狀態</h4>
                        <p className="mt-0.5 text-[9px] font-normal text-white/44">本月進度，供下次月度結算參考</p>
                    </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[9px] font-normal ${retentionPassed || user?.vipUpgradeProtected ? 'bg-emerald-300/13 text-emerald-50' : 'bg-rose-300/13 text-rose-50'}`}>
                    {status}
                </span>
            </div>

            {rule.retentionEnabled ? (
                <div className="mt-3 grid grid-cols-3 gap-2">
                    <RetentionMetric label="本月儲值" current={monthlyDeposit} target={rule.retentionMonthlyDeposit} />
                    <RetentionMetric label="本月投注" current={monthlyBet} target={rule.retentionMonthlyBet} />
                    <RetentionMetric label="活躍天數" current={activeDays} target={rule.retentionActiveDays} suffix="天" />
                </div>
            ) : (
                <div className="mt-3 rounded-2xl bg-[#1d2b79]/30 p-3 text-[10px] font-normal leading-5 text-white/62">本等級不設儲值、投注或活躍天數門檻，結算時自動維持等級。</div>
            )}

            {user?.vipUpgradeProtected && (
                <p className="mt-3 flex items-start gap-2 rounded-xl bg-[#1d2b79]/24 px-3 py-2 text-[9px] font-normal leading-4 text-white/52">
                    <Check className="mt-0.5 shrink-0 text-emerald-200" size={11} />
                    本月曾完成升級，下次月度結算不因保級條件不足而降級。
                </p>
            )}
        </section>
    );
};

const VipLevelTableModal = ({ currentLevel, onClose }: { currentLevel: number; onClose: () => void }) => {
    const currentRowRef = useRef<HTMLTableRowElement>(null);

    useEffect(() => {
        currentRowRef.current?.scrollIntoView({ block: 'center' });
    }, []);

    return (
        <LobbyModalShell
            title="VIP 等級總覽"
            eyebrow="VIP LEVEL OVERVIEW"
            icon={<Table2 size={20} />}
            onClose={onClose}
            closeLabel="關閉 VIP 等級總覽"
            layerClassName="z-[140]"
            frameClassName="h-[min(660px,92vh)] w-[96%] max-w-[1160px]"
            bodyClassName="flex min-h-0 flex-col p-4"
        >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-white/62">
                <p>升級條件採全數達成；保級條件啟用時亦採全數達成。</p>
                <span className="rounded-full bg-white/9 px-3 py-1 font-normal">P2P 贈禮手續費：現行費率 5%</span>
            </div>

            <div className="min-h-0 flex-1 overflow-auto rounded-2xl bg-[#263990]/18 px-2 custom-scrollbar">
                <table className="w-full min-w-[980px] border-separate border-spacing-y-2 text-left">
                    <thead className="sticky top-0 z-10 bg-[#667de5] text-[9px] font-normal tracking-[0.06em] text-white/72">
                        <tr>
                            <th className="rounded-l-xl px-3 py-3">等級</th>
                            <th className="w-[29%] px-3 py-3">升級條件</th>
                            <th className="w-[31%] px-3 py-3">保級條件</th>
                            <th className="px-3 py-3">升級獎勵</th>
                            <th className="rounded-r-xl px-3 py-3">P2P 手續費</th>
                        </tr>
                    </thead>
                    <tbody>
                        {VIP_LEVEL_RULES.map(rule => {
                            const isCurrent = rule.level === currentLevel;
                            const cellTone = isCurrent
                                ? 'bg-[linear-gradient(105deg,rgba(104,139,255,0.92),rgba(76,67,214,0.94))] shadow-[0_8px_22px_rgba(38,42,142,0.24)]'
                                : 'bg-[#243486]/42 hover:bg-[#30439c]/52';

                            return (
                                <tr key={rule.level} ref={isCurrent ? currentRowRef : undefined} aria-current={isCurrent ? 'true' : undefined}>
                                    <td className={`${cellTone} rounded-l-xl px-3 py-3`}>
                                        <div className="flex items-center gap-2.5">
                                            <span className="h-2.5 w-2.5 shrink-0 rounded-full shadow-[0_0_10px_currentColor]" style={{ color: rule.accentColor, backgroundColor: rule.accentColor }} />
                                            <div>
                                                <strong className="block text-xs text-white">VIP {rule.level} · {rule.name}</strong>
                                                {isCurrent && <span className="mt-1 inline-flex rounded-full bg-white/18 px-2 py-0.5 text-[8px] font-black text-white">目前等級</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className={`${cellTone} px-3 py-3`}><UpgradeRuleSummary rule={rule} /></td>
                                    <td className={`${cellTone} px-3 py-3`}><RetentionRuleSummary rule={rule} /></td>
                                    <td className={`${cellTone} px-3 py-3 text-[10px] font-bold text-white/82`}>{rewardLabel(rule)}</td>
                                    <td className={`${cellTone} rounded-r-xl px-3 py-3 text-xs font-black text-white`}>{rule.p2pGiftFeeRate}%</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </LobbyModalShell>
    );
};

const UpgradeRuleSummary = ({ rule }: { rule: VIPLevelRule }) => {
    if (rule.level === 0) return <span className="text-[10px] font-bold text-white/72">新註冊</span>;
    if (isUpgradePending(rule)) return <strong className="text-[10px] text-white">條件待設定</strong>;

    return (
        <div className="space-y-1 text-[9px] leading-4 text-white/68">
            <p>歷史儲值 <strong className="text-white">{formatNumber(rule.upgradeLifetimeDeposit ?? 0)}</strong></p>
            <p>本月投注 <strong className="text-white">{formatNumber(rule.upgradeMonthlyBet ?? 0)}</strong></p>
            <p>資料要求 <strong className="text-white">{bindingRequirementLabel(rule.upgradeBinding)}</strong></p>
        </div>
    );
};

const RetentionRuleSummary = ({ rule }: { rule: VIPLevelRule }) => {
    if (!rule.retentionEnabled) return <span className="text-[10px] font-bold text-white/72">無條件保級</span>;

    return (
        <div className="space-y-1 text-[9px] leading-4 text-white/68">
            <p>月儲值 <strong className="text-white">{formatNumber(rule.retentionMonthlyDeposit ?? 0)}</strong> · 月投注 <strong className="text-white">{formatNumber(rule.retentionMonthlyBet ?? 0)}</strong></p>
            <p>活躍 <strong className="text-white">{rule.retentionActiveDays ?? 0} 天</strong></p>
        </div>
    );
};

const LevelMedallion = ({ rule }: { rule: VIPLevelRule }) => (
    <span
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#263990]/32 shadow-[0_0_24px_currentColor]"
        style={{ color: rule.accentColor }}
    >
        <Crown size={26} />
    </span>
);

const HeroStat = ({ label, value }: { label: string; value: string }) => (
    <div className="flex min-h-[56px] flex-col justify-center rounded-xl bg-[#243486]/36 px-3 py-2.5">
        <span className="block text-[9px] font-normal text-white/44">{label}</span>
        <strong className="mt-0.5 block truncate text-lg leading-none text-white">{value}</strong>
    </div>
);

const ProgressCondition = ({ icon, label, current, target }: { icon: ReactNode; label: string; current: number; target: number }) => {
    const progress = target > 0 ? Math.min((current / target) * 100, 100) : 100;
    const remaining = Math.max(target - current, 0);

    return (
        <div className="rounded-xl bg-[#1d2b79]/30 px-3 py-3">
            <div className="flex items-end justify-between gap-3">
                <span className="flex items-center gap-1.5 text-[10px] font-normal text-white/56">{icon}{label}</span>
                <span className="text-base font-black leading-none text-white">{formatNumber(current)} <small className="text-[10px] font-normal text-white/42">/ {formatNumber(target)}</small></span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#111c63]/34">
                <div className="h-full rounded-full bg-[linear-gradient(90deg,#a8ddff,#8f8cff)] shadow-[0_0_10px_rgba(173,211,255,0.5)]" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-1.5 text-right text-[9px] font-normal text-white/42">{remaining > 0 ? `尚差 ${formatNumber(remaining)}` : '已達成'}</p>
        </div>
    );
};

const RetentionMetric = ({ label, current, target, suffix = '' }: { label: string; current: number; target: number | null; suffix?: string }) => {
    const passed = target === null || current >= target;
    return (
        <div className="rounded-xl bg-[#1d2b79]/30 p-3">
            <span className="block text-[9px] font-normal text-white/44">{label}</span>
            <strong className="mt-1 block text-xl leading-none text-white">{formatNumber(current)}<small className="ml-0.5 text-[10px] font-normal text-white/50">{suffix}</small></strong>
            <span className={`mt-2 block text-[9px] font-normal ${passed ? 'text-emerald-100' : 'text-rose-100'}`}>
                {passed ? '已達成' : `目標 ${formatNumber(target ?? 0)}${suffix}`}
            </span>
        </div>
    );
};

const BenefitRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex min-h-[46px] items-center justify-between gap-3 rounded-xl bg-[#1d2b79]/30 px-3 py-2.5">
        <span className="text-[9px] font-normal text-white/46">{label}</span>
        <strong className="text-lg leading-none text-white">{value}</strong>
    </div>
);

const getLevelRule = (level: number) => VIP_LEVEL_RULES.find(rule => rule.level === level) ?? VIP_LEVEL_RULES[0];

const isUpgradePending = (rule: VIPLevelRule) => rule.upgradeLifetimeDeposit === null && rule.upgradeMonthlyBet === null;

const meetsOptionalTarget = (current: number, target: number | null) => target === null || current >= target;

const formatNumber = (value: number) => value.toLocaleString('en-US');

const bindingRequirementLabel = (requirement: VIPBindingRequirement) => ({
    none: '無額外要求',
    phone: '手機號碼',
    email: 'Email',
    phone_email: '手機號碼＋Email',
})[requirement];

const rewardLabel = (rule: VIPLevelRule) => {
    if (!rule.rewardCurrency || !rule.rewardAmount) return '無';
    return `${rule.rewardCurrency === 'bronze' ? '銅幣' : '銀幣'} ${formatNumber(rule.rewardAmount)}`;
};

export default VipLevelPanel;
