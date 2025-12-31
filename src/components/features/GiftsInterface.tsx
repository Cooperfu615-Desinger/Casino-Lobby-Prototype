import { useState, useCallback } from 'react';
import { Gift, Clock, CheckCircle2, X, Loader2 } from 'lucide-react';
import { GIFT_ITEMS, GiftItem } from '../../data/mockData';
import { useUI } from '../../context/UIContext';

interface GiftsInterfaceProps {
    onClose: () => void;
}

/**
 * GiftsInterface - 禮物中心組件
 * 
 * 此組件展示禮物領取的 CRUD 模擬操作，包含單一領取與全部領取功能。
 * 在實際開發中，這些操作應與後端 ClaimGift API 同步。
 */
const GiftsInterface = ({ onClose }: GiftsInterfaceProps) => {
    const { setLoading, showToast } = useUI();

    // 使用 useState 管理禮物列表的本地狀態
    // 實際開發時，這些狀態可能來自 React Query / SWR 等資料狀態管理工具
    const [items, setItems] = useState<GiftItem[]>(GIFT_ITEMS);
    const [isClaimingAll, setIsClaimingAll] = useState(false);

    const unclaimedCount = items.filter(item => !item.claimed).length;

    /**
     * 領取單一禮物
     * 
     * @description
     * 實際開發時的 API 整合建議:
     * 1. 發送 POST 請求領取禮物 (例如: POST /api/gifts/{giftId}/claim)
     * 2. 後端應驗證:
     *    - 該禮物是否存在且屬於當前用戶
     *    - 禮物是否已被領取過
     *    - 禮物是否已過期
     * 3. 成功後更新用戶餘額/道具並返回領取結果
     * 4. 前端收到成功響應後更新 UI 狀態
     * 
     * Optimistic UI 建議:
     * - 可以先將按鈕設為 loading 狀態，但不立即改變 claimed 狀態
     * - 待 API 成功後再更新 claimed: true
     * - 若失敗則恢復按鈕並顯示錯誤
     * 
     * @param id - 要領取的禮物 ID
     */
    const handleClaim = useCallback(async (id: number) => {
        const item = items.find(i => i.id === id);
        if (!item || item.claimed) return;

        setLoading(true);
        // 模擬 API 延遲
        await new Promise(resolve => setTimeout(resolve, 1000));

        setItems(prev => prev.map(i =>
            i.id === id ? { ...i, claimed: true } : i
        ));

        setLoading(false);
        showToast(`成功領取「${item.title}」！`, 'success');
    }, [items, setLoading, showToast]);

    /**
     * 全部領取所有未領取的禮物
     * 
     * @description
     * 實際開發時的 API 整合建議:
     * 1. 發送批次領取請求 (例如: POST /api/gifts/claim-all)
     * 2. 後端應返回:
     *    - 成功領取的禮物列表
     *    - 失敗的項目及原因（如已過期）
     *    - 領取的總價值/數量
     * 3. 考慮使用 transaction 確保原子性
     * 4. 返回領取總金額供前端顯示
     * 
     * 效能考量:
     * - 若禮物數量多，考慮分批處理
     * - 使用 loading 狀態防止重複點擊
     * - 可加入進度顯示 (如 "領取中 2/5...")
     */
    const handleClaimAll = useCallback(async () => {
        if (unclaimedCount === 0) {
            showToast('沒有可領取的禮物', 'info');
            return;
        }

        setIsClaimingAll(true);
        setLoading(true);

        // 模擬批次 API 延遲
        await new Promise(resolve => setTimeout(resolve, 1500));

        setItems(prev => prev.map(item => ({ ...item, claimed: true })));

        setLoading(false);
        setIsClaimingAll(false);
        showToast(`成功領取 ${unclaimedCount} 份禮物！`, 'success');
    }, [unclaimedCount, setLoading, showToast]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Modal Container */}
            <div className="relative w-[90%] max-w-[1000px] h-[600px] bg-[#1a0b2e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 bg-black/40 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="關閉禮物中心"
                >
                    <X size={20} />
                </button>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <header className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Gift size={24} className="text-[#FFD700]" />
                            <h2 className="text-2xl font-bold text-white">禮物中心</h2>
                            {unclaimedCount > 0 && (
                                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">
                                    {unclaimedCount} 份待領取
                                </span>
                            )}
                        </div>
                        <button
                            onClick={handleClaimAll}
                            disabled={unclaimedCount === 0 || isClaimingAll}
                            className={`flex items-center gap-2 px-4 py-2 mr-8 rounded-full text-sm font-bold transition-all ${unclaimedCount === 0 || isClaimingAll
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-[#FFD700] to-amber-500 text-black hover:brightness-110 active:scale-95 shadow-lg'
                                }`}
                        >
                            {isClaimingAll ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    領取中...
                                </>
                            ) : (
                                '一鍵領取全部'
                            )}
                        </button>
                    </header>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {items.map(item => (
                            <div
                                key={item.id}
                                className={`relative bg-[#1a0b2e] border rounded-2xl p-4 flex flex-col items-center gap-3 shadow-lg group transition-all duration-300 ${item.claimed
                                        ? 'border-white/5 opacity-60'
                                        : 'border-[#FFD700]/30 hover:border-[#FFD700]/60 hover:shadow-[0_0_20px_rgba(255,215,0,0.1)]'
                                    }`}
                            >
                                {/* New Badge */}
                                {!item.claimed && (
                                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                                )}

                                {/* Claimed Overlay */}
                                {item.claimed && (
                                    <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center pointer-events-none">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-15deg]">
                                            <span className="text-green-500/30 font-black text-3xl tracking-widest">
                                                CLAIMED
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Icon Container */}
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-1 transition-transform duration-300 ${item.claimed
                                        ? 'bg-slate-800 grayscale'
                                        : 'bg-gradient-to-br from-indigo-900 to-black group-hover:scale-110 shadow-[0_0_20px_rgba(255,215,0,0.1)]'
                                    }`}>
                                    {item.claimed ? <CheckCircle2 size={32} className="text-green-500/50" /> : item.icon}
                                </div>

                                <div className="text-center w-full">
                                    <h3 className={`font-bold text-sm mb-1 ${item.claimed ? 'text-slate-500' : 'text-white'}`}>
                                        {item.title}
                                    </h3>
                                    <p className={`text-xs mb-3 ${item.claimed ? 'text-slate-600 line-through' : 'text-[#FFD700]'}`}>
                                        {item.amount}
                                    </p>

                                    <button
                                        onClick={() => handleClaim(item.id)}
                                        disabled={item.claimed}
                                        className={`w-full py-2 rounded-full text-xs font-bold transition-all transform active:scale-95 ${item.claimed
                                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-green-500/30 hover:brightness-110'
                                            }`}
                                    >
                                        {item.claimed ? '已領取' : '領取'}
                                    </button>
                                </div>

                                <div className="absolute top-3 left-3">
                                    <span className={`text-[10px] flex items-center gap-1 ${item.claimed ? 'text-slate-600' : 'text-slate-500'}`}>
                                        <Clock size={10} /> {item.expire}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {items.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                            <Gift size={48} className="opacity-20 mb-4" />
                            <p className="text-sm">目前沒有禮物</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GiftsInterface;
