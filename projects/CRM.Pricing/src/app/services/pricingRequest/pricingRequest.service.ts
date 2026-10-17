import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TempPricing, PriceReqResponse, PriceRequestApiModel, PricingRequestEntity } from '../../businessobjects';
import { PricingHistory } from 'common/entities';
import { keys } from 'common/auth/keys';

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

  public async insertPricingRequest(data: PricingRequestEntity[]): Promise<boolean> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "InsertPricingRequest", data)
      .toPromise() as boolean;
  }

  public async insertOnePricingRequest(data: PricingRequestEntity): Promise<string> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "InsertSinglePricingRequest", data, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async updatePricingRequest(data: PricingRequestEntity[]): Promise<number> {
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
}
