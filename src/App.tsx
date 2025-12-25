import { useState } from 'react';
import {
    Menu, Plus, Crown, User as UserIcon, Megaphone,
    Gift, Coins, ChevronLeft, ChevronRight, Headphones,
    PiggyBank, Gamepad2, Calendar, Mail, Landmark, Shield,
    MessageCircle
} from 'lucide-react';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import LoginScreen from './components/LoginScreen';
import GameRoom from './components/GameRoom';
import GameCard from './components/GameCard';
import NavButton from './components/NavButton';
import FloatingWidget from './components/FloatingWidget';
import ActionButton from './components/ActionButton';
import SettingsMenu from './components/SettingsMenu';
import SaleModal from './components/SaleModal';
import TournamentModal from './components/TournamentModal';
import UserModal from './components/UserModal';
import EventsInterface from './components/EventsInterface';
import BankInterface from './components/BankInterface';
import ChatInterface from './components/ChatInterface';
import ClubInterface from './components/ClubInterface';
import InboxInterface from './components/InboxInterface';
import GiftsInterface from './components/GiftsInterface';
import LanguageModal from './components/LanguageModal';

// Data
import { GAMES, Game } from './data/mockData';

type ActiveTab = 'games' | 'chat' | 'events' | 'inbox' | 'bank' | 'gifts' | 'club';

// Internal Component: The Original Casino Lobby
interface CasinoLandscapeProps {
    onPlayGame: (game: Game) => void;
}

function CasinoLandscape({ onPlayGame }: CasinoLandscapeProps) {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<ActiveTab>('games');
    const [chatInitialTab, setChatInitialTab] = useState<'public' | 'chat' | 'support'>('chat');
    const [isSaleOpen, setSaleOpen] = useState(false);
    const [isTournamentOpen, setTournamentOpen] = useState(false);
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const [isUserModalOpen, setUserModalOpen] = useState(false);
    const [isLangModalOpen, setLangModalOpen] = useState(false);

    const renderContent = () => {
        switch (activeTab) {
            case 'chat': return <ChatInterface key={chatInitialTab} initialTab={chatInitialTab} />;
            case 'inbox': return <InboxInterface />;
            case 'gifts': return <GiftsInterface />;
            case 'bank': return <BankInterface />;
            case 'club': return <ClubInterface />;
            case 'events':
                return (
                    <EventsInterface
                        onOpenSale={() => setSaleOpen(true)}
                        onOpenTournament={() => setTournamentOpen(true)}
                    />
                );
            case 'games':
            default: return (
                <>
                    <main className="absolute top-[130px] bottom-[90px] left-0 right-0 overflow-x-auto overflow-y-hidden flex items-center px-12 no-scrollbar">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 animate-pulse">
                            <ChevronLeft className="text-white/40 drop-shadow-lg" size={48} />
                        </div>
                        <div className="grid grid-rows-[180px_180px] grid-flow-col gap-4 py-4 px-8 overflow-x-auto no-scrollbar w-full h-full content-center pt-8 auto-cols-max">
                            {GAMES.map(game => (
                                <GameCard
                                    key={game.id}
                                    game={game}
                                    onClick={() => onPlayGame(game)}
                                    className={`${game.size === 'large' ? 'row-span-2' : ''}`}
                                />
                            ))}
                        </div>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 animate-pulse">
                            <ChevronRight className="text-white/40 drop-shadow-lg" size={48} />
                        </div>
                    </main>

                    <FloatingWidget side="left" label="豬幫出動!" color="bg-pink-600">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-4 border-white shadow-[0_0_20px_#FF69B4] flex items-center justify-center relative transform hover:rotate-12 transition-transform">
                            <PiggyBank size={40} className="text-white drop-shadow-md" />
                            <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full border border-white shadow-sm">X2</div>
                        </div>
                    </FloatingWidget>

                    <FloatingWidget side="right" label="首儲好禮">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-red-500 to-red-800 border-2 border-[#FFD700] shadow-xl flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform">
                            <Gift size={32} className="text-[#FFD700]" />
                        </div>
                    </FloatingWidget>

                    <FloatingWidget side="bottom-right">
                        <div
                            onClick={() => {
                                setChatInitialTab('support');
                                setActiveTab('chat');
                            }}
                            className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 border-4 border-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                        >
                            <Headphones size={36} className="text-white" />
                        </div>
                    </FloatingWidget>
                </>
            );
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black p-4">

            {/* 1280x720 Fixed Resolution Container */}
            <div
                className="relative bg-[#1a0b2e] overflow-hidden font-sans selection:bg-[#FFD700] selection:text-black shadow-2xl border border-slate-800"
                style={{ width: '1280px', height: '720px' }}
            >

                {/* Background Texture */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#4B0082] via-[#240046] to-[#100020]"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>

                {/* Modal Overlays */}
                {isSaleOpen && <SaleModal onClose={() => setSaleOpen(false)} />}
                {isTournamentOpen && <TournamentModal onClose={() => setTournamentOpen(false)} />}
                {isSettingsOpen && <SettingsMenu onOpenLanguage={() => setLangModalOpen(true)} />}
                {isUserModalOpen && <UserModal onClose={() => setUserModalOpen(false)} />}
                {isLangModalOpen && <LanguageModal onClose={() => setLangModalOpen(false)} />}

                {/* Header */}
                <header className="absolute top-0 left-0 right-0 h-[88px] flex justify-between items-center px-6 z-40 bg-gradient-to-b from-black/90 to-transparent pointer-events-none">

                    {/* Left: User Info */}
                    <div
                        onClick={() => setUserModalOpen(true)}
                        className="pointer-events-auto flex items-center gap-4 w-[350px] cursor-pointer hover:brightness-110 transition-all"
                    >
                        <div className="relative group">
                            <div className="w-16 h-16 rounded-full border-2 border-[#FFD700] overflow-hidden bg-slate-800 shadow-[0_0_15px_#FFD700]">
                                <div className={`w-full h-full ${user?.avatar || 'bg-slate-600'} flex items-center justify-center`}>
                                    <UserIcon className="text-white" size={36} />
                                </div>
                            </div>
                            <div className="absolute -top-2 -right-1 bg-gradient-to-b from-[#FFD700] to-[#DAA520] p-1.5 rounded-full shadow-sm border border-white/30">
                                <Crown size={14} className="text-black fill-current" />
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 bg-black/80 rounded-full border border-white/10 p-0.5">
                                <div className="h-2 w-3/4 bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-[0_0_5px_#00ff00]"></div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-white font-bold text-lg drop-shadow-md tracking-wide truncate max-w-[200px]">
                                {user?.name || 'Loading...'}
                            </span>
                            <span className="text-[#FFD700] text-sm font-mono font-bold">VIP {user?.vipLevel || 0}</span>
                        </div>
                    </div>

                    {/* Center: BUY & SALE Buttons */}
                    <div className="pointer-events-auto flex items-center gap-6 transform translate-y-2">
                        <ActionButton label="BUY" type="buy" onClick={() => setActiveTab('bank')} />
                        <ActionButton label="SALE" type="sale" onClick={() => setSaleOpen(true)} />
                    </div>

                    {/* Right: Currency & Menu */}
                    <div className="pointer-events-auto flex items-center justify-end gap-4 w-[350px]">
                        <div className="bg-black/60 border border-[#FFD700]/50 rounded-full pl-4 pr-1 py-1.5 flex items-center gap-3 shadow-lg">
                            <Coins className="text-[#FFD700] fill-current" size={20} />
                            <span className="text-white font-mono font-bold text-xl tracking-wide">
                                {user?.balance.toLocaleString() || '0'}
                            </span>
                            <button
                                onClick={() => setActiveTab('bank')}
                                className="bg-gradient-to-b from-green-400 to-green-600 rounded-full p-1.5 hover:brightness-110 active:scale-95 transition-all shadow-lg border border-white/20"
                            >
                                <Plus size={18} className="text-white stroke-[3]" />
                            </button>
                        </div>

                        <button
                            onClick={() => setSettingsOpen(!isSettingsOpen)}
                            className={`bg-black/40 p-2.5 rounded-xl border border-white/10 hover:bg-white/10 active:scale-95 transition-colors ${isSettingsOpen ? 'bg-white/20 border-white/30 text-white' : 'text-slate-200'}`}
                        >
                            <Menu size={28} />
                        </button>
                    </div>
                </header>

                {/* Notification Ticker */}
                <div className="absolute top-[88px] left-0 right-0 z-30 bg-black/50 backdrop-blur-sm border-y border-white/5 h-9 flex items-center overflow-hidden">
                    <Megaphone size={16} className="text-[#FFD700] ml-6 flex-shrink-0 animate-pulse" />
                    <div className="overflow-hidden w-full ml-4">
                        <p className="text-white text-sm whitespace-nowrap animate-marquee font-medium tracking-wide">
                            恭喜玩家 <span className="text-[#FFD700]">奧黛麗一本123456789</span> 在 <span className="text-green-400">Lucky Tiger Rush</span> 贏得 GRAND JACKPOT $50,000！  •  限時活動：充值回饋 200%！  •  恭喜玩家 <span className="text-[#FFD700]">Tom888</span> 獲得首儲好禮！
                        </p>
                    </div>
                </div>

                {/* Dynamic Content Area */}
                {renderContent()}

                {/* Bottom Navigation Bar */}
                <nav className="absolute bottom-0 left-0 right-0 h-[88px] bg-gradient-to-t from-black via-black/95 to-transparent z-40 flex items-end pb-0 justify-center">
                    <div className="flex h-[72px] items-end bg-[#1a0b2e]/90 backdrop-blur-xl rounded-t-3xl border-t border-white/10 px-4 shadow-2xl w-full max-w-4xl justify-between gap-1">
                        <NavButton
                            icon={Gamepad2}
                            label="Games"
                            active={activeTab === 'games'}
                            colorTheme="from-purple-500 to-indigo-500"
                            onClick={() => setActiveTab('games')}
                        />
                        <NavButton
                            icon={MessageCircle}
                            label="Chat"
                            active={activeTab === 'chat'}
                            colorTheme="from-blue-400 to-blue-600"
                            onClick={() => {
                                setChatInitialTab('chat');
                                setActiveTab('chat');
                            }}
                        />
                        <NavButton
                            icon={Calendar}
                            label="Events"
                            active={activeTab === 'events'}
                            colorTheme="from-orange-500 to-red-500"
                            onClick={() => setActiveTab('events')}
                        />
                        <NavButton
                            icon={Mail}
                            label="Inbox"
                            active={activeTab === 'inbox'}
                            colorTheme="from-emerald-400 to-green-600"
                            onClick={() => setActiveTab('inbox')}
                        />
                        <NavButton
                            icon={Landmark}
                            label="Bank"
                            active={activeTab === 'bank'}
                            colorTheme="from-yellow-400 to-amber-600"
                            onClick={() => setActiveTab('bank')}
                        />
                        <NavButton
                            icon={Gift}
                            label="Gifts"
                            active={activeTab === 'gifts'}
                            colorTheme="from-pink-500 to-rose-500"
                            onClick={() => setActiveTab('gifts')}
                        />
                        <NavButton
                            icon={Shield}
                            label="Club"
                            active={activeTab === 'club'}
                            colorTheme="from-cyan-400 to-teal-600"
                            onClick={() => setActiveTab('club')}
                        />
                    </div>
                </nav>
            </div>
        </div>
    );
}

// Wrapper component to handle routing based on auth state
const MainContent = () => {
    const { isAuthenticated } = useAuth();
    const [activeGame, setActiveGame] = useState<Game | null>(null);

    if (!isAuthenticated) return <LoginScreen />;

    if (activeGame) {
        return <GameRoom game={activeGame} onExit={() => setActiveGame(null)} />;
    }

    return <CasinoLandscape onPlayGame={setActiveGame} />;
};

function App() {
    return (
        <AuthProvider>
            <MainContent />
        </AuthProvider>
    );
}

export default App;
