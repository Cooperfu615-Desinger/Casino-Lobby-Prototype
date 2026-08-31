import { useState } from 'react';
import { Lock, ImageIcon, Layers } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { AVATARS } from '../../data/mockData';
import LobbyModalShell from '../common/LobbyModalShell';
import { LobbyModalButton, LobbyModalTabs } from '../common/LobbyModalPrimitives';

interface AvatarSelectModalProps {
    onClose: () => void;
}

type Tab = 'avatar' | 'frame';

const AvatarSelectModal = ({ onClose }: AvatarSelectModalProps) => {
    const { user, updateAvatar } = useAuth();
    const { showToast } = useUI();

    const [activeTab, setActiveTab] = useState<Tab>('avatar');
    const [tempAvatarId, setTempAvatarId] = useState<number>(user?.avatarId ?? 1);

    const handleSave = () => {
        updateAvatar(tempAvatarId);
        showToast('✅ 頭像已更新', 'success');
        onClose();
    };

    const hasChanges = tempAvatarId !== (user?.avatarId ?? 1);
    const tabs = [
        { id: 'avatar' as const, label: '頭像', icon: <ImageIcon size={15} /> },
        { id: 'frame' as const, label: '頭像框', icon: <Layers size={15} /> },
    ];

    return (
        <LobbyModalShell
            title="選擇頭像"
            eyebrow="PROFILE CUSTOMIZATION"
            icon={<ImageIcon size={20} />}
            onClose={onClose}
            closeLabel="關閉頭像選擇"
            layerClassName="z-[120]"
            frameClassName="h-[min(540px,88vh)] w-[94%] max-w-[520px]"
            bodyClassName="p-0"
            headerContent={<LobbyModalTabs items={tabs} value={activeTab} onChange={setActiveTab} ariaLabel="頭像設定分類" />}
        >
            <div className="flex min-h-full flex-col">

                {/* ── Content ── */}
                <div className="flex-1 p-5 min-h-[280px]">

                    {/* 頭像 Tab */}
                    {activeTab === 'avatar' && (
                        <div className="grid grid-cols-5 gap-3">
                            {AVATARS.map((av) => {
                                const isSelected = tempAvatarId === av.id;
                                const isLocked   = av.locked;

                                return (
                                    <div key={av.id} className="flex flex-col items-center gap-1.5">
                                        <button
                                            type="button"
                                            disabled={isLocked}
                                            onClick={() => !isLocked && setTempAvatarId(av.id)}
                                            className={`
                                                relative w-16 h-16 rounded-full transition-all duration-200
                                                ${isLocked
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : 'cursor-pointer hover:scale-110 active:scale-95'}
                                                ${isSelected && !isLocked
                                                    ? 'ring-[3px] ring-[#FFD700] shadow-[0_0_12px_rgba(255,215,0,0.5)]'
                                                    : 'ring-1 ring-white/10'}
                                            `}
                                        >
                                            {/* Avatar background + emoji */}
                                            <div className={`w-full h-full rounded-full ${av.bgClass} flex items-center justify-center`}>
                                                <span className="text-2xl" role="img" aria-label={av.label}>
                                                    {av.emoji}
                                                </span>
                                            </div>

                                            {/* Lock overlay */}
                                            {isLocked && (
                                                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                                                    <Lock size={16} className="text-white/60" />
                                                </div>
                                            )}

                                            {/* Selected checkmark */}
                                            {isSelected && !isLocked && (
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#FFD700] flex items-center justify-center shadow-md">
                                                    <span className="text-black text-[10px] font-black">✓</span>
                                                </div>
                                            )}
                                        </button>

                                        {/* Label / Unlock hint */}
                                        <span className={`text-[10px] font-medium leading-none text-center ${isLocked ? 'text-slate-500' : 'text-slate-300'}`}>
                                            {isLocked ? (av.unlockHint ?? '???') : av.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* 頭像框 Tab — Coming Soon */}
                    {activeTab === 'frame' && (
                        <div className="flex flex-col items-center justify-center h-full gap-4 py-10">
                            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                <Layers size={36} className="text-slate-500" />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-white font-bold text-lg">🚧 即將開放</p>
                                <p className="text-slate-400 text-sm">敬請期待更多個性化頭像框！</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Footer ── */}
                <div className="border-t border-white/10 px-5 pb-5 pt-3">
                    <LobbyModalButton
                        onClick={handleSave}
                        disabled={!hasChanges || activeTab === 'frame'}
                        fullWidth
                    >
                        儲存
                    </LobbyModalButton>
                </div>
            </div>
        </LobbyModalShell>
    );
};

export default AvatarSelectModal;
