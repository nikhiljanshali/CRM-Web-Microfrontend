import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { StockTally } from '../../businessobjects';
import { InventoryItems } from '../../entities';

@Injectable({
  providedIn: 'root'
})
export class StocktallyService {

  constructor(private http: HttpClient) { }

  public async GetAllStockTallyAsync(): Promise<StockTally[]> {
    return await this.http.get(keys.apiUrl + "StockTally/Get")
      .toPromise() as StockTally[];
  }

  public async getInventoryItemsByRFids(rfids: string[]): Promise<InventoryItems[]> {
    return await this.http.post(keys.apiUrl + "StockTally/GetInventoriesByRFID/", rfids)
      .toPromise() as InventoryItems[];
  }


}
