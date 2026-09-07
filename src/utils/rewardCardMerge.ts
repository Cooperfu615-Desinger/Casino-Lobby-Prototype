import type { RewardCard } from '../types/rewardCard';

export const isRewardCardExpired = (card: Pick<RewardCard, 'expiresAt'>, now = new Date()) => {
    const [year, month, day] = card.expiresAt.split('/').map(Number);
    return !year || !month || !day || now.getTime() >= new Date(year, month - 1, day + 1).getTime();
};

export const canMergeRewardCard = (card: RewardCard, now = new Date()) =>
    ['inactive', 'paused'].includes(card.status) && !isRewardCardExpired(card, now);

export const createMergedRewardCard = (cards: RewardCard[], ids: string[], newId: string, now = new Date()): RewardCard | null => {
    if (ids.length < 2 || new Set(ids).size !== ids.length || cards.some(card => card.id === newId)) return null;
    const selected = ids.map(id => cards.find(card => card.id === id));
    if (selected.some(card => !card || !canMergeRewardCard(card, now))) return null;
    const sources = selected as RewardCard[];
    const sum = (key: 'amount' | 'currentBalance' | 'totalTurnover' | 'turnoverTarget' | 'conversionLimit') =>
        sources.reduce((total, card) => total + card[key], 0);
    return {
        id: newId, milestoneDay: 0, title: '活動銀幣合併卡', currency: 'activity-silver',
        status: 'inactive', amount: sum('amount'), currentBalance: sum('currentBalance'),
        totalTurnover: sum('totalTurnover'), turnoverTarget: sum('turnoverTarget'),
        conversionLimit: sum('conversionLimit'), expiresAt: sources.map(card => card.expiresAt).sort().slice(-1)[0],
        convertedAmount: 0, recoveredAmount: 0, convertedAt: '', sourceCardIds: ids,
        sourceCount: sources.reduce((total, card) => total + (card.sourceCount ?? 1), 0),
    };
};
