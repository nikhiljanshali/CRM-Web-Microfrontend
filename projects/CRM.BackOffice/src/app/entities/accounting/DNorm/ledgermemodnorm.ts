import { Address } from "shared/businessobjects"

export class LedgerMemoDNorm {
    id!: string
    name!: string
    group!: string
    mobileNo!: string
    taxNo!: string
    address: Address

    constructor() {
        this.address = new Address();
    }

}