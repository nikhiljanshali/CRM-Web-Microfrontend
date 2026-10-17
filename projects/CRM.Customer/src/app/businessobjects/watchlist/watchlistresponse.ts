import { BaseEntity } from "shared/enitites";
import { InvDetailData } from "..";
import { CustomerDNorm } from "../../entities/customer/dnorm/customerdnorm";

export class WatchListResponse extends BaseEntity {
    invItemId!: string
    invItemNumber!: string
    oldDiscount?: number
    inventoryDetail: InvDetailData
    customer: CustomerDNorm
    addedAt!: Date

    constructor() {
        super();
        this.inventoryDetail = new InvDetailData();
        this.customer = new CustomerDNorm();
    }
}