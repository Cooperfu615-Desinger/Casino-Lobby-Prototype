import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// View types that can be navigated to
export type ViewType = 'games' | 'chat' | 'events' | 'inbox' | 'bank' | 'gifts' | 'club';

// Chat sub-tab types
export type ChatSubTab = 'public' | 'chat' | 'support';

// Bank sub-tab types
export type BankSubTab = 'deposit' | 'offers' | 'gifts' | 'vault' | 'exchange' | 'records';

// Events sub-tab types
export type EventsSubTab = 'daily' | 'events' | 'leaderboard' | 'filter';

export interface ChatTargetPlayer {
    playerId: string;
    name: string;
    avatar?: string;
    level?: number;
    isFriend?: boolean;
}

export interface SupportDraft {
    title: string;
    targetPlayer?: ChatTargetPlayer;
}

interface NavigationOptions {
    chatTab?: ChatSubTab;
    bankTab?: BankSubTab;
    eventsTab?: EventsSubTab;
    chatTarget?: ChatTargetPlayer;
    supportDraft?: SupportDraft;
}

interface NavigationState {
    currentView: ViewType;
    chatInitialTab: ChatSubTab;
    bankInitialTab: BankSubTab;
    eventsInitialTab: EventsSubTab;
    chatTarget?: ChatTargetPlayer;
    supportDraft?: SupportDraft;
    viewHistory: ViewType[];
}

interface NavigationContextType {
    // Current state
    currentView: ViewType;
    chatInitialTab: ChatSubTab;
    bankInitialTab: BankSubTab;
    eventsInitialTab: EventsSubTab;
    chatTarget?: ChatTargetPlayer;
    supportDraft?: SupportDraft;
    viewHistory: ViewType[];

    // Navigation methods
    navigate: (view: ViewType, options?: NavigationOptions) => void;
    goBack: () => void;
    goToGames: () => void;

    // Utility methods
    canGoBack: () => boolean;
    isOverlay: () => boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
    children: ReactNode;
}

export const NavigationProvider = ({ children }: NavigationProviderProps) => {
    const [state, setState] = useState<NavigationState>({
        currentView: 'games',
        chatInitialTab: 'chat',
        bankInitialTab: 'deposit',
        eventsInitialTab: 'events',
        chatTarget: undefined,
        supportDraft: undefined,
        viewHistory: ['games'],
    });

    // Navigate to a specific view
    const navigate = useCallback((view: ViewType, options?: NavigationOptions) => {
        setState(prev => {
            // If navigating to the same view, do nothing
            if (
                prev.currentView === view &&
                (!options || (!options.chatTab && !options.bankTab && !options.eventsTab && !options.chatTarget && !options.supportDraft))
            ) return prev;

            // Build new history - only push if not going to games
            const newHistory = view === 'games'
                ? ['games'] as ViewType[]
                : [...prev.viewHistory.filter(v => v !== view), view];

            return {
                currentView: view,
                chatInitialTab: options?.chatTab || prev.chatInitialTab,
                bankInitialTab: options?.bankTab || prev.bankInitialTab,
                eventsInitialTab: options?.eventsTab || prev.eventsInitialTab,
                chatTarget: options?.chatTarget,
                supportDraft: options?.supportDraft,
                viewHistory: newHistory,
            };
        });
    }, []);

    // Go back to previous view
    const goBack = useCallback(() => {
        setState(prev => {
            if (prev.viewHistory.length <= 1) {
                return { ...prev, currentView: 'games', viewHistory: ['games'] };
            }

            // Pop current view from history
            const newHistory = prev.viewHistory.slice(0, -1);
            const previousView = newHistory[newHistory.length - 1] || 'games';

            return {
                ...prev,
                currentView: previousView,
                viewHistory: newHistory.length > 0 ? newHistory : ['games'],
            };
        });
    }, []);

    // Go directly to games (home)
    const goToGames = useCallback(() => {
        setState({
            currentView: 'games',
            chatInitialTab: 'chat',
            bankInitialTab: 'deposit',
            eventsInitialTab: 'events',
            chatTarget: undefined,
            supportDraft: undefined,
            viewHistory: ['games'],
        });
    }, []);

    // Check if we can go back
    const canGoBack = useCallback(() => {
        return state.viewHistory.length > 1 || state.currentView !== 'games';
    }, [state.viewHistory.length, state.currentView]);

    // Check if current view is an overlay (not games)
    const isOverlay = useCallback(() => {
        return state.currentView !== 'games';
    }, [state.currentView]);

    const value: NavigationContextType = {
        currentView: state.currentView,
        chatInitialTab: state.chatInitialTab,
        bankInitialTab: state.bankInitialTab,
        eventsInitialTab: state.eventsInitialTab,
        chatTarget: state.chatTarget,
        supportDraft: state.supportDraft,
        viewHistory: state.viewHistory,
        navigate,
        goBack,
        goToGames,
        canGoBack,
        isOverlay,
    };

    return (
        <NavigationContext.Provider value={value}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigationContext = (): NavigationContextType => {
    const context = useContext(NavigationContext);
    if (context === undefined) {
        throw new Error('useNavigationContext must be used within a NavigationProvider');
    }
    return context;
};

export default NavigationContext;
