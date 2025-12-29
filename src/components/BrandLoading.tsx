import { useState, useEffect } from 'react';
import { Sparkles, Wifi } from 'lucide-react';

interface BrandLoadingProps {
    onFinished: () => void;
}

const TIPS = [
    "Tip: 遇到大獎時記得截圖分享！",
    "Tip: 適度遊戲，享受樂趣！",
    "Tip: VIP 等級越高，福利越多！",
    "Tip: 每日登入可領取免費金幣。",
    "Tip: 參加俱樂部活動，贏取額外獎勵！",
];

const RESOURCE_TEXTS = [
    "Initializing core engine...",
    "Loading high-res textures...",
    "Connecting to secure server...",
    "Optimizing assets...",
    "Syncing player data...",
    "Preparing game environment...",
    "Verifying security tokens...",
];

const BrandLoading = ({ onFinished }: BrandLoadingProps) => {
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState(RESOURCE_TEXTS[0]);
    const [tip, setTip] = useState(TIPS[0]);

    useEffect(() => {
        // Random tip on mount
        setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onFinished, 500); // Slight delay after completion
                    return 100;
                }

                // Randomly change loading text
                if (Math.random() > 0.7) {
                    setLoadingText(RESOURCE_TEXTS[Math.floor(Math.random() * RESOURCE_TEXTS.length)]);
                }

                // Random increment
                const increment = Math.random() * 5 + 1;
                return Math.min(prev + increment, 100);
            });
        }, 150);

        return () => clearInterval(interval);
    }, [onFinished]);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#2c003e] to-black text-white font-sans">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center w-full max-w-2xl px-8 h-full justify-center">

                {/* Brand Name */}
                <div className="mb-4 text-center animate-in fade-in zoom-in duration-1000">
                    <h1 className="text-8xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]">
                        YOTA
                    </h1>
                </div>

                {/* Tip */}
                <div className="bg-white/5 px-6 py-2 rounded-full border border-white/10 backdrop-blur-sm mb-12 animate-pulse">
                    <p className="text-slate-400 text-sm font-medium tracking-wide flex items-center gap-2">
                        <Sparkles size={14} className="text-[#FFD700]" />
                        {tip}
                    </p>
                </div>

                {/* Spacer to push loading bar to bottom area if needed, but here we center vertically for balance */}
                <div className="h-20"></div>

                {/* Loading Info (Bottom) */}
                <div className="w-full max-w-md absolute bottom-20 flex flex-col gap-2">
                    {/* Console-style Loading Text */}
                    <div className="flex justify-between items-end text-xs font-mono text-purple-300/80 mb-2 h-6">
                        <span className="animate-pulse">
                            {'>'} {loadingText}
                        </span>
                        <span>{Math.round(progress)}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-[#FFD700] shadow-[0_0_15px_#d946ef] transition-all duration-150 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    {/* Status Icons */}
                    <div className="flex justify-end mt-2 opacity-50">
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                            <Wifi size={10} className={progress > 20 ? "text-green-500" : "text-slate-600"} />
                            <span>SECURE CONNECTION</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandLoading;
