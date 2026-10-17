import { BrokerDNrom, CustomerDNorm, LeadSummary, SystemUserDNorm } from "../../entities";

export class LeadResponse {
    id!: string;
    leadNo!: number;
    party!: CustomerDNorm;
    broker!: BrokerDNrom;
    seller!: SystemUserDNorm;
    leadSummary: LeadSummary;
    leadStatus!: string;
    expiredDays: number = 0;
    createdDate!: Date;
    daysLeft: number = 0;
    platform!: string;

    constructor() {
        this.party = new CustomerDNorm();
        this.broker = new BrokerDNrom();
        this.seller = new SystemUserDNorm();
        this.leadSummary = new LeadSummary();
        this.leadStatus = "proposal";
        this.leadNo = 1000000;
    }
}