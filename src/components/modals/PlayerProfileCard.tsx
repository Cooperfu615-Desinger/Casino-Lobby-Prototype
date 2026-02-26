import { useState } from 'react';
import { X, UserPlus, Gift, Coins } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { PlayerProfile } from '../../types/user';

interface PlayerProfileCardProps {
    profile: PlayerProfile;
    onClose: () => void;
}

const PlayerProfileCard = ({ profile, onClose }: PlayerProfileCardProps) => {
    const { openModal, closeModal } = useUI();
    const [isFriend, setIsFriend] = useState(profile.isFriend);

    const handleAddFriend = () => {
        setIsFriend(true);
        console.log(`Add friend: ${profile.name}`);
    };

    const handleGiftOrTransfer = () => {
        // Close current modals
        onClose();
        closeModal();
        // Force open bank modal at gift tab and pass receiver ID
        openModal('bank', { initialTab: 'gift', receiverId: profile.name });
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-[360px] bg-[#1a0b2e] border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center animate-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 bg-black/40 text-white hover:text-[#FFD700] p-1.5 rounded-full hover:bg-white/10 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Top Banner */}
                <div className="w-full h-24 bg-gradient-to-r from-purple-800 to-indigo-900 relative">
                    {/* Fake pattern overlay */}
                    <div className="absolute inset-0 opacity-10 blur-[1px]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                </div>

                {/* Avatar & VIP */}
                <div className="relative -mt-12 flex flex-col items-center">
                    <div className={`w-24 h-24 rounded-full ${profile.avatar || 'bg-slate-700'} flex items-center justify-center border-4 border-[#1a0b2e] shadow-lg relative`}>
                        <div className="text-white font-bold text-2xl">{profile.name.charAt(0).toUpperCase()}</div>
                    </div>
                    {/* VIP Badge */}
                    <div className="absolute bottom-0 bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-black text-[10px] font-bold px-2 py-0.5 rounded-full border border-yellow-200 shadow-md">
                        VIP {profile.vipLevel || 1}
                    </div>
                </div>

                {/* Info Container */}
                <div className="w-full px-6 pt-3 pb-6 flex flex-col items-center">
                    {/* Name & ID */}
                    <h2 className="text-white text-xl font-bold">{profile.name}</h2>
                    <span className="text-slate-400 text-xs mt-0.5">ID: {Math.floor(Math.random() * 10000) + 10000}</span>
                    <span className="text-[#FFD700] text-xs font-semibold mt-1">Level {profile.level}</span>

                    {/* Bio */}
                    <div className="mt-4 p-3 bg-white/5 rounded-lg w-full text-center border border-white/10">
                        <p className="text-sm text-slate-300 italic">"{profile.bio}"</p>
                    </div>

                    {/* Recent Games */}
                    <div className="w-full mt-5">
                        <h3 className="text-white text-xs font-bold mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                            最近遊玩
                        </h3>
                        <div className="flex gap-2 w-full justify-between">
                            {profile.recentGames?.map((game: { id: number; name: string; image: string }, idx: number) => (
                                <div key={idx} className="flex flex-col items-center group cursor-pointer w-[30%]">
                                    <div className={`w-full aspect-square rounded-lg ${game.image} flex items-center justify-center border border-white/10 group-hover:border-[#FFD700] transition-colors shadow-md overflow-hidden relative`}>
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                        <span className="text-2xl drop-shadow-md">{/* Fake icon based on image colour / name */}</span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 mt-1.5 truncate text-center w-full group-hover:text-[#FFD700] transition-colors">{game.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full flex gap-2 mt-6">
                        <button
                            onClick={handleAddFriend}
                            disabled={isFriend}
                            className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-lg border transition-all ${isFriend
                                ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed grayscale'
                                : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-[#FFD700]'
                                }`}
                        >
                            <UserPlus size={18} className="mb-1" />
                            <span className="text-[10px] font-bold">{isFriend ? '已是好友' : '加好友'}</span>
                        </button>

                        <button
                            title="贈禮"
                            onClick={handleGiftOrTransfer}
                            className="flex-1 flex flex-col items-center justify-center py-2.5 rounded-lg bg-gradient-to-b from-pink-500/20 to-pink-600/20 border border-pink-500/30 text-pink-400 hover:from-pink-500/40 hover:to-pink-600/40 hover:border-pink-400 hover:text-pink-300 transition-all shadow-[0_0_10px_rgba(236,72,153,0.1)]"
                        >
                            <Gift size={18} className="mb-1" />
                            <span className="text-[10px] font-bold">贈禮</span>
                        </button>

                        <button
                            title="轉點"
                            onClick={handleGiftOrTransfer}
                            className="flex-1 flex flex-col items-center justify-center py-2.5 rounded-lg bg-gradient-to-b from-[#FFD700]/10 to-[#DAA520]/10 border border-[#FFD700]/30 text-[#FFD700] hover:from-[#FFD700]/30 hover:to-[#DAA520]/30 hover:border-[#FFD700] hover:text-[#FFE55C] transition-all shadow-[0_0_10px_rgba(255,215,0,0.1)]"
                        >
                            <Coins size={18} className="mb-1" />
                            <span className="text-[10px] font-bold">轉點</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerProfileCard;
