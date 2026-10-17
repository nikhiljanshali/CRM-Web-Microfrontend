import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { GradingMaster, InventorySelectAllItems } from '../../businessobjects';
import { InventoryItems } from '../../entities';

@Injectable({
    providedIn: 'root'
})

export class GradingService {

    constructor(private http: HttpClient) { }

    public async GetGrading(stoneId: string): Promise<GradingMaster[]> {
        return await this.http.get(keys.apiUrl + "Grading/Get/" + stoneId)
            .toPromise() as GradingMaster[];
    }

    public async InsertGrading(inventoryItems: InventoryItems[], RapVer: String): Promise<InventoryItems[]> {
        return await this.http.post(keys.apiUrl + "Grading/InsertGrading/" + RapVer, inventoryItems)
            .toPromise() as InventoryItems[];
    }

    public async UpdateGrading(gradingMaster: GradingMaster): Promise<boolean> {
        return await this.http.put(keys.apiUrl + "Grading/UpdateGrading", gradingMaster)
            .toPromise() as boolean;
    }

    public async getInventoryItemsBySearchStoneId(searchStoneId: string): Promise<InventorySelectAllItems[]> {
        return await this.http.get(keys.apiUrl + "Grading/GetSelectAllBySearchStoneId/" + searchStoneId)
            .toPromise() as InventorySelectAllItems[];
    }

    public async getInventoryByStoneId(stoneId: string): Promise<InventoryItems> {
        return await this.http.get(keys.apiUrl + "Grading/GetByStoneId/" + stoneId)
            .toPromise() as InventoryItems;
    }

    public async updateInventoryData(inventory: InventoryItems): Promise<boolean> {
        return await this.http.put(keys.apiUrl + "Grading/Update", inventory)
          .toPromise() as boolean;
      }

}