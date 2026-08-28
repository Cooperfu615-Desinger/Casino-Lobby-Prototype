import { ArrowRight, Check, Coins, History, Sparkles } from 'lucide-react';
import { useRewardCards } from '../../context/RewardCardContext';
import { useNavigation } from '../../hooks/useNavigation';

interface RewardConversionModalProps {
    onViewRecords?: () => void;
}

const RewardConversionModal = ({ onViewRecords }: RewardConversionModalProps) => {
    const { pendingConversionNotice, markConversionNoticeRead } = useRewardCards();
    const { navigate } = useNavigation();
    const notice = pendingConversionNotice && !pendingConversionNotice.read ? pendingConversionNotice : null;

    if (!notice) return null;

    const isGold = notice.sourceCurrency === 'activity-gold';
    const goToRecords = () => {
        markConversionNoticeRead();
        onViewRecords?.();
        navigate('bank', { bankTab: 'records' });
    };

    return (
        <div className="juheng-modal-backdrop fixed inset-0 z-[240] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200" onMouseDown={event => event.target === event.currentTarget && markConversionNoticeRead()}>
            <article className={`juheng-modal-panel relative w-full max-w-md overflow-hidden rounded-[28px] border bg-gradient-to-br from-[#2a163c] to-[#10051f] p-7 text-center shadow-2xl animate-in zoom-in-95 duration-200 ${isGold ? 'border-[#FFD700]/35' : 'border-slate-200/30'}`}>
                <Sparkles className={`absolute -right-10 -top-10 opacity-10 ${isGold ? 'text-[#FFD700]' : 'text-slate-100'}`} size={180} />
                <div className={`relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border text-xl font-black ${isGold ? 'border-[#FFD700]/40 bg-[#FFD700]/15 text-[#FFD700]' : 'border-slate-200/30 bg-slate-200/10 text-slate-100'}`}>
                    {isGold ? '金' : '銀'}
                </div>
                <p className="relative mt-4 text-[9px] font-black tracking-[0.22em] text-[#FFD700]">TURNOVER COMPLETE</p>
                <h2 className="relative mt-1 text-2xl font-black text-white">已滿足流水條件</h2>
                <p className="relative mt-2 text-sm text-slate-400">恭喜獲得 {notice.destinationLabel} <b className="text-white">{notice.convertedAmount.toLocaleString()}</b></p>

                <div className="relative mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <ConversionValue label="轉換前" title={notice.sourceLabel} value={notice.originalBalance} />
                    <ArrowRight className="text-[#FFD700]" size={18} />
                    <ConversionValue label="自動入帳" title={notice.destinationLabel} value={notice.convertedAmount} />
                </div>

                <div className="relative mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-white/[0.035] p-3"><span className="text-[8px] text-slate-500">系統回收</span><strong className="mt-1 block text-sm text-white">{notice.recoveredAmount.toLocaleString()}</strong></div>
                    <div className="rounded-xl bg-white/[0.035] p-3"><span className="text-[8px] text-slate-500">錢包餘額</span><strong className="mt-1 block text-sm text-white">{notice.walletBalance.toLocaleString()}</strong></div>
                </div>

                <div className="relative mt-5 grid grid-cols-2 gap-3">
                    <button type="button" onClick={goToRecords} className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-black text-slate-200 hover:bg-white/10"><History size={15} />查看紀錄</button>
                    <button type="button" onClick={markConversionNoticeRead} className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 py-3 text-xs font-black text-black hover:brightness-110"><Check size={15} />確認</button>
                </div>
            </article>
        </div>
    );
};

const ConversionValue = ({ label, title, value }: { label: string; title: string; value: number }) => (
    <div>
        <Coins className="mx-auto text-white/45" size={16} />
        <small className="mt-1 block text-[8px] text-slate-500">{label}</small>
        <strong className="mt-1 block text-[10px] text-white">{title}</strong>
        <span className="mt-0.5 block text-sm font-black text-[#FFD700]">{value.toLocaleString()}</span>
    </div>
);

export default RewardConversionModal;
