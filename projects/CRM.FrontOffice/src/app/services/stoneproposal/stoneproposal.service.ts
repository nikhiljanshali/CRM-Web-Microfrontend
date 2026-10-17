import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { CommonResponse } from 'shared/businessobjects';
import { StoneProposalMailData } from '../../businessobjects';

@Injectable({
  providedIn: 'root'
})

export class StoneProposalService {
  public apiUrl = keys.apiUrl + "StoneProposal/";

  constructor(private http: HttpClient) { }

  public async sendStoneProposal(data: StoneProposalMailData): Promise<CommonResponse> {
    return await this.http.post(this.apiUrl + "SendStoneProposal", data)
      .toPromise() as CommonResponse;
  }

}