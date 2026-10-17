import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { keys } from "shared/auth";
import { CustFxCredential } from "../../entities";

@Injectable()
export class AppPreloadService {

  constructor(private http: HttpClient) { }

  async fetchFxCredentials(customerId?: string): Promise<CustFxCredential> {
    let credential = new CustFxCredential();
    let sesValue = sessionStorage.getItem("fxCredentials");

    if (sesValue)
      credential = JSON.parse(sesValue) as CustFxCredential;
    else {
      credential = await this.http.get(keys.apiUrl + "Customer/GetCredential/" + customerId)
        .toPromise() as CustFxCredential
      if (credential)
        sessionStorage.setItem("fxCredentials", JSON.stringify(credential));
    }

    return credential;
  }
}