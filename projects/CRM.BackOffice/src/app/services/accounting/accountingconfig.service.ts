import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { LedgerDNorm, LedgerGroup, TaxType, TransactItemGroup } from '../../entities';
import { AccountingConfig } from '../../entities';

@Injectable({
  providedIn: 'root'
})
export class AccountingconfigService {

  private baseUrl: string;
  constructor(
    private http: HttpClient
  ) {
    this.baseUrl = keys.apiUrl + 'AccConfig/'
  }

  public async getAccoutConfig(): Promise<AccountingConfig> {
    return await this.http.get(this.baseUrl + "Get").toPromise() as AccountingConfig;
  }

  public async getLastInvoiceNum(): Promise<number> {
    return await this.http.get(this.baseUrl + "InvoiceNumber/Get").toPromise() as number;
  }

  public async updateLastInvoiceNum(invoiceNumber: number): Promise<boolean> {
    return await this.http.put(this.baseUrl + "InvoiceNumber/Update", Number(invoiceNumber)).toPromise() as boolean;
  }

  public async getSalesLedger(): Promise<LedgerDNorm> {
    return await this.http.get(this.baseUrl + "SalesLedger/Get").toPromise() as LedgerDNorm;
  }

  public async updateSalesLedgerAsync(ledgerDNormObj: LedgerDNorm): Promise<boolean> {
    return await this.http.put(this.baseUrl + "SalesLedger/Update", ledgerDNormObj).toPromise() as boolean;
  }


  public async getPurchaseLedger(): Promise<LedgerDNorm> {
    return await this.http.get(this.baseUrl + "PurchaseLedger/Get").toPromise() as LedgerDNorm;
  }

  public async updatePurchaseLedger(ledgerDNormObj: LedgerDNorm): Promise<boolean> {
    return await this.http.put(this.baseUrl + "PurchaseLedger/Update", ledgerDNormObj).toPromise() as boolean;
  }

  public async getLedgerGroups(): Promise<LedgerGroup[]> {
    return await this.http.get(this.baseUrl + "LedgerGroup/GetAll").toPromise() as LedgerGroup[];
  }

  public async ledgerGroupInsert(ledgerGroupData: LedgerGroup): Promise<string> {
    return await this.http.post(this.baseUrl + "LedgerGroup/Insert", ledgerGroupData, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async updateLedgerGroupAsync(ledgerGroupData: LedgerGroup): Promise<boolean> {
    return await this.http.put(this.baseUrl + "LedgerGroup/Update", ledgerGroupData).toPromise() as boolean;
  }

  public async deleteLedgerGroup(groupId: string): Promise<boolean> {
    return await this.http.delete(this.baseUrl + "LedgerGroup/Delete/" + groupId)
      .toPromise() as boolean;
  }

  public async taxTypeInsert(taxTypeData: TaxType): Promise<string> {
    return await this.http.post(this.baseUrl + "TaxType/Insert", taxTypeData, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async updateTaxType(taxTypeData: TaxType): Promise<boolean> {
    return await this.http.put(this.baseUrl + "TaxType/Update", taxTypeData).toPromise() as boolean;
  }

  public async deleteTaxType(taxTypeId: string): Promise<boolean> {
    return await this.http.delete(this.baseUrl + "TaxType/Delete/" + taxTypeId)
      .toPromise() as boolean;
  }

  public async getTaxTypesList(): Promise<TaxType[]> {
    return await this.http.get(this.baseUrl + "TaxType/GetAll").toPromise() as TaxType[];
  }

  public async insertTransactItemGroup(transactItemGroupData: TransactItemGroup): Promise<string> {
    return await this.http.post(this.baseUrl + "TransactItemGroup/Insert", transactItemGroupData, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async updateTransactItemGroup(transactItemGroupData: TransactItemGroup): Promise<boolean> {
    return await this.http.put(this.baseUrl + "TransactItemGroup/Update", transactItemGroupData).toPromise() as boolean;
  }

  public async deleteTransactItemGroup(groupId: string): Promise<boolean> {
    return await this.http.delete(this.baseUrl + "TransactItemGroup/Delete/" + groupId)
      .toPromise() as boolean;
  }

  public async getTransactItemGroups(): Promise<TransactItemGroup[]> {
    return await this.http.get(this.baseUrl + "TransactItemGroup/GetAll").toPromise() as TransactItemGroup[];
  }
}
