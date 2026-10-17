import { CustomerDNorm, EmployeeDNorm } from 'common/businessobjects'
import { BaseEntity } from '../common/baseentity'

export class StoneProposal extends BaseEntity {
    token!: string
    cutomer!: CustomerDNorm
    employee!: EmployeeDNorm
    criteriaJson!: string
    stoneIds!: string[]
    proposalUrl!: string

    constructor() {
        super();
        this.cutomer = new CustomerDNorm();
        this.employee = new EmployeeDNorm();
        this.stoneIds = [];
    }
}