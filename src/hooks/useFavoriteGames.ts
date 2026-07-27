import { useCallback, useState } from 'react';

const STORAGE_KEY = 'jh_app_favorite_game_ids';

const loadFavoriteGameIds = (): number[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter((value): value is number => Number.isInteger(value));
    } catch {
        return [];
    }
};

const useFavoriteGames = () => {
    const [favoriteGameIds, setFavoriteGameIds] = useState<number[]>(loadFavoriteGameIds);

    const toggleFavoriteGame = useCallback((gameId: number) => {
        setFavoriteGameIds((current) => {
            const next = current.includes(gameId)
                ? current.filter((id) => id !== gameId)
                : [...current, gameId];
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            } catch {
                // 收藏仍保留在本次工作階段，不讓儲存失敗中斷操作。
            }
            return next;
        });
    }, []);

    return { favoriteGameIds, toggleFavoriteGame };
};

export default useFavoriteGames;
