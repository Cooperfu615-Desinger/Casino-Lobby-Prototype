import { useState } from 'react';
import { User, Lock, ArrowRight, UserCircle2, X, UserPlus, Smartphone, Facebook, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import TermsModal, { type TermsTab } from '../modals/TermsModal';
import SignupModal from '../modals/SignupModal';
import PhoneLoginModal from '../modals/PhoneLoginModal';
import FacebookLoginModal from '../modals/FacebookLoginModal';
import LINELoginModal from '../modals/LINELoginModal';
import AppleLoginModal from '../modals/AppleLoginModal';
import GoogleLoginModal from '../modals/GoogleLoginModal';

// Apple Logo SVG（與 AppleLoginModal 一致）
const AppleLogo = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.15 4.09-.64 1.8.55 2.91 1.77 3.48 2.65-3.05 1.57-2.48 5.67.65 6.94-.9 2.14-2.18 4.25-3.3 5.28zM14.99 4.26c.7-1.33 2.13-2.16 3.6-2.26.17 1.6-1.12 3.23-2.41 3.73-1.07.45-2.24-.04-2.61-1.46.46 0 .96.02 1.42-.01z" fill="currentColor" />
    </svg>
);

// Google Logo SVG（與 GoogleLoginModal 一致）
const GoogleLogo = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const LoginScreen = () => {
    const { login, loginAsGuest } = useAuth();

    // Account login form
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showLoginInput, setShowLoginInput] = useState(false);

    // Registration flow
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [termsMode, setTermsMode] = useState<'signup' | 'readOnly'>('signup');
    const [legalTab, setLegalTab] = useState<TermsTab>('terms');

    // Social login modals
    const [showPhone, setShowPhone] = useState(false);
    const [showFacebook, setShowFacebook] = useState(false);
    const [showLine, setShowLine] = useState(false);
    const [showApple, setShowApple] = useState(false);
    const [showGoogle, setShowGoogle] = useState(false);

    // ── Handlers ────────────────────────────────────────────────────────────

    const handleSocialLogin = () => login();

    const handleStartRegistration = () => {
        setTermsMode('signup');
        setLegalTab('terms');
        setShowTermsModal(true);
    };

    const handleTermsAgreed = () => {
        setShowTermsModal(false);
        setShowSignupModal(true);
    };

    const handleSignupSuccess = () => setShowSignupModal(false);

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
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />

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

                {/* ── Login Buttons Area ───────────────────────────────────────────── */}
                <div className="absolute bottom-20 left-0 right-0 w-full px-12 z-10 animate-in slide-in-from-bottom-10 fade-in duration-700 delay-300 flex flex-col items-center gap-5">

                    {/* Row 1：帳號 / 遊客 */}
                    <div className="flex gap-8 justify-center">
                        <button
                            aria-label="帳號登入"
                            onClick={() => setShowLoginInput(true)}
                            className="w-[80px] h-[80px] rounded-2xl shadow-lg flex flex-col items-center justify-center gap-1 hover:scale-105 transition-transform duration-200 bg-gradient-to-br from-fuchsia-500 to-pink-600 hover:from-fuchsia-600 hover:to-pink-700 text-white group"
                        >
                            <User size={24} className="text-indigo-100 group-hover:text-white transition-colors" />
                            <span className="text-[10px] font-bold tracking-wide">帳號</span>
                        </button>

                        <button
                            aria-label="遊客登入"
                            onClick={loginAsGuest}
                            className="w-[80px] h-[80px] rounded-2xl shadow-lg flex flex-col items-center justify-center gap-1 hover:scale-105 transition-transform duration-200 bg-amber-500 hover:bg-amber-400 text-white group"
                        >
                            <UserCircle2 size={24} className="text-amber-100 group-hover:text-white transition-colors" />
                            <span className="text-[10px] font-bold tracking-wide">遊客</span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 w-[420px]">
                        <div className="flex-1 h-px bg-white/15" />
                        <span className="text-white/30 text-xs tracking-widest uppercase">或</span>
                        <div className="flex-1 h-px bg-white/15" />
                    </div>

                    {/* Row 2：手機 / FB / LINE / Apple / Google */}
                    <div className="flex gap-5 justify-center">
                        {/* 手機 */}
                        <button
                            aria-label="手機登入"
                            onClick={() => setShowPhone(true)}
                            className="w-[72px] h-[72px] rounded-2xl shadow-lg flex flex-col items-center justify-center gap-1 hover:scale-105 transition-transform duration-200 bg-gradient-to-br from-emerald-500 to-teal-600 hover:brightness-110 text-white group"
                        >
                            <Smartphone size={22} className="text-emerald-100 group-hover:text-white transition-colors" />
                            <span className="text-[10px] font-bold tracking-wide">手機</span>
                        </button>

                        {/* Facebook */}
                        <button
                            aria-label="Facebook 登入"
                            onClick={() => setShowFacebook(true)}
                            className="w-[72px] h-[72px] rounded-2xl shadow-lg flex flex-col items-center justify-center gap-1 hover:scale-105 transition-transform duration-200 bg-[#1877F2] hover:bg-[#166FE5] text-white group"
                        >
                            <Facebook size={22} className="fill-current" />
                            <span className="text-[10px] font-bold tracking-wide">Facebook</span>
                        </button>

                        {/* LINE */}
                        <button
                            aria-label="LINE 登入"
                            onClick={() => setShowLine(true)}
                            className="w-[72px] h-[72px] rounded-2xl shadow-lg flex flex-col items-center justify-center gap-1 hover:scale-105 transition-transform duration-200 bg-[#06C755] hover:bg-[#05B04C] text-white group"
                        >
                            <MessageCircle size={22} className="fill-current" />
                            <span className="text-[10px] font-bold tracking-wide">LINE</span>
                        </button>

                        {/* Apple */}
                        <button
                            aria-label="Apple 登入"
                            onClick={() => setShowApple(true)}
                            className="w-[72px] h-[72px] rounded-2xl shadow-lg flex flex-col items-center justify-center gap-1 hover:scale-105 transition-transform duration-200 bg-black border border-white/20 hover:bg-white/10 text-white group"
                        >
                            <AppleLogo className="w-[22px] h-[22px]" />
                            <span className="text-[10px] font-bold tracking-wide">Apple</span>
                        </button>

                        {/* Google */}
                        <button
                            aria-label="Google 登入"
                            onClick={() => setShowGoogle(true)}
                            className="w-[72px] h-[72px] rounded-2xl shadow-lg flex flex-col items-center justify-center gap-1 hover:scale-105 transition-transform duration-200 bg-white hover:bg-gray-100 text-gray-700 group"
                        >
                            <GoogleLogo className="w-[22px] h-[22px]" />
                            <span className="text-[10px] font-bold tracking-wide text-gray-600">Google</span>
                        </button>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-8 text-xs text-white/40 z-10 font-medium tracking-wider">
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

                {/* ── Account Login Overlay ────────────────────────────────────────── */}
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

                {/* ── Terms & Signup ───────────────────────────────────────────────── */}
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
                {showSignupModal && (
                    <SignupModal
                        onClose={() => setShowSignupModal(false)}
                        onSuccess={handleSignupSuccess}
                    />
                )}

                {/* ── Social Login Modals ──────────────────────────────────────────── */}
                {showPhone    && <PhoneLoginModal    onClose={() => setShowPhone(false)}    onLogin={handleSocialLogin} />}
                {showFacebook && <FacebookLoginModal onClose={() => setShowFacebook(false)} onLogin={handleSocialLogin} />}
                {showLine     && <LINELoginModal     onClose={() => setShowLine(false)}     onLogin={handleSocialLogin} />}
                {showApple    && <AppleLoginModal    onClose={() => setShowApple(false)}    onLogin={handleSocialLogin} />}
                {showGoogle   && <GoogleLoginModal   onClose={() => setShowGoogle(false)}   onLogin={handleSocialLogin} />}

            </div>
        </div>
    );
};

export default LoginScreen;
