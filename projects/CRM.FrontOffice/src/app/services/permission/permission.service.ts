import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SystemUserPermission, OriginPermission } from 'shared/enitites';
import { keys } from 'shared/auth';

@Injectable({
    providedIn: 'root'
})

export class PermissionService {

    constructor(private http: HttpClient) { }

    async getOriginPermission(origin: string): Promise<OriginPermission> {
        return await this.http.get(keys.apiUrl + "Permission/Origin/Get/" + origin)
            .toPromise() as OriginPermission;
    }

    async insertOriginPermission(orgPermission: OriginPermission): Promise<string> {
        return await this.http.post(keys.apiUrl + "Permission/Origin/Insert", orgPermission, {
            observe: "body",
            responseType: "text"
        }).toPromise() as string;
    }

    async updateOriginPermission(orgPermission: OriginPermission): Promise<boolean> {
        return await this.http.put(keys.apiUrl + "Permission/Origin/Update", orgPermission)
            .toPromise() as boolean;
    }

    async getSystemUserPermission(systemUserId: string): Promise<SystemUserPermission> {
        return await this.http.get(keys.apiUrl + "Permission/SystemUser/Get/" + systemUserId)
            .toPromise() as SystemUserPermission;
    }

    async insertSystemUserPermission(systemUserPermission: SystemUserPermission): Promise<string> {
        return await this.http.post(keys.apiUrl + "Permission/SystemUser/Insert", systemUserPermission, {
            observe: "body",
            responseType: "text"
        }).toPromise() as string;
    }

    async updateSystemUserPermission(systemUserPermission: SystemUserPermission): Promise<boolean> {
        return await this.http.put(keys.apiUrl + "Permission/SystemUser/Update", systemUserPermission)
            .toPromise() as boolean;
    }
}