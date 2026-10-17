import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth/keys';
import { OrderSearchCriteria, OrderSearchResult } from '../../businessobjects';
import { OrderItem } from '../../entities';

@Injectable({
  providedIn: 'root'
})

export class OrderService {

  constructor(private http: HttpClient) { }

  public async getOrderItemById(id: string): Promise<OrderItem> {
    return await this.http.get(keys.apiUrl + "Order/Get/" + id)
      .toPromise() as OrderItem;
  }

  public async getOrderItemsByCriteria(orderSearchCriteria: OrderSearchCriteria, skip: number, take: number): Promise<OrderSearchResult> {
    return await this.http.post(keys.apiUrl + "Order/GetbyCriteria/" + skip + "/" + take, orderSearchCriteria)
      .toPromise() as OrderSearchResult;
  }

  public async orderRequest(orderData: OrderItem): Promise<string> {
    return await this.http.post(keys.apiUrl + "Order/Insert", orderData, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async orderUpdate(orderData: OrderItem): Promise<string> {
    return await this.http.put(keys.apiUrl + "Order/Update", orderData, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async deleteOrderItem(orderId: string): Promise<boolean> {
    return await this.http.delete(keys.apiUrl + "Order/Delete/" + orderId)
      .toPromise() as boolean;
  }

}