import { TempPricing } from '..';

export class PricingRequestEntity extends TempPricing {
    status!: string
    expiryDate!: Date

    constructor() {
        super();
    }
}