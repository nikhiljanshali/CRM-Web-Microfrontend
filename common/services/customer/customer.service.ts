import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'common/auth/keys';
import { CommonResponse, SellerDNorm, Customer, CustomerVerificationResponse, CustomerVerificationSearchCriteria } from 'common/businessobjects';

@Injectable({
      providedIn: 'root'
})
export class CustomerService {
      private controllerUrl = 'CustomerVerification/';

      constructor(private http: HttpClient) { }

      public async getCustomerById(customerId: string): Promise<any> {
            return await this.http.get(keys.apiUrl + this.controllerUrl + "Get/" + customerId)
                  .toPromise() as any;
      }

      public async getAllRegisteredCustomers(status: number): Promise<any[]> {
            return await this.http.get(keys.apiUrl + this.controllerUrl + "GetRequests/" + status)
                  .toPromise() as any[];
      }

      public async getCustomers(customerVerificationCriteria: CustomerVerificationSearchCriteria, skip: number, take: number): Promise<CustomerVerificationResponse> {
            return await this.http.post(keys.apiUrl + this.controllerUrl + "GetPaginated/" + skip + "/" + take, customerVerificationCriteria)
                  .toPromise() as CustomerVerificationResponse;
      }

      public async acceptOrRejectCustomer(customer: Customer, isAccept: boolean): Promise<string> {
            return await this.http.post(keys.apiUrl + this.controllerUrl + "AcceptOrRejectCustomer/" + isAccept, customer, {
                  observe: "body",
                  responseType: "text"
            }).toPromise() as string;
      }

      public async getSellerDNorm(): Promise<SellerDNorm[]> {
            return await this.http.get(keys.apiUrl + this.controllerUrl + "GetSupplierDNorm")
                  .toPromise() as SellerDNorm[];
      }

      public async getAllCustomers(): Promise<Customer[]> {
            return await this.http.get(keys.apiUrl + this.controllerUrl + "GetAll/")
                  .toPromise() as Customer[];
      }

      public async getAllCustomersName(name: string): Promise<Customer[]> {
            return await this.http.get(keys.apiUrl + this.controllerUrl + "GetAll/" + name)
                  .toPromise() as Customer[];
      }

      public async getCustomersSupplier(customerVerificationCriteria: CustomerVerificationSearchCriteria, skip: number, take: number): Promise<CustomerVerificationResponse> {
            return await this.http.post(keys.apiUrl + this.controllerUrl + "GetPaginatedSupplier/" + skip + "/" + take, customerVerificationCriteria)
                  .toPromise() as CustomerVerificationResponse;
      }

      public async customerUpdate(customer: Customer): Promise<CommonResponse> {
            return await this.http.put(keys.apiUrl + this.controllerUrl + "UpdateCustomer", customer)
                  .toPromise() as CommonResponse;
      }
}