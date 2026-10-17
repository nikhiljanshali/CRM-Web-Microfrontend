import { BaseEntity } from "../common/baseentity"

export class Department extends BaseEntity {
      name!: string
      origin!: string
      branchName!: string
      phoneExtNo!: string

      constructor() {
            super();
      }

}