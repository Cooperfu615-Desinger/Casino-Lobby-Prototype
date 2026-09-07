export interface PromoCode {
    code: string;
    title: string;
    currency: 'silver' | 'bronze' | 'activity-silver' | 'activity-gold';
    amount: number;
    startsAt: string;
    endsAt: string;
    cardExpiresAt?: string;
    turnoverTarget?: number;
    conversionLimit?: number;
}

export const PROMO_CURRENCY_LABELS = {
    silver: '儲值銀幣', bronze: '銅幣', 'activity-silver': '活動銀幣獎勵卡', 'activity-gold': '活動金幣',
};

// Fixed fixtures represent codes issued by operations, not a frontend generator.
export const PROMO_CODES: PromoCode[] = [
    { code: 'G6Y2A8U4', title: '活動金幣禮', currency: 'activity-gold', amount: 1000, startsAt: '2026-01-01T00:00:00+08:00', endsAt: '2026-12-31T23:59:59+08:00' },
    { code: 'K7M2X9P4', title: '銀幣補給禮', currency: 'silver', amount: 2000, startsAt: '2026-01-01T00:00:00+08:00', endsAt: '2026-12-31T23:59:59+08:00' },
    { code: 'B8R3N6T2', title: '銅幣歡迎禮', currency: 'bronze', amount: 3000, startsAt: '2026-01-01T00:00:00+08:00', endsAt: '2026-12-31T23:59:59+08:00' },
    { code: 'S5H9C2V7', title: '活動銀幣體驗禮', currency: 'activity-silver', amount: 5000, startsAt: '2026-01-01T00:00:00+08:00', endsAt: '2026-12-31T23:59:59+08:00', cardExpiresAt: '2027/01/31', turnoverTarget: 50000, conversionLimit: 5000 },
    { code: 'E4Q8W2R6', title: '已到期示範', currency: 'silver', amount: 1000, startsAt: '2020-01-01T00:00:00+08:00', endsAt: '2020-12-31T23:59:59+08:00' },
    { code: 'F9D3J7L2', title: '未開始示範', currency: 'bronze', amount: 1000, startsAt: '2099-01-01T00:00:00+08:00', endsAt: '2099-12-31T23:59:59+08:00' },
];

export const normalizePromoCode = (value: string) => value.trim().toUpperCase();

export const validatePromoCode = (value: string, member: boolean, claimed: ReadonlySet<string>, now = Date.now()) => {
    if (!member) return '請先註冊或登入一般會員後再兌換。';
    const code = normalizePromoCode(value);
    if (!/^[A-Z0-9]{8}$/.test(code)) return '請輸入 8 碼英文字母或數字。';
    const promo = PROMO_CODES.find(item => item.code === code);
    if (!promo) return '找不到此優惠碼，請確認後再試。';
    if (claimed.has(code)) return '您已兌換過此優惠碼。';
    if (now < Date.parse(promo.startsAt)) return '此優惠碼尚未生效。';
    if (now > Date.parse(promo.endsAt)) return '此優惠碼已過期。';
    return null;
};
