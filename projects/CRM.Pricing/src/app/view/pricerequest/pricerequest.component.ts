import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { DataResult, GroupDescriptor, process } from '@progress/kendo-data-query';
import { EmployeeCriteria, GridDetailConfig, PriceAnalyticsRequest } from 'common/businessobjects';
import { fxCredential, GridMasterConfig, InclusionConfig, InventoryItems, InventorySearchCriteria, MasterDNorm, MeasurementConfig, PricingDiscountApiResponse, PricingHistory, PricingMarketSheetRequest, PricingMarketSheetResponse, PricingRequest } from 'common/entities';
import { GridConfig } from 'common/entities/configs/gridconfig';
import { ConfigService, EmployeeCriteriaService, GridPropertiesService, listPriceRequestFilterTypeItems, MasterConfigService, PricingService, UtilityService } from 'common/services';
import { AlertdialogService } from 'common/views';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { PriceReqResponse, PriceRequestApiModel, PricingRequestEntity } from '../../businessobjects';
import { InventoryService, PricingRequestService } from '../../services';

@Component({
  selector: 'app-pricerequest',
  templateUrl: './pricerequest.component.html'
})
export class PricerequestComponent implements OnInit {
  //#region Grid Init
  public groups: GroupDescriptor[] = [];
  public pageSize = 26;
  public skip = 0;
  public fields!: GridDetailConfig[];
  public gridView?: DataResult;
  public isRegEmployee: boolean = false;
  public filterFlag = true;
  public selectableSettings: SelectableSettings = { mode: 'multiple' };
  public skeletonArray = new Array(18);
  public mySelection: string[] = [];
  public isShowCheckBoxAll: boolean = true;
  //#endregion

  //#region Grid Config
  public isGridConfig: boolean = false;
  private fxCredentials!: fxCredential;
  public gridConfig!: GridConfig;
  public gridMasterConfigResponse!: GridMasterConfig;
  //#endregion

  //#region OnChange
  public isShowMedia: boolean = false;
  public showBulk = false;
  public isSlotFilter: boolean = false;
  public showSlotFilter: boolean = true;

  public isAllSelected: boolean = false;
  public isAnalytics: boolean = false;

  @ViewChild("anchor") public anchor!: ElementRef;
  @ViewChild("popup", { read: ElementRef }) public popup!: ElementRef;
  //#endregion

  //#region Media Data
  public mediaTitle!: string;
  public mediaSrc!: string;
  public mediaType!: string;
  //#endregion

  //#region List & Objects
  private filterData: { req: PriceRequestApiModel, res: PriceReqResponse } = { req: new PriceRequestApiModel(), res: new PriceReqResponse() };

  public allPricingRequests: PricingRequestEntity[] = [];
  public listPricingRequests: PricingRequestEntity[] = [];
  public selectedPricingRequests: PricingRequestEntity[] = [];

  public employeeCriteriaData: EmployeeCriteria[] = [];
  public selectedSlots: EmployeeCriteria[] = [];

  public listPriceRequestFilterTypeItems = listPriceRequestFilterTypeItems;
  public selectedBranchDNormItems: { text: string | null, value: string | null } = { text: null, value: null };

  public listPricingHistory: PricingHistory[] = [];
  public inventorySearchCriteriaObj: InventorySearchCriteria = new InventorySearchCriteria();

  public inventoryItems: InventoryItems[] = [];
  public priceAnalytics: InventoryItems[] = [];

  public inclusionData: MasterDNorm[] = [];
  public measurementData: MasterDNorm[] = [];
  public inclusionConfig: InclusionConfig = new InclusionConfig();
  public measurementConfig: MeasurementConfig = new MeasurementConfig();

  public totalStone: number = 0;
  public avgDays: number = 0;
  public available: number = 0;
  public inProcess: number = 0;
  public memo: number = 0;
  public lead: number = 0;
  public hold: number = 0;
  //#endregion

  public bulkDisc: number | null = null
  public isPricingRequest: boolean = false;
  // public priceChangableStonesStatus: string[] = ['stock', 'stockonhand', 'noncertified']

  constructor(private pricingRequestService: PricingRequestService,
    private formBuilder: FormBuilder,
    public utilityService: UtilityService,
    private spinnerService: NgxSpinnerService,
    private configService: ConfigService,
    private gridPropertiesService: GridPropertiesService,
    private alertDialogService: AlertdialogService,
    private sanitizer: DomSanitizer,
    private employeeCriteriaService: EmployeeCriteriaService,
    private pricingService: PricingService,
    private changeDetRef: ChangeDetectorRef,
    private inventoryService: InventoryService,
    private masterConfigService: MasterConfigService) { }

  public async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  //#region Init Data
  public async defaultMethodsLoad() {
    this.fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;
    await this.getGridConfiguration();
    await this.getMasterConfigData();
    await this.getEmployeeCriteriaData(this.fxCredentials.id);
  }

  public async getGridConfiguration() {
    try {
      this.spinnerService.show();
      this.gridConfig = await this.configService.getGridConfig(this.fxCredentials?.id ?? '', "PriceRequest", "PriceRequestGrid");
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
        this.gridMasterConfigResponse = await this.configService.getMasterGridConfig("PriceRequest", "PriceRequestGrid");
        if (this.gridMasterConfigResponse)
          this.fields = this.gridMasterConfigResponse.gridDetail;
        else
          this.fields = await this.gridPropertiesService.getPriceRequestGrid();
      }
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.alertDialogService.show(error);
      this.spinnerService.hide();
    }
  }

  public async getMasterConfigData() {
    //Master Config
    let masterConfigList = await this.masterConfigService.getAllMasterConfig();

    this.inclusionData = masterConfigList.inclusions;
    this.measurementData = masterConfigList.measurements;

    this.inclusionConfig = masterConfigList.inclusionConfig;
    this.measurementConfig = masterConfigList.measurementConfig;
  }

  public async getEmployeeCriteriaData(id: string) {
    try {
      this.employeeCriteriaData = await this.employeeCriteriaService.getEmpCriteriaByEmp(id);
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async getPriceRequestData() {
    try {
      if (this.selectedBranchDNormItems?.value == 'Inv' && this.selectedSlots.length == 0) {
        this.alertDialogService.show(`Please slelect at least one slot.`);
        return;
      }
      this.spinnerService.show();

      let req: PriceRequestApiModel = this.filterData.req;
      req.employeeId = this.fxCredentials.id;
      req.skip = this.skip;
      req.take = this.pageSize;

      let res = await this.pricingRequestService.getPricingRequest(req);
      if (res) {
        this.listPricingRequests = res.priceRequest;
        this.gridView = process(res.priceRequest, { group: this.groups });
        this.gridView.total = res.summaryData.totalCount;
        // this.totalWeight = res.totalWeight;
        // this.totalNetAmount = res.totalNetAmount;
        this.spinnerService.hide();
        this.closeSlotFilterDialog();
      } else
        this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public onFilterChange(e: any) {
    this.filterData = e;
    let req = this.filterData.req;
    let res = this.filterData.res;

    this.listPricingRequests = res.priceRequest;
    this.allPricingRequests = JSON.parse(JSON.stringify(this.listPricingRequests));
    this.gridView = process(res.priceRequest, { group: this.groups });
    this.gridView.total = res.summaryData.totalCount;

    this.selectedSlots = req.slots;
    this.inventorySearchCriteriaObj = req.invFilter;
    this.selectedBranchDNormItems.value = req.type;

    if (this.selectedBranchDNormItems.value == 'Pricing')
      this.isPricingRequest = true;
    else
      this.isPricingRequest = false;
  }

  public async getPriceAnalyticsData(stoneId: string) {
    try {
      this.spinnerService.show();
      var inv = this.listPricingRequests.find(z => z.stoneId == stoneId);
      if (inv != null) {
        let req: PriceAnalyticsRequest = {
          shape: inv.shape,
          weight: inv.weight,
          color: inv.color,
          cut: inv.cut,
          clarity: inv.clarity,
          polish: inv.polish,
          symmetry: inv.symmetry,
          fluorescence: inv.fluorescence,
          lab: inv.lab
        };

        this.priceAnalytics = await this.inventoryService.getPriceAnalytics(req);
        if (this.priceAnalytics) {
          this.totalStone = this.priceAnalytics.length;

          var totalDays: number[] = [];
          var currentDate = new Date();
          this.priceAnalytics.forEach(z => {
            if (z.marketSheetDate != null) {
              let dateSent = new Date(z.marketSheetDate);
              let days = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24));
              totalDays.push(days);
            }
          });

          this.avgDays = totalDays.length > 0 ? totalDays.reduce((a, u) => a + u, 0) : 0;
          this.available = 0;
          this.inProcess = 0;
          this.memo = 0;
          this.lead = 0;
          this.hold = this.priceAnalytics.filter(z => z.isHold == true).length;

          this.openAnalyticsDialog();
        }
        else
          this.alertDialogService.show('Inventory not found!');
        this.spinnerService.hide();
      }
      else
        this.alertDialogService.show('Inventory not found, Try again later!');
    }
    catch (error: any) {
      this.spinnerService.hide();
      console.error(error);
      this.alertDialogService.show(error.error);
    }
  }
  //#endregion

  //#region Temp Price CRUD
  public cellClickHandler(e: any) {
    if (!e.isEdited)
      e.sender.editCell(e.rowIndex, e.columnIndex, this.createFormGroup(e.dataItem));
  }

  public async cellCloseHandler(args: any) {
    try {
      let { formGroup, dataItem } = args;
      if (formGroup.dirty) {
        dataItem.identity.id = this.fxCredentials.id;
        dataItem.identity.name = this.fxCredentials.fullName;
        dataItem.identity.type = "Supplier";
        dataItem.createdBy = this.fxCredentials.id;
        dataItem.comments = formGroup.value.comments;

        let result!: string;
        if (dataItem.tempPrice.discount != formGroup.value.tempDisc) {
          dataItem.tempPrice.discount = formGroup.value.tempDisc;
          dataItem = await this.checkValidLimitation(dataItem);
          if (dataItem.isValid != null)
            dataItem = this.calculateRapPricing(dataItem);

          if (this.isPricingRequest)
            result = await this.pricingRequestService.insertOnePricingRequest(dataItem);
          else
            result = await this.pricingRequestService.insertOneTempPricing(dataItem);

        }
        else {
          if (this.isPricingRequest)
            result = await this.pricingRequestService.insertOnePricingRequest(dataItem);
          else
            result = await this.pricingRequestService.insertOneTempPricing(dataItem);
        }

        if (result) {
          this.utilityService.showNotification(`Data updated successfully!`);
          await this.getPriceRequestData();
          this.mySelection = [];
        }
        else
          this.alertDialogService.show(`Data insert fail, Try again later!`);
      }
    }
    catch (error: any) {
      console.error(error);
      this.alertDialogService.show(`Data insert fail, Try again later!`);
    }
  }

  public createFormGroup(dataItem: any): FormGroup {
    return this.formBuilder.group({
      tempDisc: dataItem.tempPrice.discount,
      comments: dataItem.comments
    });
  }

  public async applyBulkDiscount() {
    try {
      this.alertDialogService.ConfirmYesNo("Are you sure you want to bulk update discount?", "Update")
        .subscribe(async (res: any) => {
          if (res.flag) {
            this.spinnerService.show();
            let listPricingRequests = this.allPricingRequests.filter(z => this.mySelection.includes(z.stoneId));

            for (let index = 0; index < listPricingRequests.length; index++) {
              let z = listPricingRequests[index];
              z.tempPrice.discount = (parseFloat(z.basePrice.discount?.toString() ?? '0') + parseFloat(this.bulkDisc?.toString() ?? '0'));

              z.identity.id = this.fxCredentials.id;
              z.identity.name = this.fxCredentials.fullName;
              z.identity.type = "Supplier";
              z.createdBy = this.fxCredentials.id;

              z = await this.checkValidLimitation(z);
              if (z.isValid != null)
                z = this.calculateRapPricing(z);
            }

            let result!: boolean;
            if (this.isPricingRequest)
              result = await this.pricingRequestService.insertPricingRequest(listPricingRequests);
            else
              result = await this.pricingRequestService.insertTempPricing(listPricingRequests);

            if (result) {
              this.utilityService.showNotification(`Data updated successfully!`);
              this.spinnerService.hide();
              await this.getPriceRequestData();
            }
            else {
              this.spinnerService.hide();
              this.alertDialogService.show(`Data update fail, Try again later!`);
            }

            this.bulkDisc = null;
            this.showBulk = false;
            this.mySelection = [];
          }
        });
    }
    catch (error) {
      console.error(error);
      this.bulkDisc = null;
      this.showBulk = false;
      this.alertDialogService.show(`Data update fail, Try again later!`);
    }
  }

  public async updateBulkDiscount(type: string) {
    try {
      let listPricingRequests = this.allPricingRequests.filter(z => this.mySelection.includes(z.stoneId));
      this.spinnerService.show();
      listPricingRequests = JSON.parse(JSON.stringify(listPricingRequests));
      let failResCount: number = 0;

      if (type == 'Base')
        failResCount = await this.calculateBasePricing(listPricingRequests);
      else
        failResCount = await this.calculateMarketSheetPricing(listPricingRequests);

      if (failResCount == listPricingRequests.length) {
        this.utilityService.showNotification(`No rap discount not found!`, 'warning');
        this.spinnerService.hide();
        return;
      }
      else if (failResCount > 0)
        this.utilityService.showNotification(failResCount + ` rap discount not found!`, 'warning');

      let result!: boolean;
      if (this.isPricingRequest)
        result = await this.pricingRequestService.insertPricingRequest(listPricingRequests);
      else
        result = await this.pricingRequestService.insertTempPricing(listPricingRequests);

      if (result) {
        this.utilityService.showNotification(`Data updated successfully!`);
        await this.getPriceRequestData();
        this.spinnerService.hide();
      }
      else {
        this.spinnerService.hide();
        this.alertDialogService.show(`Data update fail, Try again later!`);
      }

    }
    catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show(`Something went wrong, Try again later!`);
    }
  }

  public async calculateBasePricing(listPricingRequests: PricingRequestEntity[]): Promise<number> {
    let reqList: PricingRequest[] = [];
    let response: PricingDiscountApiResponse[] = [];
    let failResCount: number = 0;

    listPricingRequests.forEach(async z => {
      let req: PricingRequest = {
        Lab: (z.lab && z.lab.length > 0) ? z.lab : "GIA",
        Rapver: "NONE",
        Id: z.stoneId,
        Shape: z.shape,
        Weight: z.weight,
        Color: (z.color?.toUpperCase() == 'O' || z.color?.toUpperCase() == 'P') ? 'M' : z.color?.toUpperCase(),
        Clarity: z.clarity,
        Cut: z.cut,
        Polish: z.polish,
        Symmetry: z.symmetry,
        Flour: z.fluorescence
      };
      reqList.push(req);
    });

    response = await this.pricingService.getBasePrice(reqList);
    if (response && response.length > 0) {
      for (let index = 0; index < listPricingRequests.length; index++) {
        let z = listPricingRequests[index];
        let target = response.find(a => a.Id == z.stoneId);
        if (target && target.Error == null) {
          target = this.utilityService.setAmtForPricingDiscountResponse(target, z.weight);
          z.tempPrice.rap = target.RapPrice;
          z.tempPrice.discount = target.Discount;
          z.tempPrice.netAmount = target.Amount;
          z.tempPrice.perCarat = target.DCaret;

          z.identity.id = this.fxCredentials.id;
          z.identity.name = this.fxCredentials.fullName;
          z.identity.type = "Supplier";
          z.createdBy = this.fxCredentials.id;
          z = await this.checkValidLimitation(z);
          if (z.isValid != null)
            failResCount--;
        }
        failResCount++;
      }
    }

    return failResCount;
  }

  public async calculateMarketSheetPricing(listPricingRequests: PricingRequestEntity[]): Promise<number> {
    let reqList: PricingMarketSheetRequest[] = [];
    let response: PricingMarketSheetResponse[] = [];
    let failResCount: number = 0;

    let listPricingGradeRequests = listPricingRequests.filter(z => z.inclusion.iGrade != null && z.measurement.mGrade != null);
    failResCount = listPricingRequests.length - listPricingGradeRequests.length;

    listPricingGradeRequests.forEach(async z => {
      let req: PricingMarketSheetRequest = {
        Lab: (z.lab && z.lab.length > 0) ? z.lab : "GIA",
        Id: z.stoneId,
        Shape: z.shape,
        Weight: z.weight,
        Color: (z.color?.toUpperCase() == 'O' || z.color?.toUpperCase() == 'P') ? 'M' : z.color?.toUpperCase(),
        Clarity: z.clarity,
        Cut: z.cut,
        Polish: z.polish,
        Symmetry: z.symmetry,
        Flour: z.fluorescence,
        MGrade: z.measurement.mGrade,
        IGrade: z.inclusion.iGrade,
        Day: this.calculateDayDiff(z.marketSheetDate ?? new Date())
      };
      reqList.push(req);
    });

    response = await this.pricingService.getMarketSheetPrice(reqList);
    if (response && response.length > 0) {
      for (let index = 0; index < listPricingGradeRequests.length; index++) {
        let z = listPricingGradeRequests[index];
        let target = response.find(a => a.Id == z.stoneId);
        if (target && target.Error == null) {
          target = this.utilityService.setAmtForPricingMarketSheetDiscountResponse(target, z.weight);
          z.tempPrice.rap = target.RapPrice;
          z.tempPrice.discount = target.Discount;
          z.tempPrice.netAmount = target.Amount;
          z.tempPrice.perCarat = target.DCaret;

          z.identity.id = this.fxCredentials.id;
          z.identity.name = this.fxCredentials.fullName;
          z.identity.type = "Supplier";
          z.createdBy = this.fxCredentials.id;
          z = await this.checkValidLimitation(z);
          if (z.isValid != null)
            failResCount--;
        }
        failResCount++;
      }
    }

    return failResCount;
  }

  public calculateDayDiff(dateSent: Date) {
    let date = new Date(dateSent);
    let currentDate = new Date();

    let days = Math.floor((currentDate.getTime() - date.getTime()) / 1000 / 60 / 60 / 24);
    return days;
  }

  public async checkValidLimitation(target: PricingRequestEntity): Promise<PricingRequestEntity> {
    var data = this.employeeCriteriaData.find(z => z.minWeight <= target.weight && z.maxWeight >= target.weight &&
      this.compareArrayString(target.shape, z.shape) &&
      this.compareArrayString(target.lab, z.lab, true) &&
      this.compareArrayString(target.color, z.color) &&
      this.compareArrayString(target.clarity, z.clarity) &&
      this.compareArrayString(target.cut, z.cut) &&
      this.compareArrayString(target.polish, z.polish) &&
      this.compareArrayString(target.symmetry, z.symmetry) &&
      this.compareArrayString(target.fluorescence, z.fluorescence));

    if (data != null) {
      let baseDisc = target.basePrice?.discount;
      if (target.basePrice?.discount == null) {
        target.isValid = true;
        return target;
      }
      if (!this.isPricingRequest)
        baseDisc = await this.getPreviousBaseDiscount(target);
      let diff: number = parseFloat(baseDisc?.toString() ?? '0') - parseFloat(target.tempPrice?.discount?.toString() ?? '0');
      if (diff > 0)
        target.isValid = (data.upLimit >= diff);
      else
        target.isValid = (data.downLimit >= Math.abs(diff));
    }
    else {
      target.isValid = false;
      this.alertDialogService.show(target.stoneId + ' slot criteria not exists!');
    }
    return target;
  }

  public async getPreviousBaseDiscount(target: PricingRequestEntity): Promise<number | null> {
    let pricingHistory = await this.pricingRequestService.getPricingHistory(target.stoneId);
    if (pricingHistory && pricingHistory.length > 0) {
      let todate = new Date();
      let todayData = pricingHistory.filter(z => this.matchDate(new Date(z.createdDate), todate));
      if (todayData && todayData.length > 0) {
        todayData = this.sortingDate(todayData);
        return todayData[0].price.discount;
      }
      else
        return target.basePrice?.discount;
    }
    else
      return target.basePrice?.discount;
  }

  public sortingDate(data: PricingHistory[]) {
    data = data.sort((n1, n2) => {
      let np1 = new Date(n1.createdDate);
      let np2 = new Date(n2.createdDate);

      if (np1 > np2)
        return 1;

      if (np1 < np2)
        return -1;

      return 0;
    });
    return data;
  }

  public matchDate(target: Date, filter: Date): boolean {
    let flag = true;

    if (target.getFullYear() != filter.getFullYear())
      return false;
    if (target.getMonth() != filter.getMonth())
      return false;
    if (target.getDate() != filter.getDate())
      return false;

    return flag;
  }

  public compareArrayString(target: string, filter: string[], isOptional: boolean = false): boolean {
    if (filter == null || filter.length == 0)
      return true;
    else if (filter != null && filter.length > 0 && (target == null || target.length == 0))
      return isOptional;
    else
      return filter.map(u => u?.toLowerCase()).includes(target.toLowerCase());
  }

  public calculateRapPricing(target: PricingRequestEntity): PricingRequestEntity {
    const rap = target.basePrice.rap;
    let disc = target.tempPrice.discount;
    if (rap && disc) {
      if (disc.toString() != '-') {

        disc = parseFloat(disc.toString());
        let weight = target.weight;
        let stoneRap = weight * rap;
        let calDiscount = 100 + disc;
        let netAmount = (calDiscount * stoneRap) / 100;

        target.tempPrice.rap = rap;
        target.tempPrice.netAmount = this.utilityService.ConvertToFloatWithTwoDecimal(netAmount);
        let perCarat = netAmount / weight;
        target.tempPrice.perCarat = this.utilityService.ConvertToFloatWithTwoDecimal(perCarat);
      }
    }
    return target;
  }

  public async onApplyChanges() {
    try {
      this.alertDialogService.ConfirmYesNo("Are you sure you want to apply discount?", "Update")
        .subscribe(async (res: any) => {
          if (res.flag) {
            let updatedData = this.allPricingRequests.filter(z => this.mySelection.includes(z.stoneId) && z.tempPrice.discount != null && z.isValid);
            if (updatedData.length > 0) {

              let result!: number;
              if (this.isPricingRequest)
                result = await this.pricingRequestService.updatePricingRequest(updatedData);
              else
                result = await this.pricingRequestService.updateTempPricing(updatedData);

              if (result) {
                this.utilityService.showNotification(result + ` Data updated successfully!`);
                await this.getPriceRequestData();
              }
              else
                this.alertDialogService.show(`Data update fail, Try again later!`);
            }
            else
              this.alertDialogService.show(`Please select valid stone(s) for apply changes!`);
            this.mySelection = [];
          }
        });
    }
    catch (error) {
      console.error(error);
      this.alertDialogService.show(`Data update fail, Try again later!`);
    }

  }
  //#endregion

  //#region OnChange Functions
  public sanitizeURL(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  public openGridConfigDialog(): void {
    this.isGridConfig = true;
  }

  public openAnalyticsDialog(): void {
    this.isAnalytics = true;
  }

  public closeAnalyticsDialog(): void {
    this.isAnalytics = false;
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

  public async expandPricingHistory(e: any) {
    let pricingHistory = await this.pricingRequestService.getPricingHistory(e.dataItem.stoneId);
    if (pricingHistory) {
      pricingHistory.forEach(z => {
        this.listPricingHistory.push(z);
      });
    }

    let invItems = await this.inventoryService.getInventoryByStoneId(e.dataItem.stoneId);
    if (invItems) {
      this.inventoryItems.push(invItems);
    }
  }

  public getlistPricingHistory(stoneId: string): PricingHistory[] {
    return this.listPricingHistory.filter(z => z.stoneId == stoneId);
  }

  public getInventoryItems(stoneId: string): InventoryItems[] {
    return this.inventoryItems.filter(z => z.stoneId == stoneId) ?? new InventoryItems();
  }

  public clearPricingHistory(e: any) {
    this.listPricingHistory = this.listPricingHistory.filter(z => z.stoneId != e.dataItem.stoneId);
    this.inventoryItems = this.inventoryItems.filter(z => z.stoneId != e.dataItem.stoneId);
  }

  public calculateDateDiff(date: Date): string {
    let today = new Date();
    let calDate = new Date(date);

    var diff = Math.abs(today.getTime() - calDate.getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24));

    if (today.getMonth() == calDate.getMonth() && today.getFullYear() == calDate.getFullYear())
      diffDays = today.getDate() - calDate.getDate();

    return diffDays.toString() + ' days ago';
  }

  public onTypeChange(e: any): void {
    if (e.value == "Inv") {
      this.selectedSlots = [];
      this.showSlotFilter = true;
    }
    else
      this.showSlotFilter = false;
  }

  public selectedRowChange(e: any) {
    if (e.selectedRows && e.selectedRows.length > 0) {
      let senitizeData = JSON.parse(JSON.stringify(e.selectedRows[0].dataItem));

      let index = this.allPricingRequests.findIndex(z => z.stoneId == senitizeData.stoneId);
      if (index > -1)
        this.allPricingRequests.splice(index, 1);

      let selectionData = this.mySelection.find(z => z == senitizeData.stoneId);
      if (selectionData == null)
        this.mySelection.push(senitizeData.stoneId);

      this.allPricingRequests.push(senitizeData);
    }
  }

  public groupChange(groups: GroupDescriptor[]): void {
    try {
      this.groups = groups;
      this.getPriceRequestData();
    }
    catch (error: any) {
      this.alertDialogService.show(error.error);
    }
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.getPriceRequestData();
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

  public onSelectEmployeeCriteria(data: EmployeeCriteria): void {
    if (this.selectedSlots.length > 0) {
      var index = this.selectedSlots.findIndex(z => z.id == data.id);
      if (index > -1)
        this.selectedSlots.splice(index, 1);
      else
        this.selectedSlots.push(data);
    } else
      this.selectedSlots.push(data);
  }

  public openSlotFilterDialog(): void {
    this.isSlotFilter = true;
  }

  public closeSlotFilterDialog(): void {
    this.isSlotFilter = false;
  }

  public onBulkToggle(): void {
    this.showBulk = !this.showBulk;
  }
  //#endregion

  //#region Select All
  public async loadAllInventories() {
    try {
      this.spinnerService.show();

      let req: PriceRequestApiModel = new PriceRequestApiModel();
      req.slots = this.selectedSlots;
      req.invFilter = this.inventorySearchCriteriaObj;
      req.type = this.selectedBranchDNormItems.value ?? 'Temp';
      req.employeeId = this.fxCredentials.id;
      req.skip = 0;
      req.take = this.filterData.res.summaryData.totalCount;

      let res = await this.pricingRequestService.getPricingRequest(req);
      if (res) {
        this.allPricingRequests = res.priceRequest;
        this.mySelection = [];
        this.mySelection = this.allPricingRequests.map(z => z.stoneId);
        this.spinnerService.hide();
      } else
        this.spinnerService.hide();

      this.changeDetRef.detectChanges();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async selectAllPricing(event: string, isAll: boolean) {
    if (event.toLowerCase() == 'checked') {
      if (this.filterData.res.summaryData.totalCount > this.pageSize && isAll) {
        await this.loadAllInventories();
        this.isAllSelected = false;
      }
      else {
        if (isAll || this.filterData.res.summaryData.totalCount < this.pageSize)
          this.isAllSelected = false;
        else if (this.filterData.res.summaryData.totalCount > this.pageSize)
          this.isAllSelected = true;

        this.mySelection = [];
        this.mySelection = this.listPricingRequests.map(z => z.stoneId);
        this.allPricingRequests = JSON.parse(JSON.stringify(this.listPricingRequests));
      }
    }
    else {
      this.mySelection = [];
      this.isAllSelected = false;
    }
  }
  //#endregion

  //#region Popup Close
  @HostListener("document:click", ["$event"])
  public documentClick(event: any): void {
    if (!this.contains(event.target)) {
      this.showBulk = false;
    }
  }

  private contains(target: any): boolean {
    return (
      this.anchor.nativeElement.contains(target) ||
      (this.popup ? this.popup.nativeElement.contains(target) : false)
    );
  }
  //#endregion



}