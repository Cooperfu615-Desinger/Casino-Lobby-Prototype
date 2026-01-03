import { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
    name: string;
    avatar: string; // Tailwind class for background color
    vipLevel: number;
    balance: number;
    id: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (username?: string, password?: string) => void;
    loginAsGuest: () => void;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
    updateBalance: (newBalance: number) => void;
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
            balance: 1234567890,
            id: '123456789'
        };
        setUser(mockUser);
    };

    const loginAsGuest = () => {
        const guestUser: User = {
            name: 'Guest_' + Math.floor(Math.random() * 10000),
            avatar: 'bg-gradient-to-br from-gray-400 to-gray-600',
            vipLevel: 0,
            balance: 10000,
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

    const updateBalance = (newBalance: number) => {
        setUser(prev => prev ? { ...prev, balance: newBalance } : null);
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
