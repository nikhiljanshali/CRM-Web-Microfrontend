import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { IncMeasureGradeLookup } from 'shared/businessobjects';
import { InclusionConfig } from 'shared/enitites';
import { InclusionExcelItems } from '../../businessobjects';
import { InventoryItems } from '../../entities';

@Injectable({
  providedIn: 'root'
})
export class InclusionuploadService {

  public controllerName: string = 'InclusionUpload';

  constructor(private http: HttpClient) { }

  public async getStoneIdsExistOrNotAsync(ids: string[]): Promise<string[]> {
    return await this.http.post(keys.apiUrl + this.controllerName + "/GetStoneIdsExistOrNotAsync/", ids)
      .toPromise() as string[];
  }

  public async getInventoryByStoneId(stoneId: string): Promise<InventoryItems> {
    return await this.http.get(keys.apiUrl + this.controllerName + "/GetByStoneId/" + stoneId)
      .toPromise() as InventoryItems;
  }

  public async getInventoriesByInclusionFilter(inclusionFilter: InclusionConfig, empId: string, isInclude: boolean): Promise<InventoryItems[]> {
    return await this.http.post(keys.apiUrl + this.controllerName + "/GetInventoriesByInclusionFilter/" + empId + "/" + isInclude, inclusionFilter)
      .toPromise() as InventoryItems[];
  }

  public async saveInclusionFile(inclusionExcelItems: InclusionExcelItems[]): Promise<InventoryItems[]> {
    return await this.http.post(keys.apiUrl + this.controllerName + "/UploadInclusionFile/", inclusionExcelItems)
      .toPromise() as InventoryItems[];
  }

  public async updateInventoryGrading(data: IncMeasureGradeLookup[]): Promise<string[]> {
    return await this.http.put(keys.apiUrl + this.controllerName + "/UpdateInventoryGrading", data)
      .toPromise() as string[];
  }
}