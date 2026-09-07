import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import {
    REWARD_CARD_DEFINITIONS,
    type RewardCard,
    type RewardCardConversionNotice,
    type RewardCardCurrency,
    type RewardCardDefinition,
} from '../types/rewardCard';
import { calculateRewardCardConversion } from '../utils/rewardCardConversion';
import { createMergedRewardCard, isRewardCardExpired } from '../utils/rewardCardMerge';

interface RewardCardContextType {
    rewardCards: RewardCard[];
    pendingConversionNotice: RewardCardConversionNotice | null;
    activitySilverBalance: number;
    availableActivitySilverBalance: number;
    getDefinitionByMilestone: (days: number) => RewardCardDefinition | null;
    hasClaimedMilestone: (days: number) => boolean;
    getActiveCardByCurrency: (currency: RewardCardCurrency) => RewardCard | null;
    claimRewardCard: (days: number) => RewardCard | null;
    grantPromoRewardCard: (definition: RewardCardDefinition, sourceLabel: string) => boolean;
    activateRewardCard: (id: string) => boolean;
    pauseRewardCard: (id: string) => boolean;
    deleteRewardCard: (id: string) => boolean;
    mergeRewardCards: (ids: string[]) => RewardCard | null;
    completeRewardCardConversion: (id: string) => RewardCardConversionNotice | null;
    markConversionNoticeRead: () => void;
}

const RewardCardContext = createContext<RewardCardContextType | undefined>(undefined);

const formatTimestamp = () => new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
}).format(new Date());

export const RewardCardProvider = ({ children }: { children: ReactNode }) => {
    const { user, addWalletReward } = useAuth();
    const [rewardCards, setRewardCards] = useState<RewardCard[]>([]);
    const cardsRef = useRef<RewardCard[]>([]);
    const claimedDays = useRef(new Set<number>());
    const saveCards = (cards: RewardCard[]) => {
        cardsRef.current = cards;
        setRewardCards(cards);
    };
    const [pendingConversionNotice, setPendingConversionNotice] = useState<RewardCardConversionNotice | null>(null);

    const getDefinitionByMilestone = (days: number) =>
        REWARD_CARD_DEFINITIONS.find(card => card.milestoneDay === days) ?? null;

    const hasClaimedMilestone = (days: number) =>
        claimedDays.current.has(days);

    const getActiveCardByCurrency = (currency: RewardCardCurrency) =>
        cardsRef.current.find(card => card.currency === currency && card.status === 'active' && !isRewardCardExpired(card)) ?? null;

    const claimRewardCard = (days: number) => {
        const definition = getDefinitionByMilestone(days);
        if (!definition || hasClaimedMilestone(days)) return null;

        const card: RewardCard = {
            ...definition,
            status: 'inactive',
            currentBalance: definition.amount,
            convertedAmount: 0,
            recoveredAmount: 0,
            convertedAt: '',
        };
        claimedDays.current.add(days);
        saveCards([...cardsRef.current, card]);
        return card;
    };

    const activateRewardCard = (id: string) => {
        const card = cardsRef.current.find(item => item.id === id);
        if (!card || !['inactive', 'paused'].includes(card.status) || isRewardCardExpired(card)) return false;

        saveCards(cardsRef.current.map(item => {
            if (item.id === id) return { ...item, status: 'active' };
            if (item.currency === card.currency && item.status === 'active') {
                return { ...item, status: 'paused' };
            }
            return item;
        }));
        return true;
    };

    const grantPromoRewardCard = (definition: RewardCardDefinition, sourceLabel: string) => {
        if (!user || cardsRef.current.some(card => card.id === definition.id) || isRewardCardExpired(definition)) return false;
        saveCards([...cardsRef.current, { ...definition, sourceLabel, status: 'inactive', currentBalance: definition.amount, convertedAmount: 0, recoveredAmount: 0, convertedAt: '' }]);
        return true;
    };

    const pauseRewardCard = (id: string) => {
        const card = cardsRef.current.find(item => item.id === id);
        if (!card || card.status !== 'active') return false;
        saveCards(cardsRef.current.map(item =>
            item.id === id ? { ...item, status: 'paused' } : item
        ));
        return true;
    };

    const deleteRewardCard = (id: string) => {
        const card = cardsRef.current.find(item => item.id === id);
        if (!card || !['inactive', 'paused'].includes(card.status)) return false;
        saveCards(cardsRef.current.filter(item => item.id !== id));
        setPendingConversionNotice(current => current?.cardId === id ? null : current);
        return true;
    };

    const completeRewardCardConversion = (id: string) => {
        const card = cardsRef.current.find(item => item.id === id);
        if (!card || card.status !== 'active' || isRewardCardExpired(card)) return null;

        const conversion = calculateRewardCardConversion(card.currentBalance, card.conversionLimit);
        if (conversion.convertedAmount <= 0) return null;

        const sourceLabel = '活動銀幣';
        const destinationLabel = '儲值銀幣';
        const destinationCurrency = 'silver';
        const createdAt = formatTimestamp();
        const walletBalanceBefore = user?.balance[destinationCurrency] ?? 0;
        const didConvert = addWalletReward(
            destinationCurrency,
            conversion.convertedAmount,
            `獎勵卡流水完成・${card.title}`,
            'reward_card_conversion',
        );
        if (!didConvert) return null;

        saveCards(cardsRef.current.map(item => item.id === id ? {
            ...item,
            totalTurnover: item.turnoverTarget,
            currentBalance: 0,
            status: 'converted',
            convertedAmount: conversion.convertedAmount,
            recoveredAmount: conversion.recoveredAmount,
            convertedAt: createdAt,
        } : item));

        const notice: RewardCardConversionNotice = {
            id: `conversion-${card.id}-${Date.now()}`,
            cardId: card.id,
            cardTitle: card.title,
            sourceCurrency: card.currency,
            sourceLabel,
            destinationLabel,
            ...conversion,
            walletBalance: walletBalanceBefore + conversion.convertedAmount,
            createdAt,
            read: false,
        };
        setPendingConversionNotice(notice);
        return notice;
    };

    const markConversionNoticeRead = () => {
        setPendingConversionNotice(current => current ? { ...current, read: true } : null);
    };

    const mergeRewardCards = (ids: string[]) => {
        const merged = createMergedRewardCard(cardsRef.current, ids, `merged-${crypto.randomUUID()}`);
        if (!merged) return null;
        saveCards([merged, ...cardsRef.current.map(card => ids.includes(card.id)
            ? { ...card, status: 'merged' as const, mergedIntoId: merged.id } : card)]);
        return merged;
    };

    const activitySilverBalance = useMemo(() => rewardCards
        .filter(card => ['active', 'paused'].includes(card.status) && !isRewardCardExpired(card))
        .reduce((total, card) => total + card.currentBalance, 0), [rewardCards]);
    const availableActivitySilverBalance = useMemo(() => rewardCards
        .filter(card => card.status === 'active' && !isRewardCardExpired(card))
        .reduce((total, card) => total + card.currentBalance, 0), [rewardCards]);

    const value: RewardCardContextType = {
        rewardCards,
        pendingConversionNotice,
        activitySilverBalance,
        availableActivitySilverBalance,
        getDefinitionByMilestone,
        hasClaimedMilestone,
        getActiveCardByCurrency,
        claimRewardCard,
        grantPromoRewardCard,
        activateRewardCard,
        pauseRewardCard,
        deleteRewardCard,
        mergeRewardCards,
        completeRewardCardConversion,
        markConversionNoticeRead,
    };

    return <RewardCardContext.Provider value={value}>{children}</RewardCardContext.Provider>;
};

export const useRewardCards = () => {
    const context = useContext(RewardCardContext);
    if (!context) throw new Error('useRewardCards must be used within a RewardCardProvider');
    return context;
};
