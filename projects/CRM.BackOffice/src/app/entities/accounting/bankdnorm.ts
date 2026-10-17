import { Address } from "shared/businessobjects";

export class BankDNorm {
    bankName!: string;
    branch!: string;
    address: Address
    accountNo!: string;
    accountName!: string;
    ifsc!: string;
    swift!: string;
    adCode!: string;
    
    constructor() {
        this.address = new Address();
    }
}