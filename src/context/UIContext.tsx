import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Define the available modal types
export type ModalType = 'transfer' | 'bank' | 'settings' | 'payment' | 'history' | 'sale' | 'tournament' | 'none';

// Define the shape of a modal item in the stack
export interface ModalItem {
    id: string; // Unique ID for keying
    type: ModalType;
    props?: any;
}

interface UIContextType {
    modalStack: ModalItem[];
    openModal: (type: ModalType, props?: any) => void;
    closeModal: () => void;
    closeAll: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
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

    return (
        <UIContext.Provider value={{ modalStack, openModal, closeModal, closeAll }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};
