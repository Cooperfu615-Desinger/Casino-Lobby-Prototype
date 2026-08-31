import { useState } from 'react';
import { Calendar } from 'lucide-react';
import LobbyModalShell from '../common/LobbyModalShell';
import { LobbyModalTabs } from '../common/LobbyModalPrimitives';
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
            <LobbyModalTabs
                items={[
                    { id: 'daily', label: '每日任務' },
                    { id: 'events', label: '活動' },
                    { id: 'leaderboard', label: '排行榜' },
                ]}
                value={activeTab}
                onChange={setActiveTab}
                ariaLabel="活動中心分類"
            />

            {activeTab === 'leaderboard' && (
                <LobbyModalTabs
                    items={[
                        { id: 'multiplier', label: '倍數榜' },
                        { id: 'win', label: '贏分榜' },
                        { id: 'rich', label: '富豪榜' },
                    ]}
                    value={leaderboardType}
                    onChange={setLeaderboardType}
                    ariaLabel="排行榜分類"
                    variant="secondary"
                    className="animate-in fade-in slide-in-from-right-4 duration-300"
                />
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
