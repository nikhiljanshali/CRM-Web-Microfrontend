import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Invoiceservice, InvoiceserviceResponse, InvoiceserviceSearchCriteria } from '../../businessobjects';

@Injectable({
  providedIn: 'root'
})

export class InvoiceServiceService {

  constructor(private http: HttpClient) { }

  public async getInvoiceServiceById(id: string): Promise<Invoiceservice> {
    return await this.http.get(environment.apiSupplierUrl + "InvoiceService/Get/" + id)
      .toPromise() as Invoiceservice;
  }

  public async getAllInvoiceService(): Promise<Invoiceservice[]> {
    return await this.http.get(environment.apiSupplierUrl + "InvoiceService/GetAll")
      .toPromise() as Invoiceservice[];
  }

  public async getInvoiceServiceNames(SearchCriteria: InvoiceserviceSearchCriteria, skip: number, take: number): Promise<InvoiceserviceResponse> {    
    return await this.http.post(environment.apiSupplierUrl + "InvoiceService/GetPaginated/" + skip + "/" + take, SearchCriteria)
      .toPromise() as InvoiceserviceResponse;
  }

  public async Insert(Data: Invoiceservice): Promise<string> {
    return await this.http.post(environment.apiSupplierUrl + "InvoiceService/Insert", Data, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async Update(Data: Invoiceservice): Promise<string> {
    return await this.http.put(environment.apiSupplierUrl + "InvoiceService/Update", Data, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async delete(Id: string): Promise<boolean> {
    return await this.http.delete(environment.apiSupplierUrl + "InvoiceService/Delete/" + Id)
      .toPromise() as boolean;
  }

}