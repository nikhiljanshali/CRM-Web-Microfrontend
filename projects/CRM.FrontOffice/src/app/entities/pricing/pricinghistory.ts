import { BaseEntity } from "shared/enitites";
import { IdentityDNorm, PriceDNorm } from "..";
import { SupplierDNorm } from "../supplier/dnorm/supplierdnorm";

export class PricingHistory extends BaseEntity {
    stoneId!: string;
    shape!: string;
    color!: string;
    clarity!: string;
    cut!: string;
    polish!: string;
    symmetry!: string;
    fluorescence!: string;
    weight!: number;
    supplier: SupplierDNorm;
    price: PriceDNorm;
    identity: IdentityDNorm

    constructor() {
        super();
        this.supplier = new SupplierDNorm();
        this.price = new PriceDNorm();
        this.identity = new IdentityDNorm();
    }
}