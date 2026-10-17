import { Invoice } from "./invoice";

export class InvoiceResponse {
      invoices: Invoice[];
      totalCount: number;

      constructor() {
            this.invoices = [];
            this.totalCount = 0;
      }
}