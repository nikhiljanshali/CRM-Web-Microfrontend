import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RapPrice, RapPriceRequest } from 'common/entities';
import { keys } from 'common/auth/keys';

@Injectable({
    providedIn: 'root'
})

export class RapPriceService {

    constructor(private http: HttpClient) { }

    public async getAllData(): Promise<RapPrice[]> {
        return await this.http.get(keys.apiUrl + "RapPrice/GetAll")
            .toPromise() as RapPrice[];
    }

    public async get(req: RapPriceRequest): Promise<RapPrice> {
        return await this.http.post(keys.apiUrl + "RapPrice/Get", req)
            .toPromise() as RapPrice;
    }

    public async saveRapPriceFile(data: RapPrice[]): Promise<boolean> {
        return await this.http.post(keys.apiUrl + "RapPrice/UploadRapPriceFile", data)
            .toPromise() as boolean;
    }
}