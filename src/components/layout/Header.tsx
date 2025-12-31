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
    const { openModal } = useUI();
    const { navigate } = useNavigation();

    return (
        <header className="absolute top-0 left-0 right-0 h-[88px] flex justify-between items-center px-6 z-40 bg-gradient-to-b from-black/90 to-transparent pointer-events-none">

            {/* Left: User Info */}
            <div
                onClick={onOpenUserModal}
                className="pointer-events-auto flex items-center gap-4 w-[350px] cursor-pointer hover:brightness-110 transition-all"
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
                    <span className="text-white font-bold text-lg drop-shadow-md tracking-wide truncate max-w-[200px]">
                        {user?.name || 'Loading...'}
                    </span>
                    <span className="text-[#FFD700] text-sm font-mono font-bold">VIP {user?.vipLevel || 0}</span>
                </div>
            </div>

            {/* Center: BUY & SALE Buttons */}
            <div className="pointer-events-auto flex items-center gap-6 transform translate-y-2">
                <ActionButton label="BUY" type="buy" onClick={() => navigate('bank')} />
                <ActionButton label="SALE" type="sale" onClick={() => openModal('sale')} />
            </div>

            {/* Right: Currency & Menu */}
            <div className="pointer-events-auto flex items-center justify-end gap-4 w-[350px]">
                <div
                    className="bg-black/60 border border-[#FFD700]/50 rounded-full px-4 py-1.5 flex items-center gap-3 shadow-lg select-none z-[100]"
                >
                    <Coins className="text-[#FFD700] fill-current" size={20} />
                    <span className="text-white font-mono font-bold text-xl tracking-wide">
                        {user?.balance.toLocaleString() || '0'}
                    </span>
                </div>

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
