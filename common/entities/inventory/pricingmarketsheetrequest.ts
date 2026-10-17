export class PricingMarketSheetRequest {
    Id!: string;
    Lab!: string;
    Shape!: string;
    Weight!: number;
    Color!: string;
    Clarity!: string;
    Cut!: string;
    Polish!: string;
    Symmetry!: string;
    Flour!: string;
    MGrade!: string;
    IGrade!: string;
    Day!: number;
    InclusionPrice?: any;
    MeasurePrice?: any;

    constructor() {
        this.InclusionPrice = {};
        this.MeasurePrice = {};
    }
}