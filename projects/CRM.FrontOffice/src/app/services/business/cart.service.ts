import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { CartItem, LeadCartItem } from '../../businessobjects';
import { CartSearchCriteria } from '../../entities';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = keys.apiUrl + 'Cart/'
  }

  public async getPaginatedCartItems(skip: number, take: number): Promise<CartItem[]> {
    return await this.http.get(this.baseUrl + "GetPaginatedItems/" + skip + "/" + take).toPromise() as CartItem[];
  }

  public async getCartLeadItems(sellerId: string = " "): Promise<LeadCartItem[]> {
    return await this.http.get(this.baseUrl + "GetLeadItems/" + sellerId)
      .toPromise() as LeadCartItem[];
  }

  public async getCartItemsByCriteria(searchCriteria: CartSearchCriteria): Promise<CartItem[]> {
    return await this.http.post(this.baseUrl + "GetItemsByCriteria", searchCriteria).toPromise() as CartItem[];
  }


  public async deleteCartItem(cartId: string): Promise<boolean> {
    return await this.http.delete(this.baseUrl + "Delete/" + cartId).toPromise() as boolean;
  }

}
