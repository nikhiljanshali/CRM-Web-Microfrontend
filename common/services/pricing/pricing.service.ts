import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { PricingDiscountApiResponse, PricingMarketSheetRequest, PricingMarketSheetResponse, PricingRequest, PricingResponse } from 'common/entities';

@Injectable({
  providedIn: 'root'
})

export class PricingService {

  constructor(private http: HttpClient) { }

  async getPrice(data: PricingRequest): Promise<PricingResponse> {
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json", "Cache-Control": "no-cache" });
    let jsonData = JSON.stringify(data);
    return await this.http.post(environment.apiPricingUrl, jsonData, { headers: reqHeader })
      .toPromise() as PricingResponse;
  }

  async getBasePrice(data: PricingRequest[]): Promise<PricingDiscountApiResponse[]> {
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json", "Cache-Control": "no-cache" });
    let jsonData = JSON.stringify(data);
    return await this.http.post(environment.apiBasePricingUrl, jsonData, { headers: reqHeader })
      .toPromise() as PricingDiscountApiResponse[];
  }

  async getMarketSheetPrice(data: PricingMarketSheetRequest[]): Promise<PricingMarketSheetResponse[]> {
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json", "Cache-Control": "no-cache" });
    let jsonData = JSON.stringify(data);
    return await this.http.post(environment.apiMarketSheetPricingUrl, jsonData, { headers: reqHeader })
      .toPromise() as PricingMarketSheetResponse[];
  }
}