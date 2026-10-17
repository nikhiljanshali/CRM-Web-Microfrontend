import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { DataResult, GroupDescriptor, process } from '@progress/kendo-data-query';
import { fxCredential, GridMasterConfig, IdentityDNorm, InventoryItems, Notifications } from 'common/entities';
import { AlertdialogService } from 'common/views';
import { GridPropertiesService, AppPreloadService, ConfigService, LabService, UtilityService, NotificationService, EmployeeCriteriaService, PriceRequestTemplate } from 'common/services';
import { GridDetailConfig, LabIssue, LabIssueItem, LabReceiveItem } from 'common/businessobjects';
import { NgxSpinnerService } from 'ngx-spinner';
import { GridConfig } from 'common/entities/configs/gridconfig';
import { Router } from '@angular/router';

@Component({
  selector: 'app-labreceive',
  templateUrl: './labreceive.component.html',
  styleUrls: ['./labreceive.component.css']
})
export class LabreceiveComponent implements OnInit {
  @Output() toggle: EventEmitter<boolean> = new EventEmitter();
  @Input() stockOnHandSelectedItems: InventoryItems[] = [];

  public isLabReceive: boolean = true;
  public groups: GroupDescriptor[] = [];
  public groupsIssue: GroupDescriptor[] = [];
  public pageSize = 26;
  public skip = 0;
  public fields!: GridDetailConfig[];
  public gridView!: DataResult;
  public selectableSettings: SelectableSettings = {
    mode: 'multiple',
  };
  public skeletonArray = new Array(18);
  public mySelection: string[] = [];
  public isGridConfig: boolean = false;
  public fxCredentials?: fxCredential;
  private fxCredential!: fxCredential;
  public totalWeight: number = 0;
  public labIssueItems!: LabIssue[];
  public labIssueStoneItems: LabIssueItem[] = [];
  public saveLabReceiveItems: LabIssueItem[] = [];
  public labIssueStoneWithIdItems: Array<{ labIssueID: string; stoneId: string; isReceived: boolean }> = [];
  public saveLabReceiveWithIdItems: Array<{ labIssueID: string; stoneId: string; isReceived: boolean }> = [];
  public saveItems: LabReceiveItem[] = [];
  public gridConfig!: GridConfig;
  public gridMasterConfigResponse!: GridMasterConfig;
  public cntMnuStones?: string;
  public Barcode?: string;
  public sumMnuStonesWeight?: string;
  public gridViewLab!: DataResult;
  public strOrg?: string;
  public strDept?: string;
  public strEmp?: string;
  public existStoneIds: string[] = [];

  constructor(
    private gridPropertiesService: GridPropertiesService,
    private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService,
    private configService: ConfigService,
    public utilityService: UtilityService,
    private labService: LabService,
    public appPreloadService: AppPreloadService,
    private notificationService: NotificationService,
    private employeeCriteriaService: EmployeeCriteriaService,
    public router: Router) {
    this.notificationService.getMessage();
  }

  async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  //#region defaultMethods
  public async defaultMethodsLoad() {
    try {
      this.fxCredential = await this.appPreloadService.fetchFxCredentials();
      if (!this.fxCredential)
        this.router.navigate(["login"]);

      this.gridViewLab = { data: [], total: 0 };
      this.strOrg = this.fxCredential.organization;
      this.strEmp = this.fxCredential.fullName;
      this.strDept = this.fxCredential.department;
      await this.loadStock();
      await this.getGridConfiguration();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async loadStock() {
    try {
      this.labIssueItems = await this.labService.getAllLabsIssue();
      this.labIssueItems.forEach(z => {
        this.labIssueStoneItems.push(...z.labIssueItems);
        z.labIssueItems.forEach(a => {
          this.labIssueStoneWithIdItems.push({ labIssueID: z.id, stoneId: a.stoneId, isReceived: a.isReceived });
        });
      });

      //Check Stone ID Exist in Labresult or not
      let fetchIds: string[] = this.stockOnHandSelectedItems.map((x: any) => x.stoneId);
      this.existStoneIds = await this.labService.getStoneIdsExistOrNotLabResultAsync(fetchIds)

      if (this.stockOnHandSelectedItems.length > this.existStoneIds.length) {
        let invalidItems = this.stockOnHandSelectedItems.filter(z => !this.existStoneIds.includes(z.stoneId)).map(x => x.stoneId).join(', ');
        this.alertDialogService.show(`Lab result not saved for Some of the stone(s) 
        ${invalidItems}
         . Please check the details.`);
      }

      if (this.existStoneIds && this.existStoneIds.length > 0)
        this.stockOnHandSelectedItems = this.stockOnHandSelectedItems.filter(z => this.existStoneIds.includes(z.stoneId));
      else
        this.stockOnHandSelectedItems = [];

      this.stockOnHandSelectedItems.forEach((element: InventoryItems) => {
        if (this.labIssueStoneItems.find(z => z.stoneId == element.stoneId && z.isReceived == false)) {

          let data = new LabIssueItem();
          data.stoneId = element.stoneId;
          data.kapan = element.kapan;
          data.shape = element.shape;
          data.weight = element.weight;
          data.color = element.color;
          data.clarity = element.clarity;
          data.cut = element.cut;
          data.polish = element.polish;
          data.symmetry = element.symmetry;
          data.fluorescence = element.fluorescence;
          data.basePrice.discount = element.basePrice.discount;
          data.basePrice.netAmount = element.basePrice.netAmount;
          data.basePrice.perCarat = element.basePrice.perCarat;
          data.basePrice.rap = element.basePrice.rap;
          data.isReceived = false;
          this.saveLabReceiveItems.push(data);
        }
      });

      this.labIssueStoneWithIdItems.forEach(F => {
        if (this.saveLabReceiveItems.find(z => z.stoneId == F.stoneId && z.isReceived == false)) {
          this.saveLabReceiveWithIdItems.push({ labIssueID: F.labIssueID, stoneId: F.stoneId, isReceived: false });
        }
      });

      this.gridViewLab = process(this.saveLabReceiveItems, { group: this.groups });
      this.cntMnuStones = this.saveLabReceiveItems.length.toString();
      let totalWeight = 0.0;
      this.saveLabReceiveItems.forEach(z => {
        totalWeight = totalWeight + z.weight;
      });
      this.sumMnuStonesWeight = totalWeight.toFixed(2);
    }
    catch (error: any) {
      this.alertDialogService.show(error.error)
    }
  }
  //#endregion

  //#region Grid Config
  public async getGridConfiguration() {
    try {
      this.spinnerService.show();
      this.gridConfig = await this.configService.getGridConfig(this.fxCredential.id, "LabReceive", "LabReceiveGrid");
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
        this.gridMasterConfigResponse = await this.configService.getMasterGridConfig("LabReceive", "LabReceiveGrid");
        if (this.gridMasterConfigResponse)
          this.fields = this.gridMasterConfigResponse.gridDetail;
        else
          this.fields = await this.gridPropertiesService.getLabReceiveGrid();
      }
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.alertDialogService.show(error);
      this.spinnerService.hide();
    }
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
  //#endregion

  //#region Function
  public onAddBarcode() {
    try {
      let index = this.labIssueStoneItems.findIndex(x => x.stoneId.toLowerCase() == this.Barcode?.trim().toString().toLowerCase() && x.isReceived == false);
      if (index >= 0) {
        this.saveLabReceiveItems.push(this.labIssueStoneItems[index])
      }

      let index2 = this.labIssueStoneWithIdItems.findIndex(x => x.stoneId.toLowerCase() == this.Barcode?.trim().toString().toLowerCase() && x.isReceived == false);
      if (index >= 0) {
        this.saveLabReceiveWithIdItems.push(this.labIssueStoneWithIdItems[index2])
      }

      let tempSelectData = [...this.saveLabReceiveItems];
      this.gridViewLab = { data: tempSelectData, total: tempSelectData.length };
      this.cntMnuStones = tempSelectData.length.toString();
      let totalWeight = 0.0;
      tempSelectData.forEach(z => {
        totalWeight = totalWeight + z.weight;
      });
      this.sumMnuStonesWeight = totalWeight.toFixed(2);
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public resetForm(form?: NgForm) {
    this.saveLabReceiveItems = []
    form?.reset();
  }

  public async onSavePacket(form: NgForm, action: boolean) {
    try {
      if (form.valid) {
        this.spinnerService.show();
        let messageType: string = "";
        let response: any;
        this.fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;

        let Identity = new IdentityDNorm();
        Identity.id = this.fxCredential.id;
        Identity.name = this.fxCredential.fullName;
        Identity.type = 'Employee' ?? '';

        this.saveLabReceiveWithIdItems.forEach(F => {
          this.saveItems.push({
            labIssueID: F.labIssueID,
            stoneId: F.stoneId,
            isReceived: false,
            identity: Identity
          });
        })

        messageType = "updated";
        response = await this.labService.UpdateLabReceive(this.saveItems);
        if (response) {
          this.loadStock();
          this.mySelection = [];
          this.SendNotificationForPriceRequest(response);
          if (action)
            this.toggle.emit(false);
          this.resetForm(form);
          this.utilityService.showNotification(`You have been ${messageType} successfully!`)
        }
        else {
          this.alertDialogService.show(response.message);

          if (response?.errorMessage?.length > 0)
            console.error(response.errorMessage);
        }
      }
      else {
        this.spinnerService.hide();
        Object.keys(form.controls).forEach((key) => {
          form.controls[key].markAsTouched();
        });
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async SendNotificationForPriceRequest(stoneIds: string[]) {
    let empIds = await this.employeeCriteriaService.getEmpIdsForNotificationFromStoneIds(stoneIds);
    if (empIds && empIds.length > 0) {
      empIds.forEach(z => {
        let message: Notifications = PriceRequestTemplate(this.fxCredential, z);
        this.notificationService.messages.next(message);
      });
      this.spinnerService.hide();
    }
    else
      this.spinnerService.hide();
  }

  public deletePlan(id: string): void {
    try {
      var index = this.saveLabReceiveItems.findIndex(x => x.stoneId == id);
      if (index >= 0) {
        this.saveLabReceiveItems.splice(index, 1);

        let tempSelectData = [...this.saveLabReceiveItems];
        this.gridViewLab = { data: tempSelectData, total: tempSelectData.length };
        this.cntMnuStones = tempSelectData.length.toString();
        let totalWeight = 0.0;
        tempSelectData.forEach(z => {
          totalWeight = totalWeight + z.weight;
        });
        this.sumMnuStonesWeight = totalWeight.toFixed(2);
      }

      var index = this.saveLabReceiveWithIdItems.findIndex(x => x.stoneId == id);
      if (index >= 0) {
        this.saveLabReceiveWithIdItems.splice(index, 1);
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }
  //#endregion

  //#region Dailog
  public closeLabReceiveDialog(): void {
    this.toggle.emit(false);
  }

  public openGridConfigDialog(): void {
    this.isGridConfig = true;
  }
  //#endregion

}
