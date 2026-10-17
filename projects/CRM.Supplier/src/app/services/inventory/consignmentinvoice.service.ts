import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'common/auth/keys';
import { CommonResponse } from 'common/businessobjects';
import { ConsignmentInvoice, InventoryItems } from 'common/entities';

@Injectable({
      providedIn: 'root'
})

export class ConsignmentInvoiceService {

      constructor(private http: HttpClient) { }

      public async insertConsignmentInvoice(consignmentInvoice: ConsignmentInvoice): Promise<CommonResponse> {
            return await this.http.post(keys.apiUrl + "ConsignmentInvoice/InsertConsignmentInvoice", consignmentInvoice)
                  .toPromise() as CommonResponse;
      }

      public async getStockOnHandByStoneIdAsync(stoneId: string): Promise<InventoryItems> {
            return await this.http.get(keys.apiUrl + "ConsignmentInvoice/GetStockOnHandByStoneIdAsync/" + stoneId).toPromise() as InventoryItems;
      }


}