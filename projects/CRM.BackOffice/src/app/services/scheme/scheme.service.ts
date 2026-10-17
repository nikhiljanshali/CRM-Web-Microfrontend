import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { Scheme } from '../../entities';

@Injectable({
  providedIn: 'root'
})
export class SchemeService {

  public controllerName: string = "Schemes";

  constructor(private http: HttpClient) { }

  public async getAllSchemes(): Promise<Scheme[]> {
    return await this.http.get(keys.apiUrl + this.controllerName + "/GetAll")
      .toPromise() as Scheme[];
  }

  public async schemeInsert(schemeObj: Scheme): Promise<string> {
    return await this.http.post(keys.apiUrl + this.controllerName + "/Insert", schemeObj, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async schemeUpdate(schemeObj: Scheme): Promise<boolean> {
    return await this.http.put(keys.apiUrl + this.controllerName + "/Update", schemeObj)
      .toPromise() as boolean;
  }

  public async deleteScheme(id: string): Promise<boolean> {
    return await this.http.delete(keys.apiUrl + this.controllerName + "/Delete/" + id)
      .toPromise() as boolean;
  }

}
