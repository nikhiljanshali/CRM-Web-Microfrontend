import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { LoginModel, LoginResponse, RegisterModel } from 'shared/enitites';

@Injectable({
    providedIn: 'root'
})

export class AccountService {
    controllerPath: string = 'Account/';

    constructor(private http: HttpClient) { }

    async insertUser(registerModel: RegisterModel): Promise<string> {
        return await this.http.post(environment.apiIdentityUrl + this.controllerPath + "Register", registerModel, {
            observe: "body",
            responseType: "text"
        }).toPromise() as string;
    }

    async loginUser(login: LoginModel): Promise<LoginResponse> {
        var reqHeader = new HttpHeaders({ "Content-Type": "application/x-www-form-urlencoded", "No-Auth": "True" });
        var data = "client_id=" + login.client_id + "&user_id=" + login.user_id + "&password=" + login.password;
        return await this.http.post(environment.apiIdentityUrl + "token", data, { headers: reqHeader })
            .toPromise() as LoginResponse;
    }

    async removeUser(email: string): Promise<string> {
        return await this.http.delete(environment.apiIdentityUrl + this.controllerPath + "Delete/" + email, {
            observe: "body",
            responseType: "text"
        }).toPromise() as string;
    }

}