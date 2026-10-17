import { Broker, Customer, OrderInventoryItems, SellerDNorm, Summary } from "common/businessobjects";
import { BaseEntity } from "common/entities/common/baseentity"

export class Lead extends BaseEntity {
    leadNo!: number;
    customer!: Customer;
    broker!: Broker;
    seller!: SellerDNorm;
    leadInventoryItems!: OrderInventoryItems[];
    summary: Summary;
    leadStatus!: string;
    ngDiscount!: number;
    reqDis!: number;
    expiredDays: number = 0;
    isNegotiatedStatus: boolean = null as any;
    isEcom:boolean = false;
    qcCriteria!: string;
    ecomOrderId:number = 0;

    constructor() {
        super();
        this.customer = new Customer();
        this.broker = new Broker();
        this.seller = new SellerDNorm();
        this.summary = new Summary();
        this.leadInventoryItems = new Array<OrderInventoryItems>();
        this.leadStatus = "proposal";
        this.leadNo = 1000000;
        this.ngDiscount = 0;
        this.expiredDays = 10;
    }

}
