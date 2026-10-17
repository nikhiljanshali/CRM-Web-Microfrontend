import { BaseEntity } from "shared/enitites";
import { BrokerDNrom, CustomerDNorm, InvDNorm, LeadSummary, SystemUserDNorm } from "..";
import { InvItem } from "../../businessobjects";

export class Lead extends BaseEntity {
    leadNo!: number;
    customer!: CustomerDNorm;
    broker!: BrokerDNrom;
    seller!: SystemUserDNorm;
    leadInventoryItems!: InvItem[];
    leadSummary: LeadSummary;
    leadStatus!: string;
    expiredDays!: number;
    approveDate!: Date;
    qcCriteria!: string;
    pickupLocation!: string;
    platform!:string;

    constructor() {
        super();
        this.customer = new CustomerDNorm();
        this.broker = new BrokerDNrom();
        this.seller = new SystemUserDNorm();
        this.leadSummary = new LeadSummary();
        this.leadInventoryItems = new Array<InvItem>();
    }

}
