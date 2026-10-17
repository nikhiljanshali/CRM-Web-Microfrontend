import { Address } from "./address"

export class OrganizationDNorm {
    id!: string
    name!: string
    person!: string
    phoneNo!: string
    faxNo?: string
    email!: string
    address?: Address
    
    constructor() { 
        this.address = new Address();
    }
}