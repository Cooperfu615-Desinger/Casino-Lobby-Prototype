import { useEffect, useState } from 'react';
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    LoaderCircle,
    Smartphone,
    X,
} from 'lucide-react';
import PrototypeOverlay from '../common/PrototypeOverlay';

interface PhoneLoginModalProps {
    onClose: () => void;
    onLogin: (phoneNumber: string) => void;
}

type PhoneLoginStage = 'phone' | 'code' | 'logging' | 'success';

const delay = (milliseconds: number) =>
    new Promise((resolve) => window.setTimeout(resolve, milliseconds));

const PhoneLoginModal = ({ onClose, onLogin }: PhoneLoginModalProps) => {
    const [stage, setStage] = useState<PhoneLoginStage>('phone');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        if (countdown <= 0) return;
        const timer = window.setInterval(() => {
            setCountdown((current) => Math.max(0, current - 1));
        }, 1000);
        return () => window.clearInterval(timer);
    }, [countdown]);

    const normalizedPhone = phoneNumber.replace(/\D/g, '').slice(0, 10);

    const sendCode = () => {
        setError('');
        if (!/^09\d{8}$/.test(normalizedPhone)) {
            setError('請輸入正確的 10 碼手機號碼');
            return;
        }
        setPhoneNumber(normalizedPhone);
        setVerificationCode('');
        setCountdown(60);
        setStage('code');
    };

    const handleVerify = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        if (verificationCode !== '123456') {
            setError('Mock 驗證碼為 123456');
            return;
        }

        setStage('logging');
        await delay(850);
        setStage('success');
        await delay(650);
        onLogin(normalizedPhone);
    };

    const canClose = stage === 'phone' || stage === 'code';

    return (
        <PrototypeOverlay layer="auth">
            <div className="juheng-auth-form-panel relative flex h-[520px] w-[420px] flex-col overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-[#201139] via-[#160a27] to-[#0d0418] p-8 text-white shadow-[0_0_50px_rgba(16,185,129,0.18)] animate-in zoom-in-95 duration-200">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_38%)]" />
                {canClose && (
                    <button
                        aria-label="關閉手機登入"
                        onClick={onClose}
                        className="absolute right-4 top-4 z-10 rounded-full p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                    >
                        <X size={22} />
                    </button>
                )}

                {stage === 'phone' && (
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            sendCode();
                        }}
                        className="relative flex h-full flex-col"
                        noValidate
                    >
                        <div className="text-center">
                            <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-400/12 text-emerald-300">
                                <Smartphone size={29} />
                            </span>
                            <p className="text-[10px] font-black tracking-[0.24em] text-emerald-300">MOBILE SIGN IN</p>
                            <h2 className="mt-1 text-2xl font-black">手機登入</h2>
                            <p className="mt-2 text-xs font-bold leading-relaxed text-slate-400">輸入台灣手機號碼以接收一次性驗證碼</p>
                        </div>

                        <div className="mt-9 space-y-2">
                            <label htmlFor="phone-login-number" className="pl-2 text-xs font-black tracking-wider text-emerald-300">
                                手機號碼
                            </label>
                            <input
                                id="phone-login-number"
                                type="tel"
                                inputMode="numeric"
                                autoComplete="tel"
                                value={phoneNumber}
                                onChange={(event) => setPhoneNumber(event.target.value.replace(/\D/g, '').slice(0, 10))}
                                placeholder="09xxxxxxxx"
                                className="w-full rounded-full border border-emerald-500/20 bg-black/40 px-6 py-3.5 text-center font-mono text-lg tracking-widest text-white outline-none transition-all placeholder:font-sans placeholder:tracking-normal placeholder:text-slate-600 focus:border-emerald-400 focus:bg-black/60"
                                aria-describedby="phone-login-error"
                                autoFocus
                            />
                            {error && (
                                <p id="phone-login-error" role="alert" className="flex items-center justify-center gap-1 text-xs font-bold text-red-300">
                                    <AlertCircle size={13} /> {error}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="mt-auto flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 py-4 font-black tracking-widest text-white shadow-lg transition-all hover:brightness-110 active:scale-95"
                        >
                            發送驗證碼 <ArrowRight size={18} />
                        </button>
                    </form>
                )}

                {stage === 'code' && (
                    <form onSubmit={handleVerify} className="relative flex h-full flex-col" noValidate>
                        <div className="text-center">
                            <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-400/12 text-emerald-300">
                                <Smartphone size={29} />
                            </span>
                            <p className="text-[10px] font-black tracking-[0.24em] text-emerald-300">VERIFY MOBILE</p>
                            <h2 className="mt-1 text-2xl font-black">輸入驗證碼</h2>
                            <p className="mt-2 text-xs font-bold text-slate-400">驗證碼已傳送至 {normalizedPhone}</p>
                        </div>

                        <div className="mt-7 space-y-2">
                            <div className="flex items-center justify-between px-2">
                                <label htmlFor="phone-login-code" className="text-xs font-black tracking-wider text-emerald-300">
                                    6 位數驗證碼
                                </label>
                                <button
                                    type="button"
                                    onClick={sendCode}
                                    disabled={countdown > 0}
                                    className="text-[11px] font-black text-emerald-300 transition-colors hover:text-emerald-200 disabled:text-slate-600"
                                >
                                    {countdown > 0 ? `${countdown}s 後重發` : '重新發送'}
                                </button>
                            </div>
                            <input
                                id="phone-login-code"
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={6}
                                value={verificationCode}
                                onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                className="w-full rounded-full border border-emerald-500/20 bg-black/40 px-6 py-3.5 text-center font-mono text-2xl tracking-[0.55em] text-white outline-none transition-all placeholder:text-slate-700 focus:border-emerald-400 focus:bg-black/60"
                                aria-describedby="phone-code-helper phone-code-error"
                                autoFocus
                            />
                            <p id="phone-code-helper" className="text-center text-[11px] font-bold text-slate-500">
                                原型測試驗證碼：<span className="text-emerald-300">123456</span>
                            </p>
                            {error && (
                                <p id="phone-code-error" role="alert" className="flex items-center justify-center gap-1 text-xs font-bold text-red-300">
                                    <AlertCircle size={13} /> {error}
                                </p>
                            )}
                        </div>

                        <div className="mt-auto flex gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setStage('phone');
                                    setError('');
                                    setCountdown(0);
                                }}
                                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-emerald-400/35 py-4 text-sm font-black text-emerald-200 transition-all hover:bg-emerald-400/10 active:scale-95"
                            >
                                <ArrowLeft size={17} /> 修改號碼
                            </button>
                            <button
                                type="submit"
                                disabled={verificationCode.length !== 6}
                                className="flex flex-[1.35] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 py-4 text-sm font-black tracking-wider text-white transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
                            >
                                驗證並登入 <ArrowRight size={17} />
                            </button>
                        </div>
                    </form>
                )}

                {(stage === 'logging' || stage === 'success') && (
                    <div className="relative flex h-full flex-col items-center justify-center text-center" aria-live="polite">
                        {stage === 'logging' ? (
                            <>
                                <LoaderCircle size={52} className="mb-5 animate-spin text-emerald-300" />
                                <h2 className="text-2xl font-black">正在建立安全連線</h2>
                                <p className="mt-2 text-sm font-bold text-slate-400">正在驗證手機登入資訊</p>
                            </>
                        ) : (
                            <>
                                <span className="mb-5 grid h-20 w-20 place-items-center rounded-full bg-emerald-400 text-emerald-950 shadow-[0_0_40px_rgba(74,222,128,0.28)]">
                                    <CheckCircle2 size={42} />
                                </span>
                                <h2 className="text-2xl font-black">登入成功</h2>
                                <p className="mt-2 text-sm font-bold text-slate-400">即將進入遊戲大廳</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </PrototypeOverlay>
    );
};

export default PhoneLoginModal;
