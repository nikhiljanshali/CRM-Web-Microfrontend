import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Bank } from '../../businessobjects';

@Injectable({
  providedIn: 'root'
})

export class AccountingInformationService {

  constructor(private http: HttpClient) { }

  public async getBankById(id: string): Promise<Bank> {
    return await this.http.get(environment.apiSupplierUrl + "AccountingInformation/Get/" + id)
      .toPromise() as Bank;
  }

  public async getBankNames(organizationId: string): Promise<Bank[]> {
    return await this.http.get(environment.apiSupplierUrl + "AccountingInformation/GetPaginated/" + organizationId)
      .toPromise() as Bank[];
  }

  public async InsertBank(Data: Bank): Promise<string> {
    return await this.http.post(environment.apiSupplierUrl + "AccountingInformation/Insert", Data, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async UpdateBank(Data: Bank): Promise<string> {
    return await this.http.put(environment.apiSupplierUrl + "AccountingInformation/Update", Data, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async deleteBank(Id: string): Promise<boolean> {
    return await this.http.delete(environment.apiSupplierUrl + "AccountingInformation/Delete/" + Id)
      .toPromise() as boolean;
  }

}