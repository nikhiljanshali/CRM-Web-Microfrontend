import { BaseEntity } from "shared/enitites"

export class HoldInventoryItems extends BaseEntity {
    stoneId!: string    
    isHold: boolean
    holdDate!: Date | null
    holdDays!: number

    constructor() {
        super();        
        this.isHold = false;        
    }
}