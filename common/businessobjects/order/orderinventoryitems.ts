import { PriceDNorm } from "common/entities";
import { InventoryItems } from "common/entities/inventory/inventoryitems";

export class OrderInventoryItems extends InventoryItems {

    sDiscount!: number | null;
    reqDis!: number | null;
    ngDiscount!: number | null;
    isDelivered!: boolean;
    days!: number;
    isLead: boolean = null as any;
    stoneStatus!: string
    reqPrice: PriceDNorm = new PriceDNorm();
    orderPrice: PriceDNorm = new PriceDNorm();

    //Extra Count agreegate
    netAmount?: number | null;

    constructor() {
        super();
    }
}