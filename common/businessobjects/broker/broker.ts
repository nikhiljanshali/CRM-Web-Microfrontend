import { BaseEntity } from "common/entities/common/baseentity"

export class Broker extends BaseEntity {
  name!: string  
  code!: string
  brokrage!: number
  through!: number
  mobileNo!: string
  email!: string
  address!: string 
  refCompanyName!: string  
  refPersonName!: string  
  refemail!: string
  refmobileNo!: string  
  refAddress!: string      
  isActive!: boolean    

  constructor() { 
    super();   
  }
}