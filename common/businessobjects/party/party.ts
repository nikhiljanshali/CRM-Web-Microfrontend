import { Address } from "common/businessobjects"
import { BaseEntity } from "common/entities/common/baseentity"

export class Party extends BaseEntity {
  name!: string
  code!: string
  contactPerson!: string 
  partyType!: string
  address: Address = new Address()
  email!: string
  mobileNo!: string
  phoneNo!: string  
  faxNo!: string
  incomeTaxNo!: string  
  taxNo!: string  
  lineOfBusiness!: string
  isActive!: boolean    

  constructor() { 
    super();
    this.address = new Address();
  }
}