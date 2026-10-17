import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { fxCredential, InclusionConfig, MasterConfig, MasterDNorm, MeasurementConfig } from 'shared/enitites';
import { GroupDescriptor } from '@progress/kendo-data-query';
import { CommonService, listColorMarkItems, listGrainingItems, listPriceRequestFilterTypeItems, StoneStatus, UtilityService } from 'shared/services';
import { AlertdialogService } from 'shared/views';
import { NgxSpinnerService } from 'ngx-spinner';
import { MasterConfigService, PricingRequestService, SupplierService, SystemUserService, UserPricingCriteriaService } from '../../../../services';
import { InventoryItems, SupplierDNorm, SystemUser, UserPricingCriteria } from '../../../../entities';
import { InventorySearchCriteria, PriceReqResponse, PriceRequestApiModel } from '../../../../businessobjects';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html'
})
export class FilterComponent implements OnInit {

  //#region Input Output
  @Input() isPricing: boolean = false;
  @Input() groups!: GroupDescriptor[];
  @Input() skip!: number;
  @Input() pageSize!: number;
  @Input() selectedSlots!: UserPricingCriteria[];
  @Input() inventorySearchCriteriaObj!: InventorySearchCriteria;
  @Input() selectedTypeDNormItems!: { text: string | null, value: string | null };
  @Output() ChildEvent = new EventEmitter();
  @Output() toggle: EventEmitter<boolean> = new EventEmitter();
  //#endregion

  //#region List & Objects
  public organizationDNormItems!: SupplierDNorm[];
  public selectedSupplierDNormItems?: { text: string; value: string };
  public selectedDeptItems?: { text: string, value: string };
  public empItems!: SystemUser[];
  public selectedEmpItems?: { text: string, value: string };
  public selectedCPS?: string;

  public listSupplierDNormItems: Array<{ text: string; value: string }> = [];
  public allListSupplierDNormItems: Array<{ text: string; value: string }> = [];
  public listEmpItems: Array<{ text: string; value: string }> = [];

  public masterConfigList!: MasterConfig;
  public allTheLab?: MasterDNorm[];
  public allTheShapes?: MasterDNorm[];
  public allColors?: MasterDNorm[];
  public allClarities?: MasterDNorm[];
  public allTheFluorescences?: MasterDNorm[];
  public allTheCPS?: MasterDNorm[];

  public inclusionData: MasterDNorm[] = [];
  public inclusionConfig: InclusionConfig = new InclusionConfig();
  public measurementData: MasterDNorm[] = [];
  public measurementConfig: MeasurementConfig = new MeasurementConfig();
  public listStatus: Array<{ name: string; isChecked: boolean }> = [];
  public listKToS: Array<{ name: string; isChecked: boolean }> = [];
  public listCulet: Array<{ name: string; isChecked: boolean }> = [];
  public listLocation: Array<{ name: string; isChecked: boolean }> = [];
  public listGrainingItems = listGrainingItems;
  public listColorMarkItems = listColorMarkItems;
  public listColorMark: Array<{ name: string; isChecked: boolean }> = [];

  private fxCredentials!: fxCredential;
  private filterData: { req: PriceRequestApiModel, res: PriceReqResponse } = { req: new PriceRequestApiModel(), res: new PriceReqResponse() };

  public employeeCriteriaData: UserPricingCriteria[] = [];
  public selectedSlotsIds: string[] = [];
  public selectedSlotsDistinct: UserPricingCriteria = new UserPricingCriteria();

  public listPriceRequestFilterTypeItems = listPriceRequestFilterTypeItems;

  public inventoryItems: InventoryItems[] = [];
  public tempInventorySearchCriteriaObj: InventorySearchCriteria = new InventorySearchCriteria();
  //#endregion

  //#region Flag Obj
  public isBGM: boolean = false;
  public showSlotFilter: boolean = true;
  public inclusionFlag: boolean = false;
  //#endregion

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
  public errDiscount: string = "";
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

  public kapanString: string = "";
  //#endregion

  constructor(private pricingRequestService: PricingRequestService,
    private employeeCriteriaService: UserPricingCriteriaService,
    private spinnerService: NgxSpinnerService,
    private alertDialogService: AlertdialogService,
    private masterConfigService: MasterConfigService,
    private organizationService: SupplierService,
    public utilityService: UtilityService,
    private commonService: CommonService,
    private employeeService: SystemUserService) { }

  async ngOnInit() {
    this.fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;
    this.spinnerService.show();
    await this.getMasterConfigData();
    await this.getSupplierDNormData();
    await this.getSystemUserData();
    await this.getUserPricingCriteriaData(this.fxCredentials.id);
    this.setCaratValues();
  }

  //#region Init Data
  public async getUserPricingCriteriaData(id: string) {
    try {
      this.employeeCriteriaData = await this.employeeCriteriaService.getUserPricingCriteriaBySystemUser(id);
      if (this.selectedTypeDNormItems.value == 'Inv') {
        this.showSlotFilter = true;
        if (this.selectedSlots.length > 0)
          this.selectedSlotsIds = this.selectedSlots.map(z => z.id);
        this.distinctSelectedData();

        this.spinnerService.hide();
      }
      else {
        this.spinnerService.hide();
        this.showSlotFilter = false;
        this.distinctSelectedDataAll();
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public setCaratValues() {
    if (this.inventorySearchCriteriaObj.carat != null) {
      if (this.inventorySearchCriteriaObj.carat.includes(",")) {
        var obj = this.inventorySearchCriteriaObj.carat.split(",");
        if (obj.length > 0) {
          obj.forEach((z, i) => {
            if (z.includes("-")) {
              var arr = z.split("-");
              if (i == 0) {
                this.firstCaratFrom = parseFloat(arr[0]);
                this.firstCaratTo = parseFloat(arr[1]);
              }
              else if (i == 1) {
                this.secondCaratFrom = parseFloat(arr[0]);
                this.secondCaratTo = parseFloat(arr[1]);
              }
              else if (i == 2) {
                this.thirdCaratFrom = parseFloat(arr[0]);
                this.thirdCaratTo = parseFloat(arr[1]);
              }
              else if (i == 3) {
                this.fourthCaratFrom = parseFloat(arr[0]);
                this.fourthCaratTo = parseFloat(arr[1]);
              }
            }
          });
        }
      }
      else {
        if (this.inventorySearchCriteriaObj.carat.includes("-")) {
          var arr = this.inventorySearchCriteriaObj.carat.split("-");
          this.firstCaratFrom = parseFloat(arr[0]);
          this.firstCaratTo = parseFloat(arr[1]);
        }
      }
    }
  }

  //#region Org, Emp Data
  private async getSupplierDNormData() {
    try {
      this.organizationDNormItems = await this.organizationService.getSupplierDNorm();
      if (this.organizationDNormItems) {
        this.fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;
        let organizationId = this.fxCredentials.organizationId;
        let organization = this.organizationDNormItems.find(z => z.id == organizationId) ?? new SupplierDNorm();

        this.organizationDNormItems = [{ ...organization }];

        organization = this.organizationDNormItems[0];
        this.selectedSupplierDNormItems = { text: organization.name, value: organization.id };
        this.listSupplierDNormItems.push(this.selectedSupplierDNormItems);
        this.allListSupplierDNormItems = [...this.listSupplierDNormItems];

        await this.onSupplierDNormChange(this.selectedSupplierDNormItems);
      }
    }
    catch (error: any) {
      console.error(error);
      this.alertDialogService.show(error.error);
    }
  }

  public async onSupplierDNormChange(e: any, isEdit: boolean = false) {
    const orgDNorm = this.organizationDNormItems.find(z => z.id == e.value);
    if (orgDNorm != undefined && orgDNorm != null) {
      this.inventorySearchCriteriaObj.organizationId = orgDNorm.id;
    }

    this.spinnerService.show();
  }

  public async getSystemUserData() {
    this.empItems = await this.employeeService.getAllSystemUsers();
    if (this.empItems)
      this.empItems.forEach((z) => { this.listEmpItems.push({ text: z.fullName, value: z.id }); });
  }

  public onSystemUserChange(e: any) {
    const emp = this.empItems.find(z => z.id == e.value);
    if (emp != undefined && emp != null) {
      this.inventorySearchCriteriaObj.empId = emp.id ?? '';
    }
  }
  //#endregion

  //#region Master Config Data
  public async getMasterConfigData() {
    //Status
    Object.values(StoneStatus).forEach(z => { if (z.toString() != StoneStatus.Pricing.toString() && z.toString() != StoneStatus.Sold.toString()) this.listStatus.push({ name: z.toString(), isChecked: false }); });
    if (!this.isPricing) {
      this.inventorySearchCriteriaObj.status = [];
      this.inventorySearchCriteriaObj.status.push(StoneStatus.Stock.toString());
      this.onMultiSelectChange(this.listStatus, this.inventorySearchCriteriaObj.status);
    }
    else
      this.onMultiSelectChange(this.listStatus, this.inventorySearchCriteriaObj.status);

    this.listColorMarkItems.forEach(z => { this.listColorMark.push({ name: z.toString(), isChecked: false }); });
    this.onMultiSelectChange(this.listColorMark, this.inventorySearchCriteriaObj.discColorMark);

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
    this.onMultiSelectChange(this.listKToS, this.inventorySearchCriteriaObj.kToS);

    let allCulet = this.inclusionData.filter(item => item.type.toLowerCase().indexOf('culet') !== -1);
    allCulet.forEach(z => { this.listCulet.push({ name: z.name, isChecked: false }); });
    this.onMultiSelectChange(this.listCulet, this.inventorySearchCriteriaObj.culet);

    this.getCountryData();
  }

  private async getCountryData() {
    try {
      var countryItems = await this.commonService.getCountries();
      if (countryItems) {
        countryItems.forEach(z => { this.listLocation.push({ name: z.name, isChecked: false }); });
        this.onMultiSelectChange(this.listLocation, this.inventorySearchCriteriaObj.location);
      }
    }
    catch (error: any) {
      this.alertDialogService.show(error.error);
    }
  }
  //#endregion

  //#endregion

  //#region OnChange Functions
  public tagMapper(tags: string[]): void {
    // This function is used for hide selected items in multiselect box
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

  public clearSearchCriteria(): void {
    this.inventorySearchCriteriaObj = new InventorySearchCriteria();
    this.inventorySearchCriteriaObj.organizationId = this.fxCredentials?.organizationId ?? '';

    this.firstCaratFrom = undefined;
    this.firstCaratTo = undefined;
    this.secondCaratFrom = undefined;
    this.secondCaratTo = undefined;
    this.thirdCaratFrom = undefined;
    this.thirdCaratTo = undefined;
    this.fourthCaratFrom = undefined;
    this.fourthCaratTo = undefined;

    if (!this.isPricing)
      this.selectedTypeDNormItems = { text: null, value: null };
    this.selectedSlots = [];
    this.selectedSlotsIds = [];
    this.selectedSlotsDistinct = new UserPricingCriteria();

    this.getUserPricingCriteriaData(this.fxCredentials.id);
  }

  public closeSlotFilterDialog(): void {
    this.toggle.emit(false);
  }

  public onTypeChange(e: any): void {
    if (e.value == "Inv") {
      this.selectedSlots = [];
      this.selectedSlotsIds = [];
      this.selectedSlotsDistinct = new UserPricingCriteria();
      this.showSlotFilter = true;
    }
    else {
      this.showSlotFilter = false;
      this.distinctSelectedDataAll();
      this.listSupplierDNormItems = [...this.allListSupplierDNormItems];
    }
  }

  public onSelectUserPricingCriteria(data: UserPricingCriteria): void {
    if (this.selectedSlots.length > 0) {
      var index = this.selectedSlots.findIndex(z => z.id == data.id);
      if (index > -1)
        this.selectedSlots.splice(index, 1);
      else
        this.selectedSlots.push(data);
    } else
      this.selectedSlots.push(data);

    this.distinctSelectedData();
  }

  public distinctSelectedData(): void {
    this.selectedSlotsDistinct = new UserPricingCriteria();
    if (this.selectedSlots.length > 0) {
      this.selectedSlots.forEach(z => {
        this.selectedSlotsDistinct.shape.push(...z.shape.map(a => a.toUpperCase()));
        this.selectedSlotsDistinct.lab.push(...z.lab.map(a => a.toUpperCase()));
        this.selectedSlotsDistinct.color.push(...z.color.map(a => a.toUpperCase()));
        this.selectedSlotsDistinct.clarity.push(...z.clarity.map(a => a.toUpperCase()));
        this.selectedSlotsDistinct.cut.push(...z.cut.map(a => a.toUpperCase()));
        this.selectedSlotsDistinct.polish.push(...z.polish.map(a => a.toUpperCase()));
        this.selectedSlotsDistinct.symmetry.push(...z.symmetry.map(a => a.toUpperCase()));
        this.selectedSlotsDistinct.fluorescence.push(...z.fluorescence.map(a => a.toUpperCase()));
        this.selectedSlotsDistinct.organizations.push(...z.organizations.map(a => a.toUpperCase()));
      });

      this.selectedSlotsDistinct.shape = this.selectedSlotsDistinct.shape.filter(this.utilityService.onlyUniqueFromStringArray);
      this.selectedSlotsDistinct.lab = this.selectedSlotsDistinct.lab.filter(this.utilityService.onlyUniqueFromStringArray);
      this.selectedSlotsDistinct.color = this.selectedSlotsDistinct.color.filter(this.utilityService.onlyUniqueFromStringArray);
      this.selectedSlotsDistinct.clarity = this.selectedSlotsDistinct.clarity.filter(this.utilityService.onlyUniqueFromStringArray);
      this.selectedSlotsDistinct.cut = this.selectedSlotsDistinct.cut.filter(this.utilityService.onlyUniqueFromStringArray);
      this.selectedSlotsDistinct.polish = this.selectedSlotsDistinct.polish.filter(this.utilityService.onlyUniqueFromStringArray);
      this.selectedSlotsDistinct.symmetry = this.selectedSlotsDistinct.symmetry.filter(this.utilityService.onlyUniqueFromStringArray);
      this.selectedSlotsDistinct.fluorescence = this.selectedSlotsDistinct.fluorescence.filter(this.utilityService.onlyUniqueFromStringArray);
      this.selectedSlotsDistinct.organizations = this.selectedSlotsDistinct.organizations.filter(this.utilityService.onlyUniqueFromStringArray);

      // For Selected Slot Organization - Zeal|15-12-2021
      let selectedOrg: Array<{ text: string; value: string }> = [];
      let allOrg = JSON.parse(JSON.stringify(this.allListSupplierDNormItems));
      allOrg.forEach((z: any) => {
        if (this.selectedSlotsDistinct.organizations.includes(z.text?.toUpperCase()))
          selectedOrg.push(z);
      });
      this.listSupplierDNormItems = [...selectedOrg];
    }
    else {
      this.listSupplierDNormItems = [...this.allListSupplierDNormItems];
      if (this.selectedTypeDNormItems?.value != "Inv")
        this.distinctSelectedDataAll();
    }

  }

  public distinctSelectedDataAll(): void {
    this.selectedSlotsDistinct = new UserPricingCriteria();
    this.allTheShapes?.forEach(z => { this.selectedSlotsDistinct.shape.push(z.name.toUpperCase()); });
    this.allTheLab?.forEach(z => { this.selectedSlotsDistinct.lab.push(z.name.toUpperCase()); });
    this.allColors?.forEach(z => { this.selectedSlotsDistinct.color.push(z.name.toUpperCase()); });
    this.allClarities?.forEach(z => { this.selectedSlotsDistinct.clarity.push(z.name.toUpperCase()); });
    this.allTheCPS?.forEach(z => { this.selectedSlotsDistinct.cut.push(z.name.toUpperCase()); });
    this.allTheCPS?.forEach(z => { this.selectedSlotsDistinct.polish.push(z.name.toUpperCase()); });
    this.allTheCPS?.forEach(z => { this.selectedSlotsDistinct.symmetry.push(z.name.toUpperCase()); });
    this.allTheFluorescences?.forEach(z => { this.selectedSlotsDistinct.fluorescence.push(z.name.toUpperCase()); });
  }

  public selectAllSlot() {
    this.selectedSlots.push(...this.employeeCriteriaData);
    let selectedSlotIds = this.employeeCriteriaData.map(z => z.id);
    this.selectedSlotsIds.push(...selectedSlotIds);
    this.distinctSelectedData();
  }

  public deSelectAllSlot() {
    this.selectedSlots = [];
    this.selectedSlotsIds = [];
    this.distinctSelectedData();
  }
  //#endregion

  //#region Filter Search Functions
  public async getPriceRequestData() {
    try {
      if (this.selectedTypeDNormItems?.value == 'Inv' && this.selectedSlots.length == 0) {
        this.alertDialogService.show(`Please slelect at least one slot.`);
        return;
      }
      this.spinnerService.show();
      this.assignAdditionalData();

      let req: PriceRequestApiModel = new PriceRequestApiModel();
      req.slots = this.selectedSlots;
      req.invFilter = this.inventorySearchCriteriaObj;
      req.type = this.selectedTypeDNormItems?.value ?? 'Temp';
      req.systemUserId = this.fxCredentials.id;
      req.skip = this.skip;
      req.take = this.pageSize;

      let res = await this.pricingRequestService.getPricingRequest(req)
      if (res) {
        this.filterData.req = req;
        this.filterData.res = res;

        this.ChildEvent.emit(this.filterData);
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

  public assignAdditionalData(): void {
    let carat = null;
    carat = this.firstCaratFrom ? (this.firstCaratTo ? this.firstCaratFrom + "-" + this.firstCaratTo : "") : "";
    carat += this.secondCaratFrom ? (this.secondCaratTo ? "," + this.secondCaratFrom + "-" + this.secondCaratTo : "") : "";
    carat += this.thirdCaratFrom ? (this.thirdCaratTo ? "," + this.thirdCaratFrom + "-" + this.thirdCaratTo : "") : "";
    carat += this.fourthCaratFrom ? (this.fourthCaratTo ? "," + this.fourthCaratFrom + "-" + this.fourthCaratTo : "") : "";
    this.inventorySearchCriteriaObj.carat = carat ? carat : undefined;

    this.inventorySearchCriteriaObj.kapan = [];
    if (this.kapanString && this.kapanString.length > 0)
      this.inventorySearchCriteriaObj.kapan.push(this.kapanString);
  }

  public dateChangeFunction(e: any, type: string): void {
    if (type == 'from')
      this.inventorySearchCriteriaObj.fromDate = e ? this.utilityService.setUTCDateFilter(e) : null;
    else
      this.inventorySearchCriteriaObj.toDate = e ? this.utilityService.setUTCDateFilter(e) : null;
  }
  //#endregion
}