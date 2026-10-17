import { BaseEntity } from "shared/enitites"
import { LogisticDNorm, OrganizationDNorm } from "../../businessobjects"
import { BankDNorm } from "../accounting/bankdnorm"
import { LedgerDNorm } from "../accounting/dnorm/ledgerdnorm"
import { TaxType } from "../accounting/taxType"
import { IdentityDNorm } from "../inventory/identityDNorm"
import { InventoryItems } from "../inventory/inventoryitems"

export class Memo extends BaseEntity {
    memoNo!: number;
    organization: OrganizationDNorm
    party: LedgerDNorm
    broker: LedgerDNorm
    courierName: LogisticDNorm
    bank: BankDNorm
    taxTypes: TaxType[]
    seller!: string
    takenBy!: string
    inventoryItems: InventoryItems[]
    identity: IdentityDNorm
    expiredDays!: number
    expiredDate!: Date
    qcReason!: string
    portOfLoading!: string
    fromCurrency!: string
    fromCurRate!: number | null;
    toCurrency!: string
    toCurRate!: number | null;
    totalAmount!: number | null;
    isOverseas!: boolean;
    terms!: string;
    intermediaryBank!: string;
    consigneeName!: string;
    consigneeAddress!: string;
    exportType!: string;
    iecNo!: string;
    boxWeight!: string;
    shippingCharge!: number;
    additionalDeclaration!: string;

    constructor() {
        super();
        this.party = new LedgerDNorm();
        this.broker = new LedgerDNorm();
        this.courierName = new LogisticDNorm();
        this.bank = new BankDNorm();
        this.taxTypes = new Array<TaxType>();
        this.inventoryItems = new Array<InventoryItems>();
        this.identity = new IdentityDNorm();
        this.organization = new OrganizationDNorm();
    }
}