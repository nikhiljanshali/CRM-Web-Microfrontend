import { BaseEntity } from "shared/enitites";
import { LedgerDNorm, LedgerGroup, TaxType, TransactItemGroup } from "../../entities";

export class AccountingConfig extends BaseEntity {

    salesLedger: LedgerDNorm
    purchaseLedger: LedgerDNorm
    lastInvoiceNum!: number
    ledgerGroups!: LedgerGroup[]
    taxTypes!: TaxType[]
    transactItemGroups!: TransactItemGroup[]

    constructor() {
        super();
        this.salesLedger = new LedgerDNorm();
        this.purchaseLedger = new LedgerDNorm();
        this.ledgerGroups = [];
        this.taxTypes = [];
        this.transactItemGroups = [];
    }
}