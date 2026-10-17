import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { DataResult, GroupDescriptor, process } from '@progress/kendo-data-query';
import { GridMasterConfig, GridConfig } from 'common/entities';
import { NgxSpinnerService } from 'ngx-spinner';
import { Address, GridDetailConfig, MfgInclusionData, MfgMeasurementData, MfgPricingRequest, RapPriceRequest } from 'shared/businessobjects';
import { fxCredential, MasterConfig, MasterDNorm, MeasurementConfig } from 'shared/enitites';
import { ConfigService, PricingService, StoneStatus, UtilityService } from 'shared/services';
import { AlertdialogService } from 'shared/views';
import * as xlsx from 'xlsx';
import { InventoryExcelItems, InverntoryError, InvUpdateItem, LogisticDNorm } from '../../businessobjects';
import { IdentityDNorm, InventoryItems, InWardMemo, LedgerDNorm, MemoInvItem, PriceDNorm } from '../../entities';
import { GridPropertiesService, OrderService, LedgerService, InwardMemoService, LogisticService, DiamantoRequestService, MasterConfigService, InventoryUploadService, OrganizationService } from '../../services';

@Component({
  selector: 'app-inwardmemo',
  templateUrl: './inwardmemo.component.html',
  styles: [
  ]
})
export class InwardmemoComponent implements OnInit {

  public griddata = [
    {
      "chk": "",
      "memono": "1",
      "party": "Glowstar",
      "broker": "XYZ",
      "courierName": "john doe",
      "employee": "Dharmik Patel",
      "expirydays": "5",
      "createddate": "09/06/2022",
      "expirydate": "10/06/2022",
      "isreturned": "",
      "returndate": "11/06/2022",
      "totalpcs": "6",
      "weight": "0.6",
      "amount": "$10,000",
    }
  ]

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

  //#region Master Config
  public masterConfigList!: MasterConfig;
  public allTheShapes!: MasterDNorm[];
  public allColors!: MasterDNorm[];
  public allClarities!: MasterDNorm[];
  public allTheFluorescences!: MasterDNorm[];
  public allTheCPS!: MasterDNorm[];
  public measurementData: MasterDNorm[] = [];
  public measurementConfig: MeasurementConfig = new MeasurementConfig();
  //#endregion

  //#region Objects | Arrays
  public fxCredentials!: fxCredential;
  public selectedInWardItems: InWardMemo[] = [];

  public allInWardItems: InWardMemo[] = [];
  public filterInWardItems: InWardMemo[] = [];

  public inventoryExcelItems: InventoryExcelItems[] = [];

  public inWardObj: InWardMemo = new InWardMemo();
  public existStoneIds: string[] = [];
  public errorMessagesByStoneId: InverntoryError[] = [];

  public organizationAddress: Address = new Address();
  //#endregion

  //#region Modal Flag
  public isInwardmemo: boolean = false
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
  public listLogisticItems: Array<{ text: string; value: string }> = [];
  public logisticItems: LogisticDNorm[] = [];

  public selectedBroker = "";
  public selectedParty = "";
  public selectedLogistic = "";
  //#endregion

  constructor(private router: Router,
    private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService,
    private utilityService: UtilityService,
    private gridPropertiesService: GridPropertiesService,
    private configService: ConfigService,
    private orderService: OrderService,
    private ledgerService: LedgerService,
    private logisticService: LogisticService,
    private inwardMemoService: InwardMemoService,
    private pricingService: PricingService,
    private diamantoRequestService: DiamantoRequestService,
    private masterConfigService: MasterConfigService,
    private organizationService: OrganizationService,
    private inventoryUploadService: InventoryUploadService) { }

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
      await this.loadLogistic();
      await this.loadMasterConfig();
      await this.loadOrganizationData();
      await this.initInWardData();
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
      this.gridConfig = await this.configService.getGridConfig(this.fxCredentials?.id ?? '', "InWard", "InWardGrid");
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
        this.gridMasterConfigResponse = await this.configService.getMasterGridConfig("InWard", "InWardGrid");
        if (this.gridMasterConfigResponse)
          this.fields = this.gridMasterConfigResponse.gridDetail;
        else
          this.fields = await this.gridPropertiesService.getInWardItems();
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
          let Selectedindex = this.selectedInWardItems.findIndex(x => x.id == element.dataItem.id);
          if (Selectedindex < 0)
            this.selectedInWardItems.push(element.dataItem)
        });
      }
      else {
        event.deselectedRows.forEach((element: any) => {
          if (!element.dataItem.isDisabled) {
            let index = this.selectedInWardItems.findIndex(x => x.id == element.dataItem.id);
            if (index >= 0)
              this.selectedInWardItems.splice(index, 1)
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
      this.initInWardData();
    }
    catch (error: any) {
      this.alertDialogService.show(error.error)
    }
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.initInWardData();
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

  public selectAllInWards(e: any) {
    this.selectedInWardItems = [];
    this.mySelection = [];
    if (e.toLowerCase() == 'checked') {
      // if (this.orderSearchResult.totalCount > this.pageSize)
      //   await this.loadAllOrders();
      // else
      //   this.mySelection = this.filterOrderItems.map(z => z.id);
    }
  }
  //#endregion

  //#region Master Config
  public async loadMasterConfig() {

    this.masterConfigList = await this.masterConfigService.getAllMasterConfig();
    this.allTheShapes = this.masterConfigList.shape;
    this.allColors = this.masterConfigList.colors;
    this.allClarities = this.masterConfigList.clarities;
    this.allTheFluorescences = this.masterConfigList.fluorescence;
    this.allTheCPS = this.masterConfigList.cps;

    this.measurementData = this.masterConfigList.measurements;
    this.measurementConfig = this.masterConfigList.measurementConfig;
  }
  //#endregion

  //#region Init Data
  public async initInWardData() {
    try {
      this.spinnerService.show();
      let res = await this.inwardMemoService.getPaginated(this.skip, this.pageSize);
      if (res) {
        this.filterInWardItems = res;
        this.gridView = process(res, { group: this.groups });
        //this.gridView.total = res.totalCount;

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

  public async loadLogistic() {
    try {
      this.spinnerService.show();
      let res = await this.logisticService.getGetLogisticDNormForMemo();
      if (res) {
        this.logisticItems = res;
        this.listLogisticItems = [];
        this.logisticItems.forEach(z => { this.listLogisticItems.push({ text: z.name, value: z.id }); });
      }
      else
        this.spinnerService.hide();
    }
    catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show('Logistic not load, Try gain later!');
    }
  }

  public async loadOrganizationData() {
    try {
      this.organizationAddress = await this.organizationService.getOrganizationAddressByEmployee(this.fxCredentials.id);
    }
    catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show('Organization not load, Try gain later!');
    }
  }
  //#endregion

  //#region OnChange Functions
  public handlePartyFilter(value: any) {
    this.listPartyItems = [];
    let partyItems = this.partyItems.filter(z => z.name.toLowerCase().includes(value.toLowerCase()))
    partyItems.forEach(z => { this.listPartyItems.push({ text: z.name, value: z.id }); });
  }

  public handleBrokerFilter(value: any) {
    this.listBrokerItems = [];
    let brokerItems = this.brokerItems.filter(z => z.name.toLowerCase().includes(value.toLowerCase()))
    brokerItems.forEach(z => { this.listBrokerItems.push({ text: z.name, value: z.id }); });
  }

  public handleLogisticFilter(value: any) {
    this.listLogisticItems = [];
    let logisticItems = this.logisticItems.filter(z => z.name.toLowerCase().includes(value.toLowerCase()))
    logisticItems.forEach(z => { this.listLogisticItems.push({ text: z.name, value: z.id }); });
  }

  public onBrokerChange(e: any) {
    if (e) {
      let fetchBroker = this.brokerItems.find(x => x.id == e);
      if (fetchBroker) {
        setTimeout(() => {
          this.selectedBroker = fetchBroker?.name ?? '';
        }, 0);
        this.inWardObj.broker = fetchBroker ?? new LedgerDNorm();
      }
    }
    else
      this.inWardObj.broker = new LedgerDNorm();
  }

  public onPartyChange(e: any) {
    if (e) {
      let fetchParty = this.partyItems.find(x => x.id == e);
      if (fetchParty) {
        setTimeout(() => {
          this.selectedParty = fetchParty?.name ?? '';
        }, 0);
        this.inWardObj.party = fetchParty ?? new LedgerDNorm();
      }
    }
    else
      this.inWardObj.party = new LedgerDNorm();
  }

  public onLogisticChange(e: any) {
    if (e) {
      let fetchLogistic = this.logisticItems.find(x => x.id == e);
      if (fetchLogistic) {
        setTimeout(() => {
          this.selectedLogistic = fetchLogistic?.name ?? '';
        }, 0);
        this.inWardObj.courierName = fetchLogistic ?? new LedgerDNorm();
      }
    }
    else
      this.inWardObj.courierName = new LedgerDNorm();
  }
  //#endregion

  //#region Modal Changes
  public openInwardmemoDialog(): void {
    this.isInwardmemo = true;
  }

  public closeInwardmemoDialog(): void {
    this.isInwardmemo = false;
  }
  //#endregion

  //#region File Import
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
        this.inventoryExcelItems = [];
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
            if (this.inventoryExcelItems && this.inventoryExcelItems.length > 0)
              await this.checkValidationForAll(this.inventoryExcelItems);

            this.spinnerService.hide();
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

    newItem.lab = data["Lab".toLowerCase()]?.toString().trim();
    newItem.certificateNo = data["CertificateNo".toLowerCase()]?.toString().trim();
    newItem.flColor = data["FluorescenceColor".toLowerCase()]?.toString().trim();
    newItem.ktoS = data["KeytoSymbols".toLowerCase()]?.toString().trim();
    newItem.inscription = data["Inscription".toLowerCase()]?.toString().trim();
    newItem.status = StoneStatus.Pricing.toString();

    newItem.orgId = this.fxCredentials.organizationId;
    newItem.orgName = this.fxCredentials.organization;
    newItem.deptId = this.fxCredentials.departmentId;
    newItem.deptName = this.fxCredentials.department;
    newItem.branchName = this.fxCredentials.branch;

    if (this.organizationAddress) {
      newItem.country = this.organizationAddress.country;
      newItem.city = this.organizationAddress.city;
    }

    newItem.empName = this.fxCredentials.fullName;
    newItem.empId = this.fxCredentials.id;

    this.calculateDept(newItem);

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

  public getDisplayNameFromMasterDNorm(name: string, list: MasterDNorm[]): string {
    var obj = list.find(c => c.name.toLowerCase() == name.toLowerCase() || c.displayName.toLowerCase() == name.toLowerCase() || c.optionalWords && c.optionalWords.map(u => u.toLowerCase().trim()).includes(name.toLowerCase()));
    return obj?.name ?? null as any;
  }

  public fetchError(id: string) {
    return this.errorMessagesByStoneId.find(x => x.stoneId == id)
  }
  //#endregion

  //#region Add InWard Memo
  public async AddinwardMemoFile(form?: NgForm) {
    if (!form?.valid)
      return;

    if (this.inventoryExcelItems.length == 0) {
      this.alertDialogService.show('Please upload inward memo stone data!');
      return;
    }

    var validData = this.inventoryExcelItems.filter(z => z.isDisabled != true);
    if (validData.length == 0) {
      this.alertDialogService.show('Please upload valid excel data!');
      return;
    }

    this.alertDialogService.ConfirmYesNo("Are you sure you want to add inward memo", "Upload Inventory")
      .subscribe(async (res: any) => {
        if (res.flag) {
          try {
            var validData = this.inventoryExcelItems.filter(z => z.isDisabled != true);
            if (validData.length > 0) {
              this.spinnerService.show();

              let req: InvUpdateItem = new InvUpdateItem();
              req.supplierCode = this.fxCredentials.orgCode;
              req.stoneIds = validData.map(z => z.stoneId);
              let res = await this.diamantoRequestService.updateBulkInventoryItems(req)
              if (res && res.length > 0) {
                res.forEach(z => {
                  z.stoneOrg.orgId = this.fxCredentials.organizationId;
                  z.stoneOrg.orgName = this.fxCredentials.organization;
                  z.stoneOrg.deptId = this.fxCredentials.departmentId;
                  z.stoneOrg.deptName = this.fxCredentials.department;
                  z.stoneOrg.branchName = this.fxCredentials.branch;

                  if (this.organizationAddress) {
                    z.stoneOrg.country = this.organizationAddress.country;
                    z.stoneOrg.city = this.organizationAddress.city;
                  }

                  //update inv excel price
                  let index = this.inventoryExcelItems.findIndex(a => a.stoneId == z.stoneId);
                  if (index > -1) {
                    this.inventoryExcelItems[index].rap = z.basePrice.rap ?? 0;
                    this.inventoryExcelItems[index].discount = z.basePrice.discount ?? 0;
                    this.inventoryExcelItems[index].netAmount = z.basePrice.netAmount ?? 0;
                    this.inventoryExcelItems[index].perCarat = z.basePrice.perCarat ?? 0;
                  }
                });

                this.utilityService.showNotification(res.length + ' existing diamanto inventory inserted!');
                let insertRes = await this.inwardMemoService.insertInwardMemoInventory(res);
                if (insertRes) {
                  if (this.inventoryExcelItems.length == res.length)
                    await this.InsertInwardMemo();
                  else {
                    //save Not exists diamanto stones to add and apply pricing request
                    let nonExistsData = this.inventoryExcelItems.filter(z => !req.stoneIds.includes(z.stoneId) && z.isDisabled != true);
                    await this.updateExcelInvData(nonExistsData);
                  }
                }
              }
              else {
                var validData = this.inventoryExcelItems.filter(z => z.isDisabled != true);
                await this.updateExcelInvData(validData);
              }

            }
            else
              this.alertDialogService.show('Please upload valid excel data!');
          }
          catch (error: any) {
            console.error(error);
            this.spinnerService.hide();
            this.alertDialogService.show('Inward memo not add, Please try again later!')
          }
        }
      });
  }

  private async updateExcelInvData(invs: InventoryExcelItems[]): Promise<string[]> {
    try {
      var stoneIds = await this.inventoryUploadService.saveInventoryFile(invs);
      if (stoneIds && stoneIds.length > 0) {
        this.utilityService.showNotification('New inventory submitted!');
        await this.savePricingRequestDiamanto(invs);
        this.inventoryExcelItems = [];
        return stoneIds;
      }
      return [];
    }
    catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show('Inward memo not add, Please try again later!')
      return [];
    }
  }

  public async savePricingRequestDiamanto(invExcelItems: InventoryExcelItems[]) {
    try {
      let invItems: InventoryItems[] = [];
      invExcelItems = invExcelItems.filter(z => z.discount == null);
      if (invExcelItems != null && invExcelItems.length > 0) {
        invExcelItems.forEach(z => { invItems.push(this.mappingInvExcelToInvItems(z)) });
        let res = await this.diamantoRequestService.insertPricingRequest(invItems);
        if (res) {
          this.utilityService.showNotification('Pricing request submitted!');
          await this.InsertInwardMemo();
        }
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show('Pricing request not inserted, Please try again later!');
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

    item.lab = invExcelItem.lab;
    item.certificateNo = invExcelItem.certificateNo;

    item.inclusion.flColor = invExcelItem.flColor;
    item.inclusion.ktoS = invExcelItem.ktoS;
    item.inscription = invExcelItem.inscription;
    item.status = StoneStatus.Lab.toString();

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

  public async InsertInwardMemo() {
    try {
      let employee: IdentityDNorm = new IdentityDNorm();
      employee.name = this.fxCredentials.fullName;
      employee.id = this.fxCredentials.id;
      employee.type = 'Employee';

      this.inWardObj.employee = employee;
      this.inWardObj.inventoryItems = this.mappingInWardInvData();

      let res = await this.inwardMemoService.insert(this.inWardObj);
      if (res) {
        this.utilityService.showNotification('Inward memo request submitted!');
        this.spinnerService.hide();
        this.closeInwardmemoDialog();
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show('Inward memo not inserted, Please try again later!');
      console.error(error);
    }
  }

  public mappingInWardInvData(): MemoInvItem[] {
    let memoIns: MemoInvItem[] = [];

    var validData = this.inventoryExcelItems.filter(z => z.isDisabled != true);
    validData.forEach(z => {
      let obj: MemoInvItem = new MemoInvItem();
      obj.invId = '';
      obj.stoneId = z.stoneId;
      obj.kapan = z.kapan;
      obj.shape = z.shape;
      obj.weight = z.weight;
      obj.color = z.color;
      obj.clarity = z.clarity;
      obj.cut = z.cut;
      obj.polish = z.polish;
      obj.symmetry = z.symmetry;
      obj.fluorescence = z.fluorescence;
      obj.length = z.length ?? null as any;
      obj.width = z.width ?? null as any;
      obj.height = z.height ?? null as any;
      obj.lab = z.lab;
      obj.certificateNo = z.certificateNo;

      let price: PriceDNorm = new PriceDNorm();
      price.rap = z.rap ?? null;
      price.discount = z.discount ?? null;
      price.netAmount = z.netAmount ?? null;
      price.perCarat = z.perCarat ?? null;
      obj.price = price;

      obj.isHeld = false;
      obj.isReturned = false;
      obj.returnDate = null;

      memoIns.push(obj);
    });
    return memoIns;
  }
  //#endregion
}
