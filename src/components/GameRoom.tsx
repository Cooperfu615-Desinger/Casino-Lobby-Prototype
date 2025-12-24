import { useState, useEffect } from 'react';
import { LogOut, Loader2, Sparkles, Wifi } from 'lucide-react';
import { Game } from '../data/mockData';

interface GameRoomProps {
    game: Game;
    onExit: () => void;
}

const TIPS = [
    "Tip: 遇到大獎時記得截圖分享！",
    "Tip: 適度遊戲，享受樂趣！",
    "Tip: 連線異常時請檢查網路設定。",
    "Tip: VIP 等級越高，福利越多！",
    "Tip: 每日登入可領取免費金幣。",
];

const GameRoom = ({ game, onExit }: GameRoomProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [tip, setTip] = useState(TIPS[0]);

    useEffect(() => {
        // Random tip
        setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);

        // Loading simulation
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsLoading(false), 500); // Slight delay after 100%
                    return 100;
                }
                return prev + Math.random() * 8; // Random increment
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
            <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white`}>
                {/* Background Accent */}
                <div className={`absolute inset-0 opacity-20 ${game.image} blur-3xl scale-110`}></div>

                <div className="relative z-10 flex flex-col items-center w-full max-w-md px-8 text-center animate-in fade-in zoom-in-95 duration-500">
                    {/* Game Icon */}
                    <div className="text-8xl mb-6 animate-bounce duration-[3000ms]">
                        {game.icon}
                    </div>

                    <h1 className="text-3xl font-black italic tracking-wider mb-2 drop-shadow-lg">
                        {game.title}
                    </h1>
                    <p className="text-[#FFD700] text-sm font-bold tracking-[0.2em] mb-12 uppercase">
                        Loading Resources
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-6 border border-white/5">
                        <div
                            className="h-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] transition-all duration-300 ease-out shadow-[0_0_15px_#FFD700]"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    <div className="flex items-center justify-between w-full text-xs text-slate-500 font-mono mb-8">
                        <span>{Math.round(progress)}%</span>
                        <div className="flex items-center gap-2">
                            <Wifi size={12} className={progress > 50 ? "text-green-500" : "text-yellow-500"} />
                            <span>Secure Connection</span>
                        </div>
                    </div>

                    {/* Tip */}
                    <div className="bg-white/5 px-6 py-3 rounded-xl border border-white/10 backdrop-blur-sm">
                        <p className="text-slate-300 text-sm animate-pulse">
                            <Sparkles size={14} className="inline mr-2 text-yellow-400" />
                            {tip}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-40 bg-black flex flex-col animate-in fade-in duration-500">
            {/* Game Header (Optional, mostly hidden in immersive games, usually simulated in iframe) */}

            {/* Game Content Placeholder */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                {/* Background Ambient */}
                <div className={`absolute inset-0 opacity-10 bg-gradient-to-br from-purple-900 to-black`}></div>

                <div className="text-center z-10 p-8 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm shadow-2xl">
                    <div className="text-6xl mb-6 opacity-80">{game.icon}</div>
                    <Loader2 size={48} className="text-[#FFD700] animate-spin mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-2">Connecting to Game Provider</h2>
                    <p className="text-slate-400 text-sm">Please wait while we establish a secure session.</p>
                    <div className="mt-8 px-4 py-2 bg-black/40 rounded-lg text-xs font-mono text-slate-500 border border-white/5">
                        Session ID: {Math.random().toString(36).substring(7).toUpperCase()}-{game.id}
                    </div>
                </div>
            </div>

            {/* Exit FAB */}
            <button
                onClick={onExit}
                className="absolute top-6 right-6 z-50 bg-red-600/80 hover:bg-red-500 text-white p-3 rounded-full shadow-lg backdrop-blur-sm border border-white/20 transition-all hover:scale-110 active:scale-95 group"
                title="Exit Game"
            >
                <LogOut size={24} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
        </div>
    );
};

export default GameRoom;
