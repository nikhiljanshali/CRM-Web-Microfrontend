import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'common/auth/keys';
import { CommonResponse } from 'common/businessobjects';
import { SystemUser, SystemUserSearchCriteria } from '../../businessobjects';

@Injectable({
  providedIn: 'root'
})
export class SystemUserService {
  private controllerUrl = 'SystemUser/';

  constructor(private http: HttpClient) { }

  async systemUserRequest(systemUserData: SystemUser): Promise<CommonResponse> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "Insert", systemUserData)
      .toPromise() as CommonResponse;
  }

  async systemUserUpdate(systemUserData: SystemUser): Promise<CommonResponse> {
    return await this.http.put(keys.apiUrl + this.controllerUrl + "Update", systemUserData)
      .toPromise() as CommonResponse;
  }

  async getSystemUsers(systemUserCriteria: SystemUserSearchCriteria, skip: number, take: number): Promise<SystemUser[]> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "GetPaginated/" + skip + "/" + take, systemUserCriteria)
      .toPromise() as SystemUser[];
  }

  async getAllSystemUsers(skip: number, take: number): Promise<SystemUser[]> {
    return await this.http.get(keys.apiUrl + this.controllerUrl + "GetAll/" + skip + "/" + take)
      .toPromise() as SystemUser[];
  }

  async deleteSystemUser(id: string): Promise<boolean> {
    return await this.http.delete(keys.apiUrl + this.controllerUrl + "Delete/" + id)
      .toPromise() as boolean;
  }

  async getSystemUserById(id: string): Promise<SystemUser> {
    return await this.http.get(keys.apiUrl + this.controllerUrl + "Get/" + id)
      .toPromise() as SystemUser;
  }
}
