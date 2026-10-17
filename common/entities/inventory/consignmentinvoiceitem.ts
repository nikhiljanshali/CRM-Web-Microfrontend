import { PriceDNorm } from ".."

export class ConsignmentInvoiceItem {
    stoneId!: string
    kapan!: string
    shape!: string
    weight!: number
    color!: string
    clarity!: string
    cut!: string
    polish!: string
    symmetry!: string
    fluorescence!: string
    basePrice: PriceDNorm
    isReceived!: boolean
    receiveDate!: Date | null

    constructor() {
        this.basePrice = new PriceDNorm();
    }
}