import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { CustomerVerificationResponse, CustomerVerificationSearchCriteria} from '../../businessobjects';
import { Customer } from '../../entities';

@Injectable({
      providedIn: 'root'
})
export class CustomerVerificationService {
      private controllerUrl = 'CustomerRegistration/';

      constructor(private http: HttpClient) { }

      public async getCustomers(customerVerificationCriteria: CustomerVerificationSearchCriteria, skip: number, take: number): Promise<CustomerVerificationResponse> {
            return await this.http.post(keys.apiUrl + this.controllerUrl + "GetPaginated/" + skip + "/" + take, customerVerificationCriteria)
                  .toPromise() as CustomerVerificationResponse;
      }

      public async acceptOrRejectCustomer(customer: Customer, isAccept: boolean): Promise<string> {
            return await this.http.post(keys.apiUrl + this.controllerUrl + "AcceptOrReject/" + isAccept, customer, {
                  observe: "body",
                  responseType: "text"
            }).toPromise() as string;
      }
}