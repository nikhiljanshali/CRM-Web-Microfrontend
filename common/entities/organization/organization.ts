import { Address } from "../../businessobjects/common/address"
import { CreditLimit } from "../../businessobjects/common/creditllimit"
import { BaseEntity } from "../common/baseentity"
import { Branch } from "./branch"
import { Department } from "./department"

export class Organization extends BaseEntity {
      name!: string
      origin!: string
      organizationType!: string
      businessType!: string
      registrationNo!: string
      incomeTaxNo!: string
      taxNo!: string
      membership!: string
      address: Address
      website!: string
      creditLimit: CreditLimit
      branches!: Branch[]
      departments!: Department[]
      person!: string
      email!: string
      mobileNo!: string
      phoneNo!: string
      faxNo!: string
      gstNo!: string

      constructor() {
            super();
            this.branches = [];
            this.departments = [];
            this.address = new Address();
            this.creditLimit = new CreditLimit();
      }

}