import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Ticket } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePromoCodes } from '../../context/PromoCodeContext';
import { normalizePromoCode, PROMO_CODES, PROMO_CURRENCY_LABELS, type PromoCode } from '../../data/promoCodes';
import LobbyModalShell from '../common/LobbyModalShell';
import { LobbyModalButton, LobbyModalField, LobbyModalSection } from '../common/LobbyModalPrimitives';

const formatDate = (value: string) => new Intl.DateTimeFormat('zh-TW', { timeZone: 'Asia/Taipei', dateStyle: 'short', timeStyle: 'short', hour12: false }).format(new Date(value));

const PromoCodePanel = () => {
    const panelRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();
    const { preview, redeem, claimedCodes } = usePromoCodes();
    const [input, setInput] = useState('');
    const [error, setError] = useState('');
    const [pending, setPending] = useState<PromoCode | null>(null);
    const [received, setReceived] = useState<PromoCode | null>(null);
    const guest = !user || user.authProvider === 'guest';

    return <div ref={panelRef} className="mx-auto max-w-2xl space-y-4">
        <LobbyModalSection className="p-6">
            <Ticket size={32} className="mb-4 text-white" />
            <h3 className="text-xl text-white">優惠碼兌換</h3>
            <p className="mt-2 text-sm text-white/70">輸入營運提供的優惠碼，查看內容後即可領取。</p>
            <form className="mt-5 space-y-3" onSubmit={event => {
                event.preventDefault(); setReceived(null);
                const failure = preview(input); setError(failure ?? '');
                if (!failure) setPending(PROMO_CODES.find(item => item.code === normalizePromoCode(input))!);
            }}>
                <LobbyModalField label="優惠碼" placeholder="請輸入 8 碼英數字" value={input} onChange={event => { setInput(event.target.value.toUpperCase()); setError(''); setReceived(null); }} autoComplete="off" spellCheck={false} aria-describedby="promo-error" />
                <p id="promo-error" role="alert" className="min-h-5 text-sm text-white">{error}</p>
                <LobbyModalButton type="submit" disabled={guest || !input.trim()} fullWidth>兌換</LobbyModalButton>
            </form>
            <p className="mt-3 text-xs text-white/70">{guest ? '訪客可瀏覽優惠，請先註冊或登入一般會員後再兌換。' : '每位會員同一優惠碼限領一次；優惠碼與個人邀請碼不同。'}</p>
        </LobbyModalSection>
        {received && <LobbyModalSection className="p-4" tone="highlight"><div role="status"><h4 className="text-lg">領取成功</h4><p className="mt-2">{PROMO_CURRENCY_LABELS[received.currency]} +{received.amount.toLocaleString()}</p><p className="mt-2 text-xs">{received.currency === 'activity-silver' ? '已新增至個人資訊的獎勵卡分頁，請啟用後使用。' : received.currency === 'activity-gold' ? '已加入活動金餘額，目前僅入帳與顯示。' : '已立即加入錢包餘額。'} 可至銀行「紀錄」查看。</p></div></LobbyModalSection>}
        <details className="rounded-xl bg-white/5 p-3 text-xs text-white/70">
            <summary className="cursor-pointer">原型測試優惠碼（非正式發放）</summary>
            <div className="mt-3 space-y-2">{PROMO_CODES.map(promo => <p key={promo.code}><code className="select-all font-mono text-white">{promo.code}</code>　{promo.title}{claimedCodes.includes(promo.code) ? '・已領取' : ''}</p>)}</div>
            <p className="mt-3">關閉銀行或切換分頁不會重置領取狀態；重新整理後重置。金額與期限僅為 Mock 範例。</p>
        </details>
        {/* Escape the bank body's stacking context while staying inside PrototypeStage. */}
        {pending && createPortal(<LobbyModalShell title="確認優惠碼兌換" eyebrow="REDEEM OFFER" icon={<Ticket size={20} />} onClose={() => { setPending(null); setError(''); }} layerClassName="z-[1100]" frameClassName="w-[560px] max-h-[620px]" bodyClassName="space-y-4 p-5">
            <h3 className="text-xl">{pending.title}</h3>
            <LobbyModalSection className="p-4"><p className="text-xs text-white/70">兌換內容</p><p className="mt-2 text-2xl font-semibold">{pending.amount.toLocaleString()} <span className="text-sm font-normal">{PROMO_CURRENCY_LABELS[pending.currency]}</span></p></LobbyModalSection>
            <dl className="space-y-3 text-sm"><div><dt className="text-white/65">優惠碼</dt><dd className="font-mono">{pending.code}</dd></div><div><dt className="text-white/65">可兌換期限（台北時間）</dt><dd>{formatDate(pending.startsAt)} ～ {formatDate(pending.endsAt)}</dd></div><div><dt className="text-white/65">商品使用期限</dt><dd>{pending.cardExpiresAt ? `${pending.cardExpiresAt} 23:59（台北時間）` : pending.currency === 'activity-gold' ? '使用與到期規則待確認；本版不進行到期回收。' : '入帳後無使用期限（原型）'}</dd></div></dl>
            {pending.currency === 'activity-silver' && <p className="text-xs leading-6">領取後新增一張未啟用活動銀幣獎勵卡。流水目標 {pending.turnoverTarget?.toLocaleString()}；轉換上限 {pending.conversionLimit?.toLocaleString()}。啟用與合併沿用獎勵卡規則。</p>}
            <p className="text-xs text-white/70">確認後立即領取，取消不會使用優惠碼。</p>
            {error && <p role="alert" className="text-sm">{error}</p>}
            <div className="flex justify-end gap-3"><LobbyModalButton tone="secondary" onClick={() => { setPending(null); setError(''); }}>取消</LobbyModalButton><LobbyModalButton onClick={() => { const failure = redeem(pending.code); if (failure) { setError(failure); return; } setReceived(pending); setPending(null); setInput(''); setError(''); }}>確認領取</LobbyModalButton></div>
        </LobbyModalShell>, panelRef.current!.closest('.lobby-modal-overlay')!)}
    </div>;
};
export default PromoCodePanel;
