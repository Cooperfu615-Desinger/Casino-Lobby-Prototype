import { useState } from 'react';
import { createPortal } from 'react-dom';
import { UserCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LobbyModalShell from '../common/LobbyModalShell';
import { LobbyModalTabs } from '../common/LobbyModalPrimitives';
import PlayerSummaryPanel from '../profile/PlayerSummaryPanel';
import PersonalProfilePanel from '../profile/PersonalProfilePanel';
import AccountBindingPanel from '../profile/AccountBindingPanel';
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
        { id: 'profile' as const, label: '個人資料' },
        { id: 'bindings' as const, label: '帳號綁定' },
        { id: 'vip' as const, label: 'VIP 等級' },
        { id: 'history' as const, label: '遊戲紀錄' },
    ];

    return (
        <LobbyModalShell
            title="玩家資料"
            eyebrow="PLAYER PROFILE"
            icon={<UserCircle2 size={21} />}
            onClose={onClose}
            closeLabel="關閉玩家資料"
            frameClassName="h-[min(700px,94vh)] w-[96%] max-w-[1040px]"
            bodyClassName="p-0 !overflow-clip"
        >
            <div className="relative flex h-full min-h-0">
                <PlayerSummaryPanel user={user} onSelectAvatar={() => setShowAvatarSelect(true)} />

                <main className="lobby-profile-main relative flex min-w-0 flex-1 flex-col overflow-hidden p-5">
                    <LobbyModalTabs
                        items={tabs}
                        value={activeTab}
                        onChange={setActiveTab}
                        ariaLabel="玩家資料分類"
                        className="lobby-profile-tabs lobby-profile-tabs--content"
                    />

                    <div className="min-h-0 flex-1 overflow-hidden">
                        {activeTab === 'profile' && <PersonalProfilePanel />}
                        {activeTab === 'bindings' && <AccountBindingPanel />}
                        {activeTab === 'vip' && <VipLevelPanel />}
                        {activeTab === 'history' && <GameRecordsPanel />}
                    </div>
                </main>

                {showAvatarSelect && createPortal(
                    <AvatarSelectModal onClose={() => setShowAvatarSelect(false)} />,
                    document.body,
                )}
            </div>
        </LobbyModalShell>
    );
};

export default UserModal;
