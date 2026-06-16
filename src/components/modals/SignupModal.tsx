import { useState } from 'react';
import { X, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';

interface SignupModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

const SignupModal = ({ onClose, onSuccess }: SignupModalProps) => {
    const { login } = useAuth();
    const { showToast } = useUI();

    const [username, setUsername] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [promoCode, setPromoCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const labelClass = 'text-lg font-black text-white';
    const inputClass = 'h-[58px] w-full rounded-2xl border-2 border-white/28 bg-white/10 px-5 text-xl font-bold text-white outline-none transition-all placeholder:text-white/38 focus:border-white/75 focus:bg-white/15';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!username.trim()) {
            setError('請輸入帳號');
            return;
        }
        if (username.trim().length < 4) {
            setError('帳號至少需要 4 個字元');
            return;
        }
        if (username.trim().length > 20) {
            setError('帳號最多 20 個字元');
            return;
        }
        if (!nickname.trim()) {
            setError('請輸入暱稱');
            return;
        }
        if (!password) {
            setError('請輸入密碼');
            return;
        }
        if (password.length < 6) {
            setError('密碼至少需要 6 個字元');
            return;
        }
        if (password !== confirmPassword) {
            setError('密碼與確認密碼不符');
            return;
        }
        if (promoCode.trim() && ![6, 8].includes(promoCode.trim().length)) {
            setError('推廣碼需為代理 6 碼或玩家 8 碼');
            return;
        }

        // Simulate registration
        setLoading(true);
        setTimeout(() => {
            // Use nickname as the displayed player name after registration.
            login(nickname.trim());
            showToast('註冊成功！歡迎進入遊戲', 'success');
            setLoading(false);
            onSuccess();
        }, 1000);
    };

    return (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200">
            <div className="relative w-[500px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-32px)] overflow-hidden rounded-[34px] border border-white/25 bg-gradient-to-b from-[#7f86ff] via-[#6268ef] to-[#343fba] p-[3px] shadow-[0_24px_80px_rgba(0,0,0,0.58),0_0_34px_rgba(126,134,255,0.38)] animate-in zoom-in-95 duration-200">
                <div className="relative max-h-[calc(100vh-38px)] overflow-y-auto rounded-[31px] px-6 py-8 sm:px-10 custom-scrollbar">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(22,28,126,0.32),_transparent_36%)]" />
                    <div className="pointer-events-none absolute inset-x-7 top-7 h-px bg-white/35" />

                    <button
                        aria-label="關閉"
                        onClick={onClose}
                        className="absolute right-8 top-8 z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/35 bg-white/10 text-white/75 transition-all hover:bg-white/20 hover:text-white active:scale-95"
                    >
                        <X size={30} />
                    </button>

                    <div className="relative mb-8 text-center">
                        <h2 className="text-[34px] font-black text-white tracking-wide">建立帳號</h2>
                        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-white/55" />
                    </div>

                    <form onSubmit={handleSubmit} className="relative space-y-4">
                        {/* Username */}
                        <div className="space-y-2">
                            <label htmlFor="signup-username" className={labelClass}>帳號</label>
                            <input
                                id="signup-username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                maxLength={20}
                                autoComplete="username"
                                placeholder="請設定帳號（4～20 字元）"
                                className={inputClass}
                            />
                        </div>

                        {/* Nickname */}
                        <div className="space-y-2">
                            <label htmlFor="signup-nickname" className={labelClass}>暱稱</label>
                            <input
                                id="signup-nickname"
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                autoComplete="nickname"
                                placeholder="請設定暱稱（顯示給其他玩家）"
                                className={inputClass}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label htmlFor="signup-password" className={labelClass}>密碼</label>
                            <input
                                id="signup-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                placeholder="請設定密碼（6 字元以上）"
                                className={inputClass}
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label htmlFor="signup-confirm-password" className={labelClass}>確認密碼</label>
                            <input
                                id="signup-confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                                placeholder="請再次輸入密碼"
                                className={`h-[58px] w-full rounded-2xl border-2 bg-white/10 px-5 text-xl font-bold text-white outline-none transition-all placeholder:text-white/38 focus:bg-white/15 ${confirmPassword && password !== confirmPassword
                                    ? 'border-red-300 focus:border-red-200'
                                    : 'border-white/28 focus:border-white/75'
                                    }`}
                            />
                            {/* Real-time mismatch hint */}
                            {confirmPassword && password !== confirmPassword && (
                                <p className="text-red-100 text-xs pl-1 flex items-center gap-1 mt-1">
                                    <AlertCircle size={12} /> 密碼不一致
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-4 py-2 text-white/55">
                            <div className="h-px flex-1 bg-white/25" />
                            <span className="text-base font-black">選填</span>
                            <div className="h-px flex-1 bg-white/25" />
                        </div>

                        {/* Promo Code */}
                        <div className="space-y-2">
                            <label htmlFor="signup-promo-code" className={labelClass}>推廣碼</label>
                            <input
                                id="signup-promo-code"
                                type="text"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                maxLength={8}
                                placeholder="代理 6 碼 / 玩家 8 碼（可不填）"
                                className={inputClass}
                            />
                            <p className="text-sm font-bold text-white/55">由代理或好友提供，無推廣碼可留空</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/25 border border-red-200/50 rounded-xl p-3 flex items-center gap-2 text-red-50 text-sm animate-in shake duration-300">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="group mt-3 flex h-[64px] w-full items-center justify-center gap-2 rounded-full border-2 border-white/80 bg-gradient-to-b from-[#8cf2b9] to-[#21bd78] text-3xl font-black tracking-wide text-white shadow-[0_14px_30px_rgba(12,121,78,0.32)] transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <div className="w-6 h-6 border-2 border-white/35 border-t-white rounded-full animate-spin"></div>
                                    註冊中...
                                </>
                            ) : (
                                <>
                                    立即註冊 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="relative mt-5 text-center text-sm font-bold text-white/62">
                        註冊即代表您同意我們的服務條款與隱私政策
                    </p>

                    {/* Back button */}
                    <button
                        onClick={onClose}
                        className="relative w-full pt-4 text-center text-base font-bold text-white/55 transition-colors hover:text-white"
                    >
                        已有帳號？<span className="text-fuchsia-300 underline decoration-fuchsia-300/60 underline-offset-4">立即登入</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignupModal;
