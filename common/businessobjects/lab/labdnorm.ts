import { Address } from ".."

export class LabDNorm {
    id!: string
    name!: string
    email!: string
    mobileNo!: string
    phoneNo!: string
    execFormat!: string
    address: Address
    accountNo!: string

    constructor() {
        this.address = new Address();
    }
}