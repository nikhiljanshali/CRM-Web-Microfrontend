import { PriceDNorm } from "../../entities"

export class UpdateHoldReleaseInventory {
    stoneId!: string
    price: PriceDNorm
    isHold!: boolean
    holdDate!: Date | null
    holdDays!: number
    updatedAt!: Date

    constructor() {
        this.price = new PriceDNorm();
    }
}