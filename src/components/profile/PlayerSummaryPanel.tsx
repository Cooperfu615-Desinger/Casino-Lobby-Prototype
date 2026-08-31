import { AtSign, Crown, Hash, Pencil } from 'lucide-react';
import type { ReactNode } from 'react';
import type { User } from '../../context/AuthContext';
import AvatarDisplay from '../common/AvatarDisplay';
import WalletBalances from '../common/WalletBalances';

interface PlayerSummaryPanelProps {
    user: User;
    onSelectAvatar: () => void;
}

/** Persistent identity summary shared by every player-profile tab. */
const PlayerSummaryPanel = ({ user, onSelectAvatar }: PlayerSummaryPanelProps) => (
    <aside className="lobby-profile-sidebar flex h-full min-h-0 w-[280px] shrink-0 flex-col border-r border-white/12 p-5">
        <div className="flex flex-col items-center text-center">
            <div className="group relative">
                <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white/75 bg-slate-800 p-1 shadow-[0_0_28px_rgba(255,255,255,0.2)]">
                    <AvatarDisplay avatarId={user.avatarId} size="lg" />
                </div>
                <button
                    type="button"
                    aria-label="更換頭像"
                    onClick={onSelectAvatar}
                    className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/55 bg-gradient-to-br from-[#8ea6ff] to-[#5261d9] text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                    <Pencil size={15} />
                </button>
            </div>

            <h3 className="mt-3 max-w-full truncate text-lg font-black text-white">{user.name}</h3>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-white/22 bg-white/12 px-3 py-1 text-[10px] font-black text-white">
                <Crown size={12} />
                VIP {user.vipLevel}
            </div>
        </div>

        <div className="mt-5 space-y-2">
            <SummaryIdentityRow icon={<AtSign size={14} />} label="帳號" value={user.account} />
            <SummaryIdentityRow icon={<Hash size={14} />} label="ID" value={user.id} />
        </div>

        <section className="mt-4 rounded-2xl border border-white/15 bg-[#263990]/24 p-3">
            <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-black text-white">錢包餘額</span>
                <span className="text-[9px] font-bold text-white/52">金・銀・銅</span>
            </div>
            <WalletBalances balance={user.balance} variant="cards" />
        </section>

        <p className="mt-auto pt-4 text-center text-[9px] leading-4 text-white/45">
            個人與綁定資料會隨登入狀態保存；金融 Mock 重新整理後重置。
        </p>
    </aside>
);

const SummaryIdentityRow = ({ icon, label, value }: { icon: ReactNode; label: string; value: string }) => (
    <div className="flex items-center gap-2 rounded-xl border border-white/12 bg-white/8 px-3 py-2.5">
        <span className="text-white/70">{icon}</span>
        <span className="w-9 shrink-0 text-[10px] font-black text-white/52">{label}</span>
        <strong className="min-w-0 flex-1 truncate text-right text-[11px] text-white">{value}</strong>
    </div>
);

export default PlayerSummaryPanel;
