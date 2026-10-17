import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { DataResult, GroupDescriptor, process } from '@progress/kendo-data-query';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { GridDetailConfig } from 'shared/businessobjects';
import { fxCredential, GridConfig, GridMasterConfig, InclusionConfig, MasterConfig, MasterDNorm, MeasurementConfig, SearchQuery } from 'shared/enitites';
import { CommonService, ConfigService, listCustomerFilterLocation, listCustomerStoneStatus, listGrainingItems, UtilityService } from 'shared/services';
import { AlertdialogService } from 'shared/views';
import { CustomerInvSearchResponse, InvDetailData, CustomerInvSearchCriteria, ParseSearchQuery, ExportToExcelMailData } from '../../businessobjects';
import { Cart, Customer, CustomerDNorm, CustomerPreference } from '../../entities';
import { CartService, CustomerInvSearchService, CustomerLogService, CustomerPreferenceService, CustomerService, EmailService, GridPropertiesService, MasterConfigService, WatchlistService } from '../../services';

@Component({
  selector: 'app-searchresult',
  templateUrl: './searchresult.component.html',
  styles: [
  ]
})
export class SearchresultComponent implements OnInit {
  //#region Grid Init
  public groups: GroupDescriptor[] = [];
  public pageSize = 26;
  public skip = 0;
  public fields!: GridDetailConfig[];
  public gridView!: DataResult;
  public selectableSettings: SelectableSettings = {
    mode: 'multiple',
  };
  public mySelection: string[] = [];
  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  public isShowCheckBoxAll: boolean = true;
  //#endregion

  //#region Grid Config
  public isGridConfig: boolean = false;
  public gridConfig!: GridConfig;
  public gridMasterConfigResponse!: GridMasterConfig;
  //#endregion

  //#region List & Objects
  public invSearchCriteriaObj: CustomerInvSearchCriteria = new CustomerInvSearchCriteria();
  public tempInvSearchCriteriaObj: CustomerInvSearchCriteria = new CustomerInvSearchCriteria();

  public allInvItems: InvDetailData[] = [];
  public invItemObj: InvDetailData = new InvDetailData();
  public filterInventoryItems: InvDetailData[] = [];
  public selectedInventoryItems: InvDetailData[] = [];
  public selectedStoneIds: string[] = [];

  public searchResponseData: CustomerInvSearchResponse = new CustomerInvSearchResponse();

  public selectedCPS?: string;
  public isBGM: boolean = false;

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

  public fxCredentials?: fxCredential;

  public mediaSrc!: string
  public mediaType!: string

  public exportType: string = '';
  public excelFile: any[] = [];
  public exportToExcelMailObj: ExportToExcelMailData = new ExportToExcelMailData();

  public customerPreference: CustomerPreference = new CustomerPreference();
  public saveSearchData: ParseSearchQuery[] = [];
  public saveSearchName: string = '';
  //#endregion

  //#region Custom Models
  public newArrivalStoneDays = 10;

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

  public totalCount = '0';
  public totalWeight = '0.00';
  public totalNetAmount = '0.00';
  public avgDiscount = '0.00';
  public avgPerCarat = '0.00';
  public rNetAmount = '0.00';

  public showSelected = false;
  public pageFrom: string = "SearchResult";
  public selectedAmt: number = 0;

  public filterSaveSearch!: string | null;
  public isRemovingSaveSearch = false;
  //#endregion

  //#region Model Flag
  public isSearchFilter: boolean = false;
  public showDiamonddetailModal = false;
  public isShowMedia = false;
  public isCompareDialog = false;
  public isCheckout = false;
  public isExcelModal = false;
  public isSaveSearchNameModal = false;
  public isSendMail = false;
  //#endregion

  constructor(public sanitizer: DomSanitizer,
    private alertDialogService: AlertdialogService,
    public utilityService: UtilityService,
    private masterConfigService: MasterConfigService,
    private spinnerService: NgxSpinnerService,
    private commonService: CommonService,
    private configService: ConfigService,
    private gridPropertiesService: GridPropertiesService,
    private inventoryService: CustomerInvSearchService,
    private watchlistService: WatchlistService,
    private customerService: CustomerService,
    private customerPreferenceService: CustomerPreferenceService,
    private emailService: EmailService,
    private cartService: CartService,
    private customerLogService: CustomerLogService) { }

  public async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  //#region Init Data
  public async defaultMethodsLoad() {
    this.fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;
    await this.getMasterConfigData();
    this.openSearchDialog();
    await this.getGridConfiguration();
    await this.getCustomerPreferenceData();
  }

  public async getGridConfiguration() {
    try {
      this.spinnerService.show();
      this.gridConfig = await this.configService.getGridConfig(this.fxCredentials?.id ?? '', "SearchResultInventory", "SearchResultInventoryGrid");
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
        this.gridMasterConfigResponse = await this.configService.getMasterGridConfig("SearchResultInventory", "SearchResultInventoryGrid");
        if (this.gridMasterConfigResponse)
          this.fields = this.gridMasterConfigResponse.gridDetail;
        else
          this.fields = await this.gridPropertiesService.getSearchResultInventoryGrid();
      }
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.alertDialogService.show(error);
      this.spinnerService.hide();
    }
  }
  //#endregion

  //#region Master Config Data
  public async getMasterConfigData() {
    //Status
    listCustomerStoneStatus.forEach(z => { this.listStatus.push({ name: z.toString(), isChecked: false }); });
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

    listCustomerFilterLocation.forEach(z => { this.listLocation.push({ name: z.toString(), isChecked: false }); });
  }
  //#endregion

  //#region Grid Change Events
  public selectedRowChange(e: any) {
    this.selectedInventoryItems = [];
    if (this.mySelection.length > 0)
      this.selectedInventoryItems = this.allInvItems.filter(z => this.mySelection.includes(z.stoneId));
    this.calculateTotalAndAvg();
  }

  public calculateTotalAndAvg() {
    if (this.selectedInventoryItems.length > 0) {
      this.totalCount = this.selectedInventoryItems.length.toString();
      this.totalWeight = this.utilityService.ConvertToFloatWithTwoDecimal(this.selectedInventoryItems.map(z => z.weight).reduce((ty, u) => ty + u, 0)).toString();
      this.totalNetAmount = this.utilityService.ConvertToFloatWithTwoDecimal(this.selectedInventoryItems.map(z => z.price.netAmount ?? 0).reduce((ty, u) => ty + u, 0)).toString();
      this.avgDiscount = this.utilityService.ConvertToFloatWithTwoDecimal(this.selectedInventoryItems.reduce((a, u) => a + (u.price.discount ?? 0), 0) / this.selectedInventoryItems.length).toString();
      this.avgPerCarat = this.utilityService.ConvertToFloatWithTwoDecimal(this.selectedInventoryItems.reduce((a, u) => a + (u.price.perCarat ?? 0), 0) / this.selectedInventoryItems.length).toString();
      this.rNetAmount = this.utilityService.ConvertToFloatWithTwoDecimal(this.selectedInventoryItems.map(z => ((z.price.rap ?? 0) * z.weight)).reduce((ty, u) => ty + u, 0)).toString();
    }
    else {
      this.totalCount = '0';
      this.totalWeight = '0.00';
      this.totalNetAmount = '0.00';
      this.avgDiscount = '0.00';
      this.avgPerCarat = '0.00';
      this.rNetAmount = '0.00';
    }

  }

  public groupChange(groups: GroupDescriptor[]): void {
    try {
      this.groups = groups;
      this.getInventoryBySearchCriteria();
    }
    catch (error: any) {
      this.alertDialogService.show(error.error);
    }
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.getInventoryBySearchCriteria();
  }

  public selectAll(e: any) {
    // if (e.currentTarget.checked) {
    //   this.mySelection = [];
    //   let data = this.filterInventoryItems.map(z => z.id);
    //   this.mySelection.push(...data);
    // }
    // else
    //   this.mySelection = [];
  }

  public sanitizeURL(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  //#endregion

  //#region Get Search By Filter
  public async getInventoryBySearchCriteria() {
    try {
      this.spinnerService.show();
      this.tempInvSearchCriteriaObj = JSON.parse(JSON.stringify(this.invSearchCriteriaObj));
      let res = await this.inventoryService.getInventoryItemsBySearch(this.invSearchCriteriaObj, this.skip, this.pageSize);
      if (res) {
        this.filterInventoryItems = JSON.parse(JSON.stringify(res.inventories));
        this.setAllInventoryArrayData(res.inventories);
        this.searchResponseData = res;
        this.setGridData();
      }
      else {
        this.spinnerService.hide();
        this.alertDialogService.show('Something went wrong, Try again later!');
      }
    }
    catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show('Something went wrong, Try again later!');
    }
  }

  public async filterBySearch() {
    this.spinnerService.show();
    this.skip = 0;
    this.mySelection = [];
    this.assignAdditionalData();
    await this.getInventoryBySearchCriteria();
    this.isSearchFilter = false;
  }

  public clearSearchCriteria(form: NgForm): void {
    this.invSearchCriteriaObj = new CustomerInvSearchCriteria();
    form.resetForm();
    this.firstCaratFrom = undefined;
    this.firstCaratTo = undefined;
    this.secondCaratFrom = undefined;
    this.secondCaratTo = undefined;
    this.thirdCaratFrom = undefined;
    this.thirdCaratTo = undefined;
    this.fourthCaratFrom = undefined;
    this.fourthCaratTo = undefined;
  }

  public assignAdditionalData(): void {
    let carat = null;
    carat = this.firstCaratFrom ? (this.firstCaratTo ? this.firstCaratFrom + "-" + this.firstCaratTo : "") : "";
    carat += this.secondCaratFrom ? (this.secondCaratTo ? "," + this.secondCaratFrom + "-" + this.secondCaratTo : "") : "";
    carat += this.thirdCaratFrom ? (this.thirdCaratTo ? "," + this.thirdCaratFrom + "-" + this.thirdCaratTo : "") : "";
    carat += this.fourthCaratFrom ? (this.fourthCaratTo ? "," + this.fourthCaratFrom + "-" + this.fourthCaratTo : "") : "";
    this.invSearchCriteriaObj.carat = carat ? carat : undefined;

    let fData = this.invSearchCriteriaObj.fromDate;
    this.invSearchCriteriaObj.fromDate = fData ? this.setUTCDateFilter(fData) : null;

    let tData = this.invSearchCriteriaObj.toDate;
    this.invSearchCriteriaObj.toDate = tData ? this.setUTCDateFilter(tData) : null;
  }

  private setUTCDateFilter(date: Date) {
    var newDate = moment(date.setHours(5)).toDate();
    newDate = moment(newDate.setMinutes(30)).toDate();
    return moment(newDate).toDate();
  }

  public setGridData() {
    this.gridView = process(this.searchResponseData.inventories, { group: this.groups });
    this.gridView.total = this.searchResponseData.totalCount;
    this.spinnerService.hide();
  }
  //#endregion

  //#region OnChange Functions
  public setAllInventoryArrayData(invs: InvDetailData[]) {
    invs.forEach(z => {
      let allIndex = this.allInvItems.findIndex(a => a.stoneId == z.stoneId);
      if (allIndex == -1)
        this.allInvItems.push(JSON.parse(JSON.stringify(z)));
    });
  }

  public showSelectedInventories() {
    this.spinnerService.show();
    if (this.showSelected) {
      this.gridView = process(this.selectedInventoryItems, { group: this.groups });
      this.gridView.total = this.selectedInventoryItems.length;
      this.spinnerService.hide();
    } else
      this.setGridData();
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

  public tagMapper(tags: string[]): void {
    // This function is used for hide selected items in multiselect box
  }

  public checkCPS(type?: string) {
    if (type == 'BGM') {
      var NoMilkyData = this.inclusionData.filter(item => item.type.toLowerCase().indexOf('milky') !== -1).find(z => z.name.toLowerCase() == 'no');
      var checkMilky = this.invSearchCriteriaObj.milky.indexOf(NoMilkyData?.name ?? 'NO');

      var NoGreenData = this.inclusionData.filter(item => item.type.toLowerCase().indexOf('green') !== -1).find(z => z.name.toLowerCase() == 'no');
      var checkGreen = this.invSearchCriteriaObj.green.indexOf(NoGreenData?.name ?? 'NO');

      let BrownData = this.inclusionData.filter(item => item.type.toLowerCase().indexOf('brown') !== -1).find(z => z.name.toLowerCase() == 'no');
      var checkBrown = this.invSearchCriteriaObj.brown.indexOf(BrownData?.name ?? 'NO');

      if (checkMilky > -1 && checkGreen > -1 && checkBrown > -1)
        this.isBGM = true;
      else
        this.isBGM = false;
    }
    else {
      var ExData = this.allTheCPS?.find(z => z.name.toLowerCase() == 'ex');
      var VGData = this.allTheCPS?.find(z => z.name.toLowerCase() == 'vg');

      var checkCutEX = this.invSearchCriteriaObj.cut.indexOf(ExData?.name ?? 'EX');
      var checkPolishEX = this.invSearchCriteriaObj.polish.indexOf(ExData?.name ?? 'EX');
      var checkSymmEX = this.invSearchCriteriaObj.symm.indexOf(ExData?.name ?? 'EX');

      var checkCutVG = this.invSearchCriteriaObj.cut.indexOf(VGData?.name ?? 'VG');
      var checkPolishVG = this.invSearchCriteriaObj.polish.indexOf(VGData?.name ?? 'VG');
      var checkSymmVG = this.invSearchCriteriaObj.symm.indexOf(VGData?.name ?? 'VG');

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
      this.invSearchCriteriaObj.cut = [];
      this.invSearchCriteriaObj.cut.push(ExData?.name ?? 'EX');

      this.invSearchCriteriaObj.polish = [];
      this.invSearchCriteriaObj.polish.push(ExData?.name ?? 'EX');

      this.invSearchCriteriaObj.symm = [];
      this.invSearchCriteriaObj.symm.push(ExData?.name ?? 'EX');
    }
    else if (type == '2EX') {
      var ExData = this.allTheCPS?.find(z => z.name.toLowerCase() == 'ex');
      this.invSearchCriteriaObj.cut = [];
      this.invSearchCriteriaObj.cut.push(ExData?.name ?? 'EX');

      this.invSearchCriteriaObj.polish = [];
      this.invSearchCriteriaObj.polish.push(ExData?.name ?? 'EX');

      this.invSearchCriteriaObj.symm = [];
    }
    else if (type == '3VG') {
      var ExData = this.allTheCPS?.find(z => z.name.toLowerCase() == 'ex');
      var VGData = this.allTheCPS?.find(z => z.name.toLowerCase() == 'vg');

      this.invSearchCriteriaObj.cut = [];
      this.invSearchCriteriaObj.cut.push(ExData?.name ?? 'EX');
      this.invSearchCriteriaObj.cut.push(VGData?.name ?? 'VG');

      this.invSearchCriteriaObj.polish = [];
      this.invSearchCriteriaObj.polish.push(ExData?.name ?? 'EX');
      this.invSearchCriteriaObj.polish.push(VGData?.name ?? 'VG');

      this.invSearchCriteriaObj.symm = [];
      this.invSearchCriteriaObj.symm.push(ExData?.name ?? 'EX');
      this.invSearchCriteriaObj.symm.push(VGData?.name ?? 'VG');
    }
    else if (type == 'Clear') {
      this.invSearchCriteriaObj.cut = [];
      this.invSearchCriteriaObj.polish = [];
      this.invSearchCriteriaObj.symm = [];
    }
    else if (type == 'BGM') {
      if (this.isBGM) {
        this.invSearchCriteriaObj.green = [];
        this.invSearchCriteriaObj.brown = [];
        this.invSearchCriteriaObj.milky = [];
        this.isBGM = false;
      }
      else {
        this.isBGM = true;

        const inclusions = [...this.inclusionData];
        let BrownData = inclusions.filter(item => item.type.toLowerCase().indexOf('brown') !== -1);
        var NoBrownData = BrownData.find(z => z.name.toLowerCase() == 'no');
        this.invSearchCriteriaObj.brown = [];
        this.invSearchCriteriaObj.brown.push(NoBrownData?.name ?? 'NO');

        var NoGreenData = inclusions.filter(item => item.type.toLowerCase().indexOf('green') !== -1).find(z => z.name.toLowerCase() == 'no');
        this.invSearchCriteriaObj.green = [];
        this.invSearchCriteriaObj.green.push(NoGreenData?.name ?? 'NO');

        var NoMilkyData = inclusions.filter(item => item.type.toLowerCase().indexOf('milky') !== -1).find(z => z.name.toLowerCase() == 'no');
        this.invSearchCriteriaObj.milky = [];
        this.invSearchCriteriaObj.milky.push(NoMilkyData?.name ?? 'NO');
      }
    }
  }

  public calculateDateDiff(createdDate: Date): boolean {
    createdDate = new Date(createdDate);
    let currentDate = new Date();

    let days = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate())) / (1000 * 60 * 60 * 24));
    if (days <= this.newArrivalStoneDays)
      return true;
    else
      return false;
  }
  //#endregion

  //#region Model Changes
  public openExcelDialog() {
    this.isExcelModal = true;
  }

  public closeExcelDialog() {
    this.isExcelModal = false;
  }

  public openSearchDialog() {
    this.isSearchFilter = true;
  }

  public closeSearchDialog() {
    this.isSearchFilter = false;
  }

  public openDiamonddetailSidebar(inv: InvDetailData) {
    this.showDiamonddetailModal = false;
    this.invItemObj = inv;
    setTimeout(() => { this.showDiamonddetailModal = true; }, 0);
  }

  public openMediaDialog(src: string, type: string): void {
    this.mediaSrc = src;
    this.mediaType = type;
    this.isShowMedia = true;
  }

  public openCompareDialog(): void {
    this.selectedStoneIds = this.selectedInventoryItems.map(z => z.stoneId);
    this.isCompareDialog = true;
  }

  public closeCompareDialog(): void {
    this.isCompareDialog = false;
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

  public openCheckoutDialog(): void {
    this.selectedStoneIds = this.selectedInventoryItems.map(z => z.invId);
    this.selectedAmt = Number(parseFloat(this.totalNetAmount));
    this.isCheckout = true;
  }

  public async parentMethodCall() {
    this.isCheckout = false;
    await this.getInventoryBySearchCriteria();
  }

  public openSaveSearchNameModal(): void {
    this.isSaveSearchNameModal = true;
    this.saveSearchName = '';
  }

  public closeSaveSearchNameModal(): void {
    this.isSaveSearchNameModal = false;
  }

  public openSendMailDialog(): void {
    this.isSendMail = true;
  }

  public closeSendMailDialog(): void {
    this.isSendMail = false;
    this.clearSendMail();
  }
  //#endregion

  //#region Watch list
  public async addWatchlistData() {
    try {
      if (this.selectedInventoryItems.length > 0) {
        this.spinnerService.show();
        var stoneIds = this.selectedInventoryItems.map(z => z.stoneId);
        var res = await this.watchlistService.insertWatchListsFromInvIds(stoneIds, this.fxCredentials?.id ?? '');
        if (res) {
          this.spinnerService.hide();
          this.alertDialogService.show(res);
        }
        else {
          this.spinnerService.hide();
          this.alertDialogService.show('Something went wrong, Try again later!');
        }
      }
    }
    catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show('Something went wrong, Try again later!');
    }
  }
  //#endregion

  //#region Add to cart
  public async addToCartData() {
    if (this.selectedInventoryItems.length > 0) {
      this.alertDialogService.ConfirmYesNo("Are you sure you want to add to cart?", "Cart")
        .subscribe(async (res: any) => {
          if (res.flag) {
            try {

              let customerDetail: Customer = await this.customerService.getCustomerById(this.fxCredentials?.id ?? '');
              if (customerDetail) {
                this.spinnerService.show();
                var data = this.mappingCartData(this.selectedInventoryItems, customerDetail);
                var result = await this.cartService.insertCartsAsync(data);
                if (result) {
                  this.spinnerService.hide();
                  this.alertDialogService.show(result);
                }
                else {
                  this.spinnerService.hide();
                  this.alertDialogService.show('Something went wrong, Try again later!');
                }
              } else
                this.alertDialogService.show('Customer not found, Try login again!');
            }
            catch (error: any) {
              console.error(error);
              this.spinnerService.hide();
              this.alertDialogService.show('Something went wrong, Try again later!');
            }
          }
        });
    }
  }

  public mappingCartData(invs: InvDetailData[], customer: Customer): Cart[] {
    let carts: Cart[] = [];

    let customerDNorm = new CustomerDNorm();
    customerDNorm.id = customer.id;
    customerDNorm.name = customer.fullName;
    customerDNorm.email = customer.email;
    customerDNorm.mobile = customer.mobile1;

    invs.forEach(z => {
      let addCart = new Cart();

      addCart.customer = customerDNorm;
      addCart.seller = customer.seller;
      addCart.invId = z.invId;
      addCart.stoneId = z.stoneId;
      addCart.WebPlatform = "Online";

      carts.push(addCart);
    });

    return carts;
  }
  //#endregion

  //#region Export Data
  public async exportToExcel() {
    try {
      this.spinnerService.show();
      let data: InvDetailData[] = [];
      if (this.exportType == 'Selected') {
        if (this.selectedInventoryItems.length == 0) {
          this.alertDialogService.show('No selected stone(s) found!');
          return;
        }
        data = this.selectedInventoryItems;
      }
      else if (this.exportType == 'Search') {
        let res = await this.inventoryService.getAllInventoryItemsBySearch(this.invSearchCriteriaObj);
        if (res)
          data = res;
      } else {
        this.spinnerService.hide();
        this.alertDialogService.show('Select type for export to excel!');
        return;
      }

      this.generateExcelData(data);
      if (this.excelFile.length > 0)
        this.utilityService.exportAsExcelFile(this.excelFile, "Search_Stones_Excel_");

      this.closeExcelDialog();
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  private async generateExcelData(data: InvDetailData[]) {
    this.excelFile = [];
    let i = 0;
    var totalWeight = 0;
    var totalNetAmount = 0;
    data.forEach(z => {
      totalWeight += z.weight;
      totalNetAmount += (z.price.netAmount ? z.price.netAmount : 0);

      var excel = {
        CertificateUrl: z.certificateUrl,
        ImageUrl: z.imageUrl,
        VideoUrl: z.videoUrl,
        'Stock Id': z.stoneId,
        'Certificate No': z.certificateNo,
        'Shape': z.shape,
        Size: z.weight,
        Color: z.color,
        Clarity: z.clarity,
        Cut: z.cut,
        Polish: z.polish,
        Symmetry: z.symmetry,
        Flouresence: z.fluorescence,
        Length: z.measurement.length,
        Width: z.measurement.width,
        Height: z.measurement.height,
        Depth: z.measurement.depth,
        Table: z.measurement.table,
        Lab: z.lab,
        Rap: z.price.rap,
        'Disc%': z.price.discount + "%",
        '$/Ct': z.price.perCarat,
        'Net Amount': z.price.netAmount,
        Location: z.location
      }
      this.excelFile.push(excel);

      i++;
    });

    let obj: any = {
      CertificateUrl: '',
      ImageUrl: '',
      VideoUrl: '',
      'Stock Id': '',
      'Certificate No': '',
      'Shape': '',
      Size: totalWeight,//.toFixed(2),
      Color: '',
      Clarity: '',
      Cut: '',
      Polish: '',
      Symmetry: '',
      Flouresence: '',
      Length: '',
      Width: '',
      Height: '',
      Depth: '',
      Table: '',
      Lab: '',
      Rap: '',
      'Disc%': '',
      '$/Ct': '',
      'Net Amount': "$" + totalNetAmount,//.toFixed(3),
      Location: ''
    }
    this.excelFile.push(obj);
  }
  //#endregion

  //#region Send Email
  public async downloadAttachment() {
    try {
      this.spinnerService.show();

      let data: InvDetailData[] = [];
      if (this.exportType == 'Selected') {
        if (this.selectedInventoryItems.length == 0) {
          this.alertDialogService.show('No selected stone(s) found!');
          return;
        }
        data = this.selectedInventoryItems;
      }
      else if (this.exportType == 'Search') {
        let res = await this.inventoryService.getAllInventoryItemsBySearch(this.invSearchCriteriaObj);
        if (res)
          data = res;
      } else {
        this.spinnerService.hide();
        this.alertDialogService.show('Select type for export to excel!');
        return;
      }

      this.generateExcelData(data);

      if (this.excelFile.length > 0)
        this.utilityService.exportAsExcelFile(this.excelFile, "Diamond_Excel");

      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
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

      let data: InvDetailData[] = [];
      if (this.exportType == 'Selected') {
        if (this.selectedInventoryItems.length == 0) {
          this.alertDialogService.show('No selected stone(s) found!');
          return;
        }
        data = this.selectedInventoryItems;
      }
      else if (this.exportType == 'Search') {
        let res = await this.inventoryService.getAllInventoryItemsBySearch(this.invSearchCriteriaObj);
        if (res)
          data = res;
      } else {
        this.spinnerService.hide();
        this.alertDialogService.show('Select type for export to excel!');
        return;
      }

      let fileName = "Diamond_Excel";
      this.generateExcelData(data);
      this.exportToExcelMailObj.systemUserId = this.fxCredentials?.id ?? '';
      this.exportToExcelMailObj.excelBase64String = this.utilityService.exportAsExcelFileBase64(this.excelFile);;
      this.exportToExcelMailObj.excelFileName = this.utilityService.exportFileName(fileName);
      this.exportToExcelMailObj.excelMediaType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      let res = await this.emailService.sendEmailAsync(this.exportToExcelMailObj);
      if (res && res.isSuccess) {
        this.utilityService.showNotification(res.message);
        this.closeSendMailDialog();
        this.spinnerService.hide();
      }
      else {
        console.error(res);
        if (res)
          this.alertDialogService.show(res.message);
        else
          this.alertDialogService.show("Something went wrong, Try again later");
        this.spinnerService.hide();
      }
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

  public clearSendMail(): void {
    this.exportToExcelMailObj = new ExportToExcelMailData();
  }
  //#endregion

  //#region Customer Preference | Save Search
  public async getCustomerPreferenceData() {
    try {
      this.spinnerService.show();
      var data = await this.customerPreferenceService.getCustomerPreferenceByCustomer(this.fxCredentials?.id ?? '');
      if (data) {
        this.customerPreference = data;

        this.saveSearchData = [];
        data.savedSearches.forEach(z => {
          let obj: ParseSearchQuery = new ParseSearchQuery();
          obj.name = z.name;
          obj.query = JSON.parse(z.query);
          obj.expiryDate = z.expiryDate;
          obj.createdAt = z.createdAt;
          this.saveSearchData.push(obj);
        });

        this.spinnerService.hide();
      }
      else
        this.spinnerService.hide();
    }
    catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show('Something went wrong, Try again later!');
    }
  }

  public async addSaveSearch() {
    try {
      if (this.saveSearchName.length > 0) {
        var exists = this.saveSearchData.find(z => z.name.toLowerCase() == this.saveSearchName.toLowerCase())
        if (exists != null) {
          this.alertDialogService.show('Save search name already exists!');
          return;
        }

        this.spinnerService.show();
        var newData = new SearchQuery();
        newData.name = this.saveSearchName;
        newData.query = JSON.stringify(this.invSearchCriteriaObj);
        newData.createdAt = new Date();

        this.customerPreference.savedSearches.push(newData);
        var result = await this.customerPreferenceService.updateCustomerPreference(this.customerPreference);
        if (result) {
          this.utilityService.showNotification('Save Search added successfully!');
          await this.getCustomerPreferenceData();
          await this.filterBySearch();
        }
        else
          this.spinnerService.hide();

        this.closeSaveSearchNameModal();
      }
    }
    catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show('Something went wrong, Try again later!');
    }
  }

  public async removeSaveSearch(name: string) {
    try {
      var index = this.saveSearchData.findIndex(z => z.name == name)

      this.customerPreference.savedSearches.splice(index, 1);
      var result = await this.customerPreferenceService.updateCustomerPreference(this.customerPreference);
      if (result) {
        await this.getCustomerPreferenceData();
        this.utilityService.showNotification('Save search removed!');
        this.spinnerService.hide();
      }
      else
        this.spinnerService.hide();

      this.filterSaveSearch = null;
      this.isRemovingSaveSearch = false;
    }
    catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show('Something went wrong, Try again later!');
    }
  }

  public async onSaveSearchChange(e: any) {
    await setTimeout(async () => {
      if (this.isRemovingSaveSearch == true)
        return;

      var exists = this.saveSearchData.find(z => z.name == e)
      if (exists != null) {
        this.spinnerService.show();
        this.invSearchCriteriaObj = JSON.parse(JSON.stringify(exists.query));
        this.skip = 0;
        await this.filterBySearch();
      }
      else {
        this.filterInventoryItems = [];
      }
    }, 0);
  }
  //#endregion
}
