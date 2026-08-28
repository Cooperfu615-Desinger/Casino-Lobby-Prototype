import { Ban, Clock3, Hash, ShieldCheck, Unlock, UserX, X } from 'lucide-react';
import { useSocial, type BlockedPlayer } from '../../context/SocialContext';
import { useUI } from '../../context/UIContext';

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
        <div className="juheng-modal-backdrop fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-6 backdrop-blur-md animate-in fade-in duration-200">
            <div className="juheng-modal-panel relative flex h-[520px] w-[720px] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#10051f] shadow-[0_24px_80px_rgba(0,0,0,0.68)] animate-in zoom-in-95 duration-200">
                <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,_rgba(239,68,68,0.26),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(255,215,0,0.13),_transparent_32%)]" />

                <header className="relative flex h-24 items-center justify-between border-b border-white/10 px-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-300/25 bg-red-500/15 text-red-200">
                            <Ban size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white">黑名單管理</h2>
                            <p className="mt-1 text-xs font-bold text-slate-400">已封鎖玩家無法私訊，也無法查看個人資料</p>
                        </div>
                    </div>

                    <div className="mr-12 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black text-slate-200">
                        {blockedPlayers.length} 位玩家
                    </div>

                    <button
                        type="button"
                        aria-label="關閉黑名單管理"
                        onClick={onClose}
                        className="absolute right-4 top-4 rounded-full bg-black/35 p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </header>

                <main className="relative flex-1 min-h-0 p-5">
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
            </div>
        </div>
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
