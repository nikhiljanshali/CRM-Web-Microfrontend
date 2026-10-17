import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'common/auth/keys';
import { CommonResponse, LabExpense, LabexpenseSearchCriteria, LabexpenseSearchResponse, LabRecheckRequest, LabServiceCharge, LabServiceType } from 'common/businessobjects';
import { InventoryItems } from 'common/entities';
import { GradingMaster } from 'projects/CRM.Supplier/src/app/businessobjects';
import { Lab, LabIssue, LabIssueResponse, LabIssueSearchCriteria, LabReceiveItem, LabResult, LabSearchCriteria } from '../../businessobjects';

@Injectable({
  providedIn: 'root'
})

export class LabService {
  private controllerUrl = 'Lab/';

  constructor(private http: HttpClient) { }

  public async labRequest(labData: Lab): Promise<string> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "Insert", labData, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async labUpdate(labData: Lab): Promise<boolean> {
    return await this.http.put(keys.apiUrl + this.controllerUrl + "Update", labData)
      .toPromise() as boolean;
  }

  public async getLabs(labCriteria: LabSearchCriteria, skip: number, take: number): Promise<Lab[]> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "GetPaginated/" + skip + "/" + take, labCriteria)
      .toPromise() as Lab[];
  }

  public async getAllLabs(): Promise<Lab[]> {
    return await this.http.get(keys.apiUrl + this.controllerUrl + "GetAll/")
      .toPromise() as Lab[];
  }

  public async deleteLab(id: string): Promise<boolean> {
    return await this.http.delete(keys.apiUrl + this.controllerUrl + "Delete/" + id)
      .toPromise() as boolean;
  }

  public async labIssueRequest(labIssueData: LabIssue): Promise<CommonResponse> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "InsertLabIssue", labIssueData)
      .toPromise() as CommonResponse;
  }

  public async getAllLabsIssue(): Promise<LabIssue[]> {
    return await this.http.get(keys.apiUrl + this.controllerUrl + "GetAllLabIssue/")
      .toPromise() as LabIssue[];
  }

  public async getLabIssue(labIssueCriteria: LabIssueSearchCriteria, skip: number, take: number): Promise<LabIssueResponse> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "GetLabIssuePaginated/" + skip + "/" + take, labIssueCriteria)
      .toPromise() as LabIssueResponse;
  }

  public async UpdateLabReceive(labReceiveItem: LabReceiveItem[]): Promise<string[]> {
    return await this.http.put(keys.apiUrl + this.controllerUrl + "UpdateLabReceive", labReceiveItem)
      .toPromise() as string[];
  }

  public async GetGradingFromStoneIds(ids: string[]): Promise<GradingMaster[]> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "GetGradingFromStoneIds", ids)
      .toPromise() as GradingMaster[];
  }

  public async GetInvItemsFromStoneIds(ids: string[]): Promise<InventoryItems[]> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "GetInvItemsFromStoneIds", ids)
      .toPromise() as InventoryItems[];
  }

  public async InsertLabResult(labResult: LabResult[]): Promise<string[]> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "InsertLabResult", labResult)
      .toPromise() as string[];
  }

  // public async labRecheckIssueRequest(labIssueData: LabIssue): Promise<CommonResponse> {
  //   return await this.http.post(keys.apiUrl + this.controllerUrl + "InsertLabRecheckIssue", labIssueData)
  //     .toPromise() as CommonResponse;
  // }

  public async labRecheckRequest(labRecheckRequest: LabRecheckRequest): Promise<CommonResponse> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "InsertLabRecheckRequest", labRecheckRequest)
      .toPromise() as CommonResponse;
  }


  public async UpdateControllerNoFromStoneIds(ids: string[]): Promise<boolean> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "UpdateControllerNoFromStoneIds", ids)
      .toPromise() as boolean;
  }

  public async getStoneIdsExistOrNotLabResultAsync(ids: string[]): Promise<string[]> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "GetStoneIdsExistOrNotLabResult/", ids)
      .toPromise() as string[];
  }

  public async labServiceInsert(Data: LabServiceType[]): Promise<CommonResponse> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "labServiceInsert", Data)
    .toPromise() as CommonResponse;
  }

  public async labServiceUpdate(Data: LabServiceType): Promise<boolean> {
    return await this.http.put(keys.apiUrl + this.controllerUrl + "labServiceUpdate", Data)
      .toPromise() as boolean;
  }

  public async getAlllabService(): Promise<LabServiceType[]> {
    return await this.http.get(keys.apiUrl + this.controllerUrl + "GetAlllabService")
      .toPromise() as LabServiceType[];
  }

  public async deletelabService(id: string): Promise<boolean> {
    return await this.http.delete(keys.apiUrl + this.controllerUrl + "DeletelabService/" + id)
      .toPromise() as boolean;
  }

  public async getLabExpense(Criteria: LabexpenseSearchCriteria, skip: number, take: number): Promise<LabexpenseSearchResponse> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "GetPaginatedLabexpense/" + skip + "/" + take, Criteria)
      .toPromise() as LabexpenseSearchResponse;
  }

  public async getLabExpenseAll(Criteria: LabexpenseSearchCriteria): Promise<LabexpenseSearchResponse> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "GetPaginatedLabexpense", Criteria)
      .toPromise() as LabexpenseSearchResponse;
  }

  public async labInvoiceExpenseInsert(Data: LabExpense[]): Promise<CommonResponse> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "labInvoiceExpenseInsert", Data)
      .toPromise() as CommonResponse;
  }

  public async GetRecheckCharge(Data: LabServiceCharge): Promise<CommonResponse> {
    return await this.http.post(keys.apiUrl + this.controllerUrl + "GetRecheckCharge", Data)
      .toPromise() as CommonResponse;
  }

}