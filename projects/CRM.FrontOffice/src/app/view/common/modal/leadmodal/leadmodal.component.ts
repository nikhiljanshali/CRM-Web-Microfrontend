import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { PageChangeEvent, RowClassArgs, SelectableSettings } from '@progress/kendo-angular-grid';
import { AggregateDescriptor, DataResult, GroupDescriptor, process } from '@progress/kendo-data-query';
import { NgxSpinnerService } from 'ngx-spinner';
import { LeadResponse } from '../../../../businessobjects';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';
import { GridDetailConfig } from 'shared/businessobjects';
import { fxCredential, GridConfig, GridMasterConfig } from 'shared/enitites';
import { BrokerDNrom, BusinessConfig, CustomerDNorm, InvItem, InventoryItems, Lead, LeadSummary, PriceDNorm, RejectedStone, SystemUserDNorm, Scheme } from '../../../../entities';
import { Notifications } from 'common/entities';
import { BrokerService, BusinessconfigurationService, CustomerService, GridPropertiesService, InventoryService, LeadService, RejectedstoneService, SchemeService } from '../../../../services';
import { AlertdialogService } from 'shared/views';
import { AppPreloadService, ConfigService, LeadStatus, UtilityService } from 'shared/services';
import * as xlsx from 'xlsx';

@Component({
  selector: 'app-leadmodal',
  templateUrl: './leadmodal.component.html',
  styleUrls: ['./leadmodal.component.css']
})
export class LeadmodalComponent implements OnInit {

  @Input() leadTitle!: string;
  @Input() leadItem!: any;
  @Input() seller!: SystemUserDNorm;
  @Input() isEditLead!: boolean;
  @Input() isAddLead!: boolean;
  @Input() public leadListInvInput: InvItem[] = [];
  @Input() public allLeads: LeadResponse[] = [];
  @Output() toggle: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('StoneTxtInput') stoneTxtInput!: ElementRef;
  @ViewChild('CertificateTxtInput') certificateTxtInput!: ElementRef;
  @ViewChild('SelectStoneTxtInput') selectStoneTxtInput!: ElementRef;

  public disabledFlag: boolean = false;
  public groups: GroupDescriptor[] = [];
  public gridInventoryData: InvItem[] = [];
  public gridCartInventoryData: InvItem[] = [];
  public gridViewLeadInventory!: DataResult;
  public gridViewCartInventory!: DataResult;
  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains'
  };
  public aggregates: AggregateDescriptor[] = [{ field: 'weight', aggregate: 'sum' },
  { field: 'netAmount', aggregate: 'sum' }];
  public pageSize = 8;
  public skip = 0;
  public fields!: GridDetailConfig[];
  public gridConfig!: GridConfig;
  public gridMasterConfigResponse!: GridMasterConfig;
  public isGridConfig: boolean = false;
  public selectableSettings: SelectableSettings = {
    mode: 'multiple',
    checkboxOnly: true
  };
  public fxCredential!: fxCredential;
  public listCustomerItems: Array<{ text: string; companyName: string, value: string }> = [];
  public customerItems: CustomerDNorm[] = [];
  public selectedCustomerItem: string = "";
  public customerObj: CustomerDNorm = new CustomerDNorm();
  public listBrokerItems: Array<{ text: string; value: string }> = [];
  public brokerItems: BrokerDNrom[] = [];
  public selectedBrokerItem?: { text: string, value: string };
  public brokerObj: BrokerDNrom = new BrokerDNrom();
  public listInventoryItems: InvItem[] = [];
  public listAcceptedInventoryItems: InvItem[] = [];
  public listCartInventoryItems: InventoryItems[] = [];
  public sellerObj = new SystemUserDNorm();
  public leadObj = new Lead();
  public isShowCheckBoxAll: boolean = true;
  public mySelection: string[] = [];
  public subjectReqDis: Subject<InvItem> = new Subject();
  public editCardStatus: string = "";
  public gridName: string = '';
  public message: Notifications = new Notifications();
  public gridDetailSummary: LeadSummary = new LeadSummary();
  public gridAcceptedSummary: LeadSummary = new LeadSummary();
  public isRMReason: boolean = false;
  public removeReasonModel: string = "";
  public businessConfig = new BusinessConfig();
  public listRemoveReasonItems: Array<string> = new Array<string>();
  public listQCReasonItems: Array<string> = new Array<string>();
  public qcReasonModel: string = "";
  public isEditableBrokerage: boolean = false;
  public brokerageValue: number = 0;
  public rejectedStone: RejectedStone[] = new Array<RejectedStone>();
  public visibleRejectedStone: boolean = false;
  public schemes: Scheme = new Scheme();
  public lastPurchase: number = 0;


  constructor(
    public customerService: CustomerService,
    public brokerService: BrokerService,
    private alertDialogService: AlertdialogService,
    public utilityService: UtilityService,
    private spinnerService: NgxSpinnerService,
    public appPreloadService: AppPreloadService,
    public inventoryService: InventoryService,
    public router: Router,
    private gridPropertiesService: GridPropertiesService,
    private configService: ConfigService,
    public leadService: LeadService,
    public businessConfigurationService: BusinessconfigurationService,
    public rejectedStoneService: RejectedstoneService,
    public schemeService: SchemeService,
  ) {
  }

  async ngOnInit() {
    await this.loadDefaultMethods()
  }

  public async loadDefaultMethods() {
    try {
      this.spinnerService.show();
      this.fxCredential = await this.appPreloadService.fetchFxCredentials();
      if (!this.fxCredential)
        this.router.navigate(["login"]);
      if (this.seller)
        this.sellerObj = this.seller;
      await this.loadBusinessConfiguration();
      await this.loadBrokers();
      if (this.leadItem) {
        this.schemes = await this.getSchemes(this.leadItem.platform.toLowerCase() == "online" ? true : false);
        this.lastPurchase = await this.leadService.getLastPurchaseAmountForVow(this.leadItem.customer.id);

        if (this.leadItem.platform.toLowerCase() == "online")
          this.gridDetailSummary = this.leadItem.leadSummary;
        this.editLead(this.leadItem, this.isEditLead, this.leadTitle);

      }
      else
        await this.toggleAddLeadDialog();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  //#region load methods
  public async loadBusinessConfiguration() {
    try {
      this.spinnerService.show();
      this.businessConfig = await this.businessConfigurationService.getBusinessConfiguration();
      if (this.businessConfig && this.businessConfig.removeStoneReasons.length > 0)
        this.listRemoveReasonItems = this.businessConfig.removeStoneReasons;

      if (this.businessConfig && this.businessConfig.qcReasons.length > 0)
        this.listQCReasonItems = this.businessConfig.qcReasons;

      this.spinnerService.hide();
    } catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async loadBrokers() {
    try {

      this.brokerItems = await this.brokerService.getAllBrokerDNorms();
      this.listBrokerItems = [];
      this.brokerItems.forEach(z => { this.listBrokerItems.push({ text: z.name, value: z.id }); });
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }

  }

  public brokerChange() {
    let fetchBroker = this.brokerItems.find(x => x.id == this.selectedBrokerItem?.value);
    if (fetchBroker)
      this.brokerObj = fetchBroker;
  }

  public customerChange(e: any) {
    if (e) {
      let fetchCustomer = this.customerItems.find(x => x.id == e);
      if (fetchCustomer) {
        setTimeout(() => {
          this.selectedCustomerItem = fetchCustomer?.companyName + '-' + fetchCustomer?.name ?? '' as any;
        }, 0);
        this.customerObj = fetchCustomer ?? new CustomerDNorm();
      }
    }
    else
      this.customerObj = new CustomerDNorm();

  }

  public async handleCustomerFilter(value: any) {
    try {
      if (value) {
        let customers: CustomerDNorm[] = await this.customerService.getAllCustomerDNormsByName(value);
        this.listCustomerItems = [];
        this.customerItems = customers;
        this.customerItems.reverse().forEach(z => { this.listCustomerItems.push({ text: z.name, companyName: z.companyName, value: z.id }); });
        this.spinnerService.hide();
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  //#endregion

  //#region Grid Change Events
  public async loadInventoryByStone(stoneId: string) {
    try {

      let inventory: InvItem[] = await this.inventoryService.getInventoryDNormsByStones(stoneId, false);
      this.loadInventory(inventory, true);  //load inventory
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }

  }

  public async loadInventoryByCertificate(certificateIds: string[]) {
    try {

      let inventory: InvItem[] = await this.inventoryService.getInventoryDNormsByCertificateIds(certificateIds, false);
      this.loadInventory(inventory, true);  //load inventory
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }

  }

  public loadInventory(inventories: InvItem[], isStoneAdd: boolean = false) {
    if (!isStoneAdd)
      this.listInventoryItems = [];

    if (inventories && inventories.length > 0) {
      for (let index = 0; index < inventories.length; index++) {
        const element = inventories[index];
        element.netAmount = element.price.netAmount;
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
      }
    }
    else
      if (isStoneAdd)
        this.alertDialogService.show("Stone(s) not Found");
    this.spinnerService.hide();
  }

  public isDisabled(args: RowClassArgs) {
    return {
      'k-state-disabled': args.dataItem.isRejected === true

    };
  }

  public async loadLeadInventoryGrid(leadInventoryItems: InvItem[]) {
    if (leadInventoryItems.length > 0) {
      if (this.leadObj.platform.toLowerCase() == "offline")
        this.gridDetailSummary = this.calculateSummaryAll(this.listInventoryItems);
      if (this.groups && this.groups.length > 0)
        for (let index = 0; index < this.groups.length; index++) {
          const element = this.groups[index];
          element.aggregates = this.aggregates
        }
      this.gridViewLeadInventory = process(this.gridInventoryData, { group: this.groups });
      this.gridViewLeadInventory.total = leadInventoryItems.length;
    }
    this.spinnerService.hide();
  }

  public onAddStones() {
    try {
      if (this.stoneTxtInput.nativeElement) {
        fromEvent(this.stoneTxtInput.nativeElement, 'keyup').pipe(
          map((event: any) => {
            return event.target.value;
          })
          , filter(res => res.length > 4)
          , debounceTime(1000)
        ).subscribe(async (stoneId: string) => {
          this.spinnerService.show();
          let fetchStoneIds: string[] = this.utilityService.CheckStoneIds(stoneId);
          let existStonesInList = [];
          for (let i = 0; i < fetchStoneIds.length; i++) {
            let stoneId = fetchStoneIds[i];
            if (stoneId) {
              let findIndex = this.listInventoryItems.findIndex(x => x.stoneId.toLowerCase() == stoneId.toLowerCase());
              if (findIndex > -1)
                existStonesInList.push(stoneId);
            }
          }
          if (existStonesInList.length == 0)
            await this.loadInventoryByStone(stoneId);
          else
            this.alertDialogService.show(`Stone Ids ${existStonesInList.toString()} already exist in list`);
          this.spinnerService.hide();
        });
      }

    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public onSelectionStones() {
    try {
      if (this.selectStoneTxtInput.nativeElement) {
        fromEvent(this.selectStoneTxtInput.nativeElement, 'keyup').pipe(
          map((event: any) => {
            return event.target.value;
          })
          , debounceTime(1200)
        ).subscribe((stoneId: string) => {
          if (stoneId) {
            this.spinnerService.show();
            let fetchStoneIds: string[] = this.utilityService.CheckStoneIds(stoneId);
            if (fetchStoneIds && fetchStoneIds.length > 0)
              this.mySelection = this.listInventoryItems.filter(o => fetchStoneIds.some((a) => a.toLowerCase() == o.stoneId.toLowerCase())).map(o => o.invId);
            else
              this.mySelection = [];

            if (this.leadObj.leadStatus.toLowerCase() == LeadStatus.Order.toLowerCase() && this.mySelection.length > 0)
              this.setListOfAccpectedStones();
            this.spinnerService.hide();
          }
          else
            this.mySelection = [];
        });
      }

    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public onCertificate() {
    try {
      if (this.certificateTxtInput.nativeElement) {
        fromEvent(this.certificateTxtInput.nativeElement, 'keyup').pipe(
          map((event: any) => {
            return event.target.value;
          })
          , filter(res => res.length > 4)
          , debounceTime(1000)
        ).subscribe(async (certificateId: string) => {
          this.spinnerService.show();

          let fetchCertificateIds: string[] = this.utilityService.checkCertificateIds(certificateId);
          let existCertificatesInList = [];
          for (let i = 0; i < fetchCertificateIds.length; i++) {
            let certificate = fetchCertificateIds[i];
            if (certificate) {
              let findIndex = this.listInventoryItems.findIndex(x => x.certificateNo.toLowerCase() == certificate.toLowerCase());
              if (findIndex > -1)
                existCertificatesInList.push(certificate);
            }
          }
          if (existCertificatesInList.length == 0)
            await this.loadInventoryByCertificate(fetchCertificateIds);
          else {
            this.spinnerService.hide();
            this.alertDialogService.show(`Certificate Ids ${existCertificatesInList.toString()} already exist in list`);
          }
        });
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
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

  public groupChange(groups: GroupDescriptor[]): void {
    try {
      this.groups = groups;
      this.loadLeadInventoryGrid(this.listInventoryItems);
    }
    catch (error: any) {
      this.alertDialogService.show(error.error)
    }
  }

  //#endregion

  //#region create lead
  public async submitLead(form: NgForm, action: boolean) {
    try {
      if (form.valid) {
        this.spinnerService.show();
        if (!this.isEditLead) {
          this.leadObj = new Lead();
          this.leadObj.customer = this.customerObj;
          this.leadObj.broker = this.brokerObj;
          this.leadObj.seller = this.sellerObj;
          this.leadObj.leadInventoryItems = new Array<InvItem>();
          if (this.listInventoryItems.length > 0)
            for (let index = 0; index < this.listInventoryItems.length; index++) {
              const element = this.listInventoryItems[index];
              let invItem = new InvItem();
              invItem.invId = element.invId;
              this.leadObj.leadInventoryItems.push(invItem);
            }
          this.leadObj.leadSummary = new LeadSummary();
          this.leadObj.leadSummary.totalAmount = this.gridDetailSummary.totalAmount;
          this.leadObj.leadSummary.totalCarat = this.gridDetailSummary.totalCarat;
          this.leadObj.leadSummary.totalPcs = this.gridDetailSummary.totalPcs;

          let response: string = await this.leadService.leadInsert(this.leadObj);

          this.resetForm(form);
          if (response) {
            this.spinnerService.hide();
            this.utilityService.showNotification(`You have been genrated lead successfully!`);
            if (action)
              this.toggle.emit();
            else
              this.toggle.emit(false)
          }
        }
        else
          await this.updateLeadCommonMethod();
      }
      else {
        this.spinnerService.hide();
        Object.keys(form.controls).forEach((key) => {
          form.controls[key].markAsTouched();
        });
      }
    } catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async updateLeadCommonMethod() {
    if (this.leadObj.leadStatus.toLowerCase() != LeadStatus.Approved.toString().toLowerCase()) {
      this.leadObj.leadInventoryItems = new Array<InvItem>();
      if (this.listInventoryItems.length > 0) {
        for (let index = 0; index < this.listInventoryItems.length; index++) {
          const element = this.listInventoryItems[index];
          let invItem = new InvItem();
          invItem.invId = element.invId;
          invItem.isRejected = element.isRejected;
          this.leadObj.leadInventoryItems.push(invItem);

        }
      }
    }
    // this.calculateGridSummary(this.listInventoryItems);
    this.gridDetailSummary = this.calculateSummaryAll(this.listInventoryItems);
    this.leadObj.leadSummary = new LeadSummary();
    this.leadObj.leadSummary.totalAmount = this.gridDetailSummary.totalAmount;
    this.leadObj.leadSummary.totalCarat = this.gridDetailSummary.totalCarat;
    this.leadObj.leadSummary.totalPcs = this.gridDetailSummary.totalPcs;

    let response = await this.leadService.leadUpdate(this.leadObj);
    if (response) {
      if (this.listInventoryItems.length == 0) {
        this.gridInventoryData = [];
        this.loadLeadInventoryGrid(this.listInventoryItems)
      }
      else
        this.loadInventory(this.listInventoryItems);

      this.isAddLead = false;
      this.toggle.emit()
      this.utilityService.showNotification("You have been updated lead successfully!")
    }
  }

  public resetForm(form?: NgForm) {
    form?.reset();
  }
  //#endregion

  //#region Dialog Methods

  public closeLeadDialog() {
    this.toggle.emit();
  }

  public async toggleAddLeadDialog() {
    this.gridInventoryData = [];
    this.listInventoryItems = [];
    this.leadObj = new Lead();
    this.customerObj = new CustomerDNorm();
    this.brokerObj = new BrokerDNrom();
    this.selectedBrokerItem = undefined;
    this.selectedCustomerItem = undefined as any;


    if (this.leadListInvInput && this.leadListInvInput.length > 0)
      this.loadInventory(this.leadListInvInput);

    this.loadLeadInventoryGrid(this.listInventoryItems);
    this.editCardStatus = LeadStatus.Proposal.toString().toLowerCase()
    await this.getGridConfiguration();
    this.isEditLead = false;
    setTimeout(() => {
      this.onAddStones();
      this.onCertificate();
    }, 1000);
  }

  public async editLead(leadItem: Lead, action: boolean, leadTitle: string) {
    try {
      this.mySelection = [];
      this.leadTitle = leadTitle;
      this.editCardStatus = leadItem.leadStatus.toLowerCase();
      this.skip = 0;
      if (this.editCardStatus.toLowerCase() == LeadStatus.Proposal.toString().toLowerCase())
        setTimeout(() => {
          this.onAddStones();
          this.onCertificate();
        }, 1000);

      if (this.editCardStatus.toLowerCase() == LeadStatus.Proposal.toString().toLowerCase() || this.editCardStatus.toLowerCase() == LeadStatus.Order.toString().toLowerCase())
        setTimeout(() => {
          this.onSelectionStones()
        }, 1000);

      this.leadObj = new Lead();
      this.leadObj = JSON.parse(JSON.stringify(leadItem));

      let leadInvItems = new Array<InvItem>();
      if (this.leadObj.leadStatus.toLowerCase() != LeadStatus.Approved.toString().toLowerCase())
        leadInvItems = await this.leadService.getStonesByLeadId(leadItem.id, false);
      else {
        leadInvItems = await this.leadService.getStonesByLeadId(leadItem.id, " " as any);
        leadInvItems = leadInvItems.filter(x => !x.isRejected);
      }
      if (leadInvItems)
        this.leadObj.leadInventoryItems = leadInvItems;
      this.customerObj = leadItem.customer;
      this.brokerObj = leadItem.broker;
      this.sellerObj = leadItem.seller;
      await this.getGridConfiguration();
      this.listInventoryItems = this.leadObj.leadInventoryItems;
      this.loadInventory(this.leadObj.leadInventoryItems)
      this.isEditLead = action;

    } catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }

  }

  //#endregion


  /* #region Summary Calculation  */
  public calculateSummaryAll(inventoryItems: InvItem[]) {
    let leadSummaryLocal = new LeadSummary();
    leadSummaryLocal.totalCarat = inventoryItems.reduce((acc, cur) => acc + cur.weight, 0);
    leadSummaryLocal.totalAmount = inventoryItems.reduce((acc, cur) => acc + (cur.price.netAmount ? cur.price.netAmount : 0), 0);
    leadSummaryLocal.totalRAP = inventoryItems.reduce((acc, cur) => acc + ((cur.price.rap ?? 0) * (cur.weight)), 0) ?? 0;

    let rapCount = inventoryItems.reduce((acc, cur) => acc + (cur.price.rap ?? 0), 0);

    leadSummaryLocal.totalPcs = inventoryItems.length;
    leadSummaryLocal.avgRap = rapCount / leadSummaryLocal.totalPcs;

    leadSummaryLocal.avgDiscPer = (((leadSummaryLocal.totalAmount / leadSummaryLocal.totalRAP) * 100) - 100);
    leadSummaryLocal.perCarat = leadSummaryLocal.totalAmount / leadSummaryLocal.totalCarat;

    /* #region  VOW calculation */
    let totalVowValue = Number((leadSummaryLocal.totalAmount + this.lastPurchase).toFixed(2));
    let vowDiscount = 0;
    if (this.schemes) {
      let schemeDetail = this.schemes.details.find(c => c.from <= totalVowValue && totalVowValue <= c.to);
      if (schemeDetail)
        vowDiscount = schemeDetail?.discount;
      leadSummaryLocal.totalVOWDiscPer = vowDiscount;
    }
    /* #endregion */

    if (this.leadObj.leadSummary.totalVOWDiscPer)
      leadSummaryLocal.totalVOWDiscPer = this.leadObj.leadSummary.totalVOWDiscPer;

    if (this.leadObj.leadSummary.totalAmount)
      leadSummaryLocal.totalVOWDiscAmount = this.leadObj.leadSummary.totalVOWDiscAmount;


    leadSummaryLocal.totalVOWDiscAmount = (leadSummaryLocal.totalAmount * leadSummaryLocal.totalVOWDiscPer) / 100;
    leadSummaryLocal.totalPayableAmount = leadSummaryLocal.totalAmount - leadSummaryLocal.totalVOWDiscAmount;
    leadSummaryLocal.discPer = leadSummaryLocal.totalPayableAmount / leadSummaryLocal.totalRAP * 100 - 100;
    leadSummaryLocal.pricePerCarat = leadSummaryLocal.avgRap + (leadSummaryLocal.avgRap * leadSummaryLocal.discPer / 100);

    return leadSummaryLocal;
  }
  /* #endregion */

  //#region Grid Config
  public openGridConfigDialog(): void {
    this.isGridConfig = true;
    if (this.editCardStatus.toLowerCase() == LeadStatus.Approved.toString().toLowerCase())
      this.gridName = "LeadInventoryGridApproved";
    else
      this.gridName = "LeadInventoryGrid";
  }

  public setNewGridConfig(gridConfig: GridConfig) {
    try {
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
    catch (error: any) {

      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async getGridConfiguration() {
    try {
      this.spinnerService.show();
      this.gridConfig = await this.configService.getGridConfig(this.fxCredential.id, "LeadInventory", "LeadInventoryGrid");
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
        this.gridMasterConfigResponse = await this.configService.getMasterGridConfig("LeadInventory", "LeadInventoryGrid");
        if (this.gridMasterConfigResponse)
          this.fields = this.gridMasterConfigResponse.gridDetail;
        else
          this.fields = await this.gridPropertiesService.getLeadInventoryItems();
      }

      if (this.leadObj.leadStatus.toLowerCase() == LeadStatus.Approved.toString().toLowerCase() || this.leadObj.leadStatus.toLowerCase() == LeadStatus.Rejected.toString().toLowerCase())
        this.fields = this.fields.filter(c => c.title.toLowerCase() != "checkbox");
      this.spinnerService.hide();
    }
    catch (error: any) {

      this.alertDialogService.show(error);
      this.spinnerService.hide();
    }
  }
  //#endregion
  public selectAllInventories(event: string) {
    if (event.toLowerCase() == 'checked')
      this.mySelection = this.listInventoryItems.filter(a => !a.isRejected).map(z => z.invId);
    else
      this.mySelection = [];

    this.setListOfAccpectedStones();
  }


  public onSelectChange() {
    this.setListOfAccpectedStones();
  }

  //#region Delete Inventory
  public openDeleteDialog() {
    try {
      let message: string = "";
      message = this.mySelection.length == 1 ? "Stone has been deleted successfully!" : "Stones have been deleted successfully!";
      this.alertDialogService.ConfirmYesNo("Are you sure you want to delete?", "Delete")
        .subscribe(async (res: any) => {
          if (res.flag) {
            if (this.leadObj.id)
              this.toggleRMReasonDialog();
            else {
              this.mySelection.forEach(z => {
                let index = this.listInventoryItems.findIndex(a => a.invId == z);
                if (index >= 0)
                  this.listInventoryItems.splice(index, 1)
              })

              if (this.listInventoryItems.length == 0) {
                this.gridInventoryData = [];
                this.loadLeadInventoryGrid(this.listInventoryItems)
                this.mySelection = [];

              }
              else
                this.loadInventory(this.listInventoryItems);

            }

          }
        })
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }

  public toggleRMReasonDialog() {
    this.isRMReason = !this.isRMReason;

  }

  public async submitReason() {
    try {
      if (this.removeReasonModel) {
        this.rejectedStone = new Array<RejectedStone>();
        this.spinnerService.show();
        this.mySelection.forEach(z => {
          let index = this.listInventoryItems.findIndex(a => a.invId == z);
          if (index >= 0) {
            this.listInventoryItems[index].removeStoneReason = this.removeReasonModel;
            this.listInventoryItems[index].isRejected = true;
            let rejectedStoneObj = new RejectedStone();

            rejectedStoneObj.invId = this.listInventoryItems[index].invId;
            rejectedStoneObj.stoneId = this.listInventoryItems[index].stoneId;
            rejectedStoneObj.rfid = this.listInventoryItems[index].stoneId;
            rejectedStoneObj.shape = this.listInventoryItems[index].shape;
            rejectedStoneObj.weight = this.listInventoryItems[index].weight;
            rejectedStoneObj.color = this.listInventoryItems[index].color;
            rejectedStoneObj.clarity = this.listInventoryItems[index].clarity;
            rejectedStoneObj.cut = this.listInventoryItems[index].cut;
            rejectedStoneObj.polish = this.listInventoryItems[index].polish;
            rejectedStoneObj.symmetry = this.listInventoryItems[index].symmetry;
            rejectedStoneObj.fluorescence = this.listInventoryItems[index].fluorescence;
            rejectedStoneObj.location = this.listInventoryItems[index].location;
            rejectedStoneObj.certificateNo = this.listInventoryItems[index].certificateNo;
            rejectedStoneObj.removeStoneReason = this.removeReasonModel;
            this.rejectedStone.push(rejectedStoneObj);
          }
        })

        this.leadObj.leadInventoryItems = this.listInventoryItems;
        this.gridDetailSummary = this.calculateSummaryAll(this.listInventoryItems);
        if (this.leadObj.leadStatus.toLowerCase() == LeadStatus.Order.toString().toLowerCase()) {
          let leadStonesDNorm = new Array<InvItem>();
          this.gridAcceptedSummary = this.calculateSummaryAll(leadStonesDNorm);
        }
        this.leadObj.leadSummary = new LeadSummary();
        this.leadObj.leadSummary.totalAmount = this.gridDetailSummary.totalAmount;
        this.leadObj.leadSummary.totalCarat = this.gridDetailSummary.totalCarat;
        this.leadObj.leadSummary.totalPcs = this.gridDetailSummary.totalPcs;

        if (this.leadObj.leadInventoryItems.length == this.leadObj.leadInventoryItems.filter(z => z.isRejected).length)
          this.leadObj.leadStatus = LeadStatus.Rejected.toString().toLowerCase();
        let responseLeadUpdate = await this.leadService.leadUpdate(this.leadObj);
        if (responseLeadUpdate) {
          await this.inventoryService.updateInventoryHoldUnHoldById(this.leadObj.leadInventoryItems.filter(z => z.isRejected).map(x => x.invId), false);
          let responseRejectedStone: RejectedStone[] = await this.rejectedStoneService.InsertList(this.rejectedStone);
          if (responseRejectedStone) {
            this.toggle.emit(false);
            this.listInventoryItems = this.listInventoryItems.filter(z => !z.isRejected);
            if (this.listInventoryItems.length == 0) {
              this.gridInventoryData = [];
              this.loadLeadInventoryGrid(this.listInventoryItems)
            }
            else
              this.loadInventory(this.listInventoryItems);
          }
          this.mySelection = [];
          this.removeReasonModel = '';
          this.toggleRMReasonDialog();
        }
      }
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }

  public async updateInventoryStoneRemoveReason(stoneIds: string[], reason: string) {
    try {
      let fetchInventoryItems: InventoryItems[] = await this.inventoryService.getInventoryByStoneIds(stoneIds);
      let updatedReasonArray: InventoryItems[] = [];
      for (let index = 0; index < fetchInventoryItems.length; index++) {
        const element = fetchInventoryItems[index];
        if ((element.reasonToRemove == null) || (element.reasonToRemove.toLowerCase() != reason.toLowerCase())) {
          element.reasonToRemove = reason;
          updatedReasonArray.push(element);
        }
      }
      if (updatedReasonArray.length > 0)
        return await this.inventoryService.updateOnlyInventoryList(updatedReasonArray) as any;
      else
        return true;
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }


  //#endregion

  /* #region  Editablebrokrage */
  public toggleEditBrokerage() {

    this.isEditableBrokerage = !this.isEditableBrokerage;
    if (this.isEditableBrokerage)
      this.brokerageValue = JSON.parse(JSON.stringify(this.brokerObj?.brokrage) ?? 0) ?? 0;
    else
      this.brokerageValue = 0;
  }

  public async changeBrokerage() {

    let cloneBrokerObj = JSON.parse(JSON.stringify(this.brokerObj));
    this.brokerObj.brokrage = Number(this.brokerageValue);

    if (this.leadObj.id) {
      this.leadObj.broker.brokrage = Number(this.brokerageValue);
      let response = await this.leadService.leadUpdate(this.leadObj);
      if (response)
        this.utilityService.showNotification('Brokerage updated successfully!');
      else
        this.brokerObj.brokrage = cloneBrokerObj.brokrage;
    }

    this.toggleEditBrokerage();
  }
  /* #endregion */

  /* #region  SplitLead */
  public setListOfAccpectedStones() {
    this.listAcceptedInventoryItems = Array<InvItem>();
    this.listAcceptedInventoryItems = this.listInventoryItems.filter(o => this.mySelection.some((a) => a == o.invId));
    this.gridAcceptedSummary = new LeadSummary();
    this.gridAcceptedSummary = this.calculateSummaryAll(this.listAcceptedInventoryItems);

  }


  public submitSplitLead() {
    let confirmationMessage: string = "";
    let onlyApprove: boolean = false;
    if (this.listAcceptedInventoryItems.length == this.listInventoryItems.length)
      onlyApprove = true;

    if (onlyApprove)
      confirmationMessage = `Are you sure you want to approve a lead?`;
    else
      confirmationMessage = `Are you sure you want to generate split an order for ${this.listAcceptedInventoryItems.length} stones?`;

    this.alertDialogService.ConfirmYesNo(confirmationMessage, "Lead")
      .subscribe(async (res: any) => {
        if (res.flag) {
          let leadInventoryItemsTOUpdate: InvItem[] = await this.leadService.getStonesByLeadId(this.leadObj.id, " " as any);

          if (!onlyApprove) {
            let leadNewObj = new Lead();
            leadNewObj.customer = this.leadObj.customer;
            leadNewObj.broker = this.leadObj.broker;
            leadNewObj.seller = this.leadObj.seller;
            leadNewObj.leadStatus = LeadStatus.Approved.toString().toLowerCase();
            leadNewObj.leadInventoryItems = this.listAcceptedInventoryItems;
            leadNewObj.leadSummary = this.gridAcceptedSummary;
            leadNewObj.expiredDays = ((this.leadObj.daysLeft ?? this.leadObj.expiredDays) + 1);
            let response = await this.leadService.leadInsert(leadNewObj);
            if (response) {
              this.listInventoryItems = leadInventoryItemsTOUpdate.filter(o => !this.listAcceptedInventoryItems.some((a) => a.invId == o.invId));
              await this.updateLeadCommonMethod();
            }
          }
          else {
            this.leadObj.leadStatus = LeadStatus.Approved.toString().toLowerCase();
            this.leadObj.leadInventoryItems = leadInventoryItemsTOUpdate;
            this.listInventoryItems = leadInventoryItemsTOUpdate;
            await this.updateLeadCommonMethod();
          }

        }
      })

  }
  /* #endregion */

  /* #region  toggle Rejected Stone List */
  public async toggleRejectedStone() {

    this.visibleRejectedStone = !this.visibleRejectedStone;

    let leadInvItems = new Array<InvItem>();
    if (this.visibleRejectedStone) {
      if (this.leadObj.leadStatus.toLowerCase() != LeadStatus.Approved.toString().toLowerCase())
        leadInvItems = await this.leadService.getStonesByLeadId(this.leadObj.id, true);
      else {
        leadInvItems = await this.leadService.getStonesByLeadId(this.leadObj.id, " " as any);
        leadInvItems = leadInvItems.filter(o => o.isRejected);
      }
      if (leadInvItems.length > 0)
        this.fields = this.fields.filter(o => o.title.toLowerCase() != 'checkbox');
    }
    else {
      if (this.leadObj.leadStatus.toLowerCase() != LeadStatus.Approved.toString().toLowerCase())
        leadInvItems = await this.leadService.getStonesByLeadId(this.leadObj.id, false);
      else {
        leadInvItems = await this.leadService.getStonesByLeadId(this.leadObj.id, " " as any);
        leadInvItems = leadInvItems.filter(o => !o.isRejected);
      }

      this.fields = this.gridPropertiesService.getLeadInventoryItems();
      if (this.leadObj.leadStatus.toLowerCase() == LeadStatus.Approved.toString().toLowerCase())
        this.fields = this.fields.filter(o => o.title.toLowerCase() != 'checkbox');
    }

    if (leadInvItems.length > 0) {
      this.leadObj.leadInventoryItems = leadInvItems;
      this.listInventoryItems = this.leadObj.leadInventoryItems;
      this.loadInventory(this.leadObj.leadInventoryItems)
    }
    else {
      this.visibleRejectedStone = false;
      this.alertDialogService.show('There is no rejected stone for this lead.');
    }

  }
  /* #endregion */

  public getTitle(field: string) {
    return this.fields.find(f => f.propertyName.toLowerCase() == field.toLowerCase())?.title ?? field;
  }

  public async getSchemes(isOnline: boolean) {
    return await this.schemeService.getOnlineSchemeAsync(isOnline);
  }

  //#region Select Inv from Excel
  public async onSelectInvFromExcelFile(event: Event) {
    try {
      let acceptedFiles: string[] = []
      const target = event.target as HTMLInputElement;
      if (target.accept) {
        acceptedFiles = target.accept.split(',').map(function (item) {
          return item.trim();
        });
      }

      if (target.files && target.files.length) {
        if (acceptedFiles.indexOf(target.files[0].type) == -1) {
          this.alertDialogService.show(`Please select valid file.`);
          return;
        }

        let file = target.files[0];
        let fileReader = new FileReader();
        this.spinnerService.show();
        fileReader.onload = async (e) => {

          var arrayBuffer: any = fileReader.result;
          let data = new Uint8Array(arrayBuffer);
          let arr = new Array();

          for (let i = 0; i != data.length; ++i)
            arr[i] = String.fromCharCode(data[i]);

          let workbook = xlsx.read(arr.join(""), { type: "binary" });
          var inventoryFetchExcelItems = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]) as any;
          let finalInventoryItems: InventoryItems[] = [];
          for (let index = 0; index < inventoryFetchExcelItems.length; index++) {
            let element = inventoryFetchExcelItems[index];

            element = Object.keys(element).reduce((accumulator: any, key: any) => {
              accumulator[key.toLowerCase()] = element[key];
              return accumulator;
            }, {});
            finalInventoryItems.push(element);
          }

          let stoneIds = finalInventoryItems.map((x: any) => {
            if (x.hasOwnProperty("stoneid"))
              return x.stoneid.toLowerCase()
          });
          stoneIds = stoneIds.filter((x: any, i: any) => (x != undefined && x != null && x != ''));

          if (stoneIds && stoneIds.length > 0) {
            this.mySelection = this.listInventoryItems.filter(o => stoneIds.some((a) => a.toLowerCase() == o.stoneId.toLowerCase())).map(o => o.invId);
            if (this.mySelection.length == 0)
              this.alertDialogService.show(`No stone found in the selected file.`);
          }
          else {
            this.mySelection = [];
            this.alertDialogService.show(`Stone Ids are not found in excel sheet.`);
          }

          if (this.leadObj.leadStatus.toLowerCase() == LeadStatus.Order.toLowerCase() && this.mySelection.length > 0)
            this.setListOfAccpectedStones();
          this.spinnerService.hide();
        }

        fileReader.readAsArrayBuffer(file);
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }
  //#endregion
}
