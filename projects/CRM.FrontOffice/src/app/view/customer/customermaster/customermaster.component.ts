import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { NotificationService } from '@progress/kendo-angular-notification';
import { DataResult, GroupDescriptor, process } from '@progress/kendo-data-query';
import { Country, GridDetailConfig, State, City, SocialMedia, SocialMediaProvider } from 'shared/businessobjects';
import { FileStore, fxCredential, GridMasterConfig, RegisterModel } from 'shared/enitites';
import { GridConfig } from 'common/entities/configs/gridconfig';
import { AccountService, AppPreloadService, CommonService, ConfigService, FileStoreService, FileStoreTypes, listBusinessTypeItems, listCustomerOriginItems, listSocialMediaProviderItems, UtilityService } from 'shared/services';
import { AlertdialogService } from 'shared/views';
import * as moment from 'moment';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { NgxSpinnerService } from 'ngx-spinner';
import { Customer, SystemUser, SystemUserDNorm } from '../../../entities';
import { CustomerSearchCriteria, CustomerSearchResponse } from '../../../businessobjects';
import { CustomerService, GridPropertiesService, SystemUserService } from '../../../services';

@Component({
  selector: 'app-customermaster',
  templateUrl: './customermaster.component.html',
  styles: []
})

export class CustomerMasterComponent implements OnInit {
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
  // Filter CustomerVerificationSearchCriteria
  public customerSearchCriteria: CustomerSearchCriteria = new CustomerSearchCriteria();
  // public registerCustomer = new RegisterCustomer();
  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  // accept or Rejectcustomer
  public selectedOrganizationDNormItem?: string;
  public selectedBranchDNormItem?: string;
  public selectedSellerItem?: string;

  // InternationalphoneNumber
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.Belgium, CountryISO.Thailand, CountryISO.UnitedArabEmirates, CountryISO.UnitedStates];
  intMobileNo: any;

  // view Attached Document
  public isShowDocument: boolean = false;
  public imgSrcDisplay!: string
  // CRUD Customer Verification
  public selectedSellerItems?: { text: string; value: string };
  public isAddDialogopen: boolean = false;
  public customerdetailsobj: Customer = new Customer();
  public mobileMask = '(999) 000-00-00';
  public phoneMask = '(9999) 000-00-00';
  public faxMask = '(999) 000-0000';
  public countryItems!: Country[];
  public selectedCountry: any;
  public stateItems!: State[];
  public selectedState: any;
  public cityItems!: City[];
  public selectedCity: any;
  public isRegCustomer: boolean = false;
  public insertFlag: boolean = true;
  public folderName = "Customer Registeration";
  public imagePreviewbusiness: any;
  public imagePreviewprofile: any;
  public imagePreviewphoto: any;
  public localform!: NgForm;
  public isImgselectedProfile: boolean = false;
  public isImgselectedPhotoIdent: boolean = false;
  public isImgselectedBusiness: boolean = false;
  public iseditcustomers: boolean = false;

  public socialMediaProviderItems!: SocialMediaProvider[];
  public listSocialMediaProviderItems: string[] = [];
  public selectedSocialMediaProviderItem: any;
  public socialMediaObj: SocialMedia = new SocialMedia();
  public isSocialMediaUpdateFlag: boolean = false;
  public isMessagingFlag: boolean = false;
  public editSocialMediaId: string = '';

  public customer: Customer = new Customer();
  public listSellerItems: Array<{ text: string; value: string }> = [];
  public sellerItems!: SystemUser[];
  public fileStore: FileStore[] = [];
  public cloneFileStore: FileStore[] = [];

  public profileFileStore: FileStore = new FileStore();
  public photoIdentityFileStore: FileStore = new FileStore();
  public businessIndentityFileStore: FileStore = new FileStore();

  // fileupload ViewChild
  @ViewChild('profileFileupload', { static: false }) ProfileFileupload!: ElementRef;
  @ViewChild('photoIdentityFileupload', { static: false }) PhotoIdentityFileupload!: ElementRef;
  @ViewChild('businessIndentityFileupload', { static: false }) BusinessIndentityFileupload!: ElementRef;

  // Files upload variables
  public currentFile!: File;
  public profileImageErrorFlag: boolean = false;
  public profileImageModel: any = undefined;
  public photoIdentityErrorFlag: boolean = false;
  public photoIdentityModel: any = undefined;
  public businessIdentityErrorFlag: boolean = false;
  public businessIdentityModel: any = undefined;

  public showUploadProfile = true;
  public showUploadIdent = true;
  public showUploadBusiness = true;

  public fileUploadItems: Array<{ type: string, file: File }> = new Array<{ type: string, file: File }>();
  // BusinessType DropdownValue
  public listBusinessTypeItems = listBusinessTypeItems;
  public listCustomerOriginItems = listCustomerOriginItems;

  public FileStoreTypes = FileStoreTypes;

  constructor(public customerService: CustomerService,
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
    private systemUserService: SystemUserService,
    private sanitizer: DomSanitizer) { }

  async ngOnInit() {
    await this.defaultMethods();
  }

  //#region Fetch defaultdetails
  async defaultMethods() {
    this.fxCredential = await this.appPreloadService.fetchFxCredentials();
    if (!this.fxCredential)
      this.router.navigate(["login"]);
    await this.getGridConfiguration();
    this.utilityService.filterToggleSubject.subscribe((flag) => {
      this.filterFlag = flag;
    });

    this.getSocialMediaProviderData();
    await this.getCountryData();
    await this.getSellerData();
    await this.loadCustomers();
  }

  public async getGridConfiguration() {
    try {
      this.gridConfig = await this.configService.getGridConfig(this.fxCredential.id, "Customer", "Customer");
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
        this.gridMasterConfigResponse = await this.configService.getMasterGridConfig("Customer", "Customer");
        if (this.gridMasterConfigResponse)
          this.fields = this.gridMasterConfigResponse.gridDetail;
        else
          this.fields = await this.gridPropertiesService.getCustomerGrid();
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
      let response: CustomerSearchResponse = await this.customerService.getCustomers(this.customerSearchCriteria, this.skip, this.pageSize);
      if (response) {
        this.gridView = process(response.customers, { group: this.groups });
        this.gridView.total = response.totalCount;
      }
    }
    catch (error: any) {
      this.alertDialogService.show(error.error);
    }
  }

  private async getSellerData() {
    try {
      this.sellerItems = await this.systemUserService.getSystemUserByOrigin("Seller");
      this.sellerItems.forEach((item) => {
        this.listSellerItems.push({ text: item.fullName, value: item.id });
      });
    }
    catch (error: any) {
      console.error(error);
      this.alertDialogService.show(error.error);
    }
  }

  public getSocialMediaData(socialMediaType: string) {
    return this.customer.socialMedias.find((c) => c.provider.providerName.toLowerCase() == socialMediaType.toLowerCase());
  }

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
        if (type.toLowerCase() == FileStoreTypes.CustomerProfile)
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
  //#endregion

  //#region Filter
  public onFilterSubmit(form: NgForm) {
    this.mySelection = [];
    this.skip = 0;
    this.loadCustomers();
  }

  public clearFilter(form: NgForm) {
    this.mySelection = [];
    form.reset();
    this.customerSearchCriteria = new CustomerSearchCriteria();
    this.getSocialMediaProviderData();
    this.loadCustomers();
  }
  //#endregion Filter

  //#region OnChange Functions
  public sanitizeURL(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

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
    this.insertFlag = false;
    this.customerdetailsobj = new Customer();
    if (e.selectedRows != null && e.selectedRows.length > 0) {
      let value: Customer = e.selectedRows[0].dataItem;
      value.birthDate = this.getValidBirthDate(value.birthDate);
      this.customerdetailsobj = JSON.parse(JSON.stringify(value));
      let imageList: FileStore[] = await this.fileStoreService.getFileByIdent(this.customerdetailsobj.id);
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
        this.setCustomerImages();
      }
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

  public getValidBirthDate(date: any): Date {
    const day = moment(date).date();
    const month = moment(date).month();
    const year = moment(date).year();
    var newDate = new Date(year, month, day);
    return newDate;
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

  public openCustomerDetails() {
    this.router.navigate(['/customer/details', this.customerdetailsobj.id]);
  }

  public onSellerChange(e: any) {
    const seller = this.sellerItems.find(z => z.id == e.value);
    if (seller != undefined && seller != null) {
      let dnorm: SystemUserDNorm = new SystemUserDNorm();
      dnorm.id = seller.id;
      dnorm.name = seller.fullName;
      dnorm.mobile = seller.mobile;
      dnorm.email = seller.email;
      dnorm.address = seller.address;
      this.customerdetailsobj.seller = dnorm;
    }
  }

  public onCountryChange(e: string): void {
    try {
      this.spinnerService.show();
      this.selectedCountry = this.countryItems.find((c) => c.name == e);
      this.getStatesByCountryCode(this.selectedCountry.iso2);
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  private async getStatesByCountryCode(country_code: string) {
    try {
      this.stateItems = await this.commonService.getStatesByCountryCode(country_code);
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public onStateChange(e: string): void {
    try {
      this.spinnerService.show();
      this.selectedState = this.stateItems.find((c: State) => c.name == e);
      this.getCityData(this.selectedCountry, this.selectedState.state_Code);
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  private async getCityData(selectedCountry: Country, state_code: string) {
    try {
      this.cityItems = await this.commonService.getCitiesByCountryCodeandStateCode(selectedCountry.iso2, state_code);
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public onCityChange(e: string): void {
    try {
      this.selectedCity = this.cityItems.find((c: City) => c.name == e);
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
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
      console.error(error);
      this.spinnerService.hide();
      this.utilityService.showNotification('User not created, Please contact administrator!', 'error');
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

  //#region SocialMedia CRUD
  private getSocialMediaProviderData() {
    this.socialMediaProviderItems = [];
    this.listSocialMediaProviderItems = [];
    this.socialMediaProviderItems = listSocialMediaProviderItems;
    this.socialMediaProviderItems.forEach((z) => {
      this.listSocialMediaProviderItems.push(z.providerName);
    });
  }

  public onSocialMediaProviderChange(e: any) {
    let socialMediaProvider = this.socialMediaProviderItems.find(z => z.providerName == e);
    if (socialMediaProvider?.mediaType == 'Messaging' || socialMediaProvider?.mediaType == '3')
      this.isMessagingFlag = true;
    else
      this.isMessagingFlag = false;
  }

  public onSocialMediaSubmit() {
    let socialMediaProvider = this.socialMediaProviderItems.find((z) => z.providerName == this.selectedSocialMediaProviderItem);
    let socialMedia: SocialMedia = new SocialMedia();
    socialMedia.provider = socialMediaProvider ?? new SocialMediaProvider();
    socialMedia.mobileNumber = this.socialMediaObj.mobileNumber;
    socialMedia.profileName = this.socialMediaObj.profileName;
    this.customerdetailsobj.socialMedias.push(socialMedia);
    this.listSocialMediaProviderItems = this.listSocialMediaProviderItems.filter((z) => z != this.selectedSocialMediaProviderItem);

    this.socialMediaObj.mobileNumber = '';
    this.socialMediaObj.profileName = '';
    this.selectedSocialMediaProviderItem = '';
  }

  public onSocialMediaUpdate() {
    let socialMediaProvider = this.socialMediaProviderItems.find((z) => z.providerName == this.selectedSocialMediaProviderItem);
    this.customerdetailsobj.socialMedias.forEach((z) => {
      if (z.provider.providerName == this.editSocialMediaId) {
        z.provider = socialMediaProvider ?? new SocialMediaProvider();
        z.mobileNumber = this.socialMediaObj.mobileNumber;
        z.profileName = this.socialMediaObj.profileName;
      }
    });

    this.listSocialMediaProviderItems = this.listSocialMediaProviderItems.filter((z) => z != this.selectedSocialMediaProviderItem);
    this.socialMediaObj.mobileNumber = '';
    this.socialMediaObj.profileName = '';
    this.selectedSocialMediaProviderItem = '';
    this.editSocialMediaId = '';
    this.isSocialMediaUpdateFlag = false;
  }

  public onSocialMediaEdit(e: any) {
    if (e.provider != null && e.provider != undefined) {
      if (e.provider.mediaType == 'Messaging' || e.provider.mediaType == '3')
        this.isMessagingFlag = true;
      else
        this.isMessagingFlag = false;
      this.editSocialMediaId = e.provider.providerName;
      this.listSocialMediaProviderItems.push(e.provider.providerName);
      this.selectedSocialMediaProviderItem = e.provider.providerName;
    }
    this.socialMediaObj.mobileNumber = e.mobileNumber;
    this.socialMediaObj.profileName = e.profileName;

    this.isSocialMediaUpdateFlag = true;
  }

  public onSocialMediaDelete(e: any) {
    this.alertDialogService.ConfirmYesNo('Are you sure you want to delete?', 'Delete')
      .subscribe(async (res: any) => {
        if (res.flag)
          this.customerdetailsobj.socialMedias = this.customerdetailsobj.socialMedias.filter((z) => z.provider.providerName != e.provider.providerName);
      });
  }
  //#endregion

  //#region CRUD Customer
  public openAddCustomerDialog() {
    this.isAddDialogopen = true;
    this.iseditcustomers = false;
    this.insertFlag = true;

    this.showUploadProfile = true;
    this.showUploadIdent = true;
    this.showUploadBusiness = true;

    this.customerdetailsobj = new Customer();
  }

  public closeAddCustomerDialog() {
    this.customerdetailsobj = new Customer();
    this.isAddDialogopen = false;
    this.resetFormimg(this.localform);
    this.mySelection = [];
    this.resetForm();
    this.loadCustomers();
  }

  public uploadFiles(form: NgForm, event: Event, type: string): void {
    try {
      let acceptedFiles: string[] = [];
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
        this.currentFile = file;
        if (type == FileStoreTypes.CustomerProfile) {
          this.profileImageModel = this.currentFile;
          const reader = new FileReader();
          reader.onload = () => {
            this.imagePreviewprofile = reader.result;
          };
          reader.readAsDataURL(file);
          this.profileImageErrorFlag = false;
          this.isImgselectedProfile = true;
        }
        else if (type == FileStoreTypes.CustomerPhotoIdent) {
          this.photoIdentityModel = this.currentFile;
          const reader = new FileReader();
          reader.onload = () => {
            this.imagePreviewphoto = reader.result;
            if (this.imagePreviewphoto?.toString().includes('application/pdf'))
              this.imagePreviewphoto = 'commonAssets/images/pdf_doc.png';
          };
          reader.readAsDataURL(file);
          this.photoIdentityErrorFlag = false;
          this.isImgselectedPhotoIdent = true;
        }
        else {
          this.businessIdentityModel = this.currentFile;
          const reader = new FileReader();
          reader.onload = () => {
            this.imagePreviewbusiness = reader.result;
            if (this.imagePreviewbusiness?.toString().includes('application/pdf'))
              this.imagePreviewbusiness = 'commonAssets/images/pdf_doc.png';
          };
          reader.readAsDataURL(file);
          if (this.businessIdentityErrorFlag)
            this.businessIdentityErrorFlag = false;
          this.isImgselectedBusiness = true;
        }

        this.fileUploadItems.push({ file: file, type: type });
      }
    }
    catch (error: any) {
      console.error(error);
      this.alertDialogService.show("Something went wrong, Try again later");
    }
  }

  public resetFormimg(form: NgForm) {
    this.clearPhotoProfile(form);
    this.clearPhotoIdentity(form);
    this.clearBusinessIdentity(form);
    this.iseditcustomers = false;
  }

  public resetForm(form?: NgForm) {
    this.insertFlag = true;
    form?.reset();
    this.customerdetailsobj = new Customer();
    this.selectedSellerItems = { text: "", value: "" }
    this.mySelection = [];
    this.getSocialMediaProviderData();
  }

  public clearPhotoProfile(form: NgForm) {
    this.localform = form
    this.isImgselectedProfile = false;
    this.profileImageModel = undefined;
    this.profileImageErrorFlag = false;
    this.imagePreviewprofile = undefined;
    this.profileFileStore = new FileStore();
  }

  public clearPhotoIdentity(form: NgForm) {
    this.localform = form
    this.isImgselectedPhotoIdent = false;
    this.photoIdentityModel = undefined;
    this.imagePreviewphoto = undefined;
    this.photoIdentityErrorFlag = false;
    this.photoIdentityFileStore = new FileStore();
  }

  public clearBusinessIdentity(form: NgForm) {
    this.localform = form
    this.isImgselectedBusiness = false;
    this.businessIdentityModel = undefined;
    this.imagePreviewbusiness = undefined;
    this.businessIdentityErrorFlag = false;
    this.businessIndentityFileStore = new FileStore();
  }

  public clearPreviewFile(type: string) {
    if (type == FileStoreTypes.CustomerProfile) {
      this.imagePreviewprofile = '';
      this.isImgselectedProfile = false;
      this.profileImageModel = undefined;
    }
    else if (type == FileStoreTypes.CustomerPhotoIdent) {
      this.imagePreviewphoto = '';
      this.isImgselectedPhotoIdent = false;
      this.photoIdentityModel = undefined;
    }
    else {
      this.imagePreviewbusiness = '';
      this.isImgselectedBusiness = false;
      this.businessIdentityModel = undefined;
    }

    let fileUploadItemsIndex = this.fileUploadItems.findIndex(z => z.type == type);
    if (fileUploadItemsIndex >= 0)
      this.fileUploadItems.splice(fileUploadItemsIndex, 1);
  }

  public setExtraFields() {
    this.customerdetailsobj.fullName = this.customerdetailsobj.name.firstName + " " + (this.customerdetailsobj.name.middleName ?? '') + " " + this.customerdetailsobj.name.lastName;
  }

  public async onVerificationCustomerSubmit(form: NgForm, action: boolean) {
    try {
      if (form.valid) {
        this.spinnerService.show();
        this.setExtraFields();
        let messageType: string = "";
        if (!this.isImgselectedProfile && !this.iseditcustomers) {
          this.profileImageErrorFlag = true;
          return;
        }
        else
          this.profileImageErrorFlag = false;


        if (!this.isImgselectedPhotoIdent && !this.iseditcustomers) {
          this.photoIdentityErrorFlag = true;
          return;
        }
        else
          this.photoIdentityErrorFlag = false;

        if (!this.isImgselectedBusiness && !this.iseditcustomers) {
          this.businessIdentityErrorFlag = true;
          return;
        }
        else
          this.businessIdentityErrorFlag = false;

        this.customerdetailsobj.countryCode = this.selectedCountry.iso2;
        if (!this.insertFlag) {
          let fetchCustomerObj = { ...this.customerdetailsobj }
          let response = await this.customerService.updateCustomer(this.customerdetailsobj);
          if (response) {
            if (this.currentFile) {
              for (let index = 0; index < this.fileUploadItems.length; index++) {
                const element = this.fileUploadItems[index];
                await this.uploadFilesOnServer(element.file, element.type, fetchCustomerObj.id, index, form);
              }
            }
            this.utilityService.showNotification(`Customer updated successfully!`);
            if (action)
              this.isAddDialogopen = false;
            this.loadCustomers();
          }
          else
            this.utilityService.showNotification(`Customer not updated, Try again later!`, 'error');

        } else if (this.insertFlag) {
          if (this.profileImageErrorFlag == false && this.photoIdentityErrorFlag == false && this.businessIdentityErrorFlag == false) {
            let response = await this.customerService.insertCustomer(this.customerdetailsobj);
            if (response) {
              this.addUserForCustomer(response, this.customerdetailsobj);
              for (let index = 0; index < this.fileUploadItems.length; index++) {
                const element = this.fileUploadItems[index];
                await this.uploadFilesOnServer(element.file, element.type, response, index, form);

              }
              if (action) {
                messageType = ""
                this.isAddDialogopen = false;
                this.resetForm(form);
                this.loadCustomers();
                this.resetFormimg(form);
                this.utilityService.showNotification(`Customer registered successfully!`);
              }
              else {
                this.resetForm(form);
                this.resetFormimg(form);
              }
            }
            else
              this.utilityService.showNotification(`Something went wrong, Try again later!`, "error")
          }
        }
        this.spinnerService.hide();
        this.resetForm(form);
        this.resetFormimg(form);
      }
      else {
        Object.keys(form.controls).forEach(key => {
          form.controls[key].markAsTouched();
        });
      }
    } catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }

  public uploadFilesOnServer(file: File, type: string, ident: string, index: number, form: NgForm) {

    this.fileStoreService.postUploadFileDocument(file, type, ident, this.folderName).subscribe(
      (res: any) => {
        if (res.body?.statusCode == 200) {
          let response = res.body.value;
          this.setFileuploadResponse(response, type);
          if (index == this.fileUploadItems.length - 1) {
            this.utilityService.showNotification(`Customer have been Registered successfully!`);
            this.fileUploadItems = [];
            this.router.navigate(['login']);
          }
        }
      },
      (err: any) => {
        this.currentFile = null as any;
        console.error(err);
        this.utilityService.showNotification(`Something went wrong while uploading a file!`, "error")
      }
    );
  }

  public setFileuploadResponse(response: any, type: string) {
    if (type == FileStoreTypes.CustomerProfile) {
      if (this.profileImageErrorFlag)
        this.profileImageErrorFlag = false;
    }
    else if (type == FileStoreTypes.CustomerPhotoIdent) {
      if (this.photoIdentityErrorFlag)
        this.photoIdentityErrorFlag = false;
    }
    else {
      if (this.businessIdentityErrorFlag)
        this.businessIdentityErrorFlag = false;
    }
  }

  public async deleteCustomer() {
    this.alertDialogService.ConfirmYesNo("Are you sure you want to remove selected customer?", "Delete")
      .subscribe(async (res: any) => {
        this.mySelection = [];
        if (res.flag) {
          try {
            this.spinnerService.show();
            let res = await this.customerService.deleteCustomer(this.customerdetailsobj.id)
            if (res && res == 1) {
              await this.removeUser();
              this.loadCustomers();
              this.utilityService.showNotification(`Record deleted successfully!`)
              this.spinnerService.hide();
            }
            else {
              this.spinnerService.hide();
              this.alertDialogService.show(`Something went wrong, Try again later!`);
            }
          } catch (error: any) {
            console.error(error);
            this.spinnerService.hide();
            this.alertDialogService.show('Customer not remove, Try again later!');
          }
        }
      });
  }

  public async removeUser() {
    try {
      var userRes = await this.accountService.removeUser(this.customerdetailsobj.email);
      if (userRes && userRes == 'Success!')
        this.utilityService.showNotification('User removed successfully!');
      else
        this.utilityService.showNotification('User not remove, Please contact administrator!', 'error');
    } catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show('User not remove, Please contact administrator!');
    }
  }
  //#endregion 

  //#region Update Customer

  public openUpdateCustomerDialog(): void {
    this.iseditcustomers = true
    this.isAddDialogopen = true;
    this.showUploadProfile = false;
    this.showUploadIdent = false;
    this.showUploadBusiness = false;

    this.selectedCountry = this.countryItems.find((c) => c.name == this.customerdetailsobj.address.country);
    let valueCountryExist = this.countryItems.filter((s: any) => {
      return s.name === this.customerdetailsobj.address.country;
    });
    if (valueCountryExist !== undefined && valueCountryExist !== null && valueCountryExist.length > 0) {
      this.getStatesByCountryCode(valueCountryExist[0].iso2);
      setTimeout(() => {
        let valueStateExist = this.stateItems.filter((s: any) => {
          return s.name === this.customerdetailsobj.address.state;
        });
        if (valueStateExist !== undefined && valueStateExist !== null && valueStateExist.length > 0)
          this.getCityData(valueCountryExist[0], valueStateExist[0].state_Code);
      }, 200);
    }

    this.customerdetailsobj.birthDate = this.getValidBirthDate(this.customerdetailsobj.birthDate);
    this.selectedSellerItems = { text: this.customerdetailsobj.seller.name, value: this.customerdetailsobj.id };
  }
  //#endregion
}