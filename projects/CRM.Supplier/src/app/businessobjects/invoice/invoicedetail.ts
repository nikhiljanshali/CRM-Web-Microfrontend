import { PriceDNorm } from "common/entities"
import { InventoryItems } from "common/entities/inventory/inventoryitems";

export class InvoiceDetail {

  leadId!: string;
  leadNo!: number;
  orderId!: string;
  orderNo!: number;
  invoicePrice: PriceDNorm;
  sDiscount!: number | null;
  ngDiscount!: number | null;
  isDelivered!: boolean;
  taxAmount!: number | null;
  taxPer!: number | null;
  inventoryItem: InventoryItems;

  constructor() {    
    this.invoicePrice = new PriceDNorm();
    this.inventoryItem = new InventoryItems();
  }
}