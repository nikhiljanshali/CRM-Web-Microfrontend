import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { DataResult, GroupDescriptor, process } from '@progress/kendo-data-query';
import { GridDetailConfig } from 'common/businessobjects';
import { UtilityService, GridPropertiesService } from 'common/services';
import { AlertdialogService } from 'common/views';
import { NgxSpinnerService } from 'ngx-spinner';
import { Invoiceservice, InvoiceserviceResponse, InvoiceserviceSearchCriteria } from '../../businessobjects';
import { InvoiceServiceService } from '../../services';

@Component({
  selector: 'app-invoiveservice',
  templateUrl: './invoiveservice.component.html'
})

export class InvoiveserviceComponent implements OnInit {

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
  public invoiceserviceObj: Invoiceservice = new Invoiceservice();
  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains'
  };
  public insertFlag: boolean = true;
  public openedDelete: boolean = false;
  public invoiceserviceSearchCriteria: InvoiceserviceSearchCriteria = new InvoiceserviceSearchCriteria();

  constructor(
    private router: Router,
    private gridPropertiesService: GridPropertiesService,
    public utilityService: UtilityService,
    private InvoiceServiceService: InvoiceServiceService,
    private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService,
  ) { }

  async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  public async defaultMethodsLoad() {
    this.fields = await this.gridPropertiesService.getInvoiceServiceGrid();
    await this.loadData();

    this.utilityService.filterToggleSubject.subscribe(flag => {
      this.filterFlag = flag;
    });
  }

  //#region List 
  public async loadData() {
    try { 
      let response: InvoiceserviceResponse = await this.InvoiceServiceService.getInvoiceServiceNames(this.invoiceserviceSearchCriteria, this.skip, this.pageSize);
      this.gridView = process(response.invoiceServices, { group: this.groups });
      this.gridView.total = response.totalCount;
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
    this.invoiceserviceObj = new Invoiceservice();
    let value: any = e.selectedRows[0].dataItem
    this.invoiceserviceObj = { ...value };
  }

  public onFilterSubmit(form: NgForm) {
    this.skip = 0
    this.loadData()
  }

  public clearFilter(form: NgForm) {
    form.reset()
    this.invoiceserviceSearchCriteria = new InvoiceserviceSearchCriteria()
    this.loadData()
  }
  //#endregion Filter Section

  //#region Modal
  public openAddDialog(): void {
    this.invoiceserviceObj = new Invoiceservice();
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
          response = await this.InvoiceServiceService.Update(this.invoiceserviceObj);
        }
        else {
          messageType = "inserted";
          response = await this.InvoiceServiceService.Insert(this.invoiceserviceObj);
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
    this.invoiceserviceObj = new Invoiceservice();
    this.insertFlag = true;
    form?.reset();    
  }

  public openDeleteDialog() {
    try {
      this.alertDialogService.ConfirmYesNo("Are you sure you want to delete?", "Delete")
        .subscribe(async (res: any) => {
          this.mySelection = [];
          if (res.flag) {
            this.spinnerService.show();
            let responseDelete = await this.InvoiceServiceService.delete(this.invoiceserviceObj.id)
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
    this.router.navigate(["/invoiceservice/" + pagename, this.invoiceserviceObj.id]);
  }
}