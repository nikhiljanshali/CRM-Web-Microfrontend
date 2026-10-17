import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'common/auth/keys';
import { Invoice } from 'projects/CRM.Supplier/src/app/businessobjects';
import { Ordersearchcriteria, OrderResponse, Order } from 'common/businessobjects';

@Injectable({
  providedIn: 'root'
})

export class OrderService {

  constructor(private http: HttpClient) { }

  public async getLastOrderNo(): Promise<number> {
    return await this.http.get(keys.apiUrl + "Order/GetLastOrderNo").toPromise() as number;
  }

  // public async getOrders(ordersearchcriteria: Ordersearchcriteria, skip: number, take: number): Promise<OrderResponse> {
  //   return await this.http.post(keys.apiUrl + "Order/GetPaginated/" + skip + "/" + take, ordersearchcriteria)
  //     .toPromise() as OrderResponse;
  // }

  public async getOrders(ordersearchcriteria: Ordersearchcriteria): Promise<OrderResponse> {
    return await this.http.post(keys.apiUrl + "Order/GetOrders", ordersearchcriteria)
      .toPromise() as OrderResponse;
  }

  public async orderRequest(orderData: Order[]): Promise<boolean> {
    return await this.http.post(keys.apiUrl + "Order/Insert", orderData).toPromise() as boolean;
  }

  public async deleteOrderByLeadId(leadId: string): Promise<number> {
    return await this.http.delete(keys.apiUrl + "Order/DeleteByLeadId/" + leadId).toPromise() as number;
  }

  public async getOrdersById(OrderNo: number): Promise<OrderResponse> {
    return await this.http.get(keys.apiUrl + "Order/Get/" + OrderNo)
      .toPromise() as OrderResponse;
  }

  public async invoiceInsert(Data: Invoice): Promise<string> {
    return await this.http.post(keys.apiUrl + "Order/InsertInvoice", Data, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async getLastInvoiceNo(): Promise<string> {
    return await this.http.get(keys.apiUrl + "Order/GetLastInvoiceNo").toPromise() as string;
  }

  public async getInvoiceNo(invoiceNo: string): Promise<Invoice> {
    return await this.http.get(keys.apiUrl + "Order/GetInvoice/" + invoiceNo).toPromise() as Invoice;
  }

}