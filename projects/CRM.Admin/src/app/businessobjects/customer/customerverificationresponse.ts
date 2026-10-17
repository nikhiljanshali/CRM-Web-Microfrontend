import { RegisterCustomer } from "common/entities";

export class CustomerVerificationResponse {
      customers: RegisterCustomer[];
      totalCount: number;

      constructor() {
            this.customers = [];
            this.totalCount = 0;
      }
}