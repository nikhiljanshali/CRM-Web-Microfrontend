import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { keys } from "shared/auth";
import { CommonResponse } from "shared/businessobjects";
import { ExportToExcelMailData } from "../../businessobjects";

@Injectable({
    providedIn: 'root'
  })
  export class EmailService{
    public apiUrl = keys.apiUrl + "Email/";

    constructor(private http: HttpClient) { }

    public async sendEmailAsync(data : ExportToExcelMailData) : Promise<CommonResponse>{
        return await this.http.post(this.apiUrl + "SendFromMyCart", data)
      .toPromise() as CommonResponse;
    }
  }