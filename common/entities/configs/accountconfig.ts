import { HoldReason, InvoiceTerm, Reason } from "common/businessobjects";
import { BaseEntity } from "../common/baseentity";

export class AccountConfig extends BaseEntity {

    holdReasons: HoldReason[];
    invoiceTerms: InvoiceTerm[];
    qcReasons: Reason[];
    removeStoneReasons: Reason[];

    constructor() {
        super();
        this.holdReasons = new Array<HoldReason>();
        this.invoiceTerms = new Array<InvoiceTerm>();
        this.qcReasons = new Array<Reason>();
        this.removeStoneReasons = new Array<Reason>();
    }
}