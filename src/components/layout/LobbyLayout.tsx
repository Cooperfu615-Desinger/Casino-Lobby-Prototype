import { useState } from 'react';
import { useUI } from '../../context/UIContext';

// Layout Components
import Header from './Header';
import NotificationTicker from './NotificationTicker';
import BottomNavigation, { ActiveTab } from './BottomNavigation';
import LobbyButtons from './LobbyButtons';
import GameGrid from './GameGrid';
import SettingsMenu from './SettingsMenu';

// Feature Overlays
import ChatInterface from '../features/ChatInterface';
import EventsInterface from '../features/EventsInterface';
import InboxInterface from '../features/InboxInterface';
import GiftsInterface from '../features/GiftsInterface';
import BankInterface from '../features/BankInterface';
import ClubInterface from '../features/ClubInterface';

// Modals
import UserModal from '../modals/UserModal';
import LanguageModal from '../modals/LanguageModal';

// Types
import type { Game } from '../../types';

interface LobbyLayoutProps {
    onPlayGame: (game: Game) => void;
}

const LobbyLayout = ({ onPlayGame }: LobbyLayoutProps) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('games');
    const [chatInitialTab, setChatInitialTab] = useState<'public' | 'chat' | 'support'>('chat');
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const [isUserModalOpen, setUserModalOpen] = useState(false);
    const [isLangModalOpen, setLangModalOpen] = useState(false);
    const { openModal } = useUI();

    const handleChatOpen = () => {
        setChatInitialTab('chat');
        setActiveTab('chat');
    };

    const handleTabChange = (tab: ActiveTab) => {
        setActiveTab(tab);
    };

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
                onOpenBank={() => setActiveTab('bank')}
                isSettingsOpen={isSettingsOpen}
            />

            {/* Notification Ticker */}
            <NotificationTicker />

            {/* Game Grid */}
            <GameGrid onPlayGame={onPlayGame} />

            {/* Lobby Floating Buttons */}
            <LobbyButtons />

            {/* Feature Overlays */}
            {activeTab === 'chat' && (
                <ChatInterface
                    key={chatInitialTab}
                    initialTab={chatInitialTab}
                    onClose={() => setActiveTab('games')}
                />
            )}
            {activeTab === 'events' && (
                <EventsInterface
                    onOpenSale={() => openModal('sale')}
                    onOpenTournament={() => openModal('tournament')}
                    onClose={() => setActiveTab('games')}
                />
            )}
            {activeTab === 'inbox' && (
                <InboxInterface onClose={() => setActiveTab('games')} />
            )}
            {activeTab === 'gifts' && (
                <GiftsInterface onClose={() => setActiveTab('games')} />
            )}
            {activeTab === 'bank' && (
                <BankInterface onClose={() => setActiveTab('games')} />
            )}
            {activeTab === 'club' && (
                <ClubInterface onClose={() => setActiveTab('games')} />
            )}

            {/* Bottom Navigation Bar */}
            <BottomNavigation
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onChatOpen={handleChatOpen}
            />
        </div>
    );
};

export default LobbyLayout;
