import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'common/auth/keys';
import { OrgConfig } from 'common/entities';

@Injectable({
  providedIn: 'root'
})

export class OrganizationconfigService {

  constructor(private http: HttpClient) { }

  public async getOrganizationConfigByOrgId(id: string): Promise<OrgConfig> {
    return await this.http.get(keys.apiUrl + "OrganizationConfig/Get/" + id)
      .toPromise() as OrgConfig;
  }

  public async organizationConfigInsert(orgConfigData: OrgConfig): Promise<string> {
    return await this.http.post(keys.apiUrl + "OrganizationConfig/Insert", orgConfigData, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async organizationConfigUpdate(orgConfigData: OrgConfig): Promise<boolean> {
    return await this.http.put(keys.apiUrl + "OrganizationConfig/Update", orgConfigData).toPromise() as boolean;
  }

  public async deleteOrganizationConfig(id: string): Promise<boolean> {
    return await this.http.delete(keys.apiUrl + "OrganizationConfig/Delete/" + id)
      .toPromise() as boolean;
  }
}
