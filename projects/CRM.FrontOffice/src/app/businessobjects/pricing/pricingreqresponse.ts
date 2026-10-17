import { InventorySearchResponse } from "..";
import { PricingRequest } from "../../entities";

export class PriceReqResponse {
    priceRequest: PricingRequest[];
    summaryData: InventorySearchResponse;

    constructor() {
        this.priceRequest = [];
        this.summaryData = new InventorySearchResponse();
    }
}