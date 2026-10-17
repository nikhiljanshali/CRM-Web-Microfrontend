export class PricingRequest {
    Id!: string;
    Lab!: string
    Shape!: string
    Weight!: number
    Color!: string
    Clarity!: string
    Cut!: string
    Polish!: string
    Symmetry!: string
    Flour!: string
    Rapver!: string
    OrderNo?: Number
    InclusionDetail?: any
    MeasurementDetail?: any

    constructor() {
        this.InclusionDetail = {};
        this.MeasurementDetail = {};
     }
}