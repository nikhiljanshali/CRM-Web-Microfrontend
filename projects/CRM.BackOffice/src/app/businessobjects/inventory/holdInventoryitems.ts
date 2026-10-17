export class HoldInventoryItems {
    stoneId!: string
    isHold: boolean
    holdDate!: Date | null
    holdDays!: number
    updatedAt!: Date

    constructor() {
        this.isHold = false;
    }
}