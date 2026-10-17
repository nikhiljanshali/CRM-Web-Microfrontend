import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { TransactItem } from '../../entities';

@Injectable({
  providedIn: 'root'
})
export class TransactItemService {

  private baseUrl: string;
  constructor(
    private http: HttpClient
  ) {
    this.baseUrl = keys.apiUrl + 'TransactItem/'
  }

  public async getTransactItemById(id: string): Promise<TransactItem> {
    return await this.http.get(this.baseUrl + "Get/" + id).toPromise() as TransactItem;
  }

  public async getTransactItemByGroup(group: string): Promise<TransactItem[]> {
    return await this.http.get(this.baseUrl + "GetByGroup/" + group).toPromise() as TransactItem[];
  }

  public async getTransactItemByName(name: string): Promise<TransactItem[]> {
    return await this.http.get(this.baseUrl + "GetByName/" + name).toPromise() as TransactItem[];
  }

  public async getTransactItemByNameWithSkipTake(name: string, skip: number, take: number): Promise<TransactItem> {
    return await this.http.get(this.baseUrl + "GetByName/" + name + "/" + skip + "/" + take).toPromise() as TransactItem;
  }

  public async getTransactItemPaginated(skip: number, take: number): Promise<TransactItem[]> {
    return await this.http.get(this.baseUrl + "GetPaginated/" + skip + "/" + take).toPromise() as TransactItem[];
  }

  public async insertTransactItem(Data: TransactItem): Promise<string> {
    return await this.http.post(this.baseUrl + "Insert", Data, { observe: "body", responseType: "text" }).toPromise() as string;
  }

  public async updateTransactItem(Data: TransactItem): Promise<string> {
    return await this.http.put(this.baseUrl + "Update", Data, { observe: "body", responseType: "text" }).toPromise() as string;
  }

  public async deleteTransactItem(Id: string): Promise<boolean> {
    return await this.http.delete(this.baseUrl + "Delete/" + Id).toPromise() as boolean;
  }

}
