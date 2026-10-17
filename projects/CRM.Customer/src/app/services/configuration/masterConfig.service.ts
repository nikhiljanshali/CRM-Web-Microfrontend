import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { MasterConfig,  MasterDNorm } from 'shared/enitites';

@Injectable({
    providedIn: 'root'
})

export class MasterConfigService {
    controllerPath: string = 'MasterConfig/';

    constructor(private http: HttpClient) { }

    //#region Get
    async getAllMasterConfig(): Promise<MasterConfig> {
        let masterConfig = JSON.parse(sessionStorage.getItem("MasterConfig")!) as MasterConfig;
        if (!masterConfig) {
            masterConfig = await this.http
                .get(keys.apiUrl + this.controllerPath + "Get")
                .toPromise() as MasterConfig;
            if (masterConfig)
                sessionStorage.setItem("MasterConfig", JSON.stringify(masterConfig));

        }
        return masterConfig
    }

    async getMasterConfigById(masterConfigId: string): Promise<MasterConfig> {
        return await this.http.get(keys.apiUrl + this.controllerPath + "Get/" + masterConfigId)
            .toPromise() as MasterConfig;
    }

    async getAllInclusions(): Promise<MasterDNorm[]> {
        return await this.http.get(keys.apiUrl + this.controllerPath + "Get/Inclusions")
            .toPromise() as MasterDNorm[];
    }

    async getAllMeasurements(): Promise<MasterDNorm[]> {
        return await this.http.get(keys.apiUrl + this.controllerPath + "Get/Measurements")
            .toPromise() as MasterDNorm[];
    }
    //#endregion
}