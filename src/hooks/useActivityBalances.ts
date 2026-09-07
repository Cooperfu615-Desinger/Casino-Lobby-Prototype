import { useRewardCards } from '../context/RewardCardContext';
import { isRewardCardExpired } from '../utils/rewardCardMerge';
import { usePromoCodes } from '../context/PromoCodeContext';

/** Display totals; activity gold is currently credited only through mock promo codes. */
export const useActivityBalances = () => {
    const { activityGoldBalance } = usePromoCodes();
    const { rewardCards, availableActivitySilverBalance } = useRewardCards();
    const silver = rewardCards
        .filter(card => ['inactive', 'active', 'paused'].includes(card.status) && !isRewardCardExpired(card))
        .reduce((sum, card) => sum + card.currentBalance, 0);
    return { gold: activityGoldBalance, silver, availableSilver: availableActivitySilverBalance };
};
