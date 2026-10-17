import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { InventoryExcelItems } from '../../businessobjects';

@Injectable({
  providedIn: 'root'
})

export class InventoryUploadService {

  constructor(private http: HttpClient) { }

  public async getStoneIdsExistOrNotAsync(ids: string[]): Promise<string[]> {
    return await this.http.post(keys.apiUrl + "InventoryUpload/GetStoneIdsExistOrNotAsync/", ids)
      .toPromise() as string[];
  }

  public async saveInventoryFile(inventoryExcelItems: InventoryExcelItems[]): Promise<string[]> {
    return await this.http.post(keys.apiUrl + "InventoryUpload/UploadInventoryFile/", inventoryExcelItems)
      .toPromise() as string[];
  }

}