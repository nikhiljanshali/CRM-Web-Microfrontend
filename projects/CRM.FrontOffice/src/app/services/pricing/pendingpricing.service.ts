import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { PendingPricingResponse } from '../../businessobjects';
import { TempPricing } from '../../entities';

@Injectable({
    providedIn: 'root'
})
export class PendingPricingService {
    private url = keys.apiUrl + 'PendingPricing/';

    constructor(private http: HttpClient) { }

    public async insertPendingPricing(data: TempPricing[]): Promise<boolean> {
        return await this.http.post(this.url + "InsertPendingPricing", data)
            .toPromise() as boolean;
    }

    public async getPendingPricingData(skip: number, take: number): Promise<PendingPricingResponse> {
        return await this.http.get(this.url + "GetPaginated/" + skip + "/" + take)
            .toPromise() as PendingPricingResponse;
    }
}

