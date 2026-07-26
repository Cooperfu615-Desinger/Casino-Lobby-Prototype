import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { FRIENDS, ONLINE_PLAYERS } from '../data/mockData';
import type { Friend, OnlinePlayer } from '../types/user';

export interface SocialPlayerIdentity {
    playerId: string;
    account?: string;
    name: string;
    avatar?: string;
}

export interface BlockedPlayer extends SocialPlayerIdentity {
    blockedAt: number;
}

interface SocialContextType {
    friends: Friend[];
    addFriend: (player: SocialPlayerIdentity) => void;
    removeFriend: (playerId: string) => void;
    isFriendPlayer: (playerId?: string) => boolean;
    requestFriendList: () => Promise<Friend[]>;
    requestPlayerList: () => Promise<OnlinePlayer[]>;
    blockedPlayers: BlockedPlayer[];
    blockPlayer: (player: SocialPlayerIdentity) => void;
    unblockPlayer: (playerId: string) => void;
    isBlockedPlayer: (playerId?: string) => boolean;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);
const MOCK_DIRECTORY_DELAY = 650;

const waitForMockDirectory = () => new Promise<void>((resolve) => {
    setTimeout(resolve, MOCK_DIRECTORY_DELAY);
});

export const SocialProvider = ({ children }: { children: ReactNode }) => {
    const [friends, setFriends] = useState<Friend[]>(FRIENDS);
    const [blockedPlayers, setBlockedPlayers] = useState<BlockedPlayer[]>([]);

    const addFriend = useCallback((player: SocialPlayerIdentity) => {
        setFriends(prev => {
            if (prev.some(friend => friend.playerId === player.playerId)) return prev;

            const nextId = Math.max(0, ...prev.map(friend => friend.id)) + 1;
            return [
                ...prev,
                {
                    id: nextId,
                    playerId: player.playerId,
                    account: player.account || `Player${nextId}`,
                    name: player.name,
                    avatar: player.avatar || 'bg-slate-700',
                    status: 'online',
                    lastMsg: '剛成為好友',
                    isFriend: true,
                },
            ];
        });
    }, []);

    const removeFriend = useCallback((playerId: string) => {
        setFriends(prev => prev.filter(friend => friend.playerId !== playerId));
    }, []);

    const isFriendPlayer = useCallback((playerId?: string) => {
        if (!playerId) return false;
        return friends.some(friend => friend.playerId === playerId);
    }, [friends]);

    const requestFriendList = useCallback(async () => {
        await waitForMockDirectory();
        return friends.map(friend => ({ ...friend }));
    }, [friends]);

    const requestPlayerList = useCallback(async () => {
        await waitForMockDirectory();
        return ONLINE_PLAYERS.map(player => ({ ...player }));
    }, []);

    const blockPlayer = useCallback((player: SocialPlayerIdentity) => {
        setBlockedPlayers(prev => {
            if (prev.some(blocked => blocked.playerId === player.playerId)) return prev;
            return [...prev, { ...player, blockedAt: Date.now() }];
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
        friends,
        addFriend,
        removeFriend,
        isFriendPlayer,
        requestFriendList,
        requestPlayerList,
        blockedPlayers,
        blockPlayer,
        unblockPlayer,
        isBlockedPlayer,
    }), [friends, addFriend, removeFriend, isFriendPlayer, requestFriendList, requestPlayerList, blockedPlayers, blockPlayer, unblockPlayer, isBlockedPlayer]);

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
