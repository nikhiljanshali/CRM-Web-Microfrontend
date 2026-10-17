import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { BrokerResponse, BrokerSearchCriteria } from '../../businessobjects';
import { Broker, BrokerDNrom } from '../../entities';

@Injectable({
  providedIn: 'root'
})

export class BrokerService {

  public controllerName: string = "Broker";

  constructor(private http: HttpClient) { }

  public async getBrokerById(id: string): Promise<Broker> {
    return await this.http.get(keys.apiUrl + this.controllerName + "/Get/" + id)
      .toPromise() as Broker;
  }

  public async getAllBrokers(): Promise<Broker[]> {
    return await this.http.get(keys.apiUrl + this.controllerName + "/GetAll")
      .toPromise() as Broker[];
  }

  public async getBrokerNames(SearchCriteria: BrokerSearchCriteria, skip: number, take: number): Promise<BrokerResponse> {
    return await this.http.post(keys.apiUrl + this.controllerName + "/GetPaginated/" + skip + "/" + take, SearchCriteria)
      .toPromise() as BrokerResponse;
  }

  public async Insert(Data: Broker): Promise<string> {
    return await this.http.post(keys.apiUrl + this.controllerName + "/Insert", Data, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async Update(Data: Broker): Promise<string> {
    return await this.http.put(keys.apiUrl + this.controllerName + "/Update", Data, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async delete(Id: string): Promise<boolean> {
    return await this.http.delete(keys.apiUrl + this.controllerName + "/Delete/" + Id)
      .toPromise() as boolean;
  }


  public async getAllBrokerDNorms(): Promise<BrokerDNrom[]> {
    return await this.http.get(keys.apiUrl + this.controllerName + "/GetBrokerDNorms")
      .toPromise() as BrokerDNrom[];
  }

}