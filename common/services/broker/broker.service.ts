import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Broker, BrokerSearchCriteria } from 'common/businessobjects';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})

export class BrokerService {

  constructor(private http: HttpClient) { }

  public async getBrokerById(id: string): Promise<Broker> {
    return await this.http.get(environment.apiSupplierUrl + "BrokerNames/Get/" + id)
      .toPromise() as Broker;
  }

  public async getAllBrokers(): Promise<Broker[]> {
    return await this.http.get(environment.apiSupplierUrl + "BrokerNames/GetAll")
      .toPromise() as Broker[];
  }

  public async getBrokerNames(SearchCriteria: BrokerSearchCriteria, skip: number, take: number): Promise<Broker[]> {
    return await this.http.post(environment.apiSupplierUrl + "BrokerNames/GetPaginated/" + skip + "/" + take, SearchCriteria)
      .toPromise() as Broker[];
  }

  public async Insert(Data: Broker): Promise<string> {
    return await this.http.post(environment.apiSupplierUrl + "BrokerNames/Insert", Data, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async Update(Data: Broker): Promise<string> {
    return await this.http.put(environment.apiSupplierUrl + "BrokerNames/Update", Data, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async delete(Id: string): Promise<boolean> {
    return await this.http.delete(environment.apiSupplierUrl + "BrokerNames/Delete/" + Id)
      .toPromise() as boolean;
  }

}