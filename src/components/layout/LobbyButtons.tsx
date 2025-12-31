import { PiggyBank, Gift } from 'lucide-react';
import { useUI } from '../../context/UIContext';

const LobbyButtons = () => {
    const { openModal } = useUI();

    return (
        <>
            {/* Left: 豬幫出動 */}
            <div
                onClick={() => openModal('tournament')}
                className="absolute bottom-12 left-12 z-[60] flex flex-col items-center cursor-pointer hover:scale-105 active:scale-95 transition-transform origin-bottom-left scale-150"
            >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-4 border-white shadow-[0_0_20px_#FF69B4] flex items-center justify-center relative transform hover:rotate-12 transition-transform">
                    <PiggyBank size={40} className="text-white drop-shadow-md" />
                    <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full border border-white shadow-sm">X2</div>
                </div>
                <div className="bg-pink-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md mt-2 border border-white/20">
                    豬幫出動!
                </div>
            </div>

            {/* Right: 首儲好禮 */}
            <div
                onClick={() => openModal('sale')}
                className="absolute bottom-12 right-12 z-[60] flex flex-col items-center cursor-pointer hover:scale-105 active:scale-95 transition-transform origin-bottom-right scale-150"
            >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-red-500 to-red-800 border-2 border-[#FFD700] shadow-xl flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform">
                    <Gift size={32} className="text-[#FFD700]" />
                </div>
                <div className="bg-red-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md mt-2 border border-white/20">
                    首儲好禮
                </div>
            </div>
        </>
    );
};

export default LobbyButtons;
