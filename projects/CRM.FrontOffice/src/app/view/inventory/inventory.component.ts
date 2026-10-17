import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { Align } from '@progress/kendo-angular-popup';
import { DataResult, GroupDescriptor, process } from '@progress/kendo-data-query';
import { GirdleDNorm, GradeSearchItems, GridDetailConfig, InclusionPrice, MeasItems, MfgInclusionData, MfgMeasurementData, MfgPricingRequest } from 'shared/businessobjects';
import { TypeFilterPipe } from 'shared/directives/typefilter.pipe';
import { GridConfig, GridMasterConfig, InclusionConfig, MasterConfig, MasterDNorm, MeasurementConfig } from 'shared/enitites';
import { MeasureGradeService, PricingService, CommonService, ConfigService, listGrainingItems, FrontStoneStatus, UtilityService } from 'shared/services';
import { AlertdialogService } from 'shared/views';
import { environment } from 'environments/environment';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { fxCredential, InventoryItems, PriceDNorm, Supplier, SupplierDNorm, SystemUser, SystemUserDNorm } from '../../entities';
import { ExportToExcelMailData, InventorySearchCriteria, InventorySearchResponse, InventorySelectAllItems, StoneProposalMailData, UpdateHoldReleaseInventory } from '../../businessobjects';
import { GridPropertiesService, InventoryService, MasterConfigService, StoneProposalService, SupplierApiRequestService, SupplierService, SystemUserService } from '../../services';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styles: [
  ]
})
export class InventoryComponent implements OnInit {
  //#region Grid Init
  public groups: GroupDescriptor[] = [];
  public pageSize = 26;
  public skip = 0;
  public fields!: GridDetailConfig[];
  public gridView?: DataResult;
  public isRegSystemUser: boolean = false;
  public filterFlag = true;
  public selectableSettings: SelectableSettings = {
    mode: 'multiple',
  };
  public skeletonArray = new Array(18);
  public mySelection: string[] = [];
  public isShowCheckBoxAll: boolean = true;
  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  //#endregion

  //#region Grid Config
  public isGridConfig: boolean = false;
  public gridConfig!: GridConfig;
  public gridMasterConfigResponse!: GridMasterConfig;
  //#endregion

  //#region List & Objects
  public inventoryObj: InventoryItems = new InventoryItems();
  public invResponse: InventorySearchResponse = new InventorySearchResponse();

  public supplierDNormItems!: SupplierDNorm[];
  public selectedSupplierDNormItems?: { text: string, value: string };
  public systemUserItems!: SystemUser[];
  public selectedEmpItems?: { text: string, value: string };
  public selectedCustomer?: { text: string, value: string };
  public selectedCPS?: string;
  public isBGM: boolean = false;

  public listSupplierDNormItems: Array<{ text: string; value: string }> = [];
  public listBranchDNormItems: Array<{ text: string; value: string }> = [];
  public listDepartmentItems: Array<{ text: string; value: string }> = [];
  public listEmpItems: Array<{ text: string; value: string }> = [];

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

  public inventoryItems: InventoryItems[] = [];
  public allInventoryItems: InventorySelectAllItems[] = [];
  public inventorySearchCriteriaObj: InventorySearchCriteria = new InventorySearchCriteria();
  public tempInventorySearchCriteriaObj: InventorySearchCriteria = new InventorySearchCriteria();
  public fxCredentials?: fxCredential;

  public exportToExcelMailObj: ExportToExcelMailData = new ExportToExcelMailData();
  public stoneProposalMail: StoneProposalMailData = new StoneProposalMailData();
  // public customer: Customer[] = [];
  public listCustomer: Array<{ text: string; value: string }> = [];

  public suppliers: Supplier[] = [];
  //#endregion

  //#region Model Flag
  public isEditInventory: boolean = false;
  public isSearchFilter: boolean = false;
  public isShowMedia: boolean = false;
  public isFormValid: boolean = false;
  public showExcelOption = false;
  public isSendMail = false;
  public isSendProposal = false;

  public isAdminRole = false;

  @ViewChild("anchor") public anchor!: ElementRef;
  @ViewChild("popup", { read: ElementRef }) public popup!: ElementRef;
  //#endregion

  //#region Custom Models
  public mediaTitle!: string
  public mediaSrc!: string
  public mediaType!: string

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

  public excelOption!: string | null;

  public anchorAlign: Align = { horizontal: "right", vertical: "bottom" };
  public popupAlign: Align = { horizontal: "center", vertical: "top" };

  public excelFile: any[] = [];
  //#endregion

  constructor(private inventoryService: InventoryService,
    private alertDialogService: AlertdialogService,
    public utilityService: UtilityService,
    private masterConfigService: MasterConfigService,
    private supplierService: SupplierService,
    private spinnerService: NgxSpinnerService,
    private systemUserService: SystemUserService,
    private gridPropertiesService: GridPropertiesService,
    private configService: ConfigService,
    private sanitizer: DomSanitizer,
    private pricingService: PricingService,
    private changeDetRef: ChangeDetectorRef,
    private measureGradeService: MeasureGradeService,
    private stoneProposalService: StoneProposalService,
    private commonService: CommonService,
    private supplierApiRequestService: SupplierApiRequestService
    //private customerService: CustomerService
  ) { }

  public async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  //#region Init Data
  public async defaultMethodsLoad() {
    this.fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;
    if (this.fxCredentials?.origin == 'Admin')
      this.isAdminRole = true;
    // this.inventorySearchCriteriaObj.status.push(StoneStatus.Stock.toString());

    await this.getGridConfiguration();
    await this.initInventoryData();
    await this.getMasterConfigData();
    await this.getSupplierDNormData();
    await this.getSupplierDetail();
    await this.getSystemUserData();
  }

  public async getGridConfiguration() {
    try {
      this.spinnerService.show();
      this.gridConfig = await this.configService.getGridConfig(this.fxCredentials?.id ?? '', "Inventory", "InventoryGrid");
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
        this.gridMasterConfigResponse = await this.configService.getMasterGridConfig("Inventory", "InventoryGrid");
        if (this.gridMasterConfigResponse)
          this.fields = this.gridMasterConfigResponse.gridDetail;
        else
          this.fields = await this.gridPropertiesService.getInventoryGrid();
      }
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.alertDialogService.show(error);
      this.spinnerService.hide();
    }
  }
  //#endregion

  //#region Inv Search Filter Data
  public async initInventoryData() {
    try {
      this.spinnerService.show();
      let res = await this.inventoryService.getInventoryItemsBySearch(this.inventorySearchCriteriaObj, this.skip, this.pageSize);
      if (res) {
        this.invResponse = JSON.parse(JSON.stringify(res));
        this.inventoryItems = res.inventories;
        this.inventoryItems.forEach(z => {
          let index = this.allInventoryItems.findIndex(a => a.stoneId == z.stoneId);
          if (index == -1)
            this.allInventoryItems.push({ id: z.id, stoneId: z.stoneId, status: z.status });
        });
        this.gridView = process(res.inventories, { group: this.groups });
        this.gridView.total = res.totalCount;

        this.spinnerService.hide();
      }
      else
        this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async getCustomerData() {
    try {
      // let customer = await this.customerService.getAllCustomers();
      // if (customer) {
      //   this.customer = customer;
      //   this.customer.forEach((z) => { this.listCustomer.push({ text: z.fullName + ' | ' + z.email, value: z.id }); });
      // }

    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show('Something went wrong on get customer, Try again later.');
    }
  }

  public async getSupplierDetail() {
    try {
      this.suppliers = await this.supplierService.getAllSuppliers();
    }
    catch (error: any) {
      this.spinnerService.hide();
      console.error(error);
    }
  }
  //#endregion

  //#region Org, Emp Data
  private async getSupplierDNormData() {
    try {
      this.supplierDNormItems = await this.supplierService.getSupplierDNorm();

      // this.fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;
      // let supplierId = this.fxCredentials.supplierId;
      // let supplier = this.supplierDNormItems.find(z => z.id == supplierId) ?? new SupplierDNorm();

      // this.supplierDNormItems = [{ ...supplier }];

      // supplier = this.supplierDNormItems[0];
      // this.selectedSupplierDNormItems = { text: supplier.name, value: supplier.id };
      // this.listSupplierDNormItems.push(this.selectedSupplierDNormItems);

      // await this.onSupplierDNormChange(this.selectedSupplierDNormItems);
    }
    catch (error: any) {
      console.error(error);
      this.alertDialogService.show(error.error);
    }
  }

  public async onSupplierDNormChange(e: any, isEdit: boolean = false) {
    const orgDNorm = this.supplierDNormItems.find(z => z.id == e.value);
    if (orgDNorm != undefined && orgDNorm != null)
      this.inventorySearchCriteriaObj.organizationId = orgDNorm.id;
  }


  public async getSystemUserData() {
    this.systemUserItems = await this.systemUserService.getAllSystemUsers();
    this.systemUserItems.forEach((z) => { this.listEmpItems.push({ text: z.fullName, value: z.id }); });
  }

  public onCustomerChange(e: any) {
    // const customer = this.customer.find(z => z.id == e.value);
    // if (customer != undefined && customer != null) {
    //   let cust = new CustomerDNorm();
    //   cust.id = customer.id;
    //   cust.name = customer.fullName;
    //   cust.email = customer.email;
    //   cust.mobile = customer.mobile1;
    //   this.stoneProposalMail.cutomer = cust;
    // }
  }
  //#endregion

  //#region Master Config Data
  public async getMasterConfigData() {
    //Status
    Object.values(FrontStoneStatus).forEach(z => { this.listStatus.push({ name: z.toString(), isChecked: false }); });
    this.onMultiSelectChange(this.listStatus, this.inventorySearchCriteriaObj.status);

    //Master Config
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

    let kapanItems = await this.inventoryService.getOrgKapanList();
    kapanItems.forEach(z => { this.listKapanItems.push({ name: z, isChecked: false }); });

    let iGradeItems = await this.inventoryService.getOrgIGradeList();
    iGradeItems.forEach(z => { this.listIGradeItems.push({ name: z, isChecked: false }); });

    let mGradeItems = await this.inventoryService.getOrgMGradeList();
    mGradeItems.forEach(z => { this.listMGradeItems.push({ name: z, isChecked: false }); });

    this.getCountryData();
  }

  private async getCountryData() {
    try {
      var countryItems = await this.commonService.getCountries();
      if (countryItems)
        countryItems.forEach(z => { this.listLocation.push({ name: z.name, isChecked: false }); });
    }
    catch (error: any) {
      this.alertDialogService.show(error.error);
    }
  }
  //#endregion

  //#region On Change Functions
  public calculateDept(target: InventoryItems): void {
    if (target.measurement.height && (target.measurement.length || target.measurement.width)) {
      target.measurement.length = parseFloat(target.measurement.length?.toString() ?? '');
      target.measurement.width = parseFloat(target.measurement.width?.toString() ?? '');
      target.measurement.height = parseFloat(target.measurement.height?.toString() ?? '');
      if (target.shape?.toLowerCase() == 'round')
        target.measurement.depth = ((target.measurement.height ?? 0) / (target.measurement.length ?? 0)) * 100;
      else if (target.shape?.toLowerCase() == 'heart') {
        let val = (target.measurement.length ?? 0);
        if ((target.measurement.length ?? 0) < (target.measurement.width ?? 0))
          val = (target.measurement.width ?? 0);
        target.measurement.depth = ((target.measurement.height ?? 0) / val) * 100;
      }
      else {
        let val = (target.measurement.length ?? 0);
        if ((target.measurement.length ?? 0) > (target.measurement.width ?? 0))
          val = (target.measurement.width ?? 0);
        target.measurement.depth = ((target.measurement.height ?? 0) / val) * 100;
      }
      if (target.measurement.depth == Infinity || target.measurement.depth == 0)
        target.measurement.depth = null as any;
      else
        target.measurement.depth = this.utilityService.ConvertToFloatWithTwoDecimal(target.measurement.depth ?? 0);
    }
    else
      target.measurement.depth = null as any;
  }

  public mappingPricingRequestData(item: InventoryItems): MfgPricingRequest {
    let mesurement = new MfgMeasurementData();
    mesurement.TblDepth = item.measurement.depth;
    mesurement.TblAng = item.measurement.table;
    mesurement.Length = item.measurement.length;
    mesurement.Width = item.measurement.width;
    mesurement.Height = item.measurement.height;
    mesurement.CrHeight = item.measurement.crownHeight;
    mesurement.CrAngle = item.measurement.crownAngle;
    mesurement.PvlDepth = item.measurement.pavilionDepth;
    mesurement.PvlAngle = item.measurement.pavilionAngle;
    mesurement.StarLength = 0;
    mesurement.LowerHalf = 0;
    mesurement.GirdlePer = item.measurement.girdlePer;
    mesurement.MinGirdle = item.measurement.minGirdle;
    mesurement.MaxGirdle = item.measurement.maxGirdle;
    mesurement.Ratio = item.measurement.ratio;

    let req: MfgPricingRequest = {
      Lab: (item.lab && item.lab.length > 0) ? item.lab.toUpperCase() : "GIA",
      Rapver: "NONE",
      Id: item.stoneId,
      Shape: item.shape?.toUpperCase(),
      Weight: item.weight,
      Color: (item.color?.toUpperCase() == "O" || item.color?.toUpperCase() == "P") ? "M" : item.color?.toUpperCase(),
      Clarity: item.clarity?.toUpperCase(),
      Cut: item.cut?.toUpperCase(),
      Polish: item.polish?.toUpperCase(),
      Symmetry: item.symmetry?.toUpperCase(),
      Flour: item.fluorescence?.toUpperCase(),
      InclusionPrice: new MfgInclusionData(),
      MeasurePrice: mesurement
    };

    return req;
  }

  public async onChangePricing() {
    try {
      if (this.inventoryObj.weight <= 0)
        return

      let reqList: MfgPricingRequest[] = [];
      reqList.push(this.mappingPricingRequestData(this.inventoryObj));

      this.spinnerService.show();
      let response = await this.pricingService.getBasePrice(reqList);
      if (response && response.length > 0) {
        let target = response.find(a => a.Id == this.inventoryObj.stoneId);
        if (target && target.Error == null) {
          target = this.utilityService.setAmtForPricingDiscountResponse(target, this.inventoryObj.weight);
          this.inventoryObj.basePrice.rap = target.RapPrice;
          this.inventoryObj.basePrice.discount = target.Discount;
          this.inventoryObj.basePrice.netAmount = target.Amount;
          this.inventoryObj.basePrice.perCarat = target.DCaret;
          this.spinnerService.hide();
        }
        else {
          this.spinnerService.hide();
          this.inventoryObj.basePrice = new PriceDNorm();
          if (target && target.RapPrice != null && target.RapPrice > 0)
            this.inventoryObj.basePrice.rap = target.RapPrice;
          this.utilityService.showNotification(`Discount not found!`, 'warning');
        }
      }
      else {
        this.spinnerService.hide();
        this.inventoryObj.basePrice = new PriceDNorm();
        this.utilityService.showNotification(`Price not found!`, 'warning');
      }
      this.checkRequiredFields();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.inventoryObj.basePrice = new PriceDNorm();
      this.checkRequiredFields();
      this.alertDialogService.show(error.error);
    }
  }

  public onChangeLab(): void {
    if (this.inventoryObj.lab == 'NC' && (this.inventoryObj.price.rap == null || this.inventoryObj.price.discount == null || this.inventoryObj.price.netAmount == null || this.inventoryObj.price.perCarat == null)) {
      this.alertDialogService.ConfirmYesNo("Price data not available, Are you sure you want to add as pricing request?", "Non Certified Lab")
        .subscribe(async (res: any) => {
          if (!res.flag) {
            this.inventoryObj.lab = this.inventoryItems.find(z => z.id == this.inventoryObj.id)?.lab ?? null as any;
          }
        });
    }
  }

  public tagMapper(tags: string[]): void {
    // This function is used for hide selected items in multiselect box
  }

  public selectedRowChange(e: any) {
    this.inventoryObj = new InventoryItems();
    if (this.mySelection != null && this.mySelection.length > 0) {
      var selectedInv = this.inventoryItems.find(z => z.id == this.mySelection[0]);
      let value: InventoryItems = JSON.parse(JSON.stringify(selectedInv));
      value.labSendDate = this.getValidDate(value.labSendDate);
      value.labReceiveDate = this.getValidDate(value.labReceiveDate);
      value.marketSheetDate = this.getValidDate(value.marketSheetDate);
      this.inventoryObj = { ...value };
    }
  }

  public getValidDate(date: any): Date | null {
    if (date != null) {
      const day = moment(date).date();
      const month = moment(date).month();
      const year = moment(date).year();
      var newDate = new Date(year, month, day);
      return newDate;
    }
    return date;
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

  public groupChange(groups: GroupDescriptor[]): void {
    try {
      this.groups = groups;
      this.initInventoryData();
    }
    catch (error: any) {
      this.alertDialogService.show(error.error);
    }
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.initInventoryData();
  }

  public calculateRapPricing() {
    let rap = this.inventoryObj.basePrice.rap;
    let disc = this.inventoryObj.basePrice.discount;
    if (rap && disc) {
      if (disc.toString() != '-') {

        disc = parseFloat(disc.toString());
        let weight = this.inventoryObj.weight;
        let stoneRap = weight * rap;
        let calDiscount = 100 + disc;
        let netAmount = (calDiscount * stoneRap) / 100;

        this.inventoryObj.basePrice.netAmount = this.utilityService.ConvertToFloatWithTwoDecimal(netAmount);
        let perCarat = netAmount / weight;
        this.inventoryObj.basePrice.perCarat = this.utilityService.ConvertToFloatWithTwoDecimal(perCarat);
      }
    }
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
      var checkMilky = this.inventorySearchCriteriaObj.milky.indexOf(NoMilkyData?.name ?? 'NO');

      var NoGreenData = this.inclusionData.filter(item => item.type.toLowerCase().indexOf('green') !== -1).find(z => z.name.toLowerCase() == 'no');
      var checkGreen = this.inventorySearchCriteriaObj.green.indexOf(NoGreenData?.name ?? 'NO');

      let BrownData = this.inclusionData.filter(item => item.type.toLowerCase().indexOf('brown') !== -1).find(z => z.name.toLowerCase() == 'no');
      var checkBrown = this.inventorySearchCriteriaObj.brown.indexOf(BrownData?.name ?? 'NO');

      if (checkMilky > -1 && checkGreen > -1 && checkBrown > -1)
        this.isBGM = true;
      else
        this.isBGM = false;
    }
    else {
      var ExData = this.allTheCPS?.find(z => z.name.toLowerCase() == 'ex');
      var VGData = this.allTheCPS?.find(z => z.name.toLowerCase() == 'vg');

      var checkCutEX = this.inventorySearchCriteriaObj.cut.indexOf(ExData?.name ?? 'EX');
      var checkPolishEX = this.inventorySearchCriteriaObj.polish.indexOf(ExData?.name ?? 'EX');
      var checkSymmEX = this.inventorySearchCriteriaObj.symm.indexOf(ExData?.name ?? 'EX');

      var checkCutVG = this.inventorySearchCriteriaObj.cut.indexOf(VGData?.name ?? 'VG');
      var checkPolishVG = this.inventorySearchCriteriaObj.polish.indexOf(VGData?.name ?? 'VG');
      var checkSymmVG = this.inventorySearchCriteriaObj.symm.indexOf(VGData?.name ?? 'VG');

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
      this.inventorySearchCriteriaObj.cut = [];
      this.inventorySearchCriteriaObj.cut.push(ExData?.name ?? 'EX');

      this.inventorySearchCriteriaObj.polish = [];
      this.inventorySearchCriteriaObj.polish.push(ExData?.name ?? 'EX');

      this.inventorySearchCriteriaObj.symm = [];
      this.inventorySearchCriteriaObj.symm.push(ExData?.name ?? 'EX');
    }
    else if (type == '2EX') {
      var ExData = this.allTheCPS?.find(z => z.name.toLowerCase() == 'ex');
      this.inventorySearchCriteriaObj.cut = [];
      this.inventorySearchCriteriaObj.cut.push(ExData?.name ?? 'EX');

      this.inventorySearchCriteriaObj.polish = [];
      this.inventorySearchCriteriaObj.polish.push(ExData?.name ?? 'EX');

      this.inventorySearchCriteriaObj.symm = [];
    }
    else if (type == '3VG') {
      var ExData = this.allTheCPS?.find(z => z.name.toLowerCase() == 'ex');
      var VGData = this.allTheCPS?.find(z => z.name.toLowerCase() == 'vg');

      this.inventorySearchCriteriaObj.cut = [];
      this.inventorySearchCriteriaObj.cut.push(ExData?.name ?? 'EX');
      this.inventorySearchCriteriaObj.cut.push(VGData?.name ?? 'VG');

      this.inventorySearchCriteriaObj.polish = [];
      this.inventorySearchCriteriaObj.polish.push(ExData?.name ?? 'EX');
      this.inventorySearchCriteriaObj.polish.push(VGData?.name ?? 'VG');

      this.inventorySearchCriteriaObj.symm = [];
      this.inventorySearchCriteriaObj.symm.push(ExData?.name ?? 'EX');
      this.inventorySearchCriteriaObj.symm.push(VGData?.name ?? 'VG');
    }
    else if (type == 'Clear') {
      this.inventorySearchCriteriaObj.cut = [];
      this.inventorySearchCriteriaObj.polish = [];
      this.inventorySearchCriteriaObj.symm = [];
    }
    else if (type == 'BGM') {
      if (this.isBGM) {
        this.inventorySearchCriteriaObj.green = [];
        this.inventorySearchCriteriaObj.brown = [];
        this.inventorySearchCriteriaObj.milky = [];
        this.isBGM = false;
      }
      else {
        this.isBGM = true;

        const inclusions = [...this.inclusionData];
        let BrownData = inclusions.filter(item => item.type.toLowerCase().indexOf('brown') !== -1);
        var NoBrownData = BrownData.find(z => z.name.toLowerCase() == 'no');
        this.inventorySearchCriteriaObj.brown = [];
        this.inventorySearchCriteriaObj.brown.push(NoBrownData?.name ?? 'NO');

        var NoGreenData = inclusions.filter(item => item.type.toLowerCase().indexOf('green') !== -1).find(z => z.name.toLowerCase() == 'no');
        this.inventorySearchCriteriaObj.green = [];
        this.inventorySearchCriteriaObj.green.push(NoGreenData?.name ?? 'NO');

        var NoMilkyData = inclusions.filter(item => item.type.toLowerCase().indexOf('milky') !== -1).find(z => z.name.toLowerCase() == 'no');
        this.inventorySearchCriteriaObj.milky = [];
        this.inventorySearchCriteriaObj.milky.push(NoMilkyData?.name ?? 'NO');
      }
    }
  }

  public openEditInventoryDialog(): void {
    this.assignDropDownDataForEdit();
    this.isFormValid = false;
    this.isEditInventory = true;
    this.checkRequiredFields();
  }

  public closeEditInventoryDialog(): void {
    this.isEditInventory = false;
  }

  public openSearchDialog(): void {
    this.isSearchFilter = true;

    //show checked location if change from summary filter
    this.onMultiSelectChange(this.listLocation, this.inventorySearchCriteriaObj.location);
  }

  public closeSearchDialog(): void {
    this.isSearchFilter = false;
  }

  public openMediaDialog(title: string, src: string, type: string): void {
    this.mediaTitle = title;
    this.mediaSrc = src;
    this.mediaType = type;
    this.isShowMedia = true;
  }

  public senitizeURL(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  public closeMediaDialog(e: boolean): void {
    this.isShowMedia = e;
  }

  public openGridConfigDialog(): void {
    this.isGridConfig = true;
  }

  public onExcelToggle(): void {
    this.showExcelOption = !this.showExcelOption;
  }

  public clearSearchCriteria(): void {
    this.inventorySearchCriteriaObj = new InventorySearchCriteria();
    this.inventorySearchCriteriaObj.organizationId = '';
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

  public async copyToClipboard() {
    try {
      this.spinnerService.show();
      let res = await this.inventoryService.copyToClipboardStoneId(this.inventorySearchCriteriaObj);
      if (res) {
        navigator.clipboard.writeText(res);
        this.utilityService.showNotification(`Copy to clipboard successfully!`);
        this.spinnerService.hide();
      }
      else
        this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public filterHoldChange(): void {
    this.skip = 0;
    this.mySelection = [];
    let isHold = this.inventorySearchCriteriaObj.isHold;
    if (isHold)
      this.inventorySearchCriteriaObj.isHold = null as any;
    else
      this.inventorySearchCriteriaObj.isHold = true;
    this.initInventoryData();
    this.closeSummary();
  }

  public filterRapnetHoldChange(): void {
    this.skip = 0;
    this.mySelection = [];
    let isHold = this.inventorySearchCriteriaObj.isRapnetHold;
    if (isHold)
      this.inventorySearchCriteriaObj.isRapnetHold = null as any;
    else
      this.inventorySearchCriteriaObj.isRapnetHold = true;
    this.initInventoryData();
    this.closeSummary();
  }

  public filterLocationChange(location: string): void {
    this.skip = 0;
    this.mySelection = [];
    let index = this.inventorySearchCriteriaObj.location.indexOf(location);
    if (index >= 0)
      this.inventorySearchCriteriaObj.location.splice(index, 1);
    else
      this.inventorySearchCriteriaObj.location.push(location);
    this.initInventoryData();
    this.closeSummary();
  }

  public openSendMailDialog(): void {
    this.isSendMail = true;
  }

  public closeSendMailDialog(): void {
    this.isSendMail = false;
    this.clearSendMail();
  }

  public openSendProposalDialog(): void {
    this.isSendProposal = true;
  }

  public closeSendProposalDialog(): void {
    this.isSendProposal = false;
    this.clearSendProposal();
    this.selectedCustomer = undefined;
  }

  public clearSendProposal(): void {
    this.stoneProposalMail = new StoneProposalMailData();
  }

  public clearSendMail(): void {
    this.exportToExcelMailObj = new ExportToExcelMailData();
  }
  //#endregion

  //#region CURD Functions
  // public async setNonCertified() {
  //   try {
  //     this.alertDialogService.ConfirmYesNo("Are you sure you want to change lab status for selected stone(s)?", "Non Certified Lab")
  //       .subscribe(async (res: any) => {
  //         if (res.flag) {
  //           this.spinnerService.show();
  //           let selectedInventoryItems: InventoryItems[] = [];

  //           let selectedInventoryStones = this.allInventoryItems.filter(item => this.mySelection.includes(item.id));
  //           selectedInventoryStones.forEach(z => {
  //             let obj: InventoryItems = new InventoryItems();
  //             obj.stoneId = z.stoneId;

  //             //Add Require fields to avoid api call error
  //             obj.weight = 0;
  //             obj.updatedBy = this.fxCredentials?.id ?? '';
  //             obj.identity = this.inventoryItems[0].identity;
  //             obj.stoneOrg = this.inventoryItems[0].stoneOrg;

  //             selectedInventoryItems.push(obj);
  //           });

  //           let res = await this.inventoryService.updateInventoryLabToNC(selectedInventoryItems);
  //           if (res) {
  //             this.initInventoryData();
  //             if (res.item1 == 0 && res.item2 == 0)
  //               this.utilityService.showNotification(selectedInventoryItems.length.toString() + ` Record(s) updated successfully!`);
  //             else {
  //               if (res.item1 > 0)
  //                 this.utilityService.showNotification(res.item1.toString() + ` Record(s) updated successfully!`);
  //               if (res.item2 > 0)
  //                 this.utilityService.showNotification(res.item2.toString() + ` Pricing request submitted successfully!`);
  //             }
  //           }
  //           else
  //             this.utilityService.showNotification(`Stone(s) already in `);

  //           this.spinnerService.hide();
  //           this.mySelection = [];
  //         }
  //       });
  //   }
  //   catch (error: any) {
  //     this.spinnerService.hide();
  //     this.alertDialogService.show(error.error);
  //   }
  // }

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

            let selectedInventoryStones = this.allInventoryItems.filter(item => this.mySelection.includes(item.id));
            selectedInventoryStones.forEach(z => {
              let obj: InventoryItems = new InventoryItems();
              obj.stoneId = z.stoneId;
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
              obj.supplier = this.inventoryItems[0].supplier;

              selectedInventoryItems.push(obj);
            });
            let res = await this.inventoryService.updateInventoryHoldData(selectedInventoryItems);
            if (res) {
              let result = await this.updateSupplierInventoryData(res);
              if (result > 0)
                this.utilityService.showNotification(result.toString() + ` Record(s) updated successfully in supplier data!`);
              this.utilityService.showNotification(res.length.toString() + ` Record(s) updated successfully!`);
              this.spinnerService.hide();
              this.initInventoryData();
            }
            else {
              this.spinnerService.hide();
              this.utilityService.showNotification(`Stone(s) already in ` + type, 'warning');
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

  public async updateSupplierInventoryData(inv: InventoryItems[]) {
    try {
      let res = 0;
      var distinctSuppliers = inv.map((u: InventoryItems) => u.supplier.name).filter((x: any, i: any, a: any) => x && a.indexOf(x) === i);
      for (let i = 0; i < distinctSuppliers.length; i++) {
        var z = distinctSuppliers[i];
        var supplierDetail = this.suppliers.find(a => a.name == z);
        if (supplierDetail) {
          if (supplierDetail.apiPath) {
            var invBySuppliers = inv.filter(a => a.supplier.name == z);

            let holdReleaseArray = this.mappingHoldReleaseObject(invBySuppliers);
            res = await this.supplierApiRequestService.updateInventoryOnHoldRelease(holdReleaseArray, supplierDetail.apiPath);
          } else {
            this.alertDialogService.show(supplierDetail.name + ' supplier api not found, Please contact administrator!');
          }
        } else {
          this.alertDialogService.show(z + ' supplier not found, Please contact administrator!');
        }
      }
      return res;
    }
    catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.utilityService.showNotification('inventory not updated in supplier data, Please contact administrator!', 'error');
      return 0;
    }
  }

  private mappingHoldReleaseObject(inv: InventoryItems[]): UpdateHoldReleaseInventory[] {
    let data: UpdateHoldReleaseInventory[] = [];
    inv.forEach(z => {
      let obj: UpdateHoldReleaseInventory = new UpdateHoldReleaseInventory();
      obj.stoneId = z.stoneId;
      obj.isHold = z.isHold;
      obj.holdDate = z.holdDate;
      obj.holdDays = z.holdDays;
      obj.updatedAt = z.updatedAt;
      obj.price = z.price;
      data.push(obj);
    });
    return data;
  }

  public async onInvSubmit(form: NgForm) {
    try {
      if (form.valid) {
        this.spinnerService.show();

        let lsd = this.inventoryObj.labSendDate;
        this.inventoryObj.labSendDate = lsd ? this.utilityService.setUTCDateFilter(lsd) : null;
        let lrd = this.inventoryObj.labReceiveDate;
        this.inventoryObj.labReceiveDate = lrd ? this.utilityService.setUTCDateFilter(lrd) : null;
        let msd = this.inventoryObj.marketSheetDate;
        this.inventoryObj.marketSheetDate = msd ? this.utilityService.setUTCDateFilter(msd) : null;

        let res = await this.inventoryService.updateInventoryData(this.inventoryObj)
        if (res) {
          await this.UpdateInvGrade(this.inventoryObj);
          this.spinnerService.hide();
          this.closeEditInventoryDialog();
          this.initInventoryData();
          this.mySelection = [];
          this.utilityService.showNotification(`Record updated successfully!`)
        }
        else {
          this.spinnerService.hide();
          this.utilityService.showNotification(`Something went wrong, Try again later!`)
        }
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async UpdateInvGrade(inv: InventoryItems) {
    try {
      let req: GradeSearchItems[] = [];
      let obj: GradeSearchItems = new GradeSearchItems();
      obj.id = inv.stoneId?.toUpperCase();
      obj.lab = inv.lab?.toUpperCase() ?? 'GIA';
      obj.shape = inv.shape?.toUpperCase();
      obj.size = Number(inv.weight);
      obj.color = inv.color?.toUpperCase();
      obj.clarity = inv.clarity?.toUpperCase();
      obj.cut = inv.cut?.toUpperCase();
      obj.polish = inv.polish?.toUpperCase();
      obj.sym = inv.symmetry?.toUpperCase();
      obj.fluo = inv.fluorescence?.toUpperCase();

      let inclusionData: InclusionPrice = new InclusionPrice();
      inclusionData.brown = inv.inclusion.brown?.toUpperCase();
      inclusionData.green = inv.inclusion.green?.toUpperCase();
      inclusionData.milky = inv.inclusion.milky?.toUpperCase();
      inclusionData.shade = inv.inclusion.shade?.toUpperCase();
      inclusionData.sideBlack = inv.inclusion.sideBlack?.toUpperCase();
      inclusionData.centerBlack = inv.inclusion.centerBlack?.toUpperCase();
      inclusionData.sideWhite = inv.inclusion.sideWhite?.toUpperCase();
      inclusionData.centerWhite = inv.inclusion.centerWhite?.toUpperCase();
      inclusionData.openTable = inv.inclusion.openTable?.toUpperCase();
      inclusionData.openCrown = inv.inclusion.openCrown?.toUpperCase();
      inclusionData.openPavilion = inv.inclusion.openPavilion?.toUpperCase();
      inclusionData.openGirdle = inv.inclusion.openGirdle?.toUpperCase();
      if (inv.inclusion.girdleCondition && inv.inclusion.girdleCondition.length > 0)
        inclusionData.girdleCond.push(inv.inclusion.girdleCondition?.toUpperCase());
      inclusionData.eFOC = inv.inclusion.efoc?.toUpperCase();
      inclusionData.eFOP = inv.inclusion.efop?.toUpperCase();
      inclusionData.culet = inv.inclusion.culet?.toUpperCase();
      inclusionData.hNA = inv.inclusion.hna?.toUpperCase();
      inclusionData.eyeClean = inv.inclusion.eyeClean?.toUpperCase();
      inclusionData.kToS = null;
      inclusionData.naturalOnGirdle = inv.inclusion.naturalOnGirdle?.toUpperCase();
      inclusionData.naturalOnCrown = inv.inclusion.naturalOnCrown?.toUpperCase();
      inclusionData.naturalOnPavillion = inv.inclusion.naturalOnPavillion?.toUpperCase();
      inclusionData.flColor = inv.inclusion.flColor?.toUpperCase();
      inclusionData.luster = inv.inclusion.luster?.toUpperCase();
      inclusionData.bowTie = inv.inclusion.bowtie?.toUpperCase();
      inclusionData.certiComment = inv.inclusion.certiComment?.toUpperCase();

      obj.inclusion = inclusionData;

      let measurData: MeasItems = new MeasItems();
      measurData.type = 'Depth';
      measurData.value = Number(inv.measurement.depth);
      obj.measurement.push(measurData);

      measurData = new MeasItems();
      measurData.type = 'Table';
      measurData.value = Number(inv.measurement.table);
      obj.measurement.push(measurData);

      let girdleData: GirdleDNorm = new GirdleDNorm();
      girdleData.min = inv.measurement.minGirdle?.toUpperCase();
      girdleData.max = inv.measurement.maxGirdle?.toUpperCase();

      obj.girdle = girdleData;
      obj.certComment = [];
      obj.ktoS = [];

      req.push(obj);

      let res = await this.measureGradeService.getPrice(req);
      if (res) {
        let result = await this.inventoryService.updateInventoryGrading(res);
        if (result) {
          this.utilityService.showNotification(`Stone grade updated!`);
        }
      }
    }
    catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show('Something went wrong when get grade.');
    }
  }

  public async onInvDelete() {
    try {
      if (this.fxCredentials?.origin != 'Admin') {
        this.alertDialogService.show(`You are not allow to delete stone.`);
        return;
      }

      this.alertDialogService.ConfirmYesNo("Are you sure you want to remove selected stone?", "Delete")
        .subscribe(async (res: any) => {
          this.mySelection = [];
          if (res.flag) {
            this.spinnerService.show();
            let res = await this.inventoryService.deleteInventoryData(this.inventoryObj.id)
            if (res && res == 1) {
              this.spinnerService.hide();
              this.initInventoryData();
              this.utilityService.showNotification(`Record deleted successfully!`)
            }
            else {
              this.spinnerService.hide();
              this.alertDialogService.show(`Something went wrong, Try again later!`);
            }
          }
        });
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public checkRequiredFields(): void {
    this.isFormValid = this.validateFields();
  }

  public validateFields(): boolean {
    const obj = this.inventoryObj;

    return this.checkStringNullOrEmpty(obj.stoneId)
      && this.checkStringNullOrEmpty(obj.kapan)
      // && this.checkStringNullOrEmpty(obj.article)
      // && this.checkStringNullOrEmpty(obj.rfid)
      && this.checkStringNullOrEmpty(obj.shape)
      && this.checkStringNullOrEmpty(obj.weight?.toString() ?? '')
      && this.checkStringNullOrEmpty(obj.color)
      && this.checkStringNullOrEmpty(obj.clarity)
      && this.checkStringNullOrEmpty(obj.cut)
      && this.checkStringNullOrEmpty(obj.polish)
      && this.checkStringNullOrEmpty(obj.symmetry)
      && this.checkStringNullOrEmpty(obj.fluorescence)
      && this.checkStringNullOrEmpty(obj.basePrice.rap?.toString() ?? '')
      && this.checkStringNullOrEmpty(obj.basePrice.discount?.toString() ?? '')
      && this.checkStringNullOrEmpty(obj.basePrice.netAmount?.toString() ?? '')
      && this.checkStringNullOrEmpty(obj.basePrice.perCarat?.toString() ?? '')
      && this.checkStringNullOrEmpty(obj.inclusion.shade)
      && this.checkStringNullOrEmpty(obj.inclusion.brown)
      && this.checkStringNullOrEmpty(obj.inclusion.green)
      && this.checkStringNullOrEmpty(obj.inclusion.milky)
      && this.checkStringNullOrEmpty(obj.inclusion.hna)
      && this.checkStringNullOrEmpty(obj.inclusion.eyeClean)
      && this.checkStringNullOrEmpty(obj.measurement.depth?.toString() ?? '')
      && this.checkStringNullOrEmpty(obj.measurement.table?.toString() ?? '')
      && this.checkStringNullOrEmpty(obj.measurement.length?.toString() ?? '')
      && this.checkStringNullOrEmpty(obj.measurement.width?.toString() ?? '')
      && this.checkStringNullOrEmpty(obj.measurement.height?.toString() ?? '')
      && this.checkStringNullOrEmpty(obj.measurement.ratio?.toString() ?? '')
  }

  public checkStringNullOrEmpty(field: string): boolean {
    var flag = true;
    if (field == undefined || field == null || field?.length == 0 || (typeof field == 'undefined'))
      flag = false;
    return flag;
  }

  public assignAdditionalData(): void {
    let carat = null;
    carat = this.firstCaratFrom ? (this.firstCaratTo ? this.firstCaratFrom + "-" + this.firstCaratTo : "") : "";
    carat += this.secondCaratFrom ? (this.secondCaratTo ? "," + this.secondCaratFrom + "-" + this.secondCaratTo : "") : "";
    carat += this.thirdCaratFrom ? (this.thirdCaratTo ? "," + this.thirdCaratFrom + "-" + this.thirdCaratTo : "") : "";
    carat += this.fourthCaratFrom ? (this.fourthCaratTo ? "," + this.fourthCaratFrom + "-" + this.fourthCaratTo : "") : "";
    this.inventorySearchCriteriaObj.carat = carat ? carat : undefined;

    let fData = this.inventorySearchCriteriaObj.fromDate;
    this.inventorySearchCriteriaObj.fromDate = fData ? this.utilityService.setUTCDateFilter(fData) : null;

    let tData = this.inventorySearchCriteriaObj.toDate;
    this.inventorySearchCriteriaObj.toDate = tData ? this.utilityService.setUTCDateFilter(tData) : null;
  }

  public filterBySearch(): void {
    this.skip = 0;
    this.mySelection = [];
    this.assignAdditionalData();
    this.initInventoryData();
    this.isSearchFilter = false;
  }

  //Match Name for Dropdown Selection
  public assignDropDownDataForEdit() {
    //Basic
    this.inventoryObj.shape = this.matchDropDownField(this.inventoryObj.shape, this.allTheShapes);
    this.inventoryObj.color = this.matchDropDownField(this.inventoryObj.color, this.allColors);
    this.inventoryObj.clarity = this.matchDropDownField(this.inventoryObj.clarity, this.allClarities);
    this.inventoryObj.fluorescence = this.matchDropDownField(this.inventoryObj.fluorescence, this.allTheFluorescences);
    this.inventoryObj.cut = this.matchDropDownField(this.inventoryObj.cut, this.allTheCPS);
    this.inventoryObj.polish = this.matchDropDownField(this.inventoryObj.polish, this.allTheCPS);
    this.inventoryObj.symmetry = this.matchDropDownField(this.inventoryObj.symmetry, this.allTheCPS);
    this.inventoryObj.lab = this.matchDropDownField(this.inventoryObj.lab, this.allTheLab);
    //Inclusion
    this.inventoryObj.inclusion.brown = this.matchDropDownField(this.inventoryObj.inclusion.brown, TypeFilterPipe.prototype.transform(this.inclusionData, 'brown'));
    this.inventoryObj.inclusion.shade = this.matchDropDownField(this.inventoryObj.inclusion.shade, TypeFilterPipe.prototype.transform(this.inclusionData, 'shade'));
    this.inventoryObj.inclusion.green = this.matchDropDownField(this.inventoryObj.inclusion.green, TypeFilterPipe.prototype.transform(this.inclusionData, 'green'));
    this.inventoryObj.inclusion.milky = this.matchDropDownField(this.inventoryObj.inclusion.milky, TypeFilterPipe.prototype.transform(this.inclusionData, 'milky'));

    this.inventoryObj.inclusion.sideBlack = this.matchDropDownField(this.inventoryObj.inclusion.sideBlack, TypeFilterPipe.prototype.transform(this.inclusionData, 'sideBlack'));
    this.inventoryObj.inclusion.centerSideBlack = this.matchDropDownField(this.inventoryObj.inclusion.centerSideBlack, TypeFilterPipe.prototype.transform(this.inclusionData, 'centerSideBlack'));
    this.inventoryObj.inclusion.centerBlack = this.matchDropDownField(this.inventoryObj.inclusion.centerBlack, TypeFilterPipe.prototype.transform(this.inclusionData, 'centerBlack'));
    this.inventoryObj.inclusion.sideWhite = this.matchDropDownField(this.inventoryObj.inclusion.sideWhite, TypeFilterPipe.prototype.transform(this.inclusionData, 'sideWhite'));
    this.inventoryObj.inclusion.centerSideWhite = this.matchDropDownField(this.inventoryObj.inclusion.centerSideWhite, TypeFilterPipe.prototype.transform(this.inclusionData, 'centerSideWhite'));
    this.inventoryObj.inclusion.centerWhite = this.matchDropDownField(this.inventoryObj.inclusion.centerWhite, TypeFilterPipe.prototype.transform(this.inclusionData, 'centerWhite'));

    this.inventoryObj.inclusion.openCrown = this.matchDropDownField(this.inventoryObj.inclusion.openCrown, TypeFilterPipe.prototype.transform(this.inclusionData, 'openCrown'));
    this.inventoryObj.inclusion.openTable = this.matchDropDownField(this.inventoryObj.inclusion.openTable, TypeFilterPipe.prototype.transform(this.inclusionData, 'openTable'));
    this.inventoryObj.inclusion.openPavilion = this.matchDropDownField(this.inventoryObj.inclusion.openPavilion, TypeFilterPipe.prototype.transform(this.inclusionData, 'openPavilion'));
    this.inventoryObj.inclusion.openGirdle = this.matchDropDownField(this.inventoryObj.inclusion.openGirdle, TypeFilterPipe.prototype.transform(this.inclusionData, 'openGirdle'));

    this.inventoryObj.inclusion.efoc = this.matchDropDownField(this.inventoryObj.inclusion.efoc, TypeFilterPipe.prototype.transform(this.inclusionData, 'eFOC'));
    this.inventoryObj.inclusion.efot = this.matchDropDownField(this.inventoryObj.inclusion.efot, TypeFilterPipe.prototype.transform(this.inclusionData, 'eFOT'));
    this.inventoryObj.inclusion.efop = this.matchDropDownField(this.inventoryObj.inclusion.efop, TypeFilterPipe.prototype.transform(this.inclusionData, 'eFOP'));
    this.inventoryObj.inclusion.efog = this.matchDropDownField(this.inventoryObj.inclusion.efog, TypeFilterPipe.prototype.transform(this.inclusionData, 'eFOG'));

    this.inventoryObj.inclusion.naturalOnCrown = this.matchDropDownField(this.inventoryObj.inclusion.naturalOnCrown, TypeFilterPipe.prototype.transform(this.inclusionData, 'naturalOnCrown'));
    this.inventoryObj.inclusion.naturalOnGirdle = this.matchDropDownField(this.inventoryObj.inclusion.naturalOnGirdle, TypeFilterPipe.prototype.transform(this.inclusionData, 'naturalOnGirdle'));
    this.inventoryObj.inclusion.naturalOnPavillion = this.matchDropDownField(this.inventoryObj.inclusion.naturalOnPavillion, TypeFilterPipe.prototype.transform(this.inclusionData, 'naturalonpavilion'));
    this.inventoryObj.inclusion.naturalOnTable = this.matchDropDownField(this.inventoryObj.inclusion.naturalOnTable, TypeFilterPipe.prototype.transform(this.inclusionData, 'naturalOnTable'));

    this.inventoryObj.inclusion.girdleCondition = this.matchDropDownField(this.inventoryObj.inclusion.girdleCondition, TypeFilterPipe.prototype.transform(this.inclusionData, 'girdleCondition'));
    this.inventoryObj.inclusion.culet = this.matchDropDownField(this.inventoryObj.inclusion.culet, TypeFilterPipe.prototype.transform(this.inclusionData, 'culet'));
    this.inventoryObj.inclusion.hna = this.matchDropDownField(this.inventoryObj.inclusion.hna, TypeFilterPipe.prototype.transform(this.inclusionData, 'hNA'));
    this.inventoryObj.inclusion.eyeClean = this.matchDropDownField(this.inventoryObj.inclusion.eyeClean, TypeFilterPipe.prototype.transform(this.inclusionData, 'eyeClean'));
    this.inventoryObj.inclusion.ktoS = this.matchDropDownField(this.inventoryObj.inclusion.ktoS, TypeFilterPipe.prototype.transform(this.inclusionData, 'ktoS'));
    this.inventoryObj.inclusion.flColor = this.matchDropDownField(this.inventoryObj.inclusion.flColor, TypeFilterPipe.prototype.transform(this.inclusionData, 'fLColor'));
    this.inventoryObj.inclusion.redSpot = this.matchDropDownField(this.inventoryObj.inclusion.redSpot, TypeFilterPipe.prototype.transform(this.inclusionData, 'redSpot'));
    this.inventoryObj.inclusion.luster = this.matchDropDownField(this.inventoryObj.inclusion.luster, TypeFilterPipe.prototype.transform(this.inclusionData, 'luster'));
    this.inventoryObj.inclusion.bowtie = this.matchDropDownField(this.inventoryObj.inclusion.bowtie, TypeFilterPipe.prototype.transform(this.inclusionData, 'bowtie'));
  }

  public matchDropDownField(field: string, list: MasterDNorm[] | undefined): string {
    var obj = list?.find(c => c.name.toLowerCase() == field?.toLowerCase() || c.displayName.toLowerCase() == field?.toLowerCase() || c.optionalWords && c.optionalWords.map(u => u.toLowerCase().trim()).includes(field?.toLowerCase()));
    if (obj)
      field = obj.name;
    return field;
  }
  //#endregion

  //#region Export To Excel / Mail / Proposal
  public async exportToExcel(type: string) {
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
      let selectedStoneIds = this.allInventoryItems.filter(z => this.mySelection.includes(z.id)).map(z => z.stoneId);
      exportData = await this.inventoryService.getInventoryByStoneIds(selectedStoneIds);
    }
    else
      exportData = await this.inventoryService.getInventoryItemsBySearchForExcel(this.inventorySearchCriteriaObj);

    if (exportData && exportData.length > 0) {
      exportData.forEach(element => {
        var excel = this.convertArrayToObject(this.fields, element);
        this.excelFile.push(excel);
      });

      if (this.excelFile.length > 0) {
        if (type == "export") {
          let isExport: boolean = this.utilityService.exportAsExcelFile(this.excelFile, "Diamond_Excel");
          if (isExport) {
            this.excelOption = null;
            this.showExcelOption = false;
          }
        }
        else if (type == "mail") {
          this.excelOption = null;
          this.showExcelOption = false;
          this.openSendMailDialog();
        }
        else if (type == "proposal") {
          await this.getCustomerData();
          if (this.excelOption == 'selected') {
            let stoneIds = exportData.filter(item => this.mySelection.includes(item.id)).map(z => z.stoneId);
            this.stoneProposalMail.stoneIds = stoneIds;
          }
          else
            this.stoneProposalMail.criteriaJson = JSON.stringify(this.inventorySearchCriteriaObj);

          this.showExcelOption = false;
          this.openSendProposalDialog();
        }
      }
      this.spinnerService.hide();
    }
    else {
      this.alertDialogService.show('No Data Found!');
      this.spinnerService.hide();
    }
  }

  public convertArrayToObject(fields: GridDetailConfig[], element: any): any {
    let iURL = element.imageUrl;
    let cURL = element.certificateUrl;
    let vURL = element.videoUrl;
    var obj: any = {};
    for (let i = 0; i < fields.length; i++) {
      if (!(fields[i].title == "Checkbox")) {
        if (fields[i].title == "Media") {
          obj["CertificateUrl"] = cURL;
          obj["ImageUrl"] = iURL;
          obj["VideoUrl"] = vURL;
        }
        else if (fields[i].propertyName.includes("measurement")) {
          let propertyname = fields[i].propertyName.split(".")[1];
          obj[fields[i].title] = element.measurement[propertyname];
        }
        else if (fields[i].propertyName.includes("inclusion")) {
          let propertyname = fields[i].propertyName.split(".")[1];
          obj[fields[i].title] = element.inclusion[propertyname];
        }
        else if (fields[i].title == "Weight")
          obj[fields[i].title] = element.weight.toFixed(2);
        else if (fields[i].title == "$/CT")
          obj[fields[i].title] = ((element.basePrice.netAmount ?? 0) / element.weight).toFixed(3);
        else if (fields[i].title == "Rap")
          obj[fields[i].title] = element.basePrice.rap.toFixed(3);
        else if (fields[i].title == "Discount")
          obj[fields[i].title] = element.basePrice.discount?.toFixed(3);
        else if (fields[i].title == "NetAmount")
          obj[fields[i].title] = element.basePrice.netAmount?.toFixed(3);
        else
          obj[fields[i].title] = element[fields[i].propertyName];
      }
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

  public async sendMail(form: NgForm) {
    try {
      if (!form.valid)
        return;

      let isEmailValid = this.checkValidEmail(this.exportToExcelMailObj.toEmail);
      if (!isEmailValid) {
        this.alertDialogService.show('Not valid email address in Mail To');
        return;
      }

      let isCCValid = this.checkValidEmail(this.exportToExcelMailObj.cC);
      if (!isCCValid) {
        this.alertDialogService.show('Not valid email address in CC');
        return;
      }

      let isBccValid = this.checkValidEmail(this.exportToExcelMailObj.bcc);
      if (!isBccValid) {
        this.alertDialogService.show('Not valid email address in Bcc');
        return;
      }

      this.spinnerService.show();
      this.exportToExcelMailObj.systemUserId = this.fxCredentials?.id ?? '';

      let fileName = "Diamond_Excel";
      this.exportToExcelMailObj.excelBase64String = this.utilityService.exportAsExcelFileBase64(this.excelFile);;
      this.exportToExcelMailObj.excelFileName = this.utilityService.exportFileName(fileName);
      this.exportToExcelMailObj.excelMediaType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      let res = await this.inventoryService.ExportToExcelMail(this.exportToExcelMailObj);
      if (res && res.isSuccess) {
        this.utilityService.showNotification(res.message);
        this.closeSendMailDialog();
      }
      else {
        console.error(res);
        if (res) {
          this.alertDialogService.show(res.message);
        }
        else
          this.alertDialogService.show("Something went wrong, Try again later");
      }
      this.spinnerService.hide();
    }
    catch (error: any) {
      console.error(error);
      this.alertDialogService.show("Something went wrong, Try again later");
      this.spinnerService.hide();
    }
  }

  public async sendProposal(form: NgForm) {
    try {
      if (!form.valid)
        return;

      let proposalUrl = environment.proposalUrl;
      this.stoneProposalMail.proposalUrl = proposalUrl + 'proposal';

      let systemUserData = this.systemUserItems.find(z => z.id == this.fxCredentials?.id ?? '');
      if (systemUserData) {
        let systemUser = new SystemUserDNorm();
        systemUser.id = systemUserData.id;
        systemUser.name = systemUserData.fullName;
        systemUser.email = systemUserData.email;
        systemUser.mobile = systemUserData.mobile;
        systemUser.address = systemUserData.address;

        this.stoneProposalMail.systemUser = systemUser;
      }
      else {
        this.alertDialogService.show("Your session Expired, Try login again");
        return;
      }

      this.spinnerService.show();
      let res = await this.stoneProposalService.sendStoneProposal(this.stoneProposalMail);
      if (res && res.isSuccess) {
        this.utilityService.showNotification(res.message);
        this.excelOption = null;
        this.closeSendProposalDialog();
      }
      else {
        console.error(res);
        if (res) {
          this.alertDialogService.show(res.message);
        }
        else
          this.alertDialogService.show("Something went wrong, Try again later");
      }
      this.spinnerService.hide();
    }
    catch (error: any) {
      console.error(error);
      this.alertDialogService.show("Something went wrong, Try again later");
      this.spinnerService.hide();
    }
  }

  public checkValidEmail(email: string): boolean {
    let flag = true;
    if (email && email.length > 0) {
      let emailArray = email.split(",");
      if (emailArray && emailArray.length > 0) {
        emailArray.forEach(z => {
          if (flag)
            flag = this.validateEmail(z.trim());
        });
      }
    }
    return flag;
  }

  public validateEmail(email: string): boolean {
    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regexp.test(email);
  }
  //#endregion

  //#region Popup Close
  @HostListener("document:click", ["$event"])
  public documentClick(event: any): void {
    if (!this.contains(event.target)) {
      this.showExcelOption = false;
    }
  }

  private contains(target: any): boolean {
    return (
      this.anchor.nativeElement.contains(target) ||
      (this.popup ? this.popup.nativeElement.contains(target) : false)
    );
  }
  //#endregion

  //#region Select All
  public async loadAllInventories() {
    try {
      this.inventorySearchCriteriaObj.organizationId = '';
      this.allInventoryItems = await this.inventoryService.getInventoryItemsForSelectAll(this.inventorySearchCriteriaObj);
      if (this.allInventoryItems && this.allInventoryItems.length > 0)
        this.mySelection = this.allInventoryItems.map(z => z.id);

      this.changeDetRef.detectChanges();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async selectAllInventories(event: string) {
    this.mySelection = [];
    if (event.toLowerCase() == 'checked') {
      if (this.invResponse.totalCount > this.pageSize)
        await this.loadAllInventories();
      else
        this.mySelection = this.inventoryItems.map(z => z.id);
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
  //#endregion
}