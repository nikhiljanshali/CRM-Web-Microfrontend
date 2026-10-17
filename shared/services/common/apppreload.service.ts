import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { keys } from "shared/auth";
import { EmpPermission, fxCredential } from "shared/enitites";
import { environment } from "../../../environments/environment";

@Injectable()
export class AppPreloadService {

  constructor(private http: HttpClient) { }

  public async fetchFxCredentials(empId?: string, type: string = "any"): Promise<fxCredential> {
    let credential = new fxCredential();
    let sesValue = sessionStorage.getItem("fxCredentials");

    if (sesValue)
      credential = JSON.parse(sesValue) as fxCredential;
    else {
      if (type == "any")
        credential = await this.http.get(keys.apiUrl + "Employee/Credential/" + empId)
          .toPromise() as fxCredential
      else
        credential = await this.http.get(environment.apiCustomerUrl + "Customer/Credential/" + empId)
          .toPromise() as fxCredential
      if (empId) {
        if (credential)
          sessionStorage.setItem("fxCredentials", JSON.stringify(credential));
      }
    }

    return credential;
  }

  public async fetchUserPermission(empId: string): Promise<EmpPermission> {
    let userPermissions: EmpPermission = new EmpPermission();
    let sesValue = sessionStorage.getItem("userPermission");

    if (sesValue)
      userPermissions = JSON.parse(sesValue) as EmpPermission;
    else {
      userPermissions = await this.http.get(keys.apiUrl + "Permission/Employee/Get/" + empId)
        .toPromise() as EmpPermission;

      if (userPermissions)
        sessionStorage.setItem("userPermission", JSON.stringify(userPermissions));
    }

    return userPermissions;
  }

}