import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'common/auth/keys';
import { Party, PartySearchCriteria } from 'common/businessobjects';

@Injectable({
  providedIn: 'root'
})

export class PartyService {

  constructor(private http: HttpClient) { }

  public async getPartyById(id: string): Promise<Party> {
    return await this.http.get(keys.apiUrl + "PartyNames/Get/" + id)
      .toPromise() as Party;
  }

  public async getPartyByCustomerIdent(ident: string): Promise<Party> {
    return await this.http.get(keys.apiUrl + "PartyNames/GetPartyByCustomerIdent/" + ident)
      .toPromise() as Party;
  }


  public async getAllParties(): Promise<Party[]> {
    return await this.http.get(keys.apiUrl + "PartyNames/GetAll")
      .toPromise() as Party[];
  }

  public async getPartyNames(partySearchCriteria: PartySearchCriteria, skip: number, take: number): Promise<Party[]> {
    return await this.http.post(keys.apiUrl + "PartyNames/GetPaginated/" + skip + "/" + take, partySearchCriteria)
      .toPromise() as Party[];
  }

  public async PartyRequest(partyData: Party): Promise<string> {
    return await this.http.post(keys.apiUrl + "PartyNames/InsertParty", partyData, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async partyUpdate(partyData: Party): Promise<string> {
    return await this.http.put(keys.apiUrl + "PartyNames/UpdateParty", partyData, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async deleteParty(partyId: string): Promise<boolean> {
    return await this.http.delete(keys.apiUrl + "PartyNames/DeleteParty/" + partyId)
      .toPromise() as boolean;
  } 

}