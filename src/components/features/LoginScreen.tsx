import { useState } from 'react';
import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    Facebook,
    LoaderCircle,
    Lock,
    MessageCircle,
    Smartphone,
    User,
    UserCircle2,
    UserPlus,
    X,
} from 'lucide-react';
import { useAuth, type AuthProviderType } from '../../context/AuthContext';
import { PRODUCT_NAME } from '../../config/brand';
import { getAccountValidationError } from '../../utils/account';
import PrototypeOverlay from '../common/PrototypeOverlay';
import AppleLoginModal from '../modals/AppleLoginModal';
import FacebookLoginModal from '../modals/FacebookLoginModal';
import ForgotPasswordModal from '../modals/ForgotPasswordModal';
import GoogleLoginModal from '../modals/GoogleLoginModal';
import LINELoginModal from '../modals/LINELoginModal';
import PhoneLoginModal from '../modals/PhoneLoginModal';
import SignupModal from '../modals/SignupModal';
import TermsModal, { type TermsTab } from '../modals/TermsModal';

const MOCK_CREDENTIAL_KEY = 'jh_app_mock_credential';

type AuthOverlay =
    | 'accountLogin'
    | 'terms'
    | 'signup'
    | 'phone'
    | 'forgot'
    | 'facebook'
    | 'line'
    | 'apple'
    | 'google'
    | null;
type AccountStage = 'idle' | 'logging' | 'success';

interface MockCredential {
    account: string;
    password: string;
}

const delay = (milliseconds: number) =>
    new Promise((resolve) => window.setTimeout(resolve, milliseconds));

const loadMockCredential = (): MockCredential | null => {
    try {
        const storedCredential = window.localStorage.getItem(MOCK_CREDENTIAL_KEY);
        return storedCredential ? JSON.parse(storedCredential) as MockCredential : null;
    } catch {
        window.localStorage.removeItem(MOCK_CREDENTIAL_KEY);
        return null;
    }
};

const AppleLogo = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.15 4.09-.64 1.8.55 2.91 1.77 3.48 2.65-3.05 1.57-2.48 5.67.65 6.94-.9 2.14-2.18 4.25-3.3 5.28zM14.99 4.26c.7-1.33 2.13-2.16 3.6-2.26.17 1.6-1.12 3.23-2.41 3.73-1.07.45-2.24-.04-2.61-1.46.46 0 .96.02 1.42-.01z" fill="currentColor" />
    </svg>
);

const GoogleLogo = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const providerProfiles: Record<Exclude<AuthProviderType, 'account' | 'guest' | 'phone'>, { account: string; name: string }> = {
    facebook: { account: 'facebook888', name: 'Facebook玩家' },
    line: { account: 'line888', name: 'LINE玩家' },
    apple: { account: 'apple888', name: 'Apple玩家' },
    google: { account: 'google888', name: 'Google玩家' },
};

const LoginScreen = () => {
    const { login, loginAsGuest } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [accountStage, setAccountStage] = useState<AccountStage>('idle');
    const [accountError, setAccountError] = useState('');
    const [activeOverlay, setActiveOverlay] = useState<AuthOverlay>(null);
    const [legalTab, setLegalTab] = useState<TermsTab>('terms');
    const [resetCredential, setResetCredential] = useState<MockCredential | null>(loadMockCredential);

    const resetAccountModal = () => {
        setAccountStage('idle');
        setAccountError('');
    };

    const closeOverlay = () => {
        resetAccountModal();
        setActiveOverlay(null);
    };

    const openAccountLogin = (account?: string) => {
        if (account !== undefined) setUsername(account);
        setPassword('');
        resetAccountModal();
        setActiveOverlay('accountLogin');
    };

    const handleOpenLegalDoc = (tab: TermsTab) => {
        setLegalTab(tab);
        setActiveOverlay('terms');
    };

    const handleAccountLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setAccountError('');
        const validationError = getAccountValidationError(username);
        if (validationError) {
            setAccountError(validationError);
            return;
        }
        if (!password) {
            setAccountError('請輸入密碼');
            return;
        }
        if (
            resetCredential &&
            username.toLowerCase() === resetCredential.account.toLowerCase() &&
            password !== resetCredential.password
        ) {
            setAccountError('密碼不正確，請輸入剛完成重設的新密碼');
            return;
        }

        setAccountStage('logging');
        await delay(900);
        setAccountStage('success');
        await delay(650);
        login(username, password, 'account');
    };

    const handleGuestLogin = async () => {
        setActiveOverlay('accountLogin');
        setAccountStage('logging');
        await delay(650);
        setAccountStage('success');
        await delay(650);
        loginAsGuest();
    };

    const handlePhoneLogin = (phoneNumber: string) => {
        login(phoneNumber, undefined, 'phone', `手機玩家${phoneNumber.slice(-4)}`);
    };

    const handleProviderLogin = (
        provider: Exclude<AuthProviderType, 'account' | 'guest' | 'phone'>,
    ) => {
        const profile = providerProfiles[provider];
        login(profile.account, undefined, provider, profile.name);
    };

    const handlePasswordReset = (account: string, nextPassword: string) => {
        const credential = { account, password: nextPassword };
        setResetCredential(credential);
        window.localStorage.setItem(MOCK_CREDENTIAL_KEY, JSON.stringify(credential));
    };

    return (
        <div className="relative flex h-full w-full flex-col items-center overflow-hidden bg-gradient-to-b from-[#2c003e] to-black font-sans text-white">
            <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />

            <div className="absolute right-6 top-6 font-mono text-sm tracking-wider text-white/50">
                v1.000.18 (Feature Alignment)
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-in text-center fade-in zoom-in duration-1000">
                <h1
                    aria-label={PRODUCT_NAME}
                    className="whitespace-nowrap bg-gradient-to-b from-white to-slate-400 bg-clip-text text-6xl font-black tracking-[0.08em] text-transparent drop-shadow-[0_0_25px_rgba(255,255,255,0.5)] sm:text-7xl lg:text-8xl"
                >
                    {PRODUCT_NAME}
                </h1>
            </div>

            <div className="absolute bottom-20 left-0 right-0 z-10 flex w-full animate-in flex-col items-center gap-5 px-12 fade-in slide-in-from-bottom-10 delay-300 duration-700">
                <div className="flex justify-center gap-8">
                    <button
                        aria-label="帳號登入"
                        onClick={() => openAccountLogin()}
                        className="group flex h-[80px] w-[80px] flex-col items-center justify-center gap-1 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-600 text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:from-fuchsia-600 hover:to-pink-700"
                    >
                        <User size={24} className="text-indigo-100 transition-colors group-hover:text-white" />
                        <span className="text-[10px] font-bold tracking-wide">帳號</span>
                    </button>

                    <button
                        aria-label="遊客登入"
                        onClick={handleGuestLogin}
                        className="group flex h-[80px] w-[80px] flex-col items-center justify-center gap-1 rounded-2xl bg-amber-500 text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-amber-400"
                    >
                        <UserCircle2 size={24} className="text-amber-100 transition-colors group-hover:text-white" />
                        <span className="text-[10px] font-bold tracking-wide">遊客</span>
                    </button>
                </div>

                <div className="flex w-[420px] items-center gap-4">
                    <div className="h-px flex-1 bg-white/15" />
                    <span className="text-xs uppercase tracking-widest text-white/30">或</span>
                    <div className="h-px flex-1 bg-white/15" />
                </div>

                <div className="flex justify-center gap-5">
                    <button
                        aria-label="手機登入"
                        onClick={() => setActiveOverlay('phone')}
                        className="group flex h-[72px] w-[72px] flex-col items-center justify-center gap-1 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:brightness-110"
                    >
                        <Smartphone size={22} className="text-emerald-100 transition-colors group-hover:text-white" />
                        <span className="text-[10px] font-bold tracking-wide">手機</span>
                    </button>

                    <button
                        aria-label="Facebook 登入"
                        onClick={() => setActiveOverlay('facebook')}
                        className="group flex h-[72px] w-[72px] flex-col items-center justify-center gap-1 rounded-2xl bg-[#1877F2] text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-[#166FE5]"
                    >
                        <Facebook size={22} className="fill-current" />
                        <span className="text-[10px] font-bold tracking-wide">Facebook</span>
                    </button>

                    <button
                        aria-label="LINE 登入"
                        onClick={() => setActiveOverlay('line')}
                        className="group flex h-[72px] w-[72px] flex-col items-center justify-center gap-1 rounded-2xl bg-[#06C755] text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-[#05B04C]"
                    >
                        <MessageCircle size={22} className="fill-current" />
                        <span className="text-[10px] font-bold tracking-wide">LINE</span>
                    </button>

                    <button
                        aria-label="Apple 登入"
                        onClick={() => setActiveOverlay('apple')}
                        className="group flex h-[72px] w-[72px] flex-col items-center justify-center gap-1 rounded-2xl border border-white/20 bg-black text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-white/10"
                    >
                        <AppleLogo className="h-[22px] w-[22px]" />
                        <span className="text-[10px] font-bold tracking-wide">Apple</span>
                    </button>

                    <button
                        aria-label="Google 登入"
                        onClick={() => setActiveOverlay('google')}
                        className="group flex h-[72px] w-[72px] flex-col items-center justify-center gap-1 rounded-2xl bg-white text-gray-700 shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-gray-100"
                    >
                        <GoogleLogo className="h-[22px] w-[22px]" />
                        <span className="text-[10px] font-bold tracking-wide text-gray-600">Google</span>
                    </button>
                </div>
            </div>

            <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center gap-8 text-xs font-medium tracking-wider text-white/40">
                <button type="button" onClick={() => handleOpenLegalDoc('terms')} className="transition-colors hover:text-white">
                    使用者規章
                </button>
                <span className="text-white/20">|</span>
                <button type="button" onClick={() => handleOpenLegalDoc('privacy')} className="transition-colors hover:text-white">
                    隱私權政策
                </button>
                <span className="text-white/20">|</span>
                <button type="button" onClick={() => handleOpenLegalDoc('service')} className="transition-colors hover:text-white">
                    服務條款
                </button>
            </div>

            {activeOverlay === 'accountLogin' && (
                <PrototypeOverlay layer="auth">
                    <div className="relative flex min-h-[470px] w-[430px] flex-col overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-[#24143a] via-[#1a0b2e] to-[#0d0418] p-8 shadow-[0_0_50px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-200">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,215,0,0.08),_transparent_38%)]" />

                        {accountStage === 'idle' ? (
                            <div className="relative">
                                <button
                                    aria-label="關閉帳號登入"
                                    onClick={closeOverlay}
                                    className="absolute -right-4 -top-4 rounded-full p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                                >
                                    <X size={22} />
                                </button>

                                <p className="text-center text-[10px] font-black tracking-[0.24em] text-[#FFD700]">WELCOME BACK</p>
                                <h2 className="mb-6 mt-1 text-center text-2xl font-black tracking-wide text-white">帳號登入</h2>

                                <form onSubmit={handleAccountLogin} className="space-y-4" noValidate>
                                    <div className="space-y-1.5">
                                        <label htmlFor="account-login-username" className="pl-4 text-xs font-black tracking-wider text-slate-400">
                                            帳號
                                        </label>
                                        <div className="group relative">
                                            <User size={19} className="absolute left-4 top-3.5 text-slate-500 transition-colors group-focus-within:text-[#FFD700]" />
                                            <input
                                                id="account-login-username"
                                                type="text"
                                                value={username}
                                                onChange={(event) => setUsername(event.target.value)}
                                                autoComplete="username"
                                                placeholder="中英文與數字，最多 20 個半形字元"
                                                className="w-full rounded-full border border-white/10 bg-black/40 py-3.5 pl-12 pr-4 text-sm font-bold text-white outline-none transition-all placeholder:text-slate-600 focus:border-[#FFD700] focus:bg-black/60"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between px-4">
                                            <label htmlFor="account-login-password" className="text-xs font-black tracking-wider text-slate-400">
                                                密碼
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setActiveOverlay('forgot')}
                                                className="text-[11px] font-black text-[#FFD700] transition-colors hover:text-yellow-200"
                                            >
                                                忘記密碼
                                            </button>
                                        </div>
                                        <div className="group relative">
                                            <Lock size={19} className="absolute left-4 top-3.5 text-slate-500 transition-colors group-focus-within:text-[#FFD700]" />
                                            <input
                                                id="account-login-password"
                                                type="password"
                                                value={password}
                                                onChange={(event) => setPassword(event.target.value)}
                                                autoComplete="current-password"
                                                placeholder="請輸入密碼"
                                                className="w-full rounded-full border border-white/10 bg-black/40 py-3.5 pl-12 pr-4 text-sm font-bold text-white outline-none transition-all placeholder:text-slate-600 focus:border-[#FFD700] focus:bg-black/60"
                                                aria-describedby="account-login-error"
                                            />
                                        </div>
                                    </div>

                                    {accountError && (
                                        <p id="account-login-error" role="alert" className="flex items-center justify-center gap-1 text-xs font-bold text-red-300">
                                            <AlertCircle size={13} /> {accountError}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        className="group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#DAA520] py-3.5 text-base font-black tracking-widest text-black shadow-lg transition-all hover:brightness-110 active:scale-95"
                                    >
                                        登入 <ArrowRight size={19} className="transition-transform group-hover:translate-x-1" />
                                    </button>
                                </form>

                                <div className="mt-5 flex items-center justify-center gap-3 text-xs font-bold">
                                    <span className="text-slate-500">還沒有帳號？</span>
                                    <button
                                        type="button"
                                        onClick={() => setActiveOverlay('signup')}
                                        className="flex items-center gap-1 text-[#FFD700] transition-colors hover:text-yellow-200"
                                    >
                                        <UserPlus size={14} /> 立即註冊
                                    </button>
                                </div>

                                <p className="mt-5 text-center text-[10px] font-bold text-slate-600">
                                    登入即代表同意
                                    <button type="button" onClick={() => handleOpenLegalDoc('terms')} className="mx-1 text-slate-400 hover:text-white">會員條款</button>
                                    及
                                    <button type="button" onClick={() => handleOpenLegalDoc('privacy')} className="ml-1 text-slate-400 hover:text-white">隱私權政策</button>
                                </p>
                            </div>
                        ) : (
                            <div className="relative flex flex-1 flex-col items-center justify-center text-center" aria-live="polite">
                                {accountStage === 'logging' ? (
                                    <>
                                        <LoaderCircle size={52} className="mb-5 animate-spin text-[#FFD700]" />
                                        <h2 className="text-2xl font-black text-white">正在建立安全連線</h2>
                                        <p className="mt-2 text-sm font-bold text-slate-400">這是前端 Mock，不會傳送真實帳密</p>
                                    </>
                                ) : (
                                    <>
                                        <span className="mb-5 grid h-20 w-20 place-items-center rounded-full bg-emerald-400 text-emerald-950 shadow-[0_0_40px_rgba(74,222,128,0.28)]">
                                            <CheckCircle2 size={42} />
                                        </span>
                                        <h2 className="text-2xl font-black text-white">登入成功</h2>
                                        <p className="mt-2 text-sm font-bold text-slate-400">即將進入遊戲大廳</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </PrototypeOverlay>
            )}

            {activeOverlay === 'terms' && (
                <TermsModal
                    onClose={closeOverlay}
                    initialTab={legalTab}
                    title="平台文件總覽"
                    readOnly
                    confirmLabel="我知道了"
                />
            )}

            {activeOverlay === 'signup' && (
                <SignupModal
                    onClose={() => openAccountLogin()}
                    onSuccess={closeOverlay}
                />
            )}

            {activeOverlay === 'forgot' && (
                <ForgotPasswordModal
                    initialAccount={username}
                    onClose={closeOverlay}
                    onReturnToLogin={openAccountLogin}
                    onPasswordReset={handlePasswordReset}
                    onSocialLogin={(provider, account) => login(account, undefined, provider, 'LINE玩家')}
                />
            )}

            {activeOverlay === 'phone' && (
                <PhoneLoginModal onClose={closeOverlay} onLogin={handlePhoneLogin} />
            )}
            {activeOverlay === 'facebook' && (
                <FacebookLoginModal onClose={closeOverlay} onLogin={() => handleProviderLogin('facebook')} />
            )}
            {activeOverlay === 'line' && (
                <LINELoginModal onClose={closeOverlay} onLogin={() => handleProviderLogin('line')} />
            )}
            {activeOverlay === 'apple' && (
                <AppleLoginModal onClose={closeOverlay} onLogin={() => handleProviderLogin('apple')} />
            )}
            {activeOverlay === 'google' && (
                <GoogleLoginModal onClose={closeOverlay} onLogin={() => handleProviderLogin('google')} />
            )}
        </div>
    );
};

export default LoginScreen;
