import { Calendar, Mail, Landmark, Gift, Shield, MessageCircle } from 'lucide-react';
import NavButton from '../common/NavButton';
import { useNavigation, ViewType } from '../../hooks/useNavigation';

const BottomNavigation = () => {
    const { currentView, navigate } = useNavigation();

    const handleNavigation = (view: ViewType) => {
        if (view === 'chat') {
            navigate('chat', { chatTab: 'chat' });
        } else {
            navigate(view);
        }
    };

    return (
        <nav className="absolute bottom-[15px] left-0 right-0 h-[88px] bg-gradient-to-t from-black via-black/95 to-transparent z-40 flex items-end pb-0 justify-center">
            <div className="flex h-[72px] items-end bg-[#1a0b2e]/90 backdrop-blur-xl rounded-t-3xl border-t border-white/10 px-6 shadow-2xl justify-center gap-6">
                <NavButton
                    icon={MessageCircle}
                    label="Chat"
                    active={currentView === 'chat'}
                    colorTheme="from-blue-400 to-blue-600"
                    onClick={() => handleNavigation('chat')}
                />
                <NavButton
                    icon={Calendar}
                    label="Events"
                    active={currentView === 'events'}
                    colorTheme="from-orange-500 to-red-500"
                    onClick={() => handleNavigation('events')}
                />
                <NavButton
                    icon={Mail}
                    label="Inbox"
                    active={currentView === 'inbox'}
                    colorTheme="from-emerald-400 to-green-600"
                    onClick={() => handleNavigation('inbox')}
                />
                <NavButton
                    icon={Landmark}
                    label="Bank"
                    active={currentView === 'bank'}
                    colorTheme="from-yellow-400 to-amber-600"
                    onClick={() => handleNavigation('bank')}
                />
                <NavButton
                    icon={Gift}
                    label="Gifts"
                    active={currentView === 'gifts'}
                    colorTheme="from-pink-500 to-rose-500"
                    onClick={() => handleNavigation('gifts')}
                />
                <NavButton
                    icon={Shield}
                    label="Club"
                    active={currentView === 'club'}
                    colorTheme="from-cyan-400 to-teal-600"
                    onClick={() => handleNavigation('club')}
                />
            </div>
        </nav>
    );
};

export default BottomNavigation;
