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
    type: 'deposit' | 'withdraw' | 'rebate';
    amount: string;
    status: 'success' | 'processing' | 'failed';
    method: string;
}

export type TransactionType = 'deposit' | 'withdraw' | 'rebate';
export type TransactionStatus = 'success' | 'processing' | 'failed';
