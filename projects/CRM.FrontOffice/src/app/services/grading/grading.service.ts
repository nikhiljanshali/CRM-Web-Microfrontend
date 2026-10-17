import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GradingMaster } from '../../entities';

@Injectable({
  providedIn: 'root'
})

export class GradingService {
  private controllerUrl = 'Lab/';

  constructor(private http: HttpClient) { }

  public async GetGradingFromStoneIds(ids: string[], orgApi: string): Promise<GradingMaster[]> {
    return await this.http.post(orgApi + this.controllerUrl + "GetGradingFromStoneIds", ids)
      .toPromise() as GradingMaster[];
  }

}