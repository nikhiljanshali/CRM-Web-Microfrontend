import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth/keys';
import { LedgerSearchCriteria } from '../../businessobjects';
import { BankDNorm, Ledger, LedgerMemoDNorm } from '../../entities';

@Injectable({
  providedIn: 'root'
})

export class LedgerService {

  constructor(private http: HttpClient) { }

  public async getLedgerById(id: string): Promise<Ledger> {
    return await this.http.get(keys.apiUrl + "Ledger/Get/" + id)
      .toPromise() as Ledger;
  }

  public async getLedgerByCustomerIdent(ident: string): Promise<Ledger> {
    return await this.http.get(keys.apiUrl + "Ledger/GetLedgerByCustomerIdent/" + ident)
      .toPromise() as Ledger;
  }

  public async getAllLedgers(): Promise<Ledger[]> {
    return await this.http.get(keys.apiUrl + "Ledger/GetAll")
      .toPromise() as Ledger[];
  }

  public async getLedgersByCriteria(ledgerSearchCriteria: LedgerSearchCriteria, skip: number, take: number): Promise<Ledger[]> {
    return await this.http.post(keys.apiUrl + "Ledger/GetbyCriteria/" + skip + "/" + take, ledgerSearchCriteria)
      .toPromise() as Ledger[];
  }

  public async getPaginatedLedgers(skip: number, take: number): Promise<Ledger[]> {
    return await this.http.get(keys.apiUrl + "Ledger/GetPaginated/" + skip + "/" + take)
      .toPromise() as Ledger[];
  }

  public async ledgerRequest(ledgerData: Ledger): Promise<string> {
    return await this.http.post(keys.apiUrl + "Ledger/Insert", ledgerData, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async ledgerUpdate(ledgerData: Ledger): Promise<string> {
    return await this.http.put(keys.apiUrl + "Ledger/Update", ledgerData, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async deleteLedger(ledgerId: string): Promise<boolean> {
    return await this.http.delete(keys.apiUrl + "Ledger/Delete/" + ledgerId)
      .toPromise() as boolean;
  }

  public async getBankAccounts(): Promise<BankDNorm[]> {
    return await this.http.get(keys.apiUrl + "Ledger/GetBankAccounts")
      .toPromise() as BankDNorm[];
  }

  public async getLedgerMemoDNorms(ledgerType: string): Promise<LedgerMemoDNorm[]> {
    return await this.http.get(keys.apiUrl + "Ledger/GetLedgerMemoDNorms" + ledgerType)
      .toPromise() as LedgerMemoDNorm[];
  }

  public async getAllLedgersByType(types: string[], value: string = " "): Promise<Ledger[]> {
    return await this.http.post(keys.apiUrl + "Ledger/GetAllLegderByType/" + value, types)
      .toPromise() as Ledger[];
  }

}