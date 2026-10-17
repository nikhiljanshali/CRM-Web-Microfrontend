import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { BusinessConfig } from '../../entities';

@Injectable({
  providedIn: 'root'
})
export class BusinessconfigurationService {

  constructor(private http: HttpClient) { }

  public async getBusinessConfiguration(): Promise<BusinessConfig> {
    return await this.http.get(keys.apiUrl + "BusinessConfig/Get")
      .toPromise() as BusinessConfig;
  }

  public async insertBusinessConfig(businessConfig: BusinessConfig): Promise<string> {
    return await this.http.post(keys.apiUrl + "BusinessConfig/Insert", businessConfig, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async updateBusinessConfig(businessConfig: BusinessConfig): Promise<boolean> {
    return await this.http.put(keys.apiUrl + "BusinessConfig/Update", businessConfig)
      .toPromise() as boolean;
  }

}
