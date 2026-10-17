import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { PageChangeEvent, SelectableSettings} from '@progress/kendo-angular-grid';
import { DataResult, GroupDescriptor, SortDescriptor, State, process } from '@progress/kendo-data-query';
import { Broker, Customer, GridDetailConfig, Ordersearchcriteria, Party, Summary } from 'common/businessobjects';
import { fxCredential, GridConfig, GridMasterConfig, InclusionConfig, Logistic, MasterConfig, MasterDNorm, MeasurementConfig, Organization } from 'common/entities';
import { AppPreloadService, ConfigService, GridPropertiesService, StoneStatus, UtilityService, InventoryService, listGrainingItems, MasterConfigService, LogisticService, CommonService, OrganizationService, CustomerService, BrokerService, OrderService, PartyService, VolumeDiscountService, InvoiceService } from 'common/services';
import { AlertdialogService } from 'common/views';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Invoice, Bank, InvoiceDetail } from '../../businessobjects';
import { AccountingInformationService, PrintInvoiceFormat } from '../../services';

@Component({
  selector: 'app-order',
  templateUrl: './invoice.component.html',
  styles: [
  ]
})

export class InvoiceComponent implements OnInit {
  @ViewChild("gridContext") private gridContext: any;

  public pageSize = 26;
  public skip = 0
  public pageSizeDet = 10;
  public skipDet = 0;
  public fields!: GridDetailConfig[];
  public fieldsDet!: GridDetailConfig[];
  public fieldsInvoice!: GridDetailConfig[];
  public gridView!: DataResult;
  public gridDetailView!: DataResult;
  public gridViewInvoice!: DataResult;
  public isRegOrganization: boolean = false;
  public filterFlag = true;
  public selectableSettings: SelectableSettings = { mode: 'multiple', };
  public skeletonArray = new Array(18);
  public mySelection: string[] = [];
  public mySelectionDet: string[] = [];
  public sort!: SortDescriptor[];
  public groups: GroupDescriptor[] = [];
  public groupsDet: GroupDescriptor[] = [];
  public state: State = {};
  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  public invoices: Invoice[] = [];
  public invoiceItems: Invoice[] = [];
  public selectedinvoiceItems: Invoice[] = [];
  public selectedinvoiceItemsDet: Invoice[] = [];
  public invoiceModelItems: InvoiceDetail[] = [];
  public invoiceModelItem: Invoice = new Invoice;
  public printInvoiceItem: Invoice = new Invoice;
  public ordersearchcriteria: Ordersearchcriteria = new Ordersearchcriteria();

  public isGridConfig: boolean = false;
  public gridConfig!: GridConfig;
  public gridMasterConfigResponse!: GridMasterConfig;
  public isGridConfigDet: boolean = false;
  public gridConfigDet!: GridConfig;
  public gridMasterConfigResponseDet!: GridMasterConfig;
  public isGridConfigInvoice: boolean = false;
  public gridConfigInvoice!: GridConfig;
  public gridMasterConfigResponseInvoice!: GridMasterConfig;
  public allCustomer: string[] = [];
  public customerItems: Customer[] = [];
  public listCustomerItems: Array<{ name: string; isChecked: boolean }> = [];
  public bankItems: Bank[] = [];
  public logisticItems: Logistic[] = [];
  public allBroker: string[] = [];
  public brokerItems: Broker[] = [];
  public listBrokerItems: Array<{ name: string; isChecked: boolean }> = [];
  public filterCustomer: string = '';
  public filterCustomerChk: boolean = true;
  public filterBroker: string = '';
  public filterBrokerChk: boolean = true;
  public isSearchFilter: boolean = false;
  public masterConfigList!: MasterConfig;
  public allTheLab?: MasterDNorm[];
  public allTheShapes?: MasterDNorm[];
  public allColors?: MasterDNorm[];
  public allClarities?: MasterDNorm[];
  public allTheFluorescences?: MasterDNorm[];
  public allTheCPS?: MasterDNorm[];
  public inclusionData: MasterDNorm[] = [];
  public inclusionFlag: boolean = false;
  public inclusionConfig: InclusionConfig = new InclusionConfig();
  public measurementData: MasterDNorm[] = [];
  public measurementConfig: MeasurementConfig = new MeasurementConfig();
  public listStatus: Array<{ name: string; isChecked: boolean }> = [];
  public listKToS: Array<{ name: string; isChecked: boolean }> = [];
  public listCulet: Array<{ name: string; isChecked: boolean }> = [];
  public listLocation: Array<{ name: string; isChecked: boolean }> = [];
  public listGrainingItems = listGrainingItems;
  public listKapanItems: Array<{ name: string; isChecked: boolean }> = [];
  public listIGradeItems: Array<{ name: string; isChecked: boolean }> = [];
  public listMGradeItems: Array<{ name: string; isChecked: boolean }> = [];
  public firstCaratFrom?: number;
  public firstCaratTo?: number;
  public secondCaratFrom?: number;
  public secondCaratTo?: number;
  public thirdCaratFrom?: number;
  public thirdCaratTo?: number;
  public fourthCaratFrom?: number;
  public fourthCaratTo?: number;
  public errRation: string = "";
  public errTotalDepth: string = "";
  public errTable: string = "";
  public errGirdlePer: string = "";
  public errGirdle: string = "";
  public errPavAngle: string = "";
  public errPavDepth: string = "";
  public errCrnAngle: string = "";
  public errCrnHeight: string = "";
  public errDiaMinimum: string = "";
  public errDiaMaximum: string = "";
  public errArrivalDate: string = "";
  public errLength: string = "";
  public errWidth: string = "";
  public errDepth: string = "";
  public errHeight: string = "";
  public errDollarPerCt: string = "";
  public errNetAmount: string = "";
  public isBGM: boolean = false;
  public selectedCPS?: string;
  public fxCredentials?: fxCredential;
  public isOrderDetails: boolean = false;
  public InvoiceSummary: boolean = false;
  public clickedRowItem: Invoice = new Invoice;
  public isShowCheckBoxAll: boolean = true;
  public organizationId!: string;
  public orderDetailSummary: Summary = new Summary();
  public organizationData: Organization = new Organization();
  public allParty: string[] = [];
  public partyItems: Party[] = [];
  public listPartyItems: Array<{ name: string; isChecked: boolean }> = [];
  public filterParty: string = '';
  public filterPartyChk: boolean = true;
  public listInvoicePartyItems: Array<{ text: string; value: string }> = [];

  constructor(
    private inventoryService: InventoryService,
    private masterConfigService: MasterConfigService,
    private customerService: CustomerService,   
    private invoiceService: InvoiceService,
    private router: Router,
    private gridPropertiesService: GridPropertiesService,
    public utilityService: UtilityService,
    private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService,
    private configService: ConfigService,    
    private commonService: CommonService,    
    public volumeDiscountService: VolumeDiscountService,
    private organizationService: OrganizationService,
    private printInvoiceFormat: PrintInvoiceFormat,
    private partyService: PartyService,
  ) { }

  //#region Init Data
  async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  public async defaultMethodsLoad() {
    this.fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;
    this.ordersearchcriteria.organizationId = this.fxCredentials.organizationId;
    this.organizationId = this.fxCredentials.organizationId;
    this.organizationData = await this.organizationService.getOrganizationById(this.organizationId);
    if (!this.fxCredentials)
      this.router.navigate(["login"]);
    await this.getGridConfiguration();
    await this.getGridConfigurationDet();
    await this.load();
    await this.getMasterConfigData();
    await this.getData();
    this.utilityService.filterToggleSubject.subscribe(flag => {
      this.filterFlag = flag;
    });
  }

  public async getData() {
    try {
      this.partyItems = await this.partyService.getAllParties();
      this.listPartyItems = [];
      this.allParty = this.partyItems.map(z => z.name);
      this.partyItems.forEach(z => { this.listPartyItems.push({ name: z.name, isChecked: false }); });
      this.listInvoicePartyItems = [];
      this.partyItems.forEach(z => { this.listInvoicePartyItems.push({ text: z.name, value: z.id }); });
      this.customerItems = await this.customerService.getAllCustomers();
      this.listCustomerItems = [];
      this.allCustomer = this.customerItems.map(z => z.fullName);
      this.customerItems.forEach(z => { this.listCustomerItems.push({ name: z.fullName, isChecked: false }); });
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async getMasterConfigData() {
    Object.values(StoneStatus).forEach(z => { this.listStatus.push({ name: z.toString(), isChecked: false }); });

    this.masterConfigList = await this.masterConfigService.getAllMasterConfig();
    this.allTheShapes = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.shape);
    this.allColors = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.colors);
    this.allClarities = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.clarities);
    this.allTheFluorescences = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.fluorescence);
    this.allTheCPS = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.cps);
    this.allTheLab = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.lab);
    this.inclusionData = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.inclusions);
    this.inclusionConfig = this.masterConfigList.inclusionConfig;
    this.measurementData = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.measurements);
    this.measurementConfig = this.masterConfigList.measurementConfig;

    let allKTOS = this.inclusionData.filter(item => item.type.toLowerCase().indexOf('ktos') !== -1);
    allKTOS.forEach(z => { this.listKToS.push({ name: z.name, isChecked: false }); });

    let allCulet = this.inclusionData.filter(item => item.type.toLowerCase().indexOf('culet') !== -1);
    allCulet.forEach(z => { this.listCulet.push({ name: z.name, isChecked: false }); });

    let kapanItems = await this.inventoryService.getOrgKapanList(this.ordersearchcriteria.organizationId ?? '');
    kapanItems.forEach(z => { this.listKapanItems.push({ name: z, isChecked: false }); });

    let iGradeItems = await this.inventoryService.getOrgIGradeList(this.ordersearchcriteria.organizationId ?? '');
    iGradeItems.forEach(z => { this.listIGradeItems.push({ name: z, isChecked: false }); });

    let mGradeItems = await this.inventoryService.getOrgMGradeList(this.ordersearchcriteria.organizationId ?? '');
    mGradeItems.forEach(z => { this.listMGradeItems.push({ name: z, isChecked: false }); });

    this.getCountryData();
  }

  private async getCountryData() {
    try {
      var countryItems = await this.commonService.getCountries();
      if (countryItems) {
        countryItems.forEach(z => { this.listLocation.push({ name: z.name, isChecked: false }); });
      }
    }
    catch (error: any) {
      this.alertDialogService.show(error.error);
    }
  }
  //#endregion

  //#region Grid Config
  public async getGridConfiguration() {
    try {
      this.gridConfig = await this.configService.getGridConfig(this.fxCredentials?.id ?? '', "InvoiceAll", "InvoiceAllGrid");
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
        this.gridMasterConfigResponse = await this.configService.getMasterGridConfig("InvoiceAll", "InvoiceAllGrid");
        if (this.gridMasterConfigResponse)
          this.fields = this.gridMasterConfigResponse.gridDetail;
        else
          this.fields = await this.gridPropertiesService.getInvoiceAll();
      }
    } catch (error: any) {
      this.alertDialogService.show(error.error)
      this.spinnerService.hide();
    }
  }

  public groupChange(groups: GroupDescriptor[]): void {
    try {
      this.groups = groups;
      this.load();
    }
    catch (error: any) {
      this.alertDialogService.show(error.error)
    }
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.state.skip = this.skip;
    this.load();
  }

  public filterPartToggle() {
    this.utilityService.setfilterToggleValue(this.filterFlag);
  }

  public openGridConfigDialog(): void {
    this.isGridConfig = true;
  }

  public onSelect(event: any): void {
    try {
      if (event.selectedRows && event.selectedRows.length > 0) {
        event.selectedRows.forEach((element: any) => {
          let Selectedindex = this.selectedinvoiceItems.findIndex(x => x.invoiceNo == element.dataItem.invoiceNo);
          if (Selectedindex < 0) {
            this.selectedinvoiceItems.push(element.dataItem)
            this.clickedRowItem = new Invoice;
            this.clickedRowItem = element.dataItem;
          }
        });
      }
      else {
        event.deselectedRows.forEach((element: any) => {
          if (!element.dataItem.isDisabled) {
            let index = this.selectedinvoiceItems.findIndex(x => x.invoiceNo == element.dataItem.invoiceNo);
            if (index >= 0)
              this.selectedinvoiceItems.splice(index, 1)
          }
        });
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public cellClickHandler(e: any) { 
    this.clickedRowItem = new Invoice;
    this.clickedRowItem = e.dataItem;
  }

  public async setNewGridConfig(gridConfig: GridConfig) {
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

  //#region Search Filter Data
  public async load() {
    try {
      let res = await this.invoiceService.getInvoices(this.ordersearchcriteria, this.skip, this.pageSize);
      if (res) {
        this.invoiceItems = [];
        this.invoiceItems = res.invoices;
      }
    }
    catch (error: any) {
      this.alertDialogService.show(error.error)
      this.spinnerService.hide();
    }
  }

  public onFilterSubmit(form: NgForm) {
    this.skip = 0
    this.mySelection = [];

    let fData = this.ordersearchcriteria.from;
    this.ordersearchcriteria.from = fData ? this.setUTCDateFilter(fData) : null;
    let tData = this.ordersearchcriteria.to;
    this.ordersearchcriteria.to = tData ? this.setUTCDateFilter(tData) : null;

    this.load()
  }

  public async selectAllInventories(event: string) {
    this.mySelection = [];
    this.mySelection = this.invoiceItems.map(z => z.id);
  }

  private setUTCDateFilter(date: Date) {
    var newDate = moment(date.setHours(5)).toDate();
    newDate = moment(newDate.setMinutes(30)).toDate();
    return moment(newDate).toDate();
  }

  public clearFilter(form: NgForm) {
    this.mySelection = [];
    form.reset()
    this.ordersearchcriteria = new Ordersearchcriteria()
    this.load();
  }

  public openSearchDialog(): void {
    this.isSearchFilter = true;
    this.onMultiSelectChange(this.listLocation, this.ordersearchcriteria.location);
  }

  public closeSearchDialog(): void {
    this.isSearchFilter = false;
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

  public tagMapper(tags: string[]): void {
    // This function is used for hide selected items in multiselect box
  }

  public checkMinMaxValidation(min: any, max: any): string {
    if (min && max) {
      if (parseFloat(min) > parseFloat(max))
        return "min value must greater than max value!";
    }
    else if (min && !max)
      return "max value required!";
    else if (max && !min)
      return "min value required!";

    return '';
  }

  public checkCPS(type?: string) {
    if (type == 'BGM') {
      var NoMilkyData = this.inclusionData.filter(item => item.type.toLowerCase().indexOf('milky') !== -1).find(z => z.name.toLowerCase() == 'no');
      var checkMilky = this.ordersearchcriteria.milky.indexOf(NoMilkyData?.name ?? 'NO');

      var NoGreenData = this.inclusionData.filter(item => item.type.toLowerCase().indexOf('green') !== -1).find(z => z.name.toLowerCase() == 'no');
      var checkGreen = this.ordersearchcriteria.green.indexOf(NoGreenData?.name ?? 'NO');

      let BrownData = this.inclusionData.filter(item => item.type.toLowerCase().indexOf('brown') !== -1).find(z => z.name.toLowerCase() == 'no');
      var checkBrown = this.ordersearchcriteria.brown.indexOf(BrownData?.name ?? 'NO');

      if (checkMilky > -1 && checkGreen > -1 && checkBrown > -1)
        this.isBGM = true;
      else
        this.isBGM = false;
    }
    else {
      var ExData = this.allTheCPS?.find(z => z.name.toLowerCase() == 'ex');
      var VGData = this.allTheCPS?.find(z => z.name.toLowerCase() == 'vg');

      var checkCutEX = this.ordersearchcriteria.cut.indexOf(ExData?.name ?? 'EX');
      var checkPolishEX = this.ordersearchcriteria.polish.indexOf(ExData?.name ?? 'EX');
      var checkSymmEX = this.ordersearchcriteria.symm.indexOf(ExData?.name ?? 'EX');

      var checkCutVG = this.ordersearchcriteria.cut.indexOf(VGData?.name ?? 'VG');
      var checkPolishVG = this.ordersearchcriteria.polish.indexOf(VGData?.name ?? 'VG');
      var checkSymmVG = this.ordersearchcriteria.symm.indexOf(VGData?.name ?? 'VG');

      if (checkCutEX > -1 && checkPolishEX > -1 && checkSymmEX > -1 && checkCutVG > -1 && checkPolishVG > -1 && checkSymmVG > -1)
        this.selectedCPS = '3VG';
      else if (checkCutEX > -1 && checkPolishEX > -1 && checkSymmEX > -1)
        this.selectedCPS = '3EX';
      else if (checkCutEX > -1 && checkPolishEX > -1)
        this.selectedCPS = '2EX';
      else
        this.selectedCPS = 'Clear';
    }
  }

  public changeCPSData(type: string) {
    this.selectedCPS = type != 'BGM' ? type : this.selectedCPS;
    if (type == '3EX') {
      var ExData = this.allTheCPS?.find(z => z.name.toLowerCase() == 'ex');
      this.ordersearchcriteria.cut = [];
      this.ordersearchcriteria.cut.push(ExData?.name ?? 'EX');

      this.ordersearchcriteria.polish = [];
      this.ordersearchcriteria.polish.push(ExData?.name ?? 'EX');

      this.ordersearchcriteria.symm = [];
      this.ordersearchcriteria.symm.push(ExData?.name ?? 'EX');
    }
    else if (type == '2EX') {
      var ExData = this.allTheCPS?.find(z => z.name.toLowerCase() == 'ex');
      this.ordersearchcriteria.cut = [];
      this.ordersearchcriteria.cut.push(ExData?.name ?? 'EX');

      this.ordersearchcriteria.polish = [];
      this.ordersearchcriteria.polish.push(ExData?.name ?? 'EX');

      this.ordersearchcriteria.symm = [];
    }
    else if (type == '3VG') {
      var ExData = this.allTheCPS?.find(z => z.name.toLowerCase() == 'ex');
      var VGData = this.allTheCPS?.find(z => z.name.toLowerCase() == 'vg');

      this.ordersearchcriteria.cut = [];
      this.ordersearchcriteria.cut.push(ExData?.name ?? 'EX');
      this.ordersearchcriteria.cut.push(VGData?.name ?? 'VG');

      this.ordersearchcriteria.polish = [];
      this.ordersearchcriteria.polish.push(ExData?.name ?? 'EX');
      this.ordersearchcriteria.polish.push(VGData?.name ?? 'VG');

      this.ordersearchcriteria.symm = [];
      this.ordersearchcriteria.symm.push(ExData?.name ?? 'EX');
      this.ordersearchcriteria.symm.push(VGData?.name ?? 'VG');
    }
    else if (type == 'Clear') {
      this.ordersearchcriteria.cut = [];
      this.ordersearchcriteria.polish = [];
      this.ordersearchcriteria.symm = [];
    }
    else if (type == 'BGM') {
      if (this.isBGM) {
        this.ordersearchcriteria.green = [];
        this.ordersearchcriteria.brown = [];
        this.ordersearchcriteria.milky = [];
        this.isBGM = false;
      }
      else {
        this.isBGM = true;

        const inclusions = [...this.inclusionData];
        let BrownData = inclusions.filter(item => item.type.toLowerCase().indexOf('brown') !== -1);
        var NoBrownData = BrownData.find(z => z.name.toLowerCase() == 'no');
        this.ordersearchcriteria.brown = [];
        this.ordersearchcriteria.brown.push(NoBrownData?.name ?? 'NO');

        var NoGreenData = inclusions.filter(item => item.type.toLowerCase().indexOf('green') !== -1).find(z => z.name.toLowerCase() == 'no');
        this.ordersearchcriteria.green = [];
        this.ordersearchcriteria.green.push(NoGreenData?.name ?? 'NO');

        var NoMilkyData = inclusions.filter(item => item.type.toLowerCase().indexOf('milky') !== -1).find(z => z.name.toLowerCase() == 'no');
        this.ordersearchcriteria.milky = [];
        this.ordersearchcriteria.milky.push(NoMilkyData?.name ?? 'NO');
      }
    }
  }

  public addRemoveStringInArrayFilter(a: string[], b: string) {
    if (b == 'All') {
      let c = [...a];
      c.forEach(z => { a.splice(0, 1); });
      return;
    }
    if (a.indexOf(b) == -1)
      a.push(b);
    else {
      let index = a.findIndex(x => x == b);
      if (index >= 0)
        a.splice(index, 1)
    }
  }

  public filterBySearch(): void {
    this.skip = 0;
    this.mySelection = [];
    this.assignAdditionalData();
    this.load();
    this.isSearchFilter = false;
  }

  public assignAdditionalData(): void {
    let carat = null;
    carat = this.firstCaratFrom ? (this.firstCaratTo ? this.firstCaratFrom + "-" + this.firstCaratTo : "") : "";
    carat += this.secondCaratFrom ? (this.secondCaratTo ? "," + this.secondCaratFrom + "-" + this.secondCaratTo : "") : "";
    carat += this.thirdCaratFrom ? (this.thirdCaratTo ? "," + this.thirdCaratFrom + "-" + this.thirdCaratTo : "") : "";
    carat += this.fourthCaratFrom ? (this.fourthCaratTo ? "," + this.fourthCaratFrom + "-" + this.fourthCaratTo : "") : "";
    this.ordersearchcriteria.carat = carat ? carat : undefined;

    let fData = this.ordersearchcriteria.fromDate;
    this.ordersearchcriteria.fromDate = fData ? this.utilityService.setUTCDateFilter(fData) : null;

    let tData = this.ordersearchcriteria.toDate;
    this.ordersearchcriteria.toDate = tData ? this.utilityService.setUTCDateFilter(tData) : null;
  }

  public clearSearchCriteria(): void {
    this.ordersearchcriteria = new Ordersearchcriteria();
    this.ordersearchcriteria.organizationId = this.fxCredentials?.organizationId ?? '';
    this.listStatus.forEach(z => { z.isChecked = false });
    this.listLocation.forEach(z => { z.isChecked = false });
    this.listKToS.forEach(z => { z.isChecked = false });
    this.listCulet.forEach(z => { z.isChecked = false });

    this.firstCaratFrom = undefined;
    this.firstCaratTo = undefined;
    this.secondCaratFrom = undefined;
    this.secondCaratTo = undefined;
    this.thirdCaratFrom = undefined;
    this.thirdCaratTo = undefined;
    this.fourthCaratFrom = undefined;
    this.fourthCaratTo = undefined;
  }
  //#endregion

  //#region Detail Dialog
  public async openOrderDetailsDialog() {
    if (this.clickedRowItem != null && this.clickedRowItem.id) {
      let res = await this.invoiceService.getInvoiceNo(this.clickedRowItem.invoiceNo);
      if (res)
        this.invoiceModelItem = res.invoices[0];

      if (this.invoiceModelItem) {
        this.calculateSummary(this.invoiceModelItem.invoiceItems);
        this.gridDetailView = process(this.invoiceModelItem.invoiceItems, { group: this.groupsDet });
        this.gridDetailView.total = this.invoiceModelItems.length;
        this.isOrderDetails = true;
      }
    }
  }

  public async calculateSummary(invoiceItem: InvoiceDetail[]) {
    this.orderDetailSummary = new Summary();
    this.orderDetailSummary.totalCarat = invoiceItem.reduce((acc, cur) => acc + cur.inventoryItem.weight, 0);
    this.orderDetailSummary.totalAmount = invoiceItem.reduce((acc, cur) => acc + (cur.inventoryItem.price.netAmount ? cur.inventoryItem.price.netAmount : 0), 0);
    this.orderDetailSummary.totalRAP = invoiceItem.reduce((acc, cur) => acc + ((cur.inventoryItem.price.rap ?? 0) * (cur.inventoryItem.weight)), 0) ?? 0;

    let rapCount = invoiceItem.reduce((acc, cur) => acc + (cur.inventoryItem.price.rap ?? 0), 0);

    this.orderDetailSummary.totalPcs = invoiceItem.length;
    this.orderDetailSummary.avgRap = rapCount / this.orderDetailSummary.totalPcs;
    this.orderDetailSummary.avgDiscPer = (((this.orderDetailSummary.totalAmount / this.orderDetailSummary.totalRAP) * 100) - 100);
    this.orderDetailSummary.perCarat = this.orderDetailSummary.totalAmount / this.orderDetailSummary.totalCarat;

    this.orderDetailSummary.totalVOWDiscPer = invoiceItem[0].sDiscount ?? 0;
    this.orderDetailSummary.totalVOWDiscPer += invoiceItem[0].ngDiscount ?? 0;

    this.orderDetailSummary.totalVOWDiscAmount = (this.orderDetailSummary.totalAmount * this.orderDetailSummary.totalVOWDiscPer) / 100;
    this.orderDetailSummary.totalPayableAmount = this.orderDetailSummary.totalAmount - this.orderDetailSummary.totalVOWDiscAmount;
    this.orderDetailSummary.discPer = this.orderDetailSummary.totalPayableAmount / this.orderDetailSummary.totalRAP * 100 - 100;
    this.orderDetailSummary.pricePerCarat = this.orderDetailSummary.avgRap + (this.orderDetailSummary.avgRap * this.orderDetailSummary.discPer / 100);
  }

  public closeInvoiceDetailsDialog(): void {
    this.isOrderDetails = false;
    this.clickedRowItem = new Invoice;
    this.mySelection = [];
  }
  //#region Detail Dialog

  //#region Detail Grid Config
  public openGridConfigDialogDet(): void {
    this.isGridConfigDet = true;
  }

  public onSelectDet(event: any): void {
    try {
      if (event.selectedRows && event.selectedRows.length > 0) {
        event.selectedRows.forEach((element: any) => {
          let Selectedindex = this.selectedinvoiceItemsDet.findIndex(x => x.invoiceNo == element.dataItem.invoiceNo);
          if (Selectedindex < 0)
            this.selectedinvoiceItemsDet.push(element.dataItem)
        });
      }
      else {
        event.deselectedRows.forEach((element: any) => {
          if (!element.dataItem.isDisabled) {
            let index = this.selectedinvoiceItemsDet.findIndex(x => x.invoiceNo == element.dataItem.invoiceNo);
            if (index >= 0)
              this.selectedinvoiceItemsDet.splice(index, 1)
          }
        });
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async getGridConfigurationDet() {
    try {
      this.gridConfigDet = await this.configService.getGridConfig(this.fxCredentials?.id ?? '', "InvoiceAllDet", "InvoiceAllGridDet");
      if (this.gridConfigDet && this.gridConfigDet.id != '') {
        let dbObj: GridDetailConfig[] = this.gridConfigDet.gridDetail;
        if (dbObj && dbObj.some(c => c.isSelected)) {
          this.fieldsDet = dbObj;
          this.fieldsDet.sort((n1, n2) => n1.sortOrder - n2.sortOrder);
        }
        else
          this.fieldsDet.forEach(c => c.isSelected = true);
      }
      else {
        this.gridMasterConfigResponseDet = await this.configService.getMasterGridConfig("InvoiceAllDet", "InvoiceAllGridDet");
        if (this.gridMasterConfigResponseDet)
          this.fieldsDet = this.gridMasterConfigResponseDet.gridDetail;
        else
          this.fieldsDet = await this.gridPropertiesService.getInvoiceItems();
      }
    } catch (error: any) {
      this.alertDialogService.show(error.error)
      this.spinnerService.hide();
    }
  }

  public async setNewGridConfigDet(gridConfigDet: GridConfig) {
    if (gridConfigDet) {
      this.fieldsDet = gridConfigDet.gridDetail;
      this.gridConfigDet = new GridConfig();
      this.gridConfigDet.id = gridConfigDet.id
      this.gridConfigDet.gridDetail = gridConfigDet.gridDetail;
      this.gridConfigDet.gridName = gridConfigDet.gridName;
      this.gridConfigDet.pageName = gridConfigDet.pageName;
      this.gridConfigDet.empID = gridConfigDet.empID;
    }
  }
  //#endregion

  public async invoiceGet(InvNo: string) {
    try {
      this.spinnerService.show();
      this.printInvoiceItem = new Invoice()

      let res = await this.invoiceService.getInvoiceNo(InvNo);
      if (res)
        this.printInvoiceItem = res.invoices[0];

      if (this.printInvoiceItem && this.printInvoiceItem.invoiceItems.length > 0) {
        let printStone: HTMLIFrameElement = document.createElement("iframe");
        printStone.name = "print_detail";
        printStone.style.position = "absolute";
        printStone.style.top = "-1000000px";
        document.body.appendChild(printStone);
        printStone?.contentWindow?.document.open();
        printStone?.contentWindow?.document.write(`<html><head>
              <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <link rel="stylesheet" type="text/css" href="commonAssets/css/printinvoice.css" media="print" />
              </head>`);
        let printContents: string;
        printContents = this.printInvoiceFormat.getInvoice(this.printInvoiceItem);
        printStone?.contentWindow?.document.write(printContents);
        printStone?.contentWindow?.document.close();
      }
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

}