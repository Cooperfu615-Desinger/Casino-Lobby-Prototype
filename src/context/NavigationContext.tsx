import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// View types that can be navigated to
export type ViewType = 'games' | 'chat' | 'events' | 'inbox' | 'bank' | 'gifts' | 'club';

// Chat sub-tab types
export type ChatSubTab = 'public' | 'chat' | 'support';

interface NavigationState {
    currentView: ViewType;
    chatInitialTab: ChatSubTab;
    viewHistory: ViewType[];
}

interface NavigationContextType {
    // Current state
    currentView: ViewType;
    chatInitialTab: ChatSubTab;
    viewHistory: ViewType[];

    // Navigation methods
    navigate: (view: ViewType, options?: { chatTab?: ChatSubTab }) => void;
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
        viewHistory: ['games'],
    });

    // Navigate to a specific view
    const navigate = useCallback((view: ViewType, options?: { chatTab?: ChatSubTab }) => {
        setState(prev => {
            // If navigating to the same view, do nothing
            if (prev.currentView === view) return prev;

            // Build new history - only push if not going to games
            const newHistory = view === 'games'
                ? ['games'] as ViewType[]
                : [...prev.viewHistory.filter(v => v !== view), view];

            return {
                currentView: view,
                chatInitialTab: options?.chatTab || prev.chatInitialTab,
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
