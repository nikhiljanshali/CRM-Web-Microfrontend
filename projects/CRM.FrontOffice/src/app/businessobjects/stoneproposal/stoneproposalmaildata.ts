import { CustomerDNorm, SystemUserDNorm } from "../../entities";

export class StoneProposalMailData {
    token!: string
    cutomer!: CustomerDNorm
    systemUser!: SystemUserDNorm
    criteriaJson!: string
    stoneIds!: string[]
    subject!: string
    body!: string
    templatePath!: string
    proposalUrl!: string

    constructor() {
        this.cutomer = new CustomerDNorm();
        this.systemUser = new SystemUserDNorm();
        this.stoneIds = [];
    }

}