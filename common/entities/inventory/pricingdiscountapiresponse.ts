export class PricingDiscountApiResponse {
    Id!: string;
    Lab!: string;
    RapPrice!: number;
    DCaret!: number;
    Amount!: number;
    DeadStockDiscount!: number | null;
    Discount!: number;
    MasterDiscount!: number | null;
    MfgDiscount!: number | null;
    SalesAddDiscount!: number | null;
    IGrade?: any;
    IDiscount?: any;
    MGrade?: any;
    MDiscount?: any;
    Error?: any;

    constructor(){}
}