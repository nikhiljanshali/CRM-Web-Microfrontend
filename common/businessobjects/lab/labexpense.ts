import { LabDNorm } from "../lab/labdnorm"
import { BaseEntity } from "common/entities/common/baseentity"
import { IdentityDNorm } from "../../entities"

export class LabExpense extends BaseEntity {
    stoneId!: string
    certificateNo!: string
    invoiceNo!: string
    invoiceDate!: Date | null
    jobNo!: string
    controlNo!: string
    service!: string
    labFees!: number
    handlingCharge!: number
    shippingCharge!: number
    taxAmount!: number
    lab: LabDNorm
    identity: IdentityDNorm
    currencyType!: string;
    currencyRate!: number;
    totalExpense!: number;

    //Extra 
    invoiceAmount!: number | null;
    labName!: string; 

    constructor() {
        super();
        this.lab = new LabDNorm();
        this.identity = new IdentityDNorm();
    }
}