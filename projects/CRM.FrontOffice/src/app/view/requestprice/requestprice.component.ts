import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { DataResult, GroupDescriptor, process } from '@progress/kendo-data-query';
import { GridDetailConfig, MfgInclusionData, MfgMeasurementData, MfgPricingRequest, PricingDiscountApiResponse, PricingMarketSheetRequest, PricingMarketSheetResponse } from 'shared/businessobjects';
import { fxCredential, GridConfig, GridMasterConfig, InclusionConfig, MasterDNorm, MeasurementConfig } from 'shared/enitites';
import { ConfigService, listPriceRequestFilterTypeItems, listColorMarkItems, PricingService, StoneStatus, UtilityService } from 'shared/services';
import { AlertdialogService } from 'shared/views';
import { NgxSpinnerService } from 'ngx-spinner';
import { InventorySearchCriteria, InventorySearchResponse, PriceAnalyticsRequest, PriceReqResponse, PriceRequestApiModel } from '../../businessobjects';
import { GradingService, GridPropertiesService, MasterConfigService, PricingConfigService, PricingRequestService, SpecialstonecriteriaService, SupplierApiRequestService, SupplierService, UserPricingCriteriaService } from '../../services';
import { GradingMaster, InventoryItems, PriceDNorm, PricingConfig, PricingHistory, PricingRequest, SpecialStoneCriteria, Supplier, UserPricingCriteria } from '../../entities';
import { NotificationService } from 'common/services';

@Component({
  selector: 'app-requestprice',
  templateUrl: './requestprice.component.html'
})
export class RequestPriceComponent implements OnInit {
  //#region Grid Init
  public groups: GroupDescriptor[] = [];
  public pageSize = 25;
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

  public iscolorMark: boolean = false;
  public isSummary: boolean = false;
  public showExcelOption = false;

  @ViewChild("anchorExcel") public anchorExcel!: ElementRef;
  @ViewChild("popupExcel", { read: ElementRef }) public popupExcel!: ElementRef;
  //#endregion

  //#region Media Data
  public mediaTitle!: string;
  public mediaSrc!: string;
  public mediaType!: string;
  //#endregion

  //#region List & Objects
  public filterData: { req: PriceRequestApiModel, res: PriceReqResponse } = { req: new PriceRequestApiModel(), res: new PriceReqResponse() };

  public allPricingRequests: PricingRequest[] = [];
  public listPricingRequests: PricingRequest[] = [];
  public selectedPricingRequests: PricingRequest[] = [];

  public employeeCriteriaData: UserPricingCriteria[] = [];
  public selectedSlots: UserPricingCriteria[] = [];

  public listPriceRequestFilterTypeItems = listPriceRequestFilterTypeItems;
  public selectedBranchDNormItems: { text: string | null, value: string | null } = { text: 'Pricing', value: 'Pricing' };

  public listPricingHistory: PricingHistory[] = [];
  public inventorySearchCriteriaObj: InventorySearchCriteria = new InventorySearchCriteria();

  public inventoryItems: InventoryItems[] = [];
  public priceAnalytics: InventoryItems[] = [];

  public allTheLab!: MasterDNorm[];
  public allTheShapes!: MasterDNorm[];
  public allColors!: MasterDNorm[];
  public allClarities!: MasterDNorm[];
  public allTheFluorescences!: MasterDNorm[];
  public allTheCPS!: MasterDNorm[];

  public inclusionData: MasterDNorm[] = [];
  public measurementData: MasterDNorm[] = [];
  public inclusionConfig: InclusionConfig = new InclusionConfig();
  public measurementConfig: MeasurementConfig = new MeasurementConfig();

  public suppliers: Supplier[] = [];

  public totalStone: number = 0;
  public avgDays: number = 0;
  public available: number = 0;
  public inProcess: number = 0;
  public memo: number = 0;
  public lead: number = 0;
  public hold: number = 0;

  public listColorMarkItems = listColorMarkItems;
  public selectedColorMark: string = '';

  public summaryData: InventorySearchResponse = new InventorySearchResponse();

  public excelOption!: string | null;
  public excelFile: any[] = [];

  public specialStoneCriteriaData: SpecialStoneCriteria[] = [];

  public gradingMasterItem: GradingMaster[] = [];

  public pricingConfig: PricingConfig = new PricingConfig();
  //#endregion

  public bulkDisc: number | null = null
  // public priceChangableStonesStatus: string[] = ['stock', 'stockonhand', 'noncertified']

  constructor(private pricingRequestService: PricingRequestService,
    private formBuilder: FormBuilder,
    public utilityService: UtilityService,
    private spinnerService: NgxSpinnerService,
    private configService: ConfigService,
    private gridPropertiesService: GridPropertiesService,
    private alertDialogService: AlertdialogService,
    private sanitizer: DomSanitizer,
    private employeeCriteriaService: UserPricingCriteriaService,
    private pricingService: PricingService,
    private changeDetRef: ChangeDetectorRef,
    private masterConfigService: MasterConfigService,
    private notificationService: NotificationService,
    private gradingService: GradingService,
    private supplierService: SupplierService,
    private supplierApiRequestService: SupplierApiRequestService,
    private pricingConfigService: PricingConfigService,
    private specialstonecriteriaService: SpecialstonecriteriaService) {
    this.notificationService.getMessage();
  }

  public async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  //#region Init Data
  public async defaultMethodsLoad() {
    this.fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;
    await this.getGridConfiguration();
    await this.getSpecialStoneCriteriaData();
    await this.getMasterConfigData();
    await this.getUserPricingCriteriaData(this.fxCredentials.id);
    await this.getPricingConfig();
    await this.getSupplierDetail();
    await this.getPriceRequestData();
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

  public async getSpecialStoneCriteriaData() {
    try {
      this.specialStoneCriteriaData = await this.specialstonecriteriaService.getAllSpecialStoneCriteria();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async getMasterConfigData() {
    //Master Config
    let masterConfigList = await this.masterConfigService.getAllMasterConfig();
    this.allTheShapes = this.utilityService.sortingMasterDNormPriority(masterConfigList.shape);
    this.allColors = this.utilityService.sortingMasterDNormPriority(masterConfigList.colors);
    this.allClarities = this.utilityService.sortingMasterDNormPriority(masterConfigList.clarities);
    this.allTheFluorescences = this.utilityService.sortingMasterDNormPriority(masterConfigList.fluorescence);
    this.allTheCPS = this.utilityService.sortingMasterDNormPriority(masterConfigList.cps);
    this.allTheLab = this.utilityService.sortingMasterDNormPriority(masterConfigList.lab);

    this.inclusionData = masterConfigList.inclusions;
    this.measurementData = masterConfigList.measurements;

    this.inclusionConfig = masterConfigList.inclusionConfig;
    this.measurementConfig = masterConfigList.measurementConfig;
  }

  public async getUserPricingCriteriaData(id: string) {
    try {
      this.employeeCriteriaData = await this.employeeCriteriaService.getUserPricingCriteriaBySystemUser(id);
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async getPricingConfig() {
    try {
      this.pricingConfig = await this.pricingConfigService.getPricingConfigData();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async getPriceRequestData() {
    try {
      this.spinnerService.show();

      let req: PriceRequestApiModel = this.filterData.req;
      req.slots = this.employeeCriteriaData;
      req.systemUserId = this.fxCredentials.id;
      req.skip = this.skip;
      req.take = this.pageSize;
      req.type = 'Pricing';

      let res = await this.pricingRequestService.getPricingRequest(req);
      if (res) {
        this.filterData.res = res;
        this.listPricingRequests = res.priceRequest;
        this.listPricingRequests.forEach(z => {
          z.days = this.calculateDayDiff(z.marketSheetDate ?? new Date(), z.holdDate, z.holdDays ?? 0);
          if (z.expiryDate.toString() == "0001-01-01T00:00:00" || z.expiryDate.toString() == "0001-01-01T00:00:00Z")
            z.expiryDate = null as any;
          let allIndex = this.allPricingRequests.findIndex(a => a.stoneId == z.stoneId);
          if (allIndex == -1)
            this.allPricingRequests.push(JSON.parse(JSON.stringify(z)));
        });
        this.gridView = process(this.listPricingRequests, { group: this.groups });
        this.gridView.total = res.summaryData.totalCount;
        this.summaryData = res.summaryData;
        this.ApplySpecialStoneCriteriaForHighlight();
        this.getGradingData(this.listPricingRequests);

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
    this.listPricingRequests.forEach(z => {
      z.days = this.calculateDayDiff(z.marketSheetDate ?? new Date(), z.holdDate, z.holdDays ?? 0);
      if (z.expiryDate.toString() == "0001-01-01T00:00:00" || z.expiryDate.toString() == "0001-01-01T00:00:00Z")
        z.expiryDate = null as any;
      let allIndex = this.allPricingRequests.findIndex(a => a.stoneId == z.stoneId);
      if (allIndex == -1)
        this.allPricingRequests.push(JSON.parse(JSON.stringify(z)));
    });
    this.gridView = process(this.listPricingRequests, { group: this.groups });
    this.gridView.total = res.summaryData.totalCount;
    this.summaryData = res.summaryData;
    this.ApplySpecialStoneCriteriaForHighlight();
    this.getGradingData(this.listPricingRequests);

    this.selectedSlots = req.slots;
    this.inventorySearchCriteriaObj = req.invFilter;
    this.selectedBranchDNormItems.value = 'Pricing';
  }

  public ApplySpecialStoneCriteriaForHighlight() {
    this.listPricingRequests.forEach(target => {
      var data = this.specialStoneCriteriaData.filter(z =>
        this.utilityService.filterFromToDecimalValues(target.weight, z.minWeight, z.maxWeight) &&
        this.utilityService.filterArrayString(target.shape, z.shape) &&
        this.utilityService.filterArrayString(target.lab, z.lab, true) &&
        this.utilityService.filterArrayString(target.color, z.color) &&
        this.utilityService.filterArrayString(target.clarity, z.clarity) &&
        this.utilityService.filterArrayString(target.cut, z.cut) &&
        this.utilityService.filterArrayString(target.polish, z.polish) &&
        this.utilityService.filterArrayString(target.symmetry, z.symmetry) &&
        this.utilityService.filterArrayString(target.fluorescence, z.fluorescence) &&
        this.utilityService.filterArrayString(target.inclusion.brown, z.inclusion.brown) &&
        this.utilityService.filterArrayString(target.inclusion.green, z.inclusion.green) &&
        this.utilityService.filterArrayString(target.inclusion.milky, z.inclusion.milky) &&
        this.utilityService.filterFromToNegativeDecimalValues(target.price.discount, z.fromLimit, z.toLimit) &&
        this.utilityService.filterFromToDecimalValues(target.measurement.length, z.measurement.fromLength, z.measurement.toLength) &&
        this.utilityService.filterFromToDecimalValues(target.measurement.width, z.measurement.fromWidth, z.measurement.toWidth) &&
        this.utilityService.filterFromToDecimalValues(target.measurement.depth, z.measurement.fromDepth, z.measurement.toDepth) &&
        this.utilityService.filterFromToDecimalValues(target.measurement.table, z.measurement.fromTable, z.measurement.toTable) &&
        this.utilityService.filterFromToDecimalValues(target.measurement.ratio, z.measurement.fromRatio, z.measurement.toRatio));
      if (data != null && data.length > 0) {
        data.forEach(z => {
          if (z.isHighlight)
            target.isHighLight = z.isHighlight;
          // if (z.discount != null) {
          //   target.tempPrice.discount = (parseFloat(target.price.discount?.toString() ?? '0') + parseFloat(z.discount?.toString() ?? '0'));
          //   target = await this.checkValidLimitation(target);
          //   if (target.isValid != null)
          //     target = this.calculateRapPricing(target);
          //   await this.pricingRequestService.insertOnePricingRequest(target);
          // }
        });
      }
    });
  }

  public ApplySpecialStoneCriteriaForDiscount(invData: PricingRequest[]): PricingRequest[] {
    invData.forEach(target => {
      var data = this.specialStoneCriteriaData.filter(async z =>
        this.utilityService.filterFromToDecimalValues(target.weight, z.minWeight, z.maxWeight) &&
        this.utilityService.filterArrayString(target.shape, z.shape) &&
        this.utilityService.filterArrayString(target.lab, z.lab, true) &&
        this.utilityService.filterArrayString(target.color, z.color) &&
        this.utilityService.filterArrayString(target.clarity, z.clarity) &&
        this.utilityService.filterArrayString(target.cut, z.cut) &&
        this.utilityService.filterArrayString(target.polish, z.polish) &&
        this.utilityService.filterArrayString(target.symmetry, z.symmetry) &&
        this.utilityService.filterArrayString(target.fluorescence, z.fluorescence) &&
        this.utilityService.filterArrayString(target.inclusion.brown, z.inclusion.brown) &&
        this.utilityService.filterArrayString(target.inclusion.green, z.inclusion.green) &&
        this.utilityService.filterArrayString(target.inclusion.milky, z.inclusion.milky) &&
        this.utilityService.filterFromToNegativeDecimalValues(target.price.discount, z.fromLimit, z.toLimit) &&
        this.utilityService.filterFromToDecimalValues(target.measurement.length, z.measurement.fromLength, z.measurement.toLength) &&
        this.utilityService.filterFromToDecimalValues(target.measurement.width, z.measurement.fromWidth, z.measurement.toWidth) &&
        this.utilityService.filterFromToDecimalValues(target.measurement.depth, z.measurement.fromDepth, z.measurement.toDepth) &&
        this.utilityService.filterFromToDecimalValues(target.measurement.table, z.measurement.fromTable, z.measurement.toTable) &&
        this.utilityService.filterFromToDecimalValues(target.measurement.ratio, z.measurement.fromRatio, z.measurement.toRatio));
      if (data != null && data.length > 0) {
        data.forEach(async z => {
          if (z.discount != null) {
            target.tempPrice.discount = (parseFloat(target.tempPrice.discount?.toString() ?? target.price.discount?.toString() ?? '0') + parseFloat(z.discount?.toString() ?? '0'));
            target = await this.checkValidLimitation(target);
            if (target.isValid != null)
              target = this.calculateRapPricing(target);
          }
        });
      }
    });

    return invData;
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

        this.priceAnalytics = await this.pricingRequestService.getPriceAnalytics(req);
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

  public async getGradingData(priceReq: PricingRequest[]) {
    let Ids = priceReq.map(z => z.stoneId);
    var exists = this.gradingMasterItem.filter(z => Ids.includes(z.stoneId));
    if (Ids.length != exists.length) {
      var distinctSuppliers = priceReq.map((u: PricingRequest) => u.stoneOrg.orgName).filter((x: any, i: any, a: any) => x && a.indexOf(x) === i);
      for (let i = 0; i < distinctSuppliers.length; i++) {
        var z = distinctSuppliers[i];
        var supplierDetail = this.suppliers.find(a => a.name == z);
        if (supplierDetail) {
          if (supplierDetail.apiPath) {
            let newData = await this.gradingService.GetGradingFromStoneIds(Ids, supplierDetail.apiPath);
            newData = newData.filter(z => z.rapVer == 'InvUpload');
            this.gradingMasterItem.push(...newData);
          } else
            this.alertDialogService.show(supplierDetail.name + ' supplier api not found, Please contact administrator!');
        } else
          this.alertDialogService.show(z + ' supplier not found, Please contact administrator!');

      }
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

  //#region Temp Price CRUD
  public cellClickHandler(e: any) {
    if (!e.isEdited)
      e.sender.editCell(e.rowIndex, e.columnIndex, this.createFormGroup(e.dataItem));
  }

  public createFormGroup(dataItem: any): FormGroup {
    if (dataItem.status == StoneStatus.Arrival.toString()) {
      return this.formBuilder.group({
        tempBaseDisc: dataItem.tempBasePrice.discount,
        comments: dataItem.comments
      });
    }
    else if (dataItem.status == StoneStatus.Stock.toString()) {
      return this.formBuilder.group({
        tempDisc: dataItem.tempPrice.discount,
        comments: dataItem.comments
      });
    }
    else {
      return this.formBuilder.group({
        tempDisc: dataItem.tempPrice.discount,
        tempBaseDisc: dataItem.tempBasePrice.discount,
        comments: dataItem.comments
      });
    }
  }

  public async cellCloseHandler(args: any) {
    try {
      let { formGroup, dataItem } = args;
      if (formGroup.dirty) {
        dataItem.identity.id = this.fxCredentials.id;
        dataItem.identity.name = this.fxCredentials.fullName;
        dataItem.identity.type = "Pricing";
        dataItem.createdBy = this.fxCredentials.id;
        dataItem.comments = formGroup.value.comments;
        if (dataItem.expiryDate == null)
          dataItem.expiryDate = this.setNewExpiryDate();

        let result!: string;
        if (dataItem.tempPrice.discount != formGroup.value.tempDisc || dataItem.tempBasePrice.discount != formGroup.value.tempBaseDisc) {
          var validchange = this.CheckValidDiscountChanges(formGroup.value, dataItem);
          if (!validchange) {
            this.alertDialogService.show(`You can't change this discount on this status!`);
            return;
          }

          if (dataItem.tempPrice.discount != formGroup.value.tempDisc) {
            dataItem = await this.checkNewRap(dataItem);
            if (dataItem) {
              dataItem.tempPrice.discount = formGroup.value.tempDisc;
              dataItem = await this.checkValidLimitation(dataItem);
              if (dataItem.isValid != null)
                dataItem = this.calculateRapPricing(dataItem);
            }
          }
          else if (dataItem.tempBasePrice.discount != formGroup.value.tempBaseDisc) {
            dataItem = await this.checkNewRap(dataItem);
            if (dataItem) {
              dataItem.tempBasePrice.discount = formGroup.value.tempBaseDisc;
              dataItem = this.calculateRapPricing(dataItem);
            }
          }

          result = await this.pricingRequestService.insertOnePricingRequest(dataItem);
        }
        else
          result = await this.pricingRequestService.insertOnePricingRequest(dataItem);


        if (result) {
          this.utilityService.showNotification(`Data updated successfully!`);

          //Update allPricingRequests for apply change
          let allIndex = this.allPricingRequests.findIndex(a => a.stoneId == dataItem.stoneId);
          if (allIndex == -1)
            this.allPricingRequests.push(JSON.parse(JSON.stringify(dataItem)));
          else {
            this.allPricingRequests[allIndex].tempBasePrice = JSON.parse(JSON.stringify(dataItem.tempBasePrice));
            this.allPricingRequests[allIndex].tempPrice = JSON.parse(JSON.stringify(dataItem.tempPrice));
            this.allPricingRequests[allIndex].isValid = dataItem.isValid;
          }

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

  public mappingPricingRequestData(item: PricingRequest): MfgPricingRequest {
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

  public async checkNewRap(item: any): Promise<any> {
    let reqList: MfgPricingRequest[] = [];
    reqList.push(this.mappingPricingRequestData(item));

    let response = await this.pricingService.getBasePrice(reqList);
    if (response && response.length > 0) {
      let target = response.find(a => a.Id == item.stoneId);
      if (target && target.RapPrice != null && target.RapPrice > 0) {
        item.basePrice.rap = target.RapPrice;
        item.price.rap = target.RapPrice;
      }
    }
    return item;
  }

  public async checkNewRapForPriceRequest(item: PricingRequest[]): Promise<PricingRequest[]> {
    let reqList: MfgPricingRequest[] = [];
    item.forEach(z => {
      reqList.push(this.mappingPricingRequestData(z));
    });

    let response = await this.pricingService.getBasePrice(reqList);
    if (response && response.length > 0) {
      item.forEach(z => {
        let target = response.find(a => a.Id == z.stoneId);
        if (target && target.RapPrice != null && target.RapPrice > 0) {
          z.basePrice.rap = target.RapPrice;
          z.price.rap = target.RapPrice;
        }
      });
    }
    return item;
  }

  public CheckValidDiscountChanges(values: any, invs: PricingRequest): boolean {
    let flag = true;
    if (invs.tempPrice.discount != values.tempDisc) {
      if (invs.status == StoneStatus.Arrival.toString())
        flag = false;
    }
    else if (invs.tempBasePrice.discount != values.tempBaseDisc) {
      if (invs.status == StoneStatus.Stock.toString())
        flag = false;
    }
    return flag;
  }

  public async updateBulkDiscountManual(isPriceDiscount: boolean) {
    try {
      this.alertDialogService.ConfirmYesNo("Are you sure you want to bulk update discount?", "Update")
        .subscribe(async (res: any) => {
          if (res.flag) {
            let statusFail = 0;
            this.spinnerService.show();
            let listPricingRequests = this.allPricingRequests.filter(z => this.mySelection.includes(z.stoneId));
            listPricingRequests = await this.checkNewRapForPriceRequest(listPricingRequests);
            for (let index = 0; index < listPricingRequests.length; index++) {
              let z = listPricingRequests[index];
              if (isPriceDiscount) {
                if (z.status != StoneStatus.Arrival.toString())
                  z.tempPrice.discount = (parseFloat(z.price.discount?.toString() ?? '0') + parseFloat(this.bulkDisc?.toString() ?? '0'));
                else
                  statusFail++;
              }
              else {
                if (z.status != StoneStatus.Stock.toString())
                  z.tempBasePrice.discount = (parseFloat(z.basePrice.discount?.toString() ?? '0') + parseFloat(this.bulkDisc?.toString() ?? '0'));
                else
                  statusFail++;
              }

              if (z.expiryDate == null)
                z.expiryDate = this.setNewExpiryDate();
              z.identity.id = this.fxCredentials.id;
              z.identity.name = this.fxCredentials.fullName;
              z.identity.type = "Pricing";
              z.createdBy = this.fxCredentials.id;
              if (isPriceDiscount) {
                z = await this.checkValidLimitation(z);
                if (z.isValid != null)
                  z = this.calculateRapPricing(z);
              }
              else
                z = this.calculateRapPricing(z);

              //Update allPricingRequests for apply change
              let allIndex = this.allPricingRequests.findIndex(a => a.stoneId == z.stoneId);
              if (allIndex == -1)
                this.allPricingRequests.push(JSON.parse(JSON.stringify(z)));
              else {
                this.allPricingRequests[allIndex].tempBasePrice = JSON.parse(JSON.stringify(z.tempBasePrice));
                this.allPricingRequests[allIndex].tempPrice = JSON.parse(JSON.stringify(z.tempPrice));
                this.allPricingRequests[allIndex].isValid = z.isValid;
              }
            }

            if (listPricingRequests.length == statusFail) {
              this.alertDialogService.show(`You can't change this discount on this status!`);
              this.spinnerService.hide();
            }
            else {
              let result = await this.pricingRequestService.insertPricingRequest(listPricingRequests);

              if (result) {
                this.utilityService.showNotification(`Data updated successfully!`);
                this.spinnerService.hide();
                await this.getPriceRequestData();
              }
              else {
                this.spinnerService.hide();
                this.alertDialogService.show(`Data update fail, Try again later!`);
              }

              if (statusFail > 0)
                this.utilityService.showNotification(statusFail + ` stone(s) can't change on their status!`, 'warning');
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

      listPricingRequests.forEach(z => {
        if (z.expiryDate == null)
          z.expiryDate = this.setNewExpiryDate();
      });

      let result = await this.pricingRequestService.insertPricingRequest(listPricingRequests);
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

  public async calculateBasePricing(listPricingRequests: PricingRequest[]): Promise<number> {
    let reqList: MfgPricingRequest[] = [];
    let response: PricingDiscountApiResponse[] = [];
    let failResCount: number = 0;

    listPricingRequests.forEach(z => {
      reqList.push(this.mappingPricingRequestData(z));
    });

    response = await this.pricingService.getBasePrice(reqList);
    if (response && response.length > 0) {
      for (let index = 0; index < listPricingRequests.length; index++) {
        let z = listPricingRequests[index];
        if (z.status != StoneStatus.Stock.toString()) {
          let target = response.find(a => a.Id == z.stoneId);
          if (target && target.RapPrice != null && target.RapPrice > 0) {
            if (target.Error == null) {
              target = this.utilityService.setAmtForPricingDiscountResponse(target, z.weight);
              z.tempBasePrice.rap = target.RapPrice;
              z.tempBasePrice.discount = target.Discount;
              z.tempBasePrice.netAmount = target.Amount;
              z.tempBasePrice.perCarat = target.DCaret;

              z.identity.id = this.fxCredentials.id;
              z.identity.name = this.fxCredentials.fullName;
              z.identity.type = "Pricing";
              z.createdBy = this.fxCredentials.id;
            }
            else {
              z.tempBasePrice.rap = target.RapPrice;
              failResCount++;
            }
            let tempPrice = this.allPricingRequests.find(a => a.stoneId == z.stoneId)?.tempPrice;
            z.tempPrice = tempPrice ?? new PriceDNorm();
          }
          else
            failResCount++;
        }
      }

      //Update in All Pricing
      this.allPricingRequests.forEach(z => {
        let newData = listPricingRequests.find(a => a.stoneId == z.stoneId);
        if (newData != null)
          z.tempBasePrice = newData.tempBasePrice;
      });
    }

    return failResCount;
  }

  public async calculateMarketSheetPricing(listPricingRequests: PricingRequest[]): Promise<number> {
    let reqList: PricingMarketSheetRequest[] = [];
    let response: PricingMarketSheetResponse[] = [];
    let failResCount: number = 0;

    let listPricingGradeRequests = listPricingRequests.filter(z => z.inclusion.iGrade != null && z.measurement.mGrade != null);
    failResCount = listPricingRequests.length - listPricingGradeRequests.length;

    listPricingGradeRequests.forEach(z => {
      reqList.push(this.mappingMarketSheetPricing(z));
    });

    response = await this.pricingService.getMarketSheetPrice(reqList);
    if (response && response.length > 0) {
      for (let index = 0; index < listPricingGradeRequests.length; index++) {
        let z = listPricingGradeRequests[index];
        if (z.status != StoneStatus.Arrival.toString()) {
          let target = response.find(a => a.Id == z.stoneId);
          if (target && target.RapPrice != null && target.RapPrice > 0) {
            if (target.Error == null) {
              target = this.utilityService.setAmtForPricingMarketSheetDiscountResponse(target, z.weight);
              z.tempPrice.rap = target.RapPrice;
              z.tempPrice.discount = target.Discount;
              z.tempPrice.netAmount = target.Amount;
              z.tempPrice.perCarat = target.DCaret;

              z.identity.id = this.fxCredentials.id;
              z.identity.name = this.fxCredentials.fullName;
              z.identity.type = "Pricing";
              z.createdBy = this.fxCredentials.id;

              z = await this.checkValidLimitation(z);
              failResCount--;
            }
            else {
              z.tempPrice.rap = target.RapPrice;
              z.tempPrice.discount = null as any;
            }

            let tempBasePrice = this.allPricingRequests.find(a => a.stoneId == z.stoneId)?.tempBasePrice;
            z.tempBasePrice = tempBasePrice ?? new PriceDNorm();
            failResCount++;
          }
        }
      }
    }
    listPricingGradeRequests = this.ApplySpecialStoneCriteriaForDiscount(listPricingGradeRequests);

    //Update in All Pricing
    this.allPricingRequests.forEach(z => {
      let newData = listPricingGradeRequests.find(a => a.stoneId == z.stoneId);
      if (newData != null)
        z.tempPrice = newData.tempPrice;
    });

    return failResCount;
  }

  public mappingMarketSheetPricing(z: PricingRequest): PricingMarketSheetRequest {
    let mesurement = new MfgMeasurementData();
    mesurement.TblDepth = z.measurement.depth;
    mesurement.TblAng = z.measurement.table;
    mesurement.Length = z.measurement.length;
    mesurement.Width = z.measurement.width;
    mesurement.Height = z.measurement.height;
    mesurement.CrHeight = z.measurement.crownHeight;
    mesurement.CrAngle = z.measurement.crownAngle;
    mesurement.PvlDepth = z.measurement.pavilionDepth;
    mesurement.PvlAngle = z.measurement.pavilionAngle;
    mesurement.StarLength = 0;
    mesurement.LowerHalf = 0;
    mesurement.GirdlePer = z.measurement.girdlePer;
    mesurement.MinGirdle = z.measurement.minGirdle;
    mesurement.MaxGirdle = z.measurement.maxGirdle;
    mesurement.Ratio = z.measurement.ratio;

    let inclusion = new MfgInclusionData();
    inclusion.Brown = z.inclusion.brown;
    inclusion.Green = z.inclusion.green;
    inclusion.Milky = z.inclusion.milky;
    inclusion.Shade = z.inclusion.shade;
    inclusion.SideBlack = z.inclusion.sideBlack;
    inclusion.CenterBlack = z.inclusion.centerBlack;
    inclusion.SideWhite = z.inclusion.sideWhite;
    inclusion.CenterWhite = z.inclusion.centerWhite;
    inclusion.OpenTable = z.inclusion.openTable;
    inclusion.OpenCrown = z.inclusion.openCrown;
    inclusion.OpenPavilion = z.inclusion.openPavilion;
    inclusion.OpenGirdle = z.inclusion.openGirdle;
    inclusion.GirdleCond.push(z.inclusion.girdleCondition);
    inclusion.EFOC = z.inclusion.efoc;
    inclusion.EFOP = z.inclusion.efop;
    inclusion.Culet = z.inclusion.culet;
    inclusion.HNA = z.inclusion.hna;
    inclusion.EyeClean = z.inclusion.eyeClean;
    inclusion.KToS.push(z.inclusion.ktoS);
    inclusion.NaturalOnGirdle = z.inclusion.naturalOnGirdle;
    inclusion.NaturalOnCrown = z.inclusion.naturalOnCrown;
    inclusion.NaturalOnPavillion = z.inclusion.naturalOnPavillion;
    inclusion.FlColor = z.inclusion.flColor;
    inclusion.Luster = z.inclusion.luster;
    inclusion.BowTie = z.inclusion.bowtie;

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
      Day: this.calculateDayDiff(z.marketSheetDate ?? new Date(), z.holdDate, z.holdDays ?? 0),
      InclusionPrice: inclusion,
      MeasurePrice: mesurement
    };

    return req;
  }

  public calculateDayDiff(dateSent: Date, holdDate: Date | null, holdDays: number) {
    let date = new Date(dateSent);
    let currentDate = new Date(holdDate ?? new Date());

    let days = Math.floor(((currentDate.getTime() - date.getTime()) / 1000 / 60 / 60 / 24) - holdDays);
    return days;
  }

  public async checkValidLimitation(target: PricingRequest): Promise<PricingRequest> {
    var data = this.employeeCriteriaData.find(z => z.minWeight <= target.weight && z.maxWeight >= target.weight &&
      this.utilityService.filterArrayString(target.shape, z.shape) &&
      this.utilityService.filterArrayString(target.lab, z.lab, true) &&
      this.utilityService.filterArrayString(target.color, z.color) &&
      this.utilityService.filterArrayString(target.clarity, z.clarity) &&
      this.utilityService.filterArrayString(target.cut, z.cut) &&
      this.utilityService.filterArrayString(target.polish, z.polish) &&
      this.utilityService.filterArrayString(target.symmetry, z.symmetry) &&
      this.utilityService.filterArrayString(target.fluorescence, z.fluorescence));

    if (data != null) {
      let priceDisc = target.price?.discount;
      if (target.price?.discount == null) {
        target.isValid = true;
        return target;
      }
      priceDisc = await this.getPreviousBaseDiscount(target);
      let diff: number = parseFloat(priceDisc?.toString() ?? '0') - parseFloat(target.tempPrice?.discount?.toString() ?? '0');
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

  public async getPreviousBaseDiscount(target: PricingRequest): Promise<number | null> {
    let pricingHistory = await this.pricingRequestService.getPricingHistory(target.stoneId);
    if (pricingHistory && pricingHistory.length > 0) {
      let todate = new Date();
      let todayData = pricingHistory.filter(z => this.matchDate(new Date(z.createdDate), todate));
      if (todayData && todayData.length > 0) {
        //Get Today First Change
        // todayData = this.sortingDate(todayData);
        // return todayData[0].price.discount;

        let previousData = pricingHistory.filter(z => !this.matchDate(new Date(z.createdDate), todate));
        if (previousData && previousData.length > 0) {
          //Get Previous Last Discount
          previousData = this.sortingDate(previousData);
          return previousData[previousData.length - 1].price.discount;
        } else
          return target.price?.discount;
      }
      else
        return target.price?.discount;
    }
    else
      return target.price?.discount;
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

  public calculateRapPricing(target: PricingRequest): PricingRequest {
    const rap = target.basePrice.rap;
    let disc = target.tempBasePrice.discount;
    if (rap && disc) {
      if (disc.toString() != '-') {

        disc = parseFloat(disc.toString());
        let weight = target.weight;
        let stoneRap = weight * rap;
        let calDiscount = 100 + disc;
        let netAmount = (calDiscount * stoneRap) / 100;

        target.tempBasePrice.rap = rap;
        target.tempBasePrice.netAmount = this.utilityService.ConvertToFloatWithTwoDecimal(netAmount);
        let perCarat = netAmount / weight;
        target.tempBasePrice.perCarat = this.utilityService.ConvertToFloatWithTwoDecimal(perCarat);
      }
    }

    disc = target.tempPrice.discount;
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
    this.alertDialogService.ConfirmYesNo("Are you sure you want to apply discount?", "Update")
      .subscribe(async (res: any) => {
        try {
          if (res.flag) {
            let updatedData = await this.getSelectedValidStoneData();
            //let updatedData = this.allPricingRequests.filter(z => this.mySelection.includes(z.stoneId) && this.checkLabValidation(z, this.pricingConfig.baseDiscountDifference ?? 0) && ((z.tempPrice.discount != null) ? z.isValid : true));
            if (updatedData.length > 0) {
              this.spinnerService.show();
              updatedData.forEach(z => {
                z.identity.id = this.fxCredentials.id;
                z.identity.name = this.fxCredentials.fullName;
                z.identity.type = "Pricing";
                if (z.expiryDate == null)
                  z.expiryDate = this.setNewExpiryDate();
              });

              let supplierRes = await this.updateInventory(updatedData);
              if (supplierRes) {
                let result = await this.pricingRequestService.updatePricingRequest(updatedData);
                if (result) {
                  this.utilityService.showNotification(result + ` Data updated successfully!`);
                  this.SendNotificationForPriceRequest(updatedData.map(z => z.stoneId));
                  await this.getPriceRequestData();
                }
                else {
                  this.alertDialogService.show(`Data update fail, Try again later!`);
                  this.spinnerService.hide();
                }
              }
              else {
                this.utilityService.showNotification(`Pricing request not updated, Try again later!`, 'error');
                this.spinnerService.hide();
              }
            }
            else
              this.alertDialogService.show(`Please select valid stone(s) for apply changes!`);
            this.mySelection = [];
          }
        }
        catch (error) {
          this.spinnerService.hide();
          console.error(error);
          this.alertDialogService.show(`Data update fail, Try again later!`);
        }
      });
  }

  private async getSelectedValidStoneData(): Promise<PricingRequest[]> {
    let unfindStones: string[] = [];
    let updatedData: PricingRequest[] = [];
    let allPricingRequests: PricingRequest[] = JSON.parse(JSON.stringify(this.allPricingRequests));

    //Get stones from allPricingRequests data with mySelection
    for (let index = 0; index < this.mySelection.length; index++) {
      let stoneId = this.mySelection[index];

      let inv = allPricingRequests.find(z => z.stoneId == stoneId);
      if (inv == null) {
        var exists = this.listPricingRequests.find(z => z.stoneId == stoneId);
        if (exists == null)
          unfindStones.push(stoneId);
        else
          updatedData.push(exists);
      }
      else
        updatedData.push(inv);
    }

    if (unfindStones.length > 0)
      console.warn(unfindStones.join(',') + ' stone(s) not found in allPricingRequests!');

    //Update Temp Price Data & IsValid flag again
    for (let index = 0; index < updatedData.length; index++) {
      updatedData[index] = this.checkUpdatedTempPrice(updatedData[index]);
      updatedData[index] = await this.checkValidLimitation(updatedData[index]);
    }

    updatedData = updatedData.filter(z => this.checkLabValidation(z, this.pricingConfig.baseDiscountDifference ?? 0));
    return updatedData;
  }

  public checkUpdatedTempPrice(data: PricingRequest): PricingRequest {
    if (data.tempPrice.discount == null && data.tempBasePrice.discount == null) {
      var exists = this.listPricingRequests.find(z => z.stoneId == data.stoneId);
      if (exists != null) {
        data.tempPrice = data.tempPrice;
        data.tempBasePrice = data.tempBasePrice;
      }
    }
    return data;
  }

  private async updateInventory(pricing: PricingRequest[]): Promise<boolean> {
    try {
      let res = false;
      var distinctSuppliers = pricing.map((u: PricingRequest) => u.stoneOrg.orgName).filter((x: any, i: any, a: any) => x && a.indexOf(x) === i);
      for (let i = 0; i < distinctSuppliers.length; i++) {
        var z = distinctSuppliers[i];
        var supplierDetail = this.suppliers.find(a => a.name == z);
        if (supplierDetail) {
          if (supplierDetail.apiPath) {
            var pricingBySuppliers = pricing.filter(a => a.stoneOrg.orgName == z);
            res = await this.updateSupplierInventory(pricingBySuppliers, supplierDetail.apiPath);
            if (!res)
              return res;
          } else {
            this.alertDialogService.show(supplierDetail.name + ' supplier api not found, Please contact administrator!');
            return false;
          }
        } else {
          this.alertDialogService.show(z + ' supplier not found, Please contact administrator!');
          return false;
        }
      }
      return res;
    }
    catch (error: any) {
      console.error(error);
      return false;
    }
  }

  private async updateSupplierInventory(pricing: PricingRequest[], api: string): Promise<boolean> {
    try {
      var res = await this.supplierApiRequestService.updatePricingRequest(pricing, api);
      if (res.isSuccess && res.data && res.data.length > 0)
        res.isSuccess = await this.pricingRequestService.insertInventoryItem(res.data);

      return res.isSuccess;
    }
    catch (error: any) {
      console.error(error);
      return false;
    }
  }

  private checkLabValidation(filter: PricingRequest, discDiffrence: number): boolean {
    let flag = true;

    //Check isValid flag on tempPrice discount
    if (filter.tempPrice.discount != null) {
      if (!filter.isValid)
        return false;
    }

    //check discDiffrence & nullable temp data
    if (filter.status == StoneStatus.Lab.toString()) {
      flag = (filter.tempPrice.discount != null && filter.tempBasePrice.discount != null);
      if (flag) {
        let diff = (filter.tempPrice.discount ?? 0) + discDiffrence;
        flag = ((filter.tempBasePrice.discount ?? 0) <= diff)
      }
    } else
      flag = (filter.tempPrice.discount != null || filter.tempBasePrice.discount != null);

    return flag;
  }

  public async SendNotificationForPriceRequest(stoneIds: string[]) {
    // var result = await this.inventoryService.getInventoryByStoneIds(stoneIds);
    // if (result) {
    //   let recevierIds = result.map((u: any) => u.identity.id).filter((x: any, i: any, a: any) => x && a.indexOf(x) === i);
    //   if (recevierIds && recevierIds.length > 0) {
    //     recevierIds.forEach(z => {
    //       let stoneIds = result.filter(a => a.identity.id == z).map(a => a.stoneId);
    //       let message: Notifications = ApplyPriceRequestTemplate(this.fxCredentials, z, stoneIds);
    //       this.notificationService.messages.next(message);
    //     });
    //   }
    // }
  }
  //#endregion

  //#region OnChange Functions
  public setNewExpiryDate(): Date {
    let today = new Date();
    today.setDate(today.getDate() + (this.pricingConfig.expirationDay ?? 0));
    return today;
  }

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

    let invItems = await this.pricingRequestService.getInventoryByStoneId(e.dataItem.stoneId);
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

  public selectedRowChange(e: any) {
    if (e.selectedRows && e.selectedRows.length > 0) {
      let senitizeData = JSON.parse(JSON.stringify(e.selectedRows[0].dataItem));

      let index = this.allPricingRequests.findIndex(z => z.stoneId == senitizeData.stoneId);
      if (index > -1)
        this.allPricingRequests.splice(index, 1);

      let selectionData = this.mySelection.find(z => z == senitizeData.stoneId);
      if (selectionData == null)
        this.mySelection.push(senitizeData.stoneId);

      let allData = this.allPricingRequests.find(z => z.stoneId == senitizeData.stoneId);
      if (allData == null)
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

  public openSlotFilterDialog(): void {
    this.isSlotFilter = true;
  }

  public closeSlotFilterDialog(): void {
    this.isSlotFilter = false;
  }

  public onBulkToggle(): void {
    this.showBulk = !this.showBulk;
  }

  public async copyToClipboard() {
    try {
      this.spinnerService.show();
      let res = this.allPricingRequests.map(z => z.stoneId);
      if (res) {
        let stoneIdString = res.join(' ');
        navigator.clipboard.writeText(stoneIdString);
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
  //#endregion

  //#region Select All
  public async loadAllInventories() {
    try {
      this.spinnerService.show();

      let req: PriceRequestApiModel = this.filterData.req;
      req.slots = this.employeeCriteriaData;
      req.systemUserId = this.fxCredentials.id;
      req.skip = 0;
      req.take = this.filterData.res.summaryData.totalCount;
      req.type = 'Pricing';

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

        // this.mySelection = [];
        this.mySelection.push(...this.listPricingRequests.map(z => z.stoneId));
        this.listPricingRequests.forEach(z => {
          let allIndex = this.allPricingRequests.findIndex(a => a.stoneId == z.stoneId);
          if (allIndex == -1)
            this.allPricingRequests.push(JSON.parse(JSON.stringify(z)));
        });
      }
    }
    else if (event.toLowerCase() == 'uncheckedall') {
      this.mySelection = [];
      this.allPricingRequests = [];
    }
    else {
      this.listPricingRequests.forEach(z => {
        let selectionIndex = this.mySelection.findIndex(a => a == z.stoneId);
        if (selectionIndex != -1)
          this.mySelection.splice(selectionIndex, 1);
        let allIndex = this.allPricingRequests.findIndex(a => a.stoneId == z.stoneId);
        if (allIndex != -1)
          this.allPricingRequests.splice(allIndex, 1);
      });
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
    if (!this.containsExcel(event.target)) {
      this.showExcelOption = false;
    }
  }

  private contains(target: any): boolean {
    return (
      this.anchor.nativeElement.contains(target) ||
      (this.popup ? this.popup.nativeElement.contains(target) : false)
    );
  }

  private containsExcel(target: any): boolean {
    return (
      this.anchorExcel.nativeElement.contains(target) ||
      (this.popupExcel ? this.popupExcel.nativeElement.contains(target) : false)
    );
  }
  //#endregion

  //#region Color Mark
  public openColorMarkDialog() {
    this.iscolorMark = true;
  }

  public closeColorMarkDialog() {
    this.iscolorMark = false;
    this.selectedColorMark = '';
  }

  public markColor(color: string) {
    this.selectedColorMark = color;
  }

  public getColorMarkRGB(color: string, isGrid = false): string {
    let colorMarkClass = '';

    switch (color) {
      case "Red":
        colorMarkClass = "#EF9A9A";
        break;
      case "Yellow":
        colorMarkClass = "#FFF59D";
        break;
      case "Blue":
        colorMarkClass = "#81D4FA";
        break;
      case "Brown":
        colorMarkClass = "#BCAAA4";
        break;
      case "Green":
        colorMarkClass = "#A5D6A7";
        break;
      case "None":
        if (isGrid)
          colorMarkClass = 'transparent';
        else
          colorMarkClass = '#BDBDBD';
        break;
      default:
        colorMarkClass = "transparent";
        break;
    }

    return colorMarkClass;
  }

  public async saveColorMark() {
    try {
      this.spinnerService.show();
      let listPricingRequests = this.allPricingRequests.filter(z => this.mySelection.includes(z.stoneId));
      listPricingRequests.forEach(z => {
        z.discColorMark = this.selectedColorMark;
        if (z.expiryDate == null)
          z.expiryDate = this.setNewExpiryDate();
      });

      let result = await this.pricingRequestService.insertPricingRequest(listPricingRequests);
      if (result) {
        this.utilityService.showNotification(`Data updated successfully!`);
        this.spinnerService.hide();
        this.closeColorMarkDialog();
        this.mySelection = [];
        await this.getPriceRequestData();
      }
      else {
        this.spinnerService.hide();
        this.alertDialogService.show(`Data update fail, Try again later!`);
      }
    }
    catch (error) {
      this.spinnerService.hide();
      console.error(error);
      this.alertDialogService.show("Something went wrong, Try again later.");
    }
  }
  //#endregion

  //#region Summary
  public openSummary(): void {
    this.isSummary = true;
  }

  public closeSummary(): void {
    this.isSummary = false;
  }

  public filterChange(type: string): void {
    this.skip = 0;
    this.mySelection = [];
    if (this.filterData.req.invFilter == undefined)
      this.filterData.req.invFilter = new InventorySearchCriteria();

    if (type == 'Hold') {
      let isHold = this.filterData.req.invFilter.isHold;
      if (isHold)
        this.filterData.req.invFilter.isHold = null as any;
      else
        this.filterData.req.invFilter.isHold = true;
    }
    else if (type == 'Memo') {
      let isMemo = this.filterData.req.invFilter.isMemo;
      if (isMemo)
        this.filterData.req.invFilter.isMemo = null as any;
      else
        this.filterData.req.invFilter.isMemo = true;
    }
    else if (type == 'Lead') {
      let isLead = this.filterData.req.invFilter.isLead;
      if (isLead)
        this.filterData.req.invFilter.isLead = null as any;
      else
        this.filterData.req.invFilter.isLead = true;
    }

    this.getPriceRequestData();
    this.closeSummary();
  }

  public filterRapnetHoldChange(): void {
    this.skip = 0;
    this.mySelection = [];
    if (this.filterData.req.invFilter == undefined)
      this.filterData.req.invFilter = new InventorySearchCriteria();

    let isHold = this.filterData.req.invFilter.isRapnetHold;
    if (isHold)
      this.filterData.req.invFilter.isRapnetHold = null as any;
    else
      this.filterData.req.invFilter.isRapnetHold = true;
    this.getPriceRequestData();
    this.closeSummary();
  }

  public filterLocationChange(location: string): void {
    this.skip = 0;
    this.mySelection = [];
    if (this.filterData.req.invFilter == undefined)
      this.filterData.req.invFilter = new InventorySearchCriteria();

    let index = this.filterData.req.invFilter.location.indexOf(location);
    if (index >= 0)
      this.filterData.req.invFilter.location.splice(index, 1);
    else
      this.filterData.req.invFilter.location.push(location);
    this.getPriceRequestData();
    this.closeSummary();
  }
  //#endregion

  //#region Export To Excel / Mail
  public onExcelToggle(): void {
    this.showExcelOption = !this.showExcelOption;
  }

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

    let req: PriceRequestApiModel = this.filterData.req;
    req.slots = this.employeeCriteriaData;
    req.systemUserId = this.fxCredentials.id;
    req.skip = 0;
    req.take = this.filterData.res.summaryData.totalCount;
    req.type = 'Pricing';

    let res = await this.pricingRequestService.getPricingRequest(req);
    if (res) {
      let exportData = res.priceRequest;
      if (exportData && exportData.length > 0) {
        if (this.excelOption == 'selected') {
          exportData = exportData.filter(item => this.mySelection.includes(item.stoneId));
        }

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
        }
        this.spinnerService.hide();
      }
      else {
        this.alertDialogService.show('No Data Found!');
        this.spinnerService.hide();
      }
    }
    else
      this.spinnerService.hide();
  }

  public convertArrayToObject(fields: GridDetailConfig[], element: any): any {
    let iURL = element.imageUrl;
    let cURL = element.certificateUrl;
    let vURL = element.videoUrl;
    var obj: any = {};
    for (let i = 0; i < fields.length; i++) {
      let field = fields[i];
      if (!(field.title == "Checkbox" || field.title == "Analytic")) {
        if (field.title == "Media") {
          obj["CertificateUrl"] = cURL;
          obj["ImageUrl"] = iURL;
          obj["VideoUrl"] = vURL;
        }
        else if (field.propertyName.includes("measurement")) {
          let propertyname = field.propertyName.split(".")[1];
          obj[field.title] = element.measurement[propertyname];
        }
        else if (field.propertyName.includes("inclusion")) {
          let propertyname = field.propertyName.split(".")[1];
          obj[field.title] = element.inclusion[propertyname];
        }
        else if (field.propertyName.includes("basePrice")) {
          let propertyname = field.propertyName.split(".")[1];
          obj[field.title] = element.basePrice[propertyname];
        }
        else if (field.propertyName.includes("price")) {
          let propertyname = field.propertyName.split(".")[1];
          obj[field.title] = element.price[propertyname];
        }
        else if (field.title.includes("Natts")) {
          if (element.inclusion.sideBlack != null && element.inclusion.centerBlack != null)
            obj[field.title] = element.inclusion.sideBlack + " - " + element.inclusion.centerBlack;
          else
            obj[field.title] = "-";
        }
        else if (field.title.includes("Girdle")) {
          if (element.measurement.minGirdle != null && element.measurement.maxGirdle != null)
            obj[field.title] = element.measurement.minGirdle + " - " + element.measurement.maxGirdle;
          else
            obj[field.title] = "-";
        }
        else if (field.title.includes("T. Base Disc"))
          obj[field.title] = element.tempBasePrice.discount;
        else if (field.title.includes("T. Main Disc"))
          obj[field.title] = element.tempPrice.discount;
        else if (field.title.includes("Diameter"))
          obj[field.title] = element.measurement.length + " - " + element.measurement.width + " x " + element.measurement.height;
        else
          obj[field.title] = element[field.propertyName];
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
  //#endregion

  //#region Compare Lab Inv
  public getCompareRequestWithInvData(stoneId: String, type: string, typeTwo: string): string {
    let className = '';
    try {
      let tooltipData = '';
      let priceData = '';
      let prevIndex = null;
      let curIndex = null;
      prevIndex = 1;
      curIndex = 1;
      let InvUploadWeight: number = 0;
      let listData: MasterDNorm[] = [];

      var InvData = this.gradingMasterItem.find(z => z.stoneId == stoneId);
      if (InvData) {
        //Get 'Grading' Data. if not found then take 'InvUpload' data
        if (type == 'SHAPE') {
          priceData = this.listPricingRequests.find(z => z.stoneId == stoneId)?.shape ?? '';
          tooltipData = InvData?.shape ?? '';
          listData = this.allTheShapes;
          prevIndex = listData.find(t => t.displayName == priceData)?.priority ?? 0;
          curIndex = listData.find(t => t.displayName == tooltipData)?.priority ?? 0;
        }
        else if (type == 'WEIGHT') {
          InvUploadWeight = InvData?.weight ?? '';
          tooltipData = InvUploadWeight.toString();

          if ((InvUploadWeight) > (this.listPricingRequests.find(z => z.stoneId == stoneId)?.weight ?? '')) {
            prevIndex = 2;
            curIndex = 1;
          }
          if ((InvUploadWeight) < (this.listPricingRequests.find(z => z.stoneId == stoneId)?.weight ?? '')) {
            prevIndex = 1;
            curIndex = 2;
          }
        }
        else if (type == 'COLOR') {
          priceData = this.listPricingRequests.find(z => z.stoneId == stoneId)?.color ?? '';
          tooltipData = InvData?.color ?? '';
          listData = this.allColors;
          prevIndex = listData.find(t => t.displayName == priceData)?.priority ?? 0;
          curIndex = listData.find(t => t.displayName == tooltipData)?.priority ?? 0;
        }
        else if (type == 'CLARITY') {
          priceData = this.listPricingRequests.find(z => z.stoneId == stoneId)?.clarity ?? '';
          tooltipData = InvData?.clarity ?? '';
          listData = this.allClarities;
          prevIndex = listData.find(t => t.displayName == priceData)?.priority ?? 0;
          curIndex = listData.find(t => t.displayName == tooltipData)?.priority ?? 0;
        }
        else if (type == 'CUT') {
          priceData = this.listPricingRequests.find(z => z.stoneId == stoneId)?.cut ?? '';
          tooltipData = InvData?.cut ?? '';
          listData = this.allTheCPS;
          prevIndex = listData.find(t => t.displayName == priceData)?.priority ?? 0;
          curIndex = listData.find(t => t.displayName == tooltipData)?.priority ?? 0;
        }
        else if (type == 'POLISH') {
          priceData = this.listPricingRequests.find(z => z.stoneId == stoneId)?.polish ?? '';
          tooltipData = InvData?.polish ?? '';
          listData = this.allTheCPS;
          prevIndex = listData.find(t => t.displayName == priceData)?.priority ?? 0;
          curIndex = listData.find(t => t.displayName == tooltipData)?.priority ?? 0;
        }
        else if (type == 'SYMMETRY') {
          priceData = this.listPricingRequests.find(z => z.stoneId == stoneId)?.symmetry ?? '';
          tooltipData = InvData?.symmetry ?? '';
          listData = this.allTheCPS;
          prevIndex = listData.find(t => t.displayName == priceData)?.priority ?? 0;
          curIndex = listData.find(t => t.displayName == tooltipData)?.priority ?? 0;
        }
        else if (type == 'FLUORESCENCE') {
          priceData = this.listPricingRequests.find(z => z.stoneId == stoneId)?.fluorescence ?? '';
          tooltipData = InvData?.fluorescence ?? '';
          listData = this.allTheFluorescences;
          prevIndex = listData.find(t => t.displayName == priceData)?.priority ?? 0;
          curIndex = listData.find(t => t.displayName == tooltipData)?.priority ?? 0;
        }

        if (prevIndex < curIndex)
          className = 'icon-back ml-1 d-inline-block rotate-90 i-green';
        else if (prevIndex > curIndex)
          className = 'icon-back ml-1 d-inline-block a-rotate-90 i-red';
        else
          className = '';

        if (typeTwo == 'ToolTip')
          className = tooltipData;

        return className;
      }
      return className;
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
      return className;
    }
  }
  //#endregion
}