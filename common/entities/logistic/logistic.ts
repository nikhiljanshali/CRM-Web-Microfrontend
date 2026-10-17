import { Address } from "common/businessobjects"
import { BaseEntity } from 'common/entities/common/baseentity'
import { LogisticConfig } from "./logisticconfig"

export class Logistic extends BaseEntity {
      name!: string
      email!: string
      mobileNo!: string
      phoneNo!: string
      faxNo!: string
      website!: string
      registrationNo!: string
      incomeTaxNo!: string
      taxNo!: string
      address: Address
      logisticConfig!: LogisticConfig

      constructor() {
            super();
            this.address = new Address();
            this.logisticConfig = new LogisticConfig();
      }
}