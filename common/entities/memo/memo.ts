import { Broker, Party, SellerDNorm } from "common/businessobjects";
import { IdentityDNorm, InventoryItems, TakenBy } from "..";
import { BaseEntity } from "../common/baseentity";

export class Memo extends BaseEntity {
    party: Party
    broker: Broker
    seller: SellerDNorm
    takenBy!: TakenBy
    inventoryItems: InventoryItems[]
    identity: IdentityDNorm
    expiredDays!: number
    expiredDate!: Date
    qcReason!: string

    constructor() {
        super();
        this.party = new Party();
        this.broker = new Broker();
        this.seller = new SellerDNorm();
        this.inventoryItems = new Array<InventoryItems>();
        this.identity = new IdentityDNorm();
    }
}