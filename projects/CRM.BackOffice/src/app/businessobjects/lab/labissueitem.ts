import { PriceDNorm } from "../../entities"

export class LabIssueItem {
    stoneId!: string
    kapan!: string
    shape!: string
    weight!: number
    color!: string
    length!: number
    width!: number
    height!: number
    clarity!: string
    cut!: string
    polish!: string
    symmetry!: string
    fluorescence!: string
    basePrice: PriceDNorm
    status!: string 
    service!: string 
    isReceived!: boolean
    receiveDate!: Date | null
    recheckReason: string[]

    constructor() {
        this.basePrice = new PriceDNorm();
        this.recheckReason = [];
    }
}