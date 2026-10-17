import { Customer, SellerDNorm, Summary } from "common/businessobjects";
import { BaseEntity } from "../common/baseentity";
import { InventoryItems } from "../inventory/inventoryitems";

export class Cart extends BaseEntity {

    customer: Customer;
    seller: SellerDNorm;
    cartInventoryItems: InventoryItems[];
    summary: Summary;
    isEcom:boolean = false;

    constructor() {
        super();
        this.customer = new Customer();
        this.seller = new SellerDNorm();
        this.cartInventoryItems = [];
        this.summary = new Summary();
    }
}