import { InventoryItems } from "common/entities"

export class MarketSheetSearchResponse {
    marketSheets: InventoryItems[]
    totalCount!: number
    totalWeight!: number
    totalNetAmount!: number
    totalBlockedStones!: number
    totalAvgDPC!: number
    totalDiscount!: number

    constructor() {
        this.marketSheets = [];
    }
}