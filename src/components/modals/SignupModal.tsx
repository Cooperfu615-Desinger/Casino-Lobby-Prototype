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

    const labelClass = 'text-xs font-black tracking-wider text-slate-300';
    const inputClass = 'h-11 w-full rounded-xl border border-white/10 bg-black/35 px-4 text-sm font-bold text-white outline-none transition-all placeholder:text-slate-600 focus:border-[#FFD700] focus:bg-black/55';

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
            <div className="relative h-[560px] w-[640px] max-w-[calc(100vw-48px)] max-h-[calc(100vh-40px)] overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-[#2a1b42] via-[#1a0b2e] to-[#0d0418] p-7 shadow-[0_0_60px_rgba(0,0,0,0.65),0_0_32px_rgba(255,215,0,0.08)] animate-in zoom-in-95 duration-200">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,215,0,0.1),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(126,34,206,0.18),_transparent_40%)]" />
                <div className="relative">

                    <button
                        aria-label="關閉"
                        onClick={onClose}
                        className="absolute right-0 top-0 z-10 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-all hover:bg-white/10 hover:text-white active:scale-95"
                    >
                        <X size={22} />
                    </button>

                    <div className="mb-5 text-center">
                        <h2 className="text-2xl font-black text-white tracking-wide">建立帳號</h2>
                        <div className="mx-auto mt-3 h-0.5 w-14 rounded-full bg-[#FFD700]/70" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        {/* Username */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
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
                            <div className="space-y-1.5">
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
                        </div>

                        {/* Password */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
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
                            <div className="space-y-1.5">
                                <label htmlFor="signup-confirm-password" className={labelClass}>確認密碼</label>
                                <input
                                    id="signup-confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    autoComplete="new-password"
                                    placeholder="請再次輸入密碼"
                                    className={`h-11 w-full rounded-xl border bg-black/35 px-4 text-sm font-bold text-white outline-none transition-all placeholder:text-slate-600 focus:bg-black/55 ${confirmPassword && password !== confirmPassword
                                        ? 'border-red-400 focus:border-red-300'
                                        : 'border-white/10 focus:border-[#FFD700]'
                                        }`}
                                />
                                {/* Real-time mismatch hint */}
                                {confirmPassword && password !== confirmPassword && (
                                    <p className="text-red-300 text-[11px] pl-1 flex items-center gap-1">
                                        <AlertCircle size={11} /> 密碼不一致
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-slate-500">
                            <div className="h-px flex-1 bg-white/10" />
                            <span className="text-xs font-black tracking-wider">選填</span>
                            <div className="h-px flex-1 bg-white/10" />
                        </div>

                        {/* Promo Code */}
                        <div className="space-y-1.5">
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
                            <p className="text-[11px] font-bold text-slate-500">由代理或好友提供，無推廣碼可留空</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/15 border border-red-500/40 rounded-xl px-3 py-2 flex items-center gap-2 text-red-200 text-xs animate-in shake duration-300">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#DAA520] text-lg font-black tracking-widest text-black shadow-[0_0_24px_rgba(255,215,0,0.22)] transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-black/25 border-t-black rounded-full animate-spin"></div>
                                    註冊中...
                                </>
                            ) : (
                                <>
                                    立即註冊 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-xs font-bold text-slate-400">
                        註冊即代表您同意我們的服務條款與隱私政策
                    </p>

                    {/* Back button */}
                    <button
                        onClick={onClose}
                        className="w-full pt-3 text-center text-sm font-bold text-slate-400 transition-colors hover:text-white"
                    >
                        已有帳號？<span className="text-[#FFD700] underline decoration-[#FFD700]/40 underline-offset-4">立即登入</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignupModal;
