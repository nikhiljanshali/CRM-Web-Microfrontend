import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'common/auth/keys';
import { CartResponse } from 'common/businessobjects/cart/cartresponse';
import { InventoryItems } from 'common/entities';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private controllerUrl = 'Cart/';

    constructor(private http: HttpClient) { }

    public async getCartBySellerId(sellerId: string): Promise<CartResponse[]> {
        return await this.http.get(keys.apiUrl + this.controllerUrl + "getCartBySellerId/" + sellerId)
            .toPromise() as CartResponse[];
    }

    public async getStonesByCartId(cartId: string): Promise<InventoryItems[]> {
        return await this.http.get(keys.apiUrl + this.controllerUrl + "GetStonesByCartId/" + cartId)
            .toPromise() as InventoryItems[];
    }
    
}