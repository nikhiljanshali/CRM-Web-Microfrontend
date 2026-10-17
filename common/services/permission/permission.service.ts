import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeptPermission } from 'common/entities/permission/deptpermission';
import { EmpPermission } from 'common/entities/permission/emppermission';
import { OriginPermission } from 'common/entities/permission/originpermission';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})

export class PermissionService {

    constructor(private http: HttpClient) { }

    async getOriginPermission(origin: string): Promise<OriginPermission> {
        return await this.http.get(environment.apiBaseUrl + "Permission/Origin/Get/" + origin)
            .toPromise() as OriginPermission;
    }

    async insertOriginPermission(orgPermission: OriginPermission): Promise<string> {
        return await this.http.post(environment.apiBaseUrl + "Permission/Origin/Insert", orgPermission, {
            observe: "body",
            responseType: "text"
        }).toPromise() as string;
    }

    async updateOriginPermission(orgPermission: OriginPermission): Promise<boolean> {
        return await this.http.put(environment.apiBaseUrl + "Permission/Origin/Update", orgPermission)
            .toPromise() as boolean;
    }

    async getDepartmentPermission(deptId: string): Promise<DeptPermission> {
        return await this.http.get(environment.apiBaseUrl + "Permission/Department/Get/" + deptId)
            .toPromise() as DeptPermission;
    }

    async insertDeptPermission(deptPermission: DeptPermission): Promise<string> {
        return await this.http.post(environment.apiBaseUrl + "Permission/Department/Insert", deptPermission, {
            observe: "body",
            responseType: "text"
        }).toPromise() as string;
    }

    async updateDeptPermission(deptPermission: DeptPermission): Promise<boolean> {
        return await this.http.put(environment.apiBaseUrl + "Permission/Department/Update", deptPermission)
            .toPromise() as boolean;
    }

    async getEmployeePermission(deptId: string): Promise<EmpPermission> {
        return await this.http.get(environment.apiBaseUrl + "Permission/Employee/Get/" + deptId)
            .toPromise() as EmpPermission;
    }

    async insertEmpPermission(empPermission: EmpPermission): Promise<string> {
        return await this.http.post(environment.apiBaseUrl + "Permission/Employee/Insert", empPermission, {
            observe: "body",
            responseType: "text"
        }).toPromise() as string;
    }

    async updateEmpPermission(empPermission: EmpPermission): Promise<boolean> {
        return await this.http.put(environment.apiBaseUrl + "Permission/Employee/Update", empPermission)
            .toPromise() as boolean;
    }
}