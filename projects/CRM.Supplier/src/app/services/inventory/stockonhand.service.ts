import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InventoryItems, InventorySearchResponse, Stockonhandsearchcriteria } from 'common/entities';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})

export class StockOnHandService {

  constructor(private http: HttpClient) { }

  public async getStockById(id: string): Promise<InventoryItems> {
    return await this.http.get(environment.apiSupplierUrl + "StockOnHand/Get/" + id)
      .toPromise() as InventoryItems;
  }

  public async getStockByIdentId(identId: string): Promise<InventoryItems[]> {
    return await this.http.get(environment.apiSupplierUrl + "StockOnHand/GetByIdent/" + identId)
      .toPromise() as InventoryItems[];
  }

  public async getStock(stockonhandsearchcriteria: Stockonhandsearchcriteria, skip: number, take: number): Promise<InventorySearchResponse> {
    return await this.http.post(environment.apiSupplierUrl + "StockOnHand/GetPaginated/" + skip + "/" + take, stockonhandsearchcriteria)
      .toPromise() as InventorySearchResponse;
  }

  public async getStockBySearchForExcel(stockonhandsearchcriteria: Stockonhandsearchcriteria): Promise<InventoryItems[]> {
    return await this.http.post(environment.apiSupplierUrl + "StockOnHand/GetFilter", stockonhandsearchcriteria)
      .toPromise() as InventoryItems[];
  }

  public async getStockForStoneMedia(stockonhandsearchcriteria: Stockonhandsearchcriteria, skip: number, take: number): Promise<InventorySearchResponse> {
    return await this.http.post(environment.apiSupplierUrl + "StockOnHand/GetPaginatedForStoneMedia/" + skip + "/" + take, stockonhandsearchcriteria)
      .toPromise() as InventorySearchResponse;
  }

  public async getAllStock(): Promise<InventoryItems[]> {
    return await this.http.get(environment.apiSupplierUrl + "StockOnHand/GetAll/")
      .toPromise() as InventoryItems[];
  }

  public async updateStock(inventoryItems: InventoryItems[]): Promise<InventoryItems[]> {
    return await this.http.put(environment.apiSupplierUrl + "StockOnHand/UpdateStock", inventoryItems)
      .toPromise() as InventoryItems[];
  }

  public async updateInventoryPricingRequest(inventoryItems: InventoryItems[]): Promise<boolean> {
    return await this.http.put(environment.apiSupplierUrl + "StockOnHand/UpdatePricingRequest", inventoryItems)
      .toPromise() as boolean;
  }

  public async sendMarketSheet(inventoryItems: InventoryItems[]): Promise<number> {
    return await this.http.put(environment.apiSupplierUrl + "StockOnHand/UpdateInventoryMarketSheet", inventoryItems)
      .toPromise() as number;
  }

}