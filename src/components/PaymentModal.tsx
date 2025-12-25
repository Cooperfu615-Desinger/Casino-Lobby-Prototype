import { useState } from 'react';
import { X, Check, Loader2, Apple } from 'lucide-react';
import { Package, SalePackage } from '../data/mockData';

interface PaymentModalProps {
    packageInfo: Package | SalePackage;
    onClose: () => void;
}

const PaymentModal = ({ packageInfo, onClose }: PaymentModalProps) => {
    const [step, setStep] = useState<'confirm' | 'processing' | 'success'>('confirm');
    const [showToast, setShowToast] = useState(false);

    const handlePayment = () => {
        setStep('processing');
        setTimeout(() => {
            setStep('success');
            setShowToast(true);
            setTimeout(() => {
                onClose();
            }, 2000); // Close after 2 seconds of success
        }, 1500); // Processing takes 1.5s
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">

            {/* Modal */}
            <div className="relative w-[90%] max-w-md bg-[#1a0b2e] border border-[#FFD700] rounded-2xl shadow-[0_0_50px_rgba(255,215,0,0.3)] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="bg-white/5 px-6 py-4 flex justify-between items-center border-b border-white/5">
                    <span className="text-white font-bold">App Store</span>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col items-center text-center">

                    {step === 'processing' ? (
                        <div className="py-10">
                            <Loader2 size={48} className="text-blue-500 animate-spin" />
                            <p className="text-slate-400 mt-4 text-sm font-medium">Processing Payment...</p>
                        </div>
                    ) : step === 'success' ? (
                        <div className="py-10">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-black mb-4 animate-in zoom-in duration-300">
                                <Check size={32} strokeWidth={3} />
                            </div>
                            <h3 className="text-white text-xl font-bold">Purchase Successful</h3>
                            <p className="text-slate-400 text-sm mt-2">Your coins have been added.</p>
                        </div>
                    ) : (
                        <>
                            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 text-2xl font-bold text-black border-2 border-white/20">
                                💰
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-1">
                                {'title' in packageInfo ? (packageInfo as SalePackage).title : 'Coin Package'}
                            </h2>
                            <p className="text-slate-400 text-sm mb-6">
                                {packageInfo.coins} Coins
                            </p>

                            <div className="w-full bg-black/30 rounded-xl p-4 mb-6 border border-white/5">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-400 text-sm">Account</span>
                                    <span className="text-white text-sm font-medium">cooperfu@icloud.com</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 text-sm">Price</span>
                                    <span className="text-white text-lg font-bold">{packageInfo.price}</span>
                                </div>
                            </div>

                            <div className="w-full flex items-center gap-3 bg-white/5 rounded-lg p-3 mb-8 cursor-pointer hover:bg-white/10 transition-colors border border-white/5">
                                <div className="bg-white text-black p-1 rounded">
                                    <Apple size={16} fill="currentColor" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-white text-sm font-bold leading-none">Apple Pay</p>
                                    <p className="text-slate-500 text-xs">Visa •••• 1234</p>
                                </div>
                                <span className="text-blue-400 text-xs font-bold">Change</span>
                            </div>

                            <button
                                onClick={handlePayment}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                            >
                                Confirm Payment
                            </button>
                        </>
                    )}
                </div>

                {/* Secure Badge */}
                <div className="bg-black/40 py-3 text-center border-t border-white/5">
                    <p className="text-slate-500 text-xs flex items-center justify-center gap-1.5">
                        <Check size={12} className="text-green-500" /> Secure Payment processed by App Store
                    </p>
                </div>
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white/90 text-black px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-5 duration-300 backdrop-blur z-[70]">
                    <div className="bg-green-500 text-white rounded-full p-0.5">
                        <Check size={14} />
                    </div>
                    <span className="font-bold text-sm">購買成功！</span>
                </div>
            )}
        </div>
    );
};

export default PaymentModal;
