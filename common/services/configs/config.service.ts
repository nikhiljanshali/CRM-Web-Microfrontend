import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GridMasterConfig } from 'common/entities';
import { GridConfig } from 'common/entities/configs/gridconfig';
import { environment } from 'environments/environment';

@Injectable({
      providedIn: 'root'
})

export class ConfigService {
      controllerPath: string = 'Config/';

      constructor(private http: HttpClient) { }

      public async getMasterGridConfig(pageName: string, gridName: string): Promise<GridMasterConfig> {
            try {
                  let gridMasterConfig!: GridMasterConfig;
                  if (!gridMasterConfig) {
                        gridMasterConfig = await this.http.get(environment.apiBaseUrl + "Config/GetMasterGridConfig/" + pageName + "/" + gridName)
                              .toPromise() as GridMasterConfig;
                  }
                  return gridMasterConfig;

            }
            catch (error) {
                  throw error;
            }
      }

      public async getGridConfig(empId: string, pageName: string, gridName: string): Promise<GridConfig> {
            try {
                  let gridConfig!: GridConfig;
                  let gridConfigCollection = new Array<GridConfig>();

                  let sesValue = sessionStorage.getItem("GridConfig");
                  if (sesValue) {
                        gridConfigCollection = JSON.parse(sesValue) as GridConfig[];
                        if (gridConfigCollection && gridConfigCollection.length > 0) {
                              let config = gridConfigCollection.find(c => c.empID == empId && c.pageName.toLowerCase() == pageName.toLowerCase() && c.gridName.toLowerCase() == gridName.toLowerCase());
                              if (config && config.id)
                                    gridConfig = config;
                        }
                  }
                  if (!gridConfig) {
                        let config = await this.http.get(environment.apiBaseUrl + "Config/GetGridConfig/" + empId + "/" + pageName + "/" + gridName)
                              .toPromise() as GridConfig;

                        if (config && config.id) {
                              gridConfigCollection.push(config);
                              sessionStorage.setItem("GridConfig", JSON.stringify(gridConfigCollection));
                        }
                  }

                  if (gridConfigCollection && gridConfigCollection.length > 0)
                        gridConfig = gridConfigCollection.find(c => c.empID == empId && c.pageName.toLowerCase() == pageName.toLowerCase() && c.gridName.toLowerCase() == gridName.toLowerCase()) || gridConfig;

                  return gridConfig;

            }
            catch (error) {
                  throw error;
            }
      }

      public async insertGridConfig(gridConfig: GridConfig): Promise<string> {
            return await this.http.post(environment.apiBaseUrl + this.controllerPath + "InsertGridConfig", gridConfig, {
                  observe: "body",
                  responseType: "text"
            })
                  .toPromise() as string;
      }

      public async insertMasterGridConfig(gridMasterConfig: GridMasterConfig): Promise<string> {
            return await this.http.post(environment.apiBaseUrl + this.controllerPath + "InsertMasterGridConfig", gridMasterConfig, {
                  observe: "body",
                  responseType: "text"
            })
                  .toPromise() as string;
      }

      public async updateGridConfig(gridConfig: GridConfig): Promise<boolean> {
            return await this.http.put(environment.apiBaseUrl + this.controllerPath + "UpdateGridConfig", gridConfig)
                  .toPromise() as boolean;
      }

      public async updateMasterGridConfig(gridMasterConfig: GridMasterConfig): Promise<boolean> {
            return await this.http.put(environment.apiBaseUrl + this.controllerPath + "UpdateMasterGridConfig", gridMasterConfig)
                  .toPromise() as boolean;
      }


}