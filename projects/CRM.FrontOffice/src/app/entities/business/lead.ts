import { BaseEntity } from "shared/enitites";
import { BrokerDNrom, CustomerDNorm, InvItem, LeadSummary, SystemUserDNorm } from "..";

export class Lead extends BaseEntity {
    leadNo!: number;
    customer!: CustomerDNorm;
    broker!: BrokerDNrom;
    seller!: SystemUserDNorm;
    leadInventoryItems!: InvItem[];
    leadSummary: LeadSummary;
    leadStatus!: string;
    expiredDays: number = 0;
    qcCriteria!: string;
    pickUpLocation!: string;
    platform: string;
    daysLeft?: number;


    constructor() {
        super();
        this.customer = new CustomerDNorm();
        this.broker = new BrokerDNrom();
        this.seller = new SystemUserDNorm();
        this.leadSummary = new LeadSummary();
        this.leadInventoryItems = new Array<InvItem>();
        this.leadStatus = "proposal";
        this.expiredDays = 10;
        this.platform = "offline";
    }

}
