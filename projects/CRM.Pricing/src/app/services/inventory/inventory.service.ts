import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'common/auth/keys';
import { CommonResponse, ExportToExcelMailData, PriceAnalyticsRequest } from 'common/businessobjects';
import { InventoryItems } from 'common/entities';

@Injectable({
  providedIn: 'root'
})

export class InventoryService {

  constructor(private http: HttpClient) { }

  public async getInventoryByStoneId(stoneId: string): Promise<InventoryItems> {
    return await this.http.get(keys.apiUrl + "Inventory/GetByStoneId/" + stoneId)
      .toPromise() as InventoryItems;
  }

  public async getInventoryByStoneIds(stoneIds: string[]): Promise<InventoryItems[]> {
    return await this.http.post(keys.apiUrl + "Inventory/GetByStoneIds", stoneIds)
      .toPromise() as InventoryItems[];
  }

  public async getPriceAnalytics(data: PriceAnalyticsRequest): Promise<InventoryItems[]> {
    return await this.http.post(keys.apiUrl + "Inventory/GetInventoryForPriceAnalytics", data)
      .toPromise() as InventoryItems[];
  }

  public async ExportToExcelMail(data: ExportToExcelMailData): Promise<CommonResponse> {
    return await this.http.post(keys.apiUrl + "Inventory/ExportToExcelMail", data)
      .toPromise() as CommonResponse;
  }

}