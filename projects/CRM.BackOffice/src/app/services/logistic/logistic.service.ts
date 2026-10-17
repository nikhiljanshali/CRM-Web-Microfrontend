import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { LogisticDNorm, LogisticResponse, LogisticSearchCriteria } from '../../businessobjects';
import { Logistic } from '../../entities';

@Injectable({
  providedIn: 'root'
})
export class LogisticService {
  private controllerUrl = 'Logistic/';

  constructor(private http: HttpClient) { }

  async logisticRequest(logisticData: Logistic): Promise<string> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "Insert", logisticData, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  async logisticUpdate(logisticData: Logistic): Promise<boolean> {
    return await this.http.put(keys.apiUrl + this.controllerUrl + "Update", logisticData)
      .toPromise() as boolean;
  }

  async getLogistics(labCriteria: LogisticSearchCriteria, skip: number, take: number): Promise<LogisticResponse> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "GetPaginated/" + skip + "/" + take, labCriteria)
      .toPromise() as LogisticResponse;
  }

  async getAllLogistics(): Promise<Logistic[]> {
    return await this.http.get(keys.apiUrl + this.controllerUrl + "GetAll/")
      .toPromise() as Logistic[];
  }

  async deleteLogistic(id: string): Promise<boolean> {
    return await this.http.delete(keys.apiUrl + this.controllerUrl + "Delete/" + id)
      .toPromise() as boolean;
  }

  async getGetLogisticDNormForMemo(): Promise<LogisticDNorm[]> {
    return await this.http.get(keys.apiUrl + this.controllerUrl + "GetLogisticDNormForMemo/")
      .toPromise() as LogisticDNorm[];
  }

}
