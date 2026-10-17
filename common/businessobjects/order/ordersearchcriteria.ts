import { InventorySearchCriteria } from "common/entities/inventory/inventorysearchcriteria";

export class Ordersearchcriteria extends InventorySearchCriteria {
    orderNo!: string;
    leadNo!: string;
    invoiceNo!: string;
    customer!: string[];
    broker!: string[];
    from?: Date | null;
    to?: Date | null;

    constructor() {
        super();
    }
}