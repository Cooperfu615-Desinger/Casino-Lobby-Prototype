import { useState } from 'react';
import { useNavigation } from '../../hooks/useNavigation';

// Layout Components
import Header from './Header';
import NotificationTicker from './NotificationTicker';
import BottomNavigation from './BottomNavigation';
import LobbyButtons from './LobbyButtons';
import CategorySidebar from './CategorySidebar';
import GameGrid from './GameGrid';
import SettingsMenu from './SettingsMenu';

// Feature Overlays
import ChatInterface from '../features/ChatInterface';
import EventsInterface from '../features/EventsInterface';
import InboxInterface from '../features/InboxInterface';
import GiftsInterface from '../features/GiftsInterface';
import BankInterface from '../features/BankInterface';


// Modals
import UserModal from '../modals/UserModal';
import LanguageModal from '../modals/LanguageModal';

// Types
import type { Game } from '../../types';

interface LobbyLayoutProps {
    onPlayGame: (game: Game) => void;
}

const LobbyLayout = ({ onPlayGame }: LobbyLayoutProps) => {
    const { currentView, chatInitialTab, bankInitialTab, eventsInitialTab, goToGames } = useNavigation();
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const [isUserModalOpen, setUserModalOpen] = useState(false);
    const [isLangModalOpen, setLangModalOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    return (
        <div className="relative w-full h-full bg-[#1a0b2e] overflow-hidden font-sans selection:bg-[#FFD700] selection:text-black shadow-2xl border border-slate-800">

            {/* Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#4B0082] via-[#240046] to-[#100020]"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>

            {/* Modal Overlays */}
            {isSettingsOpen && <SettingsMenu onOpenLanguage={() => setLangModalOpen(true)} />}
            {isUserModalOpen && <UserModal onClose={() => setUserModalOpen(false)} />}
            {isLangModalOpen && <LanguageModal onClose={() => setLangModalOpen(false)} />}

            {/* Header */}
            <Header
                onOpenUserModal={() => setUserModalOpen(true)}
                onOpenSettings={() => setSettingsOpen(!isSettingsOpen)}
                isSettingsOpen={isSettingsOpen}
            />

            {/* Notification Ticker */}
            <NotificationTicker />

            {/* Category Sidebar */}
            <CategorySidebar
                isOpen={isCategoryOpen}
                onToggle={() => setIsCategoryOpen(!isCategoryOpen)}
            />

            {/* Game Grid */}
            <GameGrid
                onPlayGame={onPlayGame}
                isCategoryOpen={isCategoryOpen}
            />

            {/* Lobby Floating Buttons */}
            <LobbyButtons />

            {/* Feature Overlays - using NavigationContext */}
            {currentView === 'chat' && (
                <ChatInterface
                    key={chatInitialTab}
                    initialTab={chatInitialTab}
                    onClose={goToGames}
                />
            )}
            {currentView === 'events' && (
                <EventsInterface
                    key={eventsInitialTab}
                    initialTab={eventsInitialTab}
                    onClose={goToGames}
                />
            )}
            {currentView === 'inbox' && (
                <InboxInterface onClose={goToGames} />
            )}
            {currentView === 'gifts' && (
                <GiftsInterface onClose={goToGames} />
            )}
            {currentView === 'bank' && (
                <BankInterface onClose={goToGames} initialTab={bankInitialTab} />
            )}
            {/* Phase 1: Club feature hidden
            {currentView === 'club' && (
                <ClubInterface onClose={goToGames} />
            )}
            */}

            {/* Bottom Navigation Bar */}
            <BottomNavigation />
        </div>
    );
};

export default LobbyLayout;
