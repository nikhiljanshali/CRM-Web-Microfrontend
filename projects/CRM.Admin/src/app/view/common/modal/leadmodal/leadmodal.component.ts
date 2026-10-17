import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { NotificationService } from '@progress/kendo-angular-notification';
import { DataResult, process } from '@progress/kendo-data-query';
import { GridDetailConfig, OrderInventoryItems } from 'common/businessobjects';
import { fxCredential, GridConfig, GridMasterConfig, Lead } from 'common/entities';
import { UtilityService, AppPreloadService, GridPropertiesService, ConfigService, LeadService } from 'common/services';
import { AlertdialogService } from 'common/views';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-leadmodal',
  templateUrl: './leadmodal.component.html',
  styleUrls: ['./leadmodal.component.css']
})
export class LeadmodalComponent implements OnInit {

  @Input() leadId!: string;
  @Output() closeDialogLead: EventEmitter<any> = new EventEmitter();
  public leadObj = new Lead();
  public gridInventoryData: OrderInventoryItems[] = [];
  public gridViewLeadInventory!: DataResult;
  public pageSize = 7;
  public skip = 0;
  public fields!: GridDetailConfig[];
  public gridConfig!: GridConfig;
  public gridMasterConfigResponse!: GridMasterConfig;
  public isGridConfig: boolean = false;
  public totalPcs = 0;
  public totalCarat = 0;
  public totalAmount = 0;
  public avgDiscPer = 0;
  public totalRAP = 0;
  public perCarat = 0;

  public fxCredential!: fxCredential;
  public listInventoryItems: OrderInventoryItems[] = [];
  public isShowCheckBoxAll: boolean = true;
  public mySelection: string[] = [];


  constructor(
    public utilityService: UtilityService,
    private spinnerService: NgxSpinnerService,
    public appPreloadService: AppPreloadService,
    public router: Router,
    private gridPropertiesService: GridPropertiesService,
    public leadService: LeadService,
    public notificationService: NotificationService,
    private configService: ConfigService,
    private alertDialogService: AlertdialogService,
  ) {
  }

  async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  public async defaultMethodsLoad() {
    this.fxCredential = await this.appPreloadService.fetchFxCredentials();
    if (!this.fxCredential)
      this.router.navigate(["login"]);

    await this.getGridConfiguration();

    this.leadObj = await this.leadService.getLeadById(this.leadId);
    this.loadInventory(this.leadObj.leadInventoryItems, false);
  }

  public closeLeadDialog() {
    this.closeDialogLead.emit(false);
  }

  public loadInventory(inventories: OrderInventoryItems[], isStoneAdd: boolean = false) {
    if (!isStoneAdd)
      this.listInventoryItems = [];
    // this.gridInventoryData = [];

    if (inventories && inventories.length > 0) {
      for (let index = 0; index < inventories.length; index++) {
        const element = inventories[index];
        if (!element.reqPrice)
          element.reqPrice = { ...element.price };
        this.listInventoryItems.push(element);
      }

      if (this.listInventoryItems.length > 0) {
        this.gridInventoryData = [];

        for (let indexGrid = 0; indexGrid < this.pageSize; indexGrid++) {
          const element = this.listInventoryItems[indexGrid];
          if (element)
            this.gridInventoryData.push(element);

        }
        this.loadLeadInventoryGrid(this.listInventoryItems)
        this.summaryCalculation();
      }
    }
    else
      if (isStoneAdd)
        this.alertDialogService.show("Stone(s) not Found");
    this.spinnerService.hide();
  }

  public loadLeadInventoryGrid(leadInventoryItems: OrderInventoryItems[]) {
    this.gridViewLeadInventory = process(this.gridInventoryData, {});
    this.gridViewLeadInventory.total = leadInventoryItems.length;
    this.totalPcs = leadInventoryItems.length;
    this.totalCarat = leadInventoryItems.reduce((acc, cur) => acc + cur.weight, 0);
    this.totalAmount = leadInventoryItems.reduce((acc, cur) => acc + (cur.price.netAmount ? cur.price.netAmount : 0), 0);
    this.spinnerService.hide();

  }

  public summaryCalculation() {
    this.totalAmount = 0;
    this.totalCarat = 0;
    this.totalRAP = 0;

    // if (this.editCardStatus.toLowerCase() == "won") {
    //   this.listInventoryItems.forEach(z => {
    //     this.totalAmount += z.orderPrice.netAmount ?? 0;
    //     this.totalCarat += z.weight;
    //     this.totalRAP += (z.price.rap ?? 0) * (z.weight);
    //   })
    // }
    // else if (this.editCardStatus.toLowerCase() == "negotiation") {
    this.listInventoryItems.forEach(z => {
      if (z.reqPrice.netAmount)
        this.totalAmount += z.reqPrice.netAmount ?? 0;
      else
        this.totalAmount += z.price.netAmount ?? 0;
      this.totalCarat += z.weight;
      this.totalRAP += (z.price.rap ?? 0) * (z.weight);
    })

    // }
    // else {
    //   this.listInventoryItems.forEach(z => {
    //     this.totalAmount += z.price.netAmount ?? 0;
    //     this.totalCarat += z.weight;
    //     this.totalRAP += (z.price.rap ?? 0) * (z.weight);
    //   })
    // }


    this.totalPcs = this.listInventoryItems.length;
    this.avgDiscPer = (((this.totalAmount / this.totalRAP) * 100) - 100);
    this.perCarat = this.totalAmount / this.totalCarat;

  }

  public pageChange(event: PageChangeEvent): void {
    this.spinnerService.show();
    this.gridInventoryData = [];
    this.skip = event.skip;

    if (this.listInventoryItems.length > 0) {
      for (let i = this.skip; i < this.pageSize + this.skip; i++) {
        const element = this.listInventoryItems[i];
        if (element)
          this.gridInventoryData.push(element);
      }

      this.loadLeadInventoryGrid(this.listInventoryItems);
    }

  }

  public selectAllInventories(event: string) {
    this.mySelection = [];
    if (event.toLowerCase() == 'checked')
      this.mySelection = this.listInventoryItems.map(z => z.id);
  }


  public async getGridConfiguration() {
    try {
      this.spinnerService.show();
      this.gridConfig = await this.configService.getGridConfig(this.fxCredential.id, "LeadNegotiationInventory", "LeadInventoryNegotationGrid");
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
        this.gridMasterConfigResponse = await this.configService.getMasterGridConfig("LeadNegotiationInventory", "LeadInventoryNegotationGrid");
        if (this.gridMasterConfigResponse)
          this.fields = this.gridMasterConfigResponse.gridDetail;
        else
          this.fields = await this.gridPropertiesService.getLeadInventoryItems();
      }

      // if (this.isNegotiateFlag) {
      let items = this.fields.filter(x => x.isSelected == false);
      for (let index = 0; index < items.length; index++) {
        const element = items[index];
        element.isSelected = true;

      }

      // }

      this.spinnerService.hide();
    }
    catch (error: any) {
      this.alertDialogService.show(error);
      this.spinnerService.hide();
    }
  }

}
