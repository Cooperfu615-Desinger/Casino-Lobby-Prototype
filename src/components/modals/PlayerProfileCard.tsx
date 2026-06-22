import { useState, type ReactNode } from 'react';
import { Ban, Coins, Flag, Gamepad2, Gift, Hash, MessageCircle, ShieldAlert, Sparkles, UserPlus, X } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useNavigation } from '../../hooks/useNavigation';
import { useSocial } from '../../context/SocialContext';
import type { PlayerProfile } from '../../types/user';

interface PlayerProfileCardProps {
    profile: PlayerProfile;
    onClose: () => void;
}

const PlayerProfileCard = ({ profile, onClose }: PlayerProfileCardProps) => {
    const { openModal, showToast } = useUI();
    const { navigate } = useNavigation();
    const { blockPlayer, isBlockedPlayer } = useSocial();
    const [isFriend, setIsFriend] = useState(profile.isFriend);
    const [showBlockConfirm, setShowBlockConfirm] = useState(false);

    const playerIdentity = {
        playerId: profile.playerId,
        name: profile.name,
        avatar: profile.avatar,
        level: profile.level,
        isFriend,
    };

    const isBlocked = isBlockedPlayer(profile.playerId);

    const handleAddFriend = () => {
        setIsFriend(true);
        showToast(`已送出 ${profile.name} 的好友邀請`, 'success');
    };

    const handleOpenPrivateChat = () => {
        if (isBlocked) {
            showToast('已封鎖的玩家無法私訊', 'error');
            return;
        }

        onClose();
        navigate('chat', { chatTab: 'chat', chatTarget: playerIdentity });
    };

    const handleGiftOrTransfer = () => {
        onClose();
        openModal('bank', { initialTab: 'gifts', receiverId: profile.playerId });
    };

    const handleReport = () => {
        onClose();
        navigate('chat', {
            chatTab: 'support',
            supportDraft: {
                title: `檢舉：${profile.name} #${profile.playerId}`,
                targetPlayer: playerIdentity,
            },
        });
    };

    const handleBlockPlayer = () => {
        blockPlayer({
            playerId: profile.playerId,
            name: profile.name,
            avatar: profile.avatar,
        });
        showToast(`已將 ${profile.name} 加入黑名單`, 'success');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative grid h-[560px] w-[720px] grid-cols-[250px_1fr] overflow-hidden rounded-2xl border border-white/15 bg-[#10051f] shadow-[0_24px_80px_rgba(0,0,0,0.65)] animate-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    aria-label="關閉玩家資訊"
                    onClick={onClose}
                    className="absolute right-4 top-4 z-20 rounded-full bg-black/40 p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                >
                    <X size={20} />
                </button>

                <aside className="relative flex flex-col justify-between overflow-hidden border-r border-white/10 bg-gradient-to-b from-[#2a1244] via-[#1a0b2e] to-[#0a0314] p-5">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,215,0,0.15),_transparent_36%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.18),_transparent_42%)]" />

                    <div className="relative">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#FFD700]/25 bg-[#FFD700]/10 px-3 py-1 text-[11px] font-black text-[#FFD700]">
                            <Sparkles size={12} />
                            PLAYER CARD
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <div className={`relative flex h-28 w-28 items-center justify-center rounded-full ${profile.avatar || 'bg-slate-700'} border-4 border-[#10051f] shadow-[0_0_34px_rgba(255,215,0,0.16)]`}>
                                <span className="text-4xl font-black text-white">{profile.name.charAt(0).toUpperCase()}</span>
                                <div className="absolute -bottom-2 rounded-full border border-yellow-200 bg-gradient-to-r from-[#FFD700] to-[#B8860B] px-3 py-1 text-[11px] font-black text-black shadow-md">
                                    VIP {profile.vipLevel ?? 1}
                                </div>
                            </div>

                            <h2 className="mt-6 max-w-full truncate text-2xl font-black text-white">{profile.name}</h2>
                            <div className="mt-2 flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs font-bold text-slate-300">
                                <Hash size={12} className="text-[#FFD700]" />
                                {profile.playerId}
                            </div>
                            <div className="mt-2 text-xs font-black text-[#FFD700]">Level {profile.level}</div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleOpenPrivateChat}
                        disabled={isBlocked}
                        className={`relative flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-black transition-all ${isBlocked
                            ? 'cursor-not-allowed border border-slate-700 bg-slate-800 text-slate-500'
                            : 'bg-gradient-to-r from-[#FFD700] to-[#DAA520] text-black shadow-[0_0_22px_rgba(255,215,0,0.26)] hover:brightness-110 active:scale-95'
                            }`}
                    >
                        <MessageCircle size={18} />
                        聊天
                    </button>
                </aside>

                <main className="relative flex min-w-0 flex-col p-6 pr-8">
                    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <div className="mb-2 flex items-center justify-between">
                            <h3 className="text-sm font-black text-white">玩家簡述</h3>
                            {isBlocked && (
                                <span className="rounded-full border border-red-400/30 bg-red-500/10 px-2 py-1 text-[10px] font-black text-red-300">
                                    已封鎖
                                </span>
                            )}
                        </div>
                        <p className="line-clamp-2 text-sm leading-relaxed text-slate-300">{profile.bio}</p>
                    </section>

                    <section className="mt-4">
                        <h3 className="mb-3 flex items-center gap-2 text-xs font-black text-white">
                            <Gamepad2 size={14} className="text-[#FFD700]" />
                            最近遊玩
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            {profile.recentGames?.map((game: { id: number; name: string; image: string }, idx: number) => (
                                <div key={idx} className="group min-w-0 overflow-hidden rounded-xl border border-white/10 bg-black/20 transition-colors hover:border-[#FFD700]/60">
                                    <div className={`relative h-20 ${game.image}`}>
                                        <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-transparent" />
                                    </div>
                                    <div className="truncate px-2 py-2 text-center text-[11px] font-bold text-slate-300 group-hover:text-[#FFD700]">{game.name}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mt-auto">
                        <div className="mb-3 text-xs font-black text-slate-400">社交操作</div>
                        <div className="grid grid-cols-3 gap-3">
                            <ProfileActionButton
                                icon={<UserPlus size={18} />}
                                label={isFriend ? '已是好友' : '加好友'}
                                disabled={isFriend}
                                onClick={handleAddFriend}
                            />
                            <ProfileActionButton
                                icon={<Gift size={18} />}
                                label="贈禮"
                                tone="pink"
                                onClick={handleGiftOrTransfer}
                            />
                            <ProfileActionButton
                                icon={<Coins size={18} />}
                                label="轉點"
                                tone="gold"
                                onClick={handleGiftOrTransfer}
                            />
                        </div>

                        <div className="mt-4 rounded-2xl border border-red-400/15 bg-red-950/10 p-3">
                            <div className="mb-2 flex items-center gap-2 text-xs font-black text-red-200">
                                <ShieldAlert size={14} />
                                安全操作
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowBlockConfirm(true)}
                                    disabled={isBlocked}
                                    className={`flex h-10 items-center justify-center gap-2 rounded-xl border text-xs font-black transition-all ${isBlocked
                                        ? 'cursor-not-allowed border-slate-700 bg-slate-800 text-slate-500'
                                        : 'border-red-400/30 bg-red-500/10 text-red-200 hover:border-red-300 hover:bg-red-500/20 active:scale-95'
                                        }`}
                                >
                                    <Ban size={15} />
                                    {isBlocked ? '已封鎖' : '黑名單'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReport}
                                    className="flex h-10 items-center justify-center gap-2 rounded-xl border border-orange-300/30 bg-orange-400/10 text-xs font-black text-orange-100 transition-all hover:border-orange-200 hover:bg-orange-400/20 active:scale-95"
                                >
                                    <Flag size={15} />
                                    檢舉
                                </button>
                            </div>
                        </div>
                    </section>
                </main>

                {showBlockConfirm && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
                        <div className="w-[360px] rounded-2xl border border-red-400/30 bg-[#1a0b2e] p-5 text-center shadow-2xl animate-in zoom-in-95 duration-150">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/15 text-red-300">
                                <Ban size={24} />
                            </div>
                            <h3 className="text-lg font-black text-white">加入黑名單？</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-300">
                                加入後將無法私訊 {profile.name}，也無法查看此玩家個人資料。公共頻道訊息暫不隱藏。
                            </p>
                            <div className="mt-5 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowBlockConfirm(false)}
                                    className="flex-1 rounded-xl bg-white/8 py-3 text-sm font-black text-slate-300 transition-colors hover:bg-white/12"
                                >
                                    取消
                                </button>
                                <button
                                    type="button"
                                    onClick={handleBlockPlayer}
                                    className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-black text-white transition-colors hover:bg-red-400 active:scale-95"
                                >
                                    確認封鎖
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

interface ProfileActionButtonProps {
    icon: ReactNode;
    label: string;
    disabled?: boolean;
    tone?: 'default' | 'gold' | 'pink';
    onClick: () => void;
}

const ProfileActionButton = ({ icon, label, disabled = false, tone = 'default', onClick }: ProfileActionButtonProps) => {
    const toneClass = {
        default: 'border-white/15 bg-white/8 text-white hover:border-white/30 hover:bg-white/12',
        gold: 'border-[#FFD700]/30 bg-[#FFD700]/10 text-[#FFD700] hover:border-[#FFD700]/70 hover:bg-[#FFD700]/20',
        pink: 'border-pink-400/30 bg-pink-500/10 text-pink-200 hover:border-pink-300 hover:bg-pink-500/20',
    }[tone];

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`flex h-16 flex-col items-center justify-center gap-1 rounded-xl border text-xs font-black transition-all ${disabled
                ? 'cursor-not-allowed border-slate-700 bg-slate-800 text-slate-500'
                : `${toneClass} active:scale-95`
                }`}
        >
            {icon}
            {label}
        </button>
    );
};

export default PlayerProfileCard;
