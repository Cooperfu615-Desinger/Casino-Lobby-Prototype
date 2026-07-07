import type { CurrencyBalance, CurrencyType } from '../../types/user';

interface WalletDisplayItem {
    key: CurrencyType;
    label: string;
    shortLabel: string;
    color: string;
}

const WALLET_ITEMS: WalletDisplayItem[] = [
    { key: 'gold', label: '金幣', shortLabel: '金', color: '#FFD700' },
    { key: 'silver', label: '銀幣', shortLabel: '銀', color: '#C0C7D1' },
    { key: 'bronze', label: '銅幣', shortLabel: '銅', color: '#D08A4A' },
];

const EMPTY_BALANCE: CurrencyBalance = {
    gold: 0,
    silver: 0,
    bronze: 0,
};

interface WalletBalancesProps {
    balance?: CurrencyBalance;
    variant?: 'cards' | 'compact';
    className?: string;
    isAnimating?: boolean;
}

const WalletBalances = ({
    balance = EMPTY_BALANCE,
    variant = 'cards',
    className = '',
    isAnimating = false,
}: WalletBalancesProps) => {
    const isCompact = variant === 'compact';

    return (
        <div
            aria-label="錢包餘額"
            className={`${isCompact ? 'grid grid-cols-3 gap-2' : 'grid grid-cols-1 gap-[3px]'} ${className}`}
        >
            {WALLET_ITEMS.map((wallet) => (
                <div
                    key={wallet.key}
                    className={`min-w-0 border bg-black/25 transition-all ${isCompact
                        ? 'rounded-xl border-white/10 px-2 py-1.5 shadow-md'
                        : 'flex h-[60px] flex-col justify-between rounded-xl border-white/5 px-3 py-2'
                        } ${isAnimating && wallet.key === 'gold' ? 'scale-105 border-[#FFD700]/70 shadow-[0_0_18px_rgba(255,215,0,0.36)]' : ''}`}
                >
                    <div className={`flex items-center gap-1.5 ${isCompact ? 'mb-0.5' : 'mb-1'}`}>
                        <span
                            className="h-2 w-2 shrink-0 rounded-full shadow-[0_0_8px_currentColor]"
                            style={{ color: wallet.color, backgroundColor: wallet.color }}
                            aria-hidden="true"
                        />
                        <span className={`${isCompact ? 'text-[10px]' : 'text-xs'} font-bold text-slate-400`}>
                            {isCompact ? wallet.shortLabel : wallet.label}
                        </span>
                    </div>
                    <div
                        className={`${isCompact ? 'text-xs' : 'text-lg'} truncate text-right font-mono font-black tabular-nums`}
                        style={{ color: wallet.color }}
                    >
                        {balance[wallet.key].toLocaleString()}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WalletBalances;
