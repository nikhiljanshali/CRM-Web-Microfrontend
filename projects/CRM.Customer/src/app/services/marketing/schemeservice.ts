import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { keys } from "shared/auth";
import { Scheme } from "../../entities";

@Injectable({
    providedIn: "root"
})
export class SchemeService {
    public apiUrl = keys.apiUrl + "Schemes/";

    constructor(private http: HttpClient) { }

    public async getOnlineSchemeAsync(isOnLine: boolean): Promise<Scheme> {
        return await this.http.get(this.apiUrl + "GetByType/" + isOnLine)
            .toPromise() as Scheme;
    }
}