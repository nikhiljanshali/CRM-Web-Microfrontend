import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { DataResult, GroupDescriptor, process } from '@progress/kendo-data-query';
import { City, Country, GridDetailConfig, Party, PartySearchCriteria, State } from 'common/businessobjects';
import { CommonService, listAddressTypeItems, listBusinessTypeItems, UtilityService, GridPropertiesService, listPartyTypeItems, PartyService } from 'common/services';
import { AlertdialogService } from 'common/views';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-party',
  templateUrl: './partymaster.component.html',
  styleUrls: ['./partymaster.component.css']
})

export class PartyMasterComponent implements OnInit {

  public groups: GroupDescriptor[] = [];
  public pageSize = 26;
  public skip = 0
  public fields!: GridDetailConfig[];
  public gridView!: DataResult;
  public isRegParty: boolean = false;
  public filterFlag = true;
  public selectableSettings: SelectableSettings = {
    mode: 'single',
  };
  public openedConfirmationPartyDetails = false;
  public skeletonArray = new Array(18);
  public mySelection: string[] = [];

  // CRUD Party   
  public partyObj: Party = new Party();
  public listBusinessTypeItems = listBusinessTypeItems
  public listPartyTypeItems = listPartyTypeItems
  public listAddressTypeItems = listAddressTypeItems
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
  public mobileMask = '(999) 000-00-00';
  public phoneMask = '(9999) 000-00-00';
  public faxMask = '(999) 000-0000';


  // Filter Party
  public partyCriteria: PartySearchCriteria = new PartySearchCriteria();

  constructor(
    private router: Router,
    private gridPropertiesService: GridPropertiesService,
    private commonService: CommonService,
    public utilityService: UtilityService,
    private partyService: PartyService,
    private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService,
  ) { }

  async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  async defaultMethodsLoad() {
    this.fields = await this.gridPropertiesService.getPartyGrid();
    await this.getCountryData();
    await this.loadParty();

    this.utilityService.filterToggleSubject.subscribe(flag => {
      this.filterFlag = flag;
    });
  }

  //#region List Party
  public async loadParty() {
    try {
      let parties: any = await this.partyService.getPartyNames(this.partyCriteria, this.skip, this.pageSize);
      this.gridView = process(parties.party, { group: this.groups });
      this.gridView.total = parties.totalCount;
    }
    catch (error: any) {
      this.alertDialogService.show(error.error)
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
      this.loadParty();
    }
    catch (error: any) {
      this.alertDialogService.show(error.error)
    }
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadParty();
  }
  //#endregion List Party

  //#region Filter Section
  public filterPartToggle() {
    this.utilityService.setfilterToggleValue(this.filterFlag);
  }

  public selectedRowChange(e: any) {
    this.insertFlag = false;
    this.partyObj = new Party();
    let value: any = e.selectedRows[0].dataItem
    this.partyObj = { ...value };
  }

  public onFilterSubmit(form: NgForm) {
    this.skip = 0
    this.loadParty()
  }

  public clearFilter(form: NgForm) {
    form.reset()
    this.partyCriteria = new PartySearchCriteria()
    this.loadParty()
  }
  //#endregion Filter Section

  //#region Party Modal
  public openAddPartyDialog(): void {
    this.partyObj = new Party();
    this.insertFlag = true;
    this.isRegParty = true;
  }

  public openUpdatePartyDialog(): void {
    this.isRegParty = true;
    let valueCountryExist = this.countryItems.filter((s: any) => {
      return s.name === this.partyObj.address.country
    })
    if (valueCountryExist !== undefined && valueCountryExist !== null && valueCountryExist.length > 0) {
      this.getStatesByCountryCode(valueCountryExist[0].iso2);
      setTimeout(() => {
        let valueStateExist = this.stateItems.filter((s: any) => {
          return s.name === this.partyObj.address.state
        });
        if (valueStateExist !== undefined && valueStateExist !== null && valueStateExist.length > 0) {
          this.getCityData(valueCountryExist[0], valueStateExist[0].state_Code)
        }
      }, 200);
    }
  }

  public closeRegPartyDialog(form: NgForm): void {
    this.isRegParty = false;
    this.mySelection = [];
    this.resetForm(form);
  }

  public async onPartySubmit(form: NgForm, action: boolean) {
    try {
      if (form.valid) {
        this.spinnerService.show();
        let messageType: string = "";
        let response: any;

        if (!this.insertFlag) {
          messageType = "updated";
          response = await this.partyService.partyUpdate(this.partyObj);
        }
        else {
          messageType = "registered";
          response = await this.partyService.PartyRequest(this.partyObj);
        }

        if (response) {
          this.loadParty();
          this.mySelection = [];
          this.spinnerService.hide();
          if (action)
            this.isRegParty = false;
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
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public resetForm(form?: NgForm) {
    this.partyObj = new Party();
    this.insertFlag = true;
    form?.reset();
    this.partyObj.mobileNo = '';
    this.partyObj.faxNo = '';
    this.partyObj.phoneNo = '';
  }

  public openDeleteDialog() {
    try {
      this.alertDialogService.ConfirmYesNo("Are you sure you want to delete?", "Delete")
        .subscribe(async (res: any) => {
          this.mySelection = [];
          if (res.flag) {
            this.spinnerService.show();
            let responseDelete = await this.partyService.deleteParty(this.partyObj.id)
            if (responseDelete !== undefined && responseDelete !== null) {
              this.loadParty();
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
  //#endregion Party Modal

  public openPartyRedirect(pagename: string) {
    this.router.navigate(["/party/" + pagename, this.partyObj.id]);
  }
}