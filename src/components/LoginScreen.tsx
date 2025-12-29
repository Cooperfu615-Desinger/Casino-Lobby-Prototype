import { useState } from 'react';
import { User, Lock, ArrowRight, UserCircle2, Smartphone, Facebook, MessageCircle, Ghost, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
    const { login, loginAsGuest } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showLoginInput, setShowLoginInput] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API delay
        setTimeout(() => {
            login(username || undefined, password);
            setLoading(false);
        }, 800);
    };

    const comingSoon = () => {
        alert("Feature Coming Soon!");
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
            {/* 1280x720 Fixed Resolution Container */}
            <div className="relative w-[1280px] h-[720px] overflow-hidden shadow-2xl bg-gradient-to-b from-[#2c003e] to-black text-white font-sans flex flex-col items-center">

                {/* Background Texture */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>

                {/* Version */}
                <div className="absolute top-6 right-6 text-white/50 text-sm font-mono tracking-wider">
                    v1.000.00
                </div>

                {/* Main Logo */}
                <div className="mt-[6%] text-center animate-in fade-in zoom-in duration-1000">
                    <h1 className="text-8xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]">
                        YOTA
                    </h1>
                </div>

                {/* Login Buttons Grid */}
                <div className="mt-12 grid grid-cols-3 gap-6 w-full max-w-4xl px-12 z-10 animate-in slide-in-from-bottom-10 fade-in duration-700 delay-300">
                    {/* Account Login */}
                    <button
                        onClick={() => setShowLoginInput(true)}
                        className="flex flex-col items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FFD700] rounded-2xl p-6 transition-all group backdrop-blur-sm h-36 active:scale-95"
                    >
                        <User size={36} className="text-slate-300 group-hover:text-[#FFD700] transition-colors" />
                        <span className="text-slate-200 font-bold tracking-wide text-lg">帳號登入</span>
                    </button>

                    {/* Guest Login */}
                    <button
                        onClick={loginAsGuest}
                        className="flex flex-col items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FFD700] rounded-2xl p-6 transition-all group backdrop-blur-sm h-36 active:scale-95"
                    >
                        <UserCircle2 size={36} className="text-slate-300 group-hover:text-[#FFD700] transition-colors" />
                        <span className="text-slate-200 font-bold tracking-wide text-lg">遊客遊玩</span>
                    </button>

                    {/* Phone Login */}
                    <button
                        onClick={comingSoon}
                        className="flex flex-col items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FFD700] rounded-2xl p-6 transition-all group backdrop-blur-sm h-36 active:scale-95"
                    >
                        <Smartphone size={36} className="text-slate-300 group-hover:text-[#FFD700] transition-colors" />
                        <span className="text-slate-200 font-bold tracking-wide text-lg">手機登入</span>
                    </button>

                    {/* Facebook */}
                    <button
                        onClick={comingSoon}
                        className="flex flex-col items-center justify-center gap-3 bg-[#1877F2]/20 hover:bg-[#1877F2]/40 border border-[#1877F2]/30 hover:border-[#1877F2] rounded-2xl p-6 transition-all group backdrop-blur-sm h-36 active:scale-95"
                    >
                        <Facebook size={36} className="text-[#1877F2] group-hover:text-white transition-colors" />
                        <span className="text-blue-100 font-bold tracking-wide text-lg">Facebook</span>
                    </button>

                    {/* LINE */}
                    <button
                        onClick={comingSoon}
                        className="flex flex-col items-center justify-center gap-3 bg-[#00B900]/20 hover:bg-[#00B900]/40 border border-[#00B900]/30 hover:border-[#00B900] rounded-2xl p-6 transition-all group backdrop-blur-sm h-36 active:scale-95"
                    >
                        <MessageCircle size={36} className="text-[#00B900] group-hover:text-white transition-colors" />
                        <span className="text-green-100 font-bold tracking-wide text-lg">LINE</span>
                    </button>

                    {/* Apple */}
                    <button
                        onClick={comingSoon}
                        className="flex flex-col items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white rounded-2xl p-6 transition-all group backdrop-blur-sm h-36 active:scale-95"
                    >
                        {/* Ghost as placeholder for Apple or generic icon */}
                        <Ghost size={36} className="text-slate-300 group-hover:text-white transition-colors" />
                        <span className="text-slate-200 font-bold tracking-wide text-lg">Apple</span>
                    </button>
                </div>

                {/* Footer Links */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-8 text-xs text-white/40 z-10 font-medium tracking-wider">
                    <a href="#" className="hover:text-white transition-colors">使用者規章</a>
                    <span className="text-white/20">|</span>
                    <a href="#" className="hover:text-white transition-colors">隱私權政策</a>
                    <span className="text-white/20">|</span>
                    <a href="#" className="hover:text-white transition-colors">服務條款</a>
                </div>

                {/* Account Login Overlay Modal */}
                {showLoginInput && (
                    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200">
                        <div className="relative w-96 bg-[#1a0b2e] border border-white/20 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200">
                            <button
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

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-[#FFD700] to-[#DAA520] text-black font-black py-4 rounded-full shadow-lg hover:brightness-110 active:scale-95 transition-all mt-4 flex items-center justify-center gap-2 group tracking-widest text-lg"
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
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default LoginScreen;
