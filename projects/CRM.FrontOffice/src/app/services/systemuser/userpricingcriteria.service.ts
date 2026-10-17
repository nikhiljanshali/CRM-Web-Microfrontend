import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { UserPricingCriteria } from '../../entities';

@Injectable({
  providedIn: 'root'
})
export class UserPricingCriteriaService {
  private controllerUrl = 'UserPricingCriteria/';

  constructor(private http: HttpClient) { }

  public async criteriaInsert(employeeData: UserPricingCriteria): Promise<string> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "Insert", employeeData, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async criteriaUpdate(employeeData: UserPricingCriteria): Promise<boolean> {
    return await this.http.put(keys.apiUrl + this.controllerUrl + "Update", employeeData)
      .toPromise() as boolean;
  }

  public async getUserPricingCriteriaBySystemUser(id: string): Promise<UserPricingCriteria[]> {
    return await this.http.get(keys.apiUrl + this.controllerUrl + "GetBySystemUser/" + id)
      .toPromise() as UserPricingCriteria[];
  }

  // public async getSystemUserIdsForNotification(InvItems: InventoryItems[]): Promise<string[]> {
  //   return await this.http.post(keys.apiUrl + this.controllerUrl + "GetSystemUserIdsForNotificationFromInvItems/", InvItems)
  //     .toPromise() as string[];
  // }

  // public async getSystemUserIdsForNotificationFromStoneIds(stoneIds: string[]): Promise<string[]> {
  //   return await this.http.post(keys.apiUrl + this.controllerUrl + "GetSystemUserIdsForNotificationFromStoneIds/", stoneIds)
  //     .toPromise() as string[];
  // }

  public async deleteCriteria(id: string): Promise<boolean> {
    return await this.http.delete(keys.apiUrl + this.controllerUrl + "Delete/" + id)
      .toPromise() as boolean;
  }
}
