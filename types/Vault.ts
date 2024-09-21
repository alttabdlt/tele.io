// types/Vault.ts

export interface Vault {
    id: string;
    name: string;
    creatorId: string;
    participants: { userId: string; amount: number }[];
    investmentAmount: number;
    tradeTime: Date;
    createdAt: Date;
}