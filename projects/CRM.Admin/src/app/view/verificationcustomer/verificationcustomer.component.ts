import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { NotificationService } from '@progress/kendo-angular-notification';
import { DataResult, GroupDescriptor, process } from '@progress/kendo-data-query';
import { BranchDNorm, Country, GridDetailConfig, OrganizationDNorm, SellerDNorm } from 'common/businessobjects';
import { FileStore, fxCredential, GridMasterConfig, RegisterCustomer, RegisterModel } from 'common/entities';
import { GridConfig } from 'common/entities/configs/gridconfig';
import { AccountService, AppPreloadService, CommonService, ConfigService, FileStoreService, GridPropertiesService, OrganizationService, UtilityService } from 'common/services';
import { AlertdialogService } from 'common/views';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { NgxSpinnerService } from 'ngx-spinner';
import { Customer, CustomerVerificationResponse, CustomerVerificationSearchCriteria } from '../../businessobjects';
import { CustomerService } from '../../services/customer/customer.service';

@Component({
  selector: 'app-verificationcustomer',
  templateUrl: './verificationcustomer.component.html',
  styles: []
})

export class VerificationCustomerComponent implements OnInit {
  public isCustVerification: boolean = false;
  public isGridConfig: boolean = false;
  private fxCredential!: fxCredential;
  public gridConfig!: GridConfig;
  public gridMasterConfigResponse!: GridMasterConfig;
  public filterFlag = true;
  public groups: GroupDescriptor[] = [];
  public pageSize = 26;
  public skip = 0;
  public fields!: GridDetailConfig[];
  public gridView!: DataResult;
  public isRegSystemUser: boolean = false;
  public selectableSettings: SelectableSettings = { mode: 'single' };
  public skeletonArray = new Array(18);
  public mySelection: string[] = [];
  // CRUD CustomerVerification
  public countryItems!: Country[];
  public selectedCountry: any;
  // Filter CustomerVerificationSearchCriteria
  public customerVerificationSearchCriteria: CustomerVerificationSearchCriteria = new CustomerVerificationSearchCriteria();
  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  // InternationalphoneNumber
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.Belgium, CountryISO.Thailand, CountryISO.UnitedArabEmirates, CountryISO.UnitedStates];
  intMobileNo: any;
  // fetchCustomerData
  public registerCustomer: RegisterCustomer = new RegisterCustomer();
  // accept or Rejectcustomer
  public customer: Customer = new Customer();
  public listOrganizationDNormItems: Array<{ text: string; value: string }> = [];
  public organizationDNormItems!: OrganizationDNorm[];
  public selectedOrganizationDNormItem?: string;
  public listBranchDNormItems: Array<{ text: string; value: string }> = [];
  public branchDNormItems!: BranchDNorm[];
  public selectedBranchDNormItem?: string;
  public listSellerDNormItems: Array<{ text: string; value: string }> = [];
  public sellerDNormItems!: SellerDNorm[];
  public selectedSellerDNormItem?: string;
  public fileStore: FileStore[] = [];
  public cloneFileStore: FileStore[] = [];
  // view Attached Document
  public isShowDocument: boolean = false;
  public imgSrcDisplay!: string


  constructor(public customerService: CustomerService,
    private organizationService: OrganizationService,
    private router: Router,
    private commonService: CommonService,
    public utilityService: UtilityService,
    private gridPropertiesService: GridPropertiesService,
    public notificationService: NotificationService,
    private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService,
    private configService: ConfigService,
    private appPreloadService: AppPreloadService,
    private accountService: AccountService,
    private fileStoreService: FileStoreService,
    private sanitizer: DomSanitizer) { }

  async ngOnInit() {
    await this.defaultMethods();
  }

  async defaultMethods() {
    this.fxCredential = await this.appPreloadService.fetchFxCredentials();
    if (!this.fxCredential)
      this.router.navigate(["login"]);
    await this.getGridConfiguration();
    this.utilityService.filterToggleSubject.subscribe((flag) => {
      this.filterFlag = flag;
    });
    await this.getCountryData();
    await this.getOrganizationDNormData();
    await this.getSellerDNormData();
    await this.loadCustomers();
  }

  public async getGridConfiguration() {
    try {
      this.gridConfig = await this.configService.getGridConfig(this.fxCredential.id, "CustomerVerification", "CustomerVerificationGrid");
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
        this.gridMasterConfigResponse = await this.configService.getMasterGridConfig("CustomerVerification", "CustomerVerificationGrid");
        if (this.gridMasterConfigResponse)
          this.fields = this.gridMasterConfigResponse.gridDetail;
        else
          this.fields = await this.gridPropertiesService.getCustomerVerificationGrid();
      }
    }
    catch (error: any) {
      this.alertDialogService.show(error);
      this.spinnerService.hide();
    }
  }

  private async getCountryData() {
    try {
      this.countryItems = await this.commonService.getCountries();
    }
    catch (error: any) {
      this.alertDialogService.show(error.error);
    }
  }

  public async loadCustomers() {
    try {
      let response: CustomerVerificationResponse = await this.customerService.getCustomers(this.customerVerificationSearchCriteria, this.skip, this.pageSize);
      if (response) {
        this.gridView = process(response.customers, { group: this.groups });
        this.gridView.total = response.totalCount;
      }
    }
    catch (error: any) {
      this.alertDialogService.show(error.error);
    }
  }

  public openCustVerificationDialog(): void {
    this.isCustVerification = true;
  }

  public closeCustVerificationDialog(): void {
    this.mySelection = [];
    this.isCustVerification = false;
  }

  //#region OnChange Functions
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadCustomers();
  }

  public filterPartToggle() {
    this.utilityService.setfilterToggleValue(this.filterFlag);
  }

  public groupChange(groups: GroupDescriptor[]): void {
    try {
      this.groups = groups;
      this.loadCustomers();
    }
    catch (error: any) {
      this.alertDialogService.show(error.error);
    }
  }

  public async selectedRowChange(e: any) {
    if (e.selectedRows != null && e.selectedRows.length > 0) {
      this.registerCustomer = e.selectedRows[0].dataItem;
      let imageList: FileStore[] = await this.fileStoreService.getFileByIdent(this.registerCustomer.id);
      this.cloneFileStore = [];
      if (imageList && imageList.length > 0) {
        for (let index = 0; index < imageList.length; index++) {
          const element = imageList[index];
          this.cloneFileStore.push({ ...element });
          element.fileThumbnail = this.loadImage(element.fileThumbnail) || null as any;
          element.filePath = await this.fileStoreService.getPathToBase64(element.id, element.type);
          element.filePath = this.loadImage(element.filePath) || null as any;

        }
        this.fileStore = imageList;
      }
    }
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

  public onFilterSubmit(form: NgForm) {
    this.mySelection = [];
    if (this.intMobileNo)
      this.customerVerificationSearchCriteria.mobileNo = this.intMobileNo.e164Number;
    else
      this.customerVerificationSearchCriteria.mobileNo = "";
    this.skip = 0;
    this.loadCustomers();
  }

  public clearFilter(form: NgForm) {
    this.mySelection = [];
    form.reset();
    this.customerVerificationSearchCriteria = new CustomerVerificationSearchCriteria();
    this.loadCustomers();
  }

  public getSocialMediaData(socialMediaType: string) {
    return this.registerCustomer.socialMedias.find((c) => c.provider.providerName.toLowerCase() == socialMediaType.toLowerCase());
  }

  //#endregion

  //#region Accpet/Reject Customer
  public async acceptOrRejectCustomer(form: NgForm, isAccept: boolean) {
    try {
      this.alertDialogService.ConfirmYesNo('Are you sure?', 'Customer verification')
        .subscribe(async (res: any) => {
          if (res.flag) {
            this.spinnerService.show();
            this.fillCustomerRequest(this.registerCustomer, form);
            if (this.customer !== undefined && this.customer !== null) {
              let response: string = await this.customerService.acceptOrRejectCustomer(this.customer, isAccept);
              if (response == "") {
                this.alertDialogService.show("Something went wrong, Try again later!");
                this.spinnerService.hide();
              }
              else if (response.toLowerCase() == "rejected") {
                this.spinnerService.hide();
                this.utilityService.showNotification("Customer has been rejected", "error");
                this.closeCustVerificationDialog();
                this.loadCustomers();
              }
              else {
                this.addUserForCustomer(response, this.customer);
              }
            }
          }
        });
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public fillCustomerRequest(registerCustomer: RegisterCustomer, form: NgForm) {
    // Basic Info
    this.customer.name.firstName = registerCustomer.name.firstName;
    this.customer.name.lastName = registerCustomer.name.lastName;
    this.customer.name.middleName = registerCustomer.name.middleName;
    this.customer.fullName = registerCustomer.fullName;
    this.customer.email = registerCustomer.email;
    this.customer.mobile1 = registerCustomer.primaryMobile;
    this.customer.mobile2 = registerCustomer.secondaryMobile;
    this.customer.phoneNo = registerCustomer.phoneNo;
    this.customer.birthDate = registerCustomer.birthDate;
    this.customer.countryCode = registerCustomer.countryCode;
    // BusinessInfo
    this.customer.companyName = registerCustomer.companyName;
    this.customer.businessType = registerCustomer.businessType;
    this.customer.designation = registerCustomer.designation;
    this.customer.businessPhoneNo = registerCustomer.businessPhoneNo;
    this.customer.businessEmail = registerCustomer.businessEmail;
    this.customer.businessMobileNo = registerCustomer.businessMobileNo;
    this.customer.businessPhoneNo = registerCustomer.businessPhoneNo;
    this.customer.address = registerCustomer.address;
    this.customer.faxNo = registerCustomer.faxNo;
    this.customer.referenceName = registerCustomer.referenceName;
    // SocailMedias List
    this.customer.socialMedias = registerCustomer.socialMedias;

  }

  private async getOrganizationDNormData() {
    try {
      this.organizationDNormItems = await this.organizationService.getOrganizationDNorm();
      this.organizationDNormItems.forEach((item) => {
        this.listOrganizationDNormItems.push({ text: item.name, value: item.id });
      });
    }
    catch (error: any) {
      console.error(error);
      this.alertDialogService.show(error.error);
    }
  }

  private async getSellerDNormData() {
    try {
      this.sellerDNormItems = await this.customerService.getSellerDNorm();
      this.sellerDNormItems.forEach((item) => {
        this.listSellerDNormItems.push({ text: item.name, value: item.id });
      });
    }
    catch (error: any) {
      console.error(error);
      this.alertDialogService.show(error.error);
    }
  }

  public async onOrganizationDNormChange(e: any, isFilter: boolean = false) {
    const orgDNorm = this.organizationDNormItems.find(z => z.id == e);
    if (orgDNorm != undefined && orgDNorm != null) {
      this.spinnerService.show();
      this.customer.organization = orgDNorm
      await this.getBranchDNormByOrgId(orgDNorm.id);
    }
  }

  private async getBranchDNormByOrgId(id: string) {
    try {
      this.branchDNormItems = await this.organizationService.getBranchDNormByOrganizationId(id);
      this.listBranchDNormItems = [];
      this.branchDNormItems.forEach((z) => { this.listBranchDNormItems.push({ text: z.name, value: z.name }); });
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
      this.customer.branch = branchDNorm;
    }
  }

  public onSellerDNormChange(e: any) {
    const sellerDNorm = this.sellerDNormItems.find(z => z.id == e.value);
    if (sellerDNorm != undefined && sellerDNorm != null) {
      this.customer.seller = sellerDNorm;
    }
  }

  //#endregion

  //#region User Register
  public async addUserForCustomer(id: string, customer: Customer) {
    try {
      let userObj: RegisterModel = new RegisterModel();
      userObj.ident = id;
      userObj.origin = customer.origin.toString();
      userObj.email = customer.email;
      userObj.phoneNumber = customer.mobile1;
      userObj.password = "Glowstar@2021";
      userObj.confirmPassword = "Glowstar@2021";

      var result = await this.accountService.insertUser(userObj);
      if (result.toLowerCase() == "success") {
        await this.updateFileStoreWithCustomerId(id);
        this.closeCustVerificationDialog();
        this.spinnerService.hide();
        this.utilityService.showNotification(`New customer register successfully!`)
        this.loadCustomers();
      }
      else {
        this.spinnerService.hide();
        var errorObj = JSON.parse(result);
        this.alertDialogService.show(errorObj[0]?.description ?? "Something went wrong, Try again later!");
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async updateFileStoreWithCustomerId(id: string) {
    try {
      for (let index = 0; index < this.cloneFileStore.length; index++) {
        const element = this.cloneFileStore[index];
        element.customerIdent = id;
        await this.fileStoreService.updateFileStore(element);
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }

  }
  //#endregion

  public getImagePath(type: string) {
    let image: any = this.fileStore.find(z => z.type.toLowerCase() == type.toLowerCase());
    if (image)
      this.imgSrcDisplay = image.filePath;
    else
      this.imgSrcDisplay = "assets/images/image-not-found.jpg";

  }

  public getThumbnailImagePath(type: string) {
    if (type != undefined && type != null && type != "") {
      let image: any = this.fileStore.find(z => z.type.toLowerCase() == type.toLowerCase());
      if (image)
        return image.fileThumbnail;
      else {
        if (type.toLowerCase() == "profile")
          return "assets/images/profile.png";
        else
          return "assets/images/image-not-found.jpg";
      }
    }
  }

  private loadImage(imageSrc: string) {
    if (imageSrc != undefined && imageSrc != null && imageSrc != "")
      return 'data:image/JPEG;base64,' + imageSrc;
    else
      return null
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

  public closeDocumentDialog() {
    this.isShowDocument = false;
  }

  public sanitizeURL(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}