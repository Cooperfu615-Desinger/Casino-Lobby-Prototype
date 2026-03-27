import { useState } from 'react';
import { User, Lock, ArrowRight, UserCircle2, X, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import TermsModal, { type TermsTab } from '../modals/TermsModal';
import SignupModal from '../modals/SignupModal';

const LoginScreen = () => {
    const { login, loginAsGuest } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showLoginInput, setShowLoginInput] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [termsMode, setTermsMode] = useState<'signup' | 'readOnly'>('signup');
    const [legalTab, setLegalTab] = useState<TermsTab>('terms');

    // Registration flow handlers
    const handleStartRegistration = () => {
        setTermsMode('signup');
        setLegalTab('terms');
        setShowTermsModal(true);
    };

    const handleTermsAgreed = () => {
        setShowTermsModal(false);
        setShowSignupModal(true);
    };

    const handleSignupSuccess = () => {
        setShowSignupModal(false);
    };

    const handleOpenLegalDoc = (tab: TermsTab) => {
        setTermsMode('readOnly');
        setLegalTab(tab);
        setShowTermsModal(true);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            login(username || undefined, password);
            setLoading(false);
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
            {/* 1280x720 Fixed Resolution Container */}
            <div className="relative w-[1280px] h-[720px] overflow-hidden shadow-2xl bg-gradient-to-b from-[#2c003e] to-black text-white font-sans flex flex-col items-center">

                {/* Background Texture */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>

                {/* Version */}
                <div className="absolute top-6 right-6 text-white/50 text-sm font-mono tracking-wider">
                    v1.000.06 (Profile Dynamic UI)
                </div>

                {/* Main Logo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center animate-in fade-in zoom-in duration-1000">
                    <h1 className="text-8xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]">
                        YOTA
                    </h1>
                </div>

                {/* Login Buttons Area — Account & Guest only */}
                <div className="absolute bottom-24 left-0 right-0 w-full px-12 z-10 animate-in slide-in-from-bottom-10 fade-in duration-700 delay-300 flex flex-col items-center">
                    <div className="flex gap-[32px] justify-center">
                        {/* Account Login */}
                        <button
                            aria-label="帳號登入"
                            onClick={() => setShowLoginInput(true)}
                            className="w-[80px] h-[80px] rounded-2xl shadow-lg flex flex-col items-center justify-center gap-1 hover:scale-105 transition-transform duration-200 bg-gradient-to-br from-fuchsia-500 to-pink-600 hover:from-fuchsia-600 hover:to-pink-700 text-white group"
                        >
                            <User size={24} className="text-indigo-100 group-hover:text-white transition-colors" />
                            <span className="text-[10px] font-bold tracking-wide">帳號</span>
                        </button>

                        {/* Guest Login */}
                        <button
                            aria-label="遊客登入"
                            onClick={loginAsGuest}
                            className="w-[80px] h-[80px] rounded-2xl shadow-lg flex flex-col items-center justify-center gap-1 hover:scale-105 transition-transform duration-200 bg-amber-500 hover:bg-amber-400 text-white group"
                        >
                            <UserCircle2 size={24} className="text-amber-100 group-hover:text-white transition-colors" />
                            <span className="text-[10px] font-bold tracking-wide">遊客</span>
                        </button>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-8 text-xs text-white/40 z-10 font-medium tracking-wider">
                    <button type="button" onClick={() => handleOpenLegalDoc('terms')} className="hover:text-white transition-colors">
                        使用者規章
                    </button>
                    <span className="text-white/20">|</span>
                    <button type="button" onClick={() => handleOpenLegalDoc('privacy')} className="hover:text-white transition-colors">
                        隱私權政策
                    </button>
                    <span className="text-white/20">|</span>
                    <button type="button" onClick={() => handleOpenLegalDoc('service')} className="hover:text-white transition-colors">
                        服務條款
                    </button>
                </div>

                {/* Account Login Overlay Modal */}
                {showLoginInput && (
                    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200">
                        <div className="relative w-96 bg-[#1a0b2e] border border-white/20 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200">
                            <button
                                aria-label="關閉"
                                onClick={() => setShowLoginInput(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                            >
                                <X size={24} />
                            </button>

                            <h2 className="text-2xl font-bold text-white mb-6 text-center tracking-wide">帳號登入</h2>

                            <form onSubmit={handleLogin} className="space-y-5">
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 pl-4 uppercase font-bold tracking-wider">Username</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-[#FFD700] transition-colors">
                                            <User size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="Enter username"
                                            className="w-full bg-black/40 border border-white/10 rounded-full py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/60 transition-all font-medium placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 pl-4 uppercase font-bold tracking-wider">Password</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-[#FFD700] transition-colors">
                                            <Lock size={20} />
                                        </div>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-black/40 border border-white/10 rounded-full py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/60 transition-all font-medium placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>

                                {/* Button Row: Register + Login */}
                                <div className="flex gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowLoginInput(false);
                                            handleStartRegistration();
                                        }}
                                        className="flex-1 py-4 rounded-full font-bold border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10 active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        <UserPlus size={18} />
                                        註冊帳號
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#DAA520] text-black font-black py-4 rounded-full shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 group tracking-widest text-lg"
                                    >
                                        {loading ? (
                                            <span className="animate-spin">⌛</span>
                                        ) : (
                                            <>
                                                LOGIN <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Terms & Conditions Modal */}
                {showTermsModal && (
                    <TermsModal
                        onClose={() => setShowTermsModal(false)}
                        onAgree={termsMode === 'signup' ? handleTermsAgreed : undefined}
                        initialTab={legalTab}
                        title={termsMode === 'signup' ? '註冊帳號 - 條款審閱' : '平台文件總覽'}
                        readOnly={termsMode === 'readOnly'}
                        confirmLabel="我知道了"
                    />
                )}

                {/* Signup Modal */}
                {showSignupModal && (
                    <SignupModal
                        onClose={() => setShowSignupModal(false)}
                        onSuccess={handleSignupSuccess}
                    />
                )}

            </div>
        </div>
    );
};

export default LoginScreen;
