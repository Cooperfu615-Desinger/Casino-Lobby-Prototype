import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useUI, Toast, ToastType } from '../../context/UIContext';

/**
 * ToastContainer - 全域 Toast 通知容器
 * 
 * 位置：畫面頂部中央
 * Z-Index：9999 確保在所有元素最上層
 * 自動消失：3 秒後自動移除
 * 
 * @example
 * // 在實際開發時，此元件應放置於應用程式根層級：
 * // <UIProvider>
 * //     <App />
 * //     <ToastContainer />
 * // </UIProvider>
 */
const ToastContainer = () => {
    const { toasts, removeToast } = useUI();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 pointer-events-none">
            {toasts.map((toast) => (
                <ToastItem
                    key={toast.id}
                    toast={toast}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

// ============================================================================
// Toast Item Component
// ============================================================================

interface ToastItemProps {
    toast: Toast;
    onClose: () => void;
}

const ToastItem = ({ toast, onClose }: ToastItemProps) => {
    const { icon: Icon, bgColor, borderColor, textColor } = getToastStyles(toast.type);

    return (
        <div
            className={`
                pointer-events-auto
                flex items-center gap-3 
                px-5 py-3.5 
                rounded-xl 
                shadow-[0_8px_30px_rgba(0,0,0,0.4)]
                backdrop-blur-md
                border
                ${bgColor} ${borderColor}
                animate-in slide-in-from-top-3 fade-in duration-300
                min-w-[280px] max-w-[400px]
            `}
        >
            {/* Icon */}
            <div className={`shrink-0 ${textColor}`}>
                <Icon size={20} />
            </div>

            {/* Message */}
            <span className="flex-1 text-white text-sm font-medium leading-snug">
                {toast.message}
            </span>

            {/* Close Button */}
            <button
                onClick={onClose}
                className="shrink-0 text-white/40 hover:text-white/80 transition-colors p-1 -mr-1"
                aria-label="關閉通知"
            >
                <X size={16} />
            </button>
        </div>
    );
};

// ============================================================================
// Style Helpers
// ============================================================================

interface ToastStyleConfig {
    icon: typeof CheckCircle;
    bgColor: string;
    borderColor: string;
    textColor: string;
}

const getToastStyles = (type: ToastType): ToastStyleConfig => {
    switch (type) {
        case 'success':
            return {
                icon: CheckCircle,
                bgColor: 'bg-green-500/20',
                borderColor: 'border-green-500/40',
                textColor: 'text-green-400',
            };
        case 'error':
            return {
                icon: AlertCircle,
                bgColor: 'bg-red-500/20',
                borderColor: 'border-red-500/40',
                textColor: 'text-red-400',
            };
        case 'info':
        default:
            return {
                icon: Info,
                bgColor: 'bg-blue-500/20',
                borderColor: 'border-blue-500/40',
                textColor: 'text-blue-400',
            };
    }
};

export default ToastContainer;
