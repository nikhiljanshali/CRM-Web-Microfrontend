import { PendingPricing } from "../../entities";

export class PendingPricingResponse {
    pendingPricings: PendingPricing[]

    totalCount!: number
    totalWeight!: number
    avgDiscount!: number

    constructor() {
        this.pendingPricings = []
     }
}