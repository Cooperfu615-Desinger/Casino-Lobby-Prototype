import { useEffect, useState, type ReactNode } from 'react';
import {
    Check,
    CheckCircle2,
    Link2,
    LoaderCircle,
    LockKeyhole,
    Phone,
    RefreshCw,
    Send,
    ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { LobbyModalButton } from '../common/LobbyModalPrimitives';

type PhoneBindingStep = 'phone' | 'otp';

const AccountBindingPanel = () => {
    const { user, updateUser } = useAuth();
    const { showToast } = useUI();
    const [phoneStep, setPhoneStep] = useState<PhoneBindingStep>('phone');
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? '');
    const [otp, setOtp] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
    const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);

    useEffect(() => {
        if (countdown <= 0) return;
        const timer = window.setInterval(() => {
            setCountdown(value => Math.max(value - 1, 0));
        }, 1000);
        return () => window.clearInterval(timer);
    }, [countdown]);

    if (!user) return null;

    const phoneBound = user.bindings.phone;
    const googleBound = user.bindings.google;

    const sendOtp = () => {
        if (!/^09\d{8}$/.test(phoneNumber)) {
            setPhoneError('請輸入 09 開頭的 10 碼手機號碼');
            return;
        }
        setPhoneError('');
        setOtp('');
        setPhoneStep('otp');
        setCountdown(60);
        showToast('驗證碼已發送（Mock：123456）', 'info');
    };

    const resendOtp = () => {
        if (countdown > 0) return;
        setCountdown(60);
        setOtp('');
        setPhoneError('');
        showToast('驗證碼已重新發送（Mock：123456）', 'info');
    };

    const verifyPhone = () => {
        if (otp !== '123456') {
            setPhoneError('驗證碼錯誤，請輸入 123456');
            return;
        }

        setPhoneError('');
        setIsVerifyingPhone(true);
        window.setTimeout(() => {
            updateUser({
                phoneNumber,
                bindings: { ...user.bindings, phone: true },
            });
            setIsVerifyingPhone(false);
            showToast('手機號碼綁定成功', 'success');
        }, 650);
    };

    const connectGoogle = () => {
        setIsConnectingGoogle(true);
        window.setTimeout(() => {
            updateUser({ bindings: { ...user.bindings, google: true } });
            setIsConnectingGoogle(false);
            showToast('Google 帳號綁定成功', 'success');
        }, 850);
    };

    return (
        <div className="flex h-full min-h-0 flex-col overflow-y-auto pr-1 custom-scrollbar">
            <div>
                <p className="text-[9px] font-black tracking-[0.22em] text-white/55">ACCOUNT SECURITY</p>
                <h3 className="mt-1 text-xl font-black text-white">帳號綁定</h3>
                <p className="mt-1 text-xs leading-5 text-white/58">綁定手機號碼或 Google，保留更多登入方式並提升帳號安全性。</p>
            </div>

            <div className="mt-4 grid gap-3">
                <BindingCard
                    icon={<Phone size={21} />}
                    title="手機號碼"
                    description={phoneBound ? '此手機已可用於帳號驗證。' : '以台灣手機號碼接收一次性驗證碼。'}
                    bound={phoneBound}
                >
                    {phoneBound ? (
                        <BoundSummary value={user.phoneNumber} />
                    ) : phoneStep === 'phone' ? (
                        <div className="mt-4 grid grid-cols-[1fr_auto] items-end gap-3">
                            <label htmlFor="binding-phone" className="min-w-0">
                                <span className="mb-1.5 block text-[10px] font-black text-white/55">手機號碼</span>
                                <input
                                    id="binding-phone"
                                    type="tel"
                                    inputMode="numeric"
                                    autoComplete="tel"
                                    value={phoneNumber}
                                    onChange={event => setPhoneNumber(event.target.value.replace(/\D/g, '').slice(0, 10))}
                                    placeholder="0912345678"
                                    className="lobby-profile-field__input h-10 w-full rounded-xl px-3 text-xs font-bold"
                                />
                            </label>
                            <LobbyModalButton onClick={sendOtp} className="h-10 whitespace-nowrap px-5">
                                <Send size={14} /> 發送驗證碼
                            </LobbyModalButton>
                        </div>
                    ) : (
                        <div className="mt-4">
                            <div className="grid grid-cols-[1fr_auto] items-end gap-3">
                                <label htmlFor="binding-otp" className="min-w-0">
                                    <span className="mb-1.5 flex items-center justify-between gap-3 text-[10px] font-black text-white/55">
                                        <span>驗證碼</span>
                                        <span className="text-white/42">已發送至 {phoneNumber}</span>
                                    </span>
                                    <input
                                        id="binding-otp"
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        value={otp}
                                        onChange={event => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="請輸入 123456"
                                        className="lobby-profile-field__input h-10 w-full rounded-xl px-3 text-xs font-bold tracking-[0.25em]"
                                    />
                                </label>
                                <LobbyModalButton onClick={verifyPhone} disabled={isVerifyingPhone || otp.length !== 6} className="h-10 whitespace-nowrap px-5">
                                    {isVerifyingPhone ? <LoaderCircle className="animate-spin" size={15} /> : <ShieldCheck size={15} />}
                                    {isVerifyingPhone ? '驗證中…' : '確認綁定'}
                                </LobbyModalButton>
                            </div>
                            <div className="mt-2 flex items-center justify-between gap-3">
                                <button type="button" onClick={() => { setPhoneStep('phone'); setPhoneError(''); }} className="text-[10px] font-bold text-white/58 hover:text-white">
                                    修改手機號碼
                                </button>
                                <button type="button" onClick={resendOtp} disabled={countdown > 0} className="flex items-center gap-1 text-[10px] font-bold text-white/58 hover:text-white disabled:cursor-not-allowed disabled:text-white/35">
                                    <RefreshCw size={11} />
                                    {countdown > 0 ? `${countdown} 秒後可重發` : '重新發送驗證碼'}
                                </button>
                            </div>
                        </div>
                    )}
                    {phoneError && <p className="mt-2 text-[10px] font-bold text-red-200">{phoneError}</p>}
                </BindingCard>

                <BindingCard
                    icon={<span className="text-lg font-black">G</span>}
                    title="Google"
                    description={googleBound ? 'Google 帳號已連結，可作為快速登入方式。' : '使用 Google 授權連結目前的巨亨ONLINE帳號。'}
                    bound={googleBound}
                >
                    {googleBound ? (
                        <BoundSummary value="Google 帳號已連結" />
                    ) : (
                        <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-white/12 bg-[#17266d]/22 p-3">
                            <div className="flex min-w-0 items-center gap-3">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-black text-[#4267d5]">G</span>
                                <div className="min-w-0">
                                    <strong className="block text-xs text-white">連結 Google</strong>
                                    <span className="mt-0.5 block truncate text-[10px] text-white/48">Mock 授權不會開啟外部頁面</span>
                                </div>
                            </div>
                            <LobbyModalButton onClick={connectGoogle} disabled={isConnectingGoogle} className="min-w-[118px]">
                                {isConnectingGoogle ? <LoaderCircle className="animate-spin" size={15} /> : <Link2 size={15} />}
                                {isConnectingGoogle ? '連線中…' : '開始綁定'}
                            </LobbyModalButton>
                        </div>
                    )}
                </BindingCard>
            </div>

            <p className="mt-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-[10px] leading-4 text-white/48">
                <LockKeyhole size={14} className="shrink-0" />
                原型只模擬綁定狀態，不會傳送簡訊或連線至 Google；重新整理後綁定結果仍會保留。
            </p>
        </div>
    );
};

interface BindingCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    bound: boolean;
    children: ReactNode;
}

const BindingCard = ({ icon, title, description, bound, children }: BindingCardProps) => (
    <section className="rounded-3xl border border-white/15 bg-[#263990]/24 p-4">
        <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/18 bg-white/12 text-white">{icon}</span>
            <div className="min-w-0 flex-1">
                <h4 className="text-sm font-black text-white">{title}</h4>
                <p className="mt-1 text-xs text-white/54">{description}</p>
            </div>
            <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-black ${bound ? 'border-emerald-200/35 bg-emerald-400/16 text-emerald-100' : 'border-white/18 bg-white/8 text-white/52'}`}>
                {bound && <CheckCircle2 size={12} />}
                {bound ? '已綁定' : '未綁定'}
            </span>
        </div>
        {children}
    </section>
);

const BoundSummary = ({ value }: { value: string }) => (
    <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-200/20 bg-emerald-400/10 px-4 py-3 text-xs font-bold text-emerald-50">
        <Check size={15} /> {value}
    </div>
);

export default AccountBindingPanel;
