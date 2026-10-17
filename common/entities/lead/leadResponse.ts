import { Broker, Party, SellerDNorm, Summary } from "common/businessobjects";

export class LeadResponse {
    id!: string;
    leadNo!: number;
    party!: Party;
    broker!: Broker;
    seller!: SellerDNorm;
    summary: Summary;
    leadStatus!: string;
    ngDiscount!: number;
    expiredDays: number = 0;
    isNegotiatedStatus: boolean = null as any;
    isEcom: boolean = null as any;
    createdDate!: Date;
    daysLeft: number = 0;

    constructor() {
        this.party = new Party();
        this.broker = new Broker();
        this.seller = new SellerDNorm();
        this.summary = new Summary();
        this.leadStatus = "proposal";
        this.leadNo = 1000000;
        this.ngDiscount = 0;
    }
}