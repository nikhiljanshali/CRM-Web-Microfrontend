import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'common/auth/keys';
import { MarketSheetSearchCriteria, MarketSheetSearchResponse } from 'common/businessobjects';

@Injectable({
      providedIn: 'root'
})

export class MarketsheetService {

      constructor(private http: HttpClient) { }

      public async getMarketSheetItemsBySearch(inventoryCriteria: MarketSheetSearchCriteria, skip: number, take: number): Promise<MarketSheetSearchResponse> {
            return await this.http.post(keys.apiUrl + "Marketsheet/GetPaginated/" + skip + "/" + take, inventoryCriteria)
                  .toPromise() as MarketSheetSearchResponse;
      }

      public async marketSheetsBlockClient(inventoryId: string, blockClients: string[]): Promise<boolean> {
            return await this.http.post(keys.apiUrl + "Marketsheet/BlockClients/" + inventoryId, blockClients)
                  .toPromise() as boolean;
      }
}