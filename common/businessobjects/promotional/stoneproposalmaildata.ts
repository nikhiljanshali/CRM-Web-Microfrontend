import { CustomerDNorm, EmployeeDNorm } from "..";

export class StoneProposalMailData {
    token!: string
    cutomer!: CustomerDNorm
    employee!: EmployeeDNorm
    criteriaJson!: string
    stoneIds!: string[]
    subject!: string
    body!: string
    templatePath!: string
    proposalUrl!: string

    constructor() {
        this.cutomer = new CustomerDNorm();
        this.employee = new EmployeeDNorm();
        this.stoneIds = [];
    }

}