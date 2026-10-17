import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { GradingMaster } from '../../businessobjects';
import { InventoryItems } from 'common/entities';

@Injectable({
    providedIn: 'root'
})

export class GradingService {

    constructor(private http: HttpClient) { }

    async GetGrading(stoneId: string): Promise<GradingMaster[]> {
        return await this.http.get(environment.apiSupplierUrl + "Grading/Get/" + stoneId)
            .toPromise() as GradingMaster[];
    }

    async InsertGrading(inventoryItems: InventoryItems[], RapVer: String): Promise<InventoryItems[]> {
        return await this.http.post(environment.apiSupplierUrl + "Grading/InsertGrading/" + RapVer, inventoryItems)
            .toPromise() as InventoryItems[];
    }

    async UpdateGrading(gradingMaster: GradingMaster): Promise<boolean> {
        return await this.http.put(environment.apiSupplierUrl + "Grading/UpdateGrading", gradingMaster)
            .toPromise() as boolean;
    }

}