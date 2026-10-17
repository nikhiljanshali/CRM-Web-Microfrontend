import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { InvDetailData, InvItem } from '../../businessobjects';
import { InvDNorm } from '../../entities';

@Injectable({
  providedIn: 'root'
})

export class InventoryService {
  api: string = keys.apiUrl + "Inventory/";

  constructor(private http: HttpClient) { }
  public async getInvDNormByStoneIdAsync(stoneId: string): Promise<InvDNorm> {
    return await this.http.get(this.api + "GetInventoryDNormsByStones/" + stoneId + false)
      .toPromise() as InvDNorm;
  }

  public async getInvDetailByStoneIdsAsync(stoneIds: string[]): Promise<InvDetailData[]> {
    return await this.http.post(this.api + "GetInvDetailsByStoneIds", stoneIds)
      .toPromise() as InvDetailData[];
  }

  public async getInvDetailByStoneIdAsync(stoneId: string): Promise<InvDetailData> {
    return await this.http.get(this.api + "GetInvDetailsByStoneId/" + stoneId)
      .toPromise() as InvDetailData;
  }

  public async getInvItemsAsync(invIds:string[]): Promise<InvItem[]>{
    return await this.http.post(this.api + "GetInvItems/", invIds)
    .toPromise() as InvItem[];
  }
}