import { useCallback, useState } from 'react';

const STORAGE_KEY = 'casino-recent-game-ids';
const MAX_RECENT_GAMES = 8;

const loadRecentGameIds = (): number[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter((value): value is number => Number.isInteger(value)).slice(0, MAX_RECENT_GAMES);
    } catch {
        return [];
    }
};

const useRecentGames = () => {
    const [recentGameIds, setRecentGameIds] = useState<number[]>(loadRecentGameIds);

    const recordRecentGame = useCallback((gameId: number) => {
        setRecentGameIds((current) => {
            const next = [gameId, ...current.filter((id) => id !== gameId)].slice(0, MAX_RECENT_GAMES);
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            } catch {
                // 最近遊戲仍保留於本次執行期，不讓儲存失敗中斷啟動流程。
            }
            return next;
        });
    }, []);

    return { recentGameIds, recordRecentGame };
};

export default useRecentGames;
