import { useState, useEffect } from 'react';
import { Landmark, Gem, X, Gift, History, Sparkles, User, Wallet, Send, Crown, Info } from 'lucide-react';
import { PACKAGES, OFFER_PACKAGES, TRANSACTION_HISTORY } from '../../data/mockData';
import { useUI } from '../../context/UIContext';

interface BankInterfaceProps {
    onClose: () => void;
    /** 從聊天室跳轉時帶入的接收者 ID */
    receiverId?: string;
}

type BankTab = 'deposit' | 'offers' | 'gifts' | 'records';
type RecordFilter = 'all' | 'deposit' | 'free_reward' | 'gift_transfer' | 'gift_package';

const CONSTANTS = {
    FEE_RATE: 0.05,
    MOCK_BALANCE: 123456789
};

const BankInterface = ({ onClose, receiverId: initialReceiverId }: BankInterfaceProps) => {
    const { openModal, setLoading, showToast } = useUI();
    const [activeTab, setActiveTab] = useState<BankTab>(() => initialReceiverId ? 'gifts' : 'deposit');

    // Gifts tab state
    const [receiverId, setReceiverId] = useState(initialReceiverId || '');
    const [amount, setAmount] = useState<number | ''>('');

    // Records tab state
    const [recordFilter, setRecordFilter] = useState<RecordFilter>('all');

    // 當從聊天室跳轉時，自動切換到贈禮並填入 ID
    useEffect(() => {
        if (initialReceiverId) {
            setActiveTab('gifts');
            setReceiverId(initialReceiverId);
        }
    }, [initialReceiverId]);

    const numericAmount = Number(amount) || 0;
    const fee = Math.floor(numericAmount * CONSTANTS.FEE_RATE);
    const actualReceived = Math.max(0, numericAmount - fee);

    // Filter transactions for Records tab (只保留：儲值、免費獎勵、轉點贈禮、購買禮包)
    const filteredTransactions = TRANSACTION_HISTORY.filter(tx => {
        if (recordFilter === 'all') {
            return ['deposit', 'free_reward', 'gift_transfer', 'gift_package'].includes(tx.type);
        }
        return tx.type === recordFilter;
    });

    /**
     * 處理贈禮轉帳
     * 模擬 1 秒 Loading 後顯示成功 Toast
     */
    const handleGiftTransfer = () => {
        if (!receiverId || numericAmount <= 0) return;

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            showToast('點數贈送成功！', 'success');
            setReceiverId('');
            setAmount('');
        }, 1000);
    };

    const tabs: { key: BankTab; label: string; icon: React.ReactNode }[] = [
        { key: 'deposit', label: '儲值', icon: <Gem size={16} /> },
        { key: 'offers', label: '優惠', icon: <Sparkles size={16} /> },
        { key: 'gifts', label: '贈禮', icon: <Gift size={16} /> },
        { key: 'records', label: '紀錄', icon: <History size={16} /> },
    ];

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Modal Container */}
            <div className="relative w-[90%] max-w-[1100px] h-[650px] bg-[#1a0b2e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 bg-black/40 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Header with Tabs */}
                <header className="flex flex-col gap-4 px-8 pt-6 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <Landmark size={24} className="text-[#FFD700]" />
                        <h2 className="text-2xl font-bold text-white">銀行中心</h2>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${activeTab === tab.key
                                    ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/20'
                                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">

                    {/* ========== 儲值 Tab ========== */}
                    {activeTab === 'deposit' && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {PACKAGES.map(pkg => (
                                <div
                                    key={pkg.id}
                                    onClick={() => openModal('payment', { packageInfo: pkg })}
                                    className="relative group bg-[#0f061e] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between hover:border-[#FFD700] hover:bg-white/5 transition-all cursor-pointer shadow-lg hover:shadow-[#FFD700]/20 hover:-translate-y-1"
                                >
                                    {pkg.best && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md border border-white/20 whitespace-nowrap z-10">
                                            BEST VALUE
                                        </div>
                                    )}

                                    <div className="relative mb-4">
                                        <div className="absolute inset-0 bg-[#FFD700]/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-500"></div>
                                        <Gem size={64} className="text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] relative z-10" />
                                    </div>

                                    <div className="text-center w-full">
                                        <div className="text-white font-black text-2xl tracking-wide mb-1">{pkg.coins}</div>
                                        {pkg.bonus && <div className="text-green-400 text-sm font-bold mb-4">{pkg.bonus} BONUS</div>}

                                        <button className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 text-white font-bold py-3 rounded-full border border-white/20 shadow-lg active:scale-95 transition-all">
                                            {pkg.price}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ========== 優惠 Tab ========== */}
                    {activeTab === 'offers' && (
                        <div className="space-y-4">
                            <p className="text-slate-400 text-sm">專屬優惠方案，左右滑動查看更多</p>
                            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar -mx-2 px-2">
                                {OFFER_PACKAGES.map(offer => (
                                    <div
                                        key={offer.id}
                                        onClick={() => openModal('payment', { packageInfo: offer })}
                                        className={`flex-shrink-0 w-[280px] bg-gradient-to-br ${offer.gradient} rounded-2xl p-5 cursor-pointer hover:-translate-y-1 transition-all shadow-xl hover:shadow-2xl`}
                                    >
                                        {/* Tag */}
                                        <div className="inline-block bg-black/30 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                                            {offer.tag}
                                        </div>

                                        {/* Title & Description */}
                                        <h3 className="text-white font-bold text-lg mb-1">{offer.title}</h3>
                                        <p className="text-white/70 text-sm mb-4">{offer.description}</p>

                                        {/* Coins */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <Gem size={20} className="text-[#FFD700]" />
                                            <span className="text-white font-black text-xl">{offer.coins}</span>
                                        </div>

                                        {/* Price */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-bold text-lg">{offer.price}</span>
                                            <span className="text-white/50 line-through text-sm">{offer.original}</span>
                                        </div>

                                        {/* Expire Time */}
                                        {offer.expireTime && (
                                            <div className="mt-3 text-white/60 text-xs">
                                                ⏰ {offer.expireTime}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ========== 贈禮 Tab ========== */}
                    {activeTab === 'gifts' && (
                        <div className="h-full flex flex-col md:flex-row gap-4">
                            {/* 左側 - 資訊區 */}
                            <div className="md:w-[280px] bg-black/20 rounded-xl p-4 flex flex-col gap-3">
                                {/* VIP 等級 */}
                                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                                        <Crown size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <div className="text-[#FFD700] font-bold">VIP 5</div>
                                        <div className="text-[10px] text-slate-400">尊榮會員</div>
                                    </div>
                                </div>

                                {/* 限制條件資訊 */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <Info size={14} className="text-slate-500" />
                                        <span className="text-xs">每日贈禮次數</span>
                                    </div>
                                    <div className="bg-black/30 rounded-lg p-2.5 flex justify-between items-center">
                                        <span className="text-slate-400 text-xs">剩餘</span>
                                        <span className="text-white font-bold">5 <span className="text-slate-500 font-normal">/ 10 次</span></span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <Gem size={14} className="text-slate-500" />
                                        <span className="text-xs">單次最高贈送</span>
                                    </div>
                                    <div className="bg-black/30 rounded-lg p-2.5">
                                        <span className="text-[#FFD700] font-bold font-mono">1,000,000 點</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <Wallet size={14} className="text-slate-500" />
                                        <span className="text-xs">目前手續費率</span>
                                    </div>
                                    <div className="bg-black/30 rounded-lg p-2.5 flex justify-between items-center">
                                        <span className="text-red-400 font-bold">5%</span>
                                        <span className="text-[10px] text-slate-500">VIP 6 可降至 3%</span>
                                    </div>
                                </div>

                                {/* 餘額顯示 */}
                                <div className="mt-auto pt-3 border-t border-white/10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400 text-xs">可用餘額</span>
                                        <span className="text-[#FFD700] font-mono font-bold">${CONSTANTS.MOCK_BALANCE.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 右側 - 操作區 */}
                            <div className="flex-1 flex flex-col gap-3">
                                {/* Receiver Input */}
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-300 ml-1 font-medium">接收者 ID</label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            value={receiverId}
                                            onChange={(e) => setReceiverId(e.target.value)}
                                            placeholder="請輸入玩家 ID"
                                            className="w-full bg-[#0f0518] border border-white/10 rounded-lg px-4 py-2.5 pl-10 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FFD700] transition-colors"
                                        />
                                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#FFD700] transition-colors" />
                                    </div>
                                </div>

                                {/* Amount Input */}
                                <div className="flex-1 flex flex-col gap-2">
                                    <label className="text-xs text-slate-300 ml-1 font-medium">轉帳金額</label>
                                    <div className="bg-[#0f0518] border border-white/10 rounded-lg p-3 flex-1 flex flex-col justify-center gap-2">
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => {
                                                const val = e.target.value === '' ? '' : Number(e.target.value);
                                                if (val === '' || (val >= 0 && val <= CONSTANTS.MOCK_BALANCE)) {
                                                    setAmount(val);
                                                }
                                            }}
                                            placeholder="0"
                                            aria-label="轉帳金額"
                                            className="w-full bg-transparent text-center text-2xl font-bold text-[#FFD700] placeholder:text-white/10 focus:outline-none"
                                        />

                                        {/* Slider */}
                                        <div className="px-1">
                                            <input
                                                type="range"
                                                min="0"
                                                max={CONSTANTS.MOCK_BALANCE}
                                                step="1000"
                                                value={numericAmount}
                                                onChange={(e) => setAmount(Number(e.target.value))}
                                                aria-label="金額拉桿"
                                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FFD700]"
                                            />
                                            <div className="flex justify-between mt-1">
                                                <button type="button" onClick={() => setAmount(0)} className="text-[10px] text-slate-500 hover:text-white transition-colors">0%</button>
                                                <button type="button" onClick={() => setAmount(Math.floor(CONSTANTS.MOCK_BALANCE * 0.25))} className="text-[10px] text-slate-500 hover:text-white transition-colors">25%</button>
                                                <button type="button" onClick={() => setAmount(Math.floor(CONSTANTS.MOCK_BALANCE * 0.5))} className="text-[10px] text-slate-500 hover:text-white transition-colors">50%</button>
                                                <button type="button" onClick={() => setAmount(Math.floor(CONSTANTS.MOCK_BALANCE * 0.75))} className="text-[10px] text-slate-500 hover:text-white transition-colors">75%</button>
                                                <button type="button" onClick={() => setAmount(CONSTANTS.MOCK_BALANCE)} className="text-[10px] text-slate-500 hover:text-white transition-colors">MAX</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Fee Preview */}
                                <div className="bg-white/5 rounded-lg p-2.5 flex justify-between items-center">
                                    <div className="flex items-center gap-4 text-xs">
                                        <span className="text-slate-400">手續費 (5%): <span className="text-red-400 font-mono">-${fee.toLocaleString()}</span></span>
                                        <span className="text-slate-300">對方實收: <span className="text-[#FFD700] font-mono font-bold">${actualReceived.toLocaleString()}</span></span>
                                    </div>
                                </div>

                                {/* Transfer Button */}
                                <button
                                    onClick={handleGiftTransfer}
                                    disabled={!receiverId || numericAmount <= 0}
                                    className="w-full bg-gradient-to-r from-[#FFD700] to-[#DAA520] text-black font-bold py-3 rounded-xl shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2"
                                >
                                    <Send size={18} />
                                    <span>確認贈送</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ========== 紀錄 Tab ========== */}
                    {activeTab === 'records' && (
                        <div className="space-y-4">
                            {/* Filter Buttons */}
                            <div className="flex gap-2 flex-wrap">
                                {[
                                    { key: 'all', label: '全部' },
                                    { key: 'deposit', label: '儲值' },
                                    { key: 'free_reward', label: '免費獎勵' },
                                    { key: 'gift_transfer', label: '轉點贈禮' },
                                    { key: 'gift_package', label: '購買禮包' },
                                ].map(filter => (
                                    <button
                                        key={filter.key}
                                        onClick={() => setRecordFilter(filter.key as RecordFilter)}
                                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${recordFilter === filter.key
                                            ? 'bg-[#FFD700] text-black'
                                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                                            }`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>

                            {/* Transaction List */}
                            <div className="space-y-2">
                                {filteredTransactions.length === 0 ? (
                                    <div className="text-center text-slate-500 py-12">暫無紀錄</div>
                                ) : (
                                    filteredTransactions.map(tx => (
                                        <div
                                            key={tx.id}
                                            className="bg-[#0f061e] border border-white/5 rounded-xl p-4 flex justify-between items-center hover:border-white/10 transition-colors"
                                        >
                                            <div className="flex flex-col gap-1">
                                                <span className="text-white font-medium">{tx.method}</span>
                                                <span className="text-xs text-slate-500">{tx.date}</span>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className={`font-bold ${tx.type === 'deposit' ? 'text-green-400' :
                                                    tx.type === 'gift_transfer' ? 'text-orange-400' :
                                                        tx.type === 'free_reward' ? 'text-cyan-400' :
                                                            'text-purple-400'
                                                    }`}>
                                                    {tx.type === 'gift_transfer' ? '-' : '+'}{tx.amount}
                                                </span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded ${tx.status === 'success' ? 'bg-green-500/20 text-green-400' :
                                                    tx.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-red-500/20 text-red-400'
                                                    }`}>
                                                    {tx.status === 'success' ? '成功' : tx.status === 'processing' ? '處理中' : '失敗'}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BankInterface;
