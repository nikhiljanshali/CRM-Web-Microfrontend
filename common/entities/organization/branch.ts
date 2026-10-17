import { Address } from "common/businessobjects"
import { BaseEntity } from "../common/baseentity"

export class Branch extends BaseEntity {
      name!: string
      registrationNo!: string
      incomeTaxNo!: string
      address: Address
      taxNo!: string
      person!: string
      email!: string
      mobileNo!: string
      phoneNo!: string
      faxNo!: string
      deviceRFIDUrl!: string

      constructor() {
            super();
            this.address = new Address();
      }
}