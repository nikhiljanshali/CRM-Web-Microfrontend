import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'common/auth/keys';
import { AccountConfig } from 'common/entities';

@Injectable({
  providedIn: 'root'
})
export class AccountconfigurationService {

  constructor(private http: HttpClient) { }

  public async getAccountConfiguration(): Promise<AccountConfig> {
    return await this.http.get(keys.apiUrl + "AccountConfig/Get")
      .toPromise() as AccountConfig;
  }

  public async insertAccountConfig(accountConfig: AccountConfig): Promise<string> {
    return await this.http.post(keys.apiUrl + "AccountConfig/Insert", accountConfig, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async updateAccountConfig(accountConfig: AccountConfig): Promise<boolean> {
    return await this.http.put(keys.apiUrl + "AccountConfig/Update", accountConfig)
      .toPromise() as boolean;
  }

}
