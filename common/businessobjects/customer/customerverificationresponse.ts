import { Customer } from "..";

export class CustomerVerificationResponse {
      customerSupplier: Customer[];
      totalCount: number;

      constructor() {
            this.customerSupplier = [];
            this.totalCount = 0;
      }
}