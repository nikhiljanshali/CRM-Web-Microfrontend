import { Address } from "shared/businessobjects"

export class LedgerDNorm {
    id!: string
    group!: string
    name!: string
    contactPerson!: string
    email!: string
    mobileNo!: string
    phoneNo!: string
    faxNo!: string
    address: Address

    constructor() {
        this.address = new Address();
    }

}