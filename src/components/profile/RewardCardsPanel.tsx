import { useEffect, useRef, useState } from 'react';
import { CreditCard, Merge, Pause, Play, Trash2 } from 'lucide-react';
import { useRewardCards } from '../../context/RewardCardContext';
import { useUI } from '../../context/UIContext';
import { useNavigation } from '../../hooks/useNavigation';
import { LobbyModalButton, LobbyModalSection } from '../common/LobbyModalPrimitives';
import type { RewardCard, RewardCardStatus } from '../../types/rewardCard';
import { canActivateRewardCard, canMergeRewardCard, createMergedRewardCard, isRewardCardExpired } from '../../utils/rewardCardMerge';
import { useActivityBalances } from '../../hooks/useActivityBalances';

const STATUS: Record<RewardCardStatus, string> = { inactive: '未啟用', active: '使用中', paused: '已停用', converted: '已轉換', merged: '已合併' };

const RewardCardsPanel = ({ onClose }: { onClose: () => void }) => {
    const { rewardCards, activateRewardCard, pauseRewardCard, deleteRewardCard, mergeRewardCards } = useRewardCards();
    const activity = useActivityBalances();
    const { showToast } = useUI();
    const { navigate } = useNavigation();
    const [merging, setMerging] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);
    const [deleteTarget, setDeleteTarget] = useState<RewardCard | null>(null);
    const [rule, setRule] = useState(false);
    const listRef = useRef<HTMLDivElement>(null);
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        const timer = window.setInterval(() => setNow(new Date()), 1000);
        return () => window.clearInterval(timer);
    }, []);
    const cards = rewardCards.filter(card => card.status !== 'merged');
    const preview = createMergedRewardCard(rewardCards, selected, 'merge-preview', now);
    const reset = () => { setMerging(false); setSelected([]); };
    const act = (success: boolean, message: string) => showToast(success ? message : '操作失敗，請確認卡片狀態與有效期限', success ? 'success' : 'error');

    return (
        <div className="relative flex h-full min-h-0 flex-col">
            <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-white"><CreditCard size={20} /><h3 className="text-base">獎勵卡</h3></div>
                <div className="flex gap-2">
                    <LobbyModalButton onClick={() => setRule(true)} tone="secondary">規則說明</LobbyModalButton>
                    {!merging && <LobbyModalButton onClick={() => setMerging(true)} disabled={cards.filter(card => canMergeRewardCard(card, now)).length < 2}><Merge size={15} />合併</LobbyModalButton>}
                </div>
            </div>
            <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                <LobbyModalSection className="mb-3 grid grid-cols-2 gap-4 p-4">
                    <div><Metric label="活動金幣" value={activity.gold} /><p className="mt-1 text-[10px] text-white/65">使用規則待確認</p></div>
                    <div><Metric label="活動銀幣" value={activity.silver} /><p className="mt-1 text-[10px] text-white/65">目前可用 {activity.availableSilver.toLocaleString()}</p></div>
                    <p className="col-span-2 text-[10px] text-white/65">活動銀幣餘額包含有效的未啟用、使用中與已停用卡片；啟用後可用於遊戲。活動金幣可由優惠碼領取，目前僅入帳與顯示，使用規則待確認。</p>
                </LobbyModalSection>
                {cards.length === 0 ? <div className="flex min-h-64 flex-col items-center justify-center gap-4 text-center">
                    <CreditCard size={42} className="text-white/70" /><h3 className="text-lg">目前沒有獎勵卡</h3>
                    <p className="text-xs text-white/70">完成每日任務第 10、15、20 天，即可領取活動銀幣獎勵卡。</p>
                    <LobbyModalButton onClick={() => { onClose(); navigate('events', { eventsTab: 'daily' }); }}>前往每日任務</LobbyModalButton>
                </div> : <div className="grid grid-cols-2 items-start gap-3">
                    {cards.map(card => {
                        const expired = isRewardCardExpired(card, now);
                        const eligible = canMergeRewardCard(card, now);
                        const canActivate = canActivateRewardCard(card, now);
                        const progress = card.turnoverTarget > 0 ? Math.min(100, card.totalTurnover / card.turnoverTarget * 100) : 0;
                        return <article key={card.id} aria-label={card.title + (card.milestoneDay ? ` 第 ${card.milestoneDay} 天` : '')} className={`lobby-reward-card lobby-reward-card--silver min-w-0 rounded-2xl border p-3 ${selected.includes(card.id) ? 'border-white bg-white/15' : 'border-white/25'}`}>
                            <header className="flex items-center gap-3">
                                {merging && <input type="checkbox" aria-label={`選取 ${card.title}${card.milestoneDay ? ` 第 ${card.milestoneDay} 天` : ''}`} checked={selected.includes(card.id)} disabled={!eligible} onChange={() => setSelected(current => current.includes(card.id) ? current.filter(id => id !== card.id) : [...current, card.id])} className="h-5 w-5 accent-indigo-500 disabled:opacity-30" />}
                                <CreditCard size={23} /><div className="flex-1"><h4 className="text-base font-semibold">{card.title}</h4><p className="mt-1 text-[10px] text-white/65">{card.sourceCardIds ? `由 ${card.sourceCount} 張獎勵卡合併` : card.sourceLabel ?? `每日任務・第 ${card.milestoneDay} 天`}</p></div>
                                <span className={`rounded-full px-2 py-1 text-[10px] ${card.status === 'active' ? 'bg-emerald-500/30' : 'bg-white/10'}`}>{expired && card.status !== 'converted' ? '已過期' : STATUS[card.status]}</span>
                            </header>
                            <div className="mt-4 grid grid-cols-3 gap-3"><Metric label="目前餘額" value={card.currentBalance} /><Metric label="起始餘額紀錄" value={card.amount} /><Metric label="轉換上限" value={card.conversionLimit} /></div>
                            <div className="mt-3 text-xs"><div className="flex justify-between"><span className="text-white/65">流水量</span><span>{card.totalTurnover.toLocaleString()} / {card.turnoverTarget.toLocaleString()}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/20"><div className="h-full rounded-full bg-white/80" style={{ width: `${progress}%` }} /></div></div>
                            <p className="mt-3 text-[10px] text-white/70">有效期限：{card.expiresAt}</p>
                            {card.status === 'converted' && <p className="mt-2 text-xs">已轉換 {card.convertedAmount.toLocaleString()} · 系統回收 {card.recoveredAmount.toLocaleString()}<span className="ml-2 text-[10px] text-white/65">{card.convertedAt}</span></p>}
                            {merging ? <p className="mt-3 text-[10px] text-white/65">{eligible ? '可選取合併' : card.status === 'active' ? '使用中卡片請先退出合併模式並停用' : canActivate ? '距離到期日小於或等於 72 小時，不可合併' : '此卡片不可合併'}</p> : <div className="mt-3 flex flex-wrap gap-2">
                                <LobbyModalButton disabled={!canActivate} onClick={() => act(activateRewardCard(card.id), '獎勵卡已啟用')}><Play size={13} />啟用</LobbyModalButton>
                                <LobbyModalButton tone="secondary" disabled={card.status !== 'active'} onClick={() => act(pauseRewardCard(card.id), '獎勵卡已停用')}><Pause size={13} />停用</LobbyModalButton>
                                <LobbyModalButton tone="danger" disabled={!['inactive', 'paused'].includes(card.status)} onClick={() => setDeleteTarget(card)}><Trash2 size={13} />刪除</LobbyModalButton>
                            </div>}
                        </article>;
                    })}
                </div>}
            </div>
            {merging && <div className="mt-3 shrink-0 rounded-xl bg-[#253479]/60 p-3" aria-label="合併預覽">
                <div className="mb-2 flex items-center justify-between"><span className="text-xs">已選取 {selected.length} 張</span><span className="text-[10px] text-white/65">至少 2 張、無上限；剩餘時間須超過 72 小時</span></div>
                {preview && <div className="mb-3 grid grid-cols-3 gap-2"><Metric label="目前餘額" value={preview.currentBalance} /><Metric label="起始餘額紀錄" value={preview.amount} /><Metric label="轉換上限" value={preview.conversionLimit} /><p className="col-span-3 text-[11px]">流水 {preview.totalTurnover.toLocaleString()} / {preview.turnoverTarget.toLocaleString()} · 最早到期日 {preview.expiresAt}</p></div>}
                <div className="flex justify-end gap-2"><LobbyModalButton tone="secondary" onClick={reset}>取消</LobbyModalButton><LobbyModalButton disabled={!preview} onClick={() => { const result = mergeRewardCards(selected); if (result) { reset(); listRef.current?.scrollTo({ top: 0 }); showToast('已建立活動銀幣合併卡，請啟用後使用', 'success'); } else { setSelected([]); showToast('卡片狀態或剩餘期限已變更，請重新選取', 'error'); } }}>確認合併</LobbyModalButton></div>
            </div>}
            {(deleteTarget || rule) && <div className="absolute inset-0 z-30 flex items-center justify-center rounded-xl bg-black/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={deleteTarget ? '刪除獎勵卡' : '獎勵卡規則說明'}>
                <div className="lobby-modal-dialog-card w-full max-w-md p-5"><h3 className="mb-3 text-lg">{deleteTarget ? '刪除獎勵卡？' : '獎勵卡規則說明'}</h3>
                    <p className="text-xs leading-6">{deleteTarget ? '刪除後無法恢復，原每日任務或優惠碼也無法再次領取。' : '同時只能啟用一張活動銀幣卡；啟用另一張時，原卡自動停用。流水達成後依轉換上限轉入銀幣錢包，超額部分回收。至少選取 2 張，張數無上限。僅未啟用或已停用且剩餘時間超過 72 小時的卡片可合併；使用中須先停用。起始餘額紀錄、目前餘額、目標流水、已達成流水及轉換上限直接加總，不重新換算流水倍數，期限採最早到期日。合併後原卡失效，新卡需重新啟用。'}</p>
                    <div className="mt-4 flex justify-end gap-2"><LobbyModalButton tone="secondary" onClick={() => { setDeleteTarget(null); setRule(false); }}>{deleteTarget ? '取消' : '我知道了'}</LobbyModalButton>{deleteTarget && <LobbyModalButton tone="danger" onClick={() => { act(deleteRewardCard(deleteTarget.id), '獎勵卡已刪除'); setDeleteTarget(null); }}>確認刪除</LobbyModalButton>}</div>
                </div>
            </div>}
        </div>
    );
};

const Metric = ({ label, value }: { label: string; value: number }) => <div><p className="text-[10px] text-white/65">{label}</p><strong className="mt-1 block text-lg tabular-nums text-white">{value.toLocaleString()}</strong></div>;

export default RewardCardsPanel;
