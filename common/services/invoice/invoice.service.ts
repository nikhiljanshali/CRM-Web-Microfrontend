import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'common/auth/keys';
import { Invoice } from 'projects/CRM.Supplier/src/app/businessobjects';
import { Ordersearchcriteria } from 'common/businessobjects';
import { InvoiceResponse } from 'projects/CRM.Supplier/src/app/businessobjects/invoice/invoiceresponse';

@Injectable({
  providedIn: 'root'
})

export class InvoiceService {

  constructor(private http: HttpClient) { }

  public async getInvoices(ordersearchcriteria: Ordersearchcriteria, skip: number, take: number): Promise<InvoiceResponse> {
    return await this.http.post(keys.apiUrl + "Invoice/GetPaginated/" + skip + "/" + take, ordersearchcriteria)
      .toPromise() as InvoiceResponse;
  }

  public async getInvoiceNo(invoiceNo: string): Promise<InvoiceResponse> {    
    return await this.http.get(keys.apiUrl + "Invoice/GetInvoice/" + invoiceNo).toPromise() as InvoiceResponse;
  }

}