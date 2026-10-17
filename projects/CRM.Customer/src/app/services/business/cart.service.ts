import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { Cart } from '../../entities';
import { CartItem, CartSearchCriteria } from '../../businessobjects';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public apiUrl = keys.apiUrl + "Cart/";

  constructor(private http: HttpClient) { }

  public async getCartItem(id: string): Promise<CartItem> {
    return await this.http.get(this.apiUrl + "Get/" + id)
      .toPromise() as CartItem;
  }

  public async getCartItemsForCustomerAsync(customerId: string): Promise<CartItem[]> {
    return await this.http.get(this.apiUrl + "GetItemsForCustomer/" + customerId)
      .toPromise() as CartItem[];
  }

  public async getCartItemsByCriteriaAsync(criteria: CartSearchCriteria): Promise<CartItem[]> {
    return await this.http.post(this.apiUrl + "GetItemsByCriteria", criteria)
      .toPromise() as CartItem[];
  }

  public async insertCartAsync(cart: Cart): Promise<string> {
    return await this.http.post(this.apiUrl + "Insert", cart, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async insertCartsAsync(carts: Cart[]): Promise<string> {
    return await this.http.post(this.apiUrl + "InsertMultiple", carts, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async updateCartAsync(cart: Cart): Promise<string> {
    return await this.http.put(this.apiUrl + "Update", cart, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async deleteCartAsync(cartId: string): Promise<boolean> {
    return await this.http.delete(this.apiUrl + "Delete/" + cartId)
      .toPromise() as boolean;
  }

  public async deleteCartsAsync(cartIds: string[]): Promise<boolean>{
    return await this.http.post(this.apiUrl+"DeleteMany",cartIds)
    .toPromise() as boolean;
  }
}