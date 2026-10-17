import { BaseEntity } from "../common/baseentity";

export class PricingConfig extends BaseEntity {
    expirationDay!: number | null;
    baseDiscountDifference!: number | null;

    constructor() {
        super();
    }
}