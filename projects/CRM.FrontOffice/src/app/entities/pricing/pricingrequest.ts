import { TempPricing } from '..';

export class PricingRequest extends TempPricing {
    status!: string
    expiryDate!: Date

    constructor() {
        super();
    }
}