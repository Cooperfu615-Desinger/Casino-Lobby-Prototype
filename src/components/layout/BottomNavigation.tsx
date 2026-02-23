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

// Height of the nav bar in pixels
const NAV_HEIGHT = 80;

const BottomNavigation = () => {
    const { currentView, navigate, bankInitialTab, chatInitialTab } = useNavigation();
    const scrollRef = useRef<HTMLDivElement>(null);
    const isHandlingScroll = useRef(false);

    useEffect(() => {
        // Position to the middle set (index 1) so we can scroll in both directions
        const container = scrollRef.current;
        if (container) {
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

        if (container.scrollLeft < setWidth * 0.1) {
            isHandlingScroll.current = true;
            requestAnimationFrame(() => {
                container.scrollLeft += setWidth;
                isHandlingScroll.current = false;
            });
        } else if (container.scrollLeft > setWidth * 1.9) {
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

    const getIsActive = (id: string) => {
        if (id === 'support') return currentView === 'chat' && chatInitialTab === 'support';
        if (id === 'chat') return currentView === 'chat' && chatInitialTab !== 'support';
        if (id === 'vault') return currentView === 'bank' && bankInitialTab === 'vault';
        if (id === 'bank') return currentView === 'bank' && bankInitialTab !== 'vault';
        if (id === 'events') return currentView === 'events';
        if (id === 'inbox') return currentView === 'inbox';
        if (id === 'gifts') return currentView === 'gifts';
        return false;
    };

    // Each set of 8 buttons. Width is computed as viewport-width * 1, so 3 copies = 3x viewport
    const renderSet = (setIndex: number) => (
        <div
            key={`set-${setIndex}`}
            /* Each set takes exactly 100% of the scroll container's clientWidth */
            className="flex shrink-0 items-center"
            style={{ width: '100%', height: `${NAV_HEIGHT}px` }}
        >
            {NAV_ITEMS.map((item) => (
                <div
                    key={`${setIndex}-${item.id}`}
                    style={{ width: '12.5%', height: '100%' }}
                    className="flex justify-center items-center"
                >
                    <NavButton
                        icon={item.icon}
                        label={item.label}
                        active={getIsActive(item.id)}
                        colorTheme={item.colorTheme}
                        onClick={() => handleNavigation(item.id)}
                    />
                </div>
            ))}
        </div>
    );

    return (
        /*
         * The nav element sits at the bottom of the screen. 
         * We add extra height for the background gradient fade above.
         */
        <nav
            className="absolute left-0 right-0 bottom-0 z-40 pointer-events-none"
            style={{ height: `${NAV_HEIGHT + 20}px` }}
        >
            {/* Full-width ambient gradient behind the bar */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />

            {/* Full-width dark backdrop bar - sits at the bottom */}
            <div
                className="absolute left-0 right-0 bottom-0 bg-[#1a0b2e]/95 backdrop-blur-xl border-t border-white/10 shadow-2xl pointer-events-auto"
                style={{ height: `${NAV_HEIGHT}px` }}
            >
                {/*
                 * Inner constrained scroll viewport.
                 * max-w limits visible buttons to the center area between side promo buttons.
                 * overflow-hidden clips the duplicate sets so only 8 are visible at once.
                 */}
                <div
                    className="mx-auto h-full overflow-hidden"
                    style={{ maxWidth: 'calc(100% - 220px)' }}
                >
                    {/* Scrollable track: contains 3 identical sets of 8, width = 3 × parent width */}
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="flex h-full touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overflow-x-auto"
                    /* The track's content width = 3 sets, each set is clientWidth wide */
                    >
                        {renderSet(0)}
                        {renderSet(1)}
                        {renderSet(2)}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default BottomNavigation;
