import { useEffect, useState } from 'react';
import {
    ArrowDownToLine,
    ArrowLeftRight,
    ArrowUpFromLine,
    Coins,
    Crown,
    Gift,
    Info,
    RefreshCw,
    Send,
    ShieldCheck,
    Wallet,
    X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import {
    calculateWalletExchange,
    canSubmitWalletExchange,
    GOLD_TO_SILVER_RATE,
    type WalletExchangeDirection,
} from '../../utils/walletExchange';

interface VaultInterfaceProps {
    onClose: () => void;
    initialTab?: VaultTab;
    receiverId?: string;
}

export type VaultTab = 'vault' | 'gifts' | 'exchange';
type VaultMode = 'deposit' | 'withdraw';

const GIFT_FEE_RATE = 0.05;

const VaultInterface = ({ onClose, initialTab = 'vault', receiverId: initialReceiverId = '' }: VaultInterfaceProps) => {
    const { user, depositToVault, withdrawFromVault, transferFromVault, exchangeWalletCurrency } = useAuth();
    const { setLoading, showToast } = useUI();
    const [activeTab, setActiveTab] = useState<VaultTab>(initialReceiverId ? 'gifts' : initialTab);
    const [vaultMode, setVaultMode] = useState<VaultMode>('deposit');
    const [vaultAmount, setVaultAmount] = useState<number | ''>('');
    const [receiverId, setReceiverId] = useState(initialReceiverId);
    const [giftAmount, setGiftAmount] = useState<number | ''>('');
    const [exchangeDirection, setExchangeDirection] = useState<WalletExchangeDirection>('gold-to-silver');
    const [exchangeAmount, setExchangeAmount] = useState<number | ''>('');

    useEffect(() => {
        setActiveTab(initialReceiverId ? 'gifts' : initialTab);
        if (initialReceiverId) setReceiverId(initialReceiverId);
    }, [initialReceiverId, initialTab]);

    const walletGold = user?.balance.gold ?? 0;
    const walletSilver = user?.balance.silver ?? 0;
    const vaultGold = user?.vault_gold ?? 0;
    const vaultSourceBalance = vaultMode === 'deposit' ? walletGold : vaultGold;
    const numericVaultAmount = Number(vaultAmount) || 0;
    const numericGiftAmount = Number(giftAmount) || 0;
    const giftFee = Math.floor(numericGiftAmount * GIFT_FEE_RATE);
    const giftReceived = Math.max(0, numericGiftAmount - giftFee);
    const exchangeSourceBalance = exchangeDirection === 'gold-to-silver' ? walletGold : walletSilver;
    const numericExchangeAmount = Number(exchangeAmount) || 0;
    const exchangeSummary = calculateWalletExchange(exchangeDirection, numericExchangeAmount);
    const canExchange = canSubmitWalletExchange(exchangeDirection, numericExchangeAmount, exchangeSourceBalance);
    const exchangeFromLabel = exchangeDirection === 'gold-to-silver' ? '金幣' : '銀幣';
    const exchangeToLabel = exchangeDirection === 'gold-to-silver' ? '銀幣' : '金幣';

    const setSanitizedAmount = (
        value: string,
        max: number,
        setter: React.Dispatch<React.SetStateAction<number | ''>>,
    ) => {
        const sanitized = value.replace(/[^0-9]/g, '');
        setter(sanitized ? Math.min(Number(sanitized), max) : '');
    };

    const runMock = (action: () => boolean, success: string, failure: string, reset: () => void) => {
        setLoading(true);
        setTimeout(() => {
            const succeeded = action();
            setLoading(false);
            showToast(succeeded ? success : failure, succeeded ? 'success' : 'error');
            if (succeeded) reset();
        }, 700);
    };

    const handleVaultTransfer = () => {
        if (numericVaultAmount <= 0 || numericVaultAmount > vaultSourceBalance) return;
        runMock(
            () => vaultMode === 'deposit' ? depositToVault(numericVaultAmount) : withdrawFromVault(numericVaultAmount),
            vaultMode === 'deposit' ? '成功存入保險箱' : '成功取出至錢包',
            vaultMode === 'deposit' ? '錢包金幣不足' : '保險箱餘額不足',
            () => setVaultAmount(''),
        );
    };

    const handleGiftTransfer = () => {
        if (!receiverId.trim() || numericGiftAmount <= 0) {
            showToast('請輸入接收者 ID 與贈禮金額', 'error');
            return;
        }
        runMock(
            () => transferFromVault(receiverId, numericGiftAmount),
            `已贈送 ${numericGiftAmount.toLocaleString()} 金幣，對方實收 ${giftReceived.toLocaleString()} 金幣`,
            '保險箱餘額不足，請先存入金幣',
            () => {
                setReceiverId('');
                setGiftAmount('');
            },
        );
    };

    const handleWalletExchange = () => {
        if (!canExchange) {
            showToast(exchangeDirection === 'silver-to-gold' && numericExchangeAmount % GOLD_TO_SILVER_RATE !== 0
                ? '銀幣換金幣需以 100 銀幣為單位'
                : '請確認兌換金額與錢包餘額', 'error');
            return;
        }
        setLoading(true);
        setTimeout(() => {
            const result = exchangeWalletCurrency(exchangeDirection, numericExchangeAmount);
            setLoading(false);
            if (!result) {
                showToast('目前餘額不足，請重新輸入', 'error');
                return;
            }
            showToast(`已兌換 ${result.fromAmount.toLocaleString()} ${exchangeFromLabel}，獲得 ${result.toAmount.toLocaleString()} ${exchangeToLabel}`, 'success');
            setExchangeAmount('');
        }, 700);
    };

    const tabs: Array<{ key: VaultTab; label: string; icon: React.ReactNode }> = [
        { key: 'vault', label: '保險箱', icon: <ShieldCheck size={15} /> },
        { key: 'gifts', label: '贈禮／轉點', icon: <Gift size={15} /> },
        { key: 'exchange', label: '兌換', icon: <ArrowLeftRight size={15} /> },
    ];

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative flex h-[min(680px,92vh)] w-[94%] max-w-[1040px] flex-col overflow-hidden rounded-[26px] border border-white/10 bg-[#1a0b2e] shadow-2xl animate-in zoom-in-95 duration-200">
                <header className="relative flex-none border-b border-white/10 bg-gradient-to-r from-[#122d3e] via-[#1a0b2e] to-[#130720] px-6 pb-3 pt-4">
                    <button type="button" aria-label="關閉保險箱" onClick={onClose} className="absolute right-5 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white/55 hover:bg-white/10 hover:text-white">
                        <X size={19} />
                    </button>
                    <div className="flex items-center gap-3 pr-12">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-200">
                            <ShieldCheck size={21} />
                        </div>
                        <div>
                            <p className="text-[8px] font-black tracking-[0.22em] text-cyan-200/60">SECURE ASSET CENTER</p>
                            <h2 className="text-xl font-black text-white">保險箱</h2>
                        </div>
                    </div>
                    <nav className="mt-3 flex max-w-xl gap-2" aria-label="保險箱功能">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${activeTab === tab.key
                                    ? 'bg-gradient-to-r from-cyan-300 to-teal-400 text-[#06232b] shadow-lg shadow-cyan-400/10'
                                    : 'border border-white/5 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {tab.icon}{tab.label}
                            </button>
                        ))}
                    </nav>
                </header>

                <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                    {activeTab === 'vault' && (
                        <div className="grid h-full gap-4 lg:grid-cols-[0.82fr_1.18fr]">
                            <section className="space-y-3">
                                <BalanceCard icon={<Wallet size={20} />} label="錢包金幣" amount={walletGold} tone="gold" />
                                <BalanceCard icon={<ShieldCheck size={20} />} label="保險箱金幣" amount={vaultGold} tone="cyan" />
                                <div className="rounded-2xl border border-white/8 bg-black/20 p-4 text-[10px] leading-5 text-slate-400">
                                    <Info className="mb-2 text-cyan-200" size={16} />
                                    保險箱金幣可用於玩家贈禮；存入與取出會立即更新錢包及交易紀錄。
                                </div>
                            </section>
                            <section className="rounded-2xl border border-white/8 bg-[#12071f] p-5">
                                <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-black/25 p-1">
                                    <ModeButton active={vaultMode === 'deposit'} label="存入保險箱" icon={<ArrowDownToLine size={15} />} onClick={() => { setVaultMode('deposit'); setVaultAmount(''); }} />
                                    <ModeButton active={vaultMode === 'withdraw'} label="取出至錢包" icon={<ArrowUpFromLine size={15} />} onClick={() => { setVaultMode('withdraw'); setVaultAmount(''); }} />
                                </div>
                                <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-5 text-center">
                                    <label className="text-[9px] font-black tracking-wider text-slate-500">{vaultMode === 'deposit' ? '存入金額' : '取出金額'}</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        aria-label={vaultMode === 'deposit' ? '存入金額' : '取出金額'}
                                        value={vaultAmount}
                                        onChange={event => setSanitizedAmount(event.target.value, vaultSourceBalance, setVaultAmount)}
                                        placeholder="0"
                                        className="mt-2 w-full bg-transparent text-center font-mono text-4xl font-black text-[#FFD700] outline-none placeholder:text-white/10"
                                    />
                                    <input type="range" min="0" max={vaultSourceBalance} value={numericVaultAmount} onChange={event => setSanitizedAmount(event.target.value, vaultSourceBalance, setVaultAmount)} className="mt-5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-cyan-300" />
                                    <div className="mt-4 grid grid-cols-4 gap-2">
                                        {[0.25, 0.5, 0.75, 1].map(percent => <QuickAmount key={percent} label={percent === 1 ? 'MAX' : `${percent * 100}%`} onClick={() => setVaultAmount(Math.floor(vaultSourceBalance * percent))} />)}
                                    </div>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <SummaryCell label="操作前可用" value={vaultSourceBalance} suffix="金幣" />
                                    <SummaryCell label="操作後可用" value={Math.max(0, vaultSourceBalance - numericVaultAmount)} suffix="金幣" accent />
                                </div>
                                <button type="button" onClick={handleVaultTransfer} disabled={numericVaultAmount <= 0 || numericVaultAmount > vaultSourceBalance} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-teal-400 py-3 text-sm font-black text-[#06232b] hover:brightness-110 disabled:pointer-events-none disabled:opacity-35">
                                    {vaultMode === 'deposit' ? <ArrowDownToLine size={17} /> : <ArrowUpFromLine size={17} />}
                                    確認{vaultMode === 'deposit' ? '存入' : '取出'}
                                </button>
                            </section>
                        </div>
                    )}

                    {activeTab === 'gifts' && (
                        <div className="grid h-full gap-4 lg:grid-cols-[0.75fr_1.25fr]">
                            <section className="space-y-3">
                                <BalanceCard icon={<ShieldCheck size={20} />} label="可贈禮餘額" amount={vaultGold} tone="cyan" />
                                <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                                    <div className="flex items-center gap-3 border-b border-white/8 pb-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600"><Crown size={19} /></div>
                                        <div><strong className="block text-sm text-[#FFD700]">VIP {user?.vipLevel ?? 0}</strong><span className="text-[9px] text-slate-500">固定 Mock 手續費 5%</span></div>
                                    </div>
                                    <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                                        <SummaryCell label="今日剩餘" value={5} suffix="/ 10 次" />
                                        <SummaryCell label="單次上限" value={1_000_000} suffix="點" />
                                    </div>
                                </div>
                            </section>
                            <section className="rounded-2xl border border-white/8 bg-[#12071f] p-5">
                                <div className="flex items-center gap-3"><Gift className="text-pink-300" size={22} /><div><h3 className="text-lg font-black text-white">玩家贈禮／轉點</h3><p className="text-[10px] text-slate-500">從保險箱扣除金幣並建立 Mock 紀錄</p></div></div>
                                <div className="mt-5 space-y-4">
                                    <label className="block">
                                        <span className="mb-2 block text-[9px] font-black text-slate-400">接收者玩家 ID</span>
                                        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-4 py-3">
                                            <Send size={15} className="text-purple-300" />
                                            <input value={receiverId} onChange={event => setReceiverId(event.target.value)} placeholder="輸入玩家 ID" className="w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-slate-600" />
                                        </div>
                                    </label>
                                    <label className="block">
                                        <span className="mb-2 block text-[9px] font-black text-slate-400">贈禮金額</span>
                                        <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3">
                                            <input type="text" inputMode="numeric" value={giftAmount} onChange={event => setSanitizedAmount(event.target.value, vaultGold, setGiftAmount)} placeholder="0" className="w-full bg-transparent text-center font-mono text-3xl font-black text-[#FFD700] outline-none placeholder:text-white/10" />
                                        </div>
                                    </label>
                                </div>
                                <div className="mt-4 grid grid-cols-3 gap-3">
                                    <SummaryCell label="扣除" value={numericGiftAmount} suffix="金幣" />
                                    <SummaryCell label="手續費" value={giftFee} suffix="金幣" />
                                    <SummaryCell label="對方實收" value={giftReceived} suffix="金幣" accent />
                                </div>
                                <button type="button" onClick={handleGiftTransfer} disabled={!receiverId.trim() || numericGiftAmount <= 0 || numericGiftAmount > vaultGold} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 py-3 text-sm font-black text-white hover:brightness-110 disabled:pointer-events-none disabled:opacity-35">
                                    <Send size={17} />確認贈禮
                                </button>
                            </section>
                        </div>
                    )}

                    {activeTab === 'exchange' && (
                        <div className="grid h-full gap-4 lg:grid-cols-[0.78fr_1.22fr]">
                            <section className="space-y-3">
                                <BalanceCard icon={<Coins size={20} />} label="儲值金幣" amount={walletGold} tone="gold" />
                                <BalanceCard icon={<Coins size={20} />} label="儲值銀幣" amount={walletSilver} tone="silver" />
                                <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                                    <span className="text-[9px] font-black text-slate-500">兌換比值</span>
                                    <strong className="mt-1 block text-lg text-[#FFD700]">1 金幣 = 100 銀幣</strong>
                                    <p className="mt-1 text-[9px] leading-5 text-slate-500">金銀幣互換不收手續費；銀幣換金幣須以 100 為單位。</p>
                                </div>
                            </section>
                            <section className="rounded-2xl border border-white/8 bg-[#12071f] p-5">
                                <div className="flex items-center gap-3"><ArrowLeftRight className="text-cyan-200" size={22} /><div><h3 className="text-lg font-black text-white">金銀幣兌換</h3><p className="text-[10px] text-slate-500">選擇方向後即時計算操作結果</p></div></div>
                                <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-black/25 p-1">
                                    <ModeButton active={exchangeDirection === 'gold-to-silver'} label="金幣兌銀幣" icon={<Coins size={14} />} onClick={() => { setExchangeDirection('gold-to-silver'); setExchangeAmount(''); }} />
                                    <ModeButton active={exchangeDirection === 'silver-to-gold'} label="銀幣兌金幣" icon={<Coins size={14} />} onClick={() => { setExchangeDirection('silver-to-gold'); setExchangeAmount(''); }} />
                                </div>
                                <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-5 text-center">
                                    <label className="text-[9px] font-black tracking-wider text-slate-500">兌換{exchangeFromLabel}</label>
                                    <input type="text" inputMode="numeric" aria-label="兌換金額" value={exchangeAmount} onChange={event => setSanitizedAmount(event.target.value, exchangeSourceBalance, setExchangeAmount)} placeholder="0" className="mt-2 w-full bg-transparent text-center font-mono text-4xl font-black text-[#FFD700] outline-none placeholder:text-white/10" />
                                    <div className="mt-4 grid grid-cols-4 gap-2">
                                        {[0.25, 0.5, 0.75, 1].map(percent => {
                                            const raw = Math.floor(exchangeSourceBalance * percent);
                                            const amount = exchangeDirection === 'silver-to-gold' ? Math.floor(raw / GOLD_TO_SILVER_RATE) * GOLD_TO_SILVER_RATE : raw;
                                            return <QuickAmount key={percent} label={percent === 1 ? 'MAX' : `${percent * 100}%`} onClick={() => setExchangeAmount(amount)} />;
                                        })}
                                    </div>
                                </div>
                                <div className="mt-4 grid grid-cols-3 gap-3">
                                    <SummaryCell label="扣除" value={exchangeSummary.fromAmount} suffix={exchangeFromLabel} />
                                    <SummaryCell label="手續費" value={exchangeSummary.fee} suffix={exchangeFromLabel} />
                                    <SummaryCell label="獲得" value={exchangeSummary.toAmount} suffix={exchangeToLabel} accent />
                                </div>
                                <button type="button" onClick={handleWalletExchange} disabled={!canExchange} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-teal-400 py-3 text-sm font-black text-[#06232b] hover:brightness-110 disabled:pointer-events-none disabled:opacity-35">
                                    <RefreshCw size={17} />確認兌換
                                </button>
                            </section>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const BalanceCard = ({ icon, label, amount, tone }: { icon: React.ReactNode; label: string; amount: number; tone: 'gold' | 'cyan' | 'silver' }) => {
    const toneClass = tone === 'gold'
        ? 'border-[#FFD700]/20 bg-[#FFD700]/8 text-[#FFD700]'
        : tone === 'cyan'
            ? 'border-cyan-300/20 bg-cyan-400/8 text-cyan-200'
            : 'border-slate-200/20 bg-slate-200/8 text-slate-200';
    return (
        <div className={`flex items-center gap-3 rounded-2xl border p-4 ${toneClass}`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/20">{icon}</div>
            <div><span className="text-[9px] font-black text-slate-400">{label}</span><strong className="mt-0.5 block text-xl font-black text-white">{amount.toLocaleString()}</strong></div>
        </div>
    );
};

const ModeButton = ({ active, label, icon, onClick }: { active: boolean; label: string; icon: React.ReactNode; onClick: () => void }) => (
    <button type="button" onClick={onClick} className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-black transition-all ${active ? 'bg-white/12 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}>{icon}{label}</button>
);

const QuickAmount = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button type="button" onClick={onClick} className="rounded-lg bg-white/5 py-2 text-[9px] font-black text-slate-400 hover:bg-white/10 hover:text-white">{label}</button>
);

const SummaryCell = ({ label, value, suffix, accent = false }: { label: string; value: number; suffix: string; accent?: boolean }) => (
    <div className="rounded-xl border border-white/8 bg-black/20 p-3">
        <span className="block text-[8px] font-bold text-slate-500">{label}</span>
        <strong className={`mt-1 block truncate text-xs font-black ${accent ? 'text-cyan-200' : 'text-white'}`}>{value.toLocaleString()} {suffix}</strong>
    </div>
);

export default VaultInterface;
