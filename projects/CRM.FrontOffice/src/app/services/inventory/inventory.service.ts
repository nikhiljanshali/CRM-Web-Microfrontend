import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { CommonResponse, IncMeasureGradeLookup } from 'shared/businessobjects';
import { ExportToExcelMailData, InventorySearchCriteria, InventorySearchResponse, InventorySelectAllItems } from '../../businessobjects';
import { InvDNorm, InventoryItems, InvItem } from '../../entities';

@Injectable({
  providedIn: 'root'
})

export class InventoryService {

  constructor(private http: HttpClient) { }

  public async getInventoryItemsBySearch(inventoryCriteria: InventorySearchCriteria, skip: number, take: number): Promise<InventorySearchResponse> {
    return await this.http.post(keys.apiUrl + "Inventory/GetPaginated/" + skip + "/" + take, inventoryCriteria)
      .toPromise() as InventorySearchResponse;
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

  public async getInventoryByStoneIds(stoneIds: string[]): Promise<InventoryItems[]> {
    return await this.http.post(keys.apiUrl + "Inventory/GetByStoneIds", stoneIds)
      .toPromise() as InventoryItems[];
  }

  public async getInventoryItemsBySearchForExcel(inventoryCriteria: InventorySearchCriteria): Promise<InventoryItems[]> {
    return await this.http.post(keys.apiUrl + "Inventory/GetFilter", inventoryCriteria)
      .toPromise() as InventoryItems[];
  }

  public async getInventoryItemsForSelectAll(inventoryCriteria: InventorySearchCriteria): Promise<InventorySelectAllItems[]> {
    return await this.http.post(keys.apiUrl + "Inventory/GetSelectAllByFilter", inventoryCriteria)
      .toPromise() as InventorySelectAllItems[];
  }

  public async ExportToExcelMail(data: ExportToExcelMailData): Promise<CommonResponse> {
    return await this.http.post(keys.apiUrl + "Inventory/ExportToExcelMail", data)
      .toPromise() as CommonResponse;
  }

  public async copyToClipboardStoneId(inventoryCriteria: InventorySearchCriteria): Promise<string> {
    return await this.http.post(keys.apiUrl + "Inventory/CopyToClipboardStoneIds", inventoryCriteria, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async updateInventoryHoldData(inventories: InventoryItems[]): Promise<InventoryItems[]> {
    return await this.http.put(keys.apiUrl + "Inventory/UpdateInventoryHold", inventories)
      .toPromise() as InventoryItems[];
  }

  public async updateInventoryData(inventory: InventoryItems): Promise<boolean> {
    return await this.http.put(keys.apiUrl + "Inventory/Update", inventory)
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

  public async getInventoryDNormsByStones(stoneId: string, isHold: boolean): Promise<InvItem[]> {
    return await this.http.get(keys.apiUrl + "Inventory/GetInvItemsByStones/" + stoneId + "/" + isHold)
      .toPromise() as InvItem[];
  }

  public async getInventoryDNormsByCertificateIds(certificateIds: string[], isHold: boolean): Promise<InvItem[]> {
    return await this.http.post(keys.apiUrl + "Inventory/GetInvItemsByCertificateIds/" + isHold, certificateIds)
      .toPromise() as InvItem[];
  }

  public async updateOnlyInventoryList(inventoryItems: InventoryItems[]): Promise<boolean> {
    return await this.http.put(keys.apiUrl + "Inventory/UpdateOnlyInventoryList", inventoryItems)
      .toPromise() as boolean;
  }

  public async updateInventoryHoldUnHoldById(inventoryIds: string[], isHold: boolean): Promise<number> {
    return await this.http.put(keys.apiUrl + "Inventory/UpdateInventoryHoldUnHoldById/"+ isHold, inventoryIds)
      .toPromise() as number;
  }

}