import { BaseEntity } from "shared/enitites";
import { IdentityDNorm } from "../inventory/identityDNorm";
import { LedgerDNorm } from "./dnorm/ledgerdnorm";
import { OrderInvItem } from "./dnorm/orderinvitem";

export class OrderItem extends BaseEntity {
    invoiceNo!: string
    transactionId!: string
    leadId!: string
    leadNumber!: string
    party: LedgerDNorm
    broker: LedgerDNorm
    invItem: OrderInvItem
    avgDays?: number | null
    seller: IdentityDNorm
    approvedBy: IdentityDNorm

    constructor() {
        super();
        this.party = new LedgerDNorm();
        this.broker = new LedgerDNorm();
        this.invItem = new OrderInvItem();
        this.seller = new IdentityDNorm();
        this.approvedBy = new IdentityDNorm();
    }
}