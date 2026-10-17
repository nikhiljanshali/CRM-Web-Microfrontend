import { InvDetailData } from "./invdetaildata";

export class CustomerInvSearchResponse {
    inventories: InvDetailData[]
    totalCount!: number
    totalWeight!: number
    totalNetAmount!: number
    totalPerCarat!: number
    avgDiscount!: number
    avgPerCarat!: number
    avgNetAmount!: number

    constructor() {
        this.inventories = [];
    }
}