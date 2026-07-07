import { createContext, useContext, useState, ReactNode } from 'react';
import type { CurrencyBalance } from '../types/user';
import {
    calculateWalletExchange,
    canSubmitWalletExchange,
    type WalletExchangeDirection,
    type WalletExchangeResult,
} from '../utils/walletExchange';

export interface User {
    name: string;
    avatar: string; // Tailwind class for background color (legacy, kept for compatibility)
    avatarId: number; // Selected avatar ID (1–20), see AVATARS in mockData
    vipLevel: number;
    vipDepositTotal: number;
    vipBetTotal: number;
    balance: CurrencyBalance;
    vault_gold: number; // New: Gold in the vault
    id: string;
    canAutoSend?: boolean; // Special player permission: enables auto-send feature
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (username?: string, password?: string) => void;
    loginAsGuest: () => void;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
    updateBalance: (newBalance: Partial<CurrencyBalance>) => void;
    updateAvatar: (id: number) => void;
    depositToVault: (amount: number) => boolean;
    withdrawFromVault: (amount: number) => boolean;
    exchangeWalletCurrency: (direction: WalletExchangeDirection, amount: number) => WalletExchangeResult | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const DEFAULT_WALLET_AMOUNT = 1_000_000_000;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (username?: string, _password?: string) => {
        // Mock login logic
        const mockUser: User = {
            name: username || '奧黛麗一本123456789',
            avatar: 'bg-gradient-to-br from-pink-400 to-purple-500',
            avatarId: 1,
            vipLevel: 6,
            vipDepositTotal: 128000,
            vipBetTotal: 3560000,
            balance: {
                gold: DEFAULT_WALLET_AMOUNT,
                silver: DEFAULT_WALLET_AMOUNT,
                bronze: DEFAULT_WALLET_AMOUNT
            },
            vault_gold: 0,
            id: '123456789',
            canAutoSend: true // Special player flag: enables auto-send feature in chat
        };
        setUser(mockUser);
    };

    const loginAsGuest = () => {
        const guestUser: User = {
            name: 'Guest_' + Math.floor(Math.random() * 10000),
            avatar: 'bg-gradient-to-br from-gray-400 to-gray-600',
            avatarId: 1,
            vipLevel: 0,
            vipDepositTotal: 0,
            vipBetTotal: 0,
            balance: {
                gold: DEFAULT_WALLET_AMOUNT,
                silver: DEFAULT_WALLET_AMOUNT,
                bronze: DEFAULT_WALLET_AMOUNT
            },
            vault_gold: 0,
            id: 'guest-' + Date.now()
        };
        setUser(guestUser);
    };

    const logout = () => {
        setUser(null);
    };

    const updateUser = (updates: Partial<User>) => {
        setUser(prev => prev ? { ...prev, ...updates } : null);
    };

    const updateBalance = (newBalance: Partial<CurrencyBalance>) => {
        setUser(prev => prev ? { ...prev, balance: { ...prev.balance, ...newBalance } } : null);
    };

    const updateAvatar = (id: number) => {
        setUser(prev => prev ? { ...prev, avatarId: id } : null);
    };

    const depositToVault = (amount: number) => {
        if (!user || amount <= 0 || amount > user.balance.gold) return false;

        setUser(prev => prev ? {
            ...prev,
            balance: {
                ...prev.balance,
                gold: prev.balance.gold - amount,
            },
            vault_gold: prev.vault_gold + amount,
        } : null);
        return true;
    };

    const withdrawFromVault = (amount: number) => {
        if (!user || amount <= 0 || amount > user.vault_gold) return false;

        setUser(prev => prev ? {
            ...prev,
            balance: {
                ...prev.balance,
                gold: prev.balance.gold + amount,
            },
            vault_gold: prev.vault_gold - amount,
        } : null);
        return true;
    };

    const exchangeWalletCurrency = (direction: WalletExchangeDirection, amount: number) => {
        if (!user) return null;

        const sourceBalance = direction === 'gold-to-silver' ? user.balance.gold : user.balance.silver;
        if (!canSubmitWalletExchange(direction, amount, sourceBalance)) return null;

        const exchange = calculateWalletExchange(direction, amount);
        setUser(prev => {
            if (!prev) return null;

            if (direction === 'gold-to-silver') {
                if (exchange.fromAmount > prev.balance.gold) return prev;
                return {
                    ...prev,
                    balance: {
                        ...prev.balance,
                        gold: prev.balance.gold - exchange.fromAmount,
                        silver: prev.balance.silver + exchange.toAmount,
                    },
                };
            }

            if (exchange.fromAmount > prev.balance.silver) return prev;
            return {
                ...prev,
                balance: {
                    ...prev.balance,
                    silver: prev.balance.silver - exchange.fromAmount,
                    gold: prev.balance.gold + exchange.toAmount,
                },
            };
        });

        return exchange;
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            loginAsGuest,
            logout,
            updateUser,
            updateBalance,
            updateAvatar,
            depositToVault,
            withdrawFromVault,
            exchangeWalletCurrency
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
