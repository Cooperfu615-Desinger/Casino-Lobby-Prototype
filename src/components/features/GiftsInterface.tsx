import { useState } from 'react';
import {
    Coins,
    CreditCard,
    Info,
    Pause,
    Play,
    Sparkles,
    Trash2,
    X,
} from 'lucide-react';
import { useRewardCards } from '../../context/RewardCardContext';
import { useUI } from '../../context/UIContext';
import { useNavigation } from '../../hooks/useNavigation';
import type { RewardCard, RewardCardStatus } from '../../types/rewardCard';

interface GiftsInterfaceProps {
    onClose: () => void;
}

const STATUS_LABEL: Record<RewardCardStatus, string> = {
    inactive: '未啟用',
    active: '使用中',
    paused: '已停用',
    converted: '已轉換',
};

const STATUS_DESCRIPTION: Record<RewardCardStatus, string> = {
    inactive: '啟用後，卡片額度才會開放為遊戲活動錢包。',
    active: '目前可選擇此活動幣進入遊戲並累積指定流水。',
    paused: '額度已保留，重新啟用後即可繼續使用。',
    converted: '流水已完成，符合上限的額度已轉入儲值錢包。',
};

const GiftsInterface = ({ onClose }: GiftsInterfaceProps) => {
    const {
        rewardCards,
        activityGoldBalance,
        activitySilverBalance,
        activateRewardCard,
        pauseRewardCard,
        deleteRewardCard,
    } = useRewardCards();
    const { showToast } = useUI();
    const { navigate } = useNavigation();
    const [deleteTarget, setDeleteTarget] = useState<RewardCard | null>(null);
    const [ruleTitle, setRuleTitle] = useState('');

    const activate = (card: RewardCard) => {
        if (!activateRewardCard(card.id)) return;
        showToast(`已啟用「${card.title}」獎勵卡`, 'success');
    };

    const pause = (card: RewardCard) => {
        if (!pauseRewardCard(card.id)) return;
        showToast(`已停用「${card.title}」獎勵卡`, 'success');
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        const title = deleteTarget.title;
        if (deleteRewardCard(deleteTarget.id)) showToast(`已刪除「${title}」獎勵卡`, 'success');
        setDeleteTarget(null);
    };

    const goToDailyMission = () => {
        navigate('events', { eventsTab: 'daily' });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative flex h-[min(700px,92vh)] w-[94%] max-w-[1080px] flex-col overflow-hidden rounded-[26px] border border-white/10 bg-[#1a0b2e] shadow-2xl animate-in zoom-in-95 duration-200">
                <header className="relative flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#2a1244] via-[#1a0b2e] to-[#130720] px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#FFD700]/30 bg-[#FFD700]/10 text-[#FFD700] shadow-[0_0_24px_rgba(255,215,0,0.08)]">
                            <CreditCard size={22} />
                        </div>
                        <div>
                            <p className="text-[8px] font-black tracking-[0.24em] text-[#FFD700]/70">REWARD CARD WALLET</p>
                            <h2 className="mt-0.5 text-xl font-black text-white">獎勵卡</h2>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} aria-label="關閉獎勵卡" className="flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white/55 hover:bg-white/10 hover:text-white">
                        <X size={19} />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                    <section className="mb-4 grid gap-3 sm:grid-cols-2">
                        <WalletSummary tone="gold" label="活動金幣" amount={activityGoldBalance} />
                        <WalletSummary tone="silver" label="活動銀幣" amount={activitySilverBalance} />
                    </section>

                    {rewardCards.length === 0 ? (
                        <section className="flex min-h-[410px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#FFD700]/20 bg-[radial-gradient(circle_at_center,_rgba(255,215,0,0.07),_transparent_58%)] px-6 text-center">
                            <div className="relative flex h-24 w-32 items-center justify-center">
                                <span className="absolute h-16 w-24 -rotate-6 rounded-2xl border border-purple-300/20 bg-purple-500/10" />
                                <span className="absolute h-16 w-24 rotate-6 rounded-2xl border border-[#FFD700]/25 bg-[#FFD700]/10" />
                                <CreditCard className="relative text-[#FFD700]" size={34} />
                            </div>
                            <p className="text-[9px] font-black tracking-[0.22em] text-[#FFD700]">NO REWARD CARDS</p>
                            <h3 className="mt-2 text-2xl font-black text-white">目前沒有獎勵卡</h3>
                            <p className="mt-2 max-w-md text-xs leading-6 text-slate-400">完成每日任務第 15 天與第 20 天，即可領取活動銀幣與活動金幣獎勵卡。</p>
                            <button type="button" onClick={goToDailyMission} className="mt-5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-3 text-sm font-black text-black shadow-lg hover:brightness-110 active:scale-95">
                                前往每日任務
                            </button>
                        </section>
                    ) : (
                        <section className="grid gap-4 lg:grid-cols-2">
                            {rewardCards.map(card => (
                                <RewardCardItem
                                    key={card.id}
                                    card={card}
                                    onActivate={() => activate(card)}
                                    onPause={() => pause(card)}
                                    onDelete={() => setDeleteTarget(card)}
                                    onShowRule={setRuleTitle}
                                />
                            ))}
                        </section>
                    )}
                </div>

                {deleteTarget && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-sm rounded-2xl border border-red-400/25 bg-gradient-to-br from-[#2a163c] to-[#130720] p-6 text-center shadow-2xl">
                            <Trash2 className="mx-auto text-red-300" size={30} />
                            <h3 className="mt-3 text-xl font-black text-white">刪除獎勵卡？</h3>
                            <p className="mt-2 text-xs leading-6 text-slate-400">刪除「{deleteTarget.title}」後，本次瀏覽期間無法再次領取。</p>
                            <div className="mt-5 grid grid-cols-2 gap-3">
                                <button type="button" onClick={() => setDeleteTarget(null)} className="rounded-xl bg-white/5 py-3 text-sm font-bold text-slate-300 hover:bg-white/10">取消</button>
                                <button type="button" onClick={confirmDelete} className="rounded-xl bg-red-500 py-3 text-sm font-black text-white hover:bg-red-400">確認刪除</button>
                            </div>
                        </div>
                    </div>
                )}

                {ruleTitle && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-sm rounded-2xl border border-purple-300/20 bg-gradient-to-br from-[#2a163c] to-[#130720] p-6 text-center shadow-2xl">
                            <Info className="mx-auto text-purple-300" size={30} />
                            <h3 className="mt-3 text-xl font-black text-white">{ruleTitle}</h3>
                            <p className="mt-2 text-xs leading-6 text-slate-400">
                                {ruleTitle.includes('轉換')
                                    ? '流水達成後，活動幣將依卡片轉換上限加入對應儲值錢包，超過上限的部分由系統回收。'
                                    : '獎勵卡須在有效期限內啟用並完成流水；本原型操作於重新整理後重置。'}
                            </p>
                            <button type="button" onClick={() => setRuleTitle('')} className="mt-5 w-full rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 py-3 text-sm font-black text-black">我知道了</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const WalletSummary = ({ tone, label, amount }: { tone: 'gold' | 'silver'; label: string; amount: number }) => (
    <article className={`relative overflow-hidden rounded-2xl border p-4 ${tone === 'gold'
        ? 'border-[#FFD700]/25 bg-gradient-to-br from-[#FFD700]/12 to-orange-500/5'
        : 'border-slate-200/20 bg-gradient-to-br from-slate-200/10 to-blue-500/5'
        }`}>
        <Sparkles className={`absolute -bottom-5 -right-4 opacity-10 ${tone === 'gold' ? 'text-[#FFD700]' : 'text-slate-200'}`} size={90} />
        <div className="relative flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone === 'gold' ? 'bg-[#FFD700]/15 text-[#FFD700]' : 'bg-slate-200/10 text-slate-200'}`}>
                <Coins size={20} />
            </div>
            <div>
                <span className="text-[9px] font-black tracking-wider text-slate-400">{label}</span>
                <strong className="mt-0.5 block text-xl font-black text-white">{amount.toLocaleString()}</strong>
            </div>
        </div>
    </article>
);

interface RewardCardItemProps {
    card: RewardCard;
    onActivate: () => void;
    onPause: () => void;
    onDelete: () => void;
    onShowRule: (title: string) => void;
}

const RewardCardItem = ({ card, onActivate, onPause, onDelete, onShowRule }: RewardCardItemProps) => {
    const isGold = card.currency === 'activity-gold';
    const progress = card.turnoverTarget > 0 ? Math.min(100, Math.round((card.totalTurnover / card.turnoverTarget) * 100)) : 0;
    const statusTone = card.status === 'active'
        ? 'border-emerald-300/25 bg-emerald-500/10 text-emerald-200'
        : card.status === 'converted'
            ? 'border-blue-300/20 bg-blue-500/10 text-blue-200'
            : 'border-white/10 bg-white/5 text-slate-300';

    return (
        <article className={`relative overflow-hidden rounded-[22px] border p-5 ${isGold
            ? 'border-[#FFD700]/25 bg-gradient-to-br from-[#2c1c26] via-[#21102f] to-[#130720]'
            : 'border-slate-200/20 bg-gradient-to-br from-[#202438] via-[#21102f] to-[#130720]'
            }`}>
            <CreditCard className={`absolute -right-6 -top-8 opacity-[0.06] ${isGold ? 'text-[#FFD700]' : 'text-slate-100'}`} size={150} />
            <header className="relative flex items-start gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border font-black ${isGold ? 'border-[#FFD700]/35 bg-[#FFD700]/12 text-[#FFD700]' : 'border-slate-200/25 bg-slate-200/10 text-slate-100'}`}>
                    {isGold ? '金' : '銀'}
                </div>
                <div className="min-w-0 flex-1">
                    <small className="text-[8px] font-black tracking-wider text-slate-500">每日任務・第 {card.milestoneDay} 天</small>
                    <h3 className="mt-0.5 truncate text-lg font-black text-white">{card.title}</h3>
                </div>
                <span className={`rounded-full border px-2 py-1 text-[8px] font-black ${statusTone}`}>{STATUS_LABEL[card.status]}</span>
            </header>

            <div className="relative mt-4 grid grid-cols-2 gap-2">
                <Metric label="目前餘額" value={card.currentBalance.toLocaleString()} />
                <Metric label="卡片總額" value={card.amount.toLocaleString()} />
            </div>

            <div className="relative mt-3 rounded-xl border border-white/8 bg-black/20 p-3">
                <div className="flex justify-between text-[9px] font-bold text-slate-400">
                    <span>流水量</span>
                    <span>{card.totalTurnover.toLocaleString()} / {card.turnoverTarget.toLocaleString()}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div className={`h-full rounded-full ${isGold ? 'bg-gradient-to-r from-amber-500 to-yellow-300' : 'bg-gradient-to-r from-slate-400 to-white'}`} style={{ width: `${progress}%` }} />
                </div>
            </div>

            {card.status === 'converted' && (
                <div className="relative mt-3 grid grid-cols-2 gap-2 rounded-xl border border-blue-300/15 bg-blue-500/8 p-3">
                    <Metric label="已轉換" value={card.convertedAmount.toLocaleString()} compact />
                    <Metric label="系統回收" value={card.recoveredAmount.toLocaleString()} compact />
                    <time className="col-span-2 text-[8px] text-blue-200/60">{card.convertedAt}</time>
                </div>
            )}

            <div className="relative mt-3 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => onShowRule('轉換上限規則')} className="rounded-xl border border-white/8 bg-white/[0.035] p-2 text-left">
                    <span className="flex items-center gap-1 text-[8px] font-bold text-slate-500">轉換上限 <Info size={9} /></span>
                    <strong className="mt-1 block text-xs text-white">{card.conversionLimit.toLocaleString()}</strong>
                </button>
                <button type="button" onClick={() => onShowRule('有效期限規則')} className="rounded-xl border border-white/8 bg-white/[0.035] p-2 text-left">
                    <span className="flex items-center gap-1 text-[8px] font-bold text-slate-500">有效期限 <Info size={9} /></span>
                    <strong className="mt-1 block text-xs text-white">{card.expiresAt}</strong>
                </button>
            </div>

            <p className="relative mt-3 min-h-8 text-[9px] leading-4 text-slate-400">{STATUS_DESCRIPTION[card.status]}</p>

            <div className="relative mt-3 grid grid-cols-3 gap-2">
                <CardAction icon={<Play size={13} />} label="啟用" disabled={card.status === 'active' || card.status === 'converted'} onClick={onActivate} tone="primary" />
                <CardAction icon={<Pause size={13} />} label="停用" disabled={card.status !== 'active'} onClick={onPause} />
                <CardAction icon={<Trash2 size={13} />} label="刪除" disabled={card.status === 'active' || card.status === 'converted'} onClick={onDelete} tone="danger" />
            </div>
        </article>
    );
};

const Metric = ({ label, value, compact = false }: { label: string; value: string; compact?: boolean }) => (
    <div className={compact ? '' : 'rounded-xl border border-white/8 bg-black/20 p-3'}>
        <small className="block text-[8px] font-bold text-slate-500">{label}</small>
        <strong className={`mt-1 block font-black text-white ${compact ? 'text-sm' : 'text-lg'}`}>{value}</strong>
    </div>
);

const CardAction = ({ icon, label, disabled, onClick, tone = 'default' }: {
    icon: React.ReactNode;
    label: string;
    disabled: boolean;
    onClick: () => void;
    tone?: 'default' | 'primary' | 'danger';
}) => {
    const toneClass = tone === 'primary'
        ? 'border-[#FFD700]/25 bg-[#FFD700]/10 text-[#FFD700]'
        : tone === 'danger'
            ? 'border-red-300/15 bg-red-500/8 text-red-200'
            : 'border-white/10 bg-white/5 text-slate-300';
    return (
        <button type="button" onClick={onClick} disabled={disabled} className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-[9px] font-black transition-all hover:brightness-125 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 ${toneClass}`}>
            {icon}{label}
        </button>
    );
};

export default GiftsInterface;
