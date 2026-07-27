import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { BookOpen, Check, Info, Play, WalletCards, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRewardCards } from '../../context/RewardCardContext';
import { buildGameWalletOptions } from '../../utils/gameWallets';
import type { Game, GameWalletKey, GameWalletOption } from '../../types';

interface GameLaunchModalProps {
    game: Game;
    initialWallet?: GameWalletKey;
    onEnterGame: (wallet: GameWalletKey) => void;
    onClose: () => void;
}

const GAME_RULES: Record<Game['category'], string[]> = {
    slot: [
        '選擇投注額後啟動轉輪，相同圖示依賠付線連線即可得分。',
        '特殊圖示、免費旋轉及加倍效果依遊戲內賠付表判定。',
        '每次遊戲結果皆為獨立 Mock，不影響其他機台狀態。',
    ],
    card: [
        '依該牌桌遊戲的標準牌型與勝負規則進行結算。',
        '確認投注後進入當局，派牌期間不可變更投注內容。',
        '同分或特殊牌型的處理方式以遊戲內規則表為準。',
    ],
    fish: [
        '選擇武器倍率並瞄準魚種，成功捕獲後取得對應倍率。',
        '大型魚種與特殊 Boss 需要較高火力，也提供較高獎勵。',
        '特殊武器與連鎖效果依目前遊戲回合狀態觸發。',
    ],
};

const GameLaunchModal = ({ game, initialWallet, onEnterGame, onClose }: GameLaunchModalProps) => {
    const { user } = useAuth();
    const { availableActivityGoldBalance, availableActivitySilverBalance } = useRewardCards();
    const [activeTab, setActiveTab] = useState<'details' | 'rules'>('details');
    const walletOptions = useMemo(() => buildGameWalletOptions({
        stored: user?.balance ?? { gold: 0, silver: 0, bronze: 0 },
        activityGold: availableActivityGoldBalance,
        activitySilver: availableActivitySilverBalance,
        supportedWallets: game.supportedWallets,
    }), [availableActivityGoldBalance, availableActivitySilverBalance, game.supportedWallets, user?.balance]);
    const [selectedWallet, setSelectedWallet] = useState<GameWalletKey>(
        initialWallet && game.supportedWallets.includes(initialWallet)
            ? initialWallet
            : game.supportedWallets[0] ?? 'stored-gold',
    );
    const selectedOption = walletOptions.find(option => option.key === selectedWallet);
    const canEnter = Boolean(selectedOption?.enabled);

    useEffect(() => {
        if (selectedOption?.enabled || (initialWallet && selectedWallet === initialWallet)) return;
        const nextAvailableWallet = walletOptions.find(option => option.enabled);
        if (nextAvailableWallet) setSelectedWallet(nextAvailableWallet.key);
    }, [initialWallet, selectedOption?.enabled, selectedWallet, walletOptions]);

    return (
        <div className="absolute inset-0 z-[130] flex items-center justify-center">
            <button
                type="button"
                aria-label="關閉遊戲操作彈窗"
                className="absolute inset-0 bg-black/65 backdrop-blur-sm"
                onClick={onClose}
            />

            <article
                className="relative w-[700px] max-w-[calc(100%-32px)] overflow-hidden rounded-[28px] border border-[#FFD700]/25 bg-gradient-to-br from-[#21103a]/98 to-[#10051f]/98 shadow-[0_28px_90px_rgba(0,0,0,0.58)] animate-in fade-in zoom-in-95 duration-200"
                role="dialog"
                aria-modal="true"
                aria-label={`${game.title} 遊戲詳情`}
            >
                <div className="relative flex items-center gap-4 border-b border-white/10 p-5 pr-16">
                    <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-[24px] border border-white/15 bg-gradient-to-br ${game.image} text-4xl shadow-lg`}>
                        {game.icon}
                    </div>
                    <div className="min-w-0">
                        <p className="text-[9px] font-black tracking-[0.22em] text-[#FFD700]">GAME ENTRY</p>
                        <h2 className="mt-1 truncate text-2xl font-black text-white">{game.title}</h2>
                        <p className="mt-1 text-xs font-bold text-slate-400">{game.provider}・RTP {game.rtp}%</p>
                    </div>
                    <button
                        type="button"
                        aria-label="關閉"
                        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white/55 transition-colors hover:bg-white/10 hover:text-white"
                        onClick={onClose}
                    >
                        <X size={19} />
                    </button>
                </div>

                <div className="p-5">
                    <div className="mb-3 flex rounded-xl border border-white/10 bg-black/20 p-1">
                        <InfoTab
                            active={activeTab === 'details'}
                            icon={<Info size={14} />}
                            label="遊戲詳情"
                            onClick={() => setActiveTab('details')}
                        />
                        <InfoTab
                            active={activeTab === 'rules'}
                            icon={<BookOpen size={14} />}
                            label="遊戲規則"
                            onClick={() => setActiveTab('rules')}
                        />
                    </div>

                    <div className="min-h-[126px] rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                        {activeTab === 'details' ? (
                            <div className="animate-in fade-in duration-150">
                                <p className="mb-4 text-xs font-medium leading-relaxed text-slate-300">{game.description}</p>
                                <div className="grid grid-cols-4 gap-2">
                                    <DetailMetric label="RTP" value={`${game.rtp}%`} />
                                    <DetailMetric label="波動度" value={game.volatility} />
                                    <DetailMetric label="賠付線" value={game.paylines} />
                                    <DetailMetric label="最高倍率" value={game.maxMultiplier} />
                                </div>
                            </div>
                        ) : (
                            <ol className="space-y-2 animate-in fade-in duration-150">
                                {GAME_RULES[game.category].map((rule, index) => (
                                    <li key={rule} className="flex gap-3 text-xs leading-relaxed text-slate-300">
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-[9px] font-black text-purple-200">{index + 1}</span>
                                        <span>{rule}</span>
                                    </li>
                                ))}
                            </ol>
                        )}
                    </div>

                    <section className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3" aria-label="遊戲幣別">
                        <div className="mb-2.5 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFD700]/10 text-[#FFD700]">
                                    <WalletCards size={16} />
                                </span>
                                <div>
                                    <h3 className="text-xs font-black text-white">選擇遊戲幣別</h3>
                                    <p className="text-[9px] text-slate-500">選定後將以此錢包進入遊戲</p>
                                </div>
                            </div>
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] font-black text-slate-400">
                                {walletOptions.filter(option => option.enabled).length} 個可用・{game.supportedWallets.length} 個支援
                            </span>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                            {walletOptions.map(option => (
                                <WalletOptionButton
                                    key={option.key}
                                    option={option}
                                    selected={selectedWallet === option.key}
                                    onSelect={() => setSelectedWallet(option.key)}
                                />
                            ))}
                        </div>
                    </section>

                    <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-[#FFD700]/25 bg-gradient-to-r from-[#FFD700]/10 via-purple-500/5 to-transparent p-4">
                        <div className="min-w-0">
                            <span className="text-[9px] font-black tracking-[0.18em] text-[#FFD700]">READY TO ENTER</span>
                            <p className="mt-1 text-xs font-bold text-slate-300">遊戲模式與機台將於遊戲內設定</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => canEnter && onEnterGame(selectedWallet)}
                            disabled={!canEnter}
                            className="flex min-w-48 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-3.5 text-sm font-black text-black shadow-lg shadow-amber-500/10 transition-all hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Play size={16} fill="currentColor" />
                            確認幣別並進入遊戲
                        </button>
                    </div>
                </div>
            </article>
        </div>
    );
};

const WalletOptionButton = ({
    option,
    selected,
    onSelect,
}: {
    option: GameWalletOption;
    selected: boolean;
    onSelect: () => void;
}) => {
    const toneClass = option.tone === 'gold'
        ? 'border-[#FFD700]/35 bg-[#FFD700]/10 text-[#FFD700]'
        : option.tone === 'silver'
            ? 'border-slate-200/25 bg-slate-200/10 text-slate-100'
            : 'border-orange-400/30 bg-orange-400/10 text-orange-300';

    return (
        <button
            type="button"
            aria-pressed={selected}
            aria-label={`${option.label}，餘額 ${option.balance.toLocaleString()}`}
            title={!option.enabled ? option.unavailableReason ?? '餘額不足' : option.label}
            disabled={!option.enabled}
            onClick={onSelect}
            className={`relative min-w-0 rounded-xl border px-2 py-2.5 text-left transition-all ${selected
                ? `${toneClass} ring-2 ring-white/35`
                : option.enabled
                    ? 'border-white/10 bg-white/[0.035] text-slate-300 hover:border-white/25 hover:bg-white/[0.07]'
                    : 'cursor-not-allowed border-white/5 bg-black/15 text-slate-600 opacity-65'
                }`}
        >
            {selected && (
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[#241039]">
                    <Check size={10} strokeWidth={4} />
                </span>
            )}
            <span className="block truncate pr-3 text-[9px] font-black">{option.shortLabel}</span>
            <strong className="mt-1 block truncate text-[11px] font-black">{option.balance.toLocaleString()}</strong>
            <small className="mt-1 block truncate text-[7px] text-current opacity-60">
                {option.enabled
                    ? (option.isActivity ? '獎勵卡可用' : '錢包可用')
                    : option.unavailableReason === '此遊戲不支援此幣別'
                        ? '遊戲不支援'
                        : '目前不可用'}
            </small>
        </button>
    );
};

interface InfoTabProps {
    active: boolean;
    icon: ReactNode;
    label: string;
    onClick: () => void;
}

const InfoTab = ({ active, icon, label, onClick }: InfoTabProps) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-black transition-colors ${active
            ? 'bg-white/10 text-[#FFD700] shadow-sm'
            : 'text-slate-500 hover:text-white'
            }`}
    >
        {icon}
        {label}
    </button>
);

const DetailMetric = ({ label, value }: { label: string; value: string }) => (
    <div className="rounded-xl border border-white/5 bg-black/20 px-2 py-3 text-center">
        <div className="text-[9px] font-black tracking-wider text-slate-500">{label}</div>
        <div className="mt-1 truncate text-xs font-black text-white">{value}</div>
    </div>
);

export default GameLaunchModal;
