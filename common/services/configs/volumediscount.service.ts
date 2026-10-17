import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'common/auth/keys';
import { VolumeDiscount } from 'common/businessobjects';

@Injectable({
    providedIn: 'root'
})

export class VolumeDiscountService {

    constructor(private http: HttpClient) { }

    public async getAllVolumeDiscounts(): Promise<VolumeDiscount[]> {
        return await this.http.get(keys.apiUrl + "VolumeDiscount/GetAll")
            .toPromise() as VolumeDiscount[];
    }

    public async getVolumeDiscountValue(totalAmt: number): Promise<number> {
        return await this.http.get(keys.apiUrl + "VolumeDiscount/GetDiscountValue/" + totalAmt)
            .toPromise() as number;
    }

    public async insertVolumeDiscount(volumeDiscount: VolumeDiscount): Promise<string> {
        return await this.http.post(keys.apiUrl + "VolumeDiscount/Insert", volumeDiscount, {
            observe: "body",
            responseType: "text"
        }).toPromise() as string;
    }

    public async updateVolumeDiscount(volumeDiscount: VolumeDiscount): Promise<string> {
        return await this.http.put(keys.apiUrl + "VolumeDiscount/Update", volumeDiscount, {
            observe: "body",
            responseType: "text"
        }).toPromise() as string;
    }

    public async deleteVolumeDiscount(Id: string): Promise<boolean> {
        return await this.http.delete(keys.apiUrl + "VolumeDiscount/Delete/" + Id)
            .toPromise() as boolean;
    }

}