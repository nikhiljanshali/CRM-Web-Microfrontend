import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'common/auth/keys';
import { CommonResponse, StoneProposalMailData } from 'common/businessobjects';
import { InventoryItems, StoneProposal } from 'common/entities';

@Injectable({
  providedIn: 'root'
})

export class StoneProposalService {
  public apiUrl = keys.apiUrl + "StoneProposal/";

  constructor(private http: HttpClient) { }

  public async getStoneProposalById(id: string): Promise<StoneProposal> {
    return await this.http.get(this.apiUrl + "GetById/" + id)
      .toPromise() as StoneProposal;
  }

  public async getStoneProposalByToken(token: string): Promise<StoneProposal> {
    return await this.http.get(this.apiUrl + "GetByToken/" + token)
      .toPromise() as StoneProposal;
  }

  public async getInventoriesByStoneProposalToken(token: string): Promise<InventoryItems[]> {
    return await this.http.get(this.apiUrl + "GetFilterInventoriesByProposalToken/" + token)
      .toPromise() as InventoryItems[];
  }

  public async sendStoneProposal(data: StoneProposalMailData): Promise<CommonResponse> {
    return await this.http.post(this.apiUrl + "SendStoneProposal", data)
      .toPromise() as CommonResponse;
  }

}