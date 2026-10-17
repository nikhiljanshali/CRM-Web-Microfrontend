export class PricingMarketSheetResponse {
    Id!: string;
    Lab!: string;
    RapPrice!: number;
    DCaret!: number;
    Amount!: number;
    DeadStockDiscount!: number;
    Discount!: number;
    MasterDiscount!: number;
    MfgDiscount!: number | null;
    SalesAddDiscount!: number | null;
    IGrade!: string;
    IDiscount!: number | null;
    MGrade!: string;
    MDiscount!: number | null;
    Error!: string;

    constructor() { }
}