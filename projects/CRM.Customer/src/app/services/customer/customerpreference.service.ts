import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { CustomerPreference } from '../../entities';

@Injectable({
  providedIn: 'root'
})
export class CustomerPreferenceService {
  private controllerUrl = 'CustomerPreference/';

  constructor(private http: HttpClient) { }

  public async getCustomerPreferenceByCustomer(id: string): Promise<CustomerPreference> {
    return await this.http.get(keys.apiUrl + this.controllerUrl + "Get/" + id)
      .toPromise() as CustomerPreference;
  }

  public async updateCustomerPreference(preference: CustomerPreference): Promise<boolean> {
    return await this.http.put(keys.apiUrl + this.controllerUrl + "Update", preference)
      .toPromise() as boolean;
  }
}
