import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { City, Country, State } from 'shared/businessobjects';
import { keys } from 'shared/auth';

@Injectable({
  providedIn: 'root'
})

export class CommonService {

  constructor(private http: HttpClient) { }

  async getCountries(): Promise<Country[]> {
    return await this.http.get(keys.apiUrl + "GeoLocation/GetCountries")
      .toPromise() as Country[];
  }

  async getStatesByCountryCode(country_code: string): Promise<State[]> {
    return await this.http.get(keys.apiUrl + "GeoLocation/GetStates/" + country_code)
      .toPromise() as State[];
  }

  async getCitiesByCountryCodeandStateCode(country_code: string, state_code: string): Promise<City[]> {
    return await this.http.get(keys.apiUrl + "GeoLocation/GetCities/" + state_code + "/" + country_code)
      .toPromise() as City[];
  }
}