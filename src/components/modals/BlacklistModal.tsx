import { Ban, Clock3, Hash, ShieldCheck, Unlock, UserX } from 'lucide-react';
import { useSocial, type BlockedPlayer } from '../../context/SocialContext';
import { useUI } from '../../context/UIContext';
import LobbyModalShell from '../common/LobbyModalShell';

interface BlacklistModalProps {
    onClose: () => void;
}

const formatBlockedAt = (blockedAt: number) =>
    new Intl.DateTimeFormat('zh-TW', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).format(blockedAt);

const BlacklistModal = ({ onClose }: BlacklistModalProps) => {
    const { blockedPlayers, unblockPlayer } = useSocial();
    const { showToast } = useUI();

    const handleUnblock = (player: BlockedPlayer) => {
        unblockPlayer(player.playerId);
        showToast(`已將 ${player.name} 移出黑名單`, 'success');
    };

    return (
        <LobbyModalShell
            title="黑名單管理"
            eyebrow="SAFETY & PRIVACY"
            icon={<Ban size={21} />}
            onClose={onClose}
            closeLabel="關閉黑名單管理"
            layerClassName="z-[200]"
            frameClassName="h-[min(620px,90vh)] w-[94%] max-w-[780px]"
            bodyClassName="p-5"
            headerContent={(
                <div className="flex items-center justify-between gap-4 text-xs font-bold text-slate-300">
                    <span>已封鎖玩家無法私訊，也無法查看個人資料</span>
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-white">{blockedPlayers.length} 位玩家</span>
                </div>
            )}
        >
                <main className="relative h-full min-h-0">
                    {blockedPlayers.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-300/25 bg-emerald-400/10 text-emerald-200">
                                <ShieldCheck size={30} />
                            </div>
                            <h3 className="text-lg font-black text-white">目前沒有黑名單玩家</h3>
                            <p className="mt-2 max-w-[360px] text-sm leading-relaxed text-slate-400">
                                從聊天玩家資訊彈窗加入黑名單後，玩家會顯示在這裡並可隨時解除封鎖。
                            </p>
                        </div>
                    ) : (
                        <div className="h-full overflow-y-auto pr-1">
                            <div className="space-y-3">
                                {blockedPlayers.map((player) => (
                                    <BlockedPlayerRow
                                        key={player.playerId}
                                        player={player}
                                        onUnblock={() => handleUnblock(player)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </main>
        </LobbyModalShell>
    );
};

interface BlockedPlayerRowProps {
    player: BlockedPlayer;
    onUnblock: () => void;
}

const BlockedPlayerRow = ({ player, onUnblock }: BlockedPlayerRowProps) => (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4 transition-colors hover:border-red-300/30 hover:bg-white/[0.07]">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${player.avatar || 'bg-slate-700'} border border-white/15 shadow-[0_0_20px_rgba(0,0,0,0.24)]`}>
            <span className="text-xl font-black text-white">{player.name.charAt(0).toUpperCase()}</span>
        </div>

        <div className="min-w-0">
            <div className="flex items-center gap-2">
                <h3 className="truncate text-base font-black text-white">{player.name}</h3>
                <span className="rounded-full border border-red-300/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-black text-red-200">
                    已封鎖
                </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1">
                    <Hash size={12} className="text-[#FFD700]" />
                    {player.playerId}
                </span>
                <span className="flex items-center gap-1">
                    <Clock3 size={12} className="text-slate-500" />
                    {formatBlockedAt(player.blockedAt)}
                </span>
                <span className="flex items-center gap-1 text-red-200/80">
                    <UserX size={12} />
                    私訊與資料查看已停用
                </span>
            </div>
        </div>

        <button
            type="button"
            onClick={onUnblock}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-emerald-300/30 bg-emerald-400/10 px-4 text-xs font-black text-emerald-100 transition-all hover:border-emerald-200 hover:bg-emerald-400/20 active:scale-95"
        >
            <Unlock size={15} />
            解除封鎖
        </button>
    </div>
);

export default BlacklistModal;
