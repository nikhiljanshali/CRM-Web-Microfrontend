import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DataResult, process } from '@progress/kendo-data-query';
import { GridDetailConfig } from 'common/businessobjects';
import { fxCredential, GridConfig, GridMasterConfig, InventoryItems, Notifications } from 'common/entities';
import { AppPreloadService, ConfigService, GridPropertiesService, InventoryService, NotificationService, UtilityService } from 'common/services';
import { AlertdialogService } from 'common/views';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-manualstoneissue',
  templateUrl: './manualstoneissue.component.html',
  styleUrls: ['./manualstoneissue.component.css']
})
export class ManualstoneissueComponent implements OnInit {

  @Input() notificationObj!: Notifications;
  @Output() toggle: EventEmitter<boolean> = new EventEmitter();

  public gridViewInventory!: DataResult;
  public fxCredential!: fxCredential;
  public fields!: GridDetailConfig[];
  public skeletonArray = new Array(3);
  public isGridConfig: boolean = false;
  public totalWeight: number = 0;
  public inventoryItems: InventoryItems[] = [];
  public gridConfig!: GridConfig;
  public gridMasterConfigResponse!: GridMasterConfig;
  public isShowCheckBoxAll: boolean = true;
  public cloneInventoryItems: InventoryItems[] = [];
  public message: Notifications = new Notifications();

  constructor(public inventoryService: InventoryService,
    private spinnerService: NgxSpinnerService,
    public router: Router,
    private gridPropertiesService: GridPropertiesService,
    private alertDialogService: AlertdialogService,
    public utilityService: UtilityService,
    public appPreloadService: AppPreloadService,
    private configService: ConfigService,
    private notificationService: NotificationService,
  ) {
    this.notificationService.getMessage();
  }

  async ngOnInit() {
    await this.defaultMethodsLoad();

  }

  public async defaultMethodsLoad() {
    this.fxCredential = await this.appPreloadService.fetchFxCredentials();
    await this.getGridConfiguration();
    if (this.notificationObj.param)
      await this.loadInventoryByStoneIds(this.notificationObj.param);
  }

  public async loadInventoryByStoneIds(stoneIds: string) {
    let stoneIdsList = this.notificationObj.param.split(',');
    this.inventoryItems = await this.inventoryService.getInventoryByStoneIds(stoneIdsList);
    this.gridViewInventory = process(this.inventoryItems, {});
  }

  public closeManualIssueDialog(): void {
    this.toggle.emit(false);
  }

  public async acceptOrRejectResponse(type: String) {
    try {
      this.spinnerService.show();
      this.cloneInventoryItems = JSON.parse(JSON.stringify(this.inventoryItems));
      if (type.toLowerCase() == "accept")
        this.inventoryItems.forEach(z => {
          z.hasTask = false;
          z.identity.id = this.fxCredential.id;
          z.identity.name = this.fxCredential.fullName;
          z.identity.type = 'Employee' ?? '';
          z.updatedBy = this.fxCredential.id;
        })
      else
        this.inventoryItems.forEach(z => {
          z.hasTask = false;
        })

      let response = await this.inventoryService.updateInventoryListData(this.inventoryItems);
      if (response) {
        this.utilityService.showNotification(`You have been ${type.toLowerCase()}ed stone(s) successfully!`)
        this.closeManualIssueDialog();
      }
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error);
    }
  }

  //#region Grid Config
  public openGridConfigDialog(): void {
    this.isGridConfig = true;
  }

  public setNewGridConfig(gridConfig: GridConfig) {
    try {
      if (gridConfig) {
        this.fields = gridConfig.gridDetail;
        this.gridConfig = new GridConfig();
        this.gridConfig.id = gridConfig.id
        this.gridConfig.gridDetail = gridConfig.gridDetail;
        this.gridConfig.gridName = gridConfig.gridName;
        this.gridConfig.pageName = gridConfig.pageName;
        this.gridConfig.empID = gridConfig.empID;
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async getGridConfiguration() {
    try {
      this.spinnerService.show();
      this.gridConfig = await this.configService.getGridConfig(this.fxCredential.id, "ManualIssue", "ManualIssueGrid");
      if (this.gridConfig && this.gridConfig.id != '') {
        let dbObj: GridDetailConfig[] = this.gridConfig.gridDetail;
        if (dbObj && dbObj.some(c => c.isSelected)) {
          this.fields = dbObj;
          this.fields.sort((n1, n2) => n1.sortOrder - n2.sortOrder);
        }
        else
          this.fields.forEach(c => c.isSelected = true);
      }
      else {
        this.gridMasterConfigResponse = await this.configService.getMasterGridConfig("ManualIssue", "ManualIssueGrid");
        if (this.gridMasterConfigResponse)
          this.fields = this.gridMasterConfigResponse.gridDetail;
        else
          this.fields = await this.gridPropertiesService.getStoneManualIssueGrid();
      }



      this.spinnerService.hide();
    }
    catch (error: any) {
      this.alertDialogService.show(error);
      this.spinnerService.hide();
    }
  }
  //#endregion

}
