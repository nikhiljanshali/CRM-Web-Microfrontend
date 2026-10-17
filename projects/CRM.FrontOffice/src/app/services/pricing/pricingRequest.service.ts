import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { PriceAnalyticsRequest, PriceReqResponse, PriceRequestApiModel } from '../../businessobjects';
import { InventoryItems, PricingHistory, PricingRequest, TempPricing } from '../../entities';

@Injectable({
  providedIn: 'root'
})
export class PricingRequestService {
  private controllerUrl = 'PriceRequest/';

  constructor(private http: HttpClient) { }
  
  public async insertTempPricing(data: TempPricing[]): Promise<boolean> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "InsertTempPricing", data)
      .toPromise() as boolean;
  }

  public async insertOneTempPricing(data: TempPricing): Promise<string> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "InsertSingleTempPricing", data, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async updateTempPricing(data: TempPricing[]): Promise<number> {
    return await this.http.put(keys.apiUrl + this.controllerUrl + "UpdateTempPricing", data)
      .toPromise() as number;
  }

  public async insertInventoryItem(data: InventoryItems[]): Promise<boolean> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "InsertInventory", data)
      .toPromise() as boolean;
  }

  public async insertPricingRequest(data: PricingRequest[]): Promise<boolean> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "InsertPricingRequest", data)
      .toPromise() as boolean;
  }

  public async insertOnePricingRequest(data: PricingRequest): Promise<string> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "InsertSinglePricingRequest", data, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async updatePricingRequest(data: PricingRequest[]): Promise<number> {
    return await this.http.put(keys.apiUrl + this.controllerUrl + "UpdatePricingRequest", data)
      .toPromise() as number;
  }

  public async getPricingRequest(req: PriceRequestApiModel): Promise<PriceReqResponse> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "Get", req)
      .toPromise() as PriceReqResponse;
  }

  public async getPricingHistory(stoneId: string): Promise<PricingHistory[]> {
    return await this.http.get(keys.apiUrl + this.controllerUrl + "GetPricingHsitory/" + stoneId)
      .toPromise() as PricingHistory[];
  }

  public async getPriceAnalytics(data: PriceAnalyticsRequest): Promise<InventoryItems[]> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "GetInventoryForPriceAnalytics", data)
      .toPromise() as InventoryItems[];
  }

  public async getInventoryByStoneId(stoneId: string): Promise<InventoryItems> {
    return await this.http.get(keys.apiUrl + this.controllerUrl +  "GetByStoneId/" + stoneId)
      .toPromise() as InventoryItems;
  }

  public async getInventoryByStoneIds(stoneIds: string[]): Promise<InventoryItems[]> {
    return await this.http.post(keys.apiUrl + this.controllerUrl +  "GetByStoneIds", stoneIds)
      .toPromise() as InventoryItems[];
  }
}
