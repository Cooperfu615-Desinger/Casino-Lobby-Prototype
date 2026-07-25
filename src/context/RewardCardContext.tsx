import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import {
    REWARD_CARD_DEFINITIONS,
    type RewardCard,
    type RewardCardConversionNotice,
    type RewardCardCurrency,
    type RewardCardDefinition,
} from '../types/rewardCard';
import { calculateRewardCardConversion } from '../utils/rewardCardConversion';

interface RewardCardContextType {
    rewardCards: RewardCard[];
    pendingConversionNotice: RewardCardConversionNotice | null;
    activityGoldBalance: number;
    activitySilverBalance: number;
    availableActivityGoldBalance: number;
    availableActivitySilverBalance: number;
    getDefinitionByMilestone: (days: number) => RewardCardDefinition | null;
    hasClaimedMilestone: (days: number) => boolean;
    getActiveCardByCurrency: (currency: RewardCardCurrency) => RewardCard | null;
    claimRewardCard: (days: number) => RewardCard | null;
    activateRewardCard: (id: string) => boolean;
    pauseRewardCard: (id: string) => boolean;
    deleteRewardCard: (id: string) => boolean;
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
    const [pendingConversionNotice, setPendingConversionNotice] = useState<RewardCardConversionNotice | null>(null);

    const getDefinitionByMilestone = (days: number) =>
        REWARD_CARD_DEFINITIONS.find(card => card.milestoneDay === days) ?? null;

    const hasClaimedMilestone = (days: number) =>
        rewardCards.some(card => card.milestoneDay === days);

    const getActiveCardByCurrency = (currency: RewardCardCurrency) =>
        rewardCards.find(card => card.currency === currency && card.status === 'active') ?? null;

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
        setRewardCards(current => [...current, card]);
        return card;
    };

    const activateRewardCard = (id: string) => {
        const card = rewardCards.find(item => item.id === id);
        if (!card || !['inactive', 'paused'].includes(card.status)) return false;

        setRewardCards(current => current.map(item => {
            if (item.id === id) return { ...item, status: 'active' };
            if (item.currency === card.currency && item.status === 'active') {
                return { ...item, status: 'paused' };
            }
            return item;
        }));
        return true;
    };

    const pauseRewardCard = (id: string) => {
        const card = rewardCards.find(item => item.id === id);
        if (!card || card.status !== 'active') return false;
        setRewardCards(current => current.map(item =>
            item.id === id ? { ...item, status: 'paused' } : item
        ));
        return true;
    };

    const deleteRewardCard = (id: string) => {
        const card = rewardCards.find(item => item.id === id);
        if (!card || card.status === 'active' || card.status === 'converted') return false;
        setRewardCards(current => current.filter(item => item.id !== id));
        setPendingConversionNotice(current => current?.cardId === id ? null : current);
        return true;
    };

    const completeRewardCardConversion = (id: string) => {
        const card = rewardCards.find(item => item.id === id);
        if (!card || card.status !== 'active') return null;

        const conversion = calculateRewardCardConversion(card.currentBalance, card.conversionLimit);
        if (conversion.convertedAmount <= 0) return null;

        const isGold = card.currency === 'activity-gold';
        const sourceLabel = isGold ? '活動金幣' : '活動銀幣';
        const destinationLabel = isGold ? '儲值金幣' : '儲值銀幣';
        const destinationCurrency = isGold ? 'gold' : 'silver';
        const createdAt = formatTimestamp();
        const walletBalanceBefore = user?.balance[destinationCurrency] ?? 0;
        const didConvert = addWalletReward(
            destinationCurrency,
            conversion.convertedAmount,
            `獎勵卡流水完成・${card.title}`,
            'reward_card_conversion',
        );
        if (!didConvert) return null;

        setRewardCards(current => current.map(item => item.id === id ? {
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

    const activityGoldBalance = useMemo(() => rewardCards
        .filter(card => card.currency === 'activity-gold' && ['active', 'paused'].includes(card.status))
        .reduce((total, card) => total + card.currentBalance, 0), [rewardCards]);
    const activitySilverBalance = useMemo(() => rewardCards
        .filter(card => card.currency === 'activity-silver' && ['active', 'paused'].includes(card.status))
        .reduce((total, card) => total + card.currentBalance, 0), [rewardCards]);
    const availableActivityGoldBalance = useMemo(() => rewardCards
        .filter(card => card.currency === 'activity-gold' && card.status === 'active')
        .reduce((total, card) => total + card.currentBalance, 0), [rewardCards]);
    const availableActivitySilverBalance = useMemo(() => rewardCards
        .filter(card => card.currency === 'activity-silver' && card.status === 'active')
        .reduce((total, card) => total + card.currentBalance, 0), [rewardCards]);

    const value: RewardCardContextType = {
        rewardCards,
        pendingConversionNotice,
        activityGoldBalance,
        activitySilverBalance,
        availableActivityGoldBalance,
        availableActivitySilverBalance,
        getDefinitionByMilestone,
        hasClaimedMilestone,
        getActiveCardByCurrency,
        claimRewardCard,
        activateRewardCard,
        pauseRewardCard,
        deleteRewardCard,
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
