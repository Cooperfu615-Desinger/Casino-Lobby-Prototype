import { Menu, Crown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ActionButton from '../common/ActionButton';
import { useUI } from '../../context/UIContext';
import { useNavigation } from '../../hooks/useNavigation';
import AvatarDisplay from '../common/AvatarDisplay';
import WalletBalances from '../common/WalletBalances';

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

            {/* Left Section: User Info */}
            <div className="flex items-center gap-6 pointer-events-auto z-50">
                {/* User Info (Clickable) */}
                <button
                    type="button"
                    aria-label="開啟玩家資料"
                    onClick={onOpenUserModal}
                    className="flex items-center gap-4 cursor-pointer hover:brightness-110 transition-all shrink-0"
                >
                    <div className="relative group">
                        <div className="w-16 h-16 rounded-full border-2 border-[#FFD700] overflow-hidden bg-slate-800 shadow-[0_0_15px_#FFD700]">
                            <AvatarDisplay avatarId={user?.avatarId} size="sm" />
                        </div>
                        <div className="absolute -top-2 -right-1 bg-gradient-to-b from-[#FFD700] to-[#DAA520] p-1.5 rounded-full shadow-sm border border-white/30">
                            <Crown size={14} className="text-black fill-current" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-white font-bold text-lg drop-shadow-md tracking-wide truncate max-w-[150px]">
                            {user?.name || 'Loading...'}
                        </span>
                        <span className="text-[#FFD700] text-sm font-mono font-bold">VIP {user?.vipLevel || 0}</span>
                    </div>
                </button>

            </div>

            {/* Center: BUY & SALE Buttons (Absolutely Positioned) */}
            <div className="pointer-events-auto absolute left-1/2 -translate-x-1/2 flex items-center gap-6 transform translate-y-2 z-40">
                <ActionButton label="BUY" type="buy" onClick={() => navigate('bank')} />
                <ActionButton label="SALE" type="sale" onClick={() => openModal('promotion', { startIndex: 0 })} />
            </div>

            {/* Right: Wallets + Settings */}
            <div className="pointer-events-auto flex w-[430px] items-center justify-end gap-3 z-50">
                <button
                    type="button"
                    onClick={() => navigate('bank')}
                    aria-label="開啟銀行中心"
                    className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/45 p-2 shadow-lg transition-all hover:border-[#FFD700]/40 hover:bg-black/60 active:scale-[0.99]"
                >
                    <WalletBalances
                        balance={user?.balance}
                        variant="compact"
                        isAnimating={isBalanceAnimating}
                    />
                </button>

                <button
                    onClick={onOpenSettings}
                    title="Settings"
                    aria-label="開啟設定選單"
                    className={`bg-black/40 p-2.5 rounded-xl border border-white/10 hover:bg-white/10 active:scale-95 transition-colors ${isSettingsOpen ? 'bg-white/20 border-white/30 text-white' : 'text-slate-200'}`}
                >
                    <Menu size={28} />
                </button>
            </div>
        </header>
    );
};

export default Header;
