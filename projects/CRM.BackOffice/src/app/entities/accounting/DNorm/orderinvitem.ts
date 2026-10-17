import { PriceDNorm } from "../../inventory/priceDNorm";

export class OrderInvItem {
    invId!: string;
    stoneId!: string;
    kapan!: string;
    shape!: string;
    weight!: number;
    color!: string;
    clarity!: string;
    cut!: string;
    polish!: string;
    symmetry!: string;
    fluorescence!: string;
    lab!: string;
    certificateNo!: string;
    price: PriceDNorm;
    sDiscount!: number | null;
    fDiscount!: number | null;
    fAmount!: number | null;

    constructor() {
        this.price = new PriceDNorm();
    }
}