import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'common/auth/keys';
import { CommonResponse, ExportToExcelMailData, IncMeasureGradeLookup } from 'common/businessobjects';
import { InclusionExcelItems, InventoryExcelItems, InventoryItems, InventorySearchCriteria, InventorySearchResponse, InventorySelectAllItems } from 'common/entities';

@Injectable({
  providedIn: 'root'
})

export class InventoryService {

  constructor(private http: HttpClient) { }

  public async getStoneIdsExistOrNotAsync(ids: string[]): Promise<string[]> {
    return await this.http.post(keys.apiUrl + "Inventory/GetStoneIdsExistOrNotAsync/", ids).toPromise() as string[];
  }

  public async getInventoryByStoneId(stoneId: string): Promise<InventoryItems> {
    return await this.http.get(keys.apiUrl + "Inventory/GetByStoneId/" + stoneId)
      .toPromise() as InventoryItems;
  }

  public async getInventoryByStoneIds(stoneIds: string[]): Promise<InventoryItems[]> {
    return await this.http.post(keys.apiUrl + "Inventory/GetByStoneIds", stoneIds)
      .toPromise() as InventoryItems[];
  }

  public async saveInventoryFile(inventoryExcelItems: InventoryExcelItems[]): Promise<string[]> {
    return await this.http.post(keys.apiUrl + "Inventory/UploadInventoryFile/", inventoryExcelItems)
      .toPromise() as string[];
  }

  public async saveInclusionFile(inclusionExcelItems: InclusionExcelItems[]): Promise<InventoryItems[]> {
    return await this.http.post(keys.apiUrl + "Inventory/UploadInclusionFile/", inclusionExcelItems)
      .toPromise() as InventoryItems[];
  }

  public async getInventoryItems(): Promise<InventoryItems[]> {
    return await this.http.get(keys.apiUrl + "Inventory/GetAll/")
      .toPromise() as InventoryItems[];
  }

  public async getInventoriesWithOutRFID(): Promise<InventoryExcelItems[]> {
    return await this.http.get(keys.apiUrl + "Inventory/GetInventoriesWithOutRFID")
      .toPromise() as InventoryExcelItems[];
  }

  public async getInventoryItemsBySearch(inventoryCriteria: InventorySearchCriteria, skip: number, take: number): Promise<InventorySearchResponse> {
    return await this.http.post(keys.apiUrl + "Inventory/GetPaginated/" + skip + "/" + take, inventoryCriteria)
      .toPromise() as InventorySearchResponse;
  }

  public async getInventoryItemsForSelectAll(inventoryCriteria: InventorySearchCriteria): Promise<InventorySelectAllItems[]> {
    return await this.http.post(keys.apiUrl + "Inventory/GetSelectAllByFilter", inventoryCriteria)
      .toPromise() as InventorySelectAllItems[];
  }

  public async getInventoryItemsBySearchForExcel(inventoryCriteria: InventorySearchCriteria): Promise<InventoryItems[]> {
    return await this.http.post(keys.apiUrl + "Inventory/GetFilter", inventoryCriteria)
      .toPromise() as InventoryItems[];
  }

  public async updateInventoryData(inventory: InventoryItems): Promise<boolean> {
    return await this.http.put(keys.apiUrl + "Inventory/Update", inventory)
      .toPromise() as boolean;
  }

  async updateInventoryItemsData(inventory: InventoryItems[]): Promise<string[]> {
    return await this.http.put(keys.apiUrl + "Inventory/UpdateInventoryItems", inventory)
      .toPromise() as string[];
  }

  public async updateInventoryHoldData(inventories: InventoryItems[]): Promise<number> {
    return await this.http.put(keys.apiUrl + "Inventory/UpdateInventoryHold", inventories)
      .toPromise() as number;
  }

  public async updateInventoryListData(inventoryItems: InventoryItems[]): Promise<boolean> {
    return await this.http.put(keys.apiUrl + "Inventory/UpdateInventoryList", inventoryItems)
      .toPromise() as boolean;
  }

  public async updateInventoryGrading(data: IncMeasureGradeLookup[]): Promise<string[]> {
    return await this.http.put(keys.apiUrl + "Inventory/UpdateInventoryGrading", data)
      .toPromise() as string[];
  }

  public async deleteInventoryData(id: string): Promise<number> {
    return await this.http.delete(keys.apiUrl + "Inventory/Delete/" + id)
      .toPromise() as number;
  }

  public async getOrgKapanList(): Promise<string[]> {
    return await this.http.get(keys.apiUrl + "Inventory/GetKapan")
      .toPromise() as string[];
  }

  public async getOrgIGradeList(): Promise<string[]> {
    return await this.http.get(keys.apiUrl + "Inventory/GetIGrade")
      .toPromise() as string[];
  }

  public async getOrgMGradeList(): Promise<string[]> {
    return await this.http.get(keys.apiUrl + "Inventory/GetMGrade")
      .toPromise() as string[];
  }

  public async copyToClipboardStoneId(inventoryCriteria: InventorySearchCriteria): Promise<string> {
    return await this.http.post(keys.apiUrl + "Inventory/CopyToClipboardStoneIds", inventoryCriteria, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async updateInventoryLabToNC(data: InventoryItems[]): Promise<any> {
    return await this.http.put(keys.apiUrl + "Inventory/UpdateInventoryLabToNC", data)
      .toPromise() as any;
  }

  public async ExportToExcelMail(data: ExportToExcelMailData): Promise<CommonResponse> {
    return await this.http.post(keys.apiUrl + "Inventory/ExportToExcelMail", data)
      .toPromise() as CommonResponse;
  }

}