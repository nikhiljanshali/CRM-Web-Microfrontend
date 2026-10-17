import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { WatchListResponse, WatchListSearchCriteria } from '../../businessobjects';
import { InventoryItems } from '../../entities';

@Injectable({
  providedIn: 'root'
})
export class WatchListService {
  private controllerUrl = 'WatchList/';

  constructor(private http: HttpClient) { }

  public async getInvItemsByCustomer(id: string): Promise<InventoryItems[]> {
    return await this.http.get(keys.apiUrl + this.controllerUrl + "GetInvItemsByCustomer/" + id)
      .toPromise() as InventoryItems[];
  }

  public async deleteWatchListFromInventoryItem(stoneId: string, customerId: string): Promise<boolean> {
    return await this.http.delete(keys.apiUrl + this.controllerUrl + "DeleteFromInvItem/" + stoneId + "/" + customerId)
      .toPromise() as boolean;
  }

  public async deleteWatchList(ids: string[]): Promise<boolean> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "Delete", ids)
      .toPromise() as boolean;
  }

  public async getAllWatchLists(searchCriteria: WatchListSearchCriteria): Promise<WatchListResponse[]> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "FilterWatchList", searchCriteria)
      .toPromise() as WatchListResponse[];
  }
}
