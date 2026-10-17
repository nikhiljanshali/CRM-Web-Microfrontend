import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'common/auth/keys';
import { PricingConfig } from 'common/entities';

@Injectable({
  providedIn: 'root'
})
export class PricingConfigService {
  private url = keys.apiUrl + 'PricingConfig/';

  constructor(private http: HttpClient) { }

  public async getPricingConfigData(): Promise<PricingConfig> {
    return await this.http.get(this.url + "Get/")
      .toPromise() as PricingConfig;
  }

  public async updatePricingConfig(data: PricingConfig): Promise<boolean> {
    return await this.http.put(this.url + "UpdatePricingConfig/", data)
      .toPromise() as boolean;
  }
}

