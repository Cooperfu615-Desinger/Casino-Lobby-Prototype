export type RewardCardCurrency = 'activity-gold' | 'activity-silver';

export type RewardCardStatus = 'inactive' | 'active' | 'paused' | 'converted';

export interface RewardCardDefinition {
    id: string;
    milestoneDay: number;
    title: string;
    currency: RewardCardCurrency;
    amount: number;
    totalTurnover: number;
    turnoverTarget: number;
    conversionLimit: number;
    expiresAt: string;
}

export interface RewardCard extends RewardCardDefinition {
    status: RewardCardStatus;
    currentBalance: number;
    convertedAmount: number;
    recoveredAmount: number;
    convertedAt: string;
}

export interface RewardCardConversionNotice {
    id: string;
    cardId: string;
    cardTitle: string;
    sourceCurrency: RewardCardCurrency;
    sourceLabel: string;
    destinationLabel: string;
    originalBalance: number;
    convertedAmount: number;
    recoveredAmount: number;
    walletBalance: number;
    createdAt: string;
    read: boolean;
}

export const REWARD_CARD_DEFINITIONS: RewardCardDefinition[] = [
    {
        id: 'daily-15-activity-silver',
        milestoneDay: 15,
        title: '活動銀幣',
        currency: 'activity-silver',
        amount: 10_000,
        totalTurnover: 0,
        turnoverTarget: 100_000,
        conversionLimit: 10_000,
        expiresAt: '2026/12/31',
    },
    {
        id: 'daily-20-activity-gold',
        milestoneDay: 20,
        title: '活動金幣',
        currency: 'activity-gold',
        amount: 5_000,
        totalTurnover: 0,
        turnoverTarget: 100_000,
        conversionLimit: 10_000,
        expiresAt: '2026/12/31',
    },
];
