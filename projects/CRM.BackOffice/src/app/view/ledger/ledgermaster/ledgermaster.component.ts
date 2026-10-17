import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { DataResult, GroupDescriptor, process } from '@progress/kendo-data-query';
import { City, Country, GridDetailConfig, State } from 'shared/businessobjects';
import { CommonService, listAddressTypeItems, listBusinessTypeItems, UtilityService } from 'shared/services';
import { AlertdialogService } from 'shared/views';
import { NgxSpinnerService } from 'ngx-spinner';
import { LedgerService } from '../../../services/ledger/ledger.service';
import { AccountingconfigService, GridPropertiesService } from '../../../services';
import { BrokerDNorm, Ledger, LedgerGroup } from '../../../entities';
import { LedgerSearchCriteria } from '../../../businessobjects';

@Component({
  selector: 'app-ledger',
  templateUrl: './ledgermaster.component.html',
  styleUrls: ['./ledgermaster.component.css']
})

export class LedgerMasterComponent implements OnInit {

  public groups: GroupDescriptor[] = [];
  public pageSize = 26;
  public skip = 0
  public fields!: GridDetailConfig[];
  public gridView!: DataResult;
  public isRegLedger: boolean = false;
  public filterFlag = true;
  public selectableSettings: SelectableSettings = {
    mode: 'single',
  };
  public openedConfirmationLedgerDetails = false;
  public skeletonArray = new Array(18);
  public mySelection: string[] = [];
  // CRUD Ledger   
  public ledgerObj: Ledger = new Ledger();
  public listBusinessTypeItems = listBusinessTypeItems
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
  public listLedgerGroupItems: Array<LedgerGroup> = new Array<LedgerGroup>();
  public ledgerGroupId!: string;
  public ledgerGroupIdForSearch!: string;
  // Filter Ledger
  public ledgerCriteria: LedgerSearchCriteria = new LedgerSearchCriteria();
  public showBrokerSection: boolean = false;



  constructor(
    private router: Router,
    private gridPropertiesService: GridPropertiesService,
    private commonService: CommonService,
    public utilityService: UtilityService,
    private ledgerService: LedgerService,
    private accountingconfigService: AccountingconfigService,
    private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService,
  ) { }

  async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  async defaultMethodsLoad() {
    this.fields = await this.gridPropertiesService.getLedgerGrid();
    await this.getCountryData();
    await this.loadLedgers();
    await this.loadLedgerGroup();

    this.utilityService.filterToggleSubject.subscribe(flag => {
      this.filterFlag = flag;
    });
  }

  public async loadLedgerGroup() {
    try {
      this.listLedgerGroupItems = [];
      let listLedgerGroups: LedgerGroup[] = await this.accountingconfigService.getLedgerGroups();
      if (listLedgerGroups.length > 0) {
        listLedgerGroups.forEach((item) => {
          if (item.name)
            this.listLedgerGroupItems.push(item)
        })
      }
    }
    catch (error: any) {
      this.alertDialogService.show(error.error)
    }
  }


  //#region List Ledgers
  public async loadLedgers() {
    try {
      let ledger: any = await this.ledgerService.getLedgersByCriteria(this.ledgerCriteria, this.skip, this.pageSize);
      this.gridView = process(ledger.ledgers, { group: this.groups });
      this.gridView.total = ledger.totalCount;
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
      this.loadLedgers();
    }
    catch (error: any) {
      this.alertDialogService.show(error.error)
    }
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadLedgers();
  }
  //#endregion List Ledger

  //#region Filter Section
  public filterPartToggle() {
    this.utilityService.setfilterToggleValue(this.filterFlag);
  }

  public selectedRowChange(e: any) {
    this.insertFlag = false;
    this.ledgerObj = new Ledger();
    let value: any = e.selectedRows[0].dataItem
    this.ledgerObj = { ...value };
  }

  public onFilterSubmit(form: NgForm) {
    this.ledgerCriteria.group = this.listLedgerGroupItems.find(x => x.id == this.ledgerGroupIdForSearch)?.name ?? "";
    this.skip = 0
    this.loadLedgers()
  }

  public clearFilter(form: NgForm) {
    form.reset()
    this.ledgerCriteria = new LedgerSearchCriteria()
    this.loadLedgers()
  }
  //#endregion Filter Section

  //#region Ledger Modal
  public openAddLedgerDialog(): void {
    this.ledgerObj = new Ledger();
    this.insertFlag = true;
    this.isRegLedger = true;
    this.showBrokerSection = false;
  }

  public openUpdateLedgerDialog(): void {
    this.isRegLedger = true;
    let valueCountryExist = this.countryItems.filter((s: any) => {
      return s.name === this.ledgerObj.address.country
    })
    if (valueCountryExist !== undefined && valueCountryExist !== null && valueCountryExist.length > 0) {
      this.getStatesByCountryCode(valueCountryExist[0].iso2);
      setTimeout(() => {
        let valueStateExist = this.stateItems.filter((s: any) => {
          return s.name === this.ledgerObj.address.state
        });
        if (valueStateExist !== undefined && valueStateExist !== null && valueStateExist.length > 0) {
          this.getCityData(valueCountryExist[0], valueStateExist[0].state_Code)
        }
      }, 200);
    }
    // NOTE : Edit : only for drop-down binding 
    this.ledgerGroupId = this.ledgerObj.group.id;
    this.showBrokerSection = this.ledgerObj.group.name.toLowerCase() == 'broker' ? true : false
  }

  public closeRegLedgerDialog(form: NgForm): void {
    this.isRegLedger = false;
    this.mySelection = [];
    this.resetForm(form);
  }

  public async onLedgerSubmit(form: NgForm, action: boolean) {
    try {
      if (form.valid) {
        this.spinnerService.show();
        let messageType: string = "";
        let response: any;
        if (!this.showBrokerSection && !this.insertFlag)
          this.ledgerObj.broker = new BrokerDNorm();

        if (!this.insertFlag) {
          messageType = "updated";
          response = await this.ledgerService.ledgerUpdate(this.ledgerObj);
        }
        else {
          messageType = "registered";
          response = await this.ledgerService.ledgerRequest(this.ledgerObj);
        }

        if (response) {
          this.loadLedgers();
          this.mySelection = [];
          this.spinnerService.hide();
          if (action)
            this.isRegLedger = false;
          this.resetForm(form);
          this.showBrokerSection = false;
          this.utilityService.showNotification(`You have been ${messageType} successfully!`);

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
    this.ledgerObj = new Ledger();
    this.insertFlag = true;
    form?.reset();
    this.ledgerObj.mobileNo = '';
    this.ledgerObj.faxNo = '';
    this.ledgerObj.phoneNo = '';
  }

  public openDeleteDialog() {
    try {
      this.alertDialogService.ConfirmYesNo("Are you sure you want to delete?", "Delete")
        .subscribe(async (res: any) => {
          this.mySelection = [];
          if (res.flag) {
            this.spinnerService.show();
            let responseDelete = await this.ledgerService.deleteLedger(this.ledgerObj.id)
            if (responseDelete !== undefined && responseDelete !== null) {
              this.loadLedgers();
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

  public openLedgerRedirect(pagename: string) {
    this.router.navigate(["/ledger/" + pagename, this.ledgerObj.id]);
  }

  public openSection(value: any): void {
    if (value) {
      this.ledgerObj.group = value;
    }
    this.showBrokerSection = value.name.toLowerCase() == 'broker' ? true : false
    // if (!this.showBrokerSection)
    //   this.ledgerObj.broker = new BrokerDNorm();
  }
}