import React, { useState } from 'react';
import { X, Smartphone, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PhoneLoginModalProps {
    onClose: () => void;
    onLogin: () => void;
}

type Step = 'phone' | 'otp';

const PhoneLoginModal: React.FC<PhoneLoginModalProps> = ({ onClose, onLogin }) => {
    const [step, setStep] = useState<Step>('phone');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Step 1: Request OTP
    const handleGetCode = (e: React.FormEvent) => {
        e.preventDefault();
        if (!phoneNumber) return;

        setIsLoading(true);

        // Simulate API call to send SMS
        setTimeout(() => {
            setIsLoading(false);
            setStep('otp');
            // Show simple toast or alert here if needed, but the UI change is usually enough feedback
            // For now, we'll just transition
        }, 1000);
    };

    // Step 2: Verify OTP and Login
    const handleVerifyLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length < 4) return;

        setIsLoading(true);

        // Simulate API call to verify OTP
        setTimeout(() => {
            setIsLoading(false);
            onLogin(); // Trigger parent login flow
            onClose(); // Close modal
        }, 1500);
    };

    const handleResend = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            alert("驗證碼已重新發送！");
        }, 1000);
    };

    return (
        <div className="absolute inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200">
            {/* Modal Container */}
            <div className="relative w-96 bg-[#1a0b2e] border border-emerald-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(16,185,129,0.2)] animate-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                >
                    <X size={24} />
                </button>

                {/* Header */}
                <h2 className="text-2xl font-bold text-white mb-2 text-center tracking-wide flex items-center justify-center gap-2">
                    <Smartphone className="text-emerald-400" />
                    {step === 'phone' ? '手機登入' : '輸入驗證碼'}
                </h2>
                <p className="text-center text-slate-400 text-xs mb-8">
                    {step === 'phone'
                        ? 'Mobile Login'
                        : `Verification Code sent to ${phoneNumber}`
                    }
                </p>

                {/* Step 1: Phone Input Form */}
                {step === 'phone' && (
                    <form onSubmit={handleGetCode} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs text-emerald-400 pl-4 uppercase font-bold tracking-wider">Mobile Number</label>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="0912-345-678"
                                className="w-full bg-black/40 border border-emerald-500/20 rounded-full py-3.5 px-6 text-white text-center text-lg focus:outline-none focus:border-emerald-500 focus:bg-black/60 transition-all font-mono tracking-widest placeholder:text-slate-600 placeholder:font-sans placeholder:tracking-normal"
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!phoneNumber || isLoading}
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-4 rounded-full shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 group tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="animate-spin">⌛</span>
                            ) : (
                                <>
                                    取得驗證碼 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                )}

                {/* Step 2: OTP Input Form */}
                {step === 'otp' && (
                    <form onSubmit={handleVerifyLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs text-emerald-400 pl-4 uppercase font-bold tracking-wider">Enter 4-Digit Code</label>
                            <input
                                type="text"
                                maxLength={4}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Only numbers
                                placeholder="____"
                                className="w-full bg-black/40 border border-emerald-500/20 rounded-full py-3.5 px-6 text-white text-center text-2xl focus:outline-none focus:border-emerald-500 focus:bg-black/60 transition-all font-mono tracking-[1em] placeholder:text-slate-700 disabled:opacity-50"
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={otp.length !== 4 || isLoading}
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-4 rounded-full shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 group tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="animate-spin">⌛</span>
                            ) : (
                                <>
                                    登入 <CheckCircle2 size={18} />
                                </>
                            )}
                        </button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={isLoading}
                                className="text-xs text-slate-500 hover:text-emerald-400 transition-colors underline decoration-dotted"
                            >
                                沒收到？重新發送
                            </button>
                        </div>
                    </form>
                )}

            </div>
        </div>
    );
};

export default PhoneLoginModal;
