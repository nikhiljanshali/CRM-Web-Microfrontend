import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SelectionRange } from '@progress/kendo-angular-dateinputs';
import { RowClassArgs, SelectableSettings } from '@progress/kendo-angular-grid';
import { Align } from '@progress/kendo-angular-popup';
import { DataResult, GroupDescriptor, orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { Address, GridDetailConfig, MfgInclusionData, MfgMeasurementData, MfgPricingRequest, PricingDiscountApiResponse, RapPriceRequest } from 'shared/businessobjects';
import { fxCredential, GridConfig, GridMasterConfig, MasterConfig, MasterDNorm, MeasurementConfig } from 'shared/enitites';
import { ConfigService, PricingService, StoneStatus, UtilityService } from 'shared/services';
import { AlertdialogService } from 'shared/views';
import { NgxSpinnerService } from 'ngx-spinner';
import * as xlsx from 'xlsx';
import { GridPropertiesService, MasterConfigService, OrganizationService, InventoryUploadService, DiamantoRequestService } from '../../services';
import { Organization, InventoryItems } from '../../entities';
import { InventoryExcelItems, InventoryFilter, InventoryManualItems, InverntoryError } from '../../businessobjects';

@Component({
  selector: 'app-inventoryupload',
  templateUrl: './inventoryupload.component.html',
  styles: []
})

export class InventoryuploadComponent implements OnInit {
  //#region Grid Init
  public groups: GroupDescriptor[] = [];
  public pageSize = 26;
  public skip = 0;
  public fields!: GridDetailConfig[];
  public isRegEmployee: boolean = false;
  public filterFlag = true;
  public selectableSettings: SelectableSettings = {
    mode: 'multiple',
  };
  public skeletonArray = new Array(18);
  public mySelection: string[] = [];
  public isShowCheckBoxAll: boolean = true;
  public inventoryExcelItems: InventoryExcelItems[] = [];
  public errorMessagesByStoneId: InverntoryError[] = [];
  public selectedInventoryExcelItems: InventoryExcelItems[] = [];
  public gridView!: DataResult;
  public sort!: SortDescriptor[];
  public existStoneIds: string[] = [];
  public masterConfigList!: MasterConfig;
  public allTheShapes!: MasterDNorm[];
  public allColors!: MasterDNorm[];
  public allClarities!: MasterDNorm[];
  public allTheFluorescences!: MasterDNorm[];
  public allTheCPS!: MasterDNorm[];
  public measurementData: MasterDNorm[] = [];
  public measurementConfig: MeasurementConfig = new MeasurementConfig();
  //#endregion

  //#region Grid Config
  public isGridConfig: boolean = false;
  public gridConfig!: GridConfig;
  public gridMasterConfigResponse!: GridMasterConfig;
  //#endregion

  public range: SelectionRange = { start: new Date, end: new Date };

  //#region Add/Edit Inventory
  public isEditInventory: boolean = false;
  public inventoryUploadObj: InventoryExcelItems = new InventoryExcelItems();
  public insertFlag: boolean = true;
  //#endregion

  //#region Grid Inventory Manually
  public inventoryManualItems = new InventoryManualItems();
  public inventoryManualForm!: NgForm;
  public inventoryItemsData: InventoryExcelItems[] = []
  //#endregion

  public isRateFound: boolean = true;
  public inventoryFilterObj: InventoryFilter = new InventoryFilter();

  public fxCredentials!: fxCredential;
  public organizationAddress: Address = new Address();

  public showPopup: boolean = false;
  public isInvMarketsheetExcel: boolean = false;
  public showExcelOption = false;

  public showSavePopup: boolean = false;
  public boxSerialNo!: string;

  public organizationData: Organization = new Organization();

  //#region Filter List
  public allKapan: string[] = [];
  public listShape: Array<{ name: string; isChecked: boolean }> = [];
  public listKapan: Array<{ name: string; isChecked: boolean }> = [];
  public listColor: Array<{ name: string; isChecked: boolean }> = [];
  public listClarity: Array<{ name: string; isChecked: boolean }> = [];
  public listCut: Array<{ name: string; isChecked: boolean }> = [];
  public listPolish: Array<{ name: string; isChecked: boolean }> = [];
  public listSymm: Array<{ name: string; isChecked: boolean }> = [];
  public listFlour: Array<{ name: string; isChecked: boolean }> = [];

  public totalPcs: number = 0;
  public totalWeight: number = 0;
  public totalAmount: number = 0;
  //#endregion

  @ViewChild("anchor") public anchor!: ElementRef;
  @ViewChild("popup", { read: ElementRef }) public popup!: ElementRef;
  public anchorAlign: Align = { horizontal: "right", vertical: "bottom" };
  public popupAlign: Align = { horizontal: "center", vertical: "top" };

  @ViewChild("anchorSave") public anchorSave!: ElementRef;
  @ViewChild("popupSave", { read: ElementRef }) public popupSave!: ElementRef;

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

  constructor(private inventoryUploadService: InventoryUploadService,
    private organizationService: OrganizationService,
    private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService,
    public utilityService: UtilityService,
    private masterConfigService: MasterConfigService,
    private gridPropertiesService: GridPropertiesService,
    private pricingService: PricingService,
    // private notificationService: NotificationService,
    // private employeeCriteriaService: EmployeeCriteriaService,
    private diamantoRequestService: DiamantoRequestService,
    private configService: ConfigService) {
    // this.notificationService.getMessage();
  }

  async ngOnInit() {
    await this.loadDefaultMethod();
  }

  //#region Init Data
  public async loadDefaultMethod() {
    try {
      this.spinnerService.show();
      this.fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;
      await this.getGridConfiguration();
      await this.loadMasterConfig();
      await this.loadManualInventoryData();

      this.utilityService.filterToggleSubject.subscribe(flag => {
        this.filterFlag = flag;
      });

      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }

  public async getGridConfiguration() {
    try {
      this.spinnerService.show();
      this.gridConfig = await this.configService.getGridConfig(this.fxCredentials?.id ?? '', "InventoryUpload", "InventoryUploadGrid");
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
        this.gridMasterConfigResponse = await this.configService.getMasterGridConfig("InventoryUpload", "InventoryUploadGrid");
        if (this.gridMasterConfigResponse)
          this.fields = this.gridMasterConfigResponse.gridDetail;
        else
          this.fields = await this.gridPropertiesService.getInventoryUploadGrid();
      }
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.alertDialogService.show(error);
      this.spinnerService.hide();
    }
  }

  public async loadManualInventoryData() {
    this.fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;
    this.organizationAddress = await this.organizationService.getOrganizationAddressByEmployee(this.fxCredentials.id);
  }

  public async loadMasterConfig() {

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

    this.measurementData = this.masterConfigList.measurements;
    this.measurementConfig = this.masterConfigList.measurementConfig;
  }
  //#endregion

  //#region OnChange Functions
  public filterPartToggle() {
    this.utilityService.setfilterToggleValue(this.filterFlag);
  }

  public onSaveToggle(): void {
    this.showSavePopup = !this.showSavePopup;
  }

  public onExcelToggle(): void {
    this.showExcelOption = !this.showExcelOption;
  }

  public setKapanList(): void {
    this.listKapan = [];
    this.allKapan = this.inventoryExcelItems.map(z => z.kapan);
    this.allKapan = this.allKapan.filter(this.utilityService.onlyUniqueFromStringArray)
    this.allKapan.forEach(z => { this.listKapan.push({ name: z, isChecked: false }); });
  }

  public async onSelectExcelFile(event: Event) {
    try {
      let acceptedFiles: string[] = []
      const target = event.target as HTMLInputElement;
      if (target.accept) {
        acceptedFiles = target.accept.split(',').map(function (item) {
          return item.trim();
        });
      }

      if (target.files && target.files.length) {
        if (acceptedFiles.indexOf(target.files[0].type) == -1) {
          this.alertDialogService.show(`Please select valid file.`);
          return;
        }

        let file = target.files[0];
        let fileReader = new FileReader();
        this.clearGrid();
        this.spinnerService.show();
        fileReader.onload = async (e) => {

          var arrayBuffer: any = fileReader.result;
          let data = new Uint8Array(arrayBuffer);
          let arr = new Array();

          for (let i = 0; i != data.length; ++i)
            arr[i] = String.fromCharCode(data[i]);

          let workbook = xlsx.read(arr.join(""), { type: "binary" });
          var inventoryFetchExcelItems = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]) as any;
          if (inventoryFetchExcelItems && inventoryFetchExcelItems.length > 0) {
            this.inventoryExcelItems = new Array<any>();

            for (let j = 0; j < inventoryFetchExcelItems.length; j++) {
              Object.keys(inventoryFetchExcelItems[j]).map(key => {
                if (key.toLowerCase().trim() != key) {
                  inventoryFetchExcelItems[j][key.toLowerCase().trim()] = inventoryFetchExcelItems[j][key];
                  delete inventoryFetchExcelItems[j][key];
                }
              });

              let newItem = await this.mappingExcelDataToInvExcelItems(inventoryFetchExcelItems, j);
              this.inventoryExcelItems.push(newItem);
            }

            //Get Pricing
            this.inventoryExcelItems = await this.setBasePricing(this.inventoryExcelItems);

            if (this.inventoryExcelItems && this.inventoryExcelItems.length > 0) {
              await this.checkValidationForAll(this.inventoryExcelItems);
              this.isVisibleCheckAll();
            }
            this.loadItems(this.inventoryExcelItems);
            this.setKapanList();
            this.spinnerService.hide();
            this.showExcelOption = false;
          }
        }

        fileReader.readAsArrayBuffer(file);
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }

  public async mappingExcelDataToInvExcelItems(excelData: any, excelIndex: number): Promise<InventoryExcelItems> {
    let newItem: InventoryExcelItems = new InventoryExcelItems();
    let data = excelData[excelIndex];

    newItem.stoneId = data["StoneId".toLowerCase()]?.toString().trim();
    newItem.kapan = data["Kapan".toLowerCase()]?.toString().trim();
    newItem.article = data["Article".toLowerCase()]?.toString().trim();
    newItem.shape = this.getDisplayNameFromMasterDNorm(data["Shape".toLowerCase()]?.toString().trim(), this.allTheShapes);
    newItem.weight = data["Weight".toLowerCase()]?.toString().trim();
    newItem.color = data["Color".toLowerCase()]?.toString().trim();
    newItem.clarity = data["Clarity".toLowerCase()]?.toString().trim();
    newItem.cut = data["Cut".toLowerCase()]?.toString().trim();
    newItem.polish = data["Polish".toLowerCase()]?.toString().trim();
    newItem.symmetry = data["Symmetry".toLowerCase()]?.toString().trim();
    newItem.fluorescence = data["Fluorescence".toLowerCase()]?.toString().trim();
    newItem.comments = data["Comments".toLowerCase()]?.toString().trim();
    newItem.depth = 0;
    newItem.table = data["Table".toLowerCase()]?.toString().trim();
    newItem.length = data["Length".toLowerCase()]?.toString().trim();
    newItem.width = data["Width".toLowerCase()]?.toString().trim();
    newItem.height = data["Height".toLowerCase()]?.toString().trim();
    newItem.crownHeight = data["CrownHeight".toLowerCase()]?.toString().trim();
    newItem.crownAngle = data["CrownAngle".toLowerCase()]?.toString().trim();
    newItem.pavilionDepth = data["PavilionDepth".toLowerCase()]?.toString().trim();
    newItem.pavilionAngle = data["PavilionAngle".toLowerCase()]?.toString().trim();
    newItem.girdlePer = data["GirdlePer".toLowerCase()]?.toString().trim();
    newItem.minGirdle = data["MinGirdle".toLowerCase()]?.toString().trim();
    newItem.maxGirdle = data["MaxGirdle".toLowerCase()]?.toString().trim();
    newItem.ratio = data["Ratio".toLowerCase()]?.toString().trim();

    if (this.isInvMarketsheetExcel) {
      newItem.lab = data["Lab".toLowerCase()]?.toString().trim();
      newItem.certificateNo = data["CertificateNo".toLowerCase()]?.toString().trim();

      newItem.flColor = data["FluorescenceColor".toLowerCase()]?.toString().trim();
      newItem.ktoS = data["KeytoSymbols".toLowerCase()]?.toString().trim();
      newItem.inscription = data["Inscription".toLowerCase()]?.toString().trim();
      newItem.status = StoneStatus.Pricing.toString();
    }
    else
      newItem.status = StoneStatus.Arrival.toString();

    newItem.orgId = this.fxCredentials.organizationId;
    newItem.orgName = this.fxCredentials.organization;
    newItem.deptId = this.fxCredentials.departmentId;
    newItem.deptName = this.fxCredentials.department;
    newItem.branchName = this.fxCredentials.branch;
    newItem.country = this.organizationAddress.country;
    newItem.city = this.organizationAddress.city;
    newItem.empName = this.fxCredentials.fullName;
    newItem.empId = this.fxCredentials.id;

    this.calculateDept(newItem);

    return newItem;
  }

  public getDisplayNameFromMasterDNorm(name: string, list: MasterDNorm[]): string {
    var obj = list.find(c => c.name.toLowerCase() == name.toLowerCase() || c.displayName.toLowerCase() == name.toLowerCase() || c.optionalWords && c.optionalWords.map(u => u.toLowerCase().trim()).includes(name.toLowerCase()));
    return obj?.name ?? null as any;
  }

  public async getRapPriceData(newItem: InventoryExcelItems): Promise<InventoryExcelItems> {
    try {
      if (newItem.shape != null) {
        let rapPrice: RapPriceRequest = {
          shape: newItem.shape,
          weight: newItem.weight,
          color: newItem.color,
          clarity: newItem.clarity
        }

        let pricing = await this.diamantoRequestService.getRapPrice(rapPrice);
        if (pricing)
          newItem.rap = pricing.price;
        else
          newItem.rap = null as any;
      }
      else
        newItem.rap = null as any;

      newItem.discount = null as any;
      newItem.netAmount = null as any;
      newItem.perCarat = null as any;
    }
    catch (error: any) {
      console.error(error);

      newItem.rap = null as any;
      newItem.discount = null as any;
      newItem.netAmount = null as any;
      newItem.perCarat = null as any;
    }
    return newItem;
  }

  public calculateDept(target: InventoryExcelItems): void {
    if (target.height && (target.length || target.width)) {
      target.length = parseFloat(target.length?.toString() ?? '');
      target.width = parseFloat(target.width?.toString() ?? '');
      target.height = parseFloat(target.height?.toString() ?? '');
      if (target.shape?.toLowerCase() == 'round')
        target.depth = ((target.height ?? 0) / (target.length ?? 0)) * 100;
      else if (target.shape?.toLowerCase() == 'heart') {
        let val = (target.length ?? 0);
        if ((target.length ?? 0) < (target.width ?? 0))
          val = (target.width ?? 0);
        target.depth = ((target.height ?? 0) / val) * 100;
      }
      else {
        let val = (target.length ?? 0);
        if ((target.length ?? 0) > (target.width ?? 0))
          val = (target.width ?? 0);
        target.depth = ((target.height ?? 0) / val) * 100;
      }
      if (target.depth == Infinity || target.depth == 0)
        target.depth = null as any;
      else
        target.depth = this.utilityService.ConvertToFloatWithTwoDecimal(target.depth ?? 0);
    }
    else
      target.depth = null as any;
  }

  public async checkValidationForAll(existData: InventoryExcelItems[]) {
    try {
      let notValidRap: string[] = [];
      notValidRap = existData.filter(z => z.rap == null || z.rap == 0).map(z => z.stoneId);

      //#region validation for exist stones
      let fetchExcelIds: string[] = existData.map((x: any) => x.stoneId);
      this.existStoneIds = await this.inventoryUploadService.getStoneIdsExistOrNotAsync(fetchExcelIds)
      if (this.existStoneIds && this.existStoneIds.length > 0) {
        this.validateValues(existData, this.existStoneIds, "StoneId is already Exist");
        notValidRap = notValidRap.filter(z => !this.existStoneIds.includes(z));
      }
      //#endregion

      //#region  validation for shape
      var notValidShapeId: string[] = existData.filter(z => z.shape == null).map(z => z.stoneId);
      this.validateValues(existData, notValidShapeId, "Please add valid shape");
      notValidRap = notValidRap.filter(z => !notValidShapeId.includes(z));
      //#endregion

      //#region  validation for color
      var distinctColors: string[] = existData.map((u: any) => u.color).filter((x: any, i: any, a: any) => x && a.indexOf(x) === i);
      var remainColors: string[] = [];
      distinctColors.forEach(color => {
        var obj = this.allColors.find(c => c.name.toLowerCase() == color.toLowerCase() || c.displayName.toLowerCase() == color.toLowerCase() || c.optionalWords && c.optionalWords.map(u => u.toLowerCase().trim()).includes(color.toLowerCase()));
        if (!obj)
          remainColors.push(color);
      });
      if (remainColors && remainColors.length > 0) {
        let notValidColorId: string[] = [];
        let undefinedColorId: string[] = [];

        remainColors.forEach(element => {
          let fetchColor = existData.filter((x: any) => x.color == element || x.color == undefined || x.color == "");
          if (fetchColor && fetchColor.length > 0) {
            fetchColor.forEach((element: any) => {
              element.isDisabled = true;
              if (element.color)
                notValidColorId.push(element.stoneId);
              else
                undefinedColorId.push(element.stoneId)
            });
          }
        });
        this.validateValues(existData, notValidColorId, "Please add valid color")
        this.validateValues(existData, undefinedColorId, "Color is required")
        let removeStoneIds = notValidColorId.concat(undefinedColorId);
        notValidRap = notValidRap.filter(z => !removeStoneIds.includes(z));
      }
      //#endregion

      //#region  validation for clarity
      var distinctClarities: string[] = existData.map((u: any) => u.clarity).filter((x: any, i: any, a: any) => x && a.indexOf(x) === i);
      var remainClarities: string[] = [];
      distinctClarities.forEach(clarity => {
        var obj = this.allClarities.find(c => c.name.toLowerCase() == clarity.toLowerCase() || c.displayName.toLowerCase() == clarity.toLowerCase() || c.optionalWords && c.optionalWords.map(u => u.toLowerCase().trim()).includes(clarity.toLowerCase()));
        if (!obj)
          remainClarities.push(clarity);
      });
      if (remainClarities && remainClarities.length > 0) {
        let notValidClarityId: string[] = [];
        let undefinedClarityId: string[] = [];

        remainClarities.forEach(element => {
          let fetchClarity = existData.filter((x: any) => x.clarity == element || x.clarity == undefined || x.clarity == "");
          if (fetchClarity && fetchClarity.length > 0) {
            fetchClarity.forEach((element: any) => {
              element.isDisabled = true;
              if (element.clarity)
                notValidClarityId.push(element.stoneId);
              else
                undefinedClarityId.push(element.stoneId)
            });
          }
        });
        this.validateValues(existData, notValidClarityId, "Please add valid clarity")
        this.validateValues(existData, undefinedClarityId, "Clarity is required")
        let removeStoneIds = notValidClarityId.concat(undefinedClarityId);
        notValidRap = notValidRap.filter(z => !removeStoneIds.includes(z));
      }
      //#endregion

      //#region  validation for fluorescence
      var distinctFluorescences: string[] = existData.map((u: any) => u.fluorescence).filter((x: any, i: any, a: any) => x && a.indexOf(x) === i);
      var remainFluorescence: string[] = [];
      distinctFluorescences.forEach(fluorescence => {
        var obj = this.allTheFluorescences.find(c => c.name.toLowerCase() == fluorescence.toLowerCase() || c.displayName.toLowerCase() == fluorescence.toLowerCase() || c.optionalWords && c.optionalWords.map(u => u.toLowerCase().trim()).includes(fluorescence.toLowerCase()));
        if (!obj)
          remainFluorescence.push(fluorescence);
      });
      if (remainFluorescence && remainFluorescence.length > 0) {
        let notValidFluorescenceId: string[] = [];
        let undefinedFluorescenceId: string[] = [];

        remainFluorescence.forEach(element => {
          let fetchFluorescence = existData.filter((x: any) => x.fluorescence == element || x.fluorescence == undefined || x.fluorescence == "");
          if (fetchFluorescence && fetchFluorescence.length > 0) {
            fetchFluorescence.forEach((element: any) => {
              element.isDisabled = true;
              if (element.fluorescence)
                notValidFluorescenceId.push(element.stoneId);
              else
                undefinedFluorescenceId.push(element.stoneId)
            });
          }
        });
        this.validateValues(existData, notValidFluorescenceId, "Please add valid fluorescence")
        this.validateValues(existData, undefinedFluorescenceId, "Fluorescence is required")
        let removeStoneIds = notValidFluorescenceId.concat(undefinedFluorescenceId);
        notValidRap = notValidRap.filter(z => !removeStoneIds.includes(z));
      }
      //#endregion

      //#region  validation for cut
      var distinctCuts: string[] = existData.map((u: any) => u.cut).filter((x: any, i: any, a: any) => x && a.indexOf(x) === i);
      var remainCuts: string[] = [];
      distinctCuts.forEach(cut => {
        var obj = this.allTheCPS.find(c => c.name.toLowerCase() == cut.toLowerCase() || c.displayName.toLowerCase() == cut.toLowerCase() || c.optionalWords && c.optionalWords.map(u => u.toLowerCase().trim()).includes(cut.toLowerCase()));
        if (!obj)
          remainCuts.push(cut);
      });
      if (remainCuts && remainCuts.length > 0) {
        let notValidCutId: string[] = [];
        let undefinedCutId: string[] = [];

        remainCuts.forEach(element => {
          let fetchCut = existData.filter((x: any) => x.cut == element || x.cut == undefined || x.cut == "");
          if (fetchCut && fetchCut.length > 0) {
            fetchCut.forEach((element: any) => {
              element.isDisabled = true;
              if (element.cut)
                notValidCutId.push(element.stoneId);
              else
                undefinedCutId.push(element.stoneId)
            });
          }
        });
        this.validateValues(existData, notValidCutId, "Please add valid cut")
        this.validateValues(existData, undefinedCutId, "Cut is required")
        let removeStoneIds = notValidCutId.concat(undefinedCutId);
        notValidRap = notValidRap.filter(z => !removeStoneIds.includes(z));
      }
      //#endregion

      //#region  validation for Girdle
      let girdleAll = this.measurementData.filter(item => item.type.toLowerCase().indexOf('girdle') !== -1);

      var distinctMinGirlds: string[] = existData.map((u: any) => u.minGirdle).filter((x: any, i: any, a: any) => x && a.indexOf(x) === i);
      var remainMinGirlds: string[] = [];
      distinctMinGirlds.forEach(z => {
        var obj = girdleAll.find(c => c.name.toLowerCase() == z.toLowerCase() || c.displayName.toLowerCase() == z.toLowerCase() || c.optionalWords && c.optionalWords.map(u => u.toLowerCase().trim()).includes(z.toLowerCase()));
        if (!obj)
          remainMinGirlds.push(z);
      });
      if (remainMinGirlds && remainMinGirlds.length > 0) {
        let notValidGirdleId: string[] = [];
        let undefinedGirdleId: string[] = [];

        remainMinGirlds.forEach(element => {
          let fetchGirdle = existData.filter((x: any) => x.minGirdle == element || x.minGirdle == undefined || x.minGirdle == "");
          if (fetchGirdle && fetchGirdle.length > 0) {
            fetchGirdle.forEach((element: any) => {
              element.isDisabled = true;
              if (element.cut)
                notValidGirdleId.push(element.stoneId);
              else
                undefinedGirdleId.push(element.stoneId)
            });
          }
        });
        this.validateValues(existData, notValidGirdleId, "Please add valid min Girdle")
        this.validateValues(existData, undefinedGirdleId, "Min Girdle is required")
        let removeStoneIds = notValidGirdleId.concat(undefinedGirdleId);
        notValidRap = notValidRap.filter(z => !removeStoneIds.includes(z));
      }

      var distinctMaxGirlds: string[] = existData.map((u: any) => u.maxGirdle).filter((x: any, i: any, a: any) => x && a.indexOf(x) === i);
      var remainMaxGirlds: string[] = [];
      distinctMaxGirlds.forEach(z => {
        var obj = girdleAll.find(c => c.name.toLowerCase() == z.toLowerCase() || c.displayName.toLowerCase() == z.toLowerCase() || c.optionalWords && c.optionalWords.map(u => u.toLowerCase().trim()).includes(z.toLowerCase()));
        if (!obj)
          remainMaxGirlds.push(z);
      });
      if (remainMaxGirlds && remainMaxGirlds.length > 0) {
        let notValidGirdleId: string[] = [];
        let undefinedGirdleId: string[] = [];

        remainMaxGirlds.forEach(element => {
          let fetchGirdle = existData.filter((x: any) => x.maxGirdle == element || x.maxGirdle == undefined || x.maxGirdle == "");
          if (fetchGirdle && fetchGirdle.length > 0) {
            fetchGirdle.forEach((element: any) => {
              element.isDisabled = true;
              if (element.cut)
                notValidGirdleId.push(element.stoneId);
              else
                undefinedGirdleId.push(element.stoneId)
            });
          }
        });
        this.validateValues(existData, notValidGirdleId, "Please add valid max Girdle")
        this.validateValues(existData, undefinedGirdleId, "Max Girdle is required")
        let removeStoneIds = notValidGirdleId.concat(undefinedGirdleId);
        notValidRap = notValidRap.filter(z => !removeStoneIds.includes(z));
      }
      //#endregion

      this.validateValues(existData, notValidRap, "Pricing not Exist");
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }

  public clearGrid(): void {
    this.isShowCheckBoxAll = true;
    this.inventoryExcelItems = [];
    this.selectedInventoryExcelItems = [];
    this.errorMessagesByStoneId = [];
    this.mySelection = [];
    this.listKapan = [];
    if (this.inventoryManualForm)
      this.inventoryManualForm.reset();
    this.loadItems(this.inventoryExcelItems);
  }

  public clearFilter(form: NgForm) {
    this.spinnerService.show();
    setTimeout(() => {
      form.reset();
      this.inventoryFilterObj = new InventoryFilter();
      this.listShape.forEach(z => { z.isChecked = false });
      this.listKapan.forEach(z => { z.isChecked = false });
      this.listColor.forEach(z => { z.isChecked = false });
      this.listClarity.forEach(z => { z.isChecked = false });
      this.listCut.forEach(z => { z.isChecked = false });
      this.listPolish.forEach(z => { z.isChecked = false });
      this.listSymm.forEach(z => { z.isChecked = false });
      this.listFlour.forEach(z => { z.isChecked = false });
      this.loadItems(this.inventoryExcelItems);
    }, 100);
  }

  public onFilterSubmit(form: NgForm) {
    this.spinnerService.show();
    let allData = [...this.inventoryExcelItems];

    let filterData = allData.filter(a => this.utilityService.ApplyStringFilter(a.stoneId, this.inventoryFilterObj.stoneId) &&
      this.ApplyArrayStringFilter(a.kapan, this.inventoryFilterObj.kapan) &&
      this.ApplyArrayStringFilter(a.shape, this.inventoryFilterObj.shape) &&
      this.ApplyArrayStringFilter(a.color, this.inventoryFilterObj.color) &&
      this.ApplyArrayStringFilter(a.clarity, this.inventoryFilterObj.clarity) &&
      this.ApplyArrayStringFilter(a.cut, this.inventoryFilterObj.cut) &&
      this.ApplyArrayStringFilter(a.polish, this.inventoryFilterObj.polish) &&
      this.ApplyArrayStringFilter(a.symmetry, this.inventoryFilterObj.symmetry) &&
      this.ApplyArrayStringFilter(a.fluorescence, this.inventoryFilterObj.fluorescence) &&
      (this.inventoryFilterObj.minSize != null ? (a.weight >= this.inventoryFilterObj.minSize) : true) &&
      (this.inventoryFilterObj.maxSize != null ? (a.weight <= this.inventoryFilterObj.maxSize) : true));

    this.loadItems(filterData);
  }

  public ApplyArrayStringFilter(a: string, z: string[]): boolean {
    let filter = true;
    if ((a == null || a == undefined || a?.length == 0) && (z == null || z == undefined || z?.length == 0))
      filter = true;
    else
      if (a == null || a == undefined || a?.length == 0)
        filter = false;
      else
        if ((a && a.length > 0) && (z && z.length > 0))
          filter = z.map(b => b.toLowerCase()).includes(a.toLowerCase());
    return filter;
  }

  public isVisibleCheckAll() {
    const DisabledCount = this.inventoryExcelItems.filter((obj) => obj.isDisabled === true).length;
    if (DisabledCount == this.inventoryExcelItems.length)
      this.isShowCheckBoxAll = false;
  }

  public onSelect(event: any): void {
    if (event.selectedRows && event.selectedRows.length > 0) {
      event.selectedRows.forEach((element: any) => {
        if (!element.dataItem.isDisabled)
          this.selectedInventoryExcelItems.push(this.inventoryExcelItems[element.index])
      });
    }
    else {
      event.deselectedRows.forEach((element: any) => {
        if (!element.dataItem.isDisabled) {
          let index = this.selectedInventoryExcelItems.findIndex(x => x.stoneId == element.dataItem.stoneId);
          if (index >= 0)
            this.selectedInventoryExcelItems.splice(index, 1)
        }
      });
    }
  }

  public setSelectableSettings() {
    this.selectableSettings = {
      mode: "multiple",
      checkboxOnly: true
    };
  }

  public loadItems(grid_data: InventoryExcelItems[]) {
    this.gridView = {
      // data: this.inventoryExcelItems,
      // total: this.inventoryExcelItems.length
      data: grid_data,
      total: grid_data.length
    }
    this.totalPcs = grid_data.length;

    this.totalAmount = 0;
    this.totalWeight = 0;

    grid_data.forEach(z => {
      this.totalAmount += parseFloat(z.netAmount?.toString() ?? "0");
      this.totalWeight += parseFloat(z.weight.toString());
    });

    this.totalAmount = this.utilityService.ConvertToFloatWithTwoDecimal(this.totalAmount);
    this.totalWeight = this.utilityService.ConvertToFloatWithTwoDecimal(this.totalWeight);

    this.spinnerService.hide();
  }

  public validateValues(data: any, ids: string[], message: string, isPriceAvai: boolean = true) {
    ids.forEach(element => {
      let messageArray = [];
      messageArray.push(message)
      let findErrorIndex = this.errorMessagesByStoneId.findIndex(x => x.stoneId == element);
      if (findErrorIndex >= 0) {
        let messageIndex = this.errorMessagesByStoneId[findErrorIndex].messageList.findIndex(x => x == message);
        if (messageIndex < 0)
          this.errorMessagesByStoneId[findErrorIndex].messageList.push(message)
      }
      else
        this.errorMessagesByStoneId.push({ stoneId: element, messageList: messageArray });
      let index = data.findIndex((x: any) => x.stoneId == element);
      if (index >= 0) {
        data[index].isDisabled = true;
        data[index].isPriceAvailable = isPriceAvai;
      }
    });
  }

  public removeValidateValues(data: any, ids: string[]) {
    ids.forEach(element => {
      let findErrorIndex = this.errorMessagesByStoneId.findIndex(x => x.stoneId == element);
      if (findErrorIndex >= 0)
        this.errorMessagesByStoneId[findErrorIndex].messageList = [];
      let index = data.findIndex((x: any) => x.stoneId == element);
      if (index >= 0) {
        data[index].isDisabled = true;
        data[index].isPriceAvailable = true;
      }
    });
  }

  public isDisabled(args: RowClassArgs) {
    return {
      'k-state-disabled': args.dataItem.isDisabled === true
    };
  }

  public fetchError(id: string) {
    return this.errorMessagesByStoneId.find(x => x.stoneId == id)
  }

  public groupChange(groups: GroupDescriptor[]): void {
    this.groups = groups;
    if (this.inventoryExcelItems && this.inventoryExcelItems.length > 0)
      this.groupInventoryExcel();
  }

  private groupInventoryExcel(): void {
    if (this.groups.length > 0)
      this.gridView = process(this.inventoryExcelItems, { group: this.groups });
    else
      this.loadItems(this.inventoryExcelItems);
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    if (this.inventoryExcelItems && this.inventoryExcelItems.length > 0)
      this.sortInventoryExcel()
  }

  private sortInventoryExcel(): void {
    this.gridView = {
      data: orderBy(this.gridView.data, this.sort),
      total: this.inventoryExcelItems.length
    };
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

  //#region Add/Edit Inventory
  public handleFilter(e: any): string {
    return e;
  }

  public async uploadInventoryResultFile(form?: NgForm) {
    let warningMsg = 'Are you sure you want to upload as MFG stones?';
    if (this.isInvMarketsheetExcel)
      warningMsg = 'Are you sure you want to upload as purchased stones?';

    this.alertDialogService.ConfirmYesNo(warningMsg, "Upload Inventory")
      .subscribe(async (res: any) => {
        if (res.flag) {
          try {
            let stoneIds = Array<string>();
            this.spinnerService.show();

            if (this.selectedInventoryExcelItems.length > 0) {
              //Apply Box Serial No
              this.selectedInventoryExcelItems.forEach(z => { z.boxSerialNo = this.boxSerialNo; });

              stoneIds = await this.inventoryUploadService.saveInventoryFile(this.selectedInventoryExcelItems);
              if (stoneIds && stoneIds.length > 0) {
                await this.savePricingRequestDiamanto(this.selectedInventoryExcelItems);
                this.removeValidateValues(this.inventoryExcelItems, stoneIds);
                this.validateValues(this.inventoryExcelItems, stoneIds, "StoneId is already Exist", true);
                this.isVisibleCheckAll();
                this.mySelection = [];
                this.selectedInventoryExcelItems = [];

                this.spinnerService.hide();
                // this.SendNotificationForPriceRequest(stoneIds);
              }
              else
                this.spinnerService.hide();

              this.resetForm(form);
              this.utilityService.showNotification(`Inventory have been successfully uploaded!`);
              this.boxSerialNo = '';
              this.showSavePopup = false;
            }
            else {
              this.spinnerService.hide();
              this.utilityService.showNotification(`Something went wrong while adding new Inventory`)
            }

          }
          catch (error: any) {
            this.spinnerService.hide();
            this.selectedInventoryExcelItems = [];
            this.alertDialogService.show(error.error)
          }
        }
      });
  }

  // public async SendNotificationForPriceRequest(stoneIds: string[]) {
  //   let empIds = await this.employeeCriteriaService.getEmpIdsForNotificationFromStoneIds(stoneIds);
  //   if (empIds && empIds.length > 0) {
  //     empIds.forEach(z => {
  //       let message: Notifications = PriceRequestTemplate(this.fxCredentials, z);
  //       this.notificationService.messages.next(message);
  //     });
  //     this.spinnerService.hide();
  //   }
  //   else
  //     this.spinnerService.hide();
  // }

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

  public onOpenDropdown(list: Array<{ name: string; isChecked: boolean }>, e: boolean, selectedData: string[]): boolean {
    if (selectedData?.length == list.map(z => z.name).length)
      e = true;
    else
      e = false;
    return e;
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

  public cellClickHandler(e: any) {
    // this.mySelection = [];
    // this.selectedInventoryExcelItems = [];
    // if (!e.dataItem.isDisabled) {
    //   this.mySelection.push(e.dataItem.stoneId);
    //   this.selectedInventoryExcelItems.push(e.dataItem);
    // }
  }

  public openAddInventoryDialog(): void {
    this.inventoryUploadObj = new InventoryExcelItems();
    this.isEditInventory = true;
    this.insertFlag = true;
  }

  public onStoneIdChange(): void {
    let stoneIdArray = this.inventoryUploadObj.stoneId.split("-");
    this.inventoryUploadObj.kapan = stoneIdArray[0];
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

  public openEditInventoryDialog(): void {
    this.inventoryUploadObj = { ...this.selectedInventoryExcelItems[0] };
    this.assignDropDownDataForEdit();
    this.isEditInventory = true;
    this.isRateFound = false;
    this.insertFlag = false;
  }

  public closeEditInventoryDialog(): void {
    this.isEditInventory = false;
  }

  public async onUploadInventorySubmit(form: NgForm, flag: boolean) {
    if (form.valid) {
      if (this.insertFlag) {
        this.selectedInventoryExcelItems.push(this.inventoryUploadObj);
        await this.uploadInventoryResultFile(form);
      }
      else {
        let index = this.inventoryExcelItems.findIndex(x => x.stoneId == this.inventoryUploadObj.stoneId);
        if (index >= 0) {
          this.inventoryUploadObj.rap = parseFloat(this.inventoryUploadObj.rap?.toString() ?? '');
          this.inventoryUploadObj.discount = parseFloat(this.inventoryUploadObj.discount?.toString() ?? '');
          this.inventoryUploadObj.netAmount = parseFloat(this.inventoryUploadObj.netAmount?.toString() ?? '');
          this.inventoryUploadObj.perCarat = parseFloat(this.inventoryUploadObj.perCarat?.toString() ?? '');
          this.inventoryUploadObj.isDisabled = false;
          this.inventoryUploadObj.isPriceAvailable = true;

          this.inventoryExcelItems[index] = this.inventoryUploadObj;
          let selectedIndex = this.selectedInventoryExcelItems.findIndex(x => x.stoneId == this.inventoryUploadObj.stoneId);
          if (selectedIndex != -1)
            this.selectedInventoryExcelItems[selectedIndex] = this.inventoryUploadObj;

          this.resetForm(form);

          this.utilityService.showNotification("You have been updated Inventory successfully");
          this.loadItems(this.inventoryExcelItems);
        }
        else
          this.utilityService.showNotification("Something went wrong");
      }
      if (flag)
        this.isEditInventory = false;
      else {
        this.insertFlag = true;
        this.selectedInventoryExcelItems = [];
        this.mySelection = [];
      }
    }
    else
      Object.keys(form.controls).forEach(key => { form.controls[key].markAsTouched(); });
  }

  public resetForm(form?: NgForm) {
    this.inventoryUploadObj = new InventoryExcelItems();
    this.insertFlag = true;
    this.isRateFound = true;
    form?.reset();
  }
  //#endregion

  //#region Delete Inventory
  public openDeleteDialog() {
    try {
      let message: string = "";
      message = this.selectedInventoryExcelItems.length == 1 ? "Stone has been deleted successfully!" : "Stones have been deleted successfully!";
      this.alertDialogService.ConfirmYesNo("Are you sure you want to delete?", "Delete")
        .subscribe(async (res: any) => {
          this.mySelection = [];
          if (res.flag) {
            this.spinnerService.show();
            this.selectedInventoryExcelItems.forEach(z => {
              let index = this.inventoryExcelItems.findIndex(a => a.stoneId == z.stoneId);
              if (index >= 0)
                this.inventoryExcelItems.splice(index, 1)
            })
            this.selectedInventoryExcelItems = [];
            this.spinnerService.hide();
            this.utilityService.showNotification(message)
          }
        })
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }
  //#endregion

  //#region Grid Inventory Manual
  public async fetchInventory(form: NgForm) {
    try {
      this.alertDialogService.show("This feature is not integrated yet!");
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }
  //#endregion

  //#region Pricing Functions
  public async savePricingRequestDiamanto(invExcelItems: InventoryExcelItems[]) {
    try {
      let invItems: InventoryItems[] = [];
      invExcelItems = invExcelItems.filter(z => z.discount == null);
      if (invExcelItems != null && invExcelItems.length > 0) {
        invExcelItems.forEach(z => { invItems.push(this.mappingInvExcelToInvItems(z)) });
        await this.diamantoRequestService.insertPricingRequest(invItems);
        this.utilityService.showNotification('Pricing request submitted!');
      }

    } catch (error: any) {
      this.utilityService.showNotification('Pricing request not inserted!', 'error');
      console.error(error);
    }
  }

  public mappingInvExcelToInvItems(invExcelItem: InventoryExcelItems): InventoryItems {
    let item: InventoryItems = new InventoryItems();
    item.stoneId = invExcelItem.stoneId;
    item.kapan = invExcelItem.kapan;
    item.article = invExcelItem.article;
    item.shape = invExcelItem.shape;
    item.weight = invExcelItem.weight;
    item.color = invExcelItem.color;
    item.clarity = invExcelItem.clarity;
    item.cut = invExcelItem.cut;
    item.polish = invExcelItem.polish;
    item.symmetry = invExcelItem.symmetry;
    item.fluorescence = invExcelItem.fluorescence;
    item.comments = invExcelItem.comments;
    item.measurement.depth = invExcelItem.depth ?? 0;
    item.measurement.table = invExcelItem.table ?? 0;
    item.measurement.length = invExcelItem.length ?? 0;
    item.measurement.width = invExcelItem.width ?? 0;
    item.measurement.height = invExcelItem.height ?? 0;
    item.measurement.crownHeight = invExcelItem.crownHeight ?? 0;
    item.measurement.crownAngle = invExcelItem.crownAngle ?? 0;
    item.measurement.pavilionDepth = invExcelItem.pavilionDepth ?? 0;
    item.measurement.pavilionAngle = invExcelItem.pavilionAngle ?? 0;
    item.measurement.girdlePer = invExcelItem.girdlePer ?? 0;
    item.measurement.minGirdle = invExcelItem.minGirdle ?? '';
    item.measurement.maxGirdle = invExcelItem.maxGirdle ?? '';
    item.measurement.ratio = invExcelItem.ratio ?? 0;

    item.basePrice.rap = invExcelItem.rap ?? 0;
    item.basePrice.discount = invExcelItem.discount ?? 0;
    item.basePrice.netAmount = invExcelItem.netAmount ?? 0;
    item.basePrice.perCarat = invExcelItem.perCarat ?? 0;

    if (this.isInvMarketsheetExcel) {
      item.lab = invExcelItem.lab;
      item.certificateNo = invExcelItem.certificateNo;

      item.inclusion.flColor = invExcelItem.flColor;
      item.inclusion.ktoS = invExcelItem.ktoS;
      item.inscription = invExcelItem.inscription;
      item.status = StoneStatus.Lab.toString();
    }
    else
      item.status = StoneStatus.Arrival.toString();

    item.stoneOrg.orgId = this.fxCredentials.organizationId;
    item.stoneOrg.orgName = this.fxCredentials.organization;
    item.stoneOrg.deptId = this.fxCredentials.departmentId;
    item.stoneOrg.deptName = this.fxCredentials.department;
    item.stoneOrg.branchName = this.fxCredentials.branch;
    item.stoneOrg.country = this.organizationAddress.country;
    item.stoneOrg.city = this.organizationAddress.city;
    item.identity.name = this.fxCredentials.fullName;
    item.identity.id = this.fxCredentials.id;
    item.identity.type = 'Employee';
    return item;
  }

  public async calculateRate() {
    try {
      this.spinnerService.show();
      let response = await this.getRapPriceServerApiData(this.inventoryUploadObj);
      if (response && response.length > 0) {
        let target = response.find(a => a.Id == this.inventoryUploadObj.stoneId);
        if (target && target.Error == null) {
          target = this.utilityService.setAmtForPricingDiscountResponse(target, this.inventoryUploadObj.weight);
          this.inventoryUploadObj.rap = target.RapPrice;
          this.inventoryUploadObj.discount = target.Discount;
          this.inventoryUploadObj.netAmount = target.Amount;
          this.inventoryUploadObj.perCarat = target.DCaret;
          this.spinnerService.hide();
          if (target.RapPrice == 0.00)
            this.isRateFound = false;
          else
            this.isRateFound = true;
        }
        else {
          this.spinnerService.hide();
          if (target && target.RapPrice != null && target.RapPrice > 0)
            this.inventoryUploadObj.rap = target.RapPrice;
          else
            this.inventoryUploadObj.rap = null as any;
          this.inventoryUploadObj.rap = null as any;
          this.inventoryUploadObj.discount = null as any;
          this.inventoryUploadObj.netAmount = null as any;
          this.inventoryUploadObj.perCarat = null as any;
          this.isRateFound = false;
          this.alertDialogService.show(target?.Error)
        }
      }
      else {
        this.spinnerService.hide();
        this.inventoryUploadObj.rap = null as any;
        this.inventoryUploadObj.discount = null as any;
        this.inventoryUploadObj.netAmount = null as any;
        this.inventoryUploadObj.perCarat = null as any;
        this.isRateFound = false;
        this.alertDialogService.show('Discount not found!')
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }

  private async setBasePricing(data: InventoryExcelItems[]): Promise<InventoryExcelItems[]> {
    try {
      let reqList: MfgPricingRequest[] = [];
      data.forEach(z => {
        if (z.shape) {
          reqList.push(this.mappingPricingRequestData(z));
        }
      });

      let response = await this.pricingService.getBasePrice(reqList);
      if (response && response.length > 0) {
        for (let index = 0; index < data.length; index++) {
          let z = data[index];
          let target = response.find(a => a.Id == z.stoneId);
          if (target && target.RapPrice != null && target.RapPrice > 0) {
            if (target.Error == null) {
              target = this.utilityService.setAmtForPricingDiscountResponse(target, z.weight);
              z.rap = target.RapPrice;
              z.discount = target.Discount;
              z.netAmount = target.Amount;
              z.perCarat = target.DCaret;
            }
            else {
              z.rap = target.RapPrice;
              z.discount = null as any;
              z.netAmount = null as any;
              z.perCarat = null as any;
            }
          }
          else
            z = await this.getRapPriceData(z);
        }
      }
      return data;
    }
    catch (error: any) {
      console.error(error);
      this.utilityService.showNotification('Pricing not get, Try again later!', 'Warning');
      return data;
    }
  }

  public mappingPricingRequestData(item: InventoryExcelItems): MfgPricingRequest {
    let mesurement = new MfgMeasurementData();
    mesurement.TblDepth = item.depth ?? 0;
    mesurement.TblAng = item.table ?? 0;
    mesurement.Length = item.length ?? 0;
    mesurement.Width = item.width ?? 0;
    mesurement.Height = item.height ?? 0;
    mesurement.CrHeight = item.crownHeight ?? 0;
    mesurement.CrAngle = item.crownAngle ?? 0;
    mesurement.PvlDepth = item.pavilionDepth ?? 0;
    mesurement.PvlAngle = item.pavilionAngle ?? 0;
    mesurement.StarLength = 0;
    mesurement.LowerHalf = 0;
    mesurement.GirdlePer = item.girdlePer ?? 0;
    mesurement.MinGirdle = item.minGirdle;
    mesurement.MaxGirdle = item.maxGirdle;
    mesurement.Ratio = item.ratio ?? 0;

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

  private async getRapPriceServerApiData(data: InventoryExcelItems): Promise<PricingDiscountApiResponse[]> {
    let response: PricingDiscountApiResponse[] = [];
    try {
      let reqList: MfgPricingRequest[] = [];
      reqList.push(this.mappingPricingRequestData(data));

      response = await this.pricingService.getBasePrice(reqList);

    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show('Something went wrong on get pricing, Try again later.');
    }
    return response;
  }

  public updatePricingData(data: InventoryExcelItems) {
    if (!data.isPriceAvailable) {
      this.inventoryUploadObj = { ...data };

      this.assignDropDownDataForEdit();
      this.inventoryUploadObj.rap = undefined;
      this.inventoryUploadObj.discount = undefined;
      this.inventoryUploadObj.netAmount = undefined;
      this.inventoryUploadObj.perCarat = undefined;

      this.isRateFound = false;

      this.isEditInventory = true;
      this.insertFlag = false;
    }
  }

  //Match Name for Dropdown Selection
  public assignDropDownDataForEdit() {
    const shape = this.inventoryUploadObj.shape;
    var obj = this.allTheShapes.find(c => c.name.toLowerCase() == shape.toLowerCase() || c.displayName.toLowerCase() == shape.toLowerCase() || c.optionalWords && c.optionalWords.map(u => u.toLowerCase().trim()).includes(shape.toLowerCase()));
    if (obj)
      this.inventoryUploadObj.shape = obj.name;

    const color = this.inventoryUploadObj.color;
    var obj = this.allColors.find(c => c.name.toLowerCase() == color.toLowerCase() || c.displayName.toLowerCase() == color.toLowerCase() || c.optionalWords && c.optionalWords.map(u => u.toLowerCase().trim()).includes(color.toLowerCase()));
    if (obj)
      this.inventoryUploadObj.color = obj.name;

    const clarity = this.inventoryUploadObj.clarity;
    var obj = this.allClarities.find(c => c.name.toLowerCase() == clarity.toLowerCase() || c.displayName.toLowerCase() == clarity.toLowerCase() || c.optionalWords && c.optionalWords.map(u => u.toLowerCase().trim()).includes(clarity.toLowerCase()));
    if (obj)
      this.inventoryUploadObj.clarity = obj.name;

    const fluorescence = this.inventoryUploadObj.fluorescence;
    var obj = this.allTheFluorescences.find(c => c.name.toLowerCase() == fluorescence.toLowerCase() || c.displayName.toLowerCase() == fluorescence.toLowerCase() || c.optionalWords && c.optionalWords.map(u => u.toLowerCase().trim()).includes(fluorescence.toLowerCase()));
    if (obj)
      this.inventoryUploadObj.fluorescence = obj.name;

    const cut = this.inventoryUploadObj.cut;
    var obj = this.allTheCPS.find(c => c.name.toLowerCase() == cut.toLowerCase() || c.displayName.toLowerCase() == cut.toLowerCase() || c.optionalWords && c.optionalWords.map(u => u.toLowerCase().trim()).includes(cut.toLowerCase()));
    if (obj)
      this.inventoryUploadObj.cut = obj.name;

    const polish = this.inventoryUploadObj.polish;
    var obj = this.allTheCPS.find(c => c.name.toLowerCase() == polish.toLowerCase() || c.displayName.toLowerCase() == polish.toLowerCase() || c.optionalWords && c.optionalWords.map(u => u.toLowerCase().trim()).includes(polish.toLowerCase()));
    if (obj)
      this.inventoryUploadObj.polish = obj.name;

    const symmetry = this.inventoryUploadObj.symmetry;
    var obj = this.allTheCPS.find(c => c.name.toLowerCase() == symmetry.toLowerCase() || c.displayName.toLowerCase() == symmetry.toLowerCase() || c.optionalWords && c.optionalWords.map(u => u.toLowerCase().trim()).includes(symmetry.toLowerCase()));
    if (obj)
      this.inventoryUploadObj.symmetry = obj.name;
  }

  public calculateRapPricing() {
    if (!this.isRateFound)
      this.setRapPricing(this.inventoryUploadObj);
  }

  public setRapPricing(target: InventoryExcelItems) {
    let rap = target.rap?.toString();
    let disc = target.discount?.toString();
    if (rap && disc && rap.length > 0 && disc.length > 0) {
      if (disc.toString() != '-') {

        let rapNumber = parseFloat(rap);
        let discNumber = parseFloat(disc);
        let weight = target.weight;
        let stoneRap = weight * rapNumber;
        let calDiscount = 100 + discNumber;
        let netAmount = (calDiscount * stoneRap) / 100;

        target.netAmount = this.utilityService.ConvertToFloatWithTwoDecimal(netAmount);
        let perCarat = netAmount / weight;
        target.perCarat = this.utilityService.ConvertToFloatWithTwoDecimal(perCarat);
      }
    }
  }
  //#endregion

  //#region Popup Close
  @HostListener("document:click", ["$event"])
  public documentClick(event: any): void {
    if (!this.contains(event.target))
      this.showExcelOption = false;

    if (!this.containsSave(event.target))
      this.showSavePopup = false;

  }

  private contains(target: any): boolean {
    return (
      this.anchor.nativeElement.contains(target) ||
      (this.popup ? this.popup.nativeElement.contains(target) : false)
    );
  }

  private containsSave(target: any): boolean {
    return (
      this.anchorSave.nativeElement.contains(target) ||
      (this.popupSave ? this.popupSave.nativeElement.contains(target) : false)

    );
  }
  //#endregion

}