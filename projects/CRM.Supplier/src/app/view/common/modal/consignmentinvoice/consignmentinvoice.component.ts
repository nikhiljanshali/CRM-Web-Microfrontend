import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { DataResult, GroupDescriptor, process } from '@progress/kendo-data-query';
import { GridDetailConfig, OrganizationSearchCriteria } from 'common/businessobjects';
import { ConsignmentInvoice, ConsignmentInvoiceItem, fxCredential, GridConfig, GridMasterConfig, InventoryItems, Logistic, Organization } from 'common/entities';
import { AppPreloadService, ConfigService, GridPropertiesService, LogisticService, OrganizationService, PrintFormatService, UtilityService } from 'common/services';
import { AlertdialogService } from 'common/views';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConsignmentInvoiceService, StockOnHandService } from 'projects/CRM.Supplier/src/app/services';
import { fromEvent } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-consignmentinvoice',
  templateUrl: './consignmentinvoice.component.html',
  styles: [
  ]
})
export class ConsignmentInvoiceComponent implements OnInit {

  @ViewChild('StoneIdInput') stoneIdInput!: ElementRef;

  @Output() public closeDialog = new EventEmitter(false);
  @Output() public removedSelectedStone = new EventEmitter();
  @Output() public addedSelectedStone = new EventEmitter();

  @Input() stockOnHandSelectedItems: InventoryItems[] = [];

  public isConsignmentInvoice: boolean = true;
  public groups: GroupDescriptor[] = [];
  public groupsIssue: GroupDescriptor[] = [];
  public pageSize = 26;
  public skip = 0;
  public fields!: GridDetailConfig[];
  public gridView!: DataResult;
  public selectableSettings: SelectableSettings = {
    mode: 'multiple',
  };
  public skeletonArray = new Array(3);
  public mySelection: string[] = [];
  public isGridConfig: boolean = false;
  private fxCredential!: fxCredential;
  public totalWeight: number = 0;
  public inventoryItems: InventoryItems[] = [];
  public selectedInventoryItems: InventoryItems[] = [];
  public gridConfig!: GridConfig;
  public gridMasterConfigResponse!: GridMasterConfig;
  public listStoneItems: Array<{ text: string; value: string }> = [];
  public listStoneFilterItems: Array<{ text: string; value: string }> = [];
  public selectedPacketsItems?: { text: string, value: string };
  public cntMnuStones?: string;
  public sumMnuStonesWeight?: string;
  public gridViewConsignment!: DataResult;


  public listOrganizationItems: Array<{ text: string; value: string }> = [];
  public organizationObj: Organization = new Organization();
  public organizationItems: any;
  public selectedOrganizationItems!: string;

  public logisticObj: Logistic = new Logistic();
  public logisticItems: Logistic[] = [];
  public selectedLogisticItems?: { text: string, value: string };
  public listLogisticItems: Array<{ text: string; value: string }> = [];
  public consignmentInvoiceObj: ConsignmentInvoice = new ConsignmentInvoice();


  constructor(private organizationService: OrganizationService,
    private logisticService: LogisticService,
    private gridPropertiesService: GridPropertiesService,
    private alertDialogService: AlertdialogService,
    public utilityService: UtilityService,
    private stockOnHandService: StockOnHandService,
    private spinnerService: NgxSpinnerService,
    private configService: ConfigService,
    private consignmentInvoiceService: ConsignmentInvoiceService,
    public appPreloadService: AppPreloadService,
    private printFormatService: PrintFormatService,
    public router: Router) { }

  async ngOnInit() {
    await this.getDefaultMethods();
  }

  public async getDefaultMethods() {
    this.fxCredential = await this.appPreloadService.fetchFxCredentials();
    if (!this.fxCredential)
      this.router.navigate(["login"]);
    this.gridView = { data: [], total: 0 };
    await this.getGridConfiguration();
    await this.getAllOrganizations();
    await this.getAllLogistics();
    await this.loadStock();
    await this.onAddStone();
    // await this.printDetail();

  }

  public async getAllOrganizations() {
    try {
      let organizationSearchCriteria: OrganizationSearchCriteria = new OrganizationSearchCriteria();
      this.organizationItems = await this.organizationService.getOrganizations(organizationSearchCriteria, 0, 500);
      this.listOrganizationItems = [];
      this.organizationItems.organizations.forEach((z: Organization) => { this.listOrganizationItems.push({ text: z.name, value: z.id }); });
    }
    catch (error: any) {
      this.alertDialogService.show(error.error);
    }
  }

  public async getAllLogistics() {
    try {
      this.logisticItems = await this.logisticService.getAllLogistics();
      this.listLogisticItems = [];
      this.logisticItems.forEach(z => { this.listLogisticItems.push({ text: z.name, value: z.id }); });
    }
    catch (error: any) {
      this.alertDialogService.show(error.error);
    }
  }

  public async loadStock() {
    try {
      this.stockOnHandSelectedItems.forEach((element: InventoryItems) => {
        this.selectedInventoryItems.push(element)
      });

      let org: any = await this.stockOnHandService.getAllStock();
      this.inventoryItems = org;
      this.gridViewConsignment = process(this.selectedInventoryItems, { group: this.groups });
      this.cntMnuStones = this.selectedInventoryItems.length.toString();
      let totalWeight = 0.0;
      this.selectedInventoryItems.forEach(z => {
        totalWeight = totalWeight + z.weight;
      });
      this.sumMnuStonesWeight = totalWeight.toFixed(2);
    }
    catch (error: any) {
      this.alertDialogService.show(error.error)
    }
  }

  public organizationChange() {
    this.spinnerService.show();
    let selectedIndex = this.organizationItems.organizations.findIndex((x: Organization) => x.id == this.selectedOrganizationItems);
    if (selectedIndex >= 0) {
      this.organizationObj = this.organizationItems.organizations[selectedIndex];
      this.consignmentInvoiceObj.organization.id = this.organizationObj.id;
      this.consignmentInvoiceObj.organization.email = this.organizationObj.email;
      this.consignmentInvoiceObj.organization.phoneNo = this.organizationObj.mobileNo;
      this.consignmentInvoiceObj.organization.name = this.organizationObj.name;
      this.consignmentInvoiceObj.organization.phoneNo = this.organizationObj.phoneNo;
    }
    this.spinnerService.hide();
  }

  public logisticChange() {
    this.spinnerService.show();
    let selectedIndex = this.logisticItems.findIndex(x => x.id == this.selectedLogisticItems?.value);
    if (selectedIndex >= 0) {
      this.logisticObj = this.logisticItems[selectedIndex];
      this.consignmentInvoiceObj.logistic.id = this.logisticObj.id;
      this.consignmentInvoiceObj.logistic.email = this.logisticObj.email;
      this.consignmentInvoiceObj.logistic.mobileNo = this.logisticObj.mobileNo;
      this.consignmentInvoiceObj.logistic.name = this.logisticObj.name;
      this.consignmentInvoiceObj.logistic.phoneNo = this.logisticObj.phoneNo;
    }
    this.spinnerService.hide();
  }

  public async getGridConfiguration() {
    try {
      this.spinnerService.show();
      this.gridConfig = await this.configService.getGridConfig(this.fxCredential.id, "ConsignmentInvoice", "ConsignmentInvoiceGrid");
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
        this.gridMasterConfigResponse = await this.configService.getMasterGridConfig("ConsignmentInvoice", "ConsignmentInvoiceGrid");
        if (this.gridMasterConfigResponse)
          this.fields = this.gridMasterConfigResponse.gridDetail;
        else
          this.fields = await this.gridPropertiesService.getConsignmentInvoiceGrid();
      }
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.alertDialogService.show(error);
      this.spinnerService.hide();
    }
  }

  public async onSaveConsignmentInvoice(form: NgForm, action: boolean) {
    try {
      if (form.valid) {
        this.spinnerService.show();
        let messageType: string = "";
        let response: any;
        this.selectedInventoryItems.forEach(z => {
          let consignmentInvoiceItem = new ConsignmentInvoiceItem();
          consignmentInvoiceItem.stoneId = z.stoneId;
          consignmentInvoiceItem.kapan = z.kapan;
          consignmentInvoiceItem.shape = z.shape;
          consignmentInvoiceItem.weight = z.weight;
          consignmentInvoiceItem.color = z.color;
          consignmentInvoiceItem.clarity = z.clarity;
          consignmentInvoiceItem.cut = z.cut;
          consignmentInvoiceItem.polish = z.polish;
          consignmentInvoiceItem.symmetry = z.symmetry;
          consignmentInvoiceItem.fluorescence = z.fluorescence;
          consignmentInvoiceItem.basePrice.discount = z.basePrice.discount;
          consignmentInvoiceItem.basePrice.netAmount = z.basePrice.netAmount;
          consignmentInvoiceItem.basePrice.perCarat = z.basePrice.perCarat;
          consignmentInvoiceItem.basePrice.rap = z.basePrice.rap;
          consignmentInvoiceItem.isReceived = true;
          consignmentInvoiceItem.receiveDate = this.utilityService.setUTCDateFilter(new Date());
          this.consignmentInvoiceObj.consignmentInvoiceItems.push(consignmentInvoiceItem);
        })

        this.consignmentInvoiceObj.identity.id = this.fxCredential.id;
        this.consignmentInvoiceObj.identity.name = this.fxCredential.fullName;
        this.consignmentInvoiceObj.identity.type = 'Employee' ?? '';

        messageType = "Inserted";
        response = await this.consignmentInvoiceService.insertConsignmentInvoice(this.consignmentInvoiceObj);
        if (response) {
          this.loadStock();
          this.mySelection = [];
          this.spinnerService.hide();
          if (action)
            this.closeConsignmentInvoiceDialog();
          this.consignmentInvoiceObj.id = response.message;
          await this.printDetail(this.consignmentInvoiceObj);
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

  public deletePlan(id: string): void {
    try {
      this.alertDialogService.ConfirmYesNo("Are you sure you want to delete?", "Delete")
        .subscribe(async (res: any) => {
          if (res.flag) {
            var index = this.selectedInventoryItems.findIndex(x => x.stoneId == id);
            if (index >= 0) {
              this.selectedInventoryItems.splice(index, 1);
              this.removedSelectedStone.emit(id);
              let tempSelectData = [...this.selectedInventoryItems];
              this.gridViewConsignment = { data: tempSelectData, total: tempSelectData.length };
              this.cntMnuStones = tempSelectData.length.toString();
              let totalWeight = 0.0;
              tempSelectData.forEach(z => {
                totalWeight = totalWeight + z.weight;
              });
              this.sumMnuStonesWeight = totalWeight.toFixed(2);
            }
          }
        })
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public resetForm(form?: NgForm) {
    this.consignmentInvoiceObj = new ConsignmentInvoice();
    this.selectedInventoryItems = []
    form?.reset();
  }

  public async onAddStone() {
    try {
      fromEvent(this.stoneIdInput.nativeElement, 'keyup').pipe(
        map((event: any) => {
          return event.target.value;
        })
        , filter(res => res.length > 5)
        , debounceTime(1000)
      ).subscribe(async (text: string) => {
        let tempSelectData = [...this.selectedInventoryItems];
        let existStoneId = tempSelectData.findIndex(x => x.stoneId.toLowerCase() == text?.trim().toString().toLowerCase());
        if (existStoneId < 0) {
          let index = this.inventoryItems.findIndex(x => x.stoneId.toLowerCase() == text?.trim().toString().toLowerCase());
          if (index >= 0) {
            this.addedSelectedStone.emit(text?.trim().toString().toLowerCase())
            tempSelectData.push(this.inventoryItems[index])
            this.selectedInventoryItems.push(this.inventoryItems[index])
          }
          else {
            let invItem: InventoryItems = await this.consignmentInvoiceService.getStockOnHandByStoneIdAsync(text?.trim().toString());
            if (invItem) {
              tempSelectData.push(invItem)
              this.selectedInventoryItems.push(invItem)
            }
            else
              this.alertDialogService.show("Stone is not found in stock");
          }
          this.gridViewConsignment = { data: tempSelectData, total: tempSelectData.length };
          this.cntMnuStones = tempSelectData.length.toString();
          let totalWeight = 0.0;
          tempSelectData.forEach(z => {
            totalWeight = totalWeight + z.weight;
          });
          this.sumMnuStonesWeight = totalWeight.toFixed(2);
        }
        else
          this.alertDialogService.show("Stone is already added");

      }, (err) => {
        this.alertDialogService.show(err.error);
      });

    }
    catch (error: any) {
      this.spinnerService.hide();
      if (error.error)
        this.alertDialogService.show(error.error);
      if (error.message)
        this.alertDialogService.show(error.message);
    }
  }

  public async printDetail(consignmentInvoiceObj: ConsignmentInvoice) {
    try {
      this.spinnerService.show();
      // this.jangadPrint = null;
      // this.jangadPrint = await this.jangadService.printJangad(this.jangad.jangadId);
      // if (this.jangadPrint) {

      //Print code
      let frame1: HTMLIFrameElement = document.createElement("iframe");
      frame1.name = "frame1";
      frame1.style.position = "absolute";
      frame1.style.top = "-1000000px";
      document.body.appendChild(frame1);
      frame1?.contentWindow?.document.open();
      frame1?.contentWindow?.document.write(`<html><head>
            <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <link rel="stylesheet" type="text/css" href="commonAssets/css/print.css" media="print" />`);

      let printContents: string;
      // if (this.jangad.isKapan)
      //   printContents = this.htmlKapanContent();
      // else
      printContents = this.printFormatService.getConsignmentInvoicePrintFormat(consignmentInvoiceObj);

      frame1?.contentWindow?.document.write(printContents);
      frame1?.contentWindow?.document.close();
      // }
      this.spinnerService.hide();
    }
    catch (error) {
      this.spinnerService.hide();
      // this.errordialogService.show(error);
    }
  }

  public closeConsignmentInvoiceDialog(): void {
    this.closeDialog.emit(false);
  }

}
