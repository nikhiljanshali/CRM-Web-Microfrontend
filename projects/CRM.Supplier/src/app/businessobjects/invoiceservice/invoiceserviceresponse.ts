import { Invoiceservice } from "./invoiceservice";

export class InvoiceserviceResponse {
      invoiceServices: Invoiceservice[];
      totalCount: number;

      constructor() {
            this.invoiceServices = [];
            this.totalCount = 0;
      }
}