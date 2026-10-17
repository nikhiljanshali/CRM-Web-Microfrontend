import { PriceDNorm } from "../.."

export class MemoInvItem {
    invId!: string
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
    length!: number
    width!: number
    height!: number
    lab!: string
    certificateNo!: string
    price!: PriceDNorm
    isHeld!: boolean
    isReturned!: boolean
    returnDate!: Date | null

    constructor() {
        this.price = new PriceDNorm();
    }
}