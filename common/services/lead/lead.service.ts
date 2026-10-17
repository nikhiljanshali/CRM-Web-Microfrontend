import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'common/auth/keys';
import { OrderInventoryItems, SellerDNorm } from 'common/businessobjects';
import { Lead, LeadResponse } from 'common/entities';

@Injectable({
    providedIn: 'root'
})
export class LeadService {
    private controllerUrl = 'Lead/';

    constructor(private http: HttpClient) { }

    public async getAllLeads(sellerId: string = ''): Promise<LeadResponse[]> {
        return await this.http.get(keys.apiUrl + this.controllerUrl + "GetAll/" + sellerId)
            .toPromise() as LeadResponse[];
    }

    public async getLeadById(id: string): Promise<Lead> {
        return await this.http.get(keys.apiUrl + this.controllerUrl + "Get/" + id)
            .toPromise() as Lead;
    }

    public async getStonesByLeadId(leadId: string): Promise<OrderInventoryItems[]> {
        return await this.http.get(keys.apiUrl + this.controllerUrl + "GetStonesByLeadId/" + leadId)
            .toPromise() as OrderInventoryItems[];
    }


    public async getLeads(status: string): Promise<Lead[]> {
        return await this.http.get(keys.apiUrl + this.controllerUrl + "GetByStatus/" + status)
            .toPromise() as Lead[];
    }

    public async leadInsert(leadData: Lead): Promise<LeadResponse> {
        return await this.http.post(keys.apiUrl + this.controllerUrl + "Insert", leadData).toPromise() as LeadResponse;
    }

    public async updateStatus(leadId: string, status: string): Promise<boolean> {
        return await this.http.get(keys.apiUrl + this.controllerUrl + "UpdateStatus/" + leadId + "/" + status)
            .toPromise() as boolean;
    }

    public async updateLeadInventory(leadId: string, leadInvItems: OrderInventoryItems[]): Promise<boolean> {
        return await this.http.post(keys.apiUrl + this.controllerUrl + "UpdateLeadInventory/" + leadId, leadInvItems)
            .toPromise() as boolean;
    }

    public async leadUpdate(leadData: Lead): Promise<boolean> {
        return await this.http.put(keys.apiUrl + this.controllerUrl + "Update", leadData)
            .toPromise() as boolean;
    }

    public async getSellerDNormById(id: string): Promise<SellerDNorm> {
        return await this.http.get(keys.apiUrl + this.controllerUrl + "GetSellerDNormById/" + id)
            .toPromise() as SellerDNorm;
    }

}