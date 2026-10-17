import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'common/auth/keys';
import { MarketSheetSellerSearchCriteria, MarketSheetSellerSearchResponse } from 'common/businessobjects';

@Injectable({
      providedIn: 'root'
})

export class MarketsheetSellerService {

      constructor(private http: HttpClient) { }

      public async getMarketSheetItemsBySearch(marketSheetSellerCriteria: MarketSheetSellerSearchCriteria, skip: number, take: number): Promise<MarketSheetSellerSearchResponse> {
            return await this.http.post(keys.apiUrl + "Marketsheet/GetPaginated/" + skip + "/" + take, marketSheetSellerCriteria)
                  .toPromise() as MarketSheetSellerSearchResponse;
      }
}