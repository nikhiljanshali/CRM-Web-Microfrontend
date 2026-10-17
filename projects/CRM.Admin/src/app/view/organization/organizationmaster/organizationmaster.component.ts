import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { DataResult, GroupDescriptor, process } from '@progress/kendo-data-query';
import { City, Country, GridDetailConfig, OrganizationSearchCriteria, State } from 'common/businessobjects';
import { fxCredential, GridMasterConfig, Organization } from 'common/entities';
import { GridConfig } from 'common/entities/configs/gridconfig';
import { AppPreloadService, CommonService, ConfigService, GridPropertiesService, listAddressTypeItems, listBusinessTypeItems, listMembershipItems, listOrgTypeItems, listOriginItems, OrganizationService, UtilityService } from 'common/services';
import { AlertdialogService } from 'common/views';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-organizationmaster',
  templateUrl: './organizationmaster.component.html',
})

export class OrganizationmasterComponent implements OnInit {

  public groups: GroupDescriptor[] = [];
  public pageSize = 26;
  public skip = 0
  public fields!: GridDetailConfig[];
  public gridView!: DataResult;
  public isRegOrganization: boolean = false;
  public filterFlag = true;
  public selectableSettings: SelectableSettings = {
    mode: 'single',
  };
  public openedConfirmationOrganizationDetails = false;
  public skeletonArray = new Array(18);
  public mySelection: string[] = [];

  // CRUD Organization
  public organizationObj: Organization = new Organization();
  public listOriginItems = listOriginItems
  public listAddressTypeItems = listAddressTypeItems
  public listOrgTypeItems = listOrgTypeItems
  public listBusinessTypeItems = listBusinessTypeItems
  public listMembershipItems = listMembershipItems
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
  public insertFlag: boolean = true;
  public openedDelete: boolean = false;
  public mobileMask = '(999) 000-00-00-00';
  public phoneMask = '(9999) 000-00-00';
  public faxMask = '(999) 000-0000';

  // Filter Organization
  public organizationCriteria: OrganizationSearchCriteria = new OrganizationSearchCriteria();

  // Grid Configuration
  public isGridConfig: boolean = false;
  private fxCredential!: fxCredential;
  public gridConfig!: GridConfig;
  public gridMasterConfigResponse!: GridMasterConfig;

  constructor(
    private router: Router,
    private gridPropertiesService: GridPropertiesService,
    private commonService: CommonService,
    public utilityService: UtilityService,
    private organizationService: OrganizationService,
    private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService,
    private configService: ConfigService,
    private appPreloadService: AppPreloadService) { }

  async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  public async defaultMethodsLoad() {
    this.fxCredential = await this.appPreloadService.fetchFxCredentials();
    if (!this.fxCredential)
      this.router.navigate(["login"]);
    await this.getGridConfiguration();
    await this.getCountryData();
    await this.loadOrganization();
    this.utilityService.filterToggleSubject.subscribe(flag => {
      this.filterFlag = flag;
    });
  }

  public async getGridConfiguration() {
    try {
      this.spinnerService.show();
      this.gridConfig = await this.configService.getGridConfig(this.fxCredential.id, "Organization", "OrganizationGrid");
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
        this.gridMasterConfigResponse = await this.configService.getMasterGridConfig("Organization", "OrganizationGrid");
        if (this.gridMasterConfigResponse)
          this.fields = this.gridMasterConfigResponse.gridDetail;
        else
          this.fields = await this.gridPropertiesService.getOrganizationGrid();
      }
      this.spinnerService.hide();
    } catch (error: any) {
      this.alertDialogService.show(error.error)
      this.spinnerService.hide();
    }
  }

  //#region List Organization
  public async loadOrganization() {
    try {
      this.spinnerService.show();
      let org: any = await this.organizationService.getOrganizations(this.organizationCriteria, this.skip, this.pageSize);
      this.gridView = process(org.organizations, { group: this.groups });
      this.gridView.total = org.totalCount;
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.alertDialogService.show(error.error)
      this.spinnerService.hide();
    }
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
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }

  public groupChange(groups: GroupDescriptor[]): void {
    try {
      this.groups = groups;
      this.loadOrganization();
    }
    catch (error: any) {
      this.alertDialogService.show(error.error)
    }
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadOrganization();
  }
  //#endregion List Organization

  //#region Filter Section
  public filterPartToggle() {
    this.utilityService.setfilterToggleValue(this.filterFlag);
  }

  public selectedRowChange(e: any) {
    this.insertFlag = false;
    this.organizationObj = new Organization();
    let value: any = e.selectedRows[0].dataItem
    this.organizationObj = { ...value };
  }

  public onFilterSubmit(form: NgForm) {
    this.skip = 0
    this.loadOrganization()
  }

  public clearFilter(form: NgForm) {
    form.reset()
    this.organizationCriteria = new OrganizationSearchCriteria()
    this.loadOrganization()
  }
  //#endregion Filter Section

  //#region Organization Modal
  public openAddOrgDialog(): void {
    this.organizationObj = new Organization();
    this.insertFlag = true;
    this.isRegOrganization = true;
  }

  public openUpdateOrgDialog(): void {
    this.isRegOrganization = true;
    let valueCountryExist = this.countryItems.filter((s: any) => {
      return s.name === this.organizationObj.address.country
    })
    if (valueCountryExist !== undefined && valueCountryExist !== null && valueCountryExist.length > 0) {
      this.getStatesByCountryCode(valueCountryExist[0].iso2);
      setTimeout(() => {
        let valueStateExist = this.stateItems.filter((s: any) => {
          return s.name === this.organizationObj.address.state
        });
        if (valueStateExist !== undefined && valueStateExist !== null && valueStateExist.length > 0) {
          this.getCityData(valueCountryExist[0], valueStateExist[0].state_Code)
        }
      }, 200);
    }
  }

  public closeRegOrganDialog(form: NgForm): void {
    this.isRegOrganization = false;
    this.mySelection = [];
    this.resetForm(form);
  }

  public async onOrgSubmit(form: NgForm, action: boolean) {
    try {
      if (form.valid) {
        this.spinnerService.show();
        let messageType: string = "";
        let response: any;
        if (!this.insertFlag) {
          messageType = "updated";
          response = await this.organizationService.organizationUpdate(this.organizationObj);
        }
        else {
          messageType = "registered";
          response = await this.organizationService.organizationRequest(this.organizationObj);
        }

        if (response) {
          this.loadOrganization();
          this.mySelection = [];
          this.spinnerService.hide();
          if (action)
            this.isRegOrganization = false;
          this.resetForm(form);
          this.utilityService.showNotification(`You have been ${messageType} successfully!`)
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

  public resetForm(form?: NgForm) {
    this.organizationObj = new Organization();
    this.insertFlag = true;
    form?.reset();
  }

  public openDeleteDialog() {
    try {
      // Note: Need to check employee list zero for respective Organization
      this.alertDialogService.ConfirmYesNo("Are you sure you want to delete?", "Delete")
        .subscribe(async (res: any) => {
          this.mySelection = [];
          if (res.flag) {
            this.spinnerService.show();
            let responseDelete = await this.organizationService.deleteOrganization(this.organizationObj.id)
            if (responseDelete !== undefined && responseDelete !== null) {
              this.loadOrganization();
              this.spinnerService.hide();
              this.insertFlag = true;
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
  //#endregion Organization Modal

  public openOrgRedirect(pagename: string) {
    this.router.navigate(["/organization/" + pagename, this.organizationObj.id]);
  }

  public openGridConfigDialog(): void {
    this.isGridConfig = true;
  }

  public async setNewGridConfig(gridConfig: GridConfig) {
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

}