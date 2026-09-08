import type { RewardCard } from '../types/rewardCard';

// Date-only cards remain valid through the displayed date, using existing local-time semantics.
export const getRewardCardExpiryTime = (card: Pick<RewardCard, 'expiresAt'>) => {
    const [year, month, day] = card.expiresAt.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    if (!year || !month || !day || date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return NaN;
    return new Date(year, month - 1, day + 1).getTime();
};

export const isRewardCardExpired = (card: Pick<RewardCard, 'expiresAt'>, now = new Date()) =>
    !(getRewardCardExpiryTime(card) > now.getTime());

export const canActivateRewardCard = (card: RewardCard, now = new Date()) =>
    ['inactive', 'paused'].includes(card.status) && !isRewardCardExpired(card, now);

export const canMergeRewardCard = (card: RewardCard, now = new Date()) =>
    canActivateRewardCard(card, now) && getRewardCardExpiryTime(card) - now.getTime() > 72 * 60 * 60 * 1000;

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
        conversionLimit: sum('conversionLimit'), expiresAt: sources.reduce((earliest, card) => getRewardCardExpiryTime(card) < getRewardCardExpiryTime(earliest) ? card : earliest).expiresAt,
        convertedAmount: 0, recoveredAmount: 0, convertedAt: '', sourceCardIds: ids,
        sourceCount: sources.reduce((total, card) => total + (card.sourceCount ?? 1), 0),
    };
};
