import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { NotificationService } from '@progress/kendo-angular-notification';
import { City, Country, SocialMedia, State } from 'shared/businessobjects';
import { CommonService, FileStoreService, listBusinessTypeItems, UtilityService } from 'shared/services';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { RegisterService } from '../../../services';
import { AlertdialogService } from 'shared/views';
import { RegisterCustomer } from '../../../entities';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit {
  // InternationalphoneNumber
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.Belgium, CountryISO.Thailand, CountryISO.UnitedArabEmirates, CountryISO.UnitedStates];
  primaryMobileNo!: any;
  secondaryMobileNo!: any;
  businessMobile!: any;
  // basic registration field
  public registerCustomer: RegisterCustomer = new RegisterCustomer();
  public mobileMask = '(999) 000-00-00-00';
  public phoneMask = '(9999) 000-00-00';
  public faxMask = '(999) 000-0000';
  public websitePattern = "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
  public countryItems!: Country[];
  public selectedCountry: any;
  public stateItems!: State[];
  public selectedState: any;
  public cityItems!: City[];
  public selectedCity: any;
  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains'
  };
  // Disable future date for birthdate picker
  public disabledDates = (date: Date): boolean => {
    let todayDate = new Date();
    return (date > todayDate);
  };
  // BusinessType DropdownValue
  public listBusinessTypeItems = listBusinessTypeItems;
  // Designation DropdownValue
  public listDesignationItems: Array<string> = [
    "It",
    "Manager",
    "Other"
  ];
  // fileupload ViewChild
  @ViewChild('profileFileupload', { static: false }) ProfileFileupload!: ElementRef;
  @ViewChild('photoIdentityFileupload', { static: false }) PhotoIdentityFileupload!: ElementRef;
  @ViewChild('businessIndentityFileupload', { static: false }) BusinessIndentityFileupload!: ElementRef;
  // Files upload variables
  // ========
  public currentFile!: File;
  public profileImageFlag: boolean = false;
  public profileImageModel: any = undefined;
  public photoIdentityFlag: boolean = false;
  public photoIdentityModel: any = undefined;
  public businessIdentityFlag: boolean = false;
  public businessIdentityModel: any = undefined;
  // ===================
  //  Social Media
  public whatsAppNumber: string = '';
  public messengerLink: string = '';
  public skypeUserName: string = '';
  public snapChatUserName: string = '';
  public telegramUserName: string = '';
  public linkedInUserName: string = '';
  public folderName = "Registration";
  public fileUploadItems: Array<{ type: string, file: File }> = new Array<{ type: string, file: File }>();
  public profileImgExt: String[] = ['png', 'gif', 'jpeg', 'jpg'];
  public docProofExt: String[] = ['png', 'gif', 'jpeg', 'jpg', 'pdf'];

  constructor(private router: Router,
    public commonService: CommonService,
    private alertDialogService: AlertdialogService,
    public registerService: RegisterService,
    public utilityService: UtilityService,
    private notificationService: NotificationService,
    private fileStoreService: FileStoreService) { }

  async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  public async defaultMethodsLoad() {
    await this.getCountryData();
  }

  private async getCountryData() {
    try {
      this.countryItems = await this.commonService.getCountries();
    }
    catch (error: any) {
      this.alertDialogService.show(error.error)
    }
  }

  public async onCountryChange(e: string) {
    try {
      this.selectedCountry = this.countryItems.find(c => c.name == e);
      await this.getStatesByCountryCode(this.selectedCountry.iso2)
    }
    catch (error: any) {
      this.alertDialogService.show(error.error)
    }
  }

  private async getStatesByCountryCode(country_code: string) {
    try {
      this.stateItems = await this.commonService.getStatesByCountryCode(country_code)
    }
    catch (error: any) {
      this.alertDialogService.show(error.error)
    }
  }

  public async onStateChange(e: string) {
    try {
      this.selectedState = this.stateItems.find((c: State) => c.name == e);
      await this.getCityData(this.selectedCountry, this.selectedState.state_Code)
    }
    catch (error: any) {
      this.alertDialogService.show(error.error)
    }
  }

  private async getCityData(selectedCountry: Country, state_code: string) {
    try {
      this.cityItems = await this.commonService.getCitiesByCountryCodeandStateCode(selectedCountry.iso2, state_code)
    }
    catch (error: any) {
      this.alertDialogService.show(error.error)
    }
  }

  public onCityChange(e: string): void {
    try {
      this.selectedCity = this.cityItems.find((c: City) => c.name == e);
    }
    catch (error: any) {
      this.alertDialogService.show(error.error)
    }
  }

  public async onRegisterSubmit(form: NgForm) {
    try {
      if (form.valid) {
        if (this.profileImageModel == null || this.profileImageModel == undefined
          || this.profileImageModel == '') {
          this.profileImageFlag = true;
        }
        else {
          this.profileImageFlag = false;
        }

        if (this.photoIdentityModel == null || this.photoIdentityModel == undefined
          || this.photoIdentityModel == '') {
          this.photoIdentityFlag = true;
        }
        else {
          this.photoIdentityFlag = false;
        }
        if (this.businessIdentityModel == null || this.businessIdentityModel == undefined
          || this.businessIdentityModel == '') {
          this.businessIdentityFlag = true;
        }
        else {
          this.businessIdentityFlag = false;
        }

        if (this.profileImageFlag == false && this.photoIdentityFlag == false && this.businessIdentityFlag == false) {
          this.registerCustomer.fullName = this.registerCustomer.name.firstName + " " + this.registerCustomer.name.middleName + " " + this.registerCustomer.name.lastName;
          this.registerCustomer.countryCode = this.selectedCountry.iso2;
          this.registerCustomer.primaryMobile = this.primaryMobileNo.e164Number;
          this.registerCustomer.secondaryMobile = this.secondaryMobileNo.e164Number;
          this.registerCustomer.businessMobileNo = this.businessMobile.e164Number;
          this.registerCustomer.birthDate = this.utilityService.setUTCDateFilter(this.registerCustomer.birthDate);
          let socialMediaValues: SocialMedia[] = this.setSocialMediaResponse();
          this.registerCustomer.socialMedias = socialMediaValues;
          let response = await this.registerService.registerCustomer(this.registerCustomer);
          if (response) {
            for (let index = 0; index < this.fileUploadItems.length; index++) {
              const element = this.fileUploadItems[index];
              await this.uploadFilesOnServer(element.file, element.type, response, index, form);
            }
            // TODO : Once API Resolved with response then removed
            this.utilityService.showNotification(`You have been Registered successfully!`);
            this.resetForm(form);
            this.fileUploadItems = [];
            this.router.navigate(['login']);
          }
          else {
            this.utilityService.showNotification(`Something went wrong!`, "error")
          }
        }
      }
      else {
        Object.keys(form.controls).forEach(key => {
          form.controls[key].markAsTouched();
        });
      }
    } catch (error: any) {
      this.alertDialogService.show(error.error)
    }
  }

  public resetForm(form: NgForm) {
    form.reset();
    this.clearPhotoProfile(form);
    this.clearPhotoIdentity(form);
    this.clearBusinessIdentity(form);
  }

  public setSocialMediaResponse() {
    let customerSocialMedia: SocialMedia[] = [];
    if (this.whatsAppNumber)
      customerSocialMedia.push({ provider: { providerName: "Whatsapp", mediaType: "Messaging" }, profileName: "", mobileNumber: this.whatsAppNumber })

    if (this.messengerLink)
      customerSocialMedia.push({ provider: { providerName: "Facebook", mediaType: "Messaging" }, profileName: this.messengerLink, mobileNumber: "" })

    if (this.skypeUserName)
      customerSocialMedia.push({ provider: { providerName: "Skype", mediaType: "Messaging" }, profileName: this.skypeUserName, mobileNumber: "" })

    if (this.snapChatUserName)
      customerSocialMedia.push({ provider: { providerName: "SnapChat", mediaType: "Messaging" }, profileName: this.snapChatUserName, mobileNumber: "" })

    if (this.telegramUserName)
      customerSocialMedia.push({ provider: { providerName: "Telegram", mediaType: "Messaging" }, profileName: this.telegramUserName, mobileNumber: "" })

    if (this.linkedInUserName)
      customerSocialMedia.push({ provider: { providerName: "LinkedIn", mediaType: "Messaging" }, profileName: this.linkedInUserName, mobileNumber: "" })

    return customerSocialMedia;
  }

  public clearPhotoProfile(form: NgForm) {
    this.ProfileFileupload.nativeElement.value = "";
    this.profileImageModel = undefined;
    // form.value.profileImage = undefined;
    this.profileImageFlag = false;
  }

  public clearPhotoIdentity(form: NgForm) {
    this.PhotoIdentityFileupload.nativeElement.value = "";
    this.photoIdentityModel = undefined;
    // form.value.photoIdentity = undefined;
    this.photoIdentityFlag = false;
  }

  public clearBusinessIdentity(form: NgForm) {
    this.BusinessIndentityFileupload.nativeElement.value = "";
    this.businessIdentityModel = undefined;
    // form.value.businessIdentity = undefined;
    this.businessIdentityFlag = false;
  }

  public navigateBackward(): void {
    window.history.back();
  }

  private fileChecknPush(type: string) {
    if (this.fileUploadItems && this.fileUploadItems.length > 0) {
      let IsExistFile: any = this.fileUploadItems.find((item: any) => item.type.toLowerCase() == type.toLowerCase());
      if (IsExistFile)
        IsExistFile.file = this.currentFile;
      else
        this.fileUploadItems.push({ type: type, file: this.currentFile });
    }
    else
      this.fileUploadItems.push({ type: type, file: this.currentFile });

    if (type == "profile") {
      this.profileImageModel = this.currentFile;
      if (this.profileImageFlag)
        this.profileImageFlag = false;
    }
    else if (type == "photoIdentity") {
      this.photoIdentityModel = this.currentFile;
      if (this.photoIdentityFlag)
        this.photoIdentityFlag = false;
    }
    else if (type == "businessindentity") {
      this.businessIdentityModel = this.currentFile;
      if (this.businessIdentityFlag)
        this.businessIdentityFlag = false;
    }
  }

  public uploadFiles(form: NgForm, event: Event, type: string): void {
    let file!: any;
    const target = event.target as HTMLInputElement;

    if (target.files && target.files.length) {
      file = target.files[0];
    }
    this.currentFile = file;

    if (this.currentFile) {
      if (type.toLowerCase() == 'profile' && this.profileImgExt.includes(file.name.split(".").pop())) 
        this.fileChecknPush(type);
      else 
        this.ProfileFileupload.nativeElement.value = "";

      if (type == "photoIdentity" && this.docProofExt.includes(file.name.split(".").pop())) 
        this.fileChecknPush(type);
      else 
        this.PhotoIdentityFileupload.nativeElement.value = "";

      if (type == "businessindentity" && this.docProofExt.includes(file.name.split(".").pop())) 
        this.fileChecknPush(type);
      else 
        this.BusinessIndentityFileupload.nativeElement.value = "";
    }
  }

  public uploadFilesOnServer(file: File, type: string, ident: string, index: number, form: NgForm) {
    this.fileStoreService.postUploadFileDocument(file, type, ident, this.folderName).subscribe(
      (res: any) => {
        if (res.body?.statusCode == 200) {
          let response = res.body.value;
          this.setFileuploadResponse(response, type);
          // TODO : Once API Resolved with response then enable it.
          // if (index == this.fileUploadItems.length - 1) {
          //   this.resetForm(form);
          //   this.utilityService.showNotification(`You have been Registered successfully!`);
          //   this.fileUploadItems = [];
          //   this.router.navigate(['login']);
          // }
        }

      },
      (err: any) => {
        this.currentFile = null as any;
        this.utilityService.showNotification(`Something went wrong while uploading a file!`, "error")
      }
    );
  }

  public setFileuploadResponse(response: any, type: string) {
    if (type == "profile") {
      if (this.profileImageFlag)
        this.profileImageFlag = false;
    }
    else if (type == "photoIdentity") {
      if (this.photoIdentityFlag)
        this.photoIdentityFlag = false;
    }
    else {
      if (this.businessIdentityFlag)
        this.businessIdentityFlag = false;
    }
  }
}