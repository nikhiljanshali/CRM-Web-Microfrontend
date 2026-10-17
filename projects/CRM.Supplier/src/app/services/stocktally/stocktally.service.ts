import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'common/auth/keys';
import { StockTally } from '../../businessobjects';

@Injectable({
  providedIn: 'root'
})
export class StocktallyService {

  constructor(private http: HttpClient) { }

  public async GetAllStockTallyAsync(): Promise<StockTally[]> {
    return await this.http.get(keys.apiUrl + "StockTally/Get")
      .toPromise() as StockTally[];
  }

}
