import { Landmark, Gem, FileText } from 'lucide-react';
import { PACKAGES, Package } from '../data/mockData';

interface BankInterfaceProps {
    onSelectPackage: (pkg: Package) => void;
    onOpenHistory: () => void;
}

const BankInterface = ({ onSelectPackage, onOpenHistory }: BankInterfaceProps) => {


    return (
        <div className="absolute top-[130px] bottom-[90px] left-0 right-0 z-20 bg-[#120822]/95 border-t border-white/10 animate-in fade-in zoom-in-95 duration-300 overflow-y-auto p-8">
            <header className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Landmark size={24} className="text-[#FFD700]" />
                    <h2 className="text-2xl font-bold text-white">銀行中心</h2>
                </div>

                {/* History Button */}
                <button
                    onClick={onOpenHistory}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white px-4 py-2 rounded-full transition-all border border-white/5 active:scale-95"
                >
                    <FileText size={16} />
                    <span className="text-sm font-bold">儲值紀錄</span>
                </button>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {PACKAGES.map(pkg => (
                    <div
                        key={pkg.id}
                        onClick={() => onSelectPackage(pkg)}
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
    );
};

export default BankInterface;
