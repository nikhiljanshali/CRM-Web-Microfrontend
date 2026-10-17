import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { keys } from "shared/auth";
import { Customer, CustomerDNorm } from "../../entities";

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    public apiUrl = keys.apiUrl + "Customer/";

    constructor(private http: HttpClient) { }

    public async getCustomerDNormsAsync(fullName: string): Promise<CustomerDNorm[]> {
        return await this.http.get(this.apiUrl + "GetCustomerDNorms/" + fullName)
            .toPromise() as CustomerDNorm[];
    }

    public async getCustomerDNormByIdAsync(customerId: string): Promise<CustomerDNorm> {
        return await this.http.get(this.apiUrl + "GetCustomerDNormById/" + customerId)
            .toPromise() as CustomerDNorm;
    }

    public async getCustomerDNormDataAsync(fullName: string): Promise<CustomerDNorm> {
        return await this.http.get(this.apiUrl + "GetCustomerDNorm/" + fullName)
            .toPromise() as CustomerDNorm;
    }

    public async getCustomerById(customerId: string): Promise<Customer> {
        return await this.http.get(this.apiUrl + "Get/" + customerId)
            .toPromise() as Customer;
    }
}