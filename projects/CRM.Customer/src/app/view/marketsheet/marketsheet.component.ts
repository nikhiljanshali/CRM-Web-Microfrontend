import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { Align } from '@progress/kendo-angular-popup';
import { DataResult, GroupDescriptor, process } from '@progress/kendo-data-query';
import { BranchDNorm, Employee, GridDetailConfig, MarketSheetSearchCriteria, OrganizationDNorm } from 'common/businessobjects';
import { TypeFilterPipe } from 'common/directives/typefilter.pipe';
import { Department, fxCredential, GridMasterConfig, InclusionConfig, InventoryItems, MasterConfig, MasterDNorm, MeasurementConfig } from 'common/entities';
import { GridConfig } from 'common/entities/configs/gridconfig';
import { CommonService, ConfigService, EmployeeService, GridPropertiesService, listGrainingItems, MarketsheetService, MasterConfigService, OrganizationService, StoneStatus, UtilityService } from 'common/services';
import { AlertdialogService } from 'common/views';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-marketsheet',
  templateUrl: './marketsheet.component.html',
  styles: [
  ]
})

export class MarketsheetComponent implements OnInit {
  //#region Grid Init
  public isSummary = false;
  public groups: GroupDescriptor[] = [];
  public pageSize = 26;
  public skip = 0;
  public fields!: GridDetailConfig[];
  public gridView?: DataResult;
  public isRegEmployee: boolean = false;
  public filterFlag = true;
  public selectableSettings: SelectableSettings = {
    mode: 'multiple',
  };
  public skeletonArray = new Array(18);
  public mySelection: string[] = [];
  public isShowCheckBoxAll: boolean = true;
  //#endregion

  //#region Grid Config
  public isGridConfig: boolean = false;
  private fxCredential!: fxCredential;
  public gridConfig!: GridConfig;
  public gridMasterConfigResponse!: GridMasterConfig;
  //#endregion

  //#region List & Objects
  public inventoryObj: InventoryItems = new InventoryItems();

  public organizationDNormItems!: OrganizationDNorm[];
  public selectedOrganizationDNormItems?: { text: string; value: string };
  public branchDNormItems!: BranchDNorm[];
  public selectedBranchDNormItems?: { text: string, value: string };
  public deptItems!: Department[];
  public selectedDeptItems?: { text: string, value: string };
  public empItems!: Employee[];
  public selectedEmpItems?: { text: string, value: string };
  public selectedCPS?: string;
  public isBGM: boolean = false;

  public listOrganizationDNormItems: Array<{ text: string; value: string }> = [];
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
  //#endregion

  //#region Model Flag
  public isEditInventory: boolean = false;
  public isSearchFilter: boolean = false;
  public isShowMedia: boolean = false;
  //#endregion

  public mediaTitle!: string
  public mediaSrc!: string
  public mediaType!: string

  //#region Custom Models
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
  //#endregion
  public inventoryItems: InventoryItems[] = [];
  public marketSheetSearchCriteriaObj: MarketSheetSearchCriteria = new MarketSheetSearchCriteria();
  public tempMarketSheetSearchCriteriaObj: MarketSheetSearchCriteria = new MarketSheetSearchCriteria();
  public fxCredentials?: fxCredential = new fxCredential();

  public totalPacket: number = 0;
  public totalWeight: number = 0;
  public totalNetAmount: number = 0;
  public totalBlockedStones: number = 0;
  public totalDiscount: number = 0;
  public totalAvgDPC: number = 0;

  public isFormValid: boolean = false;
  public showExcelOption = false;
  public excelOption!: string | null;

  public anchorAlign: Align = { horizontal: "right", vertical: "bottom" };
  public popupAlign: Align = { horizontal: "center", vertical: "top" };

  constructor(private marketSheetService: MarketsheetService,
    private alertDialogService: AlertdialogService,
    public utilityService: UtilityService,
    private masterConfigService: MasterConfigService,
    private organizationService: OrganizationService,
    private spinnerService: NgxSpinnerService,
    private employeeService: EmployeeService,
    private gridPropertiesService: GridPropertiesService,
    private commonService: CommonService,
    private configService: ConfigService) { }

  public async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  public async defaultMethodsLoad() {
    this.fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential || null;
    this.marketSheetSearchCriteriaObj.customerId = this.fxCredentials.id;

    await this.getGridConfiguration();
    await this.initInventoryData();
    await this.getMasterConfigData();
    await this.getOrganizationDNormData();
    await this.getEmployeeData();
  }

  public async getGridConfiguration() {
    try {
      this.gridConfig = await this.configService.getGridConfig(this.fxCredentials?.id ?? '', "MarketSheetCustomer", "MarketSheetCustomerGrid");
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
        this.gridMasterConfigResponse = await this.configService.getMasterGridConfig("MarketSheetCustomer", "MarketSheetCustomerGrid");
        if (this.gridMasterConfigResponse)
          this.fields = this.gridMasterConfigResponse.gridDetail;
        else
          this.fields = await this.gridPropertiesService.getInventoryGrid();
      }
    }
    catch (error: any) {
      this.alertDialogService.show(error);
      this.spinnerService.hide();
    }
  }

  //#region Inv Search Filter Data
  public async initInventoryData() {
    try {
      let res = await this.marketSheetService.getMarketSheetItemsBySearch(this.marketSheetSearchCriteriaObj, this.skip, this.pageSize);
      if (res) {
        this.inventoryItems = res.marketSheets;
        this.gridView = process(res.marketSheets, { group: this.groups });
        this.gridView.total = this.totalPacket = res.totalCount;
        this.totalWeight = res.totalWeight;
        this.totalNetAmount = res.totalNetAmount;
        this.totalBlockedStones = res.totalBlockedStones;
        this.totalAvgDPC = res.totalAvgDPC;
        this.totalDiscount = res.totalDiscount;
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }
  //#endregion

  //#region Org, Emp Data
  private async getOrganizationDNormData() {
    try {
      this.organizationDNormItems = await this.organizationService.getOrganizationDNorm();
      for (let i = 0; i < this.organizationDNormItems.length; i++)
        this.listOrganizationDNormItems.push({ text: this.organizationDNormItems[i].name, value: this.organizationDNormItems[i].id })
    }
    catch (error: any) {
      console.error(error);
      this.alertDialogService.show(error.error);
    }
  }

  public async onOrganizationDNormChange(e: any, isEdit: boolean = false) {
    const orgDNorm = this.organizationDNormItems.find(z => z.id == e.value);
    if (orgDNorm != undefined && orgDNorm != null)
      this.marketSheetSearchCriteriaObj.organizationId = orgDNorm.id;

    this.spinnerService.show();
    await this.getBranchDNormByOrgId(this.marketSheetSearchCriteriaObj.organizationId ?? '', isEdit);
    await this.getDepartmentsByOrgId(this.marketSheetSearchCriteriaObj.organizationId ?? '', isEdit);
  }

  private async getBranchDNormByOrgId(id: string, isEdit: boolean = false) {
    try {
      this.branchDNormItems = await this.organizationService.getBranchDNormByOrganizationId(id);

      if (!isEdit)
        this.selectedBranchDNormItems = undefined;

      this.listBranchDNormItems = [];
      this.branchDNormItems.forEach((z) => { this.listBranchDNormItems.push({ text: z.name, value: z.name }); });
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  private async getDepartmentsByOrgId(id: string, isEdit: boolean = false) {
    try {
      this.deptItems = await this.organizationService.getDepartmentByOrganizationId(id);

      if (this.selectedBranchDNormItems && this.marketSheetSearchCriteriaObj.branch)
        this.deptItems = this.deptItems.filter(z => z.branchName == this.marketSheetSearchCriteriaObj.branch);

      if (!isEdit)
        this.selectedDeptItems = undefined;

      this.listDepartmentItems = [];
      this.deptItems.forEach(z => { this.listDepartmentItems.push({ text: z.name, value: z.id }); });
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public onBranchDNormChange(e: any) {
    const branchDNorm = this.branchDNormItems.find(z => z.name == e.value);
    if (branchDNorm != undefined && branchDNorm != null) {
      this.marketSheetSearchCriteriaObj.branch = branchDNorm.name;
      this.getDepartmentsByOrgId(this.marketSheetSearchCriteriaObj.organizationId ?? '');
    }
  }

  public onDepartmentChange(e: any) {
    const dept = this.deptItems.find(z => z.id == e.value);
    if (dept != undefined && dept != null)
      this.marketSheetSearchCriteriaObj.deptId = dept.id ?? '';
  }

  public async getEmployeeData() {
    this.empItems = await this.employeeService.getAllEmployees();
    this.empItems.forEach((z) => { this.listEmpItems.push({ text: z.fullName, value: z.id }); });
  }

  public onEmployeeChange(e: any) {
    const emp = this.empItems.find(z => z.id == e.value);
    if (emp != undefined && emp != null)
      this.marketSheetSearchCriteriaObj.empId = emp.id ?? '';
  }
  //#endregion

  //#region Master Config Data
  public async getMasterConfigData() {
    //Status
    Object.values(StoneStatus).forEach(z => { this.listStatus.push({ name: z.toString(), isChecked: false }); });
    //Master Config
    this.masterConfigList = await this.masterConfigService.getAllMasterConfig();
    this.allTheShapes = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.shape);
    this.allColors = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.colors);
    this.allClarities = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.clarities);
    this.allTheFluorescences = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.fluorescence);
    this.allTheCPS = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.cps);
    this.allTheLab = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.lab);
    this.inclusionData = this.masterConfigList.inclusions;
    this.inclusionConfig = this.masterConfigList.inclusionConfig;
    this.measurementData = this.masterConfigList.measurements;
    this.measurementConfig = this.masterConfigList.measurementConfig;

    let allKTOS = this.inclusionData.filter(item => item.type.toLowerCase().indexOf('ktos') !== -1);
    allKTOS.forEach(z => { this.listKToS.push({ name: z.name, isChecked: false }); });

    let allCulet = this.inclusionData.filter(item => item.type.toLowerCase().indexOf('culet') !== -1);
    allCulet.forEach(z => { this.listCulet.push({ name: z.name, isChecked: false }); });

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

  public tagMapper(tags: string[]): void {
    // This function is used for hide selected items in multiselect box
  }

  public selectedRowChange(e: any) {
    this.inventoryObj = new InventoryItems();
    if (e.selectedRows != null && e.selectedRows.length > 0) {
      let value: InventoryItems = e.selectedRows[0].dataItem;
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
    else if (min && !max)
      return "min value required!";

    return '';
  }

  public checkCPS(type?: string) {
    if (type == 'BGM') {
      var NoMilkyData = this.inclusionData.filter(item => item.type.toLowerCase().indexOf('milky') !== -1).find(z => z.name.toLowerCase() == 'no');
      var checkMilky = this.marketSheetSearchCriteriaObj.milky.indexOf(NoMilkyData?.name ?? 'NO');

      var NoGreenData = this.inclusionData.filter(item => item.type.toLowerCase().indexOf('green') !== -1).find(z => z.name.toLowerCase() == 'no');
      var checkGreen = this.marketSheetSearchCriteriaObj.green.indexOf(NoGreenData?.name ?? 'NO');

      let BrownData = this.inclusionData.filter(item => item.type.toLowerCase().indexOf('brown') !== -1).find(z => z.name.toLowerCase() == 'no');
      var checkBrown = this.marketSheetSearchCriteriaObj.brown.indexOf(BrownData?.name ?? 'NO');

      if (checkMilky > -1 && checkGreen > -1 && checkBrown > -1)
        this.isBGM = true;
      else
        this.isBGM = false;
    }
    else {
      var ExData = this.allTheCPS?.find(z => z.name.toLowerCase() == 'ex');
      var VGData = this.allTheCPS?.find(z => z.name.toLowerCase() == 'vg');

      var checkCutEX = this.marketSheetSearchCriteriaObj.cut.indexOf(ExData?.name ?? 'EX');
      var checkPolishEX = this.marketSheetSearchCriteriaObj.polish.indexOf(ExData?.name ?? 'EX');
      var checkSymmEX = this.marketSheetSearchCriteriaObj.symm.indexOf(ExData?.name ?? 'EX');

      var checkCutVG = this.marketSheetSearchCriteriaObj.cut.indexOf(VGData?.name ?? 'VG');
      var checkPolishVG = this.marketSheetSearchCriteriaObj.polish.indexOf(VGData?.name ?? 'VG');
      var checkSymmVG = this.marketSheetSearchCriteriaObj.symm.indexOf(VGData?.name ?? 'VG');

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
      this.marketSheetSearchCriteriaObj.cut = [];
      this.marketSheetSearchCriteriaObj.cut.push(ExData?.name ?? 'EX');

      this.marketSheetSearchCriteriaObj.polish = [];
      this.marketSheetSearchCriteriaObj.polish.push(ExData?.name ?? 'EX');

      this.marketSheetSearchCriteriaObj.symm = [];
      this.marketSheetSearchCriteriaObj.symm.push(ExData?.name ?? 'EX');
    }
    else if (type == '2EX') {
      var ExData = this.allTheCPS?.find(z => z.name.toLowerCase() == 'ex');
      this.marketSheetSearchCriteriaObj.cut = [];
      this.marketSheetSearchCriteriaObj.cut.push(ExData?.name ?? 'EX');

      this.marketSheetSearchCriteriaObj.polish = [];
      this.marketSheetSearchCriteriaObj.polish.push(ExData?.name ?? 'EX');

      this.marketSheetSearchCriteriaObj.symm = [];
    }
    else if (type == '3VG') {
      var ExData = this.allTheCPS?.find(z => z.name.toLowerCase() == 'ex');
      var VGData = this.allTheCPS?.find(z => z.name.toLowerCase() == 'vg');

      this.marketSheetSearchCriteriaObj.cut = [];
      this.marketSheetSearchCriteriaObj.cut.push(ExData?.name ?? 'EX');
      this.marketSheetSearchCriteriaObj.cut.push(VGData?.name ?? 'VG');

      this.marketSheetSearchCriteriaObj.polish = [];
      this.marketSheetSearchCriteriaObj.polish.push(ExData?.name ?? 'EX');
      this.marketSheetSearchCriteriaObj.polish.push(VGData?.name ?? 'VG');

      this.marketSheetSearchCriteriaObj.symm = [];
      this.marketSheetSearchCriteriaObj.symm.push(ExData?.name ?? 'EX');
      this.marketSheetSearchCriteriaObj.symm.push(VGData?.name ?? 'VG');
    }
    else if (type == 'Clear') {
      this.marketSheetSearchCriteriaObj.cut = [];
      this.marketSheetSearchCriteriaObj.polish = [];
      this.marketSheetSearchCriteriaObj.symm = [];
    }
    else if (type == 'BGM') {
      if (this.isBGM) {
        this.marketSheetSearchCriteriaObj.green = [];
        this.marketSheetSearchCriteriaObj.brown = [];
        this.marketSheetSearchCriteriaObj.milky = [];
        this.isBGM = false;
      }
      else {
        this.isBGM = true;

        const inclusions = [...this.inclusionData];
        let BrownData = inclusions.filter(item => item.type.toLowerCase().indexOf('brown') !== -1);
        var NoBrownData = BrownData.find(z => z.name.toLowerCase() == 'no');
        this.marketSheetSearchCriteriaObj.brown = [];
        this.marketSheetSearchCriteriaObj.brown.push(NoBrownData?.name ?? 'NO');

        var NoGreenData = inclusions.filter(item => item.type.toLowerCase().indexOf('green') !== -1).find(z => z.name.toLowerCase() == 'no');
        this.marketSheetSearchCriteriaObj.green = [];
        this.marketSheetSearchCriteriaObj.green.push(NoGreenData?.name ?? 'NO');

        var NoMilkyData = inclusions.filter(item => item.type.toLowerCase().indexOf('milky') !== -1).find(z => z.name.toLowerCase() == 'no');
        this.marketSheetSearchCriteriaObj.milky = [];
        this.marketSheetSearchCriteriaObj.milky.push(NoMilkyData?.name ?? 'NO');
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
    this.mySelection = [];
  }

  public openSearchDialog(): void {
    this.isSearchFilter = true;
  }

  public closeSearchDialog(): void {
    this.isSearchFilter = false;
    this.mySelection = [];
  }

  public openMediaDialog(title: string, src: string, type: string): void {
    this.mediaTitle = title;
    this.mediaSrc = src;
    this.mediaType = type;
    this.isShowMedia = true;
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

  public clearSearchCriteria(form: NgForm): void {
    let isBlockedFlag = this.marketSheetSearchCriteriaObj.isBlockClient;
    let clientId = this.marketSheetSearchCriteriaObj.customerId;
    this.marketSheetSearchCriteriaObj = new MarketSheetSearchCriteria();
    form.resetForm();
    this.firstCaratFrom = undefined;
    this.firstCaratTo = undefined;
    this.secondCaratFrom = undefined;
    this.secondCaratTo = undefined;
    this.thirdCaratFrom = undefined;
    this.thirdCaratTo = undefined;
    this.fourthCaratFrom = undefined;
    this.fourthCaratTo = undefined;
    this.marketSheetSearchCriteriaObj.isBlockClient = isBlockedFlag;
    this.marketSheetSearchCriteriaObj.customerId = clientId;

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

  //#region CURD Functions
  public checkRequiredFields(): void {
    this.isFormValid = this.validateFields();
  }

  public validateFields(): boolean {
    const obj = this.inventoryObj;

    return this.checkStringNullOrEmpty(obj.stoneId)
      && this.checkStringNullOrEmpty(obj.kapan)
      && this.checkStringNullOrEmpty(obj.article)
      && this.checkStringNullOrEmpty(obj.rfid)
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
    this.marketSheetSearchCriteriaObj.carat = carat ? carat : undefined;

    let fData = this.marketSheetSearchCriteriaObj.fromDate;
    this.marketSheetSearchCriteriaObj.fromDate = fData ? this.setUTCDateFilter(fData) : null;

    let tData = this.marketSheetSearchCriteriaObj.toDate;
    this.marketSheetSearchCriteriaObj.toDate = tData ? this.setUTCDateFilter(tData) : null;
  }

  private setUTCDateFilter(date: Date) {
    var newDate = moment(date.setHours(5)).toDate();
    newDate = moment(newDate.setMinutes(30)).toDate();
    return moment(newDate).toDate();
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
    // this.inventoryObj.inclusion.girdleBlack = this.matchDropDownField(this.inventoryObj.inclusion.girdleBlack, TypeFilterPipe.prototype.transform(this.inclusionData, 'girdleBlack'));
    this.inventoryObj.inclusion.centerBlack = this.matchDropDownField(this.inventoryObj.inclusion.centerBlack, TypeFilterPipe.prototype.transform(this.inclusionData, 'centerBlack'));
    this.inventoryObj.inclusion.sideWhite = this.matchDropDownField(this.inventoryObj.inclusion.sideWhite, TypeFilterPipe.prototype.transform(this.inclusionData, 'sideWhite'));
    this.inventoryObj.inclusion.centerSideWhite = this.matchDropDownField(this.inventoryObj.inclusion.centerSideWhite, TypeFilterPipe.prototype.transform(this.inclusionData, 'centerSideWhite'));
    // this.inventoryObj.inclusion.girdleWhite = this.matchDropDownField(this.inventoryObj.inclusion.girdleWhite, TypeFilterPipe.prototype.transform(this.inclusionData, 'girdleWhite'));
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

  //#region Export To Excel
  public exportToExcel() {
    var excelFile: any[] = [];
    let exportData = [...this.inventoryItems];
    if (this.excelOption == 'selected') {
      if (this.mySelection.length == 0) {
        this.spinnerService.hide();
        this.alertDialogService.show('Select at least one stone for export!');
        this.showExcelOption = false;
        return;
      }
      exportData = exportData.filter(item => this.mySelection.includes(item.id));
    }

    exportData.forEach(element => {
      var excel = this.convertArrayToObject(this.fields, element);
      excelFile.push(excel);
    });

    if (excelFile.length > 0) {
      let isExport: boolean = this.utilityService.exportAsExcelFile(excelFile, "Diamond_Excel_");
      if (isExport) {
        this.excelOption = null;
        this.showExcelOption = false;
      }
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
          obj[fields[i].title] = "$ " + (element.basePrice.netAmount / element.weight).toFixed(3);
        else if (fields[i].title == "Rap")
          obj[fields[i].title] = "$ " + element.basePrice.rap.toFixed(3);
        else if (fields[i].title == "Discount")
          obj[fields[i].title] = element.basePrice.discount.toFixed(3) + " %";
        else if (fields[i].title == "NetAmount")
          obj[fields[i].title] = "$ " + element.basePrice.netAmount.toFixed(3);
        else
          obj[fields[i].title] = element[fields[i].propertyName];
      }
    }
    return obj;
  }
  //#endregion
  //#region Summary
  public openSummary(): void {
    this.isSummary = true;
  }

  public closeSummary(): void {
    this.isSummary = false;
  }

  public async blockOrUnBlockStone(isBlocked: boolean) {
    try {
      this.alertDialogService.ConfirmYesNo(`Are you sure you want to ${isBlocked ? "block" : "unblock"} for selected stone(s)?`, `${isBlocked ? "Block" : "Unblock"} Stone`)
        .subscribe(async (res: any) => {
          if (res.flag) {
            this.spinnerService.show();
            this.skip = 0;
            let selectedInventoryItems: InventoryItems[] = this.inventoryItems.filter(item => this.mySelection.includes(item.id));
            if (selectedInventoryItems.length > 0) {
              if (isBlocked)
                selectedInventoryItems[0].blockedClients.push(this.fxCredentials?.id || null as any);
              else
                selectedInventoryItems[0].blockedClients.splice(selectedInventoryItems[0].blockedClients.indexOf(this.fxCredentials?.id || null as any), 1);

              let resBlock = await this.marketSheetService.marketSheetsBlockClient(selectedInventoryItems[0].id, selectedInventoryItems[0].blockedClients);
              if (resBlock) {
                this.spinnerService.hide();
                this.initInventoryData();
                this.utilityService.showNotification(`Stone has been ${isBlocked ? "blocked" : "unblocked"} successfully!`)
              }
              this.mySelection = [];
            }
          }
        });
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public showBlockedStone() {
    this.mySelection = [];
    this.marketSheetSearchCriteriaObj.isBlockClient = !this.marketSheetSearchCriteriaObj.isBlockClient;
    this.initInventoryData();
  }
  //#endregion End Summary
}
