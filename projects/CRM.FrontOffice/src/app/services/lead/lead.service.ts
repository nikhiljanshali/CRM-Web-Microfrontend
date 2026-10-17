import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { LeadResponse } from '../../businessobjects';
import { InvDNorm, InvItem, Lead, SystemUserDNorm } from '../../entities';

@Injectable({
    providedIn: 'root'
})
export class LeadService {
    private controllerUrl = 'Lead/';

    constructor(private http: HttpClient) { }

    public async getAllLeads(sellerId: string = ' '): Promise<LeadResponse[]> {
        return await this.http.get(keys.apiUrl + this.controllerUrl + "GetAll/" + sellerId)
            .toPromise() as LeadResponse[];
    }

    public async getLeadById(id: string): Promise<Lead> {
        return await this.http.get(keys.apiUrl + this.controllerUrl + "Get/" + id)
            .toPromise() as Lead;
    }

    public async getStonesByLeadId(leadId: string, isRejected: boolean): Promise<InvItem[]> {
        return await this.http.get(keys.apiUrl + this.controllerUrl + "GetStonesByLeadId/" + leadId + "/" + isRejected)
            .toPromise() as InvItem[];
    }


    public async getLeads(status: string): Promise<Lead[]> {
        return await this.http.get(keys.apiUrl + this.controllerUrl + "GetByStatus/" + status)
            .toPromise() as Lead[];
    }

    public async leadInsert(leadData: Lead): Promise<string> {
        return await this.http.post(keys.apiUrl + this.controllerUrl + "Insert", leadData, {
            observe: "body",
            responseType: "text"
        }).toPromise() as string;
    }

    public async updateStatus(leadId: string, status: string): Promise<boolean> {
        return await this.http.get(keys.apiUrl + this.controllerUrl + "UpdateStatus/" + leadId + "/" + status)
            .toPromise() as boolean;
    }

    public async updateLeadInventory(leadId: string, leadInvItems: InvDNorm[]): Promise<boolean> {
        return await this.http.post(keys.apiUrl + this.controllerUrl + "UpdateLeadInventory/" + leadId, leadInvItems)
            .toPromise() as boolean;
    }

    public async leadUpdate(leadData: Lead): Promise<boolean> {
        return await this.http.put(keys.apiUrl + this.controllerUrl + "Update", leadData)
            .toPromise() as boolean;
    }

    public async getSellerDNormById(id: string): Promise<SystemUserDNorm> {
        return await this.http.get(keys.apiUrl + this.controllerUrl + "GetSellerDNormById/" + id)
            .toPromise() as SystemUserDNorm;
    }

    public async getLastPurchaseAmountForVow(customerId: string): Promise<number> {
        return await this.http.get(keys.apiUrl + this.controllerUrl + "GetLastPurchaseAmountForVow/" + customerId)
            .toPromise() as number;
    }

}