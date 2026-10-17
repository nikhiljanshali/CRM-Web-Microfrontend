import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee, EmployeeSearchCriteria, MarketingEmail } from '../../businessobjects';
import { CommonResponse } from 'common/businessobjects';
import { keys } from 'common/auth/keys';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private controllerUrl = 'Employee/';

  constructor(private http: HttpClient) { }

  public async employeeRequest(employeeData: Employee): Promise<CommonResponse> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "Insert", employeeData)
      .toPromise() as CommonResponse;
  }

  public async employeeUpdate(employeeData: Employee): Promise<CommonResponse> {
    return await this.http.put(keys.apiUrl + this.controllerUrl + "Update", employeeData)
      .toPromise() as CommonResponse;
  }

  public async getEmployees(employeeCriteria: EmployeeSearchCriteria, skip: number, take: number): Promise<Employee[]> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "GetPaginated/" + skip + "/" + take, employeeCriteria)
      .toPromise() as Employee[];
  }

  public async getAllEmployees(): Promise<Employee[]> {
    return await this.http.get(keys.apiUrl + this.controllerUrl + "GetAll")
      .toPromise() as Employee[];
  }

  public async getEmpFromDept(id: string): Promise<Employee[]> {
    return await this.http.get(keys.apiUrl + this.controllerUrl + "GetEmpFromDept/" + id)
      .toPromise() as Employee[];
  }

  public async deleteEmployee(id: string): Promise<boolean> {
    return await this.http.delete(keys.apiUrl + this.controllerUrl + "Delete/" + id)
      .toPromise() as boolean;
  }

  public async updateMarketingEmail(data: MarketingEmail, empId: string): Promise<boolean> {
    return await this.http.put(keys.apiUrl + this.controllerUrl + "UpdateMarketingEmail/" + empId, data)
      .toPromise() as boolean;
  }

  public async getEmployeeById(id: string): Promise<Employee> {
    return await this.http.get(keys.apiUrl + this.controllerUrl + "Get/" + id)
      .toPromise() as Employee;
  }
}
