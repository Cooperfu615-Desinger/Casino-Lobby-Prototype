import { Calendar, Mail, Landmark, Gift, Shield, MessageCircle } from 'lucide-react';
import NavButton from '../common/NavButton';

export type ActiveTab = 'games' | 'chat' | 'events' | 'inbox' | 'bank' | 'gifts' | 'club';

interface BottomNavigationProps {
    activeTab: ActiveTab;
    onTabChange: (tab: ActiveTab) => void;
    onChatOpen: () => void;
}

const BottomNavigation = ({ activeTab, onTabChange, onChatOpen }: BottomNavigationProps) => {
    return (
        <nav className="absolute bottom-[15px] left-0 right-0 h-[88px] bg-gradient-to-t from-black via-black/95 to-transparent z-40 flex items-end pb-0 justify-center">
            <div className="flex h-[72px] items-end bg-[#1a0b2e]/90 backdrop-blur-xl rounded-t-3xl border-t border-white/10 px-6 shadow-2xl justify-center gap-6">
                <NavButton
                    icon={MessageCircle}
                    label="Chat"
                    active={activeTab === 'chat'}
                    colorTheme="from-blue-400 to-blue-600"
                    onClick={onChatOpen}
                />
                <NavButton
                    icon={Calendar}
                    label="Events"
                    active={activeTab === 'events'}
                    colorTheme="from-orange-500 to-red-500"
                    onClick={() => onTabChange('events')}
                />
                <NavButton
                    icon={Mail}
                    label="Inbox"
                    active={activeTab === 'inbox'}
                    colorTheme="from-emerald-400 to-green-600"
                    onClick={() => onTabChange('inbox')}
                />
                <NavButton
                    icon={Landmark}
                    label="Bank"
                    active={activeTab === 'bank'}
                    colorTheme="from-yellow-400 to-amber-600"
                    onClick={() => onTabChange('bank')}
                />
                <NavButton
                    icon={Gift}
                    label="Gifts"
                    active={activeTab === 'gifts'}
                    colorTheme="from-pink-500 to-rose-500"
                    onClick={() => onTabChange('gifts')}
                />
                <NavButton
                    icon={Shield}
                    label="Club"
                    active={activeTab === 'club'}
                    colorTheme="from-cyan-400 to-teal-600"
                    onClick={() => onTabChange('club')}
                />
            </div>
        </nav>
    );
};

export default BottomNavigation;
