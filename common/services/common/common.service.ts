import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { City, Country, State } from 'common/businessobjects';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CommonService {

  constructor(private http: HttpClient) { }

  async getCountries(): Promise<Country[]> {
    return await this.http.get(environment.apiBaseUrl + "GeoLocation/GetCountries")
      .toPromise() as Country[];
  }

  async getStatesByCountryCode(country_code: string): Promise<State[]> {
    return await this.http.get(environment.apiBaseUrl + "GeoLocation/GetStates/" + country_code)
      .toPromise() as State[];
  }

  async getCitiesByCountryCodeandStateCode(country_code: string, state_code: string): Promise<City[]> {
    return await this.http.get(environment.apiBaseUrl + "GeoLocation/GetCities/" + state_code + "/" + country_code)
      .toPromise() as City[];
  }
}