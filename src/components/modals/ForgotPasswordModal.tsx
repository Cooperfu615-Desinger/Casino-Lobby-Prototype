import { useEffect, useMemo, useState } from 'react';
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCircle2,
    CircleHelp,
    LoaderCircle,
    MessageCircle,
    Phone,
    ShieldCheck,
    X,
} from 'lucide-react';
import { getAccountValidationError } from '../../utils/account';
import PrototypeOverlay from '../common/PrototypeOverlay';

interface ForgotPasswordModalProps {
    initialAccount?: string;
    onClose: () => void;
    onReturnToLogin: (account: string) => void;
    onPasswordReset: (account: string, password: string) => void;
    onSocialLogin: (provider: 'line', account: string) => void;
}

type RecoveryStep =
    | 'account'
    | 'phone'
    | 'code'
    | 'password'
    | 'social'
    | 'unbound'
    | 'support'
    | 'success';
type SocialStage = 'idle' | 'connecting' | 'confirm' | 'logging' | 'success';

const delay = (milliseconds: number) =>
    new Promise((resolve) => window.setTimeout(resolve, milliseconds));

const ForgotPasswordModal = ({
    initialAccount = '',
    onClose,
    onReturnToLogin,
    onPasswordReset,
    onSocialLogin,
}: ForgotPasswordModalProps) => {
    const [step, setStep] = useState<RecoveryStep>('account');
    const [account, setAccount] = useState(initialAccount);
    const [verificationCode, setVerificationCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [socialStage, setSocialStage] = useState<SocialStage>('idle');

    useEffect(() => {
        if (countdown <= 0) return;
        const timer = window.setInterval(() => {
            setCountdown((current) => Math.max(0, current - 1));
        }, 1000);
        return () => window.clearInterval(timer);
    }, [countdown]);

    const progress = useMemo(() => {
        if (step === 'success') return 4;
        if (step === 'phone' || step === 'code') return 2;
        if (step === 'password') return 3;
        return 1;
    }, [step]);

    const canResetPassword = password.length >= 6 && password === confirmPassword;
    const passwordError = password && password.length < 6
        ? '新密碼至少需要 6 個字元'
        : confirmPassword && password !== confirmPassword
            ? '兩次輸入的新密碼不一致'
            : '';

    const identifyAccount = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        const accountError = getAccountValidationError(account);
        if (accountError) {
            setError(accountError);
            return;
        }

        setLoading(true);
        await delay(500);
        setLoading(false);
        const normalizedAccount = account.toLowerCase();
        if (normalizedAccount === 'line888') {
            setStep('social');
            setSocialStage('idle');
            return;
        }
        if (normalizedAccount === 'unbound888') {
            setStep('unbound');
            return;
        }
        setStep('phone');
    };

    const sendCode = () => {
        setError('');
        setVerificationCode('');
        setCountdown(60);
        setStep('code');
    };

    const verifyCode = (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        if (verificationCode !== '123456') {
            setError('驗證碼不正確，原型測試驗證碼為 123456');
            return;
        }
        setCountdown(0);
        setStep('password');
    };

    const resetPassword = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        if (!canResetPassword) {
            setError(passwordError || '請確認新密碼');
            return;
        }
        setLoading(true);
        await delay(850);
        onPasswordReset(account, password);
        setLoading(false);
        setStep('success');
    };

    const startSocialRecovery = async () => {
        setSocialStage('connecting');
        await delay(700);
        setSocialStage('confirm');
    };

    const confirmSocialRecovery = async () => {
        setSocialStage('logging');
        await delay(900);
        setSocialStage('success');
        await delay(650);
        onSocialLogin('line', account);
    };

    const showAccountStep = () => {
        setStep('account');
        setCountdown(0);
        setError('');
    };

    const showPhoneStep = () => {
        setStep('phone');
        setCountdown(0);
        setError('');
    };

    const showProgress = !['social', 'unbound', 'support'].includes(step);
    const canClose = !loading && !['connecting', 'logging', 'success'].includes(socialStage);

    return (
        <PrototypeOverlay layer="auth">
            <div className="juheng-auth-form-panel relative flex h-[600px] w-[650px] max-h-[640px] flex-col overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-[#281840] via-[#190b2c] to-[#0d0418] p-7 text-white shadow-[0_0_60px_rgba(0,0,0,0.7),0_0_34px_rgba(168,85,247,0.08)] animate-in zoom-in-95 duration-200">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,215,0,0.08),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(126,34,206,0.16),_transparent_42%)]" />

                {canClose && (
                    <button
                        type="button"
                        aria-label="關閉忘記密碼"
                        onClick={onClose}
                        className="absolute right-5 top-5 z-20 rounded-full p-2 text-slate-400 transition-all hover:bg-white/10 hover:text-white active:scale-95"
                    >
                        <X size={22} />
                    </button>
                )}

                <div className="relative text-center">
                    <p className="text-[10px] font-black tracking-[0.24em] text-[#FFD700]">ACCOUNT RECOVERY</p>
                    <h2 className="mt-1 text-2xl font-black">忘記密碼</h2>
                </div>

                {showProgress && (
                    <div className="relative mt-4 grid grid-cols-3 gap-2" aria-label="密碼重設進度">
                        {['確認帳號', '手機驗證', '設定密碼'].map((label, index) => {
                            const item = index + 1;
                            const done = progress > item;
                            const active = progress === item;
                            return (
                                <div
                                    key={label}
                                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-[11px] font-black ${
                                        done
                                            ? 'border-emerald-400/25 bg-emerald-400/5 text-emerald-300'
                                            : active
                                                ? 'border-[#FFD700]/35 bg-[#FFD700]/10 text-[#FFD700]'
                                                : 'border-white/10 bg-white/[0.025] text-slate-600'
                                    }`}
                                >
                                    <span className={`grid h-6 w-6 place-items-center rounded-full ${
                                        done
                                            ? 'bg-emerald-400 text-emerald-950'
                                            : active
                                                ? 'bg-[#FFD700] text-[#1a0b2e]'
                                                : 'bg-white/10 text-slate-500'
                                    }`}>
                                        {done ? <Check size={13} /> : item}
                                    </span>
                                    {label}
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="relative mt-5 min-h-0 flex-1">
                    {step === 'account' && (
                        <form onSubmit={identifyAccount} className="mx-auto flex h-full max-w-[470px] flex-col" noValidate>
                            <label htmlFor="recovery-account" className="mb-2 pl-2 text-xs font-black tracking-wider text-slate-300">
                                帳號
                            </label>
                            <input
                                id="recovery-account"
                                value={account}
                                onChange={(event) => setAccount(event.target.value)}
                                autoComplete="username"
                                placeholder="請輸入需要重設密碼的帳號"
                                className="h-12 w-full rounded-xl border border-white/10 bg-black/35 px-4 text-sm font-bold text-white outline-none transition-all placeholder:text-slate-600 focus:border-[#FFD700] focus:bg-black/55"
                                aria-describedby="recovery-account-helper recovery-error"
                                autoFocus
                            />
                            <p id="recovery-account-helper" className="mt-2 text-[11px] font-bold leading-relaxed text-slate-500">
                                中英文與數字，最多 20 個半形字元；資料正確後將使用綁定手機驗證。
                            </p>
                            <div className="mt-4 rounded-xl border border-dashed border-purple-400/25 bg-purple-400/5 px-4 py-3 text-[11px] font-bold leading-5 text-slate-400">
                                <strong className="block text-purple-300">原型分支測試</strong>
                                <span className="text-white/75">line888</span>：社群帳號　
                                <span className="text-white/75">unbound888</span>：未綁手機
                            </div>
                            {error && (
                                <p id="recovery-error" role="alert" className="mt-3 flex items-center justify-center gap-1 text-xs font-bold text-red-300">
                                    <AlertCircle size={13} /> {error}
                                </p>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-auto flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#DAA520] font-black tracking-widest text-black transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                            >
                                {loading ? <><LoaderCircle size={18} className="animate-spin" /> 正在查詢</> : <>下一步 <ArrowRight size={18} /></>}
                            </button>
                        </form>
                    )}

                    {step === 'phone' && (
                        <div className="flex h-full flex-col items-center justify-center text-center">
                            <span className="grid h-16 w-16 place-items-center rounded-2xl border border-[#FFD700]/30 bg-[#FFD700]/10 text-[#FFD700]">
                                <Phone size={30} />
                            </span>
                            <strong className="mt-4 text-xl font-black">使用綁定手機驗證</strong>
                            <p className="mt-2 text-sm font-bold text-slate-400">
                                驗證碼將傳送至 <b className="text-[#FFD700]">0912***888</b>
                            </p>
                            <p className="mt-2 text-[11px] font-bold text-slate-600">為保護帳號安全，我們不會顯示完整手機號碼。</p>
                            <div className="mt-8 flex w-full max-w-[420px] gap-3">
                                <button
                                    type="button"
                                    onClick={showAccountStep}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-purple-400/35 py-3.5 text-sm font-black text-purple-200 transition-all hover:bg-purple-400/10 active:scale-95"
                                >
                                    <ArrowLeft size={17} /> 返回修改
                                </button>
                                <button
                                    type="button"
                                    onClick={sendCode}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#DAA520] py-3.5 text-sm font-black text-black transition-all hover:brightness-110 active:scale-95"
                                >
                                    發送驗證碼 <ArrowRight size={17} />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'code' && (
                        <form onSubmit={verifyCode} className="mx-auto flex h-full max-w-[470px] flex-col" noValidate>
                            <div className="flex items-center justify-between px-2">
                                <label htmlFor="recovery-code" className="text-xs font-black tracking-wider text-slate-300">
                                    手機驗證碼
                                </label>
                                <button
                                    type="button"
                                    onClick={sendCode}
                                    disabled={countdown > 0}
                                    className="text-[11px] font-black text-[#FFD700] transition-colors hover:text-yellow-200 disabled:text-slate-600"
                                >
                                    {countdown > 0 ? `${countdown}s 後重發` : '重新發送'}
                                </button>
                            </div>
                            <input
                                id="recovery-code"
                                value={verificationCode}
                                onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={6}
                                placeholder="000000"
                                className="mt-2 h-14 w-full rounded-xl border border-white/10 bg-black/35 px-4 text-center font-mono text-2xl font-bold tracking-[0.55em] text-white outline-none transition-all placeholder:text-slate-700 focus:border-[#FFD700] focus:bg-black/55"
                                aria-describedby="recovery-code-helper recovery-code-error"
                                autoFocus
                            />
                            <p id="recovery-code-helper" className="mt-2 text-center text-[11px] font-bold text-slate-500">
                                原型測試驗證碼：<span className="text-[#FFD700]">123456</span>
                            </p>
                            {error && (
                                <p id="recovery-code-error" role="alert" className="mt-3 flex items-center justify-center gap-1 text-xs font-bold text-red-300">
                                    <AlertCircle size={13} /> {error}
                                </p>
                            )}
                            <div className="mt-auto flex gap-3">
                                <button
                                    type="button"
                                    onClick={showPhoneStep}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-purple-400/35 py-3.5 text-sm font-black text-purple-200 transition-all hover:bg-purple-400/10 active:scale-95"
                                >
                                    <ArrowLeft size={17} /> 上一步
                                </button>
                                <button
                                    type="submit"
                                    disabled={verificationCode.length !== 6}
                                    className="flex flex-[1.35] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#DAA520] py-3.5 text-sm font-black text-black transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
                                >
                                    驗證並繼續 <ArrowRight size={17} />
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 'password' && (
                        <form onSubmit={resetPassword} className="mx-auto flex h-full max-w-[470px] flex-col" noValidate>
                            <label htmlFor="recovery-password" className="mb-2 pl-2 text-xs font-black tracking-wider text-slate-300">
                                新密碼
                            </label>
                            <input
                                id="recovery-password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                type="password"
                                autoComplete="new-password"
                                placeholder="至少 6 個字元"
                                className="h-12 w-full rounded-xl border border-white/10 bg-black/35 px-4 text-sm font-bold text-white outline-none transition-all placeholder:text-slate-600 focus:border-[#FFD700] focus:bg-black/55"
                                autoFocus
                            />
                            <label htmlFor="recovery-confirm-password" className="mb-2 mt-4 pl-2 text-xs font-black tracking-wider text-slate-300">
                                確認新密碼
                            </label>
                            <input
                                id="recovery-confirm-password"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                type="password"
                                autoComplete="new-password"
                                placeholder="再次輸入新密碼"
                                className={`h-12 w-full rounded-xl border bg-black/35 px-4 text-sm font-bold text-white outline-none transition-all placeholder:text-slate-600 focus:bg-black/55 ${
                                    passwordError ? 'border-red-400 focus:border-red-300' : 'border-white/10 focus:border-[#FFD700]'
                                }`}
                                aria-describedby="recovery-password-helper recovery-password-error"
                            />
                            <p id="recovery-password-helper" className="mt-2 text-[11px] font-bold text-slate-500">新密碼規則與註冊密碼相同。</p>
                            {(passwordError || error) && (
                                <p id="recovery-password-error" role="alert" className="mt-3 flex items-center justify-center gap-1 text-xs font-bold text-red-300">
                                    <AlertCircle size={13} /> {passwordError || error}
                                </p>
                            )}
                            <button
                                type="submit"
                                disabled={!canResetPassword || loading}
                                className="mt-auto flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#DAA520] font-black tracking-widest text-black transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
                            >
                                {loading ? <><LoaderCircle size={18} className="animate-spin" /> 正在重設</> : <>確認重設密碼 <ArrowRight size={18} /></>}
                            </button>
                        </form>
                    )}

                    {step === 'social' && (
                        <div className="flex h-full flex-col items-center justify-center text-center" aria-live="polite">
                            {socialStage === 'idle' && (
                                <>
                                    <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#06C755] text-white shadow-[0_0_28px_rgba(6,199,85,0.18)]">
                                        <MessageCircle size={30} fill="currentColor" />
                                    </span>
                                    <strong className="mt-4 text-xl font-black">此帳號使用社群方式登入</strong>
                                    <p className="mt-2 max-w-[410px] text-sm font-bold leading-relaxed text-slate-400">
                                        社群登入帳號沒有平台密碼，請使用原本的 LINE 帳號繼續。
                                    </p>
                                    <button
                                        type="button"
                                        onClick={startSocialRecovery}
                                        className="mt-7 flex w-full max-w-[360px] items-center justify-center gap-2 rounded-full bg-[#06C755] py-3.5 text-sm font-black text-white transition-all hover:brightness-110 active:scale-95"
                                    >
                                        使用 LINE 登入 <ArrowRight size={17} />
                                    </button>
                                </>
                            )}
                            {socialStage === 'connecting' && (
                                <>
                                    <LoaderCircle size={50} className="mb-5 animate-spin text-[#06C755]" />
                                    <strong className="text-xl font-black">正在連線至 LINE</strong>
                                    <p className="mt-2 text-sm font-bold text-slate-400">請稍候片刻</p>
                                </>
                            )}
                            {socialStage === 'confirm' && (
                                <>
                                    <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#06C755] text-white">
                                        <MessageCircle size={30} fill="currentColor" />
                                    </span>
                                    <strong className="mt-4 text-xl font-black">允許巨亨ONLINE使用此帳號登入？</strong>
                                    <p className="mt-2 text-sm font-bold text-slate-400">將建立示範帳號，不會取得真實社群資料。</p>
                                    <div className="mt-7 flex w-full max-w-[400px] gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setSocialStage('idle')}
                                            className="flex-1 rounded-full border border-white/20 py-3.5 text-sm font-black text-slate-300 transition-all hover:bg-white/5 active:scale-95"
                                        >
                                            取消
                                        </button>
                                        <button
                                            type="button"
                                            onClick={confirmSocialRecovery}
                                            className="flex-[1.4] rounded-full bg-[#06C755] py-3.5 text-sm font-black text-white transition-all hover:brightness-110 active:scale-95"
                                        >
                                            允許並繼續
                                        </button>
                                    </div>
                                </>
                            )}
                            {socialStage === 'logging' && (
                                <>
                                    <LoaderCircle size={50} className="mb-5 animate-spin text-[#06C755]" />
                                    <strong className="text-xl font-black">正在建立安全連線</strong>
                                    <p className="mt-2 text-sm font-bold text-slate-400">正在驗證 LINE 登入資訊</p>
                                </>
                            )}
                            {socialStage === 'success' && (
                                <>
                                    <span className="mb-5 grid h-20 w-20 place-items-center rounded-full bg-emerald-400 text-emerald-950 shadow-[0_0_40px_rgba(74,222,128,0.28)]">
                                        <CheckCircle2 size={42} />
                                    </span>
                                    <strong className="text-xl font-black">登入成功</strong>
                                    <p className="mt-2 text-sm font-bold text-slate-400">即將進入遊戲大廳</p>
                                </>
                            )}
                        </div>
                    )}

                    {step === 'unbound' && (
                        <div className="flex h-full flex-col items-center justify-center text-center">
                            <span className="grid h-16 w-16 place-items-center rounded-2xl border border-[#FFD700]/30 bg-[#FFD700]/10 text-[#FFD700]">
                                <CircleHelp size={32} />
                            </span>
                            <strong className="mt-4 text-xl font-black">此帳號尚未綁定手機</strong>
                            <p className="mt-2 max-w-[420px] text-sm font-bold leading-relaxed text-slate-400">
                                目前無法自助重設密碼，客服將協助確認帳號持有者身分。
                            </p>
                            <button
                                type="button"
                                onClick={() => setStep('support')}
                                className="mt-7 flex w-full max-w-[360px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#DAA520] py-3.5 text-sm font-black text-black transition-all hover:brightness-110 active:scale-95"
                            >
                                前往客服中心 <ArrowRight size={17} />
                            </button>
                        </div>
                    )}

                    {step === 'support' && (
                        <div className="flex h-full flex-col items-center justify-center text-center" aria-live="polite">
                            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-purple-400/12 text-purple-200">
                                <ShieldCheck size={32} />
                            </span>
                            <strong className="mt-4 text-xl font-black">已進入客服協助流程</strong>
                            <p className="mt-2 max-w-[430px] text-sm font-bold leading-relaxed text-slate-400">
                                原型已完成客服入口操作；正式版本將由客服協助進行帳號持有者驗證。
                            </p>
                            <button
                                type="button"
                                onClick={() => onReturnToLogin(account)}
                                className="mt-7 flex w-full max-w-[330px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#DAA520] py-3.5 text-sm font-black text-black transition-all hover:brightness-110 active:scale-95"
                            >
                                返回登入 <ArrowRight size={17} />
                            </button>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="flex h-full flex-col items-center justify-center text-center" aria-live="polite">
                            <span className="grid h-20 w-20 place-items-center rounded-full bg-emerald-400 text-emerald-950 shadow-[0_0_40px_rgba(74,222,128,0.28)]">
                                <CheckCircle2 size={42} />
                            </span>
                            <strong className="mt-5 text-xl font-black">密碼重設成功</strong>
                            <p className="mt-2 text-sm font-bold text-slate-400">
                                請返回登入頁，使用新密碼登入 <b className="text-[#FFD700]">{account}</b>。
                            </p>
                            <button
                                type="button"
                                onClick={() => onReturnToLogin(account)}
                                className="mt-7 flex w-full max-w-[330px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#DAA520] py-3.5 text-sm font-black text-black transition-all hover:brightness-110 active:scale-95"
                            >
                                返回登入 <ArrowRight size={17} />
                            </button>
                        </div>
                    )}
                </div>

                {!['success', 'support'].includes(step) && canClose && (
                    <button
                        type="button"
                        onClick={() => onReturnToLogin(account)}
                        className="relative mt-4 text-center text-xs font-black text-slate-500 transition-colors hover:text-white"
                    >
                        返回會員登入
                    </button>
                )}
            </div>
        </PrototypeOverlay>
    );
};

export default ForgotPasswordModal;
