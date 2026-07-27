import { useEffect, useState, type ReactNode } from 'react';
import {
    Boxes,
    Check,
    ChevronLeft,
    ChevronRight,
    CircleDot,
    Coins,
    Dices,
    Fish,
    Flame,
    Gamepad2,
    Heart,
    LayoutGrid,
    Monitor,
    Radio,
    RotateCcw,
    SlidersHorizontal,
    Spade,
    Sparkles,
    TrendingUp,
    X,
    type LucideIcon,
} from 'lucide-react';
import type {
    GameCategory,
    GameCurrencyFilter,
    LobbyCategoryId,
    LobbyFilterSection,
    LobbyGameFilters,
} from '../../types';
import { GAME_CURRENCY_OPTIONS } from '../../utils/gameFilters';

export interface LobbyCategoryItem {
    id: LobbyCategoryId;
    label: string;
    shortLabel: string;
    icon: LucideIcon;
    gameCategory?: GameCategory;
}

interface CategorySidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    filters: LobbyGameFilters;
    onFiltersChange: (updates: Partial<LobbyGameFilters>) => void;
    onResetFilters: () => void;
    categoryCounts: Partial<Record<LobbyCategoryId, number>>;
    providers: string[];
    providerCounts: Record<string, number>;
    currencyCounts: Partial<Record<GameCurrencyFilter, number>>;
    favoriteCount: number;
    resultCount: number;
}

export const LOBBY_CATEGORIES: LobbyCategoryItem[] = [
    { id: 'all', label: '全部遊戲 (All Games)', shortLabel: '全部', icon: Sparkles },
    { id: 'event', label: '活動 (Event Games)', shortLabel: '活動', icon: Flame },
    { id: 'slots', label: '老虎機 (Slots)', shortLabel: '老虎機', icon: Gamepad2, gameCategory: 'slot' },
    { id: 'board', label: '棋牌 (Board/Card)', shortLabel: '棋牌', icon: Spade, gameCategory: 'card' },
    { id: 'arcade', label: '電子 (Arcade)', shortLabel: '電子', icon: Monitor },
    { id: 'live', label: '真人 (Live Casino)', shortLabel: '真人', icon: Radio },
    { id: 'crash', label: 'Crash(崩潰) (Crash)', shortLabel: 'Crash', icon: TrendingUp },
    { id: 'fishing', label: '魚機 (Fishing)', shortLabel: '魚機', icon: Fish, gameCategory: 'fish' },
    { id: 'lottery', label: '樂透 (Lottery)', shortLabel: '樂透', icon: CircleDot },
];

const FILTER_SECTIONS: Array<{
    id: LobbyFilterSection;
    label: string;
    eyebrow: string;
    icon: LucideIcon;
}> = [
    { id: 'favorites', label: '我的最愛', eyebrow: 'FAVORITES', icon: Heart },
    { id: 'category', label: '類別', eyebrow: 'CATEGORY', icon: LayoutGrid },
    { id: 'currency', label: '幣別', eyebrow: 'CURRENCY', icon: Coins },
    { id: 'provider', label: '遊戲商', eyebrow: 'PROVIDER', icon: Boxes },
];

const CategorySidebar = ({
    isOpen,
    onToggle,
    filters,
    onFiltersChange,
    onResetFilters,
    categoryCounts,
    providers,
    providerCounts,
    currencyCounts,
    favoriteCount,
    resultCount,
}: CategorySidebarProps) => {
    const [activeSection, setActiveSection] = useState<LobbyFilterSection | null>(null);
    const activeFilterCount = Number(filters.favoritesOnly)
        + Number(filters.category !== 'all')
        + Number(filters.currency !== 'all')
        + Number(filters.provider !== 'all');

    useEffect(() => {
        if (!isOpen) setActiveSection(null);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return;
            if (activeSection) {
                setActiveSection(null);
            } else {
                onToggle();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [activeSection, isOpen, onToggle]);

    const isSectionFiltered = (section: LobbyFilterSection) => {
        if (section === 'favorites') return filters.favoritesOnly;
        if (section === 'category') return filters.category !== 'all';
        if (section === 'currency') return filters.currency !== 'all';
        return filters.provider !== 'all';
    };

    if (!isOpen) {
        return (
            <div className="absolute left-3 top-[154px] z-30">
                <button
                    type="button"
                    onClick={onToggle}
                    aria-label="展開遊戲篩選"
                    aria-expanded="false"
                    aria-controls="lobby-filter-drawer"
                    className="group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#FFD700]/30 bg-[#140922]/94 text-[#FFD700] shadow-[0_10px_28px_rgba(0,0,0,0.38),0_0_20px_rgba(255,215,0,0.06)] backdrop-blur-xl transition-all hover:scale-105 hover:border-[#FFD700]/55 hover:bg-[#FFD700]/12 hover:text-white active:scale-95"
                >
                    <SlidersHorizontal size={19} />
                    <span className="pointer-events-none absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border border-[#140922] bg-[#FFD700] px-1 text-[9px] font-black text-black">
                        {activeFilterCount}
                    </span>
                    <ChevronRight className="absolute -right-3 text-white/35 transition-transform group-hover:translate-x-0.5" size={12} />
                </button>
            </div>
        );
    }

    const activeSectionMeta = FILTER_SECTIONS.find((section) => section.id === activeSection);

    return (
        <div id="lobby-filter-drawer" className="pointer-events-none absolute inset-0 z-[120]">
            <button
                type="button"
                aria-label="關閉遊戲篩選"
                onClick={onToggle}
                className="pointer-events-auto absolute inset-0 cursor-default bg-black/5 animate-overlay-fade-in"
            />

            <aside className="pointer-events-auto absolute left-3 top-[142px] flex h-[436px] w-[92px] flex-col overflow-hidden rounded-[22px] border border-[#FFD700]/20 bg-[#12071f]/97 shadow-[0_24px_70px_rgba(0,0,0,0.58),0_0_32px_rgba(255,215,0,0.05)] backdrop-blur-2xl animate-category-panel-in">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,215,0,0.13),_transparent_34%),linear-gradient(180deg,_rgba(124,58,237,0.08),_transparent_60%)]" />

                <header className="relative flex h-12 shrink-0 items-center justify-between border-b border-white/10 bg-black/20 px-3">
                    <span className="text-[8px] font-black tracking-[0.2em] text-[#FFD700]">FILTER</span>
                    <button
                        type="button"
                        onClick={onToggle}
                        aria-label="收合遊戲篩選"
                        className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                    >
                        <ChevronLeft size={15} />
                    </button>
                </header>

                <nav className="relative grid flex-1 grid-rows-4 gap-1.5 p-2" aria-label="遊戲篩選方式">
                    {FILTER_SECTIONS.map((section) => {
                        const isActive = activeSection === section.id;
                        const isFiltered = isSectionFiltered(section.id);
                        const Icon = section.icon;
                        return (
                            <button
                                key={section.id}
                                type="button"
                                onClick={() => setActiveSection(current => current === section.id ? null : section.id)}
                                aria-expanded={isActive}
                                aria-pressed={isFiltered}
                                className={`group relative flex flex-col items-center justify-center gap-1 rounded-2xl border transition-all active:scale-95 ${isActive
                                    ? 'border-[#FFD700]/50 bg-[#FFD700]/14 text-[#FFD700] shadow-[inset_0_0_18px_rgba(255,215,0,0.05)]'
                                    : isFiltered
                                        ? 'border-purple-300/30 bg-purple-500/16 text-purple-100'
                                        : 'border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.06] hover:text-white'
                                    }`}
                            >
                                <Icon size={19} className={section.id === 'favorites' && filters.favoritesOnly ? 'fill-current' : ''} />
                                <span className="text-[10px] font-black">{section.label}</span>
                                {isFiltered && (
                                    <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#FFD700] shadow-[0_0_8px_rgba(255,215,0,0.8)]" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                <footer className="relative flex h-10 shrink-0 items-center justify-center border-t border-white/10 bg-black/15 text-[9px] font-black text-slate-500">
                    <span className="text-[#FFD700]">{resultCount}</span>
                    <span className="ml-1">款符合</span>
                </footer>
            </aside>

            {activeSection && activeSectionMeta && (
                <section
                    className="pointer-events-auto absolute left-[114px] top-[142px] flex h-[436px] w-[310px] flex-col overflow-hidden rounded-[24px] border border-[#FFD700]/22 bg-[#160922]/98 shadow-[0_26px_80px_rgba(0,0,0,0.64),0_0_34px_rgba(124,58,237,0.12)] backdrop-blur-2xl animate-category-panel-in"
                    role="dialog"
                    aria-label={`${activeSectionMeta.label}篩選`}
                >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,215,0,0.12),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(124,58,237,0.18),_transparent_42%)]" />

                    <header className="relative flex h-[66px] shrink-0 items-center justify-between border-b border-white/10 bg-black/15 px-4">
                        <div>
                            <p className="text-[8px] font-black tracking-[0.22em] text-[#FFD700]/75">{activeSectionMeta.eyebrow}</p>
                            <h2 className="mt-1 text-base font-black text-white">{activeSectionMeta.label}</h2>
                        </div>
                        <button
                            type="button"
                            onClick={() => setActiveSection(null)}
                            aria-label={`關閉${activeSectionMeta.label}選項`}
                            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                        >
                            <X size={16} />
                        </button>
                    </header>

                    <div className="relative min-h-0 flex-1 overflow-y-auto p-3 no-scrollbar">
                        {activeSection === 'favorites' && (
                            <div className="space-y-2">
                                <FilterChoice
                                    active={!filters.favoritesOnly}
                                    icon={<Sparkles size={17} />}
                                    label="顯示全部遊戲"
                                    description="不限制收藏狀態"
                                    count={categoryCounts.all ?? 0}
                                    onClick={() => onFiltersChange({ favoritesOnly: false })}
                                />
                                <FilterChoice
                                    active={filters.favoritesOnly}
                                    icon={<Heart size={17} className="fill-current" />}
                                    label="只看我的最愛"
                                    description={favoriteCount > 0 ? '顯示已收藏的遊戲' : '尚未收藏任何遊戲'}
                                    count={favoriteCount}
                                    onClick={() => onFiltersChange({ favoritesOnly: true })}
                                />
                                <div className="rounded-2xl border border-purple-300/10 bg-purple-500/[0.06] p-3 text-[10px] leading-5 text-slate-400">
                                    點擊遊戲卡右上角愛心即可加入或移除我的最愛。
                                </div>
                            </div>
                        )}

                        {activeSection === 'category' && (
                            <div className="grid grid-cols-2 gap-2">
                                {LOBBY_CATEGORIES.map((category) => {
                                    const count = categoryCounts[category.id] ?? 0;
                                    const isPlanned = category.id !== 'all' && count === 0;
                                    const Icon = category.icon;
                                    return (
                                        <CompactChoice
                                            key={category.id}
                                            active={filters.category === category.id}
                                            disabled={isPlanned}
                                            icon={<Icon size={16} />}
                                            label={category.shortLabel}
                                            meta={isPlanned ? 'P2' : `${count} 款`}
                                            onClick={() => onFiltersChange({ category: category.id })}
                                        />
                                    );
                                })}
                            </div>
                        )}

                        {activeSection === 'currency' && (
                            <div className="grid grid-cols-2 gap-2">
                                {GAME_CURRENCY_OPTIONS.map((currency) => (
                                    <CompactChoice
                                        key={currency.key}
                                        active={filters.currency === currency.key}
                                        icon={<CurrencyMark currency={currency.key} />}
                                        label={currency.label}
                                        meta={`${currencyCounts[currency.key] ?? categoryCounts.all ?? 0} 款`}
                                        onClick={() => onFiltersChange({ currency: currency.key })}
                                    />
                                ))}
                            </div>
                        )}

                        {activeSection === 'provider' && (
                            <div className="space-y-2">
                                {['all', ...providers].map((provider) => (
                                    <FilterChoice
                                        key={provider}
                                        active={filters.provider === provider}
                                        icon={provider === 'all' ? <Dices size={17} /> : <Boxes size={17} />}
                                        label={provider === 'all' ? '全部遊戲商' : provider}
                                        description={provider === 'all' ? '顯示所有合作遊戲商' : '僅顯示此遊戲商'}
                                        count={provider === 'all' ? categoryCounts.all ?? 0 : providerCounts[provider] ?? 0}
                                        onClick={() => onFiltersChange({ provider })}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <footer className="relative grid shrink-0 grid-cols-[104px_1fr] gap-2 border-t border-white/10 bg-black/20 p-3">
                        <button
                            type="button"
                            onClick={onResetFilters}
                            className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2.5 text-[10px] font-black text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                        >
                            <RotateCcw size={13} />
                            全部重設
                        </button>
                        <button
                            type="button"
                            onClick={onToggle}
                            className="rounded-xl bg-gradient-to-r from-[#FFD700] to-[#E2A90A] py-2.5 text-xs font-black text-black shadow-[0_8px_22px_rgba(255,215,0,0.14)] transition-all hover:brightness-110 active:scale-[0.98]"
                        >
                            查看 {resultCount} 款遊戲
                        </button>
                    </footer>
                </section>
            )}
        </div>
    );
};

const FilterChoice = ({
    active,
    icon,
    label,
    description,
    count,
    onClick,
}: {
    active: boolean;
    icon: ReactNode;
    label: string;
    description: string;
    count: number;
    onClick: () => void;
}) => (
    <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all active:scale-[0.99] ${active
            ? 'border-[#FFD700]/45 bg-[#FFD700]/12 text-[#FFD700] shadow-[inset_0_0_22px_rgba(255,215,0,0.04)]'
            : 'border-white/8 bg-white/[0.035] text-slate-300 hover:border-white/16 hover:bg-white/[0.07]'
            }`}
    >
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${active ? 'bg-[#FFD700]/12' : 'bg-white/5'}`}>
            {icon}
        </span>
        <span className="min-w-0 flex-1">
            <strong className="block truncate text-xs font-black">{label}</strong>
            <small className="mt-1 block truncate text-[9px] text-current opacity-55">{description}</small>
        </span>
        <span className={`flex min-w-8 items-center justify-center rounded-full px-2 py-1 text-[9px] font-black ${active ? 'bg-[#FFD700] text-black' : 'bg-white/7 text-slate-400'}`}>
            {count}
        </span>
        {active && <Check size={14} strokeWidth={3} />}
    </button>
);

const CompactChoice = ({
    active,
    disabled = false,
    icon,
    label,
    meta,
    onClick,
}: {
    active: boolean;
    disabled?: boolean;
    icon: ReactNode;
    label: string;
    meta: string;
    onClick: () => void;
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-pressed={active}
        className={`relative flex min-h-[68px] items-center gap-2.5 rounded-2xl border p-3 text-left transition-all active:scale-[0.98] ${active
            ? 'border-[#FFD700]/45 bg-[#FFD700]/12 text-[#FFD700]'
            : disabled
                ? 'cursor-not-allowed border-white/5 bg-black/15 text-slate-600 opacity-60'
                : 'border-white/8 bg-white/[0.035] text-slate-300 hover:border-white/16 hover:bg-white/[0.07]'
            }`}
    >
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${active ? 'bg-[#FFD700]/12' : 'bg-white/5'}`}>
            {icon}
        </span>
        <span className="min-w-0 flex-1">
            <strong className="block truncate text-[11px] font-black">{label}</strong>
            <small className="mt-1 block text-[9px] text-current opacity-55">{meta}</small>
        </span>
        {active && <Check className="absolute right-2 top-2" size={12} strokeWidth={3} />}
    </button>
);

const CurrencyMark = ({ currency }: { currency: GameCurrencyFilter }) => {
    if (currency === 'all') return <Dices size={16} />;
    const isGold = currency === 'stored-gold' || currency === 'activity-gold';
    const isActivity = currency === 'activity-gold' || currency === 'activity-silver';
    return (
        <span className={`relative flex h-6 w-6 items-center justify-center rounded-full border text-[9px] font-black ${isGold
            ? 'border-[#FFD700]/55 bg-[#FFD700]/12 text-[#FFD700]'
            : currency === 'bronze'
                ? 'border-orange-400/50 bg-orange-400/10 text-orange-300'
                : 'border-slate-200/45 bg-slate-200/10 text-slate-100'
            }`}>
            {currency === 'bronze' ? '銅' : isGold ? '金' : '銀'}
            {isActivity && <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-purple-400 ring-1 ring-[#160922]" />}
        </span>
    );
};

export default CategorySidebar;
