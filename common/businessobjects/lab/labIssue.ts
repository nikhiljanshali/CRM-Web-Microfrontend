import { LabDNorm } from "../lab/labdnorm"
import { LogisticDNorm } from "../logistic/logisticdnorm"
import { BaseEntity } from "common/entities/common/baseentity"
import { LabIssueItem } from "../lab/labissueitem"
import { IdentityDNorm } from "../../entities"

export class LabIssue extends BaseEntity {
    lab: LabDNorm
    logistic: LogisticDNorm
    labIssueItems: LabIssueItem[]
    dollarRate!: number;
    identity: IdentityDNorm

    constructor() {
        super();
        this.lab = new LabDNorm();
        this.logistic = new LogisticDNorm();
        this.labIssueItems = [];
        this.identity = new IdentityDNorm();        
    }
}