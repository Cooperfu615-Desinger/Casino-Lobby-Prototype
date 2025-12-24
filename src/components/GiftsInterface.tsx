import { useState } from 'react';
import { Gift, Clock, CheckCircle2 } from 'lucide-react';
import { GIFT_ITEMS, GiftItem } from '../data/mockData';

const GiftsInterface = () => {
    const [items, setItems] = useState<GiftItem[]>(GIFT_ITEMS);

    const handleClaim = (id: number) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, claimed: true } : item
        ));
    };

    return (
        <div className="absolute top-[130px] bottom-[90px] left-0 right-0 z-20 bg-[#120822]/95 border-t border-white/10 animate-in fade-in zoom-in-95 duration-300 overflow-y-auto p-8">
            <header className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Gift size={24} className="text-[#FFD700]" />
                    <h2 className="text-2xl font-bold text-white">禮物中心</h2>
                </div>
                <button className="text-xs text-[#FFD700] hover:underline">一鍵領取全部</button>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {items.map(item => (
                    <div key={item.id} className={`relative bg-[#1a0b2e] border ${item.claimed ? 'border-white/5 bg-opacity-50' : 'border-[#FFD700]/30'} rounded-2xl p-4 flex flex-col items-center gap-3 shadow-lg group transition-all duration-300`}>
                        {!item.claimed && (
                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                        )}

                        {/* Icon Container */}
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-1 transition-transform duration-300 ${item.claimed ? 'bg-slate-800 grayscale' : 'bg-gradient-to-br from-indigo-900 to-black group-hover:scale-110 shadow-[0_0_20px_rgba(255,215,0,0.1)]'}`}>
                            {item.claimed ? <CheckCircle2 size={32} className="text-slate-500" /> : item.icon}
                        </div>

                        <div className="text-center w-full">
                            <h3 className={`font-bold text-sm mb-1 ${item.claimed ? 'text-slate-500' : 'text-white'}`}>{item.title}</h3>
                            <p className={`text-xs mb-3 ${item.claimed ? 'text-slate-600' : 'text-[#FFD700]'}`}>{item.amount}</p>

                            <button
                                onClick={() => handleClaim(item.id)}
                                disabled={item.claimed}
                                className={`w-full py-2 rounded-full text-xs font-bold transition-all transform active:scale-95 ${item.claimed
                                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-green-500/30'
                                    }`}
                            >
                                {item.claimed ? '已領取' : '領取'}
                            </button>
                        </div>

                        <div className="absolute top-3 left-3">
                            <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                <Clock size={10} /> {item.expire}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GiftsInterface;
