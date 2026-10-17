import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { Address } from 'shared/businessobjects';
import { BranchDNorm, OrganizationDNorm, OrganizationSearchCriteria } from '../../businessobjects';
import { Branch, Department, Organization } from '../../entities';


@Injectable({
  providedIn: 'root'
})

export class OrganizationService {

  constructor(private http: HttpClient) { }

  // Organization Endpoints
  //public async organizationRequest(organizationData: Organization): Promise<string> {
  //   return await this.http.post(keys.apiUrl + "Organization/Insert", organizationData, {
  //     observe: "body",
  //     responseType: "text"
  //   }).toPromise() as string;
  // }

  //public async organizationUpdate(organizationData: Organization): Promise<string> {
  //   return await this.http.put(keys.apiUrl + "Organization/Update", organizationData, {
  //     observe: "body",
  //     responseType: "text"
  //   }).toPromise() as string;
  // }

  //public async getOrganizations(organizationCriteria: OrganizationSearchCriteria, skip: number, take: number): Promise<Organization[]> {
  //   return await this.http.post(keys.apiUrl + "Organization/GetPaginated/" + skip + "/" + take, organizationCriteria)
  //     .toPromise() as Organization[];
  // }

  public async getOrganizationAddressByEmployee(employeeId: string): Promise<Address> {
    return await this.http.get(keys.apiUrl + "Organization/GetOrganizationAddressByEmployeeIdAsync/" + employeeId)
      .toPromise() as Address;
  }

  //public async deleteOrganization(id: string): Promise<boolean> {
  //   return await this.http.delete(keys.apiUrl + "Organization/Delete/" + id)
  //     .toPromise() as boolean;
  // }

  public async getOrganizationDNorm(): Promise<OrganizationDNorm[]> {
    return await this.http.get(keys.apiUrl + "Organization/GetDNorms/")
      .toPromise() as Organization[];
  }

  public async getOrganizationById(id: string): Promise<Organization> {
    return await this.http.get(keys.apiUrl + "Organization/Get/" + id)
      .toPromise() as Organization;
  }

  // Branch Endpoints
  public async branchInsert(organizationId: string, branchData: Branch): Promise<string> {
    return await this.http.post(keys.apiUrl + "Organization/InsertBranch/" + organizationId, branchData, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async branchUpdate(organizationId: string, branchData: Branch): Promise<string> {
    return await this.http.put(keys.apiUrl + "Organization/UpdateBranch/" + organizationId, branchData, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async deleteBranch(organizationId: string, branchId: string): Promise<boolean> {
    return await this.http.delete(keys.apiUrl + "Organization/DeleteBranch/" + organizationId + "/" + branchId)
      .toPromise() as boolean;
  }

  // Department Endpoints
  public async departmentInsert(organizationId: string, departmentData: Department): Promise<string> {
    return await this.http.post(keys.apiUrl + "Organization/InsertDepartment/" + organizationId, departmentData, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async departmentUpdate(organizationId: string, departmentData: Department): Promise<string> {
    return await this.http.put(keys.apiUrl + "Organization/UpdateDepartment/" + organizationId, departmentData, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async deleteDepartment(organizationId: string, departmentId: string): Promise<boolean> {
    return await this.http.delete(keys.apiUrl + "Organization/DeleteDepartment/" + organizationId + "/" + departmentId)
      .toPromise() as boolean;
  }

  public async getBranchDNormByOrganizationId(id: string): Promise<BranchDNorm[]> {
    return await this.http.get(keys.apiUrl + "Organization/GetBranchDNormByOrganization/" + id)
      .toPromise() as BranchDNorm[];
  }

  public async getDepartmentByOrganizationId(id: string): Promise<Department[]> {
    return await this.http.get(keys.apiUrl + "Organization/GetDepartmentByOrganization/" + id)
      .toPromise() as Department[];
  }

}