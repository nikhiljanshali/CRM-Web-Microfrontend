import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { CustomerInvSearchCriteria, CustomerInvSearchResponse, InvDetailData } from '../../businessobjects';

@Injectable({
  providedIn: 'root'
})

export class CustomerInvSearchService {
  api: string = keys.apiUrl + "Customer/InvSearch/";

  constructor(private http: HttpClient) { }

  public async getInventoryItemsBySearch(inventoryCriteria: CustomerInvSearchCriteria, skip: number, take: number): Promise<CustomerInvSearchResponse> {
    return await this.http.post(this.api + "PaginatedByCriteria/" + skip + "/" + take, inventoryCriteria)
      .toPromise() as CustomerInvSearchResponse;
  }

  public async getAllInventoryItemsBySearch(inventoryCriteria: CustomerInvSearchCriteria): Promise<InvDetailData[]> {
    return await this.http.post(this.api + "ByCriteria", inventoryCriteria)
      .toPromise() as InvDetailData[];
  }

  public async getInvDetailByStoneIdsAsync(stoneIds: string[]): Promise<InvDetailData[]> {
    return await this.http.post(this.api + "ByStoneIds", stoneIds)
      .toPromise() as InvDetailData[];
  }

  public async getInvDetailByStoneIdAsync(stoneId: string): Promise<InvDetailData> {
    return await this.http.get(this.api + "ByStoneId/" + stoneId)
      .toPromise() as InvDetailData;
  }

}