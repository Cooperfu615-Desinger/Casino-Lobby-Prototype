import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface ActivityContextType {
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
    const [claimedMilestones, setClaimedMilestones] = useState<number[]>([5, 7, 10, 15].filter((days) => days <= checkedDays.length));
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
        checkedDays,
        claimedMilestones,
        joinedEventIds,
        checkInDay,
        claimMilestone,
        joinEvent,
    }), [checkedDays, claimedMilestones, joinedEventIds, checkInDay, claimMilestone, joinEvent]);

    return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
};

export const useActivity = () => {
    const context = useContext(ActivityContext);
    if (!context) throw new Error('useActivity must be used within an ActivityProvider');
    return context;
};
