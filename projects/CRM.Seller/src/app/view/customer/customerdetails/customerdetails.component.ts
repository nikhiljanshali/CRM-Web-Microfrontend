import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer, CustomerDNorm, CustomerCriteria, GridDetailConfig } from 'common/businessobjects';
import { FileStore, fxCredential, MasterConfig, MasterDNorm } from 'common/entities';
import { CustomerCriteriaService, CustomerService, FileStoreService, FileStoreTypes, GridPropertiesService, MasterConfigService, UtilityService } from 'common/services';
import { AlertdialogService } from 'common/views';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-customerdetails',
  templateUrl: './customerdetails.component.html'
})
export class CustomerdetailsComponent implements OnInit {

  public customerObj: Customer = new Customer;
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


  constructor(private customerService: CustomerService,
    private router: Router,
    private alertDialogService: AlertdialogService,
    private activatedRoute: ActivatedRoute,
    public utilityService: UtilityService,
    private masterConfigService: MasterConfigService,
    private customerCriteriaService: CustomerCriteriaService,
    private spinnerService: NgxSpinnerService,
    private fileStoreService: FileStoreService,
    private gridPropertiesService: GridPropertiesService,
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

  //#region Customer Criteria CRUD
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
    this.customerCriteriaObj.customer = customerDNorm;

    this.customerCriteriaObj.id = '';
    this.customerCriteriaObj.createdBy = this.fxCredentials?.id ?? '';
  }

  public openDeleteDialog(id: string) {
    try {
      this.alertDialogService.ConfirmYesNo("Are you sure you want to delete?", "Delete")
        .subscribe(async (res: any) => {
          if (res.flag) {
            this.spinnerService.show();
            let responseDelete = await this.customerCriteriaService.deleteCriteria(id)
            if (responseDelete !== undefined && responseDelete !== null) {
              this.spinnerService.hide();
              await this.getCustomerCriteriaData(this.customerObj.id);
              this.utilityService.showNotification(`Record deleted successfully!`)
            }
          }
        });
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }
  //#endregion

  //#region OnChange Function
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
    this.clearCustomerCriteria(form);
    this.isAddCustomerCriteria = true;
  }

  public closeAddCustomerCriteria(): void {
    this.isAddCustomerCriteria = false;
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
