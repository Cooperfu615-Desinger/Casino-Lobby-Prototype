import { useMemo, useState } from 'react';
import {
    AlertCircle,
    ArrowRight,
    Check,
    CheckCircle2,
    FileCheck2,
    LoaderCircle,
    X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAccountValidationError, isAccountValid } from '../../utils/account';
import PrototypeOverlay from '../common/PrototypeOverlay';
import TermsModal from './TermsModal';

interface SignupModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

type SignupStage = 'form' | 'logging' | 'success';

const delay = (milliseconds: number) =>
    new Promise((resolve) => window.setTimeout(resolve, milliseconds));

const SignupModal = ({ onClose, onSuccess }: SignupModalProps) => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [promoCode, setPromoCode] = useState('');
    const [termsReviewed, setTermsReviewed] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [stage, setStage] = useState<SignupStage>('form');
    const [submitted, setSubmitted] = useState(false);

    const accountError = username ? getAccountValidationError(username) : '';
    const nicknameError = nickname && (nickname.trim().length < 2 || nickname.trim().length > 12)
        ? '暱稱需為 2～12 個字元'
        : '';
    const passwordError = password && password.length < 6 ? '密碼至少需要 6 個字元' : '';
    const confirmPasswordError = confirmPassword && password !== confirmPassword ? '兩次輸入的密碼不一致' : '';
    const promoCodeError = promoCode && !/^(?:[A-Z0-9]{6}|[A-Z0-9]{8})$/.test(promoCode)
        ? '推廣碼須為大寫英數 6 碼或 8 碼'
        : '';

    const canRegister = useMemo(
        () =>
            isAccountValid(username) &&
            nickname.trim().length >= 2 &&
            nickname.trim().length <= 12 &&
            password.length >= 6 &&
            password === confirmPassword &&
            !promoCodeError &&
            termsReviewed,
        [confirmPassword, nickname, password, promoCodeError, termsReviewed, username],
    );

    const labelClass = 'text-xs font-black tracking-wider text-slate-300';
    const inputClass = 'h-11 w-full rounded-xl border border-white/10 bg-black/35 px-4 text-sm font-bold text-white outline-none transition-all placeholder:text-slate-600 focus:border-[#FFD700] focus:bg-black/55';

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSubmitted(true);
        if (!canRegister) return;

        setStage('logging');
        await delay(900);
        setStage('success');
        await delay(650);
        login(username, password, 'account', nickname.trim());
        onSuccess();
    };

    const handlePromoCodeChange = (value: string) => {
        setPromoCode(value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8));
    };

    return (
        <>
            <PrototypeOverlay layer="auth">
                <div className="juheng-auth-form-panel relative h-[600px] w-[680px] max-h-[640px] overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-[#2a1b42] via-[#1a0b2e] to-[#0d0418] p-7 shadow-[0_0_60px_rgba(0,0,0,0.65),0_0_32px_rgba(255,215,0,0.08)] animate-in zoom-in-95 duration-200">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,215,0,0.1),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(126,34,206,0.18),_transparent_40%)]" />

                    {stage === 'form' ? (
                        <div className="relative">
                            <button
                                aria-label="關閉註冊"
                                onClick={onClose}
                                className="absolute right-0 top-0 z-10 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-all hover:bg-white/10 hover:text-white active:scale-95"
                            >
                                <X size={22} />
                            </button>

                            <div className="mb-4 text-center">
                                <p className="mb-1 text-[10px] font-black tracking-[0.24em] text-[#FFD700]">CREATE ACCOUNT</p>
                                <h2 className="text-2xl font-black tracking-wide text-white">建立帳號</h2>
                                <div className="mx-auto mt-3 h-0.5 w-14 rounded-full bg-[#FFD700]/70" />
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label htmlFor="signup-username" className={labelClass}>帳號</label>
                                        <input
                                            id="signup-username"
                                            type="text"
                                            value={username}
                                            onChange={(event) => setUsername(event.target.value)}
                                            autoComplete="username"
                                            placeholder="中英文與數字，最多 20 個半形字元"
                                            className={inputClass}
                                            aria-describedby="signup-username-error"
                                        />
                                        {(accountError || (submitted && !username)) && (
                                            <p id="signup-username-error" role="alert" className="flex items-center gap-1 text-[11px] text-red-300">
                                                <AlertCircle size={11} /> {accountError || '請輸入帳號'}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="signup-nickname" className={labelClass}>暱稱</label>
                                        <input
                                            id="signup-nickname"
                                            type="text"
                                            value={nickname}
                                            onChange={(event) => setNickname(event.target.value.slice(0, 12))}
                                            autoComplete="nickname"
                                            placeholder="顯示給其他玩家（2～12 字元）"
                                            className={inputClass}
                                            aria-describedby="signup-nickname-error"
                                        />
                                        {(nicknameError || (submitted && !nickname.trim())) && (
                                            <p id="signup-nickname-error" role="alert" className="flex items-center gap-1 text-[11px] text-red-300">
                                                <AlertCircle size={11} /> {nicknameError || '請輸入暱稱'}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label htmlFor="signup-password" className={labelClass}>密碼</label>
                                        <input
                                            id="signup-password"
                                            type="password"
                                            value={password}
                                            onChange={(event) => setPassword(event.target.value)}
                                            autoComplete="new-password"
                                            placeholder="至少 6 個字元"
                                            className={inputClass}
                                            aria-describedby="signup-password-error"
                                        />
                                        {(passwordError || (submitted && !password)) && (
                                            <p id="signup-password-error" role="alert" className="flex items-center gap-1 text-[11px] text-red-300">
                                                <AlertCircle size={11} /> {passwordError || '請輸入密碼'}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="signup-confirm-password" className={labelClass}>確認密碼</label>
                                        <input
                                            id="signup-confirm-password"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(event) => setConfirmPassword(event.target.value)}
                                            autoComplete="new-password"
                                            placeholder="再次輸入密碼"
                                            className={`${inputClass} ${confirmPasswordError ? 'border-red-400' : ''}`}
                                            aria-describedby="signup-confirm-password-error"
                                        />
                                        {(confirmPasswordError || (submitted && !confirmPassword)) && (
                                            <p id="signup-confirm-password-error" role="alert" className="flex items-center gap-1 text-[11px] text-red-300">
                                                <AlertCircle size={11} /> {confirmPasswordError || '請再次輸入密碼'}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="signup-promo-code" className={labelClass}>推廣碼（選填）</label>
                                        <span className="text-[10px] font-bold text-slate-500">代理 6 碼／玩家 8 碼</span>
                                    </div>
                                    <input
                                        id="signup-promo-code"
                                        type="text"
                                        value={promoCode}
                                        onChange={(event) => handlePromoCodeChange(event.target.value)}
                                        autoCapitalize="characters"
                                        inputMode="text"
                                        placeholder="請輸入大寫英數推廣碼"
                                        className={inputClass}
                                        aria-describedby="signup-promo-code-error"
                                    />
                                    {promoCodeError && (
                                        <p id="signup-promo-code-error" role="alert" className="flex items-center gap-1 text-[11px] text-red-300">
                                            <AlertCircle size={11} /> {promoCodeError}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowTerms(true)}
                                    className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                                        termsReviewed
                                            ? 'border-emerald-400/35 bg-emerald-400/10'
                                            : 'border-purple-400/25 bg-purple-400/5 hover:border-purple-300/50 hover:bg-purple-400/10'
                                    }`}
                                >
                                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl font-black ${
                                        termsReviewed ? 'bg-emerald-400 text-emerald-950' : 'bg-purple-400/15 text-purple-200'
                                    }`}>
                                        {termsReviewed ? <Check size={18} /> : '01'}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <strong className="block text-sm font-black text-white">
                                            {termsReviewed ? '會員條款已完成審閱' : '請先審閱會員條款'}
                                        </strong>
                                        <small className="text-[11px] font-bold text-slate-400">
                                            {termsReviewed ? '可繼續完成註冊' : '點擊開啟完整條款內容'}
                                        </small>
                                    </span>
                                    <FileCheck2 size={19} className={termsReviewed ? 'text-emerald-300' : 'text-purple-300'} />
                                </button>

                                {submitted && !termsReviewed && (
                                    <p role="alert" className="flex items-center justify-center gap-1 text-xs font-bold text-red-300">
                                        <AlertCircle size={13} /> 請先完成會員條款審閱
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={!canRegister}
                                    className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#DAA520] text-lg font-black tracking-widest text-black shadow-[0_0_24px_rgba(255,215,0,0.22)] transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35"
                                >
                                    立即註冊 <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                                </button>
                            </form>

                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full pt-3 text-center text-sm font-bold text-slate-400 transition-colors hover:text-white"
                            >
                                已有帳號？<span className="text-[#FFD700] underline decoration-[#FFD700]/40 underline-offset-4">立即登入</span>
                            </button>
                        </div>
                    ) : (
                        <div className="relative flex h-full flex-col items-center justify-center text-center" aria-live="polite">
                            {stage === 'logging' ? (
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
                                    <h2 className="text-2xl font-black text-white">註冊成功</h2>
                                    <p className="mt-2 text-sm font-bold text-slate-400">歡迎 {nickname.trim()}，即將進入遊戲大廳</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </PrototypeOverlay>

            {showTerms && (
                <TermsModal
                    title="會員條款審閱"
                    registrationReview
                    onClose={() => setShowTerms(false)}
                    onAgree={() => {
                        setTermsReviewed(true);
                        setShowTerms(false);
                    }}
                />
            )}
        </>
    );
};

export default SignupModal;
