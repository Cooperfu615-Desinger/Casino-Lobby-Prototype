import { useRef, useEffect, UIEvent } from 'react';
import { Calendar, Mail, Landmark, Gift, MessageCircle, CheckSquare, Shield, Headphones } from 'lucide-react';
import NavButton from '../common/NavButton';
import { useNavigation } from '../../hooks/useNavigation';

const NAV_ITEMS = [
    { id: 'chat', label: '聊天', icon: MessageCircle, colorTheme: 'from-blue-400 to-blue-600' },
    { id: 'tasks', label: '每日任務', icon: CheckSquare, colorTheme: 'from-purple-400 to-purple-600' },
    { id: 'events', label: '活動', icon: Calendar, colorTheme: 'from-orange-500 to-red-500' },
    { id: 'bank', label: '銀行', icon: Landmark, colorTheme: 'from-yellow-400 to-amber-600' },
    { id: 'vault', label: '保險箱', icon: Shield, colorTheme: 'from-cyan-400 to-teal-600' },
    { id: 'inbox', label: '信箱', icon: Mail, colorTheme: 'from-emerald-400 to-green-600' },
    { id: 'gifts', label: '禮物', icon: Gift, colorTheme: 'from-pink-500 to-rose-500' },
    { id: 'support', label: '客服', icon: Headphones, colorTheme: 'from-indigo-400 to-indigo-600' }
];

const BottomNavigation = () => {
    const { currentView, navigate, bankInitialTab, chatInitialTab } = useNavigation();
    const scrollRef = useRef<HTMLDivElement>(null);
    const isHandlingScroll = useRef(false);

    useEffect(() => {
        // Initial positioning to the middle set (index 1)
        const container = scrollRef.current;
        if (container) {
            // Wait for next tick so layout is ready
            setTimeout(() => {
                const setWidth = container.scrollWidth / 3;
                container.scrollLeft = setWidth;
            }, 0);
        }
    }, []);

    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
        if (isHandlingScroll.current) return;

        const container = e.currentTarget;
        const setWidth = container.scrollWidth / 3;

        // If user scrolls left into the first set, jump to middle set
        if (container.scrollLeft < setWidth * 0.1) {
            isHandlingScroll.current = true;
            requestAnimationFrame(() => {
                container.scrollLeft += setWidth;
                isHandlingScroll.current = false;
            });
        }
        // If user scrolls right into the third set, jump back to middle set
        else if (container.scrollLeft > setWidth * 1.9) {
            isHandlingScroll.current = true;
            requestAnimationFrame(() => {
                container.scrollLeft -= setWidth;
                isHandlingScroll.current = false;
            });
        }
    };

    const handleNavigation = (id: string) => {
        switch (id) {
            case 'chat': navigate('chat', { chatTab: 'chat' }); break;
            case 'tasks': console.log('Open Daily Tasks'); break;
            case 'events': navigate('events'); break;
            case 'bank': navigate('bank', { bankTab: 'deposit' }); break;
            case 'vault': navigate('bank', { bankTab: 'vault' }); break;
            case 'inbox': navigate('inbox'); break;
            case 'gifts': navigate('gifts'); break;
            case 'support': navigate('chat', { chatTab: 'support' }); break;
            default: break;
        }
    };

    const renderItems = (setIndex: number) => {
        return (
            <div key={`set-${setIndex}`} className="flex shrink-0 w-full h-full items-end justify-between px-2 sm:px-4">
                {NAV_ITEMS.map((item) => {
                    const isActive =
                        (currentView === 'chat' && item.id === 'support' && chatInitialTab === 'support') ? true :
                            (currentView === 'chat' && item.id === 'chat' && chatInitialTab !== 'support') ? true :
                                (currentView === 'bank' && item.id === 'vault' && bankInitialTab === 'vault') ? true :
                                    (currentView === 'bank' && item.id === 'bank' && bankInitialTab !== 'vault') ? true :
                                        (currentView === 'events' && item.id === 'events') ? true :
                                            (currentView === 'inbox' && item.id === 'inbox') ? true :
                                                (currentView === 'gifts' && item.id === 'gifts') ? true : false;

                    return (
                        <div key={`${setIndex}-${item.id}`} className="shrink-0 w-[64px] flex justify-center snap-center">
                            <NavButton
                                icon={item.icon}
                                label={item.label}
                                active={isActive}
                                colorTheme={item.colorTheme}
                                onClick={() => handleNavigation(item.id)}
                            />
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <nav className="absolute bottom-[15px] left-0 right-0 px-4 h-[88px] bg-gradient-to-t from-black via-black/95 to-transparent z-40 flex items-end pb-0 justify-center pointer-events-none">
            {/* The outer wrapper restores the full-width dark backdrop design */}
            <div className="flex h-[72px] items-end bg-[#1a0b2e]/90 backdrop-blur-xl rounded-t-3xl border-t border-white/10 shadow-2xl relative w-full pointer-events-auto">
                {/* 
                  The inner wrapper provides the constrained viewport for scrolling.
                  It limits the visual slide track to 800px so buttons don't clip under the side promotion buttons.
                */}
                <div className="relative w-full max-w-[800px] h-full mx-auto overflow-hidden">
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="flex overflow-x-auto snap-x snap-mandatory pt-2 w-full h-[88px] pb-4 items-end [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x"
                    >
                        {renderItems(0)}
                        {renderItems(1)}
                        {renderItems(2)}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default BottomNavigation;
