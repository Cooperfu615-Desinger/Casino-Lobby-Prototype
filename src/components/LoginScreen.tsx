import { useState } from 'react';
import { User, Lock, ArrowRight, UserCircle2, Smartphone, Facebook, MessageCircle, X } from 'lucide-react';
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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center animate-in fade-in zoom-in duration-1000">
                    <h1 className="text-8xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]">
                        YOTA
                    </h1>
                </div>

                {/* Login Buttons Area */}
                <div className="absolute bottom-24 left-0 right-0 w-full px-12 z-10 animate-in slide-in-from-bottom-10 fade-in duration-700 delay-300 flex flex-col items-center">

                    {/* Row 1: Primary Login (Account & Guest) */}
                    <div className="flex gap-6 justify-center mb-6">
                        {/* Account Login */}
                        <button
                            onClick={() => setShowLoginInput(true)}
                            className="w-28 h-28 aspect-square rounded-2xl shadow-lg flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform duration-200 bg-gradient-to-br from-fuchsia-500 to-pink-600 hover:from-fuchsia-600 hover:to-pink-700 text-white group"
                        >
                            <User size={40} className="text-indigo-100 group-hover:text-white transition-colors" />
                            <span className="text-sm font-bold tracking-wide">帳號登入</span>
                        </button>

                        {/* Guest Login */}
                        <button
                            onClick={loginAsGuest}
                            className="w-28 h-28 aspect-square rounded-2xl shadow-lg flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform duration-200 bg-amber-500 hover:bg-amber-400 text-white group"
                        >
                            <UserCircle2 size={40} className="text-amber-100 group-hover:text-white transition-colors" />
                            <span className="text-sm font-bold tracking-wide">遊客遊玩</span>
                        </button>
                    </div>

                    {/* Row 2: Third Party Login */}
                    <div className="flex gap-4 justify-center">
                        {/* Phone Login */}
                        <button
                            onClick={comingSoon}
                            className="w-28 h-28 aspect-square rounded-2xl shadow-lg flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform duration-200 bg-emerald-600 hover:bg-emerald-500 text-white group"
                        >
                            <Smartphone size={40} className="text-emerald-100 group-hover:text-white transition-colors" />
                            <span className="text-sm font-bold tracking-wide">手機登入</span>
                        </button>

                        {/* Facebook */}
                        <button
                            onClick={comingSoon}
                            className="w-28 h-28 aspect-square rounded-2xl shadow-lg flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform duration-200 bg-[#1877F2] hover:bg-[#1877F2]/90 text-white group"
                        >
                            <Facebook size={40} className="text-blue-100 group-hover:text-white transition-colors" />
                            <span className="text-sm font-bold tracking-wide">Facebook</span>
                        </button>

                        {/* LINE */}
                        <button
                            onClick={comingSoon}
                            className="w-28 h-28 aspect-square rounded-2xl shadow-lg flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform duration-200 bg-[#06C755] hover:bg-[#06C755]/90 text-white group"
                        >
                            <MessageCircle size={40} className="text-green-100 group-hover:text-white transition-colors" />
                            <span className="text-sm font-bold tracking-wide">LINE</span>
                        </button>

                        {/* Apple */}
                        <button
                            onClick={comingSoon}
                            className="w-28 h-28 aspect-square rounded-2xl shadow-lg flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform duration-200 bg-white hover:bg-gray-200 text-black group"
                        >
                            <svg className="w-10 h-10 fill-current text-black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.15 4.09-.64 1.8.55 2.91 1.77 3.48 2.65-3.05 1.57-2.48 5.67.65 6.94-.9 2.14-2.18 4.25-3.3 5.28zM14.99 4.26c.7-1.33 2.13-2.16 3.6-2.26.17 1.6-1.12 3.23-2.41 3.73-1.07.45-2.24-.04-2.61-1.46.46 0 .96.02 1.42-.01z" />
                            </svg>
                            <span className="text-sm font-bold tracking-wide">Apple</span>
                        </button>
                    </div>
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
