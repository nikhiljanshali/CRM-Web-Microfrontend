import { BaseEntity } from "shared/enitites";
import { IdentityDNorm } from "../../entities";
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