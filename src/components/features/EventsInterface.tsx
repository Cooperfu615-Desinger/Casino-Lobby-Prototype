import { useState } from 'react';
import { Calendar } from 'lucide-react';
import LobbyModalShell from '../common/LobbyModalShell';
import DailyCheckInPanel from '../activity/DailyCheckInPanel';
import EventListPanel from '../activity/EventListPanel';
import LeaderboardPanel, { type LeaderboardType } from '../activity/LeaderboardPanel';

interface EventsInterfaceProps {
    onClose: () => void;
    initialTab?: 'daily' | 'events' | 'leaderboard' | 'filter';
}

type MainTab = 'daily' | 'events' | 'leaderboard';

const EventsInterface = ({ onClose, initialTab = 'events' }: EventsInterfaceProps) => {
    const resolvedInitialTab: MainTab = initialTab === 'filter' ? 'events' : initialTab;
    const [activeTab, setActiveTab] = useState<MainTab>(resolvedInitialTab);
    const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('multiplier');

    const title = activeTab === 'daily' ? '每日任務' : activeTab === 'leaderboard' ? '排行榜' : '活動中心';

    const headerContent = (
        <>
            <nav className="lobby-modal-tabs" aria-label="活動中心分類">
                        {[
                            { id: 'daily' as const, label: '每日任務' },
                            { id: 'events' as const, label: '活動' },
                            { id: 'leaderboard' as const, label: '排行榜' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                aria-pressed={activeTab === tab.id}
                                className={`lobby-modal-tab ${activeTab === tab.id ? 'lobby-modal-tab--active' : ''}`}
                            >
                                {tab.label}
                            </button>
                        ))}
            </nav>

            {activeTab === 'leaderboard' && (
                <div className="lobby-modal-subtabs animate-in fade-in slide-in-from-right-4 duration-300">
                            {[
                                { id: 'multiplier' as const, label: '倍數榜' },
                                { id: 'win' as const, label: '贏分榜' },
                                { id: 'rich' as const, label: '富豪榜' },
                            ].map((type) => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => setLeaderboardType(type.id)}
                                    className={`lobby-modal-subtab ${leaderboardType === type.id ? 'lobby-modal-subtab--active' : ''}`}
                                >
                                    {type.label}
                                </button>
                            ))}
                </div>
            )}
        </>
    );

    return (
        <LobbyModalShell
            title={title}
            eyebrow="REWARDS & EVENTS"
            icon={<Calendar size={20} />}
            onClose={onClose}
            closeLabel="關閉活動中心"
            headerContent={headerContent}
            surfaceClassName="lobby-modal-surface--events"
        >
            {activeTab === 'daily' && <DailyCheckInPanel />}
            {activeTab === 'events' && <EventListPanel />}
            {activeTab === 'leaderboard' && <LeaderboardPanel type={leaderboardType} />}
        </LobbyModalShell>
    );
};

export default EventsInterface;
