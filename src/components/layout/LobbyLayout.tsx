import { useState } from 'react';
import { useNavigation } from '../../hooks/useNavigation';

// Layout Components
import Header from './Header';
import NotificationTicker from './NotificationTicker';
import BottomNavigation from './BottomNavigation';
import LobbyButtons from './LobbyButtons';
import JpNotification from './JpNotification';
import CategorySidebar, { LOBBY_CATEGORIES, type LobbyCategoryId } from './CategorySidebar';
import GameGrid from './GameGrid';
import SettingsMenu from './SettingsMenu';

// Feature Overlays
import ChatInterface from '../features/ChatInterface';
import EventsInterface from '../features/EventsInterface';
import InboxInterface from '../features/InboxInterface';
import GiftsInterface from '../features/GiftsInterface';
import BankInterface from '../features/BankInterface';
import VaultInterface from '../features/VaultInterface';


// Modals
import UserModal from '../modals/UserModal';
import LanguageModal from '../modals/LanguageModal';
import TermsModal, { type TermsTab } from '../modals/TermsModal';
import GameLaunchModal from '../modals/GameLaunchModal';
import SeatSelectionModal from '../modals/SeatSelectionModal';
import { useUserPreferences } from '../../context/UserPreferencesContext';
import useRecentGames from '../../hooks/useRecentGames';

// Types
import type { Game, GameSeat, GameSession, GameWalletKey } from '../../types';

interface LobbyLayoutProps {
    onPlayGame: (session: GameSession) => void;
}

const LobbyLayout = ({ onPlayGame }: LobbyLayoutProps) => {
    const {
        currentView,
        chatInitialTab,
        bankInitialTab,
        vaultInitialTab,
        vaultReceiverId,
        eventsInitialTab,
        chatTarget,
        supportDraft,
        goToGames,
    } = useNavigation();
    const { themeMode } = useUserPreferences();
    const { recentGameIds, recordRecentGame } = useRecentGames();
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const [isUserModalOpen, setUserModalOpen] = useState(false);
    const [isLangModalOpen, setLangModalOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<LobbyCategoryId>('all');
    const [legalTab, setLegalTab] = useState<TermsTab | null>(null);
    const [launchGame, setLaunchGame] = useState<Game | null>(null);
    const [seatSelection, setSeatSelection] = useState<{ game: Game; wallet: GameWalletKey } | null>(null);

    const categoryCounts = LOBBY_CATEGORIES.reduce<Partial<Record<LobbyCategoryId, number>>>((counts, category) => {
        if (!category.gameCategory) {
            counts[category.id] = category.id === 'all' ? 22 : category.id === 'event' ? 6 : 0;
            return counts;
        }

        counts[category.id] = counts[category.id] ?? 0;
        counts[category.id] = category.gameCategory === 'slot'
            ? 17
            : category.gameCategory === 'card'
                ? 3
                : 2;
        return counts;
    }, {});

    const backgroundGradient = themeMode === 'day'
        ? 'from-[#6dcbff] via-[#8b7bff] to-[#f4c36f]'
        : 'from-[#4B0082] via-[#240046] to-[#100020]';
    const ambientGlow = themeMode === 'day'
        ? 'bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.28),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(255,213,128,0.18),_transparent_30%)]'
        : 'bg-[radial-gradient(circle_at_top_right,_rgba(255,215,0,0.12),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(168,85,247,0.16),_transparent_32%)]';

    const handleGameCardClick = (game: Game) => {
        recordRecentGame(game.id);
        setLaunchGame(game);
    };

    const handleQuickPlay = (wallet: GameWalletKey) => {
        if (!launchGame) return;
        onPlayGame({ game: launchGame, wallet });
        setLaunchGame(null);
    };

    const handleOpenSeatSelection = (wallet: GameWalletKey) => {
        if (!launchGame) return;
        setSeatSelection({ game: launchGame, wallet });
        setLaunchGame(null);
    };

    const handleEnterSeat = (seat: GameSeat) => {
        if (!seatSelection) return;
        onPlayGame({ game: seatSelection.game, wallet: seatSelection.wallet, seat });
        setSeatSelection(null);
    };

    return (
        <div className="relative w-full h-full bg-[#1a0b2e] overflow-hidden font-sans selection:bg-[#FFD700] selection:text-black shadow-2xl border border-slate-800">

            {/* Background Texture */}
            <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${backgroundGradient}`}></div>
            <div className={`absolute inset-0 ${ambientGlow}`}></div>
            <div className={`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] ${themeMode === 'day' ? 'opacity-10 mix-blend-soft-light' : 'opacity-20'}`}></div>

            {/* Modal Overlays */}
            {isSettingsOpen && (
                <>
                    <button
                        type="button"
                        aria-label="關閉設定選單"
                        className="absolute inset-0 z-[95] cursor-default"
                        onClick={() => setSettingsOpen(false)}
                    />
                    <SettingsMenu
                        onOpenLanguage={() => setLangModalOpen(true)}
                        onOpenLegal={() => setLegalTab('terms')}
                        onCloseMenu={() => setSettingsOpen(false)}
                    />
                </>
            )}
            {isUserModalOpen && <UserModal onClose={() => setUserModalOpen(false)} />}
            {isLangModalOpen && <LanguageModal onClose={() => setLangModalOpen(false)} />}
            {legalTab && (
                <TermsModal
                    initialTab={legalTab}
                    title="平台文件總覽"
                    readOnly
                    confirmLabel="我知道了"
                    onClose={() => setLegalTab(null)}
                />
            )}
            {launchGame && (
                <GameLaunchModal
                    game={launchGame}
                    onQuickPlay={handleQuickPlay}
                    onChooseSeat={handleOpenSeatSelection}
                    onClose={() => setLaunchGame(null)}
                />
            )}
            {seatSelection && (
                <SeatSelectionModal
                    game={seatSelection.game}
                    wallet={seatSelection.wallet}
                    onClose={() => setSeatSelection(null)}
                    onEnterSeat={handleEnterSeat}
                />
            )}

            {/* Header */}
            <Header
                onOpenUserModal={() => setUserModalOpen(true)}
                onOpenSettings={() => setSettingsOpen(!isSettingsOpen)}
                isSettingsOpen={isSettingsOpen}
            />

            {/* Notification Ticker */}
            <NotificationTicker />

            {/* JP Winner Floating Notification */}
            <JpNotification />

            {/* Category Sidebar */}
            <CategorySidebar
                isOpen={isCategoryOpen}
                onToggle={() => setIsCategoryOpen(!isCategoryOpen)}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                categoryCounts={categoryCounts}
            />

            {/* Game Grid */}
            <GameGrid
                onPlayGame={handleGameCardClick}
                activeCategory={activeCategory}
                recentGameIds={recentGameIds}
            />

            {/* Lobby Floating Buttons */}
            <LobbyButtons />

            {/* Feature Overlays - using NavigationContext */}
            {currentView === 'chat' && (
                <ChatInterface
                    key={`${chatInitialTab}-${chatTarget?.playerId || supportDraft?.title || 'default'}`}
                    initialTab={chatInitialTab}
                    initialTargetPlayer={chatTarget}
                    supportDraft={supportDraft}
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
            {currentView === 'vault' && (
                <VaultInterface
                    key={`${vaultInitialTab}-${vaultReceiverId || 'default'}`}
                    onClose={goToGames}
                    initialTab={vaultInitialTab}
                    receiverId={vaultReceiverId}
                />
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
