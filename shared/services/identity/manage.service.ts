import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { User, RemoveUserModel } from 'common/entities'

@Injectable({
    providedIn: 'root'
})

export class ManageService {
    controllerPath: string = 'Manage/';

    constructor(private http: HttpClient) { }

    async getAllUsers(): Promise<User[]> {
        return await this.http.get(environment.apiIdentityUrl + this.controllerPath + "GetAll")
            .toPromise() as User[];
    }

    async removeteUser(removeUser: RemoveUserModel): Promise<any> {
        return await this.http.post(environment.apiIdentityUrl + this.controllerPath + "RemoveUser", removeUser, {
            observe: "body",
            responseType: "text"
          }).toPromise() as any;
    }
}