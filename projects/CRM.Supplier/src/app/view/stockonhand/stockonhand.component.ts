import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { Align } from '@progress/kendo-angular-popup';
import { DataResult, GroupDescriptor, process } from '@progress/kendo-data-query';
import { Employee, GridDetailConfig, OrganizationDNorm } from 'common/businessobjects';
import { Department, fxCredential, GridMasterConfig, InventoryItems, InventorySearchCriteria, InventorySearchResponse, InventorySelectAllItems, MasterConfig, MasterDNorm, Notifications, Stockonhandsearchcriteria } from 'common/entities';
import { GridConfig } from 'common/entities/configs/gridconfig';
import { ConfigService, EmployeeCriteriaService, EmployeeService, FileStoreService, GridPropertiesService, InventoryService, MasterConfigService, NotificationService, OrganizationService, PriceRequestTemplate, PrintFormatService, stockOnHandExcelFormat, StoneStatus, UtilityService } from 'common/services';
import { AlertdialogService } from 'common/views';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { fromEvent } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';
import { StockOnHandService } from '../../services/inventory/stockonhand.service';

@Component({
  selector: 'app-stockonhand',
  templateUrl: './stockonhand.component.html',
  styleUrls: ['./stockonhand.component.css']
})
export class StockonhandComponent implements OnInit {

  public disabledFlag: boolean = true;
  public groups: GroupDescriptor[] = [];
  public groupsIssue: GroupDescriptor[] = [];
  public pageSize = 26;
  public skip = 0
  public fields!: GridDetailConfig[];
  public fieldsManualIssue!: GridDetailConfig[];
  public gridView!: DataResult;
  public gridViewIssue!: DataResult;
  public filterFlag = true;
  public selectableSettings: SelectableSettings = { mode: 'multiple', };
  public isShowCheckBoxAll: boolean = true;
  public allInventoryItems: InventorySelectAllItems[] = [];
  public inventorySearchCriteriaObj: InventorySearchCriteria = new InventorySearchCriteria();
  public openedConfirmationPartyDetails = false;
  public skeletonArray = new Array(18);
  public mySelection: string[] = [];
  public InventoryObj: InventoryItems = new InventoryItems();
  public inventoryItems: InventoryItems[] = [];
  public selectedInventoryItems: InventoryItems[] = [];
  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains'
  };
  public insertFlag: boolean = true;
  public stockOnHandCriteria: Stockonhandsearchcriteria = new Stockonhandsearchcriteria();
  public isManualIssue: boolean = false;
  public islabIssue: boolean = false;
  public islabReceive: boolean = false;
  public isMemo: boolean = false;
  public listDepartmentItems: Array<{ text: string; value: string }> = [];
  public listEmployeeItems: Array<{ text: string; value: string }> = [];
  public listPacketsItems: string[] = [];
  //public listStoneItems: Array<{ text: string; value: string }> = [];
  public deptItems!: Department[];
  public selectedDeptItems?: { text: string, value: string };
  public empItems!: Employee[];
  public selectedEmpItems?: { text: string, value: string };
  public packetsItems!: InventoryItems[];
  public selectedPacketsItems?: { text: string, value: string };
  public organizationDNormItems!: OrganizationDNorm[];
  public fxCredentials!: fxCredential;
  public masterConfigList!: MasterConfig;
  public allTheShapes!: MasterDNorm[];
  public allClarities!: MasterDNorm[];
  public allColors!: MasterDNorm[];
  public allTheFluorescences!: MasterDNorm[];
  public allTheCPS!: MasterDNorm[];
  public totalCount?: number;
  public totalWeight?: number;
  public totalNetAmount?: number;
  public cntMnuStones?: string;
  public sumMnuStonesWeight?: string;
  public isGridConfig: boolean = false;
  public gridConfig!: GridConfig;
  public gridMasterConfigResponse!: GridMasterConfig;
  public isStockConsignment: boolean = false;
  public filterStatus: string = '';
  public filterStatusChk: boolean = true;
  public filterShape: string = '';
  public filterShapeChk: boolean = true;
  public filterKapan: string = '';
  public filterKapanChk: boolean = true;
  public filterColor: string = '';
  public filterColorChk: boolean = true;
  public filterClarity: string = '';
  public filterClarityChk: boolean = true;
  public filterCut: string = '';
  public filterCutChk: boolean = true;
  public filterPolish: string = '';
  public filterPolishChk: boolean = true;
  public filterSymm: string = '';
  public filterSymmChk: boolean = true;
  public filterFlour: string = '';
  public filterFlourChk: boolean = true;
  public allKapan: string[] = [];
  public listShape: Array<{ name: string; isChecked: boolean }> = [];
  public listKapan: Array<{ name: string; isChecked: boolean }> = [];
  public listColor: Array<{ name: string; isChecked: boolean }> = [];
  public listClarity: Array<{ name: string; isChecked: boolean }> = [];
  public listCut: Array<{ name: string; isChecked: boolean }> = [];
  public listPolish: Array<{ name: string; isChecked: boolean }> = [];
  public listSymm: Array<{ name: string; isChecked: boolean }> = [];
  public listFlour: Array<{ name: string; isChecked: boolean }> = [];
  public listStatus: Array<{ name: string; isChecked: boolean }> = [];
  public invResponse: InventorySearchResponse = new InventorySearchResponse();

  public showExcelOption = false;
  @ViewChild("anchor") public anchor!: ElementRef;
  @ViewChild("popup", { read: ElementRef }) public popup!: ElementRef;
  @ViewChild('BarcodeInput') barcodeInput!: ElementRef;

  public anchorAlign: Align = { horizontal: "right", vertical: "bottom" };
  public popupAlign: Align = { horizontal: "center", vertical: "top" };
  public excelOption: string | null = 'selected';

  public excelFile: any[] = [];
  utilityFunctions: any;
  public isVisiable: boolean = true;
  public message: Notifications = new Notifications();

  constructor(
    public router: Router,
    private gridPropertiesService: GridPropertiesService,
    public utilityService: UtilityService,
    private stockOnHandService: StockOnHandService,
    private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService,
    private organizationService: OrganizationService,
    private EmployeeService: EmployeeService,
    private masterConfigService: MasterConfigService,
    private configService: ConfigService,
    private printFormatService: PrintFormatService,
    private inventoryService: InventoryService,
    private changeDetRef: ChangeDetectorRef,
    private notificationService: NotificationService,
    private employeeCriteriaService: EmployeeCriteriaService,
    public datepipe: DatePipe,
    public fileStoreService: FileStoreService) {
    this.notificationService.getMessage();
  }

  async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  //#region defaultMethods
  async defaultMethodsLoad() {
    try {
      this.fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;
      this.spinnerService.show();
      await this.getGridConfiguration();
      await this.loadMasterConfig();
      await this.getOrganizationDNormData();
      //await this.setKapanList();      
      await this.loadStock();
      //await this.getAllPackets(); 
      this.utilityService.filterToggleSubject.subscribe(flag => {
        this.filterFlag = flag;
      });
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async getGridConfiguration() {
    try {
      this.gridConfig = await this.configService.getGridConfig(this.fxCredentials.id, "StockOnHand", "StockOnHandGrid");
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
        this.gridMasterConfigResponse = await this.configService.getMasterGridConfig("StockOnHand", "StockOnHandGrid");
        if (this.gridMasterConfigResponse)
          this.fields = this.gridMasterConfigResponse.gridDetail;
        else
          this.fields = await this.gridPropertiesService.getStockOnHandGrid();
      }
    }
    catch (error: any) {
      this.alertDialogService.show(error);
      this.spinnerService.hide();
    }
  }

  public async loadStock() {
    try {
      this.spinnerService.show();
      this.stockOnHandCriteria.employeeId = this.fxCredentials.id;
      // let inventory: any = await this.stockOnHandService.getAllStock();
      // this.inventoryItems = inventory;
      let res: InventorySearchResponse = await this.stockOnHandService.getStock(this.stockOnHandCriteria, this.skip, this.pageSize);
      if (res) {
        this.invResponse = JSON.parse(JSON.stringify(res));
        //this.inventoryItems = res.inventories;
        this.gridView = process(res.inventories, { group: this.groups });
        this.gridView.total = res.totalCount;
        this.totalCount = res.totalCount;
        this.totalNetAmount = res.totalNetAmount;
        this.totalWeight = res.totalWeight;

        // this.selectedInventoryItems = [];
        // this.mySelection = [];
        this.spinnerService.hide();
      }
    }
    catch (error: any) {
      this.alertDialogService.show(error.error)
    }
  }

  private async getOrganizationDNormData() {
    try {
      this.organizationDNormItems = await this.organizationService.getOrganizationDNorm();

      let organizationId = this.fxCredentials.organizationId;
      let organization = this.organizationDNormItems.find(z => z.id == organizationId) ?? new OrganizationDNorm();

      this.organizationDNormItems = [{ ...organization }];
      await this.getDepartmentsByOrgId(organizationId);
    }
    catch (error: any) {
      console.error(error);
      this.alertDialogService.show(error.error);
    }
  }

  // private async getAllPackets() {
  //   try {
  //     this.packetsItems = await this.stockOnHandService.getAllStock();
  //     this.inventoryItems = this.packetsItems;
  //     this.inventoryItems.forEach(z => {
  //       let index = this.allInventoryItems.findIndex(a => a.stoneId == z.stoneId);
  //       if (index == -1)
  //         this.allInventoryItems.push({ id: z.id, stoneId: z.stoneId, status: z.status });
  //     });
  //     this.listPacketsItems = [];
  //     this.packetsItems.forEach(z => { this.listPacketsItems.push(z.stoneId); });
  //     this.listStoneItems = [];
  //     this.packetsItems.forEach(z => { this.listStoneItems.push({ text: z.stoneId, value: z.stoneId }); });
  //   }
  //   catch (error: any) {
  //     this.spinnerService.hide();
  //     this.alertDialogService.show(error.error);
  //   }
  // }

  public async loadMasterConfig() {
    Object.values(StoneStatus).forEach(z => { this.listStatus.push({ name: z.toString(), isChecked: false }); });
    this.stockOnHandCriteria.status.push(StoneStatus.Arrival.toString());
    this.onMultiSelectChange(this.listStatus, this.stockOnHandCriteria.status);

    this.masterConfigList = await this.masterConfigService.getAllMasterConfig();
    this.allTheShapes = this.masterConfigList.shape;
    this.allTheShapes.forEach(z => { this.listShape.push({ name: z.name, isChecked: false }); });
    this.allColors = this.masterConfigList.colors;
    this.allColors.forEach(z => { this.listColor.push({ name: z.name, isChecked: false }); });
    this.allClarities = this.masterConfigList.clarities;
    this.allClarities.forEach(z => { this.listClarity.push({ name: z.name, isChecked: false }); });
    this.allTheFluorescences = this.masterConfigList.fluorescence;
    this.allTheFluorescences.forEach(z => { this.listFlour.push({ name: z.name, isChecked: false }); });
    this.allTheCPS = this.masterConfigList.cps;
    this.allTheCPS.forEach(z => { this.listCut.push({ name: z.name, isChecked: false }); });
    this.allTheCPS.forEach(z => { this.listPolish.push({ name: z.name, isChecked: false }); });
    this.allTheCPS.forEach(z => { this.listSymm.push({ name: z.name, isChecked: false }); });
    let kapanItems = await this.inventoryService.getOrgKapanList(this.fxCredentials.organizationId);
    kapanItems.forEach(z => { this.listKapan.push({ name: z, isChecked: false }); });
  }

  // public setKapanList(): void {
  //   this.listKapan = [];
  //   this.allKapan = this.packetsItems.map(z => z.kapan);
  //   this.allKapan = this.allKapan.filter(this.utilityService.onlyUniqueFromStringArray)
  //   this.allKapan.forEach(z => { this.listKapan.push({ name: z, isChecked: false }); });
  // }
  //#endregion

  //#region Filter
  public filterPartToggle() {
    this.utilityService.setfilterToggleValue(this.filterFlag);
  }

  public onFilterSubmit(form: NgForm) {
    try {
      this.skip = 0
      this.mySelection = [];
      if (this.stockOnHandCriteria.from != null)
        this.stockOnHandCriteria.from = this.setUTCDateFilter(this.stockOnHandCriteria.from);
      if (this.stockOnHandCriteria.to != null)
        this.stockOnHandCriteria.to = this.setUTCDateFilter(this.stockOnHandCriteria.to);
      this.loadStock()
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  private setUTCDateFilter(date: Date) {
    var newDate = moment(date.setHours(5)).toDate();
    newDate = moment(newDate.setMinutes(30)).toDate();
    return moment(newDate).toDate();
  }

  public clearFilter(form: NgForm) {
    form.reset()
    this.stockOnHandCriteria = new Stockonhandsearchcriteria();
    this.listShape.forEach(z => { z.isChecked = false });
    this.listKapan.forEach(z => { z.isChecked = false });
    this.listColor.forEach(z => { z.isChecked = false });
    this.listClarity.forEach(z => { z.isChecked = false });
    this.listCut.forEach(z => { z.isChecked = false });
    this.listPolish.forEach(z => { z.isChecked = false });
    this.listSymm.forEach(z => { z.isChecked = false });
    this.listFlour.forEach(z => { z.isChecked = false });
    this.listStatus.forEach(z => { z.isChecked = false });
    this.loadStock()
  }

  public resetForm(form?: NgForm) {
    this.InventoryObj = new InventoryItems();
    this.selectedInventoryItems = []
    this.insertFlag = true;
    form?.reset();
  }
  //#endregion

  //#region Dailog
  public async openManualIssueDialog(): Promise<void> {
    try {
      setTimeout(async () => {
        await this.onAddBarcode();
      }, 500);

      this.isManualIssue = true;
      this.gridViewIssue = { data: [], total: 0 };
      this.fieldsManualIssue = JSON.parse(JSON.stringify(this.fields));
      this.fieldsManualIssue.filter(z => z.title.toLowerCase() == "checkbox").forEach(z => { z.isSelected = false });
      this.loadManualIssueGrid();

    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public loadManualIssueGrid() {
    if (this.selectedInventoryItems.length > 0) {
      let invalidStonesStatus = this.selectedInventoryItems.filter(c => c.status.toLowerCase() == 'lab').map(c => c.stoneId).join(', ');
      let invalidStonesMemo = this.selectedInventoryItems.filter(c => c.isMemo).map(c => c.stoneId).join(', ');
      let invalidStonesHasTask = this.selectedInventoryItems.filter(c => c.hasTask).map(c => c.stoneId).join(', ');

      this.selectedInventoryItems = this.selectedInventoryItems.filter(c => !c.hasTask && !c.isMemo && c.status.toLowerCase() != 'lab');

      let message = '';
      if (invalidStonesStatus.length > 0)
        message += `${invalidStonesStatus} <b>Invalid Status</b> <br/>`;
      if (invalidStonesMemo.length > 0)
        message += `${invalidStonesMemo} <b>In Memo</b> <br/>`;
      if (invalidStonesHasTask.length > 0)
        message += `${invalidStonesHasTask} <b>In HasTask</b> <br/>`;

      if (message)
        this.alertDialogService.show(message);

      this.gridViewIssue = process(this.selectedInventoryItems, { group: this.groupsIssue });

      this.cntMnuStones = this.selectedInventoryItems.length.toString();
      let totalWeight = 0.0;
      this.selectedInventoryItems.forEach(z => {
        totalWeight = totalWeight + z.weight;
      });
      this.sumMnuStonesWeight = totalWeight.toFixed(2);
    }
  }

  public closeManualIssueDialog(): void {
    this.isManualIssue = false;
    this.gridViewIssue = { data: [], total: 0 };
    this.mySelection = [];
    this.selectedInventoryItems = [];
    this.selectedPacketsItems = undefined;
    this.selectedDeptItems = undefined;
    this.selectedEmpItems = undefined;
  }

  public openLabIssueDialog(): void {
    this.islabIssue = true;
  }

  public openLabReceiveDialog(): void {
    this.islabReceive = true;
  }

  public openMemoDialog(): void {
    this.isMemo = true;
  }

  public refreshData() {
    this.loadStock();
  }
  //#endregion

  //#region Packet CRUD

  public async onAddPacket() {
    try {
      let tempSelectData = [...this.selectedInventoryItems];
      let selectedindex = this.inventoryItems.findIndex(x => x.stoneId == this.selectedPacketsItems?.value);
      if (selectedindex >= 0) {
        let existIndex = this.selectedInventoryItems.findIndex(x => x.stoneId == this.selectedPacketsItems?.value);
        if (existIndex >= 0) {
          this.alertDialogService.show(`${this.inventoryItems[selectedindex].stoneId} <b>already exist</b> in list`);
          return;
        }
        tempSelectData.push(this.inventoryItems[selectedindex])
        this.selectedInventoryItems.push(this.inventoryItems[selectedindex])
      }
      this.loadManualIssueGrid();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public onAddBarcode() {
    try {
      fromEvent(this.barcodeInput.nativeElement, 'keyup').pipe(
        map((event: any) => {
          return event.target.value;
        })
        , filter(res => res.length > 4)
        , debounceTime(1000)
      ).subscribe((barcodeText: string) => {
        let stones = this.utilityService.CheckStoneIds(barcodeText);
        let tempSelectData = [...this.selectedInventoryItems];
        let alreadyExist = ""

        for (let index = 0; index < stones.length; index++) {
          const element = stones[index];
          let selectedindex = this.inventoryItems.findIndex(x => x.stoneId.toLowerCase() == element.toLowerCase());
          if (selectedindex >= 0) {
            let existIndex = this.selectedInventoryItems.findIndex(x => x.stoneId.toLowerCase() == element.toLowerCase());
            if (existIndex < 0) {
              tempSelectData.push(this.inventoryItems[selectedindex])
              this.selectedInventoryItems.push(this.inventoryItems[selectedindex])
            }
            else
              alreadyExist += element.toUpperCase() + ", "
          }
        }
        this.loadManualIssueGrid();
        if (alreadyExist)
          this.alertDialogService.show(`${alreadyExist} <b>already exist</b> in list`);
      })
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async onSavePacket(form: NgForm, action: boolean) {
    try {
      if (form.valid) {
        this.spinnerService.show();
        let response: any;
        this.fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;

        this.selectedInventoryItems.forEach(z => {
          z.hasTask = true;
        })

        response = await this.inventoryService.updateInventoryListData(this.selectedInventoryItems);
        if (response) {
          this.sendMessage();
          this.mySelection = [];
          this.spinnerService.hide();
          this.selectedPacketsItems = undefined;
          this.selectedDeptItems = undefined;
          this.selectedEmpItems = undefined;
          this.selectedInventoryItems = [];
          this.gridViewIssue = process(this.selectedInventoryItems, { group: this.groupsIssue });

          this.cntMnuStones = this.selectedInventoryItems.length.toString();
          let totalWeight = 0.0;
          this.selectedInventoryItems.forEach(z => {
            totalWeight = totalWeight + z.weight;
          });
          this.sumMnuStonesWeight = totalWeight.toFixed(2);
          if (action)
            this.isManualIssue = false;
          this.resetForm(form);
          this.fields.filter(z => z.propertyName.toLowerCase() == "checkbox").forEach(z => z.isSelected = true);

          this.utilityService.showNotification(`You have been sent packet(s) successfully!`)
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
  //#endregion

  //#region Pricing Request
  public async setPricingRequest() {
    try {
      this.alertDialogService.ConfirmYesNo("Are you sure you want to price request for selected stone(s)?", "Pricing Request")
        .subscribe(async (res: any) => {
          if (res.flag) {
            let selectedInventoryItems = this.selectedInventoryItems.filter(item => this.mySelection.includes(item.stoneId) && item.isPricingRequest == false && item.status == StoneStatus.Stock.toString());
            if (selectedInventoryItems && selectedInventoryItems.length == 0) {
              this.alertDialogService.show(`This/These stone(s) already in pricing request or not in stock!`);
              this.mySelection = [];
              return;
            }

            this.spinnerService.show();
            selectedInventoryItems.forEach(z => {
              z.isPricingRequest = true;
              z.updatedBy = this.fxCredentials.id;
            });

            let res = await this.stockOnHandService.updateInventoryPricingRequest(selectedInventoryItems);
            if (res) {
              this.loadStock();
              this.SendNotificationForPriceRequest(selectedInventoryItems.map(z => z.stoneId));
              this.utilityService.showNotification(`Record(s) updated successfully!`);
            } else
              this.spinnerService.hide();
            this.mySelection = [];
          }
        })
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
        let message: Notifications = PriceRequestTemplate(this.fxCredentials, z);
        this.notificationService.messages.next(message);
      });
      this.spinnerService.hide();
    }
    else
      this.spinnerService.hide();
  }
  //#endregion

  //#region Grid Config
  public onSelect(event: any): void {
    try {
      if (event.selectedRows && event.selectedRows.length > 0) {
        event.selectedRows.forEach((element: any) => {
          let Selectedindex = this.selectedInventoryItems.findIndex(x => x.stoneId == element.dataItem.stoneId);
          if (Selectedindex < 0)
            this.selectedInventoryItems.push(element.dataItem)
        });
      }
      else {
        event.deselectedRows.forEach((element: any) => {
          if (!element.dataItem.isDisabled) {
            let index = this.selectedInventoryItems.findIndex(x => x.stoneId == element.dataItem.stoneId);
            if (index >= 0)
              this.selectedInventoryItems.splice(index, 1)
          }
        });
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public groupChange(groups: GroupDescriptor[]): void {
    try {
      this.groups = groups;
      this.loadStock();
    }
    catch (error: any) {
      this.alertDialogService.show(error.error)
    }
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadStock();
  }

  public selectedRowChange(e: any) {
    this.insertFlag = false;
    this.InventoryObj = new InventoryItems();
    let value: any = e.selectedRows[0].dataItem
    this.InventoryObj = { ...value };
  }

  public cellClickHandler(e: any) {
    // this.mySelection = [];
    // this.mySelection.push(e.dataItem.stoneId);
    // this.selectedInventoryItems = []
    // this.selectedInventoryItems.push(e.dataItem)
  }

  public openGridConfigDialog(): void {
    this.isGridConfig = true;
  }

  public setNewGridConfig(gridConfig: GridConfig) {
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
  //#endregion  

  //#region Function
  private async getDepartmentsByOrgId(id: string) {
    try {
      this.deptItems = await this.organizationService.getDepartmentByOrganizationId(id);
      this.listDepartmentItems = [];
      this.deptItems.forEach(z => { this.listDepartmentItems.push({ text: z.name, value: z.id }); });
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async onDepartmentChange(e: any) {
    try {
      const dept = this.deptItems.find(z => z.id == e.value);
      if (dept != undefined && dept != null) {

        this.empItems = await this.EmployeeService.getEmpFromDept(dept.id);
        this.listEmployeeItems = [];
        this.empItems.forEach(z => {
          if (z.id != this.fxCredentials.id)
            this.listEmployeeItems.push({ text: z.fullName, value: z.id });
        })
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async printStoneDetail() {
    try {
      this.spinnerService.show();
      let response = await this.fileStoreService.downloadBarcodeExcel(this.selectedInventoryItems.map(x => x.stoneId));
      if (response) {
        this.spinnerService.hide();
        var downloadURL = window.URL.createObjectURL(response);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = `${this.utilityService.exportFileName(this.utilityService.replaceSymbols('barcode'))}`;
        link.click();
      }
      // this.spinnerService.show();
      // let printStone: HTMLIFrameElement = document.createElement("iframe");
      // printStone.name = "print_stone_detail";
      // printStone.style.position = "absolute";
      // printStone.style.top = "-1000000px";
      // document.body.appendChild(printStone);
      // printStone?.contentWindow?.document.open();
      // let printContents: string;
      // printContents = this.printFormatService.getStonesWithDetail(this.selectedInventoryItems);
      // printStone?.contentWindow?.document.write(printContents);
      // printStone?.contentWindow?.document.close();
      // this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async exportForMarketSheet() {
    this.alertDialogService.ConfirmYesNo("Are you sure you want to send?", "Market Sheet")
      .subscribe(async (res: any) => {
        if (res.flag) {
          this.spinnerService.show();
          let notValidStones: any = [];
          let existStones: any = [];

          for (let index = 0; index < this.selectedInventoryItems.length; index++) {
            const x = this.selectedInventoryItems[index];
            if (((x.rfid == null || x.rfid == '')) || ((x.price.discount == null || x.price.discount == 0) || (x.price.netAmount == null || x.price.netAmount == 0) || (x.price.perCarat == null || x.price.perCarat == 0) || (x.price.rap == null || x.price.rap == 0)))
              notValidStones.push(x.stoneId);
            else {
              if (x.marketSheetDate != null)
                existStones.push(x.stoneId);
            }
          }

          if (existStones.length > 0) {
            this.alertDialogService.show(`${existStones.join(',')} stone(s) already in market sheet!`);
            this.mySelection = [];
            this.selectedInventoryItems = [];
            this.spinnerService.hide();
            return;
          }

          if (notValidStones.length > 0)
            this.alertDialogService.show(`Stone(s) ${notValidStones.join(',')} with RFID, Discount, Net Amount, Per Carat, Rap are required!`);
          else {
            let response = await this.stockOnHandService.sendMarketSheet(this.selectedInventoryItems);
            if (response == 1) {
              this.loadStock();
              this.utilityService.showNotification(`Stone(s) has been sent for market-sheet successfully!`);
            }
            else
              this.utilityService.showNotification(`Something went wrong!`, "error");

            this.spinnerService.hide();
          }
          this.spinnerService.hide();
          this.mySelection = [];
          this.selectedInventoryItems = [];
        }
      });
  }

  public onMultiSelectChange(val: Array<{ name: string; isChecked: boolean }>, selectedData: string[]): void {
    val.forEach(element => {
      element.isChecked = false;
    });

    if (selectedData && selectedData.length > 0) {
      val.forEach(element => {
        selectedData.forEach(item => {
          if (element.name.toLocaleLowerCase() == item.toLocaleLowerCase())
            element.isChecked = true;
        });
      });
    }
  }

  public getCommaSapratedString(vals: any[], isAll: boolean = false): string {
    let name = vals.join(',')
    if (!isAll)
      if (name.length > 15)
        name = name.substring(0, 15) + '...';

    return name;
  }

  public onOpenDropdown(list: Array<{ name: string; isChecked: boolean }>, e: boolean, selectedData: string[]): boolean {
    if (selectedData?.length == list.map(z => z.name).length)
      e = true;
    else
      e = false;
    return e;
  }

  public handleFilter(e: any): string {
    return e;
  }

  public filterKapanDropdownSearch(allData: string[], e: any, selectedData: string[]): Array<{ name: string; isChecked: boolean }> {
    let filterData: any[] = [];
    allData.forEach(z => { filterData.push({ name: z, isChecked: false }); });
    filterData.forEach(z => {
      if (selectedData?.includes(z.name))
        z.isChecked = true;
    });
    if (e?.length > 0)
      return filterData.filter(z => z.name?.toLowerCase().includes(e?.toLowerCase()));
    else
      return filterData;
  }

  public checkAllListItems(list: Array<{ name: string; isChecked: boolean }>, e: boolean, selectedData: string[]): string[] {
    if (e) {
      selectedData = [];
      selectedData = list.map(z => z.name);
      list.forEach(element => {
        element.isChecked = true;
      });
    }
    else {
      selectedData = [];
      list.forEach(element => {
        element.isChecked = false;
      });
    }
    return selectedData;
  }

  public filterDropdownSearch(allData: MasterDNorm[], e: any, selectedData: string[]): Array<{ name: string; isChecked: boolean }> {
    let filterData: any[] = [];
    allData.forEach(z => { filterData.push({ name: z.name, isChecked: false }); });
    filterData.forEach(z => {
      if (selectedData?.includes(z.name))
        z.isChecked = true;
    });
    if (e?.length > 0)
      return filterData.filter(z => z.name?.toLowerCase().includes(e?.toLowerCase()));
    else
      return filterData;
  }

  public filterStatusDropdownSearch(e: any, selectedData: string[]): Array<{ name: string; isChecked: boolean }> {
    let filterData: any[] = [];
    Object.values(StoneStatus).forEach(z => { this.listStatus.push({ name: z.toString(), isChecked: false }); });
    filterData.forEach(z => {
      if (selectedData?.includes(z.name))
        z.isChecked = true;
    });
    if (e?.length > 0)
      return filterData.filter(z => z.name?.toLowerCase().includes(e?.toLowerCase()));
    else
      return filterData;
  }

  public tagMapper(tags: string[]): void {
    // This function is used for hide selected items in multiselect box
  }
  //#endregion

  //#region Select All
  public async loadAllStocks() {
    try {
      this.spinnerService.show();
      let stockOnHandCriteriaObj = JSON.parse(JSON.stringify(this.stockOnHandCriteria));
      stockOnHandCriteriaObj.empId = this.fxCredentials.id;

      let carat = null;
      carat = this.stockOnHandCriteria.minSize ? (this.stockOnHandCriteria.maxSize ? this.stockOnHandCriteria.minSize + "-" + this.stockOnHandCriteria.maxSize : "") : "";
      stockOnHandCriteriaObj.carat = carat ? carat : undefined;

      let selectedStock: InventorySearchResponse = await this.stockOnHandService.getStock(stockOnHandCriteriaObj, 0, Number(this.totalCount));
      // this.allInventoryItems = await this.inventoryService.getInventoryItemsForSelectAll(this.inventorySearchCriteriaObj);
      if (selectedStock.inventories && selectedStock.inventories.length > 0) {
        this.selectedInventoryItems = selectedStock.inventories;
        this.mySelection = this.selectedInventoryItems.map(z => z.stoneId);

        this.allInventoryItems = [];
        this.selectedInventoryItems.forEach(z => {
          let items: InventorySelectAllItems = new InventorySelectAllItems();
          items.id = z.id;
          items.stoneId = z.stoneId;
          items.status = z.status;
          this.allInventoryItems.push(items);
        });

        this.spinnerService.hide();

        this.changeDetRef.detectChanges();
      }
      else
        this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async selectAllStocks(event: string) {
    this.mySelection = [];
    this.selectedInventoryItems = [];
    if (event.toLowerCase() == 'checked') {
      if (Number(this.totalCount) > this.pageSize)
        await this.loadAllStocks();
      else{
        this.spinnerService.show();
        this.mySelection = this.invResponse.inventories.map(z => z.stoneId);
        this.selectedInventoryItems = this.invResponse.inventories;
        this.allInventoryItems = [];
        this.selectedInventoryItems.forEach(z => {
          let items: InventorySelectAllItems = new InventorySelectAllItems();
          items.id = z.id;
          items.stoneId = z.stoneId;
          items.status = z.status;
          this.allInventoryItems.push(items);
        });
        this.spinnerService.hide();
      }
    }
  }
  //#endregion

  //#region Summary
  public isSummary = false;
  public openSummary(): void {
    this.isSummary = true;
  }

  public closeSummary(): void {
    this.isSummary = false;
  }

  public filterHoldChange(): void {
    this.skip = 0;
    this.mySelection = [];
    let isHold = this.stockOnHandCriteria.isHold;
    if (isHold)
      this.stockOnHandCriteria.isHold = null as any;
    else
      this.stockOnHandCriteria.isHold = true;
    this.loadStock();
    this.closeSummary();
  }

  public filterRapnetHoldChange(): void {
    this.skip = 0;
    this.mySelection = [];
    let isHold = this.stockOnHandCriteria.isRapnetHold;
    if (isHold)
      this.stockOnHandCriteria.isRapnetHold = null as any;
    else
      this.stockOnHandCriteria.isRapnetHold = true;
    this.loadStock();
    this.closeSummary();
  }

  public filterLocationChange(location: string): void {
    this.skip = 0;
    this.mySelection = [];
    let index = this.stockOnHandCriteria.location.indexOf(location);
    if (index >= 0)
      this.stockOnHandCriteria.location.splice(index, 1);
    else
      this.stockOnHandCriteria.location.push(location);
    this.loadStock();
    this.closeSummary();
  }
  //#endregion

  //#region Export To Excel / Mail / Proposal
  public onExcelToggle(): void {
    this.showExcelOption = !this.showExcelOption;
  }

  public async exportToExcel() {
    this.excelFile = [];

    if (this.excelOption == 'selected') {
      if (this.mySelection.length == 0) {
        this.alertDialogService.show('Select at least one stone for export!');
        this.showExcelOption = false;
        return;
      }
    }

    this.spinnerService.show();
    let exportData: InventoryItems[] = [];
    if (this.excelOption == 'selected') {
      exportData = await this.inventoryService.getInventoryByStoneIds(this.mySelection);
    }
    else
      exportData = await this.inventoryService.getInventoryItemsBySearchForExcel(this.inventorySearchCriteriaObj);
    if (exportData && exportData.length > 0) {
      exportData.forEach((element, index) => {
        let i = index + 1;
        var excel = this.convertArrayToObject(stockOnHandExcelFormat, element, i);
        this.excelFile.push(excel);
      });

      if (this.excelFile.length > 0) {
        let isExport: boolean = this.utilityService.exportAsExcelFile(this.excelFile, "Diamond_Excel");
        if (isExport) {
          this.excelOption = null;
          this.showExcelOption = false;
        }
      }
      this.spinnerService.hide();
    }
    else {
      this.alertDialogService.show('No Data Found!');
      this.spinnerService.hide();
    }
  }

  public convertArrayToObject(fields: Array<{ text: string, value: string }>, element: any, index: number): any {
    var obj: any = {};
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].value.includes("measurement")) {
        let propertyname = fields[i].value.split(".")[1];
        if (fields[i].text == "WIDTH")
          obj[fields[i].text] = element.measurement[propertyname] + ' - ' + element.measurement.length;
        else
          obj[fields[i].text] = element.measurement[propertyname];
      }
      else if (fields[i].value.includes("inclusion")) {
        let propertyname = fields[i].value.split(".")[1];
        obj[fields[i].text] = element.inclusion[propertyname];
      }
      else if (fields[i].value.includes("basePrice")) {
        let propertyname = fields[i].value.split(".")[1];
        obj[fields[i].text] = element.basePrice[propertyname];
      }
      else if (fields[i].text == "DATE") {
        let propertyVal = new Date(element[fields[i].value]);
        let format = this.datepipe.transform(propertyVal, 'yyyy-MM-dd')
        obj[fields[i].text] = format;
      }
      else if (fields[i].text == "NO")
        obj[fields[i].text] = index;
      else
        obj[fields[i].text] = element[fields[i].value];
    }
    return obj;
  }

  public downloadAttachment() {
    this.spinnerService.show();
    let isExport: boolean = this.utilityService.exportAsExcelFile(this.excelFile, "Diamond_Excel");
    if (!isExport) {
      this.alertDialogService.show('File not found, Try again later');
      this.spinnerService.hide();
    } else
      this.spinnerService.hide();
  }
  //#endregion

  //#region Hold / Release Stone
  public changeHoldData(isHold: boolean, isRelease: boolean = false): void {
    try {
      var type = 'Rapnet Hold';
      if (isHold)
        type = 'Hold';
      if (isRelease)
        type = 'Release';

      this.alertDialogService.ConfirmYesNo("Are you sure you want to change status to " + type + " for selected stone(s)?", "Change " + type)
        .subscribe(async (res: any) => {
          if (res.flag) {
            this.spinnerService.show();
            let selectedInventoryItems: InventoryItems[] = [];
            let failStones = 0;

            let selectedInventoryStones = this.allInventoryItems.filter(item => this.mySelection.includes(item.stoneId));
            selectedInventoryStones.forEach(z => {
              let obj: InventoryItems = new InventoryItems();
              obj.stoneId = z.stoneId;
              obj.status = z.status;

              if (isRelease) {
                obj.isHold = false;
                obj.isRapnetHold = false;
              }
              else {
                obj.isHold = isHold;
                obj.isRapnetHold = !isHold;
              }

              //Add Require fields to avoid api call error
              obj.weight = 0;
              obj.identity = this.inventoryItems[0].identity;
              obj.stoneOrg = this.inventoryItems[0].stoneOrg;

              selectedInventoryItems.push(obj);
            });

            if (!isRelease) {
              failStones = selectedInventoryItems.filter(z => z.status != StoneStatus.Arrival.toString() && z.status != StoneStatus.Lab.toString()).length;
              selectedInventoryItems = selectedInventoryItems.filter(z => z.status == StoneStatus.Arrival.toString() || z.status == StoneStatus.Lab.toString())
            }

            if (selectedInventoryItems.length > 0) {
              let res = await this.inventoryService.updateInventoryHoldData(selectedInventoryItems);
              if (res) {
                this.spinnerService.hide();
                this.loadStock();
                this.utilityService.showNotification(res.toString() + ` Record(s) updated successfully!`);
                if (failStones > 0)
                  this.utilityService.showNotification(failStones.toString() + ` stone(s) can not hold before 'Stock' status!`, 'warning');
              }
              else {
                this.spinnerService.hide();
                this.utilityService.showNotification(`Stone(s) already in ` + type, 'warning');
              }
            }
            else {
              this.spinnerService.hide();
              this.alertDialogService.show("You can only hold before 'Stock' status!");
            }
            this.mySelection = [];
          }
        });
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }
  //#endregion

  public filterSidebar() {
    this.filterFlag = !this.filterFlag;
  }

  public sendMessage() {
    this.message.icon = "icon-erroricon";
    this.message.title = "Stone Issue Info";
    this.message.categoryType = "Alert";
    this.message.description = "Stone Issue sent by " + this.fxCredentials.fullName;
    this.message.action = "ManualIssueModal";
    this.message.param = this.selectedInventoryItems.map(x => x.stoneId).join(',');
    this.message.senderId = JSON.parse(sessionStorage.getItem("userToken") ?? "").ident;
    this.message.receiverId = this.selectedEmpItems?.value ?? "";
    this.notificationService.messages.next(this.message)
  }
}