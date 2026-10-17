import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { DataResult, GroupDescriptor, orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { Address, GirdleDNorm, GradeSearchItems, GridDetailConfig, InclusionPrice, Lab, LabIssue, LabRecheckRequest, LabResult, LabServiceCharge, LabServiceType, MeasItems } from 'common/businessobjects';
import { fxCredential, MasterConfig, MasterDNorm, PricingRequest, InventoryItems, GridMasterConfig, InverntoryError, Notifications, RapPriceRequest } from 'common/entities';
import { LabResultExcelItems } from 'common/businessobjects';
import { MasterConfigService, UtilityService, StoneStatus, GridPropertiesService, LabService, ConfigService, OrganizationService, listLabResultItems, NotificationService, EmployeeCriteriaService, PriceRequestTemplate, RapPriceService, InventoryService, MeasureGradeService, PricingService } from 'common/services';
import { AlertdialogService } from 'common/views';
import { NgxSpinnerService } from 'ngx-spinner';
import * as xlsx from 'xlsx';
import { GradingMaster } from '../../businessobjects';
import { GridConfig } from 'common/entities/configs/gridconfig';
import { GradingService } from '../../services';

@Component({
  selector: 'app-labreconsiliation',
  templateUrl: './labreconsiliation.component.html',
  styles: []
})
export class LabreconsiliationComponent implements OnInit {
  public labResultExcelItems: LabResultExcelItems[] = [];
  public selectedLabResultExcelItems: LabResultExcelItems[] = [];
  public inventoryItems: InventoryItems[] = [];
  public gradingMasterItem: GradingMaster[] = [];
  public gradingRapVerItem: GradingMaster[] = [];
  public gradingRapVerLastItem: GradingMaster[] = [];
  public labResultItems: LabResult[] = [];
  public fields!: GridDetailConfig[];
  public gridView!: DataResult;
  public gridViewIssue!: DataResult;
  public groups!: GroupDescriptor[];
  public sort!: SortDescriptor[];
  public mySelection: string[] = [];
  public selectableSettings: SelectableSettings = {
    mode: 'multiple',
  };
  public existStoneIds: string[] = [];
  public masterConfigList!: MasterConfig;
  public allTheShapes!: MasterDNorm[];
  public allColors!: MasterDNorm[];
  public allClarities!: MasterDNorm[];
  public allTheFluorescences!: MasterDNorm[];
  public allTheCPS!: MasterDNorm[];
  public fxCredentials!: fxCredential;
  public organizationAddress: Address = new Address();
  public isGridConfig: boolean = false;
  public gridConfig!: GridConfig;
  public gridMasterConfigResponse!: GridMasterConfig;
  public labServiceItems!: LabServiceType[];
  public listReason: Array<{ name: string; isChecked: boolean }> = [];
  public isRecheckIssue: boolean = false;
  public skeletonArray = new Array(18);
  // public labIssueObj: LabIssue = new LabIssue();
  public labReCheckRequestObj: LabRecheckRequest = new LabRecheckRequest();

  public errorMessagesByStoneId: InverntoryError[] = [];
  public listLabResultItems = listLabResultItems;
  public SelectedLab: string = '';

  public mediaTitle!: string
  public mediaSrc!: string
  public mediaType!: string
  public isShowMedia: boolean = false;

  public selectedReasonItems: string[] = [];
  public labServiceCharge: LabServiceCharge = new LabServiceCharge();
  public recheckCharge!: string

  public labItems: Lab[] = [];
  public listLabItems: Array<{ text: string; value: string }> = [];
  public selectedLabItems?: { text: string, value: string };
  public labObj: Lab = new Lab();

  constructor(private inventoryService: InventoryService,
    private organizationService: OrganizationService,
    private labService: LabService,
    private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService,
    public utilityService: UtilityService,
    private masterConfigService: MasterConfigService,
    private gridPropertiesService: GridPropertiesService,
    private pricingService: PricingService,
    private gradingService: GradingService,
    private configService: ConfigService,
    private notificationService: NotificationService,
    private employeeCriteriaService: EmployeeCriteriaService,
    private rapPriceService: RapPriceService,
    private measureGradeService: MeasureGradeService) {
    this.notificationService.getMessage();
  }

  async ngOnInit() {
    await this.loadDefaultMethod();
  }

  //#region DefaultMethod
  public async loadDefaultMethod() {
    try {
      this.spinnerService.show();
      this.fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;
      this.organizationAddress = await this.organizationService.getOrganizationAddressByEmployee(this.fxCredentials.id);
      await this.getMasterConfigData();
      await this.getGridConfiguration();
      this.labServiceItems = await this.labService.getAlllabService();
      this.labItems = await this.labService.getAllLabs();
      this.listLabItems = [];
      this.labItems.forEach(z => { this.listLabItems.push({ text: z.name, value: z.name }); });
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }
  //#endregion

  //#region MasterConfig
  public async getMasterConfigData() {
    try {
      this.masterConfigList = await this.masterConfigService.getAllMasterConfig();
      this.allTheShapes = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.shape);
      this.allColors = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.colors);
      this.allClarities = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.clarities);
      this.allTheFluorescences = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.fluorescence);
      this.allTheCPS = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.cps);
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }
  //#endregion

  //#region Excel
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
        if (acceptedFiles.indexOf(target.files[0].type) > -1) {

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
            var fetchExcelItems = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]) as any;

            if (fetchExcelItems && fetchExcelItems.length > 0) {
              this.labResultExcelItems = new Array<any>();

              for (let j = 0; j < fetchExcelItems.length; j++) {
                Object.keys(fetchExcelItems[j]).map(key => {
                  if (key.toLowerCase().trim() != key) {
                    fetchExcelItems[j][key.toLowerCase().trim()] = fetchExcelItems[j][key];
                    delete fetchExcelItems[j][key];
                  }
                });

                //Insert All data of excel in newLabResult.
                let newLabResult: LabResult = new LabResult();
                newLabResult.LabName = this.SelectedLab;

                if (this.SelectedLab == 'GIA') {
                  newLabResult.clientRef = fetchExcelItems[j]["Client Ref".toLowerCase()]?.toString().trim();
                  if (newLabResult.clientRef == null || newLabResult.clientRef == undefined)
                    break;
                  newLabResult.jobNo = fetchExcelItems[j]["Job No".toLowerCase()]?.toString().trim();
                  newLabResult.controlNo = fetchExcelItems[j]["Control No".toLowerCase()]?.toString().trim();
                  newLabResult.diamondDossier = fetchExcelItems[j]["Diamond Dossier".toLowerCase()]?.toString().trim();
                  newLabResult.reportNo = fetchExcelItems[j]["Report No".toLowerCase()]?.toString().trim();
                  newLabResult.reportDt = fetchExcelItems[j]["Report Dt".toLowerCase()]?.toString().trim();
                  newLabResult.memoNo = fetchExcelItems[j]["Memo No".toLowerCase()]?.toString().trim();
                  newLabResult.shape = fetchExcelItems[j]["Shape".toLowerCase()]?.toString().trim();
                  newLabResult.length = fetchExcelItems[j]["Length".toLowerCase()]?.toString().trim();
                  newLabResult.width = fetchExcelItems[j]["Width".toLowerCase()]?.toString().trim();
                  newLabResult.depth = fetchExcelItems[j]["Depth".toLowerCase()]?.toString().trim();//Height                  
                  newLabResult.weight = fetchExcelItems[j]["Weight".toLowerCase()]?.toString().trim();
                  newLabResult.color = fetchExcelItems[j]["Color".toLowerCase()]?.toString().trim();
                  newLabResult.colorDescriptions = fetchExcelItems[j]["Color Descriptions".toLowerCase()]?.toString().trim();
                  newLabResult.clarity = fetchExcelItems[j]["Clarity".toLowerCase()]?.toString().trim();
                  newLabResult.clarityStatus = fetchExcelItems[j]["Clarity Status".toLowerCase()]?.toString().trim();
                  newLabResult.finalCut = fetchExcelItems[j]["Final Cut".toLowerCase()]?.toString().trim();
                  newLabResult.polish = fetchExcelItems[j]["Polish".toLowerCase()]?.toString().trim();
                  newLabResult.symmetry = fetchExcelItems[j]["Symmetry".toLowerCase()]?.toString().trim();
                  newLabResult.fluorescenceIntensity = fetchExcelItems[j]["Fluorescence Intensity".toLowerCase()]?.toString().trim();
                  newLabResult.fluorescenceColor = fetchExcelItems[j]["Fluorescence Color".toLowerCase()]?.toString().trim();
                  newLabResult.girdleCondition = fetchExcelItems[j]["Girdle Condition".toLowerCase()]?.toString().trim();
                  newLabResult.culetSize = fetchExcelItems[j]["Culet Size".toLowerCase()]?.toString().trim();
                  newLabResult.depthPer = fetchExcelItems[j]["Depth %".toLowerCase()]?.toString().trim();//Depth%==TotalDepth
                  newLabResult.tablePer = fetchExcelItems[j]["Table %".toLowerCase()]?.toString().trim();
                  newLabResult.crnAg = fetchExcelItems[j]["Crn Ag".toLowerCase()]?.toString().replace('°', '').trim();
                  newLabResult.crnHt = fetchExcelItems[j]["Crn Ht".toLowerCase()]?.toString().replace('%', '').trim();
                  newLabResult.pavAg = fetchExcelItems[j]["Pav Ag".toLowerCase()]?.toString().replace('°', '').trim();
                  newLabResult.pavDp = fetchExcelItems[j]["Pav Dp".toLowerCase()]?.toString().replace('%', '').trim();
                  newLabResult.strLn = fetchExcelItems[j]["Str Ln".toLowerCase()]?.toString().replace('%', '').trim();
                  newLabResult.lrHalf = fetchExcelItems[j]["Lr Half".toLowerCase()]?.toString().replace('%', '').trim();
                  newLabResult.painting = fetchExcelItems[j]["Painting".toLowerCase()]?.toString().trim();
                  newLabResult.proportion = fetchExcelItems[j]["Proportion".toLowerCase()]?.toString().trim();
                  newLabResult.paintComm = fetchExcelItems[j]["Paint Comm".toLowerCase()]?.toString().trim();
                  newLabResult.keytoSymbols = fetchExcelItems[j]["Key to Symbols".toLowerCase()]?.toString().trim();
                  newLabResult.reportComments = fetchExcelItems[j]["Report Comments".toLowerCase()]?.toString().trim();
                  newLabResult.inscription = fetchExcelItems[j]["Inscription".toLowerCase()]?.toString().trim();
                  newLabResult.syntheticIndicator = fetchExcelItems[j]["Synthetic Indicator".toLowerCase()]?.toString().trim();
                  newLabResult.girdlePer = fetchExcelItems[j]["Girdle %".toLowerCase()]?.toString().replace('%', '').trim();
                  newLabResult.polishFeatures = fetchExcelItems[j]["Polish Features".toLowerCase()]?.toString().trim();
                  newLabResult.symmetryFeatures = fetchExcelItems[j]["Symmetry Features".toLowerCase()]?.toString().trim();
                  newLabResult.shapeDescription = fetchExcelItems[j]["Shape Description".toLowerCase()]?.toString().trim();
                  newLabResult.reportType = fetchExcelItems[j]["Report Type".toLowerCase()]?.toString().trim();
                  newLabResult.sorting = fetchExcelItems[j]["Sorting".toLowerCase()]?.toString().trim();
                  newLabResult.basketStatus = fetchExcelItems[j]["Basket Status".toLowerCase()]?.toString().trim();

                  let array: string[] = [];
                  let girdelData: '';
                  girdelData = fetchExcelItems[j]["Girdle".toLowerCase()]?.toString().trim();

                  if (girdelData.includes(' to ')) {
                    array = girdelData.split(' to ');
                    newLabResult.minGirdle = array[0];
                    newLabResult.maxGirdle = array[1];
                  }
                  else {
                    newLabResult.minGirdle = fetchExcelItems[j]["Girdle".toLowerCase()]?.toString().trim();
                    newLabResult.maxGirdle = fetchExcelItems[j]["Girdle".toLowerCase()]?.toString().trim();
                  }

                }
                else if (this.SelectedLab == 'IGI') {
                  newLabResult.clientRef = fetchExcelItems[j]["Customer Ref No.".toLowerCase()]?.toString().trim();
                  if (newLabResult.clientRef == null || newLabResult.clientRef == undefined)
                    break;
                  newLabResult.documentNo = fetchExcelItems[j]["Document No".toLowerCase()]?.toString().trim();
                  newLabResult.reportDt = fetchExcelItems[j]["Report Date".toLowerCase()]?.toString().trim();
                  newLabResult.inscription = fetchExcelItems[j]["Report Number".toLowerCase()]?.toString().trim();
                  newLabResult.prefix = fetchExcelItems[j]["Prefix".toLowerCase()]?.toString().trim();
                  newLabResult.otherReportNumber = fetchExcelItems[j]["Other Report Number".toLowerCase()]?.toString().trim();
                  newLabResult.shape = fetchExcelItems[j]["Shape Name".toLowerCase()]?.toString().trim();
                  newLabResult.weight = fetchExcelItems[j]["Weight".toLowerCase()]?.toString().trim();
                  newLabResult.numberStones = fetchExcelItems[j]["Number Stones".toLowerCase()]?.toString().trim();
                  newLabResult.description = fetchExcelItems[j]["Description".toLowerCase()]?.toString().trim();
                  newLabResult.length = fetchExcelItems[j]["Measurement1".toLowerCase()]?.toString().trim();
                  newLabResult.width = fetchExcelItems[j]["Measurement2".toLowerCase()]?.toString().trim();
                  newLabResult.depth = fetchExcelItems[j]["Measurement3".toLowerCase()]?.toString().trim();
                  newLabResult.tablePer = fetchExcelItems[j]["Table".toLowerCase()]?.toString().trim();
                  newLabResult.crnHt = fetchExcelItems[j]["Crown Height".toLowerCase()]?.toString().trim();
                  newLabResult.pavDp = fetchExcelItems[j]["Pavilion Depth".toLowerCase()]?.toString().trim();
                  newLabResult.depthPer = fetchExcelItems[j]["Total Depth".toLowerCase()]?.toString().trim();//Depth%==TotalDepth
                  newLabResult.crnAg = fetchExcelItems[j]["Crown Angle".toLowerCase()]?.toString().trim();
                  newLabResult.pavAg = fetchExcelItems[j]["Pavilion Angle".toLowerCase()]?.toString().trim();
                  newLabResult.culetSize = fetchExcelItems[j]["Culet Size".toLowerCase()]?.toString().trim();
                  newLabResult.girdlePer = fetchExcelItems[j]["Girdle Percent".toLowerCase()]?.toString().trim();
                  newLabResult.minGirdle = fetchExcelItems[j]["Girdle Name".toLowerCase()]?.toString().trim();
                  newLabResult.maxGirdle = fetchExcelItems[j]["Girdle Name".toLowerCase()]?.toString().trim();
                  newLabResult.polish = fetchExcelItems[j]["POL or Pol/Sym".toLowerCase()]?.toString().trim();
                  newLabResult.symmetry = fetchExcelItems[j]["SYM".toLowerCase()]?.toString().trim();
                  newLabResult.finalCut = fetchExcelItems[j]["CUT-PROP".toLowerCase()]?.toString().trim();
                  newLabResult.clarity = fetchExcelItems[j]["Clarity".toLowerCase()]?.toString().trim();
                  newLabResult.colorDescriptions = fetchExcelItems[j]["Color (Long)".toLowerCase()]?.toString().trim();
                  newLabResult.reportTypeI = fetchExcelItems[j]["Report Type I".toLowerCase()]?.toString().trim();
                  newLabResult.reportFormatI = fetchExcelItems[j]["Report Format I".toLowerCase()]?.toString().trim();
                  newLabResult.color = fetchExcelItems[j]["Color (Short)".toLowerCase()]?.toString().trim();
                  newLabResult.reportTypeII = fetchExcelItems[j]["Report Type II".toLowerCase()]?.toString().trim();
                  newLabResult.reportFormatII = fetchExcelItems[j]["Report Format II".toLowerCase()]?.toString().trim();
                  newLabResult.fluorescenceIntensity = fetchExcelItems[j]["Fluorescence".toLowerCase()]?.toString().trim();
                  newLabResult.commentsConsultation = fetchExcelItems[j]["Comments Consultation".toLowerCase()]?.toString().trim();
                  newLabResult.specialComments = fetchExcelItems[j]["Special Comments".toLowerCase()]?.toString().trim();
                  newLabResult.reportComments = fetchExcelItems[j]["Report Comment".toLowerCase()]?.toString().trim();
                  newLabResult.memoNo = fetchExcelItems[j]["Memo No".toLowerCase()]?.toString().trim();
                  newLabResult.faxComments = fetchExcelItems[j]["Fax Comments".toLowerCase()]?.toString().trim();
                  newLabResult.reportNo = fetchExcelItems[j]["Laserscribe".toLowerCase()]?.toString().trim();
                  newLabResult.recheck = fetchExcelItems[j]["Recheck".toLowerCase()]?.toString().trim();
                }
                else if (this.SelectedLab == 'HRD') {
                  newLabResult.clientRef = fetchExcelItems[j]["Client Ref.".toLowerCase()]?.toString().trim();
                  if (newLabResult.clientRef == null || newLabResult.clientRef == undefined)
                    break;
                  newLabResult.emailTransitOurRef = fetchExcelItems[j]["EmailTransit: Our Ref.".toLowerCase()]?.toString().trim();
                  newLabResult.done = fetchExcelItems[j]["Done".toLowerCase()]?.toString().trim();
                  newLabResult.shape = fetchExcelItems[j]["Shape".toLowerCase()]?.toString().trim();
                  newLabResult.weight = fetchExcelItems[j]["Weight".toLowerCase()]?.toString().trim();
                  newLabResult.weight = this.getweight(newLabResult.weight.toString());
                  newLabResult.clarity = fetchExcelItems[j]["Clarity".toLowerCase()]?.toString().trim();
                  newLabResult.potentialClarity = fetchExcelItems[j]["Potential Clarity".toLowerCase()]?.toString().trim();
                  newLabResult.weightlossClarity = fetchExcelItems[j]["Weight-loss Clarity".toLowerCase()]?.toString().trim();
                  newLabResult.fluorescenceIntensity = fetchExcelItems[j]["Fluo".toLowerCase()]?.toString().trim();
                  newLabResult.color = fetchExcelItems[j]["Colour".toLowerCase()]?.toString().trim();
                  newLabResult.eCG = fetchExcelItems[j]["ECG".toLowerCase()]?.toString().trim();
                  newLabResult.diamLWMinmm = fetchExcelItems[j]["Diam / LW Min mm".toLowerCase()]?.toString().trim();
                  newLabResult.diamLWMaxmm = fetchExcelItems[j]["Diam / LW Max mm".toLowerCase()]?.toString().trim();
                  newLabResult.heightCAvgmm = fetchExcelItems[j]["Height CAvg mm".toLowerCase()]?.toString().trim();
                  newLabResult.minGirdle = fetchExcelItems[j]["Girdle".toLowerCase()]?.toString().trim();
                  newLabResult.maxGirdle = fetchExcelItems[j]["Girdle".toLowerCase()]?.toString().trim();
                  newLabResult.culetSize = fetchExcelItems[j]["Culet".toLowerCase()]?.toString().trim();
                  newLabResult.tablePer = fetchExcelItems[j]["Table %".toLowerCase()]?.toString().trim();
                  newLabResult.crownPer = fetchExcelItems[j]["Crown %".toLowerCase()]?.toString().trim();
                  newLabResult.pavillionPer = fetchExcelItems[j]["Pavillion %".toLowerCase()]?.toString().trim();
                  newLabResult.finalCut = fetchExcelItems[j]["Proportions".toLowerCase()]?.toString().trim();
                  newLabResult.polish = fetchExcelItems[j]["Polish".toLowerCase()]?.toString().trim();
                  newLabResult.symmetry = fetchExcelItems[j]["Symmetry".toLowerCase()]?.toString().trim();
                  newLabResult.hna = fetchExcelItems[j]["H&A".toLowerCase()]?.toString().trim();
                  newLabResult.potentialMake = fetchExcelItems[j]["Potential Make".toLowerCase()]?.toString().trim();
                  newLabResult.inscription = fetchExcelItems[j]["Inscription".toLowerCase()]?.toString().trim();
                  newLabResult.remarks = fetchExcelItems[j]["Remarks".toLowerCase()]?.toString().trim();
                  newLabResult.premiumIdealCut = fetchExcelItems[j]["Premium Ideal Cut".toLowerCase()]?.toString().trim();
                }
                this.labResultItems.push(newLabResult);

                //Insert Required data of excel in LabResultExcelItems as per Inventory Item.
                let newData: LabResultExcelItems = new LabResultExcelItems();
                newData.type = this.SelectedLab + ' Excel';
                newData.stoneId = newLabResult.clientRef;
                newData.weight = parseFloat(newLabResult.weight);
                newData.shape = newLabResult.shape;
                newData.color = newLabResult.color;
                newData.clarity = newLabResult.clarity;
                newData.cut = newLabResult.finalCut;
                newData.polish = newLabResult.polish;
                newData.symmetry = newLabResult.symmetry;
                newData.fluorescence = newLabResult.fluorescenceIntensity;
                newData.table = parseFloat(newLabResult.tablePer);
                newData.maxGirdle = newLabResult.maxGirdle;
                newData.minGirdle = newLabResult.minGirdle;
                newData.culet = newLabResult.culetSize;

                if (this.SelectedLab == 'GIA') {
                  newData.comments = newLabResult.reportComments;
                  newData.depth = parseFloat(newLabResult.depthPer);
                  newData.length = parseFloat(newLabResult.length);
                  newData.width = parseFloat(newLabResult.width);
                  newData.height = parseFloat(newLabResult.depth);
                  newData.crownHeight = parseFloat(newLabResult.crnHt);
                  newData.crownAngle = parseFloat(newLabResult.crnAg);
                  newData.pavilionDepth = parseFloat(newLabResult.pavDp);
                  newData.pavilionAngle = parseFloat(newLabResult.pavAg);
                  newData.girdlePer = parseFloat(newLabResult.girdlePer);
                  newData.girdleCondition = newLabResult.girdleCondition;
                  newData.ktoS = newLabResult.keytoSymbols;
                  newData.flColor = newLabResult.fluorescenceColor;
                  newData.certificateNo = newLabResult.reportNo;
                  newData.Inscription = newLabResult.inscription;
                  newData.strLn = newLabResult.strLn;
                  newData.lrHalf = newLabResult.lrHalf;
                  newData.controlNo = newLabResult.controlNo;
                }
                else if (this.SelectedLab == 'IGI') {
                  newData.Inscription = newLabResult.inscription;
                  newData.depth = parseFloat(newLabResult.depthPer);
                  newData.length = parseFloat(newLabResult.length);
                  newData.width = parseFloat(newLabResult.width);
                  newData.height = parseFloat(newLabResult.depth);
                  newData.crownHeight = parseFloat(newLabResult.crnHt);
                  newData.pavilionDepth = parseFloat(newLabResult.pavDp);
                  newData.girdlePer = parseFloat(newLabResult.girdlePer);
                  newData.comments = newLabResult.reportComments;
                  newData.crownAngle = parseFloat(newLabResult.crnAg);
                  newData.pavilionAngle = parseFloat(newLabResult.pavAg);
                }
                else if (this.SelectedLab == 'HRD') {
                  newData.hna = newLabResult.hna;
                  newData.certificateNo = newLabResult.inscription;
                }

                newData.orgId = this.fxCredentials.organizationId;
                newData.orgName = this.fxCredentials.organization;
                newData.deptId = this.fxCredentials.departmentId;
                newData.deptName = this.fxCredentials.department;
                newData.branchName = this.fxCredentials.branch;
                newData.country = this.organizationAddress.country;
                newData.city = this.organizationAddress.city;
                newData.empName = this.fxCredentials.fullName;
                newData.empId = this.fxCredentials.id;
                newData.status = StoneStatus.Lab.toString();

                newData = this.assignOptionalWordToName(newData);

                this.labResultExcelItems.push(newData)
              }

              let Ids: string[] = this.labResultExcelItems.map((x: any) => x.stoneId);
              this.inventoryItems = await this.labService.GetInvItemsFromStoneIds(Ids)
              this.labResultExcelItems = await this.setBasePricing(this.labResultExcelItems);
              if (this.labResultExcelItems && this.labResultExcelItems.length > 0) {
                await this.checkValidationForAll(this.labResultExcelItems);
                this.gradingMasterItem = await this.labService.GetGradingFromStoneIds(Ids)
                this.labResultExcelItems.forEach(z => {
                  let obj = this.inventoryItems.find(a => a.stoneId == z.stoneId);
                  if (obj != null) {
                    z.kapan = obj.kapan;
                    z.article = obj.article;
                    z.videoUrl = obj.videoUrl;
                    z.imageUrl = obj.imageUrl;
                    z.certificateUrl = obj.certificateUrl;
                  }
                });

              }
              let labResultExcelItems = JSON.parse(JSON.stringify(this.labResultExcelItems));
              this.loadItems(labResultExcelItems);
              this.spinnerService.hide();
            }
          }
          fileReader.readAsArrayBuffer(file);
        }
        else
          this.alertDialogService.show(`Please select only .xlsx or .xls file.`);
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }

  private async setBasePricing(data: LabResultExcelItems[]): Promise<LabResultExcelItems[]> {
    try {
      let reqList: PricingRequest[] = [];
      data.forEach(async z => {
        let req: PricingRequest = {
          Lab: "GIA",
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
              let obj = this.inventoryItems.find(a => a.stoneId == z.stoneId);
              if (obj && obj.basePrice != null && obj.basePrice.discount != null) {
                target.Discount = obj.basePrice.discount ?? 0;
                target = this.utilityService.setAmtForPricingDiscountResponse(target, z.weight);
                z.discount = target.Discount;
                z.netAmount = target.Amount;
                z.perCarat = target.DCaret;
              }
              else {
                z.discount = null as any;
                z.netAmount = null as any;
                z.perCarat = null as any;
              }
            }
          }
          else
            z = await this.getRapPriceData(z);
        }
      }
    }
    catch (error) {
      console.error(error);
    }

    return data;
  }

  public async getRapPriceData(newItem: LabResultExcelItems): Promise<LabResultExcelItems> {
    try {
      if (newItem.shape != null) {
        let rapPrice: RapPriceRequest = {
          shape: newItem.shape,
          weight: newItem.weight,
          color: newItem.color,
          clarity: newItem.clarity
        }

        let pricing = await this.rapPriceService.get(rapPrice);
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

  private getweight(txt: string): string {
    let startIndex = txt.indexOf('(');
    let endIndex = txt.indexOf(')');
    return txt.substring(startIndex + 1, endIndex)
  }

  public getDetailData(stoneId: string): LabResultExcelItems[] {
    let list: LabResultExcelItems[] = [];
    try {
      //Show Inventory Record In Detail Grid.
      //let invItem = this.inventoryItems.find(z => z.stoneId == stoneId);
      //if (invItem)
      //list.push(this.mappingInvItemtoDetailGrid(invItem));

      let gradItems = this.gradingMasterItem.filter(z => z.stoneId == stoneId);
      if (gradItems)
        list.push(...this.mappingGradeItemtoDetailGrid(gradItems));

      return list;
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
      return list;
    }
  }

  private mappingInvItemtoDetailGrid(data: InventoryItems): LabResultExcelItems {
    let Items: LabResultExcelItems = new LabResultExcelItems();

    Items.type = 'Inventory';
    Items.stoneId = data.stoneId;
    Items.shape = data.shape;
    Items.weight = data.weight;
    Items.color = data.color;
    Items.clarity = data.clarity;
    Items.cut = data.cut;
    Items.polish = data.polish;
    Items.symmetry = data.symmetry;
    Items.fluorescence = data.fluorescence;
    Items.rap = data.basePrice.rap;
    Items.discount = data.basePrice.discount;
    Items.netAmount = data.basePrice.netAmount;
    Items.perCarat = data.basePrice.perCarat;
    Items.certificateNo = data.certificateNo;
    Items.Inscription = data.inscription;
    Items.comments = data.comments;
    Items.flColor = data.inclusion.flColor;
    Items.strLn = data.strLn;
    Items.lrHalf = data.lrHalf;
    Items.controlNo = data.rfid;
    Items.brown = data.inclusion.brown;
    Items.green = data.inclusion.green;
    Items.milky = data.inclusion.milky;
    Items.shade = data.inclusion.shade;
    Items.sideBlack = data.inclusion.sideBlack;
    Items.centerSideBlack = data.inclusion.centerSideBlack;
    Items.centerBlack = data.inclusion.centerBlack;
    Items.sideWhite = data.inclusion.sideWhite;
    Items.centerSideWhite = data.inclusion.centerSideWhite;
    Items.centerWhite = data.inclusion.centerWhite;
    Items.openCrown = data.inclusion.openCrown;
    Items.openTable = data.inclusion.openTable;
    Items.openPavilion = data.inclusion.openPavilion;
    Items.openGirdle = data.inclusion.openGirdle;
    Items.efoc = data.inclusion.efoc;
    Items.efot = data.inclusion.efot;
    Items.efog = data.inclusion.efog;
    Items.efop = data.inclusion.efop;
    Items.hna = data.inclusion.hna;
    Items.eyeClean = data.inclusion.eyeClean;
    Items.ktoS = data.inclusion.ktoS;
    Items.naturalOnTable = data.inclusion.naturalOnTable;
    Items.naturalOnGirdle = data.inclusion.naturalOnGirdle;
    Items.naturalOnCrown = data.inclusion.naturalOnCrown;
    Items.naturalOnPavillion = data.inclusion.naturalOnPavillion;
    Items.girdleCondition = data.inclusion.girdleCondition;
    Items.culet = data.inclusion.culet;
    Items.bowtie = data.inclusion.bowtie;
    Items.luster = data.inclusion.luster;
    Items.redSpot = data.inclusion.redSpot;
    Items.depth = data.measurement.depth;
    Items.table = data.measurement.table;
    Items.length = data.measurement.length;
    Items.width = data.measurement.width;
    Items.height = data.measurement.height;
    Items.crownHeight = data.measurement.crownHeight;
    Items.crownAngle = data.measurement.crownAngle;
    Items.pavilionDepth = data.measurement.pavilionDepth;
    Items.pavilionAngle = data.measurement.pavilionAngle;
    Items.girdlePer = data.measurement.girdlePer;
    Items.maxGirdle = data.measurement.maxGirdle;
    Items.minGirdle = data.measurement.minGirdle;
    Items.ratio = data.measurement.ratio;
    return Items;
  }

  private mappingGradeItemtoDetailGrid(data: GradingMaster[]): LabResultExcelItems[] {
    let Items: LabResultExcelItems[] = [];
    data.forEach(z => {
      if (z.rapVer == "InvUpload" || z.rapVer == "Grading" || z.rapVer == "LabResult") {
        let item = new LabResultExcelItems();
        item.type = z.rapVer;
        item.stoneId = z.stoneId;
        item.kapan = z.kapan;
        item.article = z.article
        item.shape = z.shape;
        item.weight = z.weight;
        item.color = z.color;
        item.clarity = z.clarity;
        item.cut = z.cut;
        item.polish = z.polish;
        item.symmetry = z.symmetry;
        item.fluorescence = z.fluorescence;
        item.rap = z.basePrice.rap;
        item.discount = z.basePrice.discount;
        item.netAmount = z.basePrice.netAmount;
        item.perCarat = z.basePrice.perCarat;
        item.certificateNo = '';
        item.comments = z.comments;
        item.brown = z.inclusion.brown;
        item.green = z.inclusion.green;
        item.milky = z.inclusion.milky;
        item.shade = z.inclusion.shade;
        item.sideBlack = z.inclusion.sideBlack;
        item.centerSideBlack = z.inclusion.centerSideBlack;
        item.centerBlack = z.inclusion.centerBlack;
        item.sideWhite = z.inclusion.sideWhite;
        item.centerSideWhite = z.inclusion.centerSideWhite;
        item.centerWhite = z.inclusion.centerWhite;
        item.openCrown = z.inclusion.openCrown;
        item.openTable = z.inclusion.openTable;
        item.openPavilion = z.inclusion.openPavilion;
        item.openGirdle = z.inclusion.openGirdle;
        item.efoc = z.inclusion.efoc;
        item.efot = z.inclusion.efot;
        item.efog = z.inclusion.efog;
        item.efop = z.inclusion.efop;
        item.hna = z.inclusion.hna;
        item.eyeClean = z.inclusion.eyeClean;
        item.ktoS = z.inclusion.ktoS;
        item.naturalOnTable = z.inclusion.naturalOnTable;
        item.naturalOnGirdle = z.inclusion.naturalOnGirdle;
        item.naturalOnCrown = z.inclusion.naturalOnCrown;
        item.naturalOnPavillion = z.inclusion.naturalOnPavillion;
        item.girdleCondition = z.inclusion.girdleCondition;
        item.culet = z.inclusion.culet;
        item.bowtie = z.inclusion.bowtie;
        item.luster = z.inclusion.luster;
        item.redSpot = z.inclusion.redSpot;
        item.depth = z.measurement.depth;
        item.table = z.measurement.table;
        item.length = z.measurement.length;
        item.width = z.measurement.width;
        item.height = z.measurement.height;
        item.crownHeight = z.measurement.crownHeight;
        item.crownAngle = z.measurement.crownAngle;
        item.pavilionDepth = z.measurement.pavilionDepth;
        item.pavilionAngle = z.measurement.pavilionAngle;
        item.girdlePer = z.measurement.girdlePer;
        item.maxGirdle = z.measurement.maxGirdle;
        item.minGirdle = z.measurement.minGirdle;
        item.ratio = z.measurement.ratio;
        item.strLn = z.strLn;
        item.lrHalf = z.lrHalf;
        Items.push(item);
      }
    });
    return Items;
  }
  //#endregion

  public loadItems(grid_data: any) {
    this.gridView = {
      data: grid_data,
      total: grid_data.length
    }
    this.spinnerService.hide();
  }

  public resetForm(form?: NgForm) {
    form?.reset();
  }

  //#region Save Method
  public async onSaveRecheckPacket(form: NgForm, action: boolean) {
    try {
      if (form.valid) {
        if (this.selectedLabResultExcelItems.length > 0) {
          this.spinnerService.show();
          let messageType: string = "";
          let response: any;

          this.selectedLabResultExcelItems.forEach(z => {
            this.labReCheckRequestObj.stoneId.push(z.stoneId);
          })

          this.labReCheckRequestObj.identity.id = this.fxCredentials.id;
          this.labReCheckRequestObj.identity.name = this.fxCredentials.fullName;
          this.labReCheckRequestObj.identity.type = 'Employee' ?? '';
          this.labReCheckRequestObj.isRecheck = true;

          messageType = "Inserted";
          response = await this.labService.labRecheckRequest(this.labReCheckRequestObj);
          if (response) {
            this.mySelection = [];
            this.spinnerService.hide();
            if (action)
              this.closeDialog();
            this.resetForm(form);
            this.utilityService.showNotification(`You have been ${messageType} successfully!`)
          }
          else {
            this.alertDialogService.show(response.message);
            if (response?.errorMessage?.length > 0)
              console.error(response.errorMessage);
          }
        }
        else {
          this.spinnerService.hide();
          Object.keys(form.controls).forEach((key) => {
            form.controls[key].markAsTouched();
          });
        }
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async SaveLabResultFile(form?: NgForm) {
    try {
      if (this.selectedLabResultExcelItems.length > 0) {
        this.spinnerService.show();
        let messageType: string = "";
        let response: any;
        let selectedInventoryItems: InventoryItems[] = [];

        this.selectedLabResultExcelItems.forEach(z => {
          let Items = new InventoryItems();
          Items.stoneId = z.stoneId;
          Items.kapan = z.kapan;
          Items.article = z.article;
          Items.shape = z.shape;
          Items.weight = z.weight;
          Items.color = z.color;
          Items.clarity = z.clarity;
          Items.cut = z.cut;
          Items.polish = z.polish;
          Items.symmetry = z.symmetry;
          Items.fluorescence = z.fluorescence;
          Items.comments = z.comments;

          //Set Old Inculsion & Measurment fields for Grade Update
          let oldInvData = this.inventoryItems.find(a => a.stoneId == z.stoneId);
          if (oldInvData) {
            Items.inclusion = oldInvData.inclusion;
            Items.measurement = oldInvData.measurement;
          }

          Items.measurement.depth = z.depth ?? (oldInvData?.measurement.depth ?? 0);//Depth% TotalDepth
          Items.measurement.table = z.table ?? (oldInvData?.measurement.table ?? 0);
          Items.measurement.length = z.length ?? (oldInvData?.measurement.length ?? 0);
          Items.measurement.width = z.width ?? (oldInvData?.measurement.width ?? 0);
          Items.measurement.height = z.height ?? (oldInvData?.measurement.height ?? 0);//Height==Depth
          Items.measurement.crownHeight = z.crownHeight ?? (oldInvData?.measurement.crownHeight ?? 0);
          Items.measurement.crownAngle = z.crownAngle ?? (oldInvData?.measurement.crownAngle ?? 0);
          Items.measurement.pavilionDepth = z.pavilionDepth ?? (oldInvData?.measurement.pavilionDepth ?? 0);
          Items.measurement.pavilionAngle = z.pavilionAngle ?? (oldInvData?.measurement.pavilionAngle ?? 0);
          Items.measurement.girdlePer = z.girdlePer ?? (oldInvData?.measurement.girdlePer ?? 0);
          Items.measurement.maxGirdle = z.maxGirdle ?? (oldInvData?.measurement.maxGirdle ?? 0);
          Items.measurement.minGirdle = z.minGirdle ?? (oldInvData?.measurement.minGirdle ?? 0);

          Items.inclusion.girdleCondition = z.girdleCondition ?? (oldInvData?.inclusion.girdleCondition ?? 0);
          Items.inclusion.culet = z.culet ?? (oldInvData?.inclusion.culet ?? 0);

          Items.inclusion.ktoS = z.ktoS;
          Items.inclusion.flColor = z.flColor;

          Items.basePrice.discount = z.discount;
          Items.basePrice.netAmount = z.netAmount;
          Items.basePrice.perCarat = z.perCarat;
          Items.basePrice.rap = z.rap;
          Items.certificateNo = z.certificateNo;
          Items.strLn = z.strLn;
          Items.lrHalf = z.lrHalf;
          Items.stoneOrg.orgId = this.fxCredentials.organizationId;
          Items.stoneOrg.orgName = this.fxCredentials.organization;
          Items.stoneOrg.deptId = this.fxCredentials.departmentId;
          Items.stoneOrg.deptName = this.fxCredentials.department;
          Items.stoneOrg.branchName = this.fxCredentials.branch;
          Items.stoneOrg.country = '';
          Items.stoneOrg.city = '';

          Items.identity.id = this.fxCredentials?.id ?? '';
          Items.identity.name = this.fxCredentials?.fullName ?? '';
          Items.identity.type = 'Employee' ?? '';

          Items.status = z.status;

          selectedInventoryItems.push(Items);
        });

        messageType = "updated";
        response = await this.gradingService.InsertGrading(selectedInventoryItems, "LabResult");
        if (response) {
          this.mySelection = [];
          this.resetForm(form);
          response = await this.inventoryService.updateInventoryItemsData(selectedInventoryItems)
          if (response) {
            response = await this.labService.InsertLabResult(this.labResultItems.filter(a => selectedInventoryItems.map(z => z.stoneId).includes(a.clientRef)));
            if (response) {
              await this.UpdateInvGrade(this.labResultItems, selectedInventoryItems);
              this.utilityService.showNotification(`You have been ${messageType} successfully!`);
              this.SendNotificationForPriceRequest(response);
            }
            else
              this.spinnerService.hide();
          }
          else
            this.spinnerService.hide();
        }
        else {
          this.alertDialogService.show(response.message);
          this.spinnerService.hide();

          if (response?.errorMessage?.length > 0)
            console.error(response.errorMessage);
        }
      }
      else {
        this.alertDialogService.show('Multiple Plan Not Allowed.')
      }
      this.selectedLabResultExcelItems = [];
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
      this.selectedLabResultExcelItems = [];
    }
  }

  public async SendNotificationForPriceRequest(stoneIds: string[]) {
    let empIds = await this.employeeCriteriaService.getEmpIdsForNotificationFromStoneIds(stoneIds);
    if (empIds && empIds.length > 0) {
      empIds.forEach(z => {
        let message: Notifications = PriceRequestTemplate(this.fxCredentials, z);
        this.notificationService.messages.next(message);
      });
      this.spinnerService.hide();
    }
    else
      this.spinnerService.hide();
  }

  public async UpdateInvGrade(lab: LabResult[], inv: InventoryItems[]) {
    try {
      var selectedLab = lab.filter(a => inv.map(z => z.stoneId).includes(a.clientRef));

      let req: GradeSearchItems[] = [];
      selectedLab.forEach(z => {
        let obj: GradeSearchItems = new GradeSearchItems();
        let invItem = inv.find(a => a.stoneId == z.clientRef);
        if (invItem != null) {
          obj.id = invItem.stoneId?.toUpperCase();
          obj.lab = z.LabName?.toUpperCase();
          obj.shape = z.shape?.toUpperCase();
          obj.size = Number(z.weight);
          obj.color = z.color?.toUpperCase();
          obj.clarity = z.clarity?.toUpperCase();
          obj.cut = z.finalCut?.toUpperCase();
          obj.polish = z.polish?.toUpperCase();
          obj.sym = z.symmetry?.toUpperCase();
          obj.fluo = z.fluorescenceIntensity?.toUpperCase();

          let inclusionData: InclusionPrice = new InclusionPrice();
          inclusionData.brown = invItem.inclusion.brown?.toUpperCase();
          inclusionData.green = invItem.inclusion.green?.toUpperCase();
          inclusionData.milky = invItem.inclusion.milky?.toUpperCase();
          inclusionData.shade = invItem.inclusion.shade?.toUpperCase();
          inclusionData.sideBlack = invItem.inclusion.sideBlack?.toUpperCase();
          inclusionData.centerBlack = invItem.inclusion.centerBlack?.toUpperCase();
          inclusionData.sideWhite = invItem.inclusion.sideWhite?.toUpperCase();
          inclusionData.centerWhite = invItem.inclusion.centerWhite?.toUpperCase();
          inclusionData.openTable = invItem.inclusion.openTable?.toUpperCase();
          inclusionData.openCrown = invItem.inclusion.openCrown?.toUpperCase();
          inclusionData.openPavilion = invItem.inclusion.openPavilion?.toUpperCase();
          inclusionData.openGirdle = invItem.inclusion.openGirdle?.toUpperCase();
          if (invItem.inclusion.girdleCondition && invItem.inclusion.girdleCondition.length > 0)
            inclusionData.girdleCond.push(invItem.inclusion.girdleCondition?.toUpperCase());
          inclusionData.eFOC = invItem.inclusion.efoc?.toUpperCase();
          inclusionData.eFOP = invItem.inclusion.efop?.toUpperCase();
          inclusionData.culet = z.culetSize?.toUpperCase();
          inclusionData.hNA = z.hna?.toUpperCase();
          inclusionData.eyeClean = invItem.inclusion.eyeClean?.toUpperCase();
          inclusionData.kToS = null;
          inclusionData.naturalOnGirdle = invItem.inclusion.naturalOnGirdle?.toUpperCase();
          inclusionData.naturalOnCrown = invItem.inclusion.naturalOnCrown?.toUpperCase();
          inclusionData.naturalOnPavillion = invItem.inclusion.naturalOnPavillion?.toUpperCase();
          inclusionData.flColor = invItem.inclusion.flColor?.toUpperCase();
          inclusionData.luster = invItem.inclusion.luster?.toUpperCase();
          inclusionData.bowTie = invItem.inclusion.bowtie?.toUpperCase();
          inclusionData.certiComment = invItem.inclusion.certiComment?.toUpperCase();

          obj.inclusion = inclusionData;

          let measurData: MeasItems = new MeasItems();
          measurData.type = 'Depth';
          measurData.value = Number(z.depth);
          obj.measurement.push(measurData);

          measurData = new MeasItems();
          measurData.type = 'Table';
          measurData.value = Number(invItem.measurement.table);
          obj.measurement.push(measurData);

          let girdleData: GirdleDNorm = new GirdleDNorm();
          girdleData.min = z.minGirdle?.toUpperCase();
          girdleData.max = z.maxGirdle?.toUpperCase();

          obj.girdle = girdleData;
          obj.certComment = [];
          obj.ktoS = [];

          req.push(obj);
        }
      });

      let res = await this.measureGradeService.getPrice(req);
      if (res) {
        let result = await this.inventoryService.updateInventoryGrading(res);
        if (result) {
          this.utilityService.showNotification(`${result.length} stone(s) grade updated!`);
        }
      }
    }
    catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show('Something went wrong when get grade.');
    }
  }
  //#endregion

  //#region Functions
  public async UpdateControllerNo() {
    let response: any;
    if (this.selectedLabResultExcelItems.length > 0) {
      let Ids: string[] = this.selectedLabResultExcelItems.map((x: any) => x.stoneId);
      response = await this.labService.UpdateControllerNoFromStoneIds(Ids)
    }
    if (response)
      this.utilityService.showNotification(`You have been updated successfully!`)

  }

  public tagMapper(tags: string[]): void {
    // This function is used for hide selected items in multiselect box
  }

  public onReasonMultiSelectChange(val: Array<{ name: string; isChecked: boolean }>, selectedData: string[]): void {
    val.forEach(element => {
      element.isChecked = false;
    });

    if (selectedData && selectedData.length > 0) {
      this.selectedReasonItems = selectedData;
      val.forEach(element => {
        selectedData.forEach(item => {
          if (element.name.toLocaleLowerCase() == item.toLocaleLowerCase())
            element.isChecked = true;
        });
      });
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

  public fetchError(id: string) {
    return this.errorMessagesByStoneId.find(x => x.stoneId == id)
  }

  public assignOptionalWordToName(data: LabResultExcelItems): LabResultExcelItems {

    const shape = data.shape;
    if (shape) {
      var obj = this.allTheShapes.find(c => c.name.toLowerCase() == shape.toLowerCase() || c.displayName.toLowerCase() == shape.toLowerCase() || c.optionalWords && c.optionalWords.map(u => u.toLowerCase().trim()).includes(shape.toLowerCase()));
      if (obj)
        data.shape = obj.name;
    }

    const color = data.color;
    if (color) {
      var obj = this.allColors.find(c => c.name.toLowerCase() == color.toLowerCase() || c.displayName.toLowerCase() == color.toLowerCase() || c.optionalWords && c.optionalWords.map(u => u.toLowerCase().trim()).includes(color.toLowerCase()));
      if (obj)
        data.color = obj.name;
    }

    const clarity = data.clarity;
    if (clarity) {
      var obj = this.allClarities.find(c => c.name.toLowerCase() == clarity.toLowerCase() || c.displayName.toLowerCase() == clarity.toLowerCase() || c.optionalWords && c.optionalWords.map(u => u.toLowerCase().trim()).includes(clarity.toLowerCase()));
      if (obj)
        data.clarity = obj.name;
    }

    const fluorescence = data.fluorescence;
    if (fluorescence) {
      var obj = this.allTheFluorescences.find(c => c.name.toLowerCase() == fluorescence.toLowerCase() || c.displayName.toLowerCase() == fluorescence.toLowerCase() || c.optionalWords && c.optionalWords.map(u => u.toLowerCase().trim()).includes(fluorescence.toLowerCase()));
      if (obj)
        data.fluorescence = obj.name;
    }

    const cut = data.cut;
    if (cut) {
      var obj = this.allTheCPS.find(c => c.name.toLowerCase() == cut.toLowerCase() || c.displayName.toLowerCase() == cut.toLowerCase() || c.optionalWords && c.optionalWords.map(u => u.toLowerCase().trim()).includes(cut.toLowerCase()));
      if (obj)
        data.cut = obj.name;
    }

    const polish = data.polish;
    if (polish) {
      var obj = this.allTheCPS.find(c => c.name.toLowerCase() == polish.toLowerCase() || c.displayName.toLowerCase() == polish.toLowerCase() || c.optionalWords && c.optionalWords.map(u => u.toLowerCase().trim()).includes(polish.toLowerCase()));
      if (obj)
        data.polish = obj.name;
    }

    const symmetry = data.symmetry;
    if (symmetry) {
      var obj = this.allTheCPS.find(c => c.name.toLowerCase() == symmetry.toLowerCase() || c.displayName.toLowerCase() == symmetry.toLowerCase() || c.optionalWords && c.optionalWords.map(u => u.toLowerCase().trim()).includes(symmetry.toLowerCase()));
      if (obj)
        data.symmetry = obj.name;
    }

    return data;
  }

  public getCompareLabResultWithGrading(stoneId: String, type: string, typeTwo: string): string {
    let className = '';
    try {
      let InvData = '';
      let labData = '';
      let prevIndex = null;
      let curIndex = null;
      let invParaName = '';
      prevIndex = 1;
      curIndex = 1;
      let InvUploadWeight: number = 0;
      let GradingWeight: number = 0;
      let listData: MasterDNorm[] = [];

      var objGradingData = this.gradingMasterItem.filter(z => z.stoneId == stoneId && z.rapVer == 'Grading');
      if (objGradingData != null)
        this.gradingRapVerItem.push(...objGradingData)

      if (this.gradingRapVerItem.length > 0) {
        var objGradingLastData = this.gradingRapVerItem[this.gradingRapVerItem.length - 1];
        if (objGradingLastData != null)
          this.gradingRapVerLastItem.push(objGradingLastData)
      }

      //Get 'Grading' Data. if not found then take 'InvUpload' data
      if (type == 'SHAPE') {
        InvData = this.gradingMasterItem.find(z => z.stoneId == stoneId && z.rapVer == 'InvUpload')?.shape ?? '';
        InvData = this.gradingRapVerLastItem.find(z => z.stoneId == stoneId && z.rapVer == 'Grading')?.shape ?? InvData;
        labData = this.labResultExcelItems.find(z => z.stoneId == stoneId)?.shape ?? '';
        listData = this.allTheShapes;
        prevIndex = listData.find(t => t.displayName == labData)?.priority ?? 0;
        curIndex = listData.find(t => t.displayName == InvData)?.priority ?? 0;
        invParaName = InvData;
      }
      else if (type == 'WEIGHT') {
        InvUploadWeight = this.gradingMasterItem.find(z => z.stoneId == stoneId && z.rapVer == 'InvUpload')?.weight ?? 0;
        GradingWeight = this.gradingRapVerLastItem.find(z => z.stoneId == stoneId && z.rapVer == 'Grading')?.weight ?? InvUploadWeight;

        if ((GradingWeight) > (this.labResultExcelItems.find(z => z.stoneId == stoneId)?.weight ?? '')) {
          prevIndex = 2;
          curIndex = 1;
        }
        if ((GradingWeight) < (this.labResultExcelItems.find(z => z.stoneId == stoneId)?.weight ?? '')) {
          prevIndex = 1;
          curIndex = 2;
        }
        invParaName = GradingWeight.toString();
      }
      else if (type == 'COLOR') {
        InvData = this.gradingMasterItem.find(z => z.stoneId == stoneId && z.rapVer == 'InvUpload')?.color ?? '';
        InvData = this.gradingRapVerLastItem.find(z => z.stoneId == stoneId && z.rapVer == 'Grading')?.color ?? InvData;
        labData = this.labResultExcelItems.find(z => z.stoneId == stoneId)?.color ?? '';
        listData = this.allColors;
        prevIndex = listData.find(t => t.displayName == labData)?.priority ?? 0;
        curIndex = listData.find(t => t.displayName == InvData)?.priority ?? 0;
        invParaName = InvData;
      }
      else if (type == 'CLARITY') {
        InvData = this.gradingMasterItem.find(z => z.stoneId == stoneId && z.rapVer == 'InvUpload')?.clarity ?? '';
        InvData = this.gradingRapVerLastItem.find(z => z.stoneId == stoneId && z.rapVer == 'Grading')?.clarity ?? InvData;
        labData = this.labResultExcelItems.find(z => z.stoneId == stoneId)?.clarity ?? '';
        listData = this.allClarities;
        prevIndex = listData.find(t => t.displayName == labData)?.priority ?? 0;
        curIndex = listData.find(t => t.displayName == InvData)?.priority ?? 0;
        invParaName = InvData;
      }
      else if (type == 'CUT') {
        InvData = this.gradingMasterItem.find(z => z.stoneId == stoneId && z.rapVer == 'InvUpload')?.cut ?? '';
        InvData = this.gradingRapVerLastItem.find(z => z.stoneId == stoneId && z.rapVer == 'Grading')?.cut ?? InvData;
        labData = this.labResultExcelItems.find(z => z.stoneId == stoneId)?.cut ?? '';
        listData = this.allTheCPS;
        prevIndex = listData.find(t => t.displayName == labData)?.priority ?? 0;
        curIndex = listData.find(t => t.displayName == InvData)?.priority ?? 0;
        invParaName = InvData;
      }
      else if (type == 'POLISH') {
        InvData = this.gradingMasterItem.find(z => z.stoneId == stoneId && z.rapVer == 'InvUpload')?.polish ?? '';
        InvData = this.gradingRapVerLastItem.find(z => z.stoneId == stoneId && z.rapVer == 'Grading')?.polish ?? InvData;
        labData = this.labResultExcelItems.find(z => z.stoneId == stoneId)?.polish ?? '';
        listData = this.allTheCPS;
        prevIndex = listData.find(t => t.displayName == labData)?.priority ?? 0;
        curIndex = listData.find(t => t.displayName == InvData)?.priority ?? 0;
        invParaName = InvData;
      }
      else if (type == 'SYMMETRY') {
        InvData = this.gradingMasterItem.find(z => z.stoneId == stoneId && z.rapVer == 'InvUpload')?.symmetry ?? '';
        InvData = this.gradingRapVerLastItem.find(z => z.stoneId == stoneId && z.rapVer == 'Grading')?.symmetry ?? InvData;
        labData = this.labResultExcelItems.find(z => z.stoneId == stoneId)?.symmetry ?? '';
        listData = this.allTheCPS;
        prevIndex = listData.find(t => t.displayName == labData)?.priority ?? 0;
        curIndex = listData.find(t => t.displayName == InvData)?.priority ?? 0;
        invParaName = InvData;
      }
      else if (type == 'FLUORESCENCE') {
        InvData = this.gradingMasterItem.find(z => z.stoneId == stoneId && z.rapVer == 'InvUpload')?.fluorescence ?? '';
        InvData = this.gradingRapVerLastItem.find(z => z.stoneId == stoneId && z.rapVer == 'Grading')?.fluorescence ?? InvData;
        labData = this.labResultExcelItems.find(z => z.stoneId == stoneId)?.fluorescence ?? '';
        listData = this.allTheFluorescences;
        prevIndex = listData.find(t => t.displayName == labData)?.priority ?? 0;
        curIndex = listData.find(t => t.displayName == InvData)?.priority ?? 0;
        invParaName = InvData;
      }

      if (prevIndex < curIndex)
        className = 'icon-back ml-1 d-inline-block rotate-90 i-green';
      else if (prevIndex > curIndex)
        className = 'icon-back ml-1 d-inline-block a-rotate-90 i-red';
      else
        className = '';

      if (typeTwo == 'ToolTip')
        className = invParaName;

      return className;
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
      return className;
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

  public async checkValidationForAll(existData: LabResultExcelItems[]) {
    try {
      let fetchExcelIds: string[] = existData.map((x: any) => x.stoneId);
      this.existStoneIds = await this.labService.getStoneIdsExistOrNotLabResultAsync(fetchExcelIds)
      if (this.existStoneIds && this.existStoneIds.length > 0) {
        this.validateValues(existData, this.existStoneIds, " Lab result already exists for this StoneId");
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }
  //#endregion

  //#region Dialog
  public openDialog(): void {
    try {
      this.isRecheckIssue = true;
      this.gridViewIssue = { data: [], total: 0 };
      if (this.selectedLabResultExcelItems.length > 0) {
        this.gridViewIssue = process(this.selectedLabResultExcelItems, { group: this.groups });
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public closeDialog(): void {
    this.isRecheckIssue = false;
    this.gridViewIssue = { data: [], total: 0 };
    this.mySelection = [];
    this.selectedLabResultExcelItems = [];
    this.labReCheckRequestObj = new LabRecheckRequest();
    this.recheckCharge = "";
    this.listReason.forEach(z => { z.isChecked = false });
  }
  //#endregion

  //#region GridConfig
  public async getGridConfiguration() {
    try {
      this.spinnerService.show();
      this.gridConfig = await this.configService.getGridConfig(this.fxCredentials.id, "LabReconsiliation", "LabReconsiliationGrid");
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
        this.gridMasterConfigResponse = await this.configService.getMasterGridConfig("LabReconsiliation", "LabReconsiliationGrid");
        if (this.gridMasterConfigResponse)
          this.fields = this.gridMasterConfigResponse.gridDetail;
        else
          this.fields = await this.gridPropertiesService.getLabResultGrid();
      }
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.alertDialogService.show(error);
      this.spinnerService.hide();
    }
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

  public setSelectableSettings() {
    this.selectableSettings = {
      mode: "multiple",
      checkboxOnly: true
    };
  }

  public openGridConfigDialog(): void {
    this.isGridConfig = true;
  }

  public clearGrid(): void {
    this.labResultExcelItems = [];
    this.selectedLabResultExcelItems = [];
    this.mySelection = [];
    this.loadItems(this.labResultExcelItems);
  }

  public onSelect(event: any): void {
    if (event.selectedRows && event.selectedRows.length > 0) {
      event.selectedRows.forEach((element: any) => {
        let Selectedindex = this.selectedLabResultExcelItems.findIndex(x => x.stoneId == element.dataItem.stoneId);
        if (Selectedindex < 0)
          this.selectedLabResultExcelItems.push(element.dataItem)
      });
    }
    else {
      event.deselectedRows.forEach((element: any) => {
        let index = this.selectedLabResultExcelItems.findIndex(x => x.stoneId == element.dataItem.stoneId);
        if (index >= 0)
          this.selectedLabResultExcelItems.splice(index, 1)
      });
    }
  }

  public cellClickHandler(e: any) {
    // this.mySelection = [];
    // this.mySelection.push(e.dataItem.stoneId);
    // this.selectedLabResultExcelItems = [];
    // this.selectedLabResultExcelItems.push(e.dataItem);
  }

  public async selectAllStocks(event: string) {
    this.mySelection = [];
    this.selectedLabResultExcelItems = []
    if (event.toLowerCase() == 'checked') {
      this.mySelection = this.labResultExcelItems.map(z => z.stoneId);
      this.selectedLabResultExcelItems = this.labResultExcelItems;
    }
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    if (this.labResultExcelItems && this.labResultExcelItems.length > 0)
      this.sortInventory()
  }

  private sortInventory(): void {
    this.gridView = {
      data: orderBy(this.gridView.data, this.sort),
      total: this.labResultExcelItems.length
    };
  }

  public groupChange(groups: GroupDescriptor[]): void {
    this.groups = groups;
    if (this.labResultExcelItems && this.labResultExcelItems.length > 0)
      this.groupInventoryExcel();
  }

  private groupInventoryExcel(): void {
    if (this.groups.length > 0)
      this.gridView = process(this.labResultExcelItems, { group: this.groups });
    else
      this.loadItems(this.labResultExcelItems);
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

  public async GetRecheckCharge() {
    try {
      if (this.selectedLabResultExcelItems.length > 0) {
        this.spinnerService.show();
        let response: any;
        this.labServiceCharge.stoneIds = this.selectedLabResultExcelItems.map((x: any) => x.stoneId);
        this.labServiceCharge.reasonItems = this.selectedReasonItems;
        response = await this.labService.GetRecheckCharge(this.labServiceCharge);
        if (response) {
          this.recheckCharge = response.message;
          this.spinnerService.hide();
        }
        else {
          this.alertDialogService.show(response.message);
          if (response?.errorMessage?.length > 0)
            console.error(response.errorMessage);
        }
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }
  //#endregion  

  public LabChange() {
    try {      
      let Selectedindex = this.labItems.findIndex(x => x.name == this.selectedLabItems?.value);
      if (Selectedindex >= 0) {
        this.labObj = this.labItems[Selectedindex]
        this.SelectedLab = this.labObj.code;

        this.listReason = [];
        this.labServiceItems.forEach(z => {
          if (z.labName == this.labObj.name)
            this.listReason.push({ name: z.service, isChecked: false });
        });
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  /*Notes
  1) Compare Excel data with (Grading Table Entry RapVersion’Grading’ Last Record)
         If (Grading Table Entry RapVersion ’Grading’) entry not found 
       Then compare with (Grading Table Entry RapVersion’InvUpload’)
  2) Lab Reconciliation Detail Grid--> All  Grading Table Entry
  */

}