import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { IncMeasureGradeLookup } from 'shared/businessobjects';
import { InventorySearchCriteria, InventorySearchResponse, InventorySelectAllItems } from '../../businessobjects';
import { InventoryItems } from '../../entities';

@Injectable({
  providedIn: 'root'
})

export class InventoryService {

  constructor(private http: HttpClient) { }

  public async getStockById(id: string): Promise<InventoryItems> {
    return await this.http.get(keys.apiUrl + "Inventory/Get/" + id)
      .toPromise() as InventoryItems;
  }

  public async getStockByIdentId(identId: string): Promise<InventoryItems[]> {
    return await this.http.get(keys.apiUrl + "Inventory/GetByIdent/" + identId)
      .toPromise() as InventoryItems[];
  }

  public async getStockForStoneMedia(inventorysearchcriteria: InventorySearchCriteria, skip: number, take: number): Promise<InventorySearchResponse> {
    return await this.http.post(keys.apiUrl + "Inventory/GetPaginatedForStoneMedia/" + skip + "/" + take, inventorysearchcriteria)
      .toPromise() as InventorySearchResponse;
  }

  public async getAllStock(): Promise<InventoryItems[]> {
    return await this.http.get(keys.apiUrl + "Inventory/GetAll/")
      .toPromise() as InventoryItems[];
  }

  public async updateStock(inventoryItems: InventoryItems[]): Promise<InventoryItems[]> {
    return await this.http.put(keys.apiUrl + "Inventory/UpdateStock", inventoryItems)
      .toPromise() as InventoryItems[];
  }
  
  public async getOrgKapanList(orgId: string): Promise<string[]> {
    return await this.http.get(keys.apiUrl + "Inventory/GetKapan/" + orgId)
      .toPromise() as string[];
  }

  public async updateInventoryListData(inventoryItems: InventoryItems[]): Promise<boolean> {
    return await this.http.put(keys.apiUrl + "Inventory/UpdateInventoryList", inventoryItems)
      .toPromise() as boolean;
  }

  public async getInventoryByStoneIds(stoneIds: string[]): Promise<InventoryItems[]> {
    return await this.http.post(keys.apiUrl + "Inventory/GetByStoneIds", stoneIds)
      .toPromise() as InventoryItems[];
  }  

  public async updateInventoryHoldData(inventories: InventoryItems[]): Promise<InventoryItems[]> {
    return await this.http.put(keys.apiUrl + "Inventory/UpdateInventoryHold", inventories)
      .toPromise() as InventoryItems[];
  }

  public async getInventoryItemsBySearch(inventoryCriteria: InventorySearchCriteria, skip: number, take: number): Promise<InventorySearchResponse> {
    return await this.http.post(keys.apiUrl + "Inventory/GetPaginated/" + skip + "/" + take, inventoryCriteria)
      .toPromise() as InventorySearchResponse;
  }

  public async getInventoryItemsForSelectAll(inventoryCriteria: InventorySearchCriteria): Promise<InventorySelectAllItems[]> {
    return await this.http.post(keys.apiUrl + "Inventory/GetSelectAllByFilter", inventoryCriteria)
      .toPromise() as InventorySelectAllItems[];
  }

  public async copyToClipboardStoneId(inventoryCriteria: InventorySearchCriteria): Promise<string> {
    return await this.http.post(keys.apiUrl + "Inventory/CopyToClipboardStoneIds", inventoryCriteria, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async getInventoryItemsBySearchForExcel(inventoryCriteria: InventorySearchCriteria): Promise<InventoryItems[]> {
    return await this.http.post(keys.apiUrl + "Inventory/GetFilter", inventoryCriteria)
      .toPromise() as InventoryItems[];
  }

  public async updateInventoryLabToNC(data: InventoryItems[]): Promise<any> {
    return await this.http.put(keys.apiUrl + "Inventory/UpdateInventoryLabToNC", data)
      .toPromise() as any;
  }

  public async deleteInventoryData(id: string): Promise<number> {
    return await this.http.delete(keys.apiUrl + "Inventory/Delete/" + id)
      .toPromise() as number;
  }

  public async updateInventoryGrading(data: IncMeasureGradeLookup[]): Promise<string[]> {
    return await this.http.put(keys.apiUrl + "Inventory/UpdateInventoryGrading", data)
      .toPromise() as string[];
  }

  public async updateInventoryData(inventory: InventoryItems): Promise<boolean> {
    return await this.http.put(keys.apiUrl + "Inventory/Update", inventory)
      .toPromise() as boolean;
  }

  public async getOrgIGradeList(orgId: string): Promise<string[]> {
    return await this.http.get(keys.apiUrl + "Inventory/GetIGrade/" + orgId)
      .toPromise() as string[];
  }

  public async getOrgMGradeList(orgId: string): Promise<string[]> {
    return await this.http.get(keys.apiUrl + "Inventory/GetMGrade/" + orgId)
      .toPromise() as string[];
  }

}