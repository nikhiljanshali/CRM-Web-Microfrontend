import { BaseEntity } from "common/entities/common/baseentity";
import { CustomerDNorm } from "common/businessobjects";

export class CustomerLog extends BaseEntity {
    type!: string
    customer: CustomerDNorm
    page!: string
    method!: string
    data!: string
    ipAddress!: string

    constructor() {
        super();
        this.customer = new CustomerDNorm();
    }
}