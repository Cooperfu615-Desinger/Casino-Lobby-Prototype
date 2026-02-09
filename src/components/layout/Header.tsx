import { Menu, Crown, User as UserIcon, Coins } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ActionButton from '../common/ActionButton';
import { useUI } from '../../context/UIContext';
import { useNavigation } from '../../hooks/useNavigation';

interface HeaderProps {
    onOpenUserModal: () => void;
    onOpenSettings: () => void;
    isSettingsOpen: boolean;
}

const Header = ({ onOpenUserModal, onOpenSettings, isSettingsOpen }: HeaderProps) => {
    const { user } = useAuth();
    const { openModal, isBalanceAnimating } = useUI();
    const { navigate } = useNavigation();

    return (
        <header className="absolute top-0 left-0 right-0 h-[88px] flex justify-between items-center px-6 z-40 bg-gradient-to-b from-black/90 to-transparent pointer-events-none">

            {/* Left Section: User Info + Wallet */}
            <div className="flex items-center gap-6 pointer-events-auto z-50">
                {/* User Info (Clickable) */}
                <div
                    onClick={onOpenUserModal}
                    className="flex items-center gap-4 cursor-pointer hover:brightness-110 transition-all shrink-0"
                >
                    <div className="relative group">
                        <div className="w-16 h-16 rounded-full border-2 border-[#FFD700] overflow-hidden bg-slate-800 shadow-[0_0_15px_#FFD700]">
                            <div className={`w-full h-full ${user?.avatar || 'bg-slate-600'} flex items-center justify-center`}>
                                <UserIcon className="text-white" size={36} />
                            </div>
                        </div>
                        <div className="absolute -top-2 -right-1 bg-gradient-to-b from-[#FFD700] to-[#DAA520] p-1.5 rounded-full shadow-sm border border-white/30">
                            <Crown size={14} className="text-black fill-current" />
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 bg-black/80 rounded-full border border-white/10 p-0.5">
                            <div className="h-2 w-3/4 bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-[0_0_5px_#00ff00]"></div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-white font-bold text-lg drop-shadow-md tracking-wide truncate max-w-[150px]">
                            {user?.name || 'Loading...'}
                        </span>
                        <span className="text-[#FFD700] text-sm font-mono font-bold">VIP {user?.vipLevel || 0}</span>
                    </div>
                </div>

                {/* Wallet (Gold + Silver/Bronze) */}
                <div className="flex items-center gap-3">
                    {/* Silver & Bronze Stack */}
                    <div className="flex flex-col gap-1.5">
                        {/* Silver */}
                        <div className="bg-black/60 border border-slate-400/50 rounded-full px-3 py-1 flex items-center gap-2 shadow-md">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center text-[10px]">🥈</div>
                            <span className="text-white font-mono font-bold text-sm tracking-wide">
                                {user?.balance.silver.toLocaleString() || '0'}
                            </span>
                            <button
                                onClick={() => navigate('bank')}
                                className="w-5 h-5 rounded-full bg-slate-400/20 hover:bg-slate-400/40 flex items-center justify-center text-white text-xs font-bold transition-colors"
                                title="Add Silver"
                            >
                                +
                            </button>
                        </div>
                        {/* Bronze */}
                        <div className="bg-black/60 border border-amber-700/50 rounded-full px-3 py-1 flex items-center gap-2 shadow-md">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-[10px]">🥉</div>
                            <span className="text-white font-mono font-bold text-sm tracking-wide">
                                {user?.balance.bronze.toLocaleString() || '0'}
                            </span>
                            <button
                                onClick={() => navigate('bank')}
                                className="w-5 h-5 rounded-full bg-amber-700/20 hover:bg-amber-700/40 flex items-center justify-center text-white text-xs font-bold transition-colors"
                                title="Add Bronze"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Gold */}
                    <div
                        className={`bg-black/60 border border-[#FFD700]/50 rounded-full px-4 py-2 flex items-center gap-3 shadow-lg select-none transition-all ${isBalanceAnimating ? 'animate-pulse scale-105 border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.5)]' : ''}`}
                    >
                        <Coins className="text-[#FFD700] fill-current" size={22} />
                        <span className={`text-white font-mono font-bold text-xl tracking-wide transition-colors ${isBalanceAnimating ? 'text-[#FFD700]' : ''}`}>
                            {user?.balance.gold.toLocaleString() || '0'}
                        </span>
                        <button
                            onClick={() => navigate('bank')}
                            className="w-6 h-6 rounded-full bg-[#FFD700]/20 hover:bg-[#FFD700]/40 flex items-center justify-center text-white text-sm font-bold transition-colors"
                            title="Add Gold"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>

            {/* Center: BUY & SALE Buttons (Absolutely Positioned) */}
            <div className="pointer-events-auto absolute left-1/2 -translate-x-1/2 flex items-center gap-6 transform translate-y-2 z-40">
                <ActionButton label="BUY" type="buy" onClick={() => navigate('bank')} />
                <ActionButton label="SALE" type="sale" onClick={() => openModal('promotion', { startIndex: 0 })} />
            </div>

            {/* Right: Menu Only */}
            <div className="pointer-events-auto flex items-center justify-end z-50">
                <button
                    onClick={onOpenSettings}
                    title="Settings"
                    aria-label="Open settings menu"
                    className={`bg-black/40 p-2.5 rounded-xl border border-white/10 hover:bg-white/10 active:scale-95 transition-colors ${isSettingsOpen ? 'bg-white/20 border-white/30 text-white' : 'text-slate-200'}`}
                >
                    <Menu size={28} />
                </button>
            </div>
        </header>
    );
};

export default Header;
