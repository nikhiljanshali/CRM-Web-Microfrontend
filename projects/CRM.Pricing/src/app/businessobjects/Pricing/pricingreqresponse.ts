import { InventorySearchResponse } from 'common/entities';
import { PricingRequestEntity } from '..';

export class PriceReqResponse {
    priceRequest: PricingRequestEntity[];
    summaryData: InventorySearchResponse;

    constructor() {
        this.priceRequest = [];
        this.summaryData = new InventorySearchResponse();
    }
}