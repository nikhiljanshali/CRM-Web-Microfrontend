import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { RejectedStone } from '../../entities';

@Injectable({
  providedIn: 'root'
})

export class RejectedstoneService {

  public controllerName: string = "RejectedStone";
  constructor(private http: HttpClient) { }

  public async getAllRejectedStones(): Promise<RejectedStone[]> {
    return await this.http.get(keys.apiUrl + this.controllerName + "/GetAll")
      .toPromise() as RejectedStone[];
  }

  public async Insert(Data: RejectedStone): Promise<string> {
    return await this.http.post(keys.apiUrl + this.controllerName + "/Insert", Data, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async InsertList(Data: RejectedStone[]): Promise<RejectedStone[]> {
    return await this.http.post(keys.apiUrl + this.controllerName + "/InsertList", Data)
      .toPromise() as RejectedStone[];
  }

  public async Update(Data: RejectedStone): Promise<string> {
    return await this.http.put(keys.apiUrl + this.controllerName + "/Update", Data, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async delete(Id: string): Promise<boolean> {
    return await this.http.delete(keys.apiUrl + this.controllerName + "/Delete/" + Id)
      .toPromise() as boolean;
  }

}