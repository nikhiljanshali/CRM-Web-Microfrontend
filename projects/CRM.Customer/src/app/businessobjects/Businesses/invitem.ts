import { PriceDNorm } from ".."

export class InvItem {
    invId!: string
    stoneId!: string
    kapan!: string
    rFID!: string
    shape!: string
    weight!: number
    color!: string
    clarity!: string
    cut!: string
    polish!: string
    symmetry!: string
    fluorescence!: string
    location!: string
    lab!: string
    certificateNo!: string
    certificateUrl!:string
    imageUrl!: string
    videoUrl!: string
    price!: PriceDNorm
    sDiscount!: number
    fDiscount!: number
    fAmount!: number
    removeStoneReason!: string
    isHold!:boolean    
    isRejected!: boolean

    constructor() {
        this.price = new PriceDNorm();
    }
}
