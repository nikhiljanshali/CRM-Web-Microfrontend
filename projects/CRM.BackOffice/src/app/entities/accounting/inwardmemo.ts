import { BaseEntity } from "shared/enitites"
import { LedgerDNorm, MemoInvItem } from ".."
import { LogisticDNorm } from "../../businessobjects"
import { IdentityDNorm } from "../inventory/identityDNorm"

export class InWardMemo extends BaseEntity {
    memoNo!: string
    party!: LedgerDNorm
    broker!: LedgerDNorm
    courierName!: LogisticDNorm
    employee!: IdentityDNorm
    inventoryItems!: MemoInvItem[]
    totalPcs!: number
    totalWeight!: number
    totalAmount!: number
    expiryDays!: number
    expiryDate!: Date
    isReturned!: boolean
    returnDate!: Date

    constructor() {
        super();
        this.party = new LedgerDNorm();
        this.broker = new LedgerDNorm();
        this.courierName = new LogisticDNorm();
        this.employee = new IdentityDNorm();
        this.inventoryItems = new Array<MemoInvItem>();
    }
}