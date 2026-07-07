export type WalletExchangeDirection = 'gold-to-silver' | 'silver-to-gold';

export const GOLD_TO_SILVER_RATE = 100;

export interface WalletExchangeResult {
    direction: WalletExchangeDirection;
    fromAmount: number;
    toAmount: number;
    fee: 0;
}

export const calculateWalletExchange = (
    direction: WalletExchangeDirection,
    amount: number
): WalletExchangeResult => {
    const fromAmount = Math.max(0, Math.floor(amount));
    const toAmount = direction === 'gold-to-silver'
        ? fromAmount * GOLD_TO_SILVER_RATE
        : Math.floor(fromAmount / GOLD_TO_SILVER_RATE);

    return {
        direction,
        fromAmount,
        toAmount,
        fee: 0,
    };
};

export const canSubmitWalletExchange = (
    direction: WalletExchangeDirection,
    amount: number,
    sourceBalance: number
) => {
    const normalizedAmount = Math.floor(amount);
    if (normalizedAmount <= 0 || normalizedAmount > sourceBalance) return false;
    if (direction === 'silver-to-gold') return normalizedAmount % GOLD_TO_SILVER_RATE === 0;
    return true;
};
