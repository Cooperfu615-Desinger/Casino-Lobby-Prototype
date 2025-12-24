import { useState } from 'react';
import { Music, Volume2, Bell, FileText, Info, LogOut, ToggleLeft, ToggleRight } from 'lucide-react';

const SettingsMenu = () => {
    const [music, setMusic] = useState(true);
    const [sound, setSound] = useState(true);
    const [push, setPush] = useState(true);

    return (
        <div className="absolute top-[80px] right-4 z-50 w-64 bg-[#1a0b2e]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-5 duration-200">
            <div className="p-2 space-y-1">
                {/* Toggles */}
                <div className="px-4 py-3 flex items-center justify-between hover:bg-white/5 rounded-xl transition-colors">
                    <div className="flex items-center gap-3 text-white">
                        <Music size={18} className="text-[#FFD700]" />
                        <span className="text-sm font-bold">背景音樂</span>
                    </div>
                    <button onClick={() => setMusic(!music)} className="text-[#FFD700] hover:scale-110 transition-transform">
                        {music ? <ToggleRight size={32} fill="currentColor" /> : <ToggleLeft size={32} className="text-slate-500" />}
                    </button>
                </div>
                <div className="px-4 py-3 flex items-center justify-between hover:bg-white/5 rounded-xl transition-colors">
                    <div className="flex items-center gap-3 text-white">
                        <Volume2 size={18} className="text-[#FFD700]" />
                        <span className="text-sm font-bold">遊戲音效</span>
                    </div>
                    <button onClick={() => setSound(!sound)} className="text-[#FFD700] hover:scale-110 transition-transform">
                        {sound ? <ToggleRight size={32} fill="currentColor" /> : <ToggleLeft size={32} className="text-slate-500" />}
                    </button>
                </div>
                <div className="px-4 py-3 flex items-center justify-between hover:bg-white/5 rounded-xl transition-colors">
                    <div className="flex items-center gap-3 text-white">
                        <Bell size={18} className="text-[#FFD700]" />
                        <span className="text-sm font-bold">推播通知</span>
                    </div>
                    <button onClick={() => setPush(!push)} className="text-[#FFD700] hover:scale-110 transition-transform">
                        {push ? <ToggleRight size={32} fill="currentColor" /> : <ToggleLeft size={32} className="text-slate-500" />}
                    </button>
                </div>

                <div className="h-px bg-white/10 my-2 mx-2"></div>

                {/* Links */}
                <button className="w-full px-4 py-3 flex items-center gap-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left">
                    <FileText size={18} />
                    <span className="text-sm">使用者規章</span>
                </button>
                <button className="w-full px-4 py-3 flex items-center gap-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left">
                    <Info size={18} />
                    <span className="text-sm">大廳功能說明</span>
                </button>

                <div className="h-px bg-white/10 my-2 mx-2"></div>

                {/* Logout */}
                <button className="w-full px-4 py-3 flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors text-left mb-2">
                    <LogOut size={18} />
                    <span className="text-sm font-bold">登出帳號</span>
                </button>
            </div>
        </div>
    );
};

export default SettingsMenu;
