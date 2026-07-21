import { useState, type ReactNode } from 'react';
import { Armchair, BookOpen, Info, Play, X } from 'lucide-react';
import type { Game } from '../../types';

interface GameLaunchModalProps {
    game: Game;
    onQuickPlay: () => void;
    onChooseSeat: () => void;
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

const GameLaunchModal = ({ game, onQuickPlay, onChooseSeat, onClose }: GameLaunchModalProps) => {
    const [activeTab, setActiveTab] = useState<'details' | 'rules'>('details');

    return (
        <div className="absolute inset-0 z-[130] flex items-center justify-center">
            <button
                type="button"
                aria-label="關閉遊戲操作彈窗"
                className="absolute inset-0 bg-black/65 backdrop-blur-sm"
                onClick={onClose}
            />

            <article
                className="relative w-[560px] max-w-[calc(100%-32px)] overflow-hidden rounded-[28px] border border-[#FFD700]/25 bg-gradient-to-br from-[#21103a]/98 to-[#10051f]/98 shadow-[0_28px_90px_rgba(0,0,0,0.58)] animate-in fade-in zoom-in-95 duration-200"
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

                    <div className="min-h-[142px] rounded-2xl border border-white/10 bg-white/[0.035] p-4">
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

                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={onQuickPlay}
                            className="group flex min-h-[105px] flex-col items-start rounded-2xl border border-[#FFD700]/30 bg-gradient-to-br from-[#FFD700]/18 to-[#FFD700]/5 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[#FFD700]/55 active:translate-y-0"
                        >
                            <span className="text-[9px] font-black tracking-[0.18em] text-[#FFD700]">QUICK PLAY</span>
                            <strong className="mt-2 flex items-center gap-2 text-lg font-black text-white"><Play size={17} fill="currentColor" />快速遊玩</strong>
                            <small className="mt-auto text-[10px] text-[#ffe7a3]">系統自動配置空閒機台</small>
                        </button>

                        <button
                            type="button"
                            onClick={onChooseSeat}
                            className="group flex min-h-[105px] flex-col items-start rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-purple-300/35 hover:bg-white/10 active:translate-y-0"
                        >
                            <span className="text-[9px] font-black tracking-[0.18em] text-purple-300">SEAT MAP</span>
                            <strong className="mt-2 flex items-center gap-2 text-lg font-black text-white"><Armchair size={17} />選擇機台</strong>
                            <small className="mt-auto text-[10px] text-slate-400">查看機台狀態與統計後入座</small>
                        </button>
                    </div>
                </div>
            </article>
        </div>
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
