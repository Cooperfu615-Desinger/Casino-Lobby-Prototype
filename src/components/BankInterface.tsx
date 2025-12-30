import { Landmark, Gem, FileText, X } from 'lucide-react';
import { PACKAGES, Package } from '../data/mockData';
import { useUI } from '../context/UIContext';

interface BankInterfaceProps {
    onClose: () => void;
}

const BankInterface = ({ onClose }: BankInterfaceProps) => {
    const { openModal } = useUI();


    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Modal Container */}
            <div className="relative w-[90%] max-w-[1100px] h-[650px] bg-[#1a0b2e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 bg-black/40 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <header className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Landmark size={24} className="text-[#FFD700]" />
                            <h2 className="text-2xl font-bold text-white">銀行中心</h2>
                        </div>

                        {/* History Button */}
                        <div className="flex gap-4 mr-12">
                            <button
                                onClick={() => openModal('history')}
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white px-4 py-2 rounded-full transition-all border border-white/5 active:scale-95"
                            >
                                <FileText size={16} />
                                <span className="text-sm font-bold">RECORD</span>
                            </button>
                        </div>
                    </header>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {PACKAGES.map(pkg => (
                            <div
                                key={pkg.id}
                                onClick={() => openModal('payment', { packageInfo: pkg })}
                                className="relative group bg-[#0f061e] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between hover:border-[#FFD700] hover:bg-white/5 transition-all cursor-pointer shadow-lg hover:shadow-[#FFD700]/20 hover:-translate-y-1"
                            >
                                {pkg.best && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md border border-white/20 whitespace-nowrap z-10">
                                        BEST VALUE
                                    </div>
                                )}

                                {/* Coin Visual */}
                                <div className="relative mb-4">
                                    <div className="absolute inset-0 bg-[#FFD700]/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-500"></div>
                                    <Gem size={64} className="text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] relative z-10" />
                                </div>

                                <div className="text-center w-full">
                                    <div className="text-white font-black text-2xl tracking-wide mb-1">{pkg.coins}</div>
                                    {pkg.bonus && <div className="text-green-400 text-sm font-bold mb-4">{pkg.bonus} BONUS</div>}

                                    <button className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 text-white font-bold py-3 rounded-full border border-white/20 shadow-lg active:scale-95 transition-all">
                                        {pkg.price}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BankInterface;
