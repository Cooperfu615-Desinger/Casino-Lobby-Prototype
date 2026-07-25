import type { CurrencyBalance } from '../types/user';
import type { GameWalletKey, GameWalletOption } from '../types/gameWallet';

interface GameWalletBalances {
    stored: CurrencyBalance;
    activityGold: number;
    activitySilver: number;
}

export const buildGameWalletOptions = ({
    stored,
    activityGold,
    activitySilver,
}: GameWalletBalances): GameWalletOption[] => [
    {
        key: 'stored-gold',
        label: '儲值金幣',
        shortLabel: '儲值金',
        balance: stored.gold,
        tone: 'gold',
        isActivity: false,
        enabled: stored.gold > 0,
    },
    {
        key: 'activity-gold',
        label: '活動金幣',
        shortLabel: '活動金',
        balance: activityGold,
        tone: 'gold',
        isActivity: true,
        enabled: activityGold > 0,
        unavailableReason: '需先啟用金幣獎勵卡',
    },
    {
        key: 'stored-silver',
        label: '儲值銀幣',
        shortLabel: '儲值銀',
        balance: stored.silver,
        tone: 'silver',
        isActivity: false,
        enabled: stored.silver > 0,
    },
    {
        key: 'activity-silver',
        label: '活動銀幣',
        shortLabel: '活動銀',
        balance: activitySilver,
        tone: 'silver',
        isActivity: true,
        enabled: activitySilver > 0,
        unavailableReason: '需先啟用銀幣獎勵卡',
    },
    {
        key: 'bronze',
        label: '銅幣',
        shortLabel: '銅幣',
        balance: stored.bronze,
        tone: 'bronze',
        isActivity: false,
        enabled: stored.bronze > 0,
    },
];

export const getGameWalletLabel = (key: GameWalletKey) => {
    const labels: Record<GameWalletKey, string> = {
        'stored-gold': '儲值金幣',
        'activity-gold': '活動金幣',
        'stored-silver': '儲值銀幣',
        'activity-silver': '活動銀幣',
        bronze: '銅幣',
    };
    return labels[key];
};
