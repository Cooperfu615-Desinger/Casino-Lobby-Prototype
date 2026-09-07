import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface ActivityContextType {
    totalCheckIns: number;
    checkedDays: number[];
    claimedMilestones: number[];
    joinedEventIds: number[];
    checkInDay: (day: number) => boolean;
    claimMilestone: (days: number) => boolean;
    joinEvent: (eventId: number) => boolean;
}

const createInitialCheckedDays = () => {
    const today = new Date().getDate();
    const missedDay = Math.max(1, today - 3);
    return Array.from({ length: Math.max(0, today - 1) }, (_, index) => index + 1)
        .filter((day) => day !== missedDay);
};

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider = ({ children }: { children: ReactNode }) => {
    const [checkedDays, setCheckedDays] = useState<number[]>(createInitialCheckedDays);
    // Demo cumulative progress is independent of the actual calendar so rewards remain reachable early in a month.
    const [initialCheckedCount] = useState(() => checkedDays.length);
    const totalCheckIns = 20 + checkedDays.length - initialCheckedCount;
    const [claimedMilestones, setClaimedMilestones] = useState<number[]>([5, 7]);
    const [joinedEventIds, setJoinedEventIds] = useState<number[]>([]);

    const checkInDay = useCallback((day: number) => {
        if (checkedDays.includes(day)) return false;
        setCheckedDays((current) => [...current, day].sort((a, b) => a - b));
        return true;
    }, [checkedDays]);

    const claimMilestone = useCallback((days: number) => {
        if (claimedMilestones.includes(days)) return false;
        setClaimedMilestones((current) => [...current, days].sort((a, b) => a - b));
        return true;
    }, [claimedMilestones]);

    const joinEvent = useCallback((eventId: number) => {
        if (joinedEventIds.includes(eventId)) return false;
        setJoinedEventIds((current) => [...current, eventId]);
        return true;
    }, [joinedEventIds]);

    const value = useMemo(() => ({
        totalCheckIns,
        checkedDays,
        claimedMilestones,
        joinedEventIds,
        checkInDay,
        claimMilestone,
        joinEvent,
    }), [totalCheckIns, checkedDays, claimedMilestones, joinedEventIds, checkInDay, claimMilestone, joinEvent]);

    return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
};

export const useActivity = () => {
    const context = useContext(ActivityContext);
    if (!context) throw new Error('useActivity must be used within an ActivityProvider');
    return context;
};
