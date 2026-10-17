import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SystemUserSearchCriteria } from '../../businessobjects';
import { SystemUser, EmailConfig } from '../../entities';
import { keys } from 'shared/auth';

@Injectable({
  providedIn: 'root'
})
export class SystemUserService {
  private controllerUrl = 'SystemUser/';

  constructor(private http: HttpClient) { }

  public async systemUserRequest(systemUserData: SystemUser): Promise<boolean> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "Insert", systemUserData)
      .toPromise() as boolean;
  }

  public async systemUserUpdate(systemUserData: SystemUser): Promise<boolean> {
    return await this.http.put(keys.apiUrl + this.controllerUrl + "Update", systemUserData)
      .toPromise() as boolean;
  }

  public async getSystemUsers(systemUserCriteria: SystemUserSearchCriteria, skip: number, take: number): Promise<SystemUser[]> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "GetPaginated/" + skip + "/" + take, systemUserCriteria)
      .toPromise() as SystemUser[];
  }

  public async getAllSystemUsers(): Promise<SystemUser[]> {
    return await this.http.get(keys.apiUrl + this.controllerUrl + "GetAll")
      .toPromise() as SystemUser[];
  }

  public async deleteSystemUser(id: string): Promise<boolean> {
    return await this.http.delete(keys.apiUrl + this.controllerUrl + "Delete/" + id)
      .toPromise() as boolean;
  }

  public async updateMarketingEmail(data: EmailConfig, empId: string): Promise<boolean> {
    return await this.http.put(keys.apiUrl + this.controllerUrl + "UpdateMarketingEmail/" + empId, data)
      .toPromise() as boolean;
  }

  public async getSystemUserById(id: string): Promise<SystemUser> {
    return await this.http.get(keys.apiUrl + this.controllerUrl + "Get/" + id)
      .toPromise() as SystemUser;
  }

  public async getSystemUserByOrigin(origin: string): Promise<SystemUser[]> {
    return await this.http.get(keys.apiUrl + this.controllerUrl + "GetByOrigin/" + origin)
      .toPromise() as SystemUser[];
  }
}
