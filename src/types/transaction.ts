// Transaction related types

export interface Package {
    id: number;
    coins: string;
    price: string;
    bonus: string | null;
    best?: boolean;
}

export interface SalePackage {
    id: number;
    title: string;
    coins: string;
    price: string;
    original: string;
    tag: string;
}

export interface Transaction {
    id: string;
    date: string;
    type: 'deposit' | 'withdraw' | 'rebate' | 'free_reward' | 'gift_transfer' | 'gift_package';
    amount: string;
    status: 'success' | 'processing' | 'failed';
    method: string;
}

export type TransactionType = 'deposit' | 'withdraw' | 'rebate' | 'free_reward' | 'gift_transfer' | 'gift_package';
export type TransactionStatus = 'success' | 'processing' | 'failed';

/** 專屬優惠方案卡片 */
export interface OfferPackage {
    id: number;
    title: string;
    description: string;
    coins: string;
    price: string;
    original: string;
    tag: string;
    gradient: string;
    expireTime?: string;
}
