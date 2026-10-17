import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { PricingDiscountApiResponse, PricingRequest, PricingResponse } from 'common/entities';

@Injectable({
  providedIn: 'root'
})

export class PricingService {

  constructor(private http: HttpClient) { }

  public async getBasePrice(data: PricingRequest[]): Promise<PricingDiscountApiResponse[]> {
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json", "Cache-Control": "no-cache" });
    let jsonData = JSON.stringify(data);
    return await this.http.post(environment.apiBasePricingUrl, jsonData, { headers: reqHeader })
      .toPromise() as PricingDiscountApiResponse[];
  }

}