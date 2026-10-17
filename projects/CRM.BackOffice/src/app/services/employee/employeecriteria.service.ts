import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmployeeCriteria } from '../../businessobjects';
import { InventoryItems } from 'common/entities';
import { keys } from 'shared/auth';

@Injectable({
  providedIn: 'root'
})
export class EmployeeCriteriaService {
  private controllerUrl = 'EmployeeCriteria/';

  constructor(private http: HttpClient) { }

  public async criteriaInsert(employeeData: EmployeeCriteria): Promise<string> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "Insert", employeeData, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async criteriaUpdate(employeeData: EmployeeCriteria): Promise<boolean> {
    return await this.http.put(keys.apiUrl + this.controllerUrl + "Update", employeeData)
      .toPromise() as boolean;
  }

  public async getEmpCriteriaByEmp(id: string): Promise<EmployeeCriteria[]> {
    return await this.http.get(keys.apiUrl + this.controllerUrl + "GetByEmployee/" + id)
      .toPromise() as EmployeeCriteria[];
  }

  public async getEmpIdsForNotification(InvItems: InventoryItems[]): Promise<string[]> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "GetEmpIdsForNotificationFromInvItems/", InvItems)
      .toPromise() as string[];
  }

  public async getEmpIdsForNotificationFromStoneIds(stoneIds: string[]): Promise<string[]> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "GetEmpIdsForNotificationFromStoneIds/", stoneIds)
      .toPromise() as string[];
  }

  public async deleteCriteria(id: string): Promise<boolean> {
    return await this.http.delete(keys.apiUrl + this.controllerUrl + "Delete/" + id)
      .toPromise() as boolean;
  }
}
