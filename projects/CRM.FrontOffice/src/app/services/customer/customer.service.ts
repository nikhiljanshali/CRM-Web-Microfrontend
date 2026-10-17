import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { CustomerSearchCriteria, CustomerSearchResponse } from '../../businessobjects';
import { Customer, CustomerDNorm } from '../../entities';

@Injectable({
  providedIn: 'root'
})

export class CustomerService {
  private api = keys.apiUrl + 'Customer/';

  constructor(private http: HttpClient) { }

  public async getCustomerById(customerId: string): Promise<any> {
    return await this.http.get(this.api + "Get/" + customerId)
      .toPromise() as any;
  }

  public async getCustomers(customerCriteria: CustomerSearchCriteria, skip: number, take: number): Promise<CustomerSearchResponse> {
    return await this.http.post(this.api + "GetPaginated/" + skip + "/" + take, customerCriteria)
      .toPromise() as CustomerSearchResponse;
  }

  public async getAllCustomers(): Promise<Customer[]> {
    return await this.http.get(this.api + "GetAll/")
      .toPromise() as Customer[];
  }

  public async getAllCustomersName(name: string): Promise<Customer[]> {
    return await this.http.get(this.api + "GetAll/" + name)
      .toPromise() as Customer[];
  }

  public async updateCustomer(customer: Customer): Promise<boolean> {
    return await this.http.put(this.api + "Update", customer)
      .toPromise() as boolean;
  }

  public async insertCustomer(customer: Customer): Promise<string> {
    return await this.http.post(this.api + "Insert", customer, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async deleteCustomer(id: string): Promise<number> {
    return await this.http.delete(this.api + "Delete/" + id)
      .toPromise() as number;
  }

  public async getAllCustomerDNormsByName(name: string): Promise<CustomerDNorm[]> {
    return await this.http.get(this.api + "GetCustomerDNorms/" + name)
      .toPromise() as CustomerDNorm[];
  }

}