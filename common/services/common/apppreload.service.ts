import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { keys } from "shared/auth";
import { fxCredential } from "shared/enitites";

@Injectable()
export class AppPreloadService {

  constructor(private http: HttpClient) { }

  async fetchFxCredentials(customerId?: string): Promise<fxCredential> {
    let credential = new fxCredential();
    let sesValue = sessionStorage.getItem("fxCredentials");

    if (sesValue)
      credential = JSON.parse(sesValue) as fxCredential;
    else {
      credential = await this.http.get(keys.apiUrl + "Customer/GetCredential/" + customerId)
        .toPromise() as fxCredential
      if (credential)
        sessionStorage.setItem("fxCredentials", JSON.stringify(credential));
    }

    return credential;
  }
}