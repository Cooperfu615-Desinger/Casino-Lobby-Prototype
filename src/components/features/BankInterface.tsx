import { useMemo, useState } from 'react';
import {
    Gem,
    History,
    Landmark,
    SlidersHorizontal,
    Sparkles,
    X,
} from 'lucide-react';
import { PACKAGES, OFFER_PACKAGES } from '../../data/mockData';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import type { Transaction, TransactionStatus } from '../../types/transaction';

interface BankInterfaceProps {
    onClose: () => void;
    initialTab?: BankTab;
}

export type BankTab = 'deposit' | 'offers' | 'records';
type RecordCategory = 'all' | 'deposit' | 'vault' | 'gift' | 'exchange' | 'reward';
type RecordStatusFilter = 'all' | TransactionStatus;

const CATEGORY_TYPES: Record<Exclude<RecordCategory, 'all'>, Transaction['type'][]> = {
    deposit: ['deposit', 'withdraw'],
    vault: ['vault_deposit', 'vault_gift'],
    gift: ['gift_transfer', 'gift_package'],
    exchange: ['currency_conversion'],
    reward: ['free_reward', 'reward_card_conversion', 'rebate'],
};

const BankInterface = ({ onClose, initialTab = 'deposit' }: BankInterfaceProps) => {
    const { openModal } = useUI();
    const { transactions } = useAuth();
    const [activeTab, setActiveTab] = useState<BankTab>(initialTab);
    const [recordCategory, setRecordCategory] = useState<RecordCategory>('all');
    const [recordStatus, setRecordStatus] = useState<RecordStatusFilter>('all');

    const filteredTransactions = useMemo(() => transactions.filter(transaction => {
        const matchesCategory = recordCategory === 'all'
            || CATEGORY_TYPES[recordCategory].includes(transaction.type);
        const matchesStatus = recordStatus === 'all' || transaction.status === recordStatus;
        return matchesCategory && matchesStatus;
    }), [recordCategory, recordStatus, transactions]);

    const tabs: Array<{ key: BankTab; label: string; icon: React.ReactNode }> = [
        { key: 'deposit', label: '儲值', icon: <Gem size={15} /> },
        { key: 'offers', label: '優惠', icon: <Sparkles size={15} /> },
        { key: 'records', label: '紀錄', icon: <History size={15} /> },
    ];

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative flex h-[min(680px,92vh)] w-[94%] max-w-[1040px] flex-col overflow-hidden rounded-[26px] border border-white/10 bg-[#1a0b2e] shadow-2xl animate-in zoom-in-95 duration-200">
                <header className="relative flex-none border-b border-white/10 bg-gradient-to-r from-[#2a1244] via-[#1a0b2e] to-[#130720] px-6 pb-3 pt-4">
                    <button type="button" aria-label="關閉銀行中心" onClick={onClose} className="absolute right-5 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white/55 hover:bg-white/10 hover:text-white">
                        <X size={19} />
                    </button>
                    <div className="flex items-center gap-3 pr-12">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#FFD700]/25 bg-[#FFD700]/10 text-[#FFD700]">
                            <Landmark size={20} />
                        </div>
                        <div>
                            <p className="text-[8px] font-black tracking-[0.22em] text-[#FFD700]/70">APP WALLET SERVICES</p>
                            <h2 className="text-xl font-black text-white">銀行中心</h2>
                        </div>
                    </div>
                    <nav className="mt-3 flex max-w-lg gap-2" aria-label="銀行功能">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${activeTab === tab.key
                                    ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/15'
                                    : 'border border-white/5 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {tab.icon}{tab.label}
                            </button>
                        ))}
                    </nav>
                </header>

                <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                    {activeTab === 'deposit' && (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            {PACKAGES.map(pkg => (
                                <button
                                    key={pkg.id}
                                    type="button"
                                    onClick={() => openModal('payment', { packageInfo: pkg })}
                                    className="group relative flex min-h-[205px] flex-col items-center justify-between rounded-2xl border border-white/10 bg-[#0f061e] p-5 text-center shadow-lg transition-all hover:-translate-y-1 hover:border-[#FFD700]/70 hover:bg-white/5 hover:shadow-[#FFD700]/10"
                                >
                                    {pkg.best && <span className="absolute -top-2.5 rounded-full border border-white/15 bg-red-600 px-3 py-1 text-[9px] font-black text-white">BEST VALUE</span>}
                                    <div className="relative mt-2">
                                        <span className="absolute inset-0 rounded-full bg-[#FFD700]/20 blur-xl transition-transform group-hover:scale-150" />
                                        <Gem size={52} className="relative text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.45)]" />
                                    </div>
                                    <div className="w-full">
                                        <strong className="block text-xl font-black tracking-wide text-white">{pkg.coins}</strong>
                                        <span className="mt-1 block min-h-4 text-[10px] font-black text-emerald-400">{pkg.bonus ? `${pkg.bonus} BONUS` : ''}</span>
                                        <span className="mt-3 block w-full rounded-xl border border-white/15 bg-gradient-to-r from-emerald-500 to-emerald-700 py-2.5 text-xs font-black text-white">{pkg.price}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {activeTab === 'offers' && (
                        <div>
                            <p className="mb-4 text-xs text-slate-400">APP Store／Google Play 專屬優惠方案</p>
                            <div className="grid gap-4 md:grid-cols-2">
                                {OFFER_PACKAGES.filter(offer => offer.id !== 2 && offer.id !== 6).map(offer => (
                                    <button
                                        key={offer.id}
                                        type="button"
                                        onClick={() => openModal('payment', { packageInfo: offer })}
                                        className={`relative min-h-[190px] overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-left shadow-xl transition-all hover:-translate-y-1 ${offer.gradient}`}
                                    >
                                        <Sparkles className="absolute -bottom-8 -right-5 text-white/10" size={120} />
                                        <span className="relative inline-block rounded-full bg-black/30 px-3 py-1 text-[9px] font-black text-white">{offer.tag}</span>
                                        <h3 className="relative mt-3 text-lg font-black text-white">{offer.title}</h3>
                                        <p className="relative mt-1 text-xs text-white/70">{offer.description}</p>
                                        <div className="relative mt-5 flex items-end justify-between">
                                            <div><span className="block text-[8px] font-black tracking-wider text-white/50">COINS</span><strong className="text-lg text-[#FFD700]">{offer.coins}</strong></div>
                                            <div className="text-right"><strong className="block text-lg text-white">{offer.price}</strong><span className="text-xs text-white/45 line-through">{offer.original}</span></div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'records' && (
                        <div>
                            <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-white/8 bg-black/20 p-3">
                                <SlidersHorizontal size={15} className="mr-1 text-[#FFD700]" />
                                {([
                                    ['all', '全部'],
                                    ['deposit', '儲值'],
                                    ['vault', '保險箱'],
                                    ['gift', '贈禮'],
                                    ['exchange', '兌換'],
                                    ['reward', '獎勵'],
                                ] as const).map(([key, label]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setRecordCategory(key)}
                                        className={`rounded-full px-3.5 py-1.5 text-[10px] font-black transition-all ${recordCategory === key ? 'bg-[#FFD700] text-black' : 'bg-white/5 text-slate-400 hover:text-white'}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                                <select
                                    aria-label="交易狀態"
                                    value={recordStatus}
                                    onChange={event => setRecordStatus(event.target.value as RecordStatusFilter)}
                                    className="ml-auto rounded-xl border border-white/10 bg-[#160922] px-3 py-1.5 text-[10px] font-bold text-slate-300 outline-none"
                                >
                                    <option value="all">全部狀態</option>
                                    <option value="success">成功</option>
                                    <option value="processing">處理中</option>
                                    <option value="failed">失敗</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                {filteredTransactions.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center text-sm text-slate-500">目前沒有符合條件的紀錄</div>
                                ) : filteredTransactions.map(transaction => (
                                    <TransactionRow key={transaction.id} transaction={transaction} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const TransactionRow = ({ transaction }: { transaction: Transaction }) => {
    const isOutgoing = ['gift_transfer', 'vault_deposit'].includes(transaction.type)
        && !transaction.method.includes('取出');
    const amountTone = transaction.type === 'deposit'
        ? 'text-emerald-400'
        : transaction.type === 'gift_transfer'
            ? 'text-orange-300'
            : ['free_reward', 'reward_card_conversion', 'rebate'].includes(transaction.type)
                ? 'text-[#FFD700]'
                : 'text-cyan-300';
    const statusLabel = transaction.status === 'success' ? '成功' : transaction.status === 'processing' ? '處理中' : '失敗';
    const statusTone = transaction.status === 'success'
        ? 'bg-emerald-500/12 text-emerald-300'
        : transaction.status === 'processing'
            ? 'bg-amber-500/12 text-amber-300'
            : 'bg-red-500/12 text-red-300';

    return (
        <article className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-[#0f061e] px-4 py-3 transition-colors hover:border-white/10">
            <div className="min-w-0">
                <strong className="block truncate text-xs text-white">{transaction.method}</strong>
                <span className="mt-1 block text-[9px] text-slate-500">{transaction.date}・{transaction.id}</span>
            </div>
            <div className="shrink-0 text-right">
                <strong className={`block text-xs ${amountTone}`}>{isOutgoing ? '−' : '+'}{transaction.amount}</strong>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[8px] font-black ${statusTone}`}>{statusLabel}</span>
            </div>
        </article>
    );
};

export default BankInterface;
