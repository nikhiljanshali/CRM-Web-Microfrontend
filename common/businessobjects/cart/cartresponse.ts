import { SellerDNorm } from "../common/sellerdnorm";
import { Customer } from "../customer/customer";

export class CartResponse {
    id!: string;
    customer!: Customer;
    seller!: SellerDNorm;
    totalAmount: number = 0;
    totalCarat: number = 0;
    totalPcs: number = 0;
    createdDate!: Date;
    isEcom: boolean = false;

    constructor() {
        this.customer = new Customer();
        this.seller = new SellerDNorm();
    }
    
}