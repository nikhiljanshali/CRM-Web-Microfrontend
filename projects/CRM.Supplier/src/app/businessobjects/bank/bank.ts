import { BaseEntity } from "common/entities/common/baseentity"

export class Bank extends BaseEntity {
  organizationId!: string
  name!: string
  code!: string
  address!: string
  accountName!: string
  acNo!: string
  swiftCode!: string
  intermediate  !: string
  intermediateSwiftCode!: string
  ifscCode!: string
  isActive!: boolean

  constructor() {
    super();
  }
}