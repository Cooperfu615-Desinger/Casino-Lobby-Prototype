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

/**
 * Layout constants — all in px.
 *
 * The promo buttons (LobbyButtons) use:
 *   - bottom-12 = 48px from bottom edge
 *   - scale-150 from their respective bottom corners
 *   - Left icon: w-20 (80px) × 1.5 = 120px visual width + label
 *   - Right icon: w-16 (64px) × 1.5 = 96px visual width + label
 *
 * We align the 8-button floating strip to sit between them
 * at the same vertical baseline.
 */
const NAV_H = 82;                // Enough for 42px icon + padding + label
const BOTTOM = 20;                // Bottom offset in px
const LEFT_INSET = 120;           // Dodge left promo (48 + ~72 scaled width)
const RIGHT_INSET = 120;           // Dodge right promo (48 + ~72 scaled width)
const FADE_W = 40;                // Fade mask width

const BottomNavigation = () => {
    const { currentView, navigate, bankInitialTab, chatInitialTab } = useNavigation();
    const scrollRef = useRef<HTMLDivElement>(null);
    const isHandlingScroll = useRef(false);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;
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

    const renderSet = (setIndex: number) => (
        <div
            key={`s${setIndex}`}
            className="shrink-0 flex items-end"
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
        <nav
            className="absolute z-50 pointer-events-none"
            style={{
                bottom: `${BOTTOM}px`,
                left: `${LEFT_INSET}px`,
                right: `${RIGHT_INSET}px`,
                height: `${NAV_H}px`,
            }}
        >
            {/* Scroll viewport — clips buttons outside the 8-slot window */}
            <div className="relative w-full h-full overflow-hidden pointer-events-auto">
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

                {/* Left semi-transparent fade mask */}
                <div
                    className="absolute top-0 left-0 bottom-0 pointer-events-none z-10"
                    style={{
                        width: `${FADE_W}px`,
                        background: 'linear-gradient(to right, rgba(18,8,40,0.9) 0%, transparent 100%)',
                    }}
                />
                {/* Right semi-transparent fade mask */}
                <div
                    className="absolute top-0 right-0 bottom-0 pointer-events-none z-10"
                    style={{
                        width: `${FADE_W}px`,
                        background: 'linear-gradient(to left, rgba(18,8,40,0.9) 0%, transparent 100%)',
                    }}
                />
            </div>
        </nav>
    );
};

export default BottomNavigation;
