import { PriceDNorm } from "../../entities"

export class TempPendingPricing {

    stoneId!: string
    tempPrice: PriceDNorm

    constructor() {
        this.tempPrice = new PriceDNorm();
    }
}