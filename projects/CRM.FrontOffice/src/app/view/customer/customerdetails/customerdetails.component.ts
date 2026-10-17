import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { GridDetailConfig } from 'shared/businessobjects';
import { ExportColumn, ExportConfig, ExportInfo, FileStore, fxCredential, MasterConfig, MasterDNorm } from 'shared/enitites';
import { FileStoreService, FileStoreTypes, listBasicExportColumns, listExportFormat, listIncusionExportColumns, listMeasurementExportColumns, listOthersExportColumns, UtilityService } from 'shared/services';
import { AlertdialogService } from 'shared/views';
import { NgxSpinnerService } from 'ngx-spinner';
import { Customer, CustomerCriteria, CustomerDNorm, CustomerPreference, InventoryItems } from '../../../entities';
import { CustomerCriteriaService, CustomerPreferenceService, CustomerService, GridPropertiesService, MasterConfigService, WatchListService } from '../../../services';
import { ParseSearchQuery } from '../../../businessobjects';
import * as moment from 'moment';

@Component({
  selector: 'app-customerdetails',
  templateUrl: './customerdetails.component.html'
})
export class CustomerdetailsComponent implements OnInit {

  public customerObj: Customer = new Customer();
  public isAddCustomerCriteria: boolean = false;
  public isShowDocument: boolean = false;
  public imgSrcDisplay!: string

  public masterConfigList!: MasterConfig;

  public ShapesList: MasterDNorm[] = [];
  public LabList: MasterDNorm[] = [];
  public ColorList: MasterDNorm[] = [];
  public ClarityList: MasterDNorm[] = [];
  public FluorList: MasterDNorm[] = [];
  public CPSList: MasterDNorm[] = [];

  public allTheLab: Array<{ name: string; isChecked: boolean }> = [];
  public allTheShapes: Array<{ name: string; isChecked: boolean }> = [];
  public allColors: Array<{ name: string; isChecked: boolean }> = [];
  public allClarities: Array<{ name: string; isChecked: boolean }> = [];
  public allTheFluorescences: Array<{ name: string; isChecked: boolean }> = [];
  public allTheCut: Array<{ name: string; isChecked: boolean }> = [];
  public allTheSymm: Array<{ name: string; isChecked: boolean }> = [];
  public allThePolish: Array<{ name: string; isChecked: boolean }> = [];

  public errWeight: string = '';
  public errDiscount: string = '';
  public errDepth: string = '';
  public errTable: string = '';
  public errCrownAngle: string = '';
  public errPavillionAngle: string = '';

  public customerCriteriaData: CustomerCriteria[] = [];
  public selectedCustomerCriteria: CustomerCriteria[] = [];
  public customerCriteriaObj: CustomerCriteria = new CustomerCriteria();
  public insertFlag: boolean = true;

  public fxCredentials!: fxCredential | null;

  public lastDivNumber = [3, 7, 11, 15, 19];

  public filterShape: string = '';
  public filterShapeChk: boolean = true;
  public filterLab: string = '';
  public filterLabChk: boolean = true;
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

  public FileStoreTypes = FileStoreTypes;
  public fileStore: FileStore[] = [];
  public profileFileStore: FileStore = new FileStore();
  public photoIdentityFileStore: FileStore = new FileStore();
  public businessIndentityFileStore: FileStore = new FileStore();

  public listWatchListInventory: InventoryItems[] = [];

  public isDiamondDetails: boolean = false;

  public isEditColumn: boolean = false;
  public isEditExportColumn: boolean = false;

  public customerPreference: CustomerPreference = new CustomerPreference();
  public preferredStoneData: ParseSearchQuery[] = [];
  public saveSearchData: ParseSearchQuery[] = [];

  public exportInfoObj: ExportInfo = new ExportInfo();
  public exportConfigObj: ExportConfig = new ExportConfig();
  public exportColumnObj: ExportColumn = new ExportColumn();

  public editExportConfigIndex: number | null = null;

  public listExportFormat = listExportFormat;

  public listBasicExportColumns = listBasicExportColumns;
  public listIncusionExportColumns = listIncusionExportColumns;
  public listMeasurementExportColumns = listMeasurementExportColumns;
  public listOthersExportColumns = listOthersExportColumns;

  public columnModalTitle = 'Edit';
  public searchColumn = '';

  public show = false;
  constructor(private customerService: CustomerService,
    private router: Router,
    private alertDialogService: AlertdialogService,
    private activatedRoute: ActivatedRoute,
    public utilityService: UtilityService,
    private masterConfigService: MasterConfigService,
    // private customerCriteriaService: CustomerCriteriaService,
    private spinnerService: NgxSpinnerService,
    private fileStoreService: FileStoreService,
    private gridPropertiesService: GridPropertiesService,
    private customerCriteriaService: CustomerCriteriaService,
    private watchListService: WatchListService,
    private customerPreferenceService: CustomerPreferenceService,
    private sanitizer: DomSanitizer) { }

  public async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  //#region Initialize Data
  async defaultMethodsLoad() {
    this.spinnerService.show();
    this.fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;
    this.activatedRoute.params.subscribe(async params => {
      const id = params['id'];
      await this.getCustomerFiles(id);
      await this.getCustomerCriteriaData(id);
      await this.getMasterConfigData();
      await this.getCustomerData(id);
    });
  }

  public async getCustomerData(id: string) {
    try {
      this.customerObj = await this.customerService.getCustomerById(id);
      if (this.customerObj == null)
        this.router.navigate(['/customer']);
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async getCustomerFiles(id: string) {
    try {
      let imageList: FileStore[] = await this.fileStoreService.getFileByIdent(id);
      if (imageList && imageList.length > 0) {
        for (let index = 0; index < imageList.length; index++) {
          const element = imageList[index];
          element.fileThumbnail = this.loadImage(element.fileThumbnail) || null as any;
          element.filePath = await this.fileStoreService.getPathToBase64(element.id, element.type);
          element.filePath = this.loadImage(element.filePath) || null as any;
        }
        this.fileStore = imageList;
        this.setCustomerImages();
      }
    }
    catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show("Somehting went wrong, Try again later.");
    }
  }

  private setCustomerImages() {
    if (this.fileStore.length > 0) {
      let profileFileStore = this.fileStore.find(z => z.type == FileStoreTypes.CustomerProfile);
      if (profileFileStore == null) {
        profileFileStore = new FileStore();
        profileFileStore.fileThumbnail = 'assets/images/profile.png';
      }
      this.profileFileStore = profileFileStore;

      let photoIdentityFileStore = this.fileStore.find(z => z.type == FileStoreTypes.CustomerPhotoIdent);
      if (photoIdentityFileStore == null) {
        photoIdentityFileStore = new FileStore();
        photoIdentityFileStore.fileThumbnail = 'assets/images/image-not-found.jpg';
        photoIdentityFileStore.fileExt = '.jpg';
      }
      this.photoIdentityFileStore = photoIdentityFileStore;

      let businessIndentityFileStore = this.fileStore.find(z => z.type == FileStoreTypes.CustomerBussinessIdent);
      if (businessIndentityFileStore == null) {
        businessIndentityFileStore = new FileStore();
        businessIndentityFileStore.fileThumbnail = 'assets/images/image-not-found.jpg';
        businessIndentityFileStore.fileExt = '.jpg';
      }
      this.businessIndentityFileStore = businessIndentityFileStore;
    }
  }

  private loadImage(imageSrc: string) {
    if (imageSrc != undefined && imageSrc != null && imageSrc != "")
      return 'data:image/JPEG;base64,' + imageSrc;
    else
      return null
  }
  //#endregion

  //#region Master Config Data
  public async getMasterConfigData() {
    //Master Config
    this.masterConfigList = await this.masterConfigService.getAllMasterConfig();

    this.ShapesList = this.masterConfigList.shape;
    let allTheShapes = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.shape);
    allTheShapes.forEach(z => { this.allTheShapes.push({ name: z.name, isChecked: false }); });

    this.ColorList = this.masterConfigList.colors;
    let allColors = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.colors);
    allColors.forEach(z => { this.allColors.push({ name: z.name, isChecked: false }); });

    this.ClarityList = this.masterConfigList.clarities;
    let allClarities = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.clarities);
    allClarities.forEach(z => { this.allClarities.push({ name: z.name, isChecked: false }); });

    this.FluorList = this.masterConfigList.fluorescence;
    let allTheFluorescences = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.fluorescence);
    allTheFluorescences.forEach(z => { this.allTheFluorescences.push({ name: z.name, isChecked: false }); });

    this.CPSList = this.masterConfigList.cps;
    let allTheCPS = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.cps);
    allTheCPS.forEach(z => { this.allTheCut.push({ name: z.name, isChecked: false }); });
    allTheCPS.forEach(z => { this.allThePolish.push({ name: z.name, isChecked: false }); });
    allTheCPS.forEach(z => { this.allTheSymm.push({ name: z.name, isChecked: false }); });

    this.LabList = this.masterConfigList.lab;
    let allTheLab = this.utilityService.sortingMasterDNormPriority(this.masterConfigList.lab);
    allTheLab.forEach(z => { this.allTheLab.push({ name: z.name, isChecked: false }); });
  }
  //#endregion

  //#region WatchList
  public async getWatchListData() {
    try {
      this.spinnerService.show();
      var invItems = await this.watchListService.getInvItemsByCustomer(this.customerObj.id);
      if (invItems && invItems.length > 0) {
        this.listWatchListInventory = invItems;
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

  public async removeWishlist(stoneId: string) {
    this.alertDialogService.ConfirmYesNo("Are you sure you want to remove stone from watchlist?", "Delete")
      .subscribe(async (res: any) => {
        if (res.flag) {
          try {
            this.spinnerService.show();
            var invItems = await this.watchListService.deleteWatchListFromInventoryItem(stoneId, this.customerObj.id);
            if (invItems) {
              this.utilityService.showNotification('Stone remove successfully!');
              await this.getWatchListData();
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
      });

  }
  //#endregion

  //#region Customer Preference
  public async getCustomerPreferenceData() {
    try {
      this.spinnerService.show();
      var data = await this.customerPreferenceService.getCustomerPreferenceByCustomer(this.customerObj.id);
      if (data) {
        this.customerPreference = data;

        this.preferredStoneData = [];
        data.prefrredStones.forEach(z => {
          let obj: ParseSearchQuery = new ParseSearchQuery();
          obj.name = z.name;
          obj.query = JSON.parse(z.query);
          obj.expiryDate = z.expiryDate;
          this.preferredStoneData.push(obj);
        });

        this.saveSearchData = [];
        data.savedSearches.forEach(z => {
          let obj: ParseSearchQuery = new ParseSearchQuery();
          obj.name = z.name;
          obj.query = JSON.parse(z.query);
          obj.expiryDate = z.expiryDate;
          obj.createdAt = z.createdAt;
          this.saveSearchData.push(obj);
        });

        this.exportInfoObj = JSON.parse(JSON.stringify(data.exportInfo));
        this.exportInfoObj.ftpTime = this.getValidTime(this.exportInfoObj.ftpTime);
        this.exportInfoObj.emailTime = this.getValidTime(this.exportInfoObj.emailTime);

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

  public async removeSaveSearch(index: number) {
    this.alertDialogService.ConfirmYesNo("Are you sure you want to remove save search?", "Delete")
      .subscribe(async (res: any) => {
        if (res.flag) {
          try {
            this.spinnerService.show();
            this.customerPreference.savedSearches.splice(index, 1);
            var result = await this.customerPreferenceService.updateCustomerPreference(this.customerPreference);
            if (result) {
              this.utilityService.showNotification('Save Search remove successfully!');
              await this.getCustomerPreferenceData();
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
      });
  }

  public async updateExportSettings() {
    this.alertDialogService.ConfirmYesNo("Are you sure you want to update FTP settings?", "Update")
      .subscribe(async (res: any) => {
        if (res.flag) {
          try {
            this.spinnerService.show();
            this.customerPreference.exportInfo = this.exportInfoObj;
            var result = await this.customerPreferenceService.updateCustomerPreference(this.customerPreference);
            if (result) {
              this.utilityService.showNotification('Save Search remove successfully!');
              await this.getCustomerPreferenceData();
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
      });
  }

  public async addUpdateExportConfig() {
    try {
      if (this.exportConfigObj.name == undefined || this.exportConfigObj.name == null || this.exportConfigObj.name?.length == 0) {
        this.utilityService.showNotification('Name is required!', 'warning');
        return;
      }
      if (this.exportConfigObj.format == undefined || this.exportConfigObj.format == null || this.exportConfigObj.format?.length == 0) {
        this.utilityService.showNotification('Format is required!', 'warning');
        return;
      }
      if (this.exportConfigObj.fields == undefined || this.exportConfigObj.fields == null || this.exportConfigObj.fields?.length == 0) {
        this.utilityService.showNotification('Please select at least one column!', 'warning');
        return;
      }


      this.spinnerService.show();

      let i = 1;
      this.exportConfigObj.fields.forEach(z => {
        z.index = i++;
      });

      if (this.editExportConfigIndex != null)
        this.customerPreference.exportInfo.configs[this.editExportConfigIndex] = this.exportConfigObj;
      else
        this.customerPreference.exportInfo.configs.push(this.exportConfigObj);

      var result = await this.customerPreferenceService.updateCustomerPreference(this.customerPreference);
      if (result) {
        this.utilityService.showNotification('Save Search remove successfully!');
        await this.getCustomerPreferenceData();
        this.closeEditColumnDialog();
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

  public async removeExportConfig(index: number) {
    this.alertDialogService.ConfirmYesNo("Are you sure you want to remove export Template?", "Delete")
      .subscribe(async (res: any) => {
        if (res.flag) {
          try {
            this.spinnerService.show();
            this.customerPreference.exportInfo.configs.splice(index, 1);
            var result = await this.customerPreferenceService.updateCustomerPreference(this.customerPreference);
            if (result) {
              this.utilityService.showNotification('Export Template remove successfully!');
              await this.getCustomerPreferenceData();
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
      });
  }
  //#endregion

  //#region OnChange Function
  public searchColumns() {
    if (this.searchColumn.length == 0) {
      this.listBasicExportColumns = listBasicExportColumns;
      this.listMeasurementExportColumns = listMeasurementExportColumns;
      this.listIncusionExportColumns = listIncusionExportColumns;
      this.listOthersExportColumns = listOthersExportColumns;
    } else {
      let searchColumn = this.searchColumn.toLocaleLowerCase();
      this.listBasicExportColumns = listBasicExportColumns.filter(z => z.title.toLowerCase().includes(searchColumn));
      this.listMeasurementExportColumns = listMeasurementExportColumns.filter(z => z.title.toLowerCase().includes(searchColumn));
      this.listIncusionExportColumns = listIncusionExportColumns.filter(z => z.title.toLowerCase().includes(searchColumn));
      this.listOthersExportColumns = listOthersExportColumns.filter(z => z.title.toLowerCase().includes(searchColumn));
    }
  }

  public addExportColumn(column: ExportColumn) {
    let exists = this.exportConfigObj.fields.find(z => z.title == column.title);
    if (exists == null || column.title == 'Custom') {
      column.index = this.exportConfigObj.fields.length;
      this.exportConfigObj.fields.push(column);
      if (column.title == 'Custom')
        this.closeEditExportColumnDialog();
    }
    else
      this.utilityService.showNotification('This column already exists!', 'warning');
  }

  public removeExportField(index: number) {
    this.exportConfigObj.fields.splice(index, 1);

    let i = 1;
    this.exportConfigObj.fields.forEach(z => {
      z.index = i++;
    });
  }

  public getValidTime(date: any): Date {
    const day = moment(date).date();
    const month = moment(date).month();
    const year = moment(date).year();
    const hour = moment(date).hour();
    const minute = moment(date).minute();
    const second = moment(date).second();
    var newDate = new Date(year, month, day, hour, minute, second);
    return newDate;
  }

  public async onTabSelect(e: any) {
    switch (e.title.toLowerCase()) {
      case "watchlist":
        await this.getWatchListData();
        break;
      case "preferred stone":
        await this.getCustomerPreferenceData();
        break;
      case "save search":
        await this.getCustomerPreferenceData();
        break;
      case "export setting":
        await this.getCustomerPreferenceData();
        break;
    }
  }

  public getShapeImagePath(shape: string): string {
    let path = '../commonAssets/images/Round.png';
    switch (shape.toLowerCase()) {
      case "round":
        path = '../commonAssets/images/Round.png';
        break;
      case "cushion":
        path = '../commonAssets/images/Cushion.png';
        break;
      case "chakri":
        path = '../commonAssets/images/Chakri.png';
        break;
      case "emerald":
        path = '../commonAssets/images/Emerald.png';
        break;
      case "square emerald":
        path = '../commonAssets/images/Emerald.png';
        break;
      case "flanders":
        path = '../commonAssets/images/Flanders.png';
        break;
      case "marquise":
        path = '../commonAssets/images/Marquise.png';
        break;
      case "oval":
        path = '../commonAssets/images/Oval.png';
        break;
      case "pear":
        path = '../commonAssets/images/Pear.png';
        break;
      case "pentagonal":
        path = '../commonAssets/images/Pentagonal.png';
        break;
      case "princess":
        path = '../commonAssets/images/Princess.png';
        break;
      case "radiant":
        path = '../commonAssets/images/Radiant.png';
        break;
    }
    return path;
  }

  public async openDocumentDialog(type: string) {

    let image: FileStore = this.fileStore.find(z => z.type.toLowerCase() == type.toLowerCase()) as FileStore;
    if (image) {
      if (image.fileExt.toLowerCase() == ".pdf")
        await this.fileStoreService.downloadFile(image.id);
      else {
        this.getImagePath(type)
        this.isShowDocument = true;
      }
    }
  }

  public getImagePath(type: string) {
    let image: any = this.fileStore.find(z => z.type.toLowerCase() == type.toLowerCase());
    if (image)
      this.imgSrcDisplay = image.filePath;
    else
      this.imgSrcDisplay = "assets/images/image-not-found.jpg";
  }

  public closeDocumentDialog() {
    this.isShowDocument = false;
  }

  public sanitizeURL(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  public openAddCustomerCriteria(form?: NgForm): void {
    //this.clearCustomerCriteria(form);
    this.isAddCustomerCriteria = true;
  }

  public closeAddCustomerCriteria(): void {
    this.isAddCustomerCriteria = false;
  }

  public tagMapper(tags: any[]): void {
    // This function is used for hide selected items in multiselect box
  }

  public getCommaSapratedString(vals: any[], isAll: boolean = false): string {
    let name = vals.join(',')
    if (!isAll)
      if (name.length > 22)
        name = name.substring(0, 22) + '...';

    return name;
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

  public handleFilter(e: any): string {
    return e;
  }

  public onOpenDropdown(list: Array<{ name: string; isChecked: boolean }>, e: boolean, selectedData: string[]): boolean {
    if (selectedData?.length == list.map(z => z.name).length)
      e = true;
    else
      e = false;
    return e;
  }

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

  public clearColumnTemplateData() {
    this.exportConfigObj = new ExportConfig();
  }

  public clearColumnObjData() {
    this.exportColumnObj = new ExportColumn();
    this.exportColumnObj.title = 'Custom';
  }

  public openAddColumnDialog(): void {
    this.isEditColumn = true;
    this.columnModalTitle = 'Add';
    this.editExportConfigIndex = null;
    this.clearColumnTemplateData();
  }

  public openEditColumnDialog(index: number, obj: ExportConfig): void {
    this.columnModalTitle = 'Edit';
    this.editExportConfigIndex = index;
    this.exportConfigObj = JSON.parse(JSON.stringify(obj));
    this.isEditColumn = true;
  }

  public closeEditColumnDialog(): void {
    this.isEditColumn = false;
  }

  public openEditExportColumnDialog(): void {
    this.isEditExportColumn = true;
    this.clearColumnObjData();
  }

  public closeEditExportColumnDialog(): void {
    this.isEditExportColumn = false;
  }

  public openDiamonddetailsDailog(): void {
    this.isDiamondDetails = true;
  }
  //#endregion

  //#region Customer Criteria CRUD
  public selectAllCriteria(event: any) {
    this.customerCriteriaData.forEach(z => { z.isCheck = event.target.checked; });
    if (event.target.checked)
      this.selectedCustomerCriteria.push(...JSON.parse(JSON.stringify(this.customerCriteriaData)));
    else
      this.selectedCustomerCriteria = [];
  }

  public selectCriteria(id: string, event: any) {
    if (event.target.checked) {
      var index = this.selectedCustomerCriteria.findIndex(z => z.id == id);
      if (index >= 0) {
        this.selectedCustomerCriteria.splice(index, 1);
      }

      let criteria = this.customerCriteriaData.find(z => z.id == id);
      if (criteria)
        this.selectedCustomerCriteria.push(JSON.parse(JSON.stringify(criteria)));
    }
    else {
      var index = this.selectedCustomerCriteria.findIndex(z => z.id == id);
      if (index >= 0) {
        this.selectedCustomerCriteria.splice(index, 1);
      }
    }

  }

  public async getCustomerCriteriaData(id: string) {
    try {
      this.customerCriteriaData = await this.customerCriteriaService.getCustomerCriteriaByCustomer(id);
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async onCriteriaSubmit(form: NgForm, action: boolean) {
    try {
      if (form.valid) {
        this.spinnerService.show();
        let messageType = '';
        let response!: any;

        if (this.insertFlag) {
          this.setManualDataForInsert();

          messageType = 'inserted';
          response = await this.customerCriteriaService.criteriaInsert(this.customerCriteriaObj);
        }
        else {
          this.customerCriteriaObj.updatedBy = this.fxCredentials?.id ?? '';

          messageType = 'updated';
          response = await this.customerCriteriaService.criteriaUpdate(this.customerCriteriaObj);
        }

        if (response) {
          this.spinnerService.hide();
          this.clearCustomerCriteria();
          if (action)
            this.closeAddCustomerCriteria();
          this.utilityService.showNotification(`Record ` + messageType + ` successfully!`);
          await this.getCustomerCriteriaData(this.customerObj.id);
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

  public setManualDataForInsert() {
    let customerDNorm: CustomerDNorm = new CustomerDNorm();
    customerDNorm.id = this.customerObj.id;
    customerDNorm.name = this.customerObj.fullName;
    customerDNorm.mobile = this.customerObj.mobile1;
    customerDNorm.email = this.customerObj.email;
    customerDNorm.companyName = this.customerObj.companyName;
    this.customerCriteriaObj.customer = customerDNorm;

    this.customerCriteriaObj.id = '';
    this.customerCriteriaObj.createdBy = this.fxCredentials?.id ?? '';
  }

  public openDeleteDialog(id: string) {
    try {
      this.alertDialogService.ConfirmYesNo("Are you sure you want to delete?", "Delete")
        .subscribe(async (res: any) => {
          if (res.flag) {
            try {
              this.spinnerService.show();
              let responseDelete = await this.customerCriteriaService.deleteCriteria(id)
              if (responseDelete !== undefined && responseDelete !== null) {
                this.spinnerService.hide();
                await this.getCustomerCriteriaData(this.customerObj.id);
                this.utilityService.showNotification(`Record deleted successfully!`)
              }
            }
            catch (error: any) {
              console.error(error);
              this.alertDialogService.show('Something went wrong, Try again later!');
            }
          }
        });
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public editCustomerCriteria(obj: CustomerCriteria, isCopy: boolean = false): void {
    this.insertFlag = isCopy;
    this.customerCriteriaObj = new CustomerCriteria();
    this.customerCriteriaObj = { ...obj };
    this.checkForCheckBoxInput();
    this.isAddCustomerCriteria = true;
  }

  public checkForCheckBoxInput(): void {
    this.onMultiSelectChange(this.allTheShapes, this.customerCriteriaObj.shape);
    this.onMultiSelectChange(this.allTheLab, this.customerCriteriaObj.lab);
    this.onMultiSelectChange(this.allColors, this.customerCriteriaObj.color);
    this.onMultiSelectChange(this.allClarities, this.customerCriteriaObj.clarity);
    this.onMultiSelectChange(this.allTheCut, this.customerCriteriaObj.cut);
    this.onMultiSelectChange(this.allThePolish, this.customerCriteriaObj.polish);
    this.onMultiSelectChange(this.allTheSymm, this.customerCriteriaObj.symmetry);
    this.onMultiSelectChange(this.allTheFluorescences, this.customerCriteriaObj.fluorescence);
  }

  public clearCustomerCriteria(form?: NgForm): void {
    this.customerCriteriaObj = new CustomerCriteria();
    form?.reset();
    this.errWeight = '';
    this.errDiscount = '';
    this.errDepth = '';
    this.checkForCheckBoxInput();
    this.insertFlag = true;
  }
  //#endregion

  //#region Export To Excel
  public async ExportToExcel() {
    try {
      var excelFile: any[] = [];
      this.spinnerService.show();
      let exportData = await this.customerCriteriaService.getInventoryItemsByCustomerCriteria(this.selectedCustomerCriteria);
      if (exportData && exportData.length > 0) {
        let fields = await this.gridPropertiesService.getInventoryGrid();
        if (fields) {
          exportData.forEach(element => {
            var excel = this.convertArrayToObject(fields, element);
            excelFile.push(excel);
          });

          if (excelFile.length > 0) {
            let isExport: boolean = this.utilityService.exportAsExcelFile(excelFile, "Diamond_Excel_");
            if (isExport) {
              this.selectedCustomerCriteria = [];
              this.customerCriteriaData.forEach(z => { z.isCheck = false; });
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
    catch (error: any) {
      console.error(error);
      this.alertDialogService.show('Something went wrong, Try again later');
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
          obj[fields[i].title] = (element.basePrice.netAmount / element.weight).toFixed(3);
        else if (fields[i].title == "Rap")
          obj[fields[i].title] = element.basePrice.rap.toFixed(3);
        else if (fields[i].title == "Discount")
          obj[fields[i].title] = element.basePrice.discount.toFixed(3);
        else if (fields[i].title == "NetAmount")
          obj[fields[i].title] = element.basePrice.netAmount.toFixed(3);
        else
          obj[fields[i].title] = element[fields[i].propertyName];
      }
    }
    return obj;
  }
  //#endregion

}
