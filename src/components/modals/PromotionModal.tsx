import { useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { OFFER_PACKAGES } from '../../data/mockData';
import { useUI } from '../../context/UIContext';

interface PromotionModalProps {
    onClose: () => void;
    startIndex?: number;
}

/**
 * 優惠卡片滑動彈窗
 * 
 * 整合六種優惠活動於統一的滑動介面，支援初始定位與 Snap 吸附。
 * 
 * @param onClose - 關閉彈窗的 callback
 * @param startIndex - 初始顯示的卡片索引（預設為 0）
 * 
 * 卡片對應：
 * - 0: 新春紅包禮
 * - 1: VIP專屬儲值
 * - 2: 週末狂歡包
 * - 3: 首充雙倍送
 * - 4: 月卡尊享
 * - 5: 幸運輪盤加碼
 */
const PromotionModal = ({ onClose, startIndex = 0 }: PromotionModalProps) => {
    const { openModal } = useUI();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const cardWidth = 320; // Card width + gap

    // Scroll to startIndex on mount
    useEffect(() => {
        if (scrollContainerRef.current && startIndex > 0) {
            const scrollPosition = startIndex * cardWidth;
            scrollContainerRef.current.scrollTo({
                left: scrollPosition,
                behavior: 'instant'
            });
        }
    }, [startIndex]);

    // Navigate to previous/next card
    const scrollToCard = (direction: 'prev' | 'next') => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const currentIndex = Math.round(container.scrollLeft / cardWidth);
        const targetIndex = direction === 'prev'
            ? Math.max(0, currentIndex - 1)
            : Math.min(OFFER_PACKAGES.length - 1, currentIndex + 1);

        container.scrollTo({
            left: targetIndex * cardWidth,
            behavior: 'smooth'
        });
    };

    /**
     * 【支付系統入口】
     * 點擊購買按鈕直接觸發 Apple/Google 支付流程
     * 此處調用 openModal('payment') 模擬支付彈窗
     */
    const handlePurchase = () => {
        openModal('payment');
    };

    return (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-[90%] max-w-4xl bg-gradient-to-b from-[#2a1b42] to-[#1a0b2e] rounded-3xl border-2 border-[#FFD700]/50 shadow-[0_0_80px_rgba(255,215,0,0.2)] flex flex-col overflow-hidden relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    aria-label="關閉優惠視窗"
                    className="absolute top-4 right-4 z-20 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-2 transition-all"
                >
                    <X size={24} />
                </button>

                {/* Header */}
                <div className="h-20 bg-gradient-to-r from-[#FFD700]/20 to-[#DAA520]/10 flex items-center justify-center relative border-b border-[#FFD700]/20">
                    <div className="text-center">
                        <h2 className="text-3xl font-black text-white tracking-wide">
                            <span className="text-[#FFD700]">✨</span> 限時優惠活動 <span className="text-[#FFD700]">✨</span>
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">左右滑動查看更多優惠</p>
                    </div>
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={() => scrollToCard('prev')}
                    aria-label="上一張卡片"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white/70 hover:text-white rounded-full p-3 transition-all backdrop-blur-sm"
                >
                    <ChevronLeft size={28} />
                </button>
                <button
                    onClick={() => scrollToCard('next')}
                    aria-label="下一張卡片"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white/70 hover:text-white rounded-full p-3 transition-all backdrop-blur-sm"
                >
                    <ChevronRight size={28} />
                </button>

                {/* Swipeable Card Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex-1 flex overflow-x-auto snap-x snap-mandatory scroll-smooth py-8 px-16 gap-6 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none]"
                >
                    {OFFER_PACKAGES.map((item, index) => (
                        <div
                            key={item.id}
                            className="snap-center shrink-0 w-[280px] bg-gradient-to-b from-[#3a2b52] to-[#1a0b2e] border border-[#FFD700]/30 rounded-2xl p-6 flex flex-col shadow-2xl group hover:border-[#FFD700] transition-all duration-300"
                        >
                            {/* Tag */}
                            <div className={`self-start bg-gradient-to-r ${item.gradient} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md mb-4`}>
                                {item.tag}
                            </div>

                            {/* Card Content */}
                            <div className="flex-1 flex flex-col items-center text-center">
                                {/* Icon Area */}
                                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 shadow-lg transform group-hover:scale-110 transition-transform`}>
                                    <span className="text-4xl">
                                        {index === 0 && '🧧'}
                                        {index === 1 && '👑'}
                                        {index === 2 && '🎉'}
                                        {index === 3 && '💎'}
                                        {index === 4 && '📅'}
                                        {index === 5 && '🎰'}
                                    </span>
                                </div>

                                <h3 className="text-white font-bold text-xl mb-2">{item.title}</h3>
                                <p className="text-slate-400 text-sm mb-3 leading-relaxed">{item.description}</p>

                                <div className="mb-2">
                                    <p className="text-[#FFD700] font-black text-2xl">{item.coins}</p>
                                    <p className="text-slate-500 text-xs line-through">{item.original}</p>
                                </div>

                                {item.expireTime && (
                                    <p className="text-orange-400 text-xs mb-3">⏳ {item.expireTime}</p>
                                )}
                            </div>

                            {/* Purchase Button */}
                            <button
                                onClick={handlePurchase}
                                className="w-full bg-gradient-to-r from-[#FFD700] to-[#DAA520] hover:brightness-110 text-black font-black py-3 rounded-xl shadow-lg active:scale-95 transition-all text-lg"
                            >
                                {item.price} 立即購買
                            </button>
                        </div>
                    ))}
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 pb-4">
                    {OFFER_PACKAGES.map((_, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all ${index === startIndex ? 'bg-[#FFD700] w-4' : 'bg-white/30'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Custom scrollbar hide styles */}
            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default PromotionModal;
