import { useState } from 'react';
import { X, User, Lock, KeyRound, ArrowRight, AlertCircle } from 'lucide-react';
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
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

        // Simulate registration
        setLoading(true);
        setTimeout(() => {
            // Login with the new username
            login(username.trim());
            showToast('註冊成功！歡迎進入遊戲', 'success');
            setLoading(false);
            onSuccess();
        }, 1000);
    };

    return (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200">
            <div className="relative w-[420px] bg-[#1a0b2e] border border-white/20 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-white mb-2 text-center">建立新帳號</h2>
                <p className="text-slate-400 text-sm text-center mb-6">請填寫以下資訊完成註冊</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Username */}
                    <div className="space-y-1">
                        <label className="text-xs text-slate-400 pl-4 uppercase font-bold tracking-wider">帳號 (Username)</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-[#FFD700] transition-colors">
                                <User size={20} />
                            </div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="請輸入帳號 (至少 4 字元)"
                                className="w-full bg-black/40 border border-white/10 rounded-full py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/60 transition-all font-medium placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <label className="text-xs text-slate-400 pl-4 uppercase font-bold tracking-wider">密碼 (Password)</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-[#FFD700] transition-colors">
                                <Lock size={20} />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="請輸入密碼 (至少 6 字元)"
                                className="w-full bg-black/40 border border-white/10 rounded-full py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/60 transition-all font-medium placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                        <label className="text-xs text-slate-400 pl-4 uppercase font-bold tracking-wider">確認密碼 (Confirm)</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-[#FFD700] transition-colors">
                                <KeyRound size={20} />
                            </div>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="再次輸入密碼"
                                className={`w-full bg-black/40 border rounded-full py-3.5 pl-12 pr-4 text-white focus:outline-none focus:bg-black/60 transition-all font-medium placeholder:text-slate-600 ${confirmPassword && password !== confirmPassword
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-white/10 focus:border-[#FFD700]'
                                    }`}
                            />
                        </div>
                        {/* Real-time mismatch hint */}
                        {confirmPassword && password !== confirmPassword && (
                            <p className="text-red-400 text-xs pl-4 flex items-center gap-1 mt-1">
                                <AlertCircle size={12} /> 密碼不一致
                            </p>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 flex items-center gap-2 text-red-300 text-sm animate-in shake duration-300">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#FFD700] to-[#DAA520] text-black font-black py-4 rounded-full shadow-lg hover:brightness-110 active:scale-95 transition-all mt-4 flex items-center justify-center gap-2 group tracking-widest text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                註冊中...
                            </>
                        ) : (
                            <>
                                註冊 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                {/* Back button */}
                <button
                    onClick={onClose}
                    className="w-full mt-4 py-3 text-slate-400 text-sm font-medium hover:text-white transition-colors"
                >
                    返回登入
                </button>
            </div>
        </div>
    );
};

export default SignupModal;
