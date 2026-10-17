import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { GradeSearchItems, IncMeasureGradeLookup } from 'common/businessobjects';

@Injectable({
    providedIn: 'root'
})

export class MeasureGradeService {

    constructor(private http: HttpClient) { }

    async getPrice(data: GradeSearchItems[]): Promise<IncMeasureGradeLookup[]> {
        var reqHeader = new HttpHeaders({ "Content-Type": "application/json", "Cache-Control": "no-cache" });
        let jsonData = JSON.stringify(data);
        return await this.http.post(environment.apiMeasureGradeUrl, jsonData, { headers: reqHeader })
            .toPromise() as IncMeasureGradeLookup[];
    }

}