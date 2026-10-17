import { InventoryItems } from "common/entities"

export class MarketSheetSellerSearchResponse {
    marketSheets: InventoryItems[]
    totalCount!: number
    totalWeight!: number
    totalNetAmount!: number
    totalAvgDPC!: number
    totalDiscount!: number
    totalHolds!: number
    totalRapNetHolds!: number
    totalMemos!: number
    totalLeads!: number
    totalAvailable!: number
    totalHK!: number
    totalIndia!: number
    totalBelgium!: number

    constructor() {
        this.marketSheets = [];
    }
}