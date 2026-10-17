import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { Configurations } from '../../entities';

@Injectable({
  providedIn: 'root'
})

export class ConfigurationService {
  private api = keys.apiUrl + 'Configuration/';

  constructor(private http: HttpClient) { }

  public async getConfiguration(): Promise<Configurations> {
    return await this.http.get(this.api + "Get")
      .toPromise() as Configurations;
  }

  public async updateConfiguration(data: Configurations): Promise<boolean> {
    return await this.http.put(this.api + "Update", data)
      .toPromise() as boolean;
  }

}