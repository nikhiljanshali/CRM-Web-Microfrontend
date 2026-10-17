import { BaseEntity } from "common/entities/common/baseentity"

export class Invoiceservice extends BaseEntity {
  name!: string  
  category!: string
  rate!: number
  tax!: number
  unit!: number  
  isActive!: boolean    

  constructor() { 
    super();   
  }
}