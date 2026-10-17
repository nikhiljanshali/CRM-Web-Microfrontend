import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth/keys';
import { RegisterCustomer } from '../../entities';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = keys.apiUrl + 'CustomerRegistration/'
  }

  async registerCustomer(registerCustomer: RegisterCustomer): Promise<string> {
    return await this.http.post(this.baseUrl + "Insert", registerCustomer, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  /**
   * TODO : The following code need to update as per requirement.
   */
  async registerNotVerifiedUser(registerCustomer: RegisterCustomer): Promise<string> {
    return await this.http.post(this.baseUrl + "Register/InsertRequest", registerCustomer, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  async setCredential(registerCustomer: RegisterCustomer): Promise<boolean> {
    return await this.http.post(this.baseUrl + "Authenticate/CodeCredential", registerCustomer)
      .toPromise() as boolean;
  }

  async resetCredential(oldPassword: string, registerCustomer: RegisterCustomer): Promise<string> {
    return await this.http.post(this.baseUrl + "Authenticate/ResetPassword/" + oldPassword, registerCustomer, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  async resetNewPassword(registerCustomer: RegisterCustomer): Promise<string> {
    return await this.http.post(this.baseUrl + "Authenticate/ForgotPassword", registerCustomer, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }
}