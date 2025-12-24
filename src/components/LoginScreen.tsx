import { useState } from 'react';
import { User, Lock, ArrowRight, UserCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
    const { login, loginAsGuest } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API delay
        setTimeout(() => {
            login(username || undefined, password);
            setLoading(false);
        }, 800);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black p-4">
            {/* 1280x720 Fixed Resolution Container matching App.tsx */}
            <div
                className="relative bg-[#1a0b2e] overflow-hidden font-sans selection:bg-[#FFD700] selection:text-black shadow-2xl border border-slate-800 flex items-center justify-center"
                style={{ width: '1280px', height: '720px' }}
            >
                {/* Background Texture */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#4B0082] via-[#240046] to-[#100020]"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>

                {/* Animated Orbs */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

                {/* Login Card */}
                <div className="relative z-10 w-96 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500">

                    <div className="text-center mb-8">
                        <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] shadow-[0_0_30px_#FFD700] mb-4">
                            <span className="text-4xl">🎰</span>
                        </div>
                        <h1 className="text-3xl font-black text-white italic tracking-wide">
                            GOLDEN BET
                            <span className="block text-sm font-normal text-[#FFD700] tracking-[0.3em] mt-1">CASINO LOBBY</span>
                        </h1>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs text-slate-400 pl-4 uppercase font-bold">Username</label>
                            <div className="relative">
                                <div className="absolute left-4 top-3 text-slate-500">
                                    <User size={20} />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter username"
                                    className="w-full bg-black/50 border border-white/10 rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#FFD700] transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-slate-400 pl-4 uppercase font-bold">Password</label>
                            <div className="relative">
                                <div className="absolute left-4 top-3 text-slate-500">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-black/50 border border-white/10 rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#FFD700] transition-colors"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#FFD700] to-[#DAA520] text-black font-black py-4 rounded-full shadow-lg hover:brightness-110 active:scale-95 transition-all mt-6 flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <span className="animate-spin">⌛</span>
                            ) : (
                                <>
                                    LOGIN <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/10 text-center">
                        <button
                            onClick={loginAsGuest}
                            className="text-slate-400 hover:text-white text-sm flex items-center justify-center gap-2 mx-auto hover:bg-white/5 py-2 px-4 rounded-lg transition-colors"
                        >
                            <UserCircle2 size={16} />
                            Play as Guest
                        </button>
                    </div>

                </div>

                <p className="absolute bottom-4 text-slate-600 text-xs text-center w-full">
                    v1.0.0 • Secure Connection • 2025 Golden Bet Casino
                </p>
            </div>
        </div>
    );
};

export default LoginScreen;
