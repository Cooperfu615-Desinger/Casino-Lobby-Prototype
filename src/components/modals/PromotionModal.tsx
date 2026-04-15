import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { OFFER_PACKAGES } from '../../data/mockData';
import { useUI } from '../../context/UIContext';

interface PromotionModalProps {
    onClose: () => void;
    startIndex?: number;
}

/**
 * 優惠卡片輪播彈窗
 * 
 * 獨立卡片風格的優惠輪播，一次顯示一張卡片於畫面中央。
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
    const [currentIndex, setCurrentIndex] = useState(startIndex);

    // Sync with startIndex prop
    useEffect(() => {
        setCurrentIndex(startIndex);
    }, [startIndex]);

    // Phase 1: Only show Recharge/Sale events
    const currentPackages = OFFER_PACKAGES.filter(p => p.id !== 2 && p.id !== 6);

    const currentItem = currentPackages[currentIndex] || currentPackages[0];

    // Navigate to previous/next card
    const goToPrev = () => {
        setCurrentIndex(prev => Math.max(0, prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex(prev => Math.min(currentPackages.length - 1, prev + 1));
    };

    /**
     * 【支付系統入口】
     * 點擊購買按鈕直接觸發 Apple/Google 支付流程
     * 此處調用 openModal('payment') 模擬支付彈窗
     */
    const handlePurchase = () => {
        openModal('payment');
    };

    // Close when clicking backdrop
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Icon mapping
    const getIcon = (index: number) => {
        const icons = ['🧧', '👑', '🎉', '💎', '📅', '🎰'];
        return icons[index] || '🎁';
    };

    return (
        <div
            onClick={handleBackdropClick}
            className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        >
            {/* Left Arrow - Outside Card */}
            <button
                onClick={goToPrev}
                disabled={currentIndex === 0}
                aria-label="上一張卡片"
                className={`absolute left-8 z-30 bg-black/60 hover:bg-black/80 text-white rounded-full p-4 transition-all backdrop-blur-sm border border-white/20 shadow-2xl ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}`}
            >
                <ChevronLeft size={32} />
            </button>

            {/* Right Arrow - Outside Card */}
            <button
                onClick={goToNext}
                disabled={currentIndex === currentPackages.length - 1}
                aria-label="下一張卡片"
                className={`absolute right-8 z-30 bg-black/60 hover:bg-black/80 text-white rounded-full p-4 transition-all backdrop-blur-sm border border-white/20 shadow-2xl ${currentIndex === currentPackages.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}`}
            >
                <ChevronRight size={32} />
            </button>

            {/* Main Card - Centered */}
            <div
                key={currentItem.id}
                className="relative w-[360px] bg-gradient-to-b from-[#2a1b42] via-[#1f1035] to-[#150923] border-2 border-[#FFD700]/50 rounded-3xl p-8 flex flex-col shadow-[0_0_80px_rgba(255,215,0,0.25),0_20px_60px_rgba(0,0,0,0.5)] transform transition-all duration-300 animate-in zoom-in-95"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute -top-3 -right-3 z-20 text-white bg-black/80 hover:bg-red-600 rounded-full p-2 transition-all border border-white/20 shadow-lg hover:scale-110"
                >
                    <X size={20} />
                </button>

                {/* Tag Badge */}
                <div className={`self-start bg-gradient-to-r ${currentItem.gradient} text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg mb-6 border border-white/20`}>
                    {currentItem.tag}
                </div>

                {/* Card Content */}
                <div className="flex-1 flex flex-col items-center text-center">
                    {/* Icon Area */}
                    <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${currentItem.gradient} flex items-center justify-center mb-6 shadow-2xl border-2 border-white/20 transform hover:scale-105 transition-transform`}>
                        <span className="text-5xl drop-shadow-lg">
                            {getIcon(currentIndex)}
                        </span>
                    </div>

                    <h3 className="text-white font-black text-2xl mb-3 drop-shadow-lg">{currentItem.title}</h3>
                    <p className="text-slate-300 text-sm mb-4 leading-relaxed max-w-[280px]">{currentItem.description}</p>

                    <div className="mb-4">
                        <p className="text-[#FFD700] font-black text-3xl drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">{currentItem.coins}</p>
                        <p className="text-slate-500 text-sm line-through">{currentItem.original}</p>
                    </div>

                    {currentItem.expireTime && (
                        <p className="text-orange-400 text-sm font-medium mb-4 bg-orange-500/10 px-3 py-1 rounded-full">⏳ {currentItem.expireTime}</p>
                    )}
                </div>

                {/* Purchase Button */}
                <button
                    onClick={handlePurchase}
                    className="w-full bg-gradient-to-r from-[#FFD700] to-[#DAA520] hover:brightness-110 text-black font-black py-4 rounded-xl shadow-[0_4px_20px_rgba(255,215,0,0.4)] active:scale-95 transition-all text-lg border border-[#FFD700]/50"
                >
                    {currentItem.price} 立即購買
                </button>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mt-6">
                    {currentPackages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`跳至第 ${index + 1} 張卡片`}
                            className={`rounded-full transition-all ${index === currentIndex ? 'bg-[#FFD700] w-6 h-2' : 'bg-white/30 w-2 h-2 hover:bg-white/50'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Card Counter */}
            <div className="absolute bottom-8 text-white/50 text-sm font-mono">
                {currentIndex + 1} / {currentPackages.length}
            </div>
        </div>
    );
};

export default PromotionModal;
