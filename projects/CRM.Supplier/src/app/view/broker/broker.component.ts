import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { DataResult, GroupDescriptor, process } from '@progress/kendo-data-query';
import { Broker, BrokerSearchCriteria, GridDetailConfig } from 'common/businessobjects';
import { UtilityService, GridPropertiesService, BrokerService } from 'common/services';
import { AlertdialogService } from 'common/views';
import { NgxSpinnerService } from 'ngx-spinner';

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
    private router: Router,
    private gridPropertiesService: GridPropertiesService,  
    public utilityService: UtilityService,
    private brokerService: BrokerService,
    private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService,
  ) { }

  async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  public async defaultMethodsLoad() {
    this.fields = await this.gridPropertiesService.getBrokerGrid();
    await this.loadData();

    this.utilityService.filterToggleSubject.subscribe(flag => {
      this.filterFlag = flag;
    });
  }

  //#region List 
  public async loadData() {
    try {
      let org: any = await this.brokerService.getBrokerNames(this.brokerCriteria, this.skip, this.pageSize);
      this.gridView = process(org.broker, { group: this.groups });
      this.gridView.total = org.totalCount;
    }
    catch (error: any) {
      this.alertDialogService.show(error.error)
    }
  }

  public groupChange(groups: GroupDescriptor[]): void {
    try {
      this.groups = groups;
      this.loadData();
    }
    catch (error: any) {
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
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }
  //#endregion Modal

  public openRedirect(pagename: string) {
    this.router.navigate(["/broker/" + pagename, this.brokerObj.id]);
  }
}