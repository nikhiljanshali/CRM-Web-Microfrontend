import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { DataResult, GroupDescriptor, process } from '@progress/kendo-data-query';
import { NgxSpinnerService } from 'ngx-spinner';
import { GridDetailConfig } from 'shared/businessobjects';
import { fxCredential, GridConfig, GridMasterConfig } from 'shared/enitites';
import { ConfigService, UtilityService } from 'shared/services';
import { AlertdialogService } from 'shared/views';
import { OrderSearchCriteria, OrderSearchResult } from '../../businessobjects';
import { EmployeeDNorm, LedgerDNorm, OrderItem } from '../../entities';
import { EmployeeService, GridPropertiesService, LedgerService, OrderService } from '../../services';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html'
})
export class OrderComponent implements OnInit {
  //#region Grid Data
  public groups: GroupDescriptor[] = [];
  public selectableSettings: SelectableSettings = { mode: 'single' };
  public mySelection: string[] = [];
  public gridView!: DataResult;
  public pageSize = 26;
  public skip = 0
  public fields!: GridDetailConfig[];
  public gridMasterConfigResponse!: GridMasterConfig;

  public isGridConfig: boolean = false;
  public gridConfig!: GridConfig;
  //#endregion

  //#region Objects | Arrays
  public fxCredentials!: fxCredential;
  public orderSearchCriteria: OrderSearchCriteria = new OrderSearchCriteria();
  public orderSearchResult: OrderSearchResult = new OrderSearchResult();
  public selectedOrderItems: OrderItem[] = [];

  public allOrderItems: OrderItem[] = [];
  public filterOrderItems: OrderItem[] = [];
  //#endregion

  //#region Modal Flags
  public filterFlag = true;
  //#endregion

  //#region Dropdown Data
  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains'
  };
  public listBrokerItems: Array<{ text: string; value: string }> = [];
  public brokerItems: LedgerDNorm[] = [];
  public listPartyItems: Array<{ text: string; value: string }> = [];
  public partyItems: LedgerDNorm[] = [];
  public listSellerItems: Array<{ text: string; value: string }> = [];
  public sellerItems: EmployeeDNorm[] = [];

  public selectedBroker!: { text: string; value: string };
  public selectedParty!: { text: string; value: string };
  public selectedSeller!: { text: string; value: string };
  //#endregion

  constructor(private router: Router,
    private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService,
    private utilityService: UtilityService,
    private gridPropertiesService: GridPropertiesService,
    private configService: ConfigService,
    private orderService: OrderService,
    private ledgerService: LedgerService,
    private employeeService: EmployeeService) { }

  public async ngOnInit() {
    this.defaultMethodsLoad();
  }

  //#region Default Method
  public async defaultMethodsLoad() {
    try {
      this.fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;
      if (this.fxCredentials == null || this.fxCredentials?.origin == null || (this.fxCredentials?.origin.toLowerCase() != 'accounts' && this.fxCredentials?.origin.toLowerCase() != 'admin')) {
        this.alertDialogService.show('You are not allow to see order detail!');
        this.router.navigate(["dashboard"]);
        return;
      }
      this.spinnerService.show();
      await this.getGridConfiguration();
      await this.loadBroker();
      await this.loadParty();
      await this.loadSeller();
      await this.initOrderData();
    }
    catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show('Something went wrong, Data not load!');
    }
  }
  //#endregion

  //#region Grid Config | On Change
  public async getGridConfiguration() {
    try {
      this.spinnerService.show();
      this.gridConfig = await this.configService.getGridConfig(this.fxCredentials?.id ?? '', "Order", "OrderGrid");
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
        this.gridMasterConfigResponse = await this.configService.getMasterGridConfig("Order", "OrderGrid");
        if (this.gridMasterConfigResponse)
          this.fields = this.gridMasterConfigResponse.gridDetail;
        else
          this.fields = await this.gridPropertiesService.getOrderItems();
      }
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.alertDialogService.show(error);
      this.spinnerService.hide();
    }
  }

  public onSelect(event: any): void {
    try {
      if (event.selectedRows && event.selectedRows.length > 0) {
        event.selectedRows.forEach((element: any) => {
          let Selectedindex = this.selectedOrderItems.findIndex(x => x.id == element.dataItem.id);
          if (Selectedindex < 0)
            this.selectedOrderItems.push(element.dataItem)
        });
      }
      else {
        event.deselectedRows.forEach((element: any) => {
          if (!element.dataItem.isDisabled) {
            let index = this.selectedOrderItems.findIndex(x => x.id == element.dataItem.id);
            if (index >= 0)
              this.selectedOrderItems.splice(index, 1)
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
      this.initOrderData();
    }
    catch (error: any) {
      this.alertDialogService.show(error.error)
    }
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.initOrderData();
  }

  public openGridConfigDialog(): void {
    this.isGridConfig = true;
  }

  public selectedRowChange(e: any) {
    // this.orderObj = e.selectedRows[0].dataItem
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

  public selectAllOrders(e: any) {
    this.selectedOrderItems = [];
    this.mySelection = [];
    if (e.toLowerCase() == 'checked') {
      // if (this.orderSearchResult.totalCount > this.pageSize)
      //   await this.loadAllOrders();
      // else
      //   this.mySelection = this.filterOrderItems.map(z => z.id);
    }
  }
  //#endregion

  //#region Init Data
  public async initOrderData() {
    try {
      this.spinnerService.show();
      let res = await this.orderService.getOrderItemsByCriteria(this.orderSearchCriteria, this.skip, this.pageSize);
      if (res) {
        this.orderSearchResult = JSON.parse(JSON.stringify(res));
        this.filterOrderItems = res.orderItems;
        this.gridView = process(res.orderItems, { group: this.groups });
        this.gridView.total = res.totalCount;

        this.spinnerService.hide();
      }
      else
        this.spinnerService.hide();
    }
    catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show('Data not load, Try gain later!');
    }
  }

  public async onFilterSubmit(form: NgForm) {
    if (form.valid) {
      await this.initOrderData();
    }
  }

  public async clearFilter(form: NgForm) {
    this.spinnerService.show();
    form.reset();
    this.skip = 0;
    this.orderSearchCriteria = new OrderSearchCriteria();
    await this.initOrderData();
  }

  public async loadBroker() {
    try {
      let ledgerType: string[] = ['Broker']
      let brokers = await this.ledgerService.getAllLedgersByType(ledgerType);
      for (let index = 0; index < brokers.length; index++) {
        const element = brokers[index];
        this.brokerItems.push({
          id: element.id,
          group: element.group.name,
          name: element.name,
          contactPerson: element.contactPerson,
          email: element.email,
          mobileNo: element.mobileNo,
          phoneNo: element.phoneNo,
          faxNo: element.faxNo,
          address: element.address,
        });
      }

      this.listBrokerItems = [];
      this.brokerItems.forEach(z => { this.listBrokerItems.push({ text: z.name, value: z.id }); });
    }
    catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show('Broker not load, Try gain later!');
    }
  }

  public async loadParty() {
    try {
      let ledgerType: string[] = ['Customer']
      let partys = await this.ledgerService.getAllLedgersByType(ledgerType);
      for (let index = 0; index < partys.length; index++) {
        const element = partys[index];
        this.partyItems.push({
          id: element.id,
          group: element.group.name,
          name: element.name,
          contactPerson: element.contactPerson,
          email: element.email,
          mobileNo: element.mobileNo,
          phoneNo: element.phoneNo,
          faxNo: element.faxNo,
          address: element.address,
        });
      }

      this.listPartyItems = [];
      this.partyItems.forEach(z => { this.listPartyItems.push({ text: z.name, value: z.id }); });
    }
    catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show('Party not load, Try gain later!');
    }
  }

  public async loadSeller() {
    try {
      let res = await this.employeeService.getAllEmployees();
      if (res) {
        let sellers = res.filter(z => z.origin == 'Seller');
        for (let index = 0; index < sellers.length; index++) {
          const element = sellers[index];
          this.sellerItems.push({
            id: element.id,
            name: element.fullName,
            email: element.email,
            department: element.department,
            departmentId: element.departmentId,
            organization: element.organization,
            branch: element.branch.name,
            mobile: element.mobile,
            address: element.address,
          });
        }
        this.sellerItems.forEach(z => { this.listSellerItems.push({ text: z.name, value: z.id }); });
      }
    }
    catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show('Seller not load, Try gain later!');
    }
  }
  //#endregion

  //#region OnChanges Functions
  public handlePartyFilter(value: any) {
    this.listPartyItems = [];
    let partyItems = this.partyItems.filter(z => z.name.toLowerCase().includes(value.toLowerCase()))
    partyItems.reverse().forEach(z => { this.listPartyItems.push({ text: z.name, value: z.id }); });
  }

  public handleBrokerFilter(value: any) {
    this.listBrokerItems = [];
    let brokerItems = this.brokerItems.filter(z => z.name.toLowerCase().includes(value.toLowerCase()))
    brokerItems.reverse().forEach(z => { this.listBrokerItems.push({ text: z.name, value: z.id }); });
  }
  //#endregion

  // public handleSellerFilter(value: any) {
  //   this.listSellerItems = [];
  //   let sellerItems = this.sellerItems.filter(z => z.name.toLowerCase().includes(value.toLowerCase()))
  //   sellerItems.reverse().forEach(z => { this.listSellerItems.push({ text: z.name, value: z.id }); });
  // }

}
