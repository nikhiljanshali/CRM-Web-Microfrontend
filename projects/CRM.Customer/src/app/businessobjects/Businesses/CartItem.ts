import { InvItem } from ".."
import { CustomerDNorm, SystemUserDNorm } from "../../entities"


export class CartItem {
    id!: string
    customer!: CustomerDNorm
    seller!: SystemUserDNorm
    invItem!: InvItem
    stoneId!: string
    WebPlatform!: string

    constructor() {
        this.customer = new CustomerDNorm();
        this.seller = new SystemUserDNorm();
    }
}