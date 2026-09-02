import type { CurrencyBalance, VIPLevelRule } from '../types/user';

interface VipRewardState {
    vipLevel: number;
    vipClaimedRewardLevels: number[];
    balance: CurrencyBalance;
}

/** Pure Mock transition: only the current tier can be claimed, once per session. */
export const applyVipRewardClaim = <T extends VipRewardState>(user: T, rule: VIPLevelRule): T | null => {
    if (
        rule.level === 0 || rule.level !== user.vipLevel
        || !rule.rewardCurrency || !rule.rewardAmount || rule.rewardAmount <= 0
        || user.vipClaimedRewardLevels.includes(rule.level)
    ) return null;

    return {
        ...user,
        vipClaimedRewardLevels: [...user.vipClaimedRewardLevels, rule.level],
        balance: {
            ...user.balance,
            [rule.rewardCurrency]: user.balance[rule.rewardCurrency] + rule.rewardAmount,
        },
    };
};
