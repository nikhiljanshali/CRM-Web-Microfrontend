import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { WatchListResponse, WatchListSearchCriteria } from '../../businessobjects';
import { InventoryItems, WatchList } from '../../entities';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  public apiUrl = keys.apiUrl + "WatchList/";

  constructor(private http: HttpClient) { }

  public async getAllWatchLists(searchCriteria: WatchListSearchCriteria): Promise<WatchListResponse[]> {
    return await this.http.post(this.apiUrl + "FilterWatchList", searchCriteria)
      .toPromise() as WatchListResponse[];
  }

  public async insertWatchList(watchlist: WatchList): Promise<string> {
    return await this.http.post(this.apiUrl + "Insert", watchlist, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async insertWatchListsFromInvIds(ids: string[], customerId: string): Promise<string> {
    return await this.http.post(this.apiUrl + "InsertFromInvItems/" + customerId, ids, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async removeFromWatchList(ids: string[]): Promise<boolean> {
    return await this.http.post(this.apiUrl + "Delete", ids)
      .toPromise() as boolean;
  }

  public async getInvItemsByCustomer(id: string): Promise<InventoryItems[]> {
    return await this.http.get(this.apiUrl + "GetInvItemsByCustomer/" + id)
      .toPromise() as InventoryItems[];
  }

  public async deleteWatchListFromInventoryItem(stoneId: string, customerId: string): Promise<boolean> {
    return await this.http.delete(this.apiUrl + "DeleteFromInvItem/" + stoneId + "/" + customerId)
      .toPromise() as boolean;
  }
}