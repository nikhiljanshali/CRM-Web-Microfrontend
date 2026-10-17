import { EmployeeDNorm } from "common/businessobjects"
import { BaseEntity } from 'common/entities/common/baseentity'

export class EmployeeCriteria extends BaseEntity {
  employee: EmployeeDNorm
  name!: string
  shape!: string[]
  lab!: string[]
  minWeight!: number
  maxWeight!: number
  color!: string[]
  clarity!: string[]
  cut!: string[]
  polish!: string[]
  symmetry!: string[]
  fluorescence!: string[]
  minDay!: number
  maxDay!: number
  organizations!: string[]
  upLimit!: number
  downLimit!: number
  
  constructor() {
    super();
    this.employee = new EmployeeDNorm();
    this.shape = [];
    this.lab = [];
    this.color = [];
    this.clarity = [];
    this.cut = [];
    this.polish = [];
    this.symmetry = [];
    this.fluorescence = [];
    this.organizations = [];
  }
}