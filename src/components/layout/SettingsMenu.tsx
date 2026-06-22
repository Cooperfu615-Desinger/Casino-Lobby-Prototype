import { useState } from 'react';
import { Music, Volume2, Bell, FileText, LogOut, ToggleLeft, ToggleRight, Globe, SunMoon, Ban } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import { useUserPreferences } from '../../context/UserPreferencesContext';
import { useUI } from '../../context/UIContext';
import { useSocial } from '../../context/SocialContext';

interface SettingsMenuProps {
    onOpenLanguage: () => void;
    onOpenLegal: () => void;
    onCloseMenu: () => void;
}

const SettingsMenu = ({ onOpenLanguage, onOpenLegal, onCloseMenu }: SettingsMenuProps) => {
    const { isMusicEnabled, isSoundEnabled, toggleMusic, toggleSound } = useAudio();
    const { themeMode, toggleThemeMode } = useUserPreferences();
    const { openModal } = useUI();
    const { blockedPlayers } = useSocial();
    const [push, setPush] = useState(true);
    const { logout } = useAuth();

    return (
        <div className="absolute top-[80px] right-4 z-[100] w-64 bg-[#1a0b2e]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-5 duration-200">
            <div className="p-2 space-y-1">
                {/* Toggles */}
                <div className="px-4 py-3 flex items-center justify-between hover:bg-white/5 rounded-xl transition-colors">
                    <div className="flex items-center gap-3 text-white">
                        <Music size={18} className="text-[#FFD700]" />
                        <span className="text-sm font-bold">背景音樂</span>
                    </div>
                    <button onClick={toggleMusic} className="text-[#FFD700] hover:scale-110 transition-transform">
                        {isMusicEnabled ? <ToggleRight size={32} fill="currentColor" /> : <ToggleLeft size={32} className="text-slate-500" />}
                    </button>
                </div>
                <div className="px-4 py-3 flex items-center justify-between hover:bg-white/5 rounded-xl transition-colors">
                    <div className="flex items-center gap-3 text-white">
                        <Volume2 size={18} className="text-[#FFD700]" />
                        <span className="text-sm font-bold">遊戲音效</span>
                    </div>
                    <button onClick={toggleSound} className="text-[#FFD700] hover:scale-110 transition-transform">
                        {isSoundEnabled ? <ToggleRight size={32} fill="currentColor" /> : <ToggleLeft size={32} className="text-slate-500" />}
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
                <div className="px-4 py-3 flex items-center justify-between hover:bg-white/5 rounded-xl transition-colors">
                    <div className="flex items-center gap-3 text-white">
                        <SunMoon size={18} className="text-[#FFD700]" />
                        <div className="flex flex-col">
                            <span className="text-sm font-bold">日夜切換</span>
                            <span className="text-[10px] text-slate-500">
                                {themeMode === 'night' ? '目前：夜景模式' : '目前：日景模式'}
                            </span>
                        </div>
                    </div>
                    <button onClick={toggleThemeMode} className="text-[#FFD700] hover:scale-110 transition-transform">
                        {themeMode === 'day' ? <ToggleRight size={32} fill="currentColor" /> : <ToggleLeft size={32} className="text-slate-500" />}
                    </button>
                </div>

                <div className="h-px bg-white/10 my-2 mx-2"></div>

                {/* Links */}
                <button
                    onClick={() => {
                        onCloseMenu();
                        onOpenLanguage();
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left"
                >
                    <Globe size={18} />
                    <span className="text-sm">切換語系</span>
                </button>
                <button
                    onClick={() => {
                        onCloseMenu();
                        onOpenLegal();
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left"
                >
                    <FileText size={18} />
                    <span className="text-sm">使用者規章</span>
                </button>
                <button
                    onClick={() => {
                        onCloseMenu();
                        openModal('blacklist');
                    }}
                    className="w-full px-4 py-3 flex items-center justify-between text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left"
                >
                    <span className="flex items-center gap-3">
                        <Ban size={18} />
                        <span className="text-sm">黑名單管理</span>
                    </span>
                    {blockedPlayers.length > 0 && (
                        <span className="min-w-5 rounded-full bg-red-500/20 px-2 py-0.5 text-center text-[10px] font-black text-red-200">
                            {blockedPlayers.length}
                        </span>
                    )}
                </button>

                <div className="h-px bg-white/10 my-2 mx-2"></div>

                {/* Logout */}
                <button
                    onClick={() => {
                        onCloseMenu();
                        logout();
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors text-left mb-2"
                >
                    <LogOut size={18} />
                    <span className="text-sm font-bold">登出帳號</span>
                </button>
            </div>
        </div>
    );
};

export default SettingsMenu;
