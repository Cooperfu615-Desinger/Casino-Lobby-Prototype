import { useState, type ReactNode } from 'react';
import {
    CheckCircle2,
    Crown,
    Link2,
    Phone,
    ScrollText,
    UserCircle2,
    UserRound,
} from 'lucide-react';
import { useAuth, type User } from '../../context/AuthContext';
import LobbyModalShell from '../common/LobbyModalShell';
import { LobbyModalTabs } from '../common/LobbyModalPrimitives';
import PlayerSummaryPanel from '../profile/PlayerSummaryPanel';
import PersonalProfilePanel from '../profile/PersonalProfilePanel';
import VipLevelPanel from '../profile/VipLevelPanel';
import GameRecordsPanel from '../profile/GameRecordsPanel';
import AvatarSelectModal from './AvatarSelectModal';

interface UserModalProps {
    onClose: () => void;
}

type PlayerProfileTab = 'profile' | 'bindings' | 'vip' | 'history';

const UserModal = ({ onClose }: UserModalProps) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<PlayerProfileTab>('profile');
    const [showAvatarSelect, setShowAvatarSelect] = useState(false);

    if (!user) return null;

    const tabs = [
        { id: 'profile' as const, label: '個人資料', icon: <UserRound size={15} /> },
        { id: 'bindings' as const, label: '帳號綁定', icon: <Link2 size={15} /> },
        { id: 'vip' as const, label: 'VIP 等級', icon: <Crown size={15} /> },
        { id: 'history' as const, label: '遊戲紀錄', icon: <ScrollText size={15} /> },
    ];

    return (
        <LobbyModalShell
            title="玩家資料"
            eyebrow="PLAYER PROFILE"
            icon={<UserCircle2 size={21} />}
            onClose={onClose}
            closeLabel="關閉玩家資料"
            frameClassName="h-[min(700px,94vh)] w-[96%] max-w-[1040px]"
            bodyClassName="p-0 overflow-hidden"
            headerContent={(
                <LobbyModalTabs
                    items={tabs}
                    value={activeTab}
                    onChange={setActiveTab}
                    ariaLabel="玩家資料分類"
                    className="lobby-profile-tabs"
                />
            )}
        >
            <div className="relative flex h-full min-h-0">
                <PlayerSummaryPanel user={user} onSelectAvatar={() => setShowAvatarSelect(true)} />

                <main className="lobby-profile-main relative min-w-0 flex-1 overflow-hidden p-5">
                    {activeTab === 'profile' && <PersonalProfilePanel />}
                    {activeTab === 'bindings' && <BindingFoundationView user={user} />}
                    {activeTab === 'vip' && <VipLevelPanel />}
                    {activeTab === 'history' && <GameRecordsPanel onBack={() => setActiveTab('profile')} />}
                </main>

                {showAvatarSelect && <AvatarSelectModal onClose={() => setShowAvatarSelect(false)} />}
            </div>
        </LobbyModalShell>
    );
};

const BindingFoundationView = ({ user }: { user: User }) => (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto pr-1 custom-scrollbar">
        <div>
            <p className="text-[9px] font-black tracking-[0.22em] text-white/55">ACCOUNT SECURITY</p>
            <h3 className="mt-1 text-xl font-black text-white">帳號綁定</h3>
            <p className="mt-1 text-xs leading-5 text-white/58">此頁只保留手機號碼與 Google；綁定操作會在第三階段接入。</p>
        </div>

        <div className="mt-5 grid gap-3">
            <BindingStatusCard
                icon={<Phone size={21} />}
                title="手機號碼"
                description={user.phoneNumber || '綁定台灣手機號碼，提升帳號安全性。'}
                bound={user.bindings.phone}
            />
            <BindingStatusCard
                icon={<span className="text-lg font-black">G</span>}
                title="Google"
                description="連結 Google 帳號，日後可快速登入。"
                bound={user.bindings.google}
            />
        </div>
    </div>
);

const BindingStatusCard = ({
    icon,
    title,
    description,
    bound,
}: {
    icon: ReactNode;
    title: string;
    description: string;
    bound: boolean;
}) => (
    <article className="flex items-center gap-4 rounded-2xl border border-white/15 bg-[#263990]/24 p-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/18 bg-white/12 text-white">{icon}</span>
        <div className="min-w-0 flex-1">
            <h4 className="text-sm font-black text-white">{title}</h4>
            <p className="mt-1 truncate text-xs text-white/56">{description}</p>
        </div>
        <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-black ${bound ? 'border-emerald-200/35 bg-emerald-400/16 text-emerald-100' : 'border-white/18 bg-white/8 text-white/52'}`}>
            {bound && <CheckCircle2 size={12} />}
            {bound ? '已綁定' : '未綁定'}
        </span>
    </article>
);

export default UserModal;
