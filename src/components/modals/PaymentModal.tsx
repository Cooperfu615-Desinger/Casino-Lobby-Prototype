import { useState } from 'react';
import { X, Check, Loader2, Apple, Play } from 'lucide-react';
import { Package, SalePackage } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';

interface PaymentModalProps {
    packageInfo?: Package | SalePackage;
    onClose: () => void;
}

// Default package info when called without props (e.g., from PromotionModal)
const DEFAULT_PACKAGE_INFO: SalePackage = {
    id: 0,
    title: '優惠方案',
    coins: '888,888',
    price: '$9.99',
    original: '$19.99',
    tag: 'PROMO'
};

const PaymentModal = ({ packageInfo = DEFAULT_PACKAGE_INFO, onClose }: PaymentModalProps) => {
    const [step, setStep] = useState<'confirm' | 'processing' | 'success'>('confirm');
    const [channel, setChannel] = useState<'App Store' | 'Google Play'>('App Store');
    const { user, completeDeposit } = useAuth();
    const { showToast, triggerBalanceAnimation } = useUI();
    const coinAmount = Number(packageInfo.coins.replace(/[^0-9]/g, ''));

    const handlePayment = () => {
        setStep('processing');
        setTimeout(() => {
            const succeeded = completeDeposit(coinAmount, channel, packageInfo.price);
            if (!succeeded) {
                setStep('confirm');
                showToast('目前無法完成儲值，請重新登入後再試', 'error');
                return;
            }

            setStep('success');
            triggerBalanceAnimation();
            showToast(`${coinAmount.toLocaleString()} 金幣已入帳`, 'success');
        }, 1200);
    };

    return (
        <div className="juheng-modal-backdrop fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">

            {/* Modal */}
            <div className="juheng-modal-panel relative w-[90%] max-w-md bg-[#1a0b2e] border border-[#FFD700] rounded-2xl shadow-[0_0_50px_rgba(255,215,0,0.3)] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="bg-white/5 px-6 py-4 flex justify-between items-center border-b border-white/5">
                    <div>
                        <span className="text-white font-bold">APP 商店儲值</span>
                        <p className="mt-0.5 text-[10px] font-bold text-slate-500">Mock Payment</p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={step === 'processing'}
                        className="text-slate-400 hover:text-white transition-colors"
                        aria-label="關閉儲值確認"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col items-center text-center">

                    {step === 'processing' ? (
                        <div className="py-10">
                            <Loader2 size={48} className="text-blue-500 animate-spin" />
                            <p className="text-slate-400 mt-4 text-sm font-medium">正在向 {channel} 確認 Mock 付款...</p>
                        </div>
                    ) : step === 'success' ? (
                        <div className="py-10">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-black mb-4 animate-in zoom-in duration-300">
                                <Check size={32} strokeWidth={3} />
                            </div>
                            <h3 className="text-white text-xl font-bold">儲值成功</h3>
                            <p className="text-slate-400 text-sm mt-2">{coinAmount.toLocaleString()} 金幣已加入錢包。</p>
                            <button onClick={onClose} className="mt-6 w-full rounded-xl bg-[#FFD700] py-3 font-black text-black transition-all hover:brightness-110 active:scale-95">完成</button>
                        </div>
                    ) : (
                        <>
                            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 text-2xl font-bold text-black border-2 border-white/20">
                                💰
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-1">
                                {'title' in packageInfo ? (packageInfo as SalePackage).title : '金幣方案'}
                            </h2>
                            <p className="text-slate-400 text-sm mb-6">
                                入帳 {packageInfo.coins} 金幣
                            </p>

                            <div className="w-full bg-black/30 rounded-xl p-4 mb-6 border border-white/5">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-400 text-sm">玩家帳號</span>
                                    <span className="max-w-[220px] truncate text-white text-sm font-medium">{user?.id ?? '未登入'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 text-sm">付款金額</span>
                                    <span className="text-white text-lg font-bold">{packageInfo.price}</span>
                                </div>
                            </div>

                            <div className="mb-8 grid w-full grid-cols-2 gap-3" role="radiogroup" aria-label="選擇 APP 儲值渠道">
                                {([
                                    { name: 'App Store' as const, icon: <Apple size={20} fill="currentColor" /> },
                                    { name: 'Google Play' as const, icon: <Play size={20} fill="currentColor" /> },
                                ]).map(option => (
                                    <button
                                        key={option.name}
                                        type="button"
                                        role="radio"
                                        aria-checked={channel === option.name}
                                        onClick={() => setChannel(option.name)}
                                        className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-black transition-all ${channel === option.name ? 'border-[#FFD700] bg-[#FFD700]/10 text-[#FFD700] shadow-[0_0_18px_rgba(255,215,0,0.12)]' : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'}`}
                                    >
                                        {option.icon}
                                        {option.name}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handlePayment}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                            >
                                使用 {channel} 確認付款
                            </button>
                        </>
                    )}
                </div>

                {/* Secure Badge */}
                <div className="bg-black/40 py-3 text-center border-t border-white/5">
                    <p className="text-slate-500 text-xs flex items-center justify-center gap-1.5">
                        <Check size={12} className="text-green-500" /> 本頁為功能原型，不會產生真實交易
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
