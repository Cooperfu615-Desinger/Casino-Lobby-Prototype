import { useState, useEffect } from 'react';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserPreferencesProvider } from './context/UserPreferencesContext';
import { AudioProvider } from './context/AudioContext';
import { UIProvider } from './context/UIContext';
import { NavigationProvider } from './context/NavigationContext';

// Components - Layout
import BrandLoading from './components/layout/BrandLoading';
import LobbyLayout from './components/layout/LobbyLayout';

// Components - Features
import LoginScreen from './components/features/LoginScreen';
import GameRoom from './components/features/GameRoom';

// Components - Global UI
import ModalContainer from './components/ModalContainer';
import ToastContainer from './components/common/ToastContainer';
import LoadingOverlay from './components/common/LoadingOverlay';

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
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            const scaleX = window.innerWidth / 1280;
            const scaleY = window.innerHeight / 720;
            setScale(Math.min(scaleX, scaleY));
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial calculation

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
            {/* Game Container with Global Scale */}
            <div
                className="relative w-[1280px] h-[720px] shadow-2xl overflow-hidden"
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center'
                }}
            >
                {/* UserPreferencesProvider 必須在 AudioProvider 之前，因為 AudioContext 依賴偏好設定 */}
                <UserPreferencesProvider>
                    <AudioProvider>
                        <AuthProvider>
                            <UIProvider>
                                <NavigationProvider>
                                    {isInitialLoad ? (
                                        <BrandLoading onFinished={() => setIsInitialLoad(false)} />
                                    ) : (
                                        <>
                                            <MainContent />
                                            <ModalContainer />
                                        </>
                                    )}
                                </NavigationProvider>
                                {/* Global UI Components - Always rendered */}
                                <ToastContainer />
                                <LoadingOverlay />
                            </UIProvider>
                        </AuthProvider>
                    </AudioProvider>
                </UserPreferencesProvider>
            </div>
        </div>
    );
}

export default App;


