import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export interface SocialPlayerIdentity {
    playerId: string;
    name: string;
    avatar?: string;
}

interface SocialContextType {
    blockedPlayers: SocialPlayerIdentity[];
    blockPlayer: (player: SocialPlayerIdentity) => void;
    unblockPlayer: (playerId: string) => void;
    isBlockedPlayer: (playerId?: string) => boolean;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export const SocialProvider = ({ children }: { children: ReactNode }) => {
    const [blockedPlayers, setBlockedPlayers] = useState<SocialPlayerIdentity[]>([]);

    const blockPlayer = useCallback((player: SocialPlayerIdentity) => {
        setBlockedPlayers(prev => {
            if (prev.some(blocked => blocked.playerId === player.playerId)) return prev;
            return [...prev, player];
        });
    }, []);

    const unblockPlayer = useCallback((playerId: string) => {
        setBlockedPlayers(prev => prev.filter(player => player.playerId !== playerId));
    }, []);

    const isBlockedPlayer = useCallback((playerId?: string) => {
        if (!playerId) return false;
        return blockedPlayers.some(player => player.playerId === playerId);
    }, [blockedPlayers]);

    const value = useMemo(() => ({
        blockedPlayers,
        blockPlayer,
        unblockPlayer,
        isBlockedPlayer,
    }), [blockedPlayers, blockPlayer, unblockPlayer, isBlockedPlayer]);

    return (
        <SocialContext.Provider value={value}>
            {children}
        </SocialContext.Provider>
    );
};

export const useSocial = (): SocialContextType => {
    const context = useContext(SocialContext);
    if (context === undefined) {
        throw new Error('useSocial must be used within a SocialProvider');
    }
    return context;
};

export default SocialContext;
