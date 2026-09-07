import { createContext, useContext, useRef, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useRewardCards } from './RewardCardContext';
import { normalizePromoCode, PROMO_CODES, PROMO_CURRENCY_LABELS, validatePromoCode } from '../data/promoCodes';

interface PromoCodeContextValue {
    preview: (value: string) => string | null;
    redeem: (value: string) => string | null;
    claimedCodes: string[];
    activityGoldBalance: number;
}
const PromoCodeContext = createContext<PromoCodeContextValue | undefined>(undefined);

export const PromoCodeProvider = ({ children }: { children: ReactNode }) => {
    const { user, addWalletReward, recordPromoReward } = useAuth();
    const { grantPromoRewardCard } = useRewardCards();
    // Per-member, in-memory state survives bank unmounts, but never browser refresh.
    const claims = useRef(new Map<string, Set<string>>());
    const goldBalances = useRef(new Map<string, number>());
    const [, update] = useState(0);
    const key = user ? `${user.authProvider}:${user.account}` : '';
    const getClaims = () => claims.current.get(key) ?? new Set<string>();
    const preview = (value: string) => validatePromoCode(value, !!user && user.authProvider !== 'guest', getClaims());
    const redeem = (value: string) => {
        const error = preview(value);
        if (error) return error;
        const code = normalizePromoCode(value);
        const promo = PROMO_CODES.find(item => item.code === code)!;
        const source = `優惠碼 ${code}・${promo.title}`;
        const claimed = getClaims();
        // Reserve synchronously to prevent double grants before React rerenders.
        claimed.add(code);
        claims.current.set(key, claimed);
        let granted: boolean;
        if (promo.currency === 'activity-gold') {
            goldBalances.current.set(key, (goldBalances.current.get(key) ?? 0) + promo.amount);
            recordPromoReward(`${promo.amount.toLocaleString()} 活動金幣`, source);
            granted = true;
        } else if (promo.currency === 'activity-silver') {
            granted = grantPromoRewardCard({
                id: `promo-${key}-${code}`, milestoneDay: 0, title: promo.title,
                currency: 'activity-silver', amount: promo.amount, totalTurnover: 0,
                turnoverTarget: promo.turnoverTarget!, conversionLimit: promo.conversionLimit!, expiresAt: promo.cardExpiresAt!,
            }, source);
            if (granted) recordPromoReward(`${promo.amount.toLocaleString()} ${PROMO_CURRENCY_LABELS[promo.currency]}`, source);
        } else {
            granted = addWalletReward(promo.currency, promo.amount, source);
        }
        if (!granted) {
            claimed.delete(code);
            return '目前無法領取，請重新確認優惠碼或獎勵期限。';
        }
        update(current => current + 1);
        return null;
    };
    return <PromoCodeContext.Provider value={{ preview, redeem, claimedCodes: [...getClaims()], activityGoldBalance: goldBalances.current.get(key) ?? 0 }}>{children}</PromoCodeContext.Provider>;
};

export const usePromoCodes = () => {
    const context = useContext(PromoCodeContext);
    if (!context) throw new Error('usePromoCodes must be used within PromoCodeProvider');
    return context;
};
