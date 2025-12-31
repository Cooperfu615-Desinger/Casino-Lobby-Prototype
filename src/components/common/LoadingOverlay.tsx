import { Loader2 } from 'lucide-react';
import { useUI } from '../../context/UIContext';

/**
 * LoadingOverlay - 全域讀取遮罩元件
 * 
 * 當 UIContext 中的 isLoading 為 true 時顯示。
 * 
 * 特性：
 * - 全螢幕半透明黑底遮罩
 * - 中央顯示旋轉讀取動畫
 * - pointer-events-none 在視覺上遮蓋畫面，但不阻擋點擊
 *   （實際上使用 pointer-events-auto 來阻止重複操作）
 * 
 * @example
 * // 在實際開發時，此元件應放置於應用程式根層級：
 * // <UIProvider>
 * //     <App />
 * //     <LoadingOverlay />
 * // </UIProvider>
 * //
 * // 使用方式：
 * // const { setLoading } = useUI();
 * // setLoading(true);  // 顯示 Loading
 * // setLoading(false); // 隱藏 Loading
 */
const LoadingOverlay = () => {
    const { isLoading } = useUI();

    if (!isLoading) return null;

    return (
        <div
            className="
                fixed inset-0 z-[9998]
                bg-black/70 backdrop-blur-sm
                flex items-center justify-center
                animate-in fade-in duration-200
            "
            // 阻止點擊穿透，避免使用者在 Loading 時重複操作
            onClick={(e) => e.stopPropagation()}
        >
            {/* Loading Content */}
            <div className="flex flex-col items-center gap-4">
                {/* Spinner */}
                <div className="relative">
                    {/* Outer Glow */}
                    <div className="absolute inset-0 bg-[#FFD700] blur-xl opacity-30 animate-pulse" />

                    {/* Spinner Icon */}
                    <div className="relative bg-gradient-to-br from-[#1a0b2e] to-[#2d1b4e] p-4 rounded-2xl border border-[#FFD700]/30 shadow-[0_0_30px_rgba(255,215,0,0.2)]">
                        <Loader2
                            size={40}
                            className="text-[#FFD700] animate-spin"
                        />
                    </div>
                </div>

                {/* Loading Text */}
                <p className="text-white/80 text-sm font-medium tracking-wide">
                    處理中，請稍候...
                </p>
            </div>
        </div>
    );
};

export default LoadingOverlay;
