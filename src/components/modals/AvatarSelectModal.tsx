import { useState } from 'react';
import { X, Lock, ImageIcon, Layers } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { AVATARS } from '../../data/mockData';

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

    return (
        <div className="juheng-modal-backdrop absolute inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
            <div className="juheng-modal-panel w-[480px] bg-[#1a0b2e] border border-white/20 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-200 flex flex-col overflow-hidden">

                {/* ── Header ── */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <h3 className="text-lg font-bold text-white tracking-wide">選擇頭像</h3>
                    <button
                        aria-label="關閉"
                        onClick={onClose}
                        className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* ── Tabs ── */}
                <div className="flex border-b border-white/10">
                    {([
                        { id: 'avatar' as Tab, label: '頭像',   Icon: ImageIcon },
                        { id: 'frame'  as Tab, label: '頭像框', Icon: Layers    },
                    ] as const).map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-all ${
                                activeTab === id
                                    ? 'text-[#FFD700] border-b-2 border-[#FFD700] bg-white/5'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Icon size={15} />
                            {label}
                        </button>
                    ))}
                </div>

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
                <div className="px-5 pb-5 pt-3 border-t border-white/10">
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges || activeTab === 'frame'}
                        className={`w-full py-3 rounded-xl font-black text-base tracking-wide transition-all ${
                            hasChanges && activeTab !== 'frame'
                                ? 'bg-gradient-to-r from-[#FFD700] to-[#DAA520] text-black hover:brightness-110 active:scale-95 shadow-lg'
                                : 'bg-white/10 text-slate-500 cursor-not-allowed'
                        }`}
                    >
                        儲存
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AvatarSelectModal;
