import { IdentityDNorm } from "common/entities";
import { BaseEntity } from "common/entities/common/baseentity";
import { LabIssueItem } from "./labissueitem";

export class LabReCheck extends BaseEntity {

    labRecheckItem: LabIssueItem;
    isRecheck: boolean = false;
    recheckReason!: string[];
    identity: IdentityDNorm;

    constructor() {
        super();
        this.identity = new IdentityDNorm();
        this.labRecheckItem = new LabIssueItem();
    }
}