import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'common/auth/keys';
import { Address, BranchDNorm, OrganizationDNorm, OrganizationSearchCriteria } from 'common/businessobjects';
import { Branch, Department, Organization } from 'common/entities';

@Injectable({
  providedIn: 'root'
})

export class OrganizationService {

  constructor(private http: HttpClient) { }

  // Organization Endpoints
  async organizationRequest(organizationData: Organization): Promise<string> {
    return await this.http.post(keys.apiUrl + "Organization/Insert", organizationData, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  async organizationUpdate(organizationData: Organization): Promise<string> {
    return await this.http.put(keys.apiUrl + "Organization/Update", organizationData, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  async getOrganizations(organizationCriteria: OrganizationSearchCriteria, skip: number, take: number): Promise<Organization[]> {
    return await this.http.post(keys.apiUrl + "Organization/GetPaginated/" + skip + "/" + take, organizationCriteria)
      .toPromise() as Organization[];
  }

  async getOrganizationAddressByEmployee(employeeId: string): Promise<Address> {
    return await this.http.get(keys.apiUrl + "Organization/GetOrganizationAddressByEmployeeIdAsync/" + employeeId)
      .toPromise() as Address;
  }

  async deleteOrganization(id: string): Promise<boolean> {
    return await this.http.delete(keys.apiUrl + "Organization/Delete/" + id)
      .toPromise() as boolean;
  }

  async getOrganizationDNorm(): Promise<OrganizationDNorm[]> {
    return await this.http.get(keys.apiUrl + "Organization/GetDNorms/")
      .toPromise() as Organization[];
  }

  async getOrganizationById(id: string): Promise<Organization> {
    return await this.http.get(keys.apiUrl + "Organization/Get/" + id)
      .toPromise() as Organization;
  }

  // Branch Endpoints
  async branchInsert(organizationId: string, branchData: Branch): Promise<string> {
    return await this.http.post(keys.apiUrl + "Organization/InsertBranch/" + organizationId, branchData, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  async branchUpdate(organizationId: string, branchData: Branch): Promise<string> {
    return await this.http.put(keys.apiUrl + "Organization/UpdateBranch/" + organizationId, branchData, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  async deleteBranch(organizationId: string, branchId: string): Promise<boolean> {
    return await this.http.delete(keys.apiUrl + "Organization/DeleteBranch/" + organizationId + "/" + branchId)
      .toPromise() as boolean;
  }

  // Department Endpoints
  async departmentInsert(organizationId: string, departmentData: Department): Promise<string> {
    return await this.http.post(keys.apiUrl + "Organization/InsertDepartment/" + organizationId, departmentData, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  async departmentUpdate(organizationId: string, departmentData: Department): Promise<string> {
    return await this.http.put(keys.apiUrl + "Organization/UpdateDepartment/" + organizationId, departmentData, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  async deleteDepartment(organizationId: string, departmentId: string): Promise<boolean> {
    return await this.http.delete(keys.apiUrl + "Organization/DeleteDepartment/" + organizationId + "/" + departmentId)
      .toPromise() as boolean;
  }

  async getBranchDNormByOrganizationId(id: string): Promise<BranchDNorm[]> {
    return await this.http.get(keys.apiUrl + "Organization/GetBranchDNormByOrganization/" + id)
      .toPromise() as BranchDNorm[];
  }

  async getDepartmentByOrganizationId(id: string): Promise<Department[]> {
    return await this.http.get(keys.apiUrl + "Organization/GetDepartmentByOrganization/" + id)
      .toPromise() as Department[];
  }

}