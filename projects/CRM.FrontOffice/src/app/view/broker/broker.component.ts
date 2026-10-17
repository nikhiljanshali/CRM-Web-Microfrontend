import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { DataResult, GroupDescriptor, process } from '@progress/kendo-data-query';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertdialogService } from 'shared/views';
import { BrokerResponse, BrokerSearchCriteria } from '../../businessobjects';
import { Broker } from '../../entities';
import { BrokerService, GridPropertiesService } from '../../services';
import { City, Country, GridDetailConfig, State } from 'shared/businessobjects';
import { CommonService, listAddressTypeItems, UtilityService } from 'shared/services';

@Component({
  selector: 'app-broker',
  templateUrl: './broker.component.html'
})

export class BrokerComponent implements OnInit {

  public groups: GroupDescriptor[] = [];
  public pageSize = 25;
  public skip = 0
  public fields!: GridDetailConfig[];
  public gridView!: DataResult;
  public isReg: boolean = false;
  public filterFlag = true;
  public selectableSettings: SelectableSettings = {
    mode: 'single',
  };
  public openedConfirmationDetails = false;
  public skeletonArray = new Array(18);
  public mySelection: string[] = [];
  public listAddressTypeItems = listAddressTypeItems

  //GeoLocation
  public countryItems!: Country[];
  public selectedCountry: any;
  public stateItems!: State[];
  public selectedState: any;
  public cityItems!: City[];
  public selectedCity: any;

  // CRUD   
  public brokerObj: Broker = new Broker();
  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains'
  };
  public insertFlag: boolean = true;
  public openedDelete: boolean = false;
  public mobileMask = '(999) 000-00-00-00';

  // Filter
  public brokerCriteria: BrokerSearchCriteria = new BrokerSearchCriteria();

  constructor(
    private gridPropertiesService: GridPropertiesService,
    public utilityService: UtilityService,
    private brokerService: BrokerService,
    private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService,
    private commonService: CommonService,
  ) { }

  async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  public async defaultMethodsLoad() {
    this.fields = await this.gridPropertiesService.getBrokerGrid();
    await this.getCountryData();
    await this.loadData();


    this.utilityService.filterToggleSubject.subscribe(flag => {
      this.filterFlag = flag;
    });
  }

  //#region GeoLocation Detail
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
  //#endregion GeoLocation Detail 

  //#region List 
  public async loadData() {
    try {
      let response: BrokerResponse = await this.brokerService.getBrokerNames(this.brokerCriteria, this.skip, this.pageSize);
      this.gridView = process(response.broker, { group: this.groups });
      this.gridView.total = response.totalCount;
    }
    catch (error: any) {
      console.error(error);
      this.alertDialogService.show(error.error)
    }
  }

  public groupChange(groups: GroupDescriptor[]): void {
    try {
      this.groups = groups;
      this.loadData();
    }
    catch (error: any) {
      console.error(error);
      this.alertDialogService.show(error.error)
    }
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadData();
  }
  //#endregion List 

  //#region Filter Section
  public filterPartToggle() {
    this.utilityService.setfilterToggleValue(this.filterFlag);
  }

  public selectedRowChange(e: any) {
    this.insertFlag = false;
    this.brokerObj = new Broker();
    let value: any = e.selectedRows[0].dataItem
    this.brokerObj = { ...value };
  }

  public onFilterSubmit(form: NgForm) {
    this.skip = 0
    this.loadData()
  }

  public clearFilter(form: NgForm) {
    form.reset()
    this.brokerCriteria = new BrokerSearchCriteria()
    this.loadData()
  }
  //#endregion Filter Section

  //#region Modal
  public openAddDialog(): void {
    this.brokerObj = new Broker();
    this.insertFlag = true;
    this.isReg = true;
  }

  public openUpdateDialog(): void {
    this.isReg = true;
    let valueCountryExist = this.countryItems.filter((s: any) => {
      return s.name === this.brokerObj.address.country;
    });
    if (valueCountryExist !== undefined && valueCountryExist !== null && valueCountryExist.length > 0) {
      this.getStatesByCountryCode(valueCountryExist[0].iso2);
      setTimeout(() => {
        let valueStateExist = this.stateItems.filter((s: any) => {
          return s.name === this.brokerObj.address.state;
        });
        if (valueStateExist !== undefined && valueStateExist !== null && valueStateExist.length > 0)
          this.getCityData(valueCountryExist[0], valueStateExist[0].state_Code);
      }, 200);
    }
  }

  public closeDialog(form: NgForm): void {
    this.isReg = false;
    this.mySelection = [];
    this.resetForm(form);
  }

  public async onSubmit(form: NgForm, action: boolean) {
    try {
      if (form.valid) {
        this.spinnerService.show();
        let messageType: string = "";
        let response: any;
        if (!action) {
          this.insertFlag = true;
          this.brokerObj.id = ""
        }

        if (!this.insertFlag) {
          messageType = "updated";
          response = await this.brokerService.Update(this.brokerObj);
        }
        else {
          messageType = "inserted";
          response = await this.brokerService.Insert(this.brokerObj);
        }

        if (response) {
          this.loadData();
          this.mySelection = [];
          this.spinnerService.hide();
          if (action)
            this.isReg = false;
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
    catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public resetForm(form?: NgForm) {
    this.brokerObj = new Broker();
    this.insertFlag = true;
    form?.reset();
    this.brokerObj.mobileNo = '';
  }

  public openDeleteDialog() {
    try {
      this.alertDialogService.ConfirmYesNo("Are you sure you want to delete?", "Delete")
        .subscribe(async (res: any) => {
          this.mySelection = [];
          if (res.flag) {
            this.spinnerService.show();
            let responseDelete = await this.brokerService.delete(this.brokerObj.id)
            if (responseDelete !== undefined && responseDelete !== null) {
              this.loadData();
              this.spinnerService.hide();
              this.insertFlag = true;
              this.utilityService.showNotification(`You have been deleted successfully!`)
            }
          }
        })
    }
    catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }
  //#endregion Modal

}