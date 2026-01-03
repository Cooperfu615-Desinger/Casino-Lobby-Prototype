import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

// ============================================================================
// Types & Interfaces
// ============================================================================

/** Modal types available in the application */
export type ModalType = 'transfer' | 'bank' | 'settings' | 'payment' | 'history' | 'sale' | 'tournament' | 'promotion' | 'none';

/** Toast notification type variants */
export type ToastType = 'success' | 'error' | 'info';

/** Structure of a modal item in the modal stack */
export interface ModalItem {
    id: string;
    type: ModalType;
    props?: any;
}

/** Structure of a toast notification */
export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    createdAt: number;
}

/** UI Context type definition */
interface UIContextType {
    // Modal Management
    modalStack: ModalItem[];
    openModal: (type: ModalType, props?: any) => void;
    closeModal: () => void;
    closeAll: () => void;

    // Loading State
    isLoading: boolean;
    setLoading: (loading: boolean) => void;

    // Toast Notifications
    toasts: Toast[];
    showToast: (message: string, type?: ToastType) => void;
    removeToast: (id: string) => void;

    // Balance Animation
    isBalanceAnimating: boolean;
    triggerBalanceAnimation: () => void;
}

// ============================================================================
// Context Definition
// ============================================================================

const UIContext = createContext<UIContextType | undefined>(undefined);

// ============================================================================
// Provider Component
// ============================================================================

export const UIProvider = ({ children }: { children: ReactNode }) => {
    // --------------------------------------------------------------------------
    // Modal State
    // --------------------------------------------------------------------------
    const [modalStack, setModalStack] = useState<ModalItem[]>([]);

    const openModal = useCallback((type: ModalType, props: any = {}) => {
        const id = Math.random().toString(36).substring(7);
        setModalStack(prev => [...prev, { id, type, props }]);
    }, []);

    const closeModal = useCallback(() => {
        setModalStack(prev => prev.slice(0, -1));
    }, []);

    const closeAll = useCallback(() => {
        setModalStack([]);
    }, []);

    // --------------------------------------------------------------------------
    // Loading State
    // --------------------------------------------------------------------------
    const [isLoading, setIsLoading] = useState(false);

    /**
     * 控制全域 Loading 狀態
     * 
     * @param loading - 是否顯示 Loading 遮罩
     * 
     * @example
     * // 在實際開發時，應與 API 呼叫整合：
     * const handleSubmit = async () => {
     *     setLoading(true);
     *     try {
     *         await api.submitTransaction(data);
     *         showToast('交易成功', 'success');
     *     } catch (error) {
     *         showToast('交易失敗', 'error');
     *     } finally {
     *         setLoading(false);
     *     }
     * };
     */
    const setLoading = useCallback((loading: boolean) => {
        setIsLoading(loading);
    }, []);

    // --------------------------------------------------------------------------
    // Toast State
    // --------------------------------------------------------------------------
    const [toasts, setToasts] = useState<Toast[]>([]);

    /**
     * 顯示 Toast 通知訊息
     * 
     * @param message - 要顯示的訊息內容
     * @param type - 通知類型：'success' | 'error' | 'info'（預設為 'info'）
     * 
     * Toast 會在 3 秒後自動消失
     * 
     * @example
     * // 在實際開發時，可根據 API 回應觸發不同類型的 Toast：
     * const handlePayment = async () => {
     *     const result = await paymentService.process(amount);
     *     if (result.success) {
     *         showToast('付款成功！', 'success');
     *     } else {
     *         showToast(`付款失敗: ${result.error}`, 'error');
     *     }
     * };
     */
    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(7);
        const newToast: Toast = {
            id,
            message,
            type,
            createdAt: Date.now(),
        };
        setToasts(prev => [...prev, newToast]);
    }, []);

    /**
     * 手動移除指定的 Toast
     * 
     * @param id - 要移除的 Toast ID
     */
    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    // Auto-remove toasts after 3 seconds
    useEffect(() => {
        if (toasts.length === 0) return;

        const timers = toasts.map(toast => {
            const elapsed = Date.now() - toast.createdAt;
            const remaining = Math.max(0, 3000 - elapsed);

            return setTimeout(() => {
                removeToast(toast.id);
            }, remaining);
        });

        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [toasts, removeToast]);

    // --------------------------------------------------------------------------
    // Balance Animation State
    // --------------------------------------------------------------------------
    const [isBalanceAnimating, setIsBalanceAnimating] = useState(false);

    /**
     * 觸發餘額跳動動畫
     * 用於領取獎勵後的視覺反饋
     */
    const triggerBalanceAnimation = useCallback(() => {
        setIsBalanceAnimating(true);
        setTimeout(() => setIsBalanceAnimating(false), 1000);
    }, []);

    // --------------------------------------------------------------------------
    // Context Value
    // --------------------------------------------------------------------------
    const value: UIContextType = {
        // Modal
        modalStack,
        openModal,
        closeModal,
        closeAll,
        // Loading
        isLoading,
        setLoading,
        // Toast
        toasts,
        showToast,
        removeToast,
        // Balance Animation
        isBalanceAnimating,
        triggerBalanceAnimation,
    };

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    );
};

// ============================================================================
// Custom Hook
// ============================================================================

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};
