import { useState } from 'react';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserPreferencesProvider } from './context/UserPreferencesContext';
import { AudioProvider } from './context/AudioContext';
import { UIProvider } from './context/UIContext';
import { NavigationProvider } from './context/NavigationContext';
import { SocialProvider } from './context/SocialContext';

// Components - Layout
import BrandLoading from './components/layout/BrandLoading';
import LobbyLayout from './components/layout/LobbyLayout';

// Components - Features
import LoginScreen from './components/features/LoginScreen';
import GameRoom from './components/features/GameRoom';

// Components - Global UI
import ModalContainer from './components/ModalContainer';
import PrototypeStage from './components/common/PrototypeStage';
import ToastContainer from './components/common/ToastContainer';
import LoadingOverlay from './components/common/LoadingOverlay';
import AgeGateModal from './components/modals/AgeGateModal';

// Types
import type { Game } from './types';

// Wrapper component to handle routing based on auth state
const MainContent = () => {
    const { isAuthenticated } = useAuth();
    const [activeGame, setActiveGame] = useState<Game | null>(null);

    if (!isAuthenticated) return <LoginScreen />;

    if (activeGame) {
        return <GameRoom game={activeGame} onExit={() => setActiveGame(null)} />;
    }

    return <LobbyLayout onPlayGame={setActiveGame} />;
};

function App() {
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isAgeGateResolved, setIsAgeGateResolved] = useState(false);

    return (
        <PrototypeStage>
            {/* UserPreferencesProvider 必須在 AudioProvider 之前，因為 AudioContext 依賴偏好設定 */}
            <UserPreferencesProvider>
                <AudioProvider>
                    <AuthProvider>
                        <UIProvider>
                            <NavigationProvider>
                                <SocialProvider>
                                    {isInitialLoad ? (
                                        <BrandLoading onFinished={() => setIsInitialLoad(false)} />
                                    ) : !isAgeGateResolved ? (
                                        <AgeGateModal onContinue={() => setIsAgeGateResolved(true)} />
                                    ) : (
                                        <>
                                            <MainContent />
                                            <ModalContainer />
                                        </>
                                    )}
                                </SocialProvider>
                            </NavigationProvider>
                            {/* Global UI Components - Always rendered */}
                            <ToastContainer />
                            <LoadingOverlay />
                        </UIProvider>
                    </AuthProvider>
                </AudioProvider>
            </UserPreferencesProvider>
        </PrototypeStage>
    );
}

export default App;
