import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { NotificationService } from '@progress/kendo-angular-notification';
import { City, Country, State } from 'common/businessobjects';
import { Branch, Department, Organization } from 'common/entities';
import { CommonService, listAddressTypeItems, listOriginItems, OrganizationService, UtilityService } from 'common/services';
import { AlertdialogService } from 'common/views';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-organizationdetails',
  templateUrl: './organizationdetails.component.html',
  styleUrls: ['./organizationdetails.component.css']
})

export class OrganizationdetailsComponent implements OnInit {

  public mobileMask = '(999) 000-00-00-00';
  public phoneMask = '(9999) 000-00-00';

  // Fetch Organization Details
  public organizationId!: string;
  public organizationData: Organization = new Organization();

  // Branch
  public branchObj: Branch = new Branch();
  public isAddBranch: boolean = false;
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
  public listAddressTypeItems = listAddressTypeItems;
  public faxMask = '(999) 000-0000';

  // Department
  public isAddDepartment: boolean = false;
  public listOriginItems = listOriginItems;
  public departmentObj: Department = new Department();


  //Dept Permission
  public isPermission: boolean = false;
  public pageComeFromPermission!: string
  public deptPermi!: Department;
  public modalTitle!: string;
  //

  constructor(public router: Router,
    public route: ActivatedRoute,
    private organizationService: OrganizationService,
    private commonService: CommonService,
    public utilityService: UtilityService,
    public notificationService: NotificationService,
    private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService) { }

  async ngOnInit() {
    await this.defaultMethods()
  }

  public async defaultMethods() {
    this.spinnerService.show();
    await this.loadOrganizationDetail();
    await this.getCountryData()
  }

  //#region Branch
  public async loadOrganizationDetail() {
    try {
      this.organizationId = this.route.snapshot.params.id
      this.organizationData = await this.organizationService.getOrganizationById(this.organizationId)
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  private async getCountryData() {
    try {
      this.countryItems = await this.commonService.getCountries();
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }

  public async onCountryChange(e: string) {
    try {
      this.spinnerService.show();
      this.selectedCountry = this.countryItems.find(c => c.name == e);
      await this.getStatesByCountryCode(this.selectedCountry.iso2)
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }

  private async getStatesByCountryCode(country_code: string) {
    try {
      this.stateItems = await this.commonService.getStatesByCountryCode(country_code)
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }

  public async onStateChange(e: string) {
    try {
      this.spinnerService.show();
      this.selectedState = this.stateItems.find((c: State) => c.name == e);
      await this.getCityData(this.selectedCountry, this.selectedState.state_Code)
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }

  private async getCityData(selectedCountry: Country, state_code: string) {
    try {
      this.cityItems = await this.commonService.getCitiesByCountryCodeandStateCode(selectedCountry.iso2, state_code)
    }
    catch (error: any) {
      this.spinnerService.hide();
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

  public openAddBranchDialog(): void {
    this.branchObj = new Branch();
    this.isAddBranch = true;
  }

  public closeAddBranchDialog(): void {
    this.isAddBranch = false;
  }

  public updateBranch(item: Branch): void {
    this.branchObj = { ...item }
    this.isAddBranch = true;
  }

  public async onBranchSubmit(form: NgForm, flag: boolean) {
    try {
      if (form.valid) {
        this.spinnerService.show();
        let messageType: string = "";
        let response: string;
        if (this.branchObj.id) {
          messageType = "updated";
          response = await this.organizationService.branchUpdate(this.organizationData.id, this.branchObj);
        }
        else {
          messageType = "registered";
          response = await this.organizationService.branchInsert(this.organizationData.id, this.branchObj);
        }

        if (response) {
          if (flag)
            this.isAddBranch = false;
          await this.loadOrganizationDetail();
          this.spinnerService.hide();
          this.utilityService.showNotification(`Your branch has been ${messageType} successfully!`)
          this.resetBranchForm(form);
        }
      }
      else {
        Object.keys(form.controls).forEach(key => {
          form.controls[key].markAsTouched();
        });
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }

  }

  public resetBranchForm(form?: NgForm) {
    this.branchObj = new Branch();
    form?.reset();
  }


  public deleteBranch(item: Branch): void {
    try {
      this.alertDialogService.ConfirmYesNo("Are you sure you want to delete?", "Delete")
        .subscribe(async (res: any) => {
          if (res.flag) {
            this.spinnerService.show();
            let responseDelete = await this.organizationService.deleteBranch(this.organizationData.id, item.id)
            if (responseDelete !== undefined && responseDelete !== null) {
              this.loadOrganizationDetail();
              this.spinnerService.hide();
              this.utilityService.showNotification(`You have been deleted successfully!`)
            }
          }
        })
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }
  //#endregion Branch

  //#region  Department
  public openAddDepartmentDialog(): void {
    this.departmentObj = new Department()
    this.isAddDepartment = true;
  }

  public closeAddDepartmentDialog(): void {
    this.isAddDepartment = false;
  }

  public updateDepartment(item: Department): void {
    this.departmentObj = { ...item }
    this.isAddDepartment = true;
  }

  public async onDepartmentSubmit(form: NgForm, flag: boolean) {
    try {
      if (form.valid) {
        this.spinnerService.show();
        let messageType: string = "";
        let response: string;
        if (this.departmentObj.id) {
          messageType = "updated";
          response = await this.organizationService.departmentUpdate(this.organizationData.id, this.departmentObj);
        }
        else {
          messageType = "registered";
          response = await this.organizationService.departmentInsert(this.organizationData.id, this.departmentObj);
        }

        if (response) {
          if (flag)
            this.isAddDepartment = false;
          await this.loadOrganizationDetail();
          this.spinnerService.hide();
          this.utilityService.showNotification(`Your department has been ${messageType} successfully!`)
          this.resetDepartmentForm(form);
        }
      }
      else {
        Object.keys(form.controls).forEach(key => {
          form.controls[key].markAsTouched();
        });
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }

  }

  public resetDepartmentForm(form?: NgForm) {
    this.departmentObj = new Department();
    form?.reset();
  }

  public deleteDepartment(item: Department): void {
    try {
      this.alertDialogService.ConfirmYesNo("Are you sure you want to delete?", "Delete")
        .subscribe(async (res: any) => {
          if (res.flag) {
            this.spinnerService.show();
            let responseDelete = await this.organizationService.deleteDepartment(this.organizationData.id, item.id)
            if (responseDelete !== undefined && responseDelete !== null) {
              this.loadOrganizationDetail();
              this.spinnerService.hide();
              this.utilityService.showNotification(`You have been deleted successfully!`)
            }
          }
        })
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }
  //#endregion Department

  //region SetPermission Department
  public setPermission(department: Department) {
    this.deptPermi = department;
    this.pageComeFromPermission = "Department";
    this.isPermission = true;
    this.modalTitle = department.name
  }
  //#endregion
}