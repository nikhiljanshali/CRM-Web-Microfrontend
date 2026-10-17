import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CutDetailDNorm, MasterConfig, MasterConfigType, MasterDNorm } from 'common/entities';
import { environment } from 'environments/environment';

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
                .get(environment.apiBaseUrl + this.controllerPath + "Get")
                .toPromise() as MasterConfig;
            if (masterConfig)
                sessionStorage.setItem("MasterConfig", JSON.stringify(masterConfig));

        }
        return masterConfig
    }

    async getMasterConfigById(masterConfigId: string): Promise<MasterConfig> {
        return await this.http.get(environment.apiBaseUrl + this.controllerPath + "Get/" + masterConfigId)
            .toPromise() as MasterConfig;
    }

    async getAllInclusions(): Promise<MasterDNorm[]> {
        return await this.http.get(environment.apiBaseUrl + this.controllerPath + "Get/Inclusions")
            .toPromise() as MasterDNorm[];
    }

    async getAllMeasurements(): Promise<MasterDNorm[]> {
        return await this.http.get(environment.apiBaseUrl + this.controllerPath + "Get/Measurements")
            .toPromise() as MasterDNorm[];
    }
    //#endregion

    //#region Insert
    async insertLab(lab: MasterDNorm): Promise<boolean> {
        return await this.http.post(environment.apiBaseUrl + this.controllerPath + "InsertLab", lab)
            .toPromise() as boolean;
    }

    async insertShape(shape: MasterDNorm): Promise<boolean> {
        return await this.http.post(environment.apiBaseUrl + this.controllerPath + "InsertShape", shape)
            .toPromise() as boolean;
    }

    async insertColors(colors: MasterDNorm): Promise<boolean> {
        return await this.http.post(environment.apiBaseUrl + this.controllerPath + "InsertColors", colors)
            .toPromise() as boolean;
    }

    async insertClarities(clarities: MasterDNorm): Promise<boolean> {
        return await this.http.post(environment.apiBaseUrl + this.controllerPath + "InsertClarities", clarities)
            .toPromise() as boolean;
    }

    async insertCPS(cps: MasterDNorm): Promise<boolean> {
        return await this.http.post(environment.apiBaseUrl + this.controllerPath + "InsertCPS", cps)
            .toPromise() as boolean;
    }

    async insertFluorescence(fluorescence: MasterDNorm): Promise<boolean> {
        return await this.http.post(environment.apiBaseUrl + this.controllerPath + "InsertFluorescence", fluorescence)
            .toPromise() as boolean;
    }

    async insertCut(cut: MasterDNorm): Promise<boolean> {
        return await this.http.post(environment.apiBaseUrl + this.controllerPath + "InsertCut", cut)
            .toPromise() as boolean;
    }

    async insertCutDetails(cutDetails: CutDetailDNorm[]): Promise<boolean> {
        return await this.http.post(environment.apiBaseUrl + this.controllerPath + "InsertCutDetails", cutDetails)
            .toPromise() as boolean;
    }

    async insertInclusion(inclusion: MasterDNorm): Promise<boolean> {
        return await this.http.post(environment.apiBaseUrl + this.controllerPath + "InsertInclusion", inclusion)
            .toPromise() as boolean;
    }

    async insertMeasurement(measurement: MasterDNorm): Promise<boolean> {
        return await this.http.post(environment.apiBaseUrl + this.controllerPath + "InsertMeasurement", measurement)
            .toPromise() as boolean;
    }
    //#endregion

    //#region Update
    async updateLab(lab: MasterDNorm): Promise<boolean> {
        return await this.http.put(environment.apiBaseUrl + this.controllerPath + "UpdateLab", lab)
            .toPromise() as boolean;
    }

    async updateShape(shape: MasterDNorm): Promise<boolean> {
        return await this.http.put(environment.apiBaseUrl + this.controllerPath + "UpdateShape", shape)
            .toPromise() as boolean;
    }

    async updateColors(colors: MasterDNorm): Promise<boolean> {
        return await this.http.put(environment.apiBaseUrl + this.controllerPath + "UpdateColors", colors)
            .toPromise() as boolean;
    }

    async updateClarities(clarities: MasterDNorm): Promise<boolean> {
        return await this.http.put(environment.apiBaseUrl + this.controllerPath + "UpdateClarities", clarities)
            .toPromise() as boolean;
    }

    async updateCPS(cps: MasterDNorm): Promise<boolean> {
        return await this.http.put(environment.apiBaseUrl + this.controllerPath + "UpdateCPS", cps)
            .toPromise() as boolean;
    }

    async updateFluorescence(fluorescence: MasterDNorm): Promise<boolean> {
        return await this.http.put(environment.apiBaseUrl + this.controllerPath + "UpdateFluorescence", fluorescence)
            .toPromise() as boolean;
    }

    async updateCut(cut: MasterDNorm): Promise<boolean> {
        return await this.http.put(environment.apiBaseUrl + this.controllerPath + "UpdateCut", cut)
            .toPromise() as boolean;
    }

    async updateCutDetails(cutDetails: CutDetailDNorm): Promise<boolean> {
        return await this.http.put(environment.apiBaseUrl + this.controllerPath + "UpdateCutDetails", cutDetails)
            .toPromise() as boolean;
    }

    async updateInclusion(inclusion: MasterDNorm): Promise<boolean> {
        return await this.http.put(environment.apiBaseUrl + this.controllerPath + "UpdateInclusion", inclusion)
            .toPromise() as boolean;
    }

    async updateActiveInclusion(inclusionType: MasterConfigType): Promise<boolean> {
        return await this.http.put(environment.apiBaseUrl + this.controllerPath + "UpdateInclusionActive", inclusionType)
            .toPromise() as boolean;
    }

    async updateMeasurement(measurement: MasterDNorm): Promise<boolean> {
        return await this.http.put(environment.apiBaseUrl + this.controllerPath + "UpdateMeasurement", measurement)
            .toPromise() as boolean;
    }

    async updateActiveMeasurement(measurementType: MasterConfigType): Promise<boolean> {
        return await this.http.put(environment.apiBaseUrl + this.controllerPath + "UpdateMeasurementActive", measurementType)
            .toPromise() as boolean;
    }
    //#endregion

    //#region Delete
    async deleteLab(labId: string): Promise<boolean> {
        return await this.http.delete(environment.apiBaseUrl + this.controllerPath + "DeleteLab/" + labId)
            .toPromise() as boolean;
    }

    async deleteShape(shapeId: string): Promise<boolean> {
        return await this.http.delete(environment.apiBaseUrl + this.controllerPath + "DeleteShape/" + shapeId)
            .toPromise() as boolean;
    }

    async deleteColors(colorsId: string): Promise<boolean> {
        return await this.http.delete(environment.apiBaseUrl + this.controllerPath + "DeleteColors/" + colorsId)
            .toPromise() as boolean;
    }

    async deleteClarities(claritiesId: string): Promise<boolean> {
        return await this.http.delete(environment.apiBaseUrl + this.controllerPath + "DeleteClarities/" + claritiesId)
            .toPromise() as boolean;
    }

    async deleteCPS(cpsId: string): Promise<boolean> {
        return await this.http.delete(environment.apiBaseUrl + this.controllerPath + "DeleteCPS/" + cpsId)
            .toPromise() as boolean;
    }

    async deleteFluorescence(fluorescenceId: string): Promise<boolean> {
        return await this.http.delete(environment.apiBaseUrl + this.controllerPath + "DeleteFluorescence/" + fluorescenceId)
            .toPromise() as boolean;
    }

    async deleteCut(cutId: string): Promise<boolean> {
        return await this.http.delete(environment.apiBaseUrl + this.controllerPath + "DeleteCut/" + cutId)
            .toPromise() as boolean;
    }

    async deleteCutDetails(cutDetailsId: string): Promise<boolean> {
        return await this.http.delete(environment.apiBaseUrl + this.controllerPath + "DeleteCutDetails/" + cutDetailsId)
            .toPromise() as boolean;
    }

    async deleteInclusion(inclusionId: string): Promise<boolean> {
        return await this.http.delete(environment.apiBaseUrl + this.controllerPath + "DeleteInclusion/" + inclusionId)
            .toPromise() as boolean;
    }

    async deleteMeasurement(measurementId: string): Promise<boolean> {
        return await this.http.delete(environment.apiBaseUrl + this.controllerPath + "DeleteMeasurement/" + measurementId)
            .toPromise() as boolean;
    }
    //#endregion
}