import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'common/auth/keys';
import { PendingPricingResponse } from '../../businessobjects';

@Injectable({
    providedIn: 'root'
})
export class PendingPricingService {
    private url = keys.apiUrl + 'PendingPricing/';

    constructor(private http: HttpClient) { }

    public async getPendingPricingData(skip: number, take: number): Promise<PendingPricingResponse> {
        return await this.http.get(this.url + "GetPaginated/" + skip + "/" + take)
            .toPromise() as PendingPricingResponse;
    }
}

