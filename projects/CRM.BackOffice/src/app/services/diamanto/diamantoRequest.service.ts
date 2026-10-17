import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InventoryItems } from '../../entities';
import { RapPrice } from 'shared/enitites';
import { RapPriceRequest } from 'shared/businessobjects';
import { environment } from 'environments/environment';
import { HoldInventoryItems, InvUpdateItem, TempPendingPricing } from '../../businessobjects';

@Injectable({
  providedIn: 'root'
})
export class DiamantoRequestService {

  constructor(private http: HttpClient) { }

  public async insertPricingRequest(data: InventoryItems[]): Promise<boolean> {
    return await this.http.post(environment.frontOfficeBaseUrl + "PriceRequest/InsertPricingRequestByInventory", data)
      .toPromise() as boolean;
  }

  public async getRapPrice(req: RapPriceRequest): Promise<RapPrice> {
    return await this.http.post(environment.frontOfficeBaseUrl + "RapPrice/Get", req)
      .toPromise() as RapPrice;
  }

  public async updateInventoryHold(data: HoldInventoryItems[]): Promise<number> {
    return await this.http.put(environment.frontOfficeBaseUrl + "Inventory/UpdateHoldInInventoryItems", data)
      .toPromise() as number;
  }

  public async getPendingPricingTemp(stoneIds: string[]): Promise<TempPendingPricing[]> {
    return await this.http.post(environment.frontOfficeBaseUrl + "PendingPricing/GetPendingPricingTemp", stoneIds)
      .toPromise() as TempPendingPricing[];
  }

  public async updateBulkInventoryItems(updateItem: InvUpdateItem): Promise<InventoryItems[]> {
    return await this.http.put(environment.frontOfficeBaseUrl + "Inventory/UpdateBulkInventoryItems", updateItem)
      .toPromise() as InventoryItems[];
  }

}
