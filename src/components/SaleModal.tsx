import { X, Flame, Gem } from 'lucide-react';
import { SALE_PACKAGES } from '../data/mockData';

interface SaleModalProps {
    onClose: () => void;
}

const SaleModal = ({ onClose }: SaleModalProps) => (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
        <div className="w-[85%] max-w-3xl bg-gradient-to-b from-red-900 to-[#1a0b2e] rounded-3xl border-2 border-[#FFD700] shadow-[0_0_100px_rgba(255,0,0,0.4)] flex flex-col overflow-hidden relative">

            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-2 transition-all"
            >
                <X size={24} />
            </button>

            {/* Header */}
            <div className="h-24 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-red-700 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-900/90"></div>
                <div className="relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter drop-shadow-lg flex items-center gap-3">
                        <Flame className="text-[#FFD700] animate-pulse" size={48} fill="currentColor" />
                        LIMITED SALE
                        <Flame className="text-[#FFD700] animate-pulse" size={48} fill="currentColor" />
                    </h2>
                    <p className="text-[#FFD700] text-sm font-bold tracking-[0.3em] mt-1">SPECIAL OFFER ENDS IN 02:14:59</p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-8 grid grid-cols-3 gap-6 items-center">
                {SALE_PACKAGES.map((item, index) => (
                    <div key={item.id} className={`relative bg-gradient-to-b from-[#2a1b42] to-[#150923] border border-[#FFD700]/30 rounded-2xl p-4 flex flex-col items-center text-center shadow-xl group hover:-translate-y-2 transition-transform duration-300 ${index === 1 ? 'scale-110 z-10 border-[#FFD700] shadow-[0_0_30px_rgba(255,215,0,0.2)]' : ''}`}>

                        {/* Tag */}
                        <div className="absolute -top-3 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md border border-white/20 transform -rotate-2">
                            {item.tag}
                        </div>

                        <div className="mb-4 mt-2 relative">
                            <div className="absolute inset-0 bg-[#FFD700]/10 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform"></div>
                            <Gem size={index === 1 ? 64 : 48} className="text-[#FFD700] drop-shadow-md" />
                        </div>

                        <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                        <p className="text-[#FFD700] font-black text-2xl tracking-wide mb-1">{item.coins}</p>
                        <p className="text-slate-500 text-xs line-through mb-4">{item.original}</p>

                        <button className="w-full bg-gradient-to-r from-[#FFD700] to-[#DAA520] hover:brightness-110 text-black font-black py-2.5 rounded-xl shadow-lg active:scale-95 transition-all">
                            {item.price}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default SaleModal;
