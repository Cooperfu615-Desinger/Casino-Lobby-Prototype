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

// The vertical height of the visible button area (px)
const NAV_H = 70;

// Horizontal offset from screen edges to dodge the side promo buttons (px)
// Matches LobbyButtons: left-12 (48px) + scale-150 visual spread
const SIDE_OFFSET = 145;

// Width of the semi-transparent fade mask on each edge (px)
const FADE_W = 48;

const BottomNavigation = () => {
    const { currentView, navigate, bankInitialTab, chatInitialTab } = useNavigation();
    const scrollRef = useRef<HTMLDivElement>(null);
    const isHandlingScroll = useRef(false);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;
        // Position to middle set so infinite scroll works in both directions
        setTimeout(() => {
            container.scrollLeft = container.scrollWidth / 3;
        }, 0);
    }, []);

    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
        if (isHandlingScroll.current) return;
        const el = e.currentTarget;
        const setW = el.scrollWidth / 3;

        if (el.scrollLeft < setW * 0.1) {
            isHandlingScroll.current = true;
            requestAnimationFrame(() => { el.scrollLeft += setW; isHandlingScroll.current = false; });
        } else if (el.scrollLeft > setW * 1.9) {
            isHandlingScroll.current = true;
            requestAnimationFrame(() => { el.scrollLeft -= setW; isHandlingScroll.current = false; });
        }
    };

    const handleNav = (id: string) => {
        switch (id) {
            case 'chat': navigate('chat', { chatTab: 'chat' }); break;
            case 'tasks': console.log('Open Daily Tasks'); break;
            case 'events': navigate('events'); break;
            case 'bank': navigate('bank', { bankTab: 'deposit' }); break;
            case 'vault': navigate('bank', { bankTab: 'vault' }); break;
            case 'inbox': navigate('inbox'); break;
            case 'gifts': navigate('gifts'); break;
            case 'support': navigate('chat', { chatTab: 'support' }); break;
        }
    };

    const isActive = (id: string) => {
        if (id === 'support') return currentView === 'chat' && chatInitialTab === 'support';
        if (id === 'chat') return currentView === 'chat' && chatInitialTab !== 'support';
        if (id === 'vault') return currentView === 'bank' && bankInitialTab === 'vault';
        if (id === 'bank') return currentView === 'bank' && bankInitialTab !== 'vault';
        return currentView === id;
    };

    /**
     * Each "set" of 8 buttons fills exactly the scroll container's clientWidth.
     * With 3 identical sets, scrollWidth = 3 × clientWidth, enabling infinite loop.
     */
    const renderSet = (setIndex: number) => (
        <div
            key={`s${setIndex}`}
            className="shrink-0 flex items-center"
            // Must be 100% of the *scroll container's* width — inline style avoids Tailwind JIT issues
            style={{ width: '100%', height: `${NAV_H}px` }}
        >
            {NAV_ITEMS.map((item) => (
                <div
                    key={`${setIndex}-${item.id}`}
                    style={{ width: '12.5%', height: '100%' }}
                    className="flex items-center justify-center"
                >
                    <NavButton
                        icon={item.icon}
                        label={item.label}
                        active={isActive(item.id)}
                        colorTheme={item.colorTheme}
                        onClick={() => handleNav(item.id)}
                    />
                </div>
            ))}
        </div>
    );

    return (
        /**
         * Outer nav: fully transparent, absolute positioned.
         * Covers only the floating button area (dodging side promo buttons).
         * pointer-events-none on nav, re-enabled on scroll container.
         */
        <nav
            className="absolute z-50 pointer-events-none"
            style={{
                bottom: '15px',
                left: `${SIDE_OFFSET}px`,
                right: `${SIDE_OFFSET}px`,
                height: `${NAV_H}px`,
            }}
        >
            {/* Scroll viewport — clips buttons outside the 8-slot window */}
            <div
                className="relative w-full h-full overflow-hidden pointer-events-auto"
            >
                {/* Scrollable track: 3 sets wide */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex h-full overflow-x-auto touch-pan-x
                        [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {renderSet(0)}
                    {renderSet(1)}
                    {renderSet(2)}
                </div>

                {/*
                 * Semi-transparent fade masks on left & right edges.
                 * They blend buttons smoothly into the background instead of hard-clipping.
                 * z-10 keeps them above buttons; pointer-events-none lets clicks pass through.
                 */}
                <div
                    className="absolute top-0 left-0 bottom-0 pointer-events-none z-10"
                    style={{
                        width: `${FADE_W}px`,
                        background: 'linear-gradient(to right, rgba(26,11,46,0.85) 0%, transparent 100%)',
                    }}
                />
                <div
                    className="absolute top-0 right-0 bottom-0 pointer-events-none z-10"
                    style={{
                        width: `${FADE_W}px`,
                        background: 'linear-gradient(to left, rgba(26,11,46,0.85) 0%, transparent 100%)',
                    }}
                />
            </div>
        </nav>
    );
};

export default BottomNavigation;
