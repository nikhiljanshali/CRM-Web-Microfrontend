import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'common/auth/keys';
import { Lab, LabSearchCriteria, LabServiceType } from 'common/businessobjects';

@Injectable({
  providedIn: 'root'
})
export class LabService {
  private controllerUrl = 'Lab/';

  constructor(private http: HttpClient) { }

  async labRequest(labData: Lab): Promise<string> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "Insert", labData, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  async labUpdate(labData: Lab): Promise<boolean> {
    return await this.http.put(keys.apiUrl + this.controllerUrl + "Update", labData)
      .toPromise() as boolean;
  }

  async getLabs(labCriteria: LabSearchCriteria, skip: number, take: number): Promise<Lab[]> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "GetPaginated/" + skip + "/" + take, labCriteria)
      .toPromise() as Lab[];
  }

  async getAllLabs(): Promise<Lab[]> {    
    return await this.http.get(keys.apiUrl + this.controllerUrl + "GetAll/")
      .toPromise() as Lab[];
  }

  async deleteLab(id: string): Promise<boolean> {
    return await this.http.delete(keys.apiUrl + this.controllerUrl + "Delete/" + id)
      .toPromise() as boolean;
  }

  public async getAlllabService(): Promise<LabServiceType[]> {
    return await this.http.get(keys.apiUrl + this.controllerUrl + "GetAlllabService")
      .toPromise() as LabServiceType[];
  }

}
