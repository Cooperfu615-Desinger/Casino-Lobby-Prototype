import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { TRANSACTION_HISTORY } from '../data/mockData';
import type { Transaction } from '../types/transaction';
import type { CurrencyBalance, CurrencyType } from '../types/user';
import {
    calculateWalletExchange,
    canSubmitWalletExchange,
    type WalletExchangeDirection,
    type WalletExchangeResult,
} from '../utils/walletExchange';

export interface User {
    name: string;
    account: string;
    authProvider: AuthProviderType;
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

export type AuthProviderType = 'account' | 'guest' | 'phone' | 'facebook' | 'line' | 'apple' | 'google';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (
        account?: string,
        password?: string,
        provider?: AuthProviderType,
        displayName?: string,
    ) => void;
    loginAsGuest: () => void;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
    updateBalance: (newBalance: Partial<CurrencyBalance>) => void;
    updateAvatar: (id: number) => void;
    transactions: Transaction[];
    completeDeposit: (amount: number, method: 'App Store' | 'Google Play', price: string) => boolean;
    addWalletReward: (currency: CurrencyType, amount: number, source: string, transactionType?: Transaction['type']) => boolean;
    depositToVault: (amount: number) => boolean;
    withdrawFromVault: (amount: number) => boolean;
    transferFromVault: (receiverId: string, amount: number) => boolean;
    exchangeWalletCurrency: (direction: WalletExchangeDirection, amount: number) => WalletExchangeResult | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const DEFAULT_WALLET_AMOUNT = 10_000_000;
const AUTH_STORAGE_KEY = 'jh_app_auth_user';

type StoredAuthUser = Pick<User, 'name' | 'account' | 'authProvider' | 'avatarId' | 'id'>;

const createMockUser = ({
    name,
    account,
    authProvider,
    avatarId = 1,
    id,
}: StoredAuthUser): User => {
    const isGuest = authProvider === 'guest';
    return {
        name,
        account,
        authProvider,
        avatar: isGuest
            ? 'bg-gradient-to-br from-gray-400 to-gray-600'
            : 'bg-gradient-to-br from-pink-400 to-purple-500',
        avatarId,
        vipLevel: isGuest ? 0 : 6,
        vipDepositTotal: isGuest ? 0 : 128000,
        vipBetTotal: isGuest ? 0 : 3560000,
        balance: {
            gold: DEFAULT_WALLET_AMOUNT,
            silver: DEFAULT_WALLET_AMOUNT,
            bronze: DEFAULT_WALLET_AMOUNT,
        },
        vault_gold: 0,
        id,
        canAutoSend: !isGuest,
    };
};

const loadStoredUser = (): User | null => {
    if (typeof window === 'undefined') return null;

    try {
        const storedUser = window.localStorage.getItem(AUTH_STORAGE_KEY);
        if (!storedUser) return null;
        const parsedUser = JSON.parse(storedUser) as Partial<StoredAuthUser>;
        if (
            typeof parsedUser.name !== 'string' ||
            typeof parsedUser.id !== 'string' ||
            typeof parsedUser.account !== 'string' ||
            typeof parsedUser.authProvider !== 'string'
        ) {
            window.localStorage.removeItem(AUTH_STORAGE_KEY);
            return null;
        }

        return createMockUser({
            name: parsedUser.name,
            account: parsedUser.account,
            authProvider: parsedUser.authProvider as AuthProviderType,
            avatarId: typeof parsedUser.avatarId === 'number' ? parsedUser.avatarId : 1,
            id: parsedUser.id,
        });
    } catch {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
        return null;
    }
};

const createTransaction = (transaction: Omit<Transaction, 'id' | 'date' | 'status'>): Transaction => ({
    ...transaction,
    id: `TX-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    date: new Intl.DateTimeFormat('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(new Date()),
    status: 'success',
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(loadStoredUser);
    const [transactions, setTransactions] = useState<Transaction[]>(() => [...TRANSACTION_HISTORY]);

    useEffect(() => {
        if (user) {
            const storedUser: StoredAuthUser = {
                name: user.name,
                account: user.account,
                authProvider: user.authProvider,
                avatarId: user.avatarId,
                id: user.id,
            };
            window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(storedUser));
        } else {
            window.localStorage.removeItem(AUTH_STORAGE_KEY);
        }
    }, [user]);

    const prependTransaction = (transaction: Omit<Transaction, 'id' | 'date' | 'status'>) => {
        setTransactions(prev => [createTransaction(transaction), ...prev]);
    };

    const login = (
        account?: string,
        _password?: string,
        provider: AuthProviderType = 'account',
        displayName?: string,
    ) => {
        // Mock login logic
        const resolvedAccount = account || 'jhplayer888';
        const mockUser = createMockUser({
            name: displayName || account || '奧黛麗一本123456789',
            account: resolvedAccount,
            authProvider: provider,
            avatarId: 1,
            id: '123456789',
        });
        setUser(mockUser);
    };

    const loginAsGuest = () => {
        const guestNumber = Math.floor(1000 + Math.random() * 9000);
        const guestUser = createMockUser({
            name: `訪客${guestNumber}`,
            account: `guest${guestNumber}`,
            authProvider: 'guest',
            avatarId: 1,
            id: 'guest-' + Date.now(),
        });
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

    const completeDeposit = (amount: number, method: 'App Store' | 'Google Play', price: string) => {
        if (!user || amount <= 0) return false;

        setUser(prev => prev ? {
            ...prev,
            balance: { ...prev.balance, gold: prev.balance.gold + amount },
        } : null);
        prependTransaction({
            type: 'deposit',
            amount: `${amount.toLocaleString()} 金幣`,
            method: `${method}・${price}`,
        });
        return true;
    };

    const addWalletReward = (
        currency: CurrencyType,
        amount: number,
        source: string,
        transactionType: Transaction['type'] = 'free_reward',
    ) => {
        if (!user || amount <= 0) return false;

        setUser(prev => prev ? {
            ...prev,
            balance: { ...prev.balance, [currency]: prev.balance[currency] + amount },
        } : null);
        const currencyLabel = currency === 'gold' ? '金幣' : currency === 'silver' ? '銀幣' : '銅幣';
        prependTransaction({
            type: transactionType,
            amount: `${amount.toLocaleString()} ${currencyLabel}`,
            method: source,
        });
        return true;
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
        prependTransaction({
            type: 'vault_deposit',
            amount: `${amount.toLocaleString()} 金幣`,
            method: '錢包存入保險箱',
        });
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
        prependTransaction({
            type: 'vault_deposit',
            amount: `${amount.toLocaleString()} 金幣`,
            method: '保險箱取出至錢包',
        });
        return true;
    };

    const transferFromVault = (receiverId: string, amount: number) => {
        const normalizedReceiverId = receiverId.trim();
        if (!user || !normalizedReceiverId || amount <= 0 || amount > user.vault_gold) return false;

        setUser(prev => prev ? { ...prev, vault_gold: prev.vault_gold - amount } : null);
        prependTransaction({
            type: 'gift_transfer',
            amount: `${amount.toLocaleString()} 金幣`,
            method: `贈送給 ${normalizedReceiverId}`,
        });
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

        const fromLabel = direction === 'gold-to-silver' ? '金幣' : '銀幣';
        const toLabel = direction === 'gold-to-silver' ? '銀幣' : '金幣';
        prependTransaction({
            type: 'currency_conversion',
            amount: `${exchange.fromAmount.toLocaleString()} ${fromLabel} → ${exchange.toAmount.toLocaleString()} ${toLabel}`,
            method: `${fromLabel}兌換${toLabel}`,
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
            transactions,
            completeDeposit,
            addWalletReward,
            depositToVault,
            withdrawFromVault,
            transferFromVault,
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
