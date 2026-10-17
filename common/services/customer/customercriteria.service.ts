import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomerCriteria } from 'common/businessobjects';
import { keys } from 'common/auth/keys';
import { InventoryItems } from 'common/entities';

@Injectable({
  providedIn: 'root'
})
export class CustomerCriteriaService {
  private controllerUrl = 'CustomerCriteria/';

  constructor(private http: HttpClient) { }

  public async criteriaInsert(customerData: CustomerCriteria): Promise<string> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "Insert", customerData, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async criteriaUpdate(customerData: CustomerCriteria): Promise<boolean> {
    return await this.http.put(keys.apiUrl + this.controllerUrl + "Update", customerData)
      .toPromise() as boolean;
  }

  public async getInventoryItemsByCustomerCriteria(customerCriteria: CustomerCriteria[]): Promise<InventoryItems[]> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "InventoryByCustomerCriteria", customerCriteria)
      .toPromise() as InventoryItems[];
  }

  public async getCustomerCriteriaByCustomer(id: string): Promise<CustomerCriteria[]> {
    return await this.http.get(keys.apiUrl + this.controllerUrl + "GetByCustomer/" + id)
      .toPromise() as CustomerCriteria[];
  }

  public async deleteCriteria(id: string): Promise<boolean> {
    return await this.http.delete(keys.apiUrl + this.controllerUrl + "Delete/" + id)
      .toPromise() as boolean;
  }
}
