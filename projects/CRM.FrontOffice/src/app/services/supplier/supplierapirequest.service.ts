import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonDataResponse } from 'shared/businessobjects';
import { RapPrice } from 'shared/enitites';
import { UpdateHoldReleaseInventory } from '../../businessobjects';
import { PricingRequest, TempPricing } from '../../entities';

@Injectable({
  providedIn: 'root'
})
export class SupplierApiRequestService {

  constructor(private http: HttpClient) { }

  public async updatePricingRequest(data: PricingRequest[], orgApi: string): Promise<CommonDataResponse> {
    return await this.http.put(orgApi + "PriceRequest/UpdateInventoryPricing", data)
      .toPromise() as CommonDataResponse;
  }

  public async updateTempPricing(data: TempPricing[], orgApi: string): Promise<CommonDataResponse> {
    return await this.http.put(orgApi + "PriceRequest/UpdateInventoryPricingFromTempPricing", data)
      .toPromise() as CommonDataResponse;
  }

  public async updateInventoryOnHoldRelease(data: UpdateHoldReleaseInventory[], orgApi: string): Promise<number> {
    return await this.http.put(orgApi + "Inventory/UpdateInventoryForHoldRelease", data)
      .toPromise() as number;
  }

  public async applyRapPrice(data: RapPrice[], orgApi: string): Promise<boolean> {
    return await this.http.post(orgApi + "RapPrice/ApplyRap", data)
        .toPromise() as boolean;
}
}
