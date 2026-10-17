import { BaseEntity } from 'common/entities/common/baseentity'

export class LabServiceType extends BaseEntity {
  labName!: string 
  service!: string
  serviceCode!: string 

  constructor() {
    super();   
  }
}