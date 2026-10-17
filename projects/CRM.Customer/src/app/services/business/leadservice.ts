import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { keys } from "shared/auth";
import { CartSearchCriteria } from "../../businessobjects";
import { Lead } from "../../entities";

@Injectable({
    providedIn: "root"
})
export class LeadService{
    public apiUrl = keys.apiUrl + "Lead/";

    constructor(private http: HttpClient) { }

    public async getLastPurchaseAmountForVow(customerId: string): Promise<number>{
        return await this.http.get(this.apiUrl+"GetLastPurchaseAmountForVow/"+customerId)
        .toPromise() as number;
    }

    public async getCountForCustomerAsync(customerId: string): Promise<number>{
        return await this.http.get(this.apiUrl + "GetCountForCustomer/"+customerId)
        .toPromise() as number;
    }

    public async getLeadsForCustomerAsync(criteria: CartSearchCriteria, skip: number, take: number): Promise<Lead[]>{
        return await this.http.post(this.apiUrl + "GetForCustomer/"+skip+"/"+take, criteria)
        .toPromise() as Lead[];
    }

    public async insertLeadAsync(lead: Lead): Promise<string>{
        return await this.http.post(this.apiUrl + "Insert", lead, {
            observe: "body",
            responseType: "text"
          }).toPromise() as string;
    }    
}