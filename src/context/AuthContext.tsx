import { createContext, useContext, useState, ReactNode } from 'react';
import type { CurrencyBalance } from '../types/user';

export interface User {
    name: string;
    avatar: string; // Tailwind class for background color
    vipLevel: number;
    balance: CurrencyBalance;
    id: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (username?: string, password?: string) => void;
    loginAsGuest: () => void;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
    updateBalance: (newBalance: Partial<CurrencyBalance>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (username?: string, _password?: string) => {
        // Mock login logic
        const mockUser: User = {
            name: username || '奧黛麗一本123456789',
            avatar: 'bg-gradient-to-br from-pink-400 to-purple-500',
            vipLevel: 7,
            balance: {
                gold: 1000,
                silver: 50000,
                bronze: 100000
            },
            id: '123456789'
        };
        setUser(mockUser);
    };

    const loginAsGuest = () => {
        const guestUser: User = {
            name: 'Guest_' + Math.floor(Math.random() * 10000),
            avatar: 'bg-gradient-to-br from-gray-400 to-gray-600',
            vipLevel: 0,
            balance: {
                gold: 10,
                silver: 1000,
                bronze: 5000
            },
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

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            loginAsGuest,
            logout,
            updateUser,
            updateBalance
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
