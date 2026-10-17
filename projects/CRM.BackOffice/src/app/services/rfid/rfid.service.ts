import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { InventoryExcelItems, InventorySearchCriteria, InventorySearchResponse, InventorySelectAllItems } from '../../businessobjects';
import { InventoryItems } from '../../entities';

@Injectable({
  providedIn: 'root'
})
export class RfidService {
  public controllerName: string = "Rfid";
  constructor(private http: HttpClient) { }

  public async getStoneIdsExistOrNotAsync(ids: string[]): Promise<string[]> {
    return await this.http.post(keys.apiUrl + this.controllerName + "/GetStoneIdsExistOrNotAsync/", ids)
      .toPromise() as string[];
  }

  public async getInventoryItemsBySearch(inventoryCriteria: InventorySearchCriteria, skip: number, take: number): Promise<InventorySearchResponse> {
    return await this.http.post(keys.apiUrl + this.controllerName + "/GetPaginated/" + skip + "/" + take, inventoryCriteria)
      .toPromise() as InventorySearchResponse;
  }

  public async updateInventoryData(inventory: InventoryItems): Promise<boolean> {
    return await this.http.put(keys.apiUrl + this.controllerName + "/Update", inventory)
      .toPromise() as boolean;
  }

  public async getInventoriesWithOutRFID(): Promise<InventoryExcelItems[]> {
    return await this.http.get(keys.apiUrl + this.controllerName + "/GetInventoriesWithOutRFID")
      .toPromise() as InventoryExcelItems[];
  }

  public async getInventoryItems(): Promise<InventoryItems[]> {
    return await this.http.get(keys.apiUrl + this.controllerName + "/GetAll/")
      .toPromise() as InventoryItems[];
  }

  public async updateInventoryListData(inventoryItems: InventoryItems[]): Promise<boolean> {
    return await this.http.put(keys.apiUrl + this.controllerName + "/UpdateInventoryList", inventoryItems)
      .toPromise() as boolean;
  }

  public async getInventoryItemsForSelectAll(inventoryCriteria: InventorySearchCriteria): Promise<InventorySelectAllItems[]> {
    return await this.http.post(keys.apiUrl + this.controllerName + "/GetSelectAllByFilter", inventoryCriteria)
      .toPromise() as InventorySelectAllItems[];
  }
}
