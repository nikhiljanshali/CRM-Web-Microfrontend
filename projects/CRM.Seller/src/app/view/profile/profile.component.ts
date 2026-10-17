import { Component, OnInit } from '@angular/core';
import { Employee } from 'common/businessobjects/employee/employee';
import { EmployeeService, OrganizationService, CommonService, UtilityService, listOriginItems, listBranchItems, listAddressTypeItems, listSocialMediaProviderItems } from 'common/services';
import { AlertdialogService } from 'common/views';
import { NgForm } from '@angular/forms';
import { OrganizationDNorm, BranchDNorm, Country, City, State, SocialMediaProvider, SocialMedia, CommonResponse, MarketingEmail } from 'common/businessobjects';
import { Department, fxCredential } from 'common/entities';
import { NgxSpinnerService } from 'ngx-spinner';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import * as moment from 'moment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  public isRegEmployee: boolean = false;
  public mySelection: string[] = [];

  public listOriginItems = listOriginItems;
  public listAddressTypeItems = listAddressTypeItems;
  public listBranchItems = listBranchItems;
  public listSocialMediaProviderItems: string[] = [];
  public isMessagingFlag: boolean = false;
  public editSocialMediaId: string = '';
  public socialMediaObj: SocialMedia = new SocialMedia();
  public isSocialMediaUpdateFlag: boolean = false;

  // CRUD Employee
  public employeeObj: Employee = new Employee();
  public employeeData: Employee = new Employee();
  public branchDNormItems!: BranchDNorm[];
  public organizationDNormItems!: OrganizationDNorm[];

  public listOrganizationDNormItems: Array<{ text: string; value: string }> = [];
  public listBranchDNormItems: Array<{ text: string; value: string }> = [];
  public listDepartmentItems: Array<{ text: string; value: string }> = [];
  public selectedOrganizationDNormItems?: { text: string; value: string };
  public selectedBranchDNormItems?: { text: string, value: string };
  public selectedSocialMediaProviderItem: any;

  public deptItems!: Department[];
  public selectedDeptItems?: { text: string, value: string };

  public selectedCountry: any;
  public cityItems!: City[];
  public stateItems!: State[];
  public countryItems!: Country[];
  public selectedState: any;
  public selectedCity: any;
  public socialMediaProviderItems!: SocialMediaProvider[];
  public mobileMask = '(999) 000-00-00';

  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  public marketingEmail: MarketingEmail = new MarketingEmail();
  public tempMarketingEmail: MarketingEmail = new MarketingEmail();

  public insertFlag: boolean = false;
  public flag!: string;
  public isMarketingEditable = false;

  public fxCredentials!: fxCredential;

  constructor(private employeeService: EmployeeService,
    private alertDialogService: AlertdialogService,
    private organizationService: OrganizationService,
    private spinnerService: NgxSpinnerService,
    private commonService: CommonService,
    public utilityService: UtilityService,
  ) { }

  public async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  //#region Init Data
  async defaultMethodsLoad() {
    this.spinnerService.show();
    this.fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;
    await this.getOrganizationDNormData();
    await this.getCountryData();
    await this.getEmployeeData();
    this.getSocialMediaProviderData();
  }

  private async getOrganizationDNormData() {
    try {
      this.organizationDNormItems = await this.organizationService.getOrganizationDNorm();

      let organizationId = this.fxCredentials.organizationId;
      let organization = this.organizationDNormItems.find(z => z.id == organizationId) ?? new OrganizationDNorm();

      this.organizationDNormItems = [{ ...organization }];

      await this.setLoginOrganization();
    }
    catch (error: any) {
      console.error(error);
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

  public async getEmployeeData() {
    try {
      this.employeeObj = await this.employeeService.getEmployeeById(this.fxCredentials.id);
      this.employeeData = JSON.parse(JSON.stringify(this.employeeObj));

      this.marketingEmail = { ...this.employeeData.marketingEmail };
      this.tempMarketingEmail = { ...this.employeeData.marketingEmail };

      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  private getSocialMediaProviderData() {
    this.socialMediaProviderItems = [];
    this.listSocialMediaProviderItems = [];
    this.socialMediaProviderItems = listSocialMediaProviderItems;
    this.socialMediaProviderItems.forEach((z) => {
      this.listSocialMediaProviderItems.push(z.providerName);
    });
  }
  //#endregion

  //#region OnChange Functions
  public openUpdateEmpDialog(): void {
    this.isRegEmployee = true;
    let valueCountryExist = this.countryItems.filter((s: any) => {
      return s.name === this.employeeObj.address.country;
    });

    if (valueCountryExist !== undefined && valueCountryExist !== null && valueCountryExist.length > 0) {
      this.getStatesByCountryCode(valueCountryExist[0].iso2);
      setTimeout(() => {
        let valueStateExist = this.stateItems.filter((s: any) => {
          return s.name === this.employeeObj.address.state;
        });
        if (valueStateExist !== undefined && valueStateExist !== null && valueStateExist.length > 0)
          this.getCityData(valueCountryExist[0], valueStateExist[0].state_Code);
      }, 200);
    }
    this.selectedOrganizationDNormItems = { text: this.employeeObj.organization.name, value: this.employeeObj.organization.id };
    this.selectedBranchDNormItems = { text: this.employeeObj.branch.name, value: this.employeeObj.branch.name };
    this.selectedDeptItems = { text: this.employeeObj.department, value: this.employeeObj.departmentId };

    this.employeeObj.joiningDate = this.getValidJoiningDate(this.employeeObj.joiningDate);
    this.employeeObj.socialMedias.forEach(z => {
      this.listSocialMediaProviderItems = this.listSocialMediaProviderItems.filter(a => a != z.provider.providerName);
    });
  }

  public getValidJoiningDate(date: any): Date {
    const day = moment(date).date();
    const month = moment(date).month();
    const year = moment(date).year();
    var newDate = new Date(year, month, day);
    return newDate;
  }

  private async getCountryData() {
    try {
      this.countryItems = await this.commonService.getCountries();
    }
    catch (error: any) {
      this.alertDialogService.show(error.error);
    }
  }

  public closeRegEmpDialog(form: NgForm): void {
    this.isRegEmployee = false;
  }

  public async setLoginOrganization() {
    let organization = this.organizationDNormItems[0];
    this.selectedOrganizationDNormItems = { text: organization.name, value: organization.id };
    this.listOrganizationDNormItems.push(this.selectedOrganizationDNormItems);

    await this.onOrganizationDNormChange(this.selectedOrganizationDNormItems);
  }

  public onDepartmentChange(e: any) {
    const dept = this.deptItems.find(z => z.id == e.value);
    if (dept != undefined && dept != null) {
      this.employeeObj.department = dept.name ?? '';
      this.employeeObj.departmentId = dept.id ?? '';
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

  public onCountryChange(e: string): void {
    try {
      this.employeeObj.address.state = null as any;
      this.employeeObj.address.city = null as any;
      this.spinnerService.show()
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

  public async onOrganizationDNormChange(e: any, isEdit: boolean = false) {
    const orgDNorm = this.organizationDNormItems.find(z => z.id == e.value);
    if (orgDNorm != undefined && orgDNorm != null)
      this.employeeObj.organization = { ...orgDNorm };

    this.spinnerService.show();
    await this.getBranchDNormByOrgId(this.employeeObj.organization.id, isEdit);
    await this.getDepartmentsByOrgId(this.employeeObj.organization.id, isEdit);
  }

  public onBranchDNormChange(e: any) {
    this.selectedDeptItems = null as any;
    const branchDNorm = this.branchDNormItems.find(z => z.name == e.value);
    if (branchDNorm != undefined && branchDNorm != null) {
      this.employeeObj.branch = { ...branchDNorm };

      this.getDepartmentsByOrgId(this.employeeObj.organization.id);
    }
  }

  private async getDepartmentsByOrgId(id: string, isEdit: boolean = false) {
    try {

      this.deptItems = await this.organizationService.getDepartmentByOrganizationId(id);
      if (this.selectedBranchDNormItems && this.employeeObj.branch)
        this.deptItems = this.deptItems.filter(z => z.branchName == this.employeeObj.branch.name);

      if (!isEdit)
        this.selectedBranchDNormItems = { text: this.employeeObj.branch.name, value: this.employeeObj.branch.name };

      this.listDepartmentItems = [];
      this.deptItems.forEach(z => { this.listDepartmentItems.push({ text: z.name, value: z.id }); });
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  private async getBranchDNormByOrgId(id: string, isEdit: boolean = false) {
    try {
      this.branchDNormItems = await this.organizationService.getBranchDNormByOrganizationId(id);
      if (!isEdit)
        this.selectedDeptItems = { text: this.employeeObj.department, value: this.employeeObj.departmentId };

      this.listBranchDNormItems = [];
      this.branchDNormItems.forEach((z) => { this.listBranchDNormItems.push({ text: z.name, value: z.name }); });
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public enableMarketingSaveChanges() {
    this.isMarketingEditable = true;
  }

  public disabledMarketingConfiguration() {
    this.isMarketingEditable = false;
    this.marketingEmail = this.tempMarketingEmail;
  }
  //#endregion

  //#region Emp CRUD
  public async onEmpSubmit(form: NgForm, action: boolean) {
    try {
      if (form.valid) {
        this.spinnerService.show();
        let messageType: string = '';
        let response: CommonResponse;
        this.setExtraFields();

        if (!this.insertFlag) {
          messageType = 'updated';
          response = await this.employeeService.employeeUpdate(this.employeeObj);
          this.employeeData = JSON.parse(JSON.stringify(this.employeeObj));
        }
        else {
          messageType = 'registered';
          response = await this.employeeService.employeeRequest(this.employeeObj);
        }

        if (response) {
          this.spinnerService.hide();
          if (response.isSuccess) {
            this.mySelection = [];
            if (action)
              this.isRegEmployee = false;
            this.utilityService.showNotification(`You have been ${messageType} successfully!`);
          }
          else {
            this.alertDialogService.show(response.message);
            if (response?.errorMessage?.length > 0)
              console.error(response.errorMessage);
          }
        }
      }
      else {
        this.spinnerService.hide();
        Object.keys(form.controls).forEach((key) => {
          form.controls[key].markAsTouched();
        });
      }
    }

    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  private setExtraFields() {
    this.employeeObj.joiningDate = this.setUTCDateFilter(this.employeeObj.joiningDate);
    this.employeeObj.fullName = this.employeeObj.name.firstName + ' ' + (this.employeeObj.name.middleName ?? '') + ' ' + this.employeeObj.name.lastName;
  }

  private setUTCDateFilter(date: Date) {
    var newDate = moment(date.setHours(5)).toDate();
    newDate = moment(newDate.setMinutes(30)).toDate();
    return moment(newDate).toDate();
  }
  //#endregion

  //#region SocialMedia CRUD
  public onSocialMediaProviderChange(e: any) {
    let socialMediaProvider = this.socialMediaProviderItems.find(z => z.providerName == e);
    if (socialMediaProvider?.mediaType == 'Messaging' || socialMediaProvider?.mediaType == '3')
      this.isMessagingFlag = true;
    else
      this.isMessagingFlag = false;
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

  public onSocialMediaUpdate() {
    let socialMediaProvider = this.socialMediaProviderItems.find((z) => z.providerName == this.selectedSocialMediaProviderItem);
    this.employeeObj.socialMedias.forEach((z) => {
      if (z.provider.providerName == this.editSocialMediaId) {
        z.provider = socialMediaProvider ?? new SocialMediaProvider();
        z.mobileNumber = this.socialMediaObj.mobileNumber;
        z.profileName = this.socialMediaObj.profileName;
      }
    });
  }

  public onSocialMediaDelete(e: any) {
    this.alertDialogService.ConfirmYesNo('Are you sure you want to delete?', 'Delete')
      .subscribe(async (res: any) => {
        if (res.flag)
          this.employeeObj.socialMedias = this.employeeObj.socialMedias.filter((z) => z.provider.providerName != e.provider.providerName);
      });
  }

  public onSocialMediaSubmit() {
    let socialMediaProvider = this.socialMediaProviderItems.find((z) => z.providerName == this.selectedSocialMediaProviderItem);
    let socialMedia: SocialMedia = new SocialMedia();
    socialMedia.provider = socialMediaProvider ?? new SocialMediaProvider();
    socialMedia.mobileNumber = this.socialMediaObj.mobileNumber;
    socialMedia.profileName = this.socialMediaObj.profileName;
    this.employeeObj.socialMedias.push(socialMedia);
    this.listSocialMediaProviderItems = this.listSocialMediaProviderItems.filter((z) => z != this.selectedSocialMediaProviderItem);
    this.socialMediaObj.mobileNumber = '';
    this.socialMediaObj.profileName = '';
    this.selectedSocialMediaProviderItem = '';
  }
  //#endregion

  public async submitMarketingEmail(form: NgForm) {
    try {
      if (form.valid) {
        this.spinnerService.show();
        let message = '';
        let fetchMarketingEmail = Object.assign({}, this.marketingEmail)
        if (Object.entries(fetchMarketingEmail).toString() !== Object.entries(this.tempMarketingEmail).toString()) {
          let responseUpdate = await this.employeeService.updateMarketingEmail(this.marketingEmail, this.fxCredentials.id);
          if (responseUpdate) {
            message = "Marketing email updated successfully!";
            this.tempMarketingEmail = { ...this.marketingEmail };
            this.isMarketingEditable = false;
          }
          else
            message = "Something went wrong while updating marketing email";
        }
        else {
          message = "Marketing email updated successfully!";
          this.isMarketingEditable = false;
        }

        this.spinnerService.hide();
        this.utilityService.showNotification(message)
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }
}

