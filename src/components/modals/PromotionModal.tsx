import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { OFFER_PACKAGES } from '../../data/mockData';
import { useUI } from '../../context/UIContext';
import LobbyModalShell from '../common/LobbyModalShell';
import { LobbyModalButton } from '../common/LobbyModalPrimitives';

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
        openModal('payment', { packageInfo: currentItem });
    };

    // Icon mapping
    const getIcon = (index: number) => {
        const icons = ['🧧', '👑', '🎉', '💎', '📅', '🎰'];
        return icons[index] || '🎁';
    };

    return (
        <LobbyModalShell
            title={currentItem.title}
            eyebrow="LIMITED OFFER"
            icon={<span className="text-xl">{getIcon(currentIndex)}</span>}
            onClose={onClose}
            closeLabel="關閉優惠活動"
            closeOnBackdrop
            frameClassName="h-[min(620px,90vh)] w-[94%] max-w-[500px]"
            bodyClassName="overflow-hidden p-5"
        >
            <div className="relative flex h-full min-h-0 items-center justify-center px-9 pb-7">
                <button
                    onClick={goToPrev}
                    disabled={currentIndex === 0}
                    aria-label="上一張卡片"
                    className={`absolute left-0 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/28 bg-[#263990]/40 text-white shadow-lg transition-all ${currentIndex === 0 ? 'cursor-not-allowed opacity-30' : 'hover:scale-105 hover:bg-white/18 active:scale-95'}`}
                >
                    <ChevronLeft size={24} />
                </button>

                <div key={currentItem.id} className="lobby-modal-section flex w-full max-w-[350px] animate-in zoom-in-95 flex-col p-6 text-center duration-300">
                    <div className={`mb-4 self-start rounded-full border border-white/20 bg-gradient-to-r px-4 py-1.5 text-xs font-black text-white shadow-lg ${currentItem.gradient}`}>
                        {currentItem.tag}
                    </div>

                    <div className="flex flex-1 flex-col items-center">
                        <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-white/25 bg-gradient-to-br shadow-xl ${currentItem.gradient}`}>
                            <span className="text-4xl drop-shadow-lg">{getIcon(currentIndex)}</span>
                        </div>
                        <h3 className="mb-2 text-xl font-black text-white">{currentItem.title}</h3>
                        <p className="mb-3 max-w-[280px] text-xs leading-relaxed text-slate-300">{currentItem.description}</p>

                        <div className="mb-3">
                            <p className="text-2xl font-black text-white">{currentItem.coins}</p>
                            <p className="text-xs text-slate-500 line-through">{currentItem.original}</p>
                        </div>

                        {currentItem.expireTime && (
                            <p className="mb-3 rounded-full bg-orange-500/12 px-3 py-1 text-xs font-bold text-orange-200">⏳ {currentItem.expireTime}</p>
                        )}
                    </div>

                    <LobbyModalButton onClick={handlePurchase} fullWidth>
                        {currentItem.price} 立即購買
                    </LobbyModalButton>
                </div>

                <button
                    onClick={goToNext}
                    disabled={currentIndex === currentPackages.length - 1}
                    aria-label="下一張卡片"
                    className={`absolute right-0 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/28 bg-[#263990]/40 text-white shadow-lg transition-all ${currentIndex === currentPackages.length - 1 ? 'cursor-not-allowed opacity-30' : 'hover:scale-105 hover:bg-white/18 active:scale-95'}`}
                >
                    <ChevronRight size={24} />
                </button>

                <div className="absolute bottom-0 flex items-center gap-2">
                    {currentPackages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`跳至第 ${index + 1} 張卡片`}
                            className={`h-2 rounded-full transition-all ${index === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/32 hover:bg-white/55'}`}
                        />
                    ))}
                    <span className="ml-2 text-[10px] font-mono text-white/55">{currentIndex + 1} / {currentPackages.length}</span>
                </div>
            </div>
        </LobbyModalShell>
    );
};

export default PromotionModal;
