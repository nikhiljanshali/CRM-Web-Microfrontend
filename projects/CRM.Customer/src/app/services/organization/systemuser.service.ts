import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { keys } from "shared/auth";
import { SystemUserDNorm } from "../../entities";

@Injectable({
    providedIn: 'root'
})
export class SystemUserService {
    public apiUrl = keys.apiUrl + "SystemUser/";

    constructor(private http: HttpClient) { }

    public async getSystemUserDNormAsync(userId: string): Promise<SystemUserDNorm> {
        return await this.http.get(this.apiUrl + "GetEmpDNormById/" + userId)
            .toPromise() as SystemUserDNorm;
    }

}