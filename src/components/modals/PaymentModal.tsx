import { useState } from 'react';
import { Check, Loader2, Apple, Play, Gem } from 'lucide-react';
import { Package, SalePackage } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import LobbyModalShell from '../common/LobbyModalShell';
import { LobbyModalButton } from '../common/LobbyModalPrimitives';

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
        <LobbyModalShell
            title="APP 商店儲值"
            eyebrow="MOCK PAYMENT"
            icon={<Gem size={21} />}
            onClose={onClose}
            closeLabel="關閉儲值確認"
            closeDisabled={step === 'processing'}
            frameClassName="h-[min(620px,90vh)] w-[94%] max-w-md"
            bodyClassName="p-0"
        >
            <div className="flex min-h-full flex-col">
                <div className="flex flex-1 flex-col items-center p-5 text-center">

                    {step === 'processing' ? (
                        <div className="py-6">
                            <Loader2 size={48} className="text-blue-500 animate-spin" />
                            <p className="text-slate-400 mt-4 text-sm font-medium">正在向 {channel} 確認 Mock 付款...</p>
                        </div>
                    ) : step === 'success' ? (
                        <div className="py-6">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-black mb-4 animate-in zoom-in duration-300">
                                <Check size={32} strokeWidth={3} />
                            </div>
                            <h3 className="text-white text-xl font-bold">儲值成功</h3>
                            <p className="text-slate-400 text-sm mt-2">{coinAmount.toLocaleString()} 金幣已加入錢包。</p>
                            <LobbyModalButton onClick={onClose} fullWidth className="mt-6">完成</LobbyModalButton>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-white/20 bg-gradient-to-br from-yellow-400 to-yellow-600 text-2xl font-bold text-black shadow-lg">
                                💰
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-1">
                                {'title' in packageInfo ? (packageInfo as SalePackage).title : '金幣方案'}
                            </h2>
                            <p className="mb-4 text-sm text-slate-400">
                                入帳 {packageInfo.coins} 金幣
                            </p>

                            <div className="mb-4 w-full rounded-xl border border-white/5 bg-black/30 p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-400 text-sm">玩家帳號</span>
                                    <span className="max-w-[220px] truncate text-white text-sm font-medium">{user?.id ?? '未登入'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 text-sm">付款金額</span>
                                    <span className="text-white text-lg font-bold">{packageInfo.price}</span>
                                </div>
                            </div>

                            <div className="mb-5 grid w-full grid-cols-2 gap-3" role="radiogroup" aria-label="選擇 APP 儲值渠道">
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
                                        className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-sm font-black transition-all ${channel === option.name ? 'border-[#FFD700] bg-[#FFD700]/10 text-[#FFD700] shadow-[0_0_18px_rgba(255,215,0,0.12)]' : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'}`}
                                    >
                                        {option.icon}
                                        {option.name}
                                    </button>
                                ))}
                            </div>

                            <LobbyModalButton
                                onClick={handlePayment}
                                fullWidth
                            >
                                使用 {channel} 確認付款
                            </LobbyModalButton>
                        </>
                    )}
                </div>

                {/* Secure Badge */}
                <div className="border-t border-white/15 bg-[#263990]/24 py-3 text-center">
                    <p className="text-slate-500 text-xs flex items-center justify-center gap-1.5">
                        <Check size={12} className="text-green-500" /> 本頁為功能原型，不會產生真實交易
                    </p>
                </div>
            </div>
        </LobbyModalShell>
    );
};

export default PaymentModal;
