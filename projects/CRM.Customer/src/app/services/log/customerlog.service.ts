import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'common/auth/keys';
import { CustomerLog } from '../../entities';

@Injectable({
  providedIn: 'root'
})
export class CustomerLogService {
  public apiUrl = keys.apiUrl + "CustomerLog/";

  constructor(private http: HttpClient) { }

  async addCustomerLog(log: CustomerLog): Promise<string> {
    return await this.http.post(this.apiUrl + "AddLog", log, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }
}