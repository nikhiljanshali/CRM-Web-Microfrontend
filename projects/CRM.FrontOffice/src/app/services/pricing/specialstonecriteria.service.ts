import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { SpecialStoneCriteria } from '../../entities';

@Injectable({
  providedIn: 'root'
})
export class SpecialstonecriteriaService {
  private url = keys.apiUrl + 'SpecialStoneCriteria/';

  constructor(private http: HttpClient) { }

  public async criteriaInsert(specialStoneData: SpecialStoneCriteria): Promise<string> {
    return await this.http.post(this.url + "Insert", specialStoneData, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  public async criteriaUpdate(specialStoneData: SpecialStoneCriteria): Promise<boolean> {
    return await this.http.put(this.url + "Update", specialStoneData)
      .toPromise() as boolean;
  }

  public async getSpecialStoneCriteriaById(id: string): Promise<SpecialStoneCriteria[]> {
    return await this.http.get(this.url + "Get/" + id)
      .toPromise() as SpecialStoneCriteria[];
  }

  public async getAllSpecialStoneCriteria(): Promise<SpecialStoneCriteria[]> {
    let specialStoneCriteria = JSON.parse(sessionStorage.getItem("SpecialStoneCriteria")!) as SpecialStoneCriteria[];
    if (!specialStoneCriteria) {
      specialStoneCriteria = await this.http.get(this.url + "GetAll")
        .toPromise() as SpecialStoneCriteria[];
      if (specialStoneCriteria)
        sessionStorage.setItem("SpecialStoneCriteria", JSON.stringify(specialStoneCriteria));
    }
    return specialStoneCriteria
  }

  public async deleteCriteria(id: string): Promise<boolean> {
    return await this.http.delete(this.url + "Delete/" + id)
      .toPromise() as boolean;
  }
}

