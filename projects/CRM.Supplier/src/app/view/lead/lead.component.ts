import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { AggregateDescriptor, DataResult, GroupDescriptor, process } from '@progress/kendo-data-query';
import { Broker, Customer, CustomerCriteria, GridDetailConfig, Order, OrderInventoryItems, Party, SellerDNorm, Summary } from 'common/businessobjects';
import { AccountConfig, fxCredential, GridConfig, GridMasterConfig, IdentityDNorm, InventoryItems, Lead, LeadResponse, Memo, Notifications, PriceDNorm } from 'common/entities';
import { Cart } from 'common/entities/cart/cart';
import { AppPreloadService, CartService, ConfigService, GridPropertiesService, LeadService, NotificationService, CustomerService, UtilityService, InventoryService, AccountconfigurationService, BrokerService, MemoService, OrderService, PartyService, VolumeDiscountService } from 'common/services';
import { AlertdialogService } from 'common/views';
import { DragulaService } from 'ng2-dragula';
import { NgxSpinnerService } from 'ngx-spinner';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.css']
})

export class LeadComponent implements OnInit, OnDestroy {
  @ViewChild('StoneTxtInput') stoneTxtInput!: ElementRef;
  @ViewChild('CertificateTxtInput') certificateTxtInput!: ElementRef;
  @ViewChild('PlaceOrderTxtInput') placeOrderTxtInput!: ElementRef;

  public disabledFlag: boolean = true;
  public groups: GroupDescriptor[] = [];
  public aggregates: AggregateDescriptor[] = [{ field: 'weight', aggregate: 'sum' },
  { field: 'netAmount', aggregate: 'sum' }];
  public gridInventoryData: OrderInventoryItems[] = [];
  public gridCartInventoryData: InventoryItems[] = [];
  public gridViewLeadInventory!: DataResult;
  public gridViewCartInventory!: DataResult;
  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains'
  };

  public pageSize = 8;
  public pageSizeCart = 15;
  public skip = 0;
  public skipCart = 0;
  public fields!: GridDetailConfig[];
  public fieldsInv!: GridDetailConfig[];

  public gridConfig!: GridConfig;
  public gridMasterConfigResponse!: GridMasterConfig;
  public isGridConfig: boolean = false;
  public totalPcs = 0;
  public totalCarat = 0;
  public totalAmount = 0;
  public avgDiscPer = 0;
  public totalRAP = 0;
  public perCarat = 0;
  public avgRap = 0;
  public selectableSettings: SelectableSettings = {
    mode: 'multiple',
    checkboxOnly: true
  };

  public fxCredential!: fxCredential;
  public isDetailsWindow: boolean = false;
  public isAddLead: boolean = false;

  public dragBoard = 'LeadBoard';
  public tasksQualificationList: any[] = [];
  public tasksProposalList: any[] = [];
  public tasksPlaceOrderList: any[] = [];
  public tasksApprovedList: any[] = [];
  public tasksDeliveredList: any[] = [];
  public tasksRejectedList: any[] = [];
  public tasksCartList: any[] = [];

  public collapeQualification: boolean = true;
  public collapeRejected: boolean = true;
  public collapeCart: boolean = false;

  public listCustomerItems: Array<{ text: string; companyName: string; value: string }> = [];
  public customerItems: Customer[] = [];
  public selectedCustomerItem: string = "";
  public customerObj: Customer = new Customer();

  public listBrokerItems: Array<{ text: string; value: string }> = [];
  public brokerItems: Broker[] = [];
  public selectedBrokerItem?: { text: string, value: string };
  public brokerObj: Broker = new Broker();
  public listInventoryItems: OrderInventoryItems[] = [];
  public listCartInventoryItems: InventoryItems[] = [];

  public sellerObj = new SellerDNorm();
  public leadObj = new Lead();
  public subs = new Subscription();
  public isEditLead: boolean = false;
  public isViewCart: boolean = false;
  public isQcReason: boolean = false;

  public isNegotiateFlag: boolean = false;
  public allLeads: LeadResponse[] = [];

  public reqDisMain: number = 0;
  public isShowCheckBoxAll: boolean = true;
  public mySelection: string[] = [];
  public subjectReqDis: Subject<OrderInventoryItems> = new Subject();
  public editCardStatus: string = "";
  public gridName: string = '';
  public message: Notifications = new Notifications();
  public gridDetailSummary: Summary = new Summary();
  public cloneStatus: string = "";

  public leadTitle: string = "";
  public isRMReason: boolean = false;
  public removeReasonModel: string = "";
  public accountConfig = new AccountConfig();
  public listRemoveReasonItems: Array<string> = new Array<string>();
  public listQCReasonItems: Array<string> = new Array<string>();
  public qcReasonModel: string = "";
  public memoObj = new Memo();
  public partyObj: Party = new Party();
  public isEditableBrokerage: boolean = false;
  public brokerageValue: number = 0;

  constructor(public dragulaService: DragulaService,
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
    public orderService: OrderService,
    public notificationService: NotificationService,
    public volumeDiscountService: VolumeDiscountService,
    public cartService: CartService,
    public accountconfigurationService: AccountconfigurationService,
    public memoService: MemoService,
    public partyService: PartyService,


  ) {
    this.notificationService.getMessage();
    this.loadLeadDragSeriveMethods();
  }

  async ngOnInit() {
    await this.loadDefaultMethods()
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.dragulaService.destroy(this.dragBoard);
  }

  public async loadDefaultMethods() {
    try {
      this.spinnerService.show();
      this.fxCredential = await this.appPreloadService.fetchFxCredentials();
      if (!this.fxCredential)
        this.router.navigate(["login"]);
      await this.loadLeads();
      await this.loadCartsValue();
      this.sellerObj = await this.leadService.getSellerDNormById(this.fxCredential.id)
      await this.loadAccountConfiguration();
      await this.loadBrokers();
      this.reqDisChanges();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  //#region Lead kanban Board
  public loadLeadDragSeriveMethods() {


    this.dragulaService.createGroup(this.dragBoard, {
      //#region code to disable dragging of the element
      moves: function (el, source, handle, sibling) {
        return false; // elements are always draggable by default
      },
      //#endregion
      accepts: (el, target, source, sibling) => {
        let accepted: boolean = true;
        if (source?.id != 'qualification')
          accepted = (target?.id != 'qualification');

        return accepted;
      }
    });

    this.subs.add(this.dragulaService.dropModel(this.dragBoard)
      .subscribe(async (value) => {
        try {
          this.cloneStatus = value.item.leadStatus.toLowerCase().trim();
          if (value.target.id.toLowerCase() == 'qualification')
            value.item.leadStatus = 'qualification';
          else if (value.target.id.toLowerCase() == 'proposal')
            value.item.leadStatus = 'proposal';
          else if (value.target.id.toLowerCase() == 'placeorder')
            value.item.leadStatus = 'placeorder';
          else if (value.target.id.toLowerCase() == 'approved')
            value.item.leadStatus = 'approved';
          else if (value.target.id.toLowerCase() == 'rejected')
            value.item.leadStatus = 'rejected';
          let leadInvItems = await this.leadService.getStonesByLeadId(value.item.id);

          let responseUpdate: boolean = await this.leadService.updateStatus(value.item.id, value.item.leadStatus);
          if (responseUpdate) {
            if (value.item.leadStatus == 'approved') {
              let orderFinal: Order[] = new Array<Order>();
              let identity = new IdentityDNorm();
              identity.id = this.fxCredential.id;
              identity.name = this.fxCredential.fullName;
              identity.type = 'Employee' ?? '';
              for (let index = 0; index < leadInvItems.length; index++) {
                const element = leadInvItems[index];
                let lastOrderNo = await this.orderService.getLastOrderNo();
                let orderObj = new Order();

                orderObj.orderNo = lastOrderNo + 1;
                orderObj.leadNo = value.item.leadNo;
                orderObj.leadId = value.item.id;
                orderObj.customer = value.item.customer;
                orderObj.broker = value.item.broker;
                leadInvItems[index].isHold = true;
                if (leadInvItems[index].isLead)
                  leadInvItems[index].orderPrice = leadInvItems[index].reqPrice;
                else
                  leadInvItems[index].orderPrice = leadInvItems[index].price;

                orderObj.orderPrice = leadInvItems[index].orderPrice;
                orderObj.identity = identity;
                orderObj.orderInventoryItem = JSON.parse(JSON.stringify(element))
                orderFinal.push(orderObj);

              }
              if (orderFinal && orderFinal.length > 0) {
                let orderResponse = await this.orderService.orderRequest(orderFinal);
                if (orderResponse) {
                  let updateList: boolean = await this.leadService.updateLeadInventory(value.item.id, leadInvItems);
                  if (updateList) {
                    let index = this.tasksApprovedList.findIndex(x => x.id == value.item.id);
                    if (index > -1)
                      this.tasksApprovedList[index].totalAmount = leadInvItems.reduce((a, b) => a + (b.orderPrice.netAmount ?? 0), 0);

                    await this.updateInventoryStatusOrIsHold(leadInvItems, 'Sold', true);

                  }
                }
              }
            }


            if (this.cloneStatus.toLowerCase() == 'approved')
              await this.deleteOrderByLead(value.item, leadInvItems, this.cloneStatus);


            if (value.item.leadStatus.toLowerCase() == 'placeorder')
              await this.holdOrUnholdLeadInventory(value, leadInvItems, true);

            if (value.item.leadStatus.toLowerCase() == 'proposal' || value.item.leadStatus.toLowerCase() == 'rejected')
              await this.holdOrUnholdLeadInventory(value, leadInvItems, false);

          }
        }
        catch (error: any) {

          let responseUpdate: boolean = await this.leadService.updateStatus(value.item.id, this.cloneStatus);
          if (responseUpdate)
            this.loadLeads();
          let leadInvItems = await this.leadService.getStonesByLeadId(value.item.id);

          await this.deleteOrderByLead(value.item, leadInvItems, value.item.leadStatus);

          this.alertDialogService.show(error.error.title);
        }
      })
    );

  }

  public async holdOrUnholdLeadInventory(value: any, leadInvItems: OrderInventoryItems[], isHold: boolean) {
    let updateList: boolean = await this.leadService.updateLeadInventory(value.item.id, leadInvItems);
    if (updateList)
      await this.updateInventoryStatusOrIsHold(leadInvItems, "", isHold);
  }

  public async updateInventoryStatusOrIsHold(leadInvItems: OrderInventoryItems[], status: string, isHold: boolean) {
    try {
      let fetchInventoryItems: InventoryItems[] = await this.inventoryService.getInventoriesByStoneIds(leadInvItems.map(x => x.stoneId).join(','), !isHold)
      for (let index = 0; index < fetchInventoryItems.length; index++) {
        const element = fetchInventoryItems[index];
        if (status != null && status != '' && status != undefined)
          element.status = status;
        if (isHold != null && isHold != undefined)
          element.isHold = isHold;
      }
      await this.inventoryService.updateInventoryListData(fetchInventoryItems);
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async deleteOrderByLead(item: Lead, inventoryItems: OrderInventoryItems[], leadStatus: string) {
    try {
      if (leadStatus == 'approved') {
        let deleteResponse = await this.orderService.deleteOrderByLeadId(item.id);
        if (deleteResponse)
          await this.updateInventoryStatusOrIsHold(inventoryItems, 'Stock', false);
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async loadLeads() {
    try {
      this.tasksQualificationList = [];
      this.tasksProposalList = [];
      this.tasksPlaceOrderList = [];
      this.tasksApprovedList = [];
      this.tasksDeliveredList = [];
      this.tasksRejectedList = [];

      if (this.fxCredential.origin.toLowerCase() == 'admin')
        this.allLeads = await this.leadService.getAllLeads();
      else
        this.allLeads = await this.leadService.getAllLeads(this.fxCredential.id);

      if (this.allLeads && this.allLeads.length > 0) {
        for (let index = 0; index < this.allLeads.length; index++) {
          const element = this.allLeads[index];
          if (element.leadStatus.trim().toLowerCase() == "qualification")
            this.tasksQualificationList.push(element);
          else if (element.leadStatus.trim().toLowerCase() == "proposal")
            this.tasksProposalList.push(element);
          else if (element.leadStatus.trim().toLowerCase() == "placeorder")
            this.tasksPlaceOrderList.push(element);
          else if (element.leadStatus.trim().toLowerCase() == "approved")
            this.tasksApprovedList.push(element);
          else if (element.leadStatus.trim().toLowerCase() == "delivered")
            this.tasksDeliveredList.push(element);
          else if (element.leadStatus.trim().toLowerCase() == "rejected" || element.leadStatus.trim().toLowerCase() == "expired")
            this.tasksRejectedList.push(element);
        }
      }
      this.spinnerService.hide();


    } catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);

    }

  }

  public async loadAccountConfiguration() {
    try {
      this.spinnerService.show();
      this.accountConfig = await this.accountconfigurationService.getAccountConfiguration();
      if (this.accountConfig && this.accountConfig.removeStoneReasons.length > 0)
        this.listRemoveReasonItems = this.accountConfig.removeStoneReasons.map(x => x.reasonName);

      if (this.accountConfig && this.accountConfig.qcReasons.length > 0)
        this.listQCReasonItems = this.accountConfig.qcReasons.map(x => x.reasonName);

      this.spinnerService.hide();
    } catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async loadBrokers() {
    try {

      this.brokerItems = await this.brokerService.getAllBrokers();
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
          this.selectedCustomerItem = fetchCustomer?.companyName + '-' + fetchCustomer?.fullName ?? '' as any;
        }, 0);

        this.customerObj = fetchCustomer ?? new Customer();

      }
    }
    else
      this.customerObj = new Customer();

  }

  public async handleCustomerFilter(value: any) {
    try {
      let customers: Customer[] = await this.customerService.getAllCustomersName(value);
      this.listCustomerItems = [];
      this.customerItems = customers;
      this.customerItems.reverse().forEach(z => { this.listCustomerItems.push({ text: z.fullName, companyName: z.companyName, value: z.id }); });
      this.spinnerService.hide();
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
      let inventory: any = await this.inventoryService.getInventoriesByStoneIds(stoneId, false);
      this.loadInventory(inventory, true);  //load inventory
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }

  }

  public async loadInventoryByCertificate(certificateIds: string[]) {
    try {

      let inventory: any = await this.inventoryService.getInventoryByCertificateIds(certificateIds);
      this.loadInventory(inventory);  //load inventory
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }

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
        this.summaryCalculation();
      }
    }
    else
      if (isStoneAdd)
        this.alertDialogService.show("Stone(s) not Found");
    this.spinnerService.hide();
  }

  public async loadLeadInventoryGrid(leadInventoryItems: OrderInventoryItems[]) {
    if (leadInventoryItems) {
      this.gridDetailSummary = new Summary();
      this.calculateGridSummary(leadInventoryItems);
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

  public AddPlaceOrderDiscount() {
    try {
      if (this.placeOrderTxtInput.nativeElement) {
        fromEvent(this.placeOrderTxtInput.nativeElement, 'keyup').pipe(
          map((event: any) => {
            return event.target.value;
          })
          , filter(res => res.length > 0)
          , debounceTime(1500)
        ).subscribe((discoutAmount: number) => {
          if (discoutAmount != '-' as any) {
            this.reqDisMain = discoutAmount;
            if (this.leadObj.leadInventoryItems.length > 0) {
              for (let i = 0; i < this.listInventoryItems.length; i++) {
                const element = this.listInventoryItems[i];
                element.reqDis = (element.reqDis ? Number(element.reqDis) : 0) + Number(discoutAmount);
                this.calculateRapPricing(element);
              }
            }
            this.summaryCalculation();

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
          this.leadObj.leadInventoryItems = this.listInventoryItems;
          this.leadObj.summary = new Summary();
          this.leadObj.summary.totalAmount = this.totalAmount;
          this.leadObj.summary.totalCarat = this.totalCarat;
          this.leadObj.summary.totalPcs = this.totalPcs;
          this.leadObj.summary.avgDiscPer = this.avgDiscPer;
          this.leadObj.summary.perCarat = this.perCarat;
          this.leadObj.summary.totalRAP = this.totalRAP;
          this.leadObj.summary.avgRap = this.avgRap;
          if (this.allLeads && this.allLeads.length > 0)
            this.leadObj.leadNo = this.allLeads[this.allLeads.length - 1].leadNo + 1;

          let response: LeadResponse = await this.leadService.leadInsert(this.leadObj);
          if (action)
            this.isAddLead = false;
          this.resetForm(form);
          if (response) {
            this.spinnerService.hide();
            this.utilityService.showNotification(`You have been genrated lead successfully!`);
            if (response.leadStatus.toLowerCase() == "proposal") {
              this.tasksProposalList.push(response);
              this.allLeads.push(response);
            }

          }
        }
        else {
          this.leadObj.leadInventoryItems = this.listInventoryItems;
          this.leadObj.summary = new Summary();
          this.leadObj.summary.totalAmount = this.totalAmount;
          this.leadObj.summary.totalCarat = this.totalCarat;
          this.leadObj.summary.totalPcs = this.totalPcs;
          this.leadObj.summary.avgDiscPer = this.avgDiscPer;
          this.leadObj.summary.perCarat = this.perCarat;
          this.leadObj.summary.totalRAP = this.totalRAP;
          this.leadObj.summary.avgRap = this.avgRap;
          if (this.isNegotiateFlag) {
            this.leadObj.isNegotiatedStatus = true;
            this.leadObj.reqDis = this.avgDiscPer;
          }

          let response = await this.leadService.leadUpdate(this.leadObj);
          if (response) {
            if (this.listInventoryItems.length == 0) {
              this.gridInventoryData = [];
              this.loadLeadInventoryGrid(this.listInventoryItems)
              this.summaryCalculation();

            }
            else
              this.loadInventory(this.listInventoryItems);

            if (this.isNegotiateFlag) {
              this.sendMessage(this.leadObj)
              this.isNegotiateFlag = false;
            }

            this.isAddLead = false;
            this.utilityService.showNotification("You have been updated lead successfully!")
            await this.loadLeads();
            await this.loadCartsValue();
          }
        }
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

  public resetForm(form?: NgForm) {
    form?.reset();
  }
  //#endregion

  //#region Dialog Methods
  public openDetailsWindow() {
    this.isDetailsWindow = true;
  }

  public closeDetailsWindow() {
    this.isDetailsWindow = false;
  }

  public visiableQualification() {
    this.collapeQualification = !this.collapeQualification;
  }

  public visiableRejected() {
    this.collapeRejected = !this.collapeRejected;
  }

  public visiableCart() {
    this.collapeCart = !this.collapeCart;
  }

  public async toggleAddLeadDialog() {
    this.isEditableBrokerage = false;
    this.isNegotiateFlag = false;
    this.isAddLead = !this.isAddLead;
    this.gridInventoryData = [];
    this.listInventoryItems = [];
    this.leadObj = new Lead();
    this.customerObj = new Customer();
    this.brokerObj = new Broker();
    this.selectedBrokerItem = undefined;
    this.selectedCustomerItem = undefined as any;
    this.loadLeadInventoryGrid(this.listInventoryItems);
    this.reqDisMain = 0;
    if (this.isAddLead) {
      this.editCardStatus = 'proposal'
      await this.getGridConfiguration();
      this.isEditLead = false;
      setTimeout(() => {

        this.onAddStones();
        this.onCertificate();
      }, 1000);
    }

  }

  public async editLead(leadItem: Lead, action: boolean, leadTitle: string, isNegotiate: boolean = false) {
    try {
      this.mySelection = [];
      this.leadTitle = leadTitle;
      this.isNegotiateFlag = isNegotiate;
      this.editCardStatus = leadItem.leadStatus;
      this.skip = 0;
      if (this.editCardStatus.toLowerCase() != "approved" && this.editCardStatus.toLowerCase() != "placeorder")
        setTimeout(() => {
          this.onAddStones();
          this.onCertificate();
        }, 1000);

      if (this.isNegotiateFlag && !leadItem?.isEcom)
        setTimeout(() => {
          this.AddPlaceOrderDiscount();
        }, 1000);
      this.isAddLead = !this.isAddLead;
      this.leadObj = new Lead();
      this.leadObj = JSON.parse(JSON.stringify(leadItem));
      let leadInvItems = await this.leadService.getStonesByLeadId(leadItem.id);
      if (leadInvItems)
        this.leadObj.leadInventoryItems = leadInvItems;
      this.reqDisMain = this.leadObj.reqDis;
      this.customerObj = leadItem.customer;
      this.brokerObj = leadItem.broker;
      this.sellerObj = leadItem.seller;
      this.leadObj.summary = leadItem.summary;
      await this.getGridConfiguration();
      this.listInventoryItems = this.leadObj.leadInventoryItems;
      this.loadInventory(this.leadObj.leadInventoryItems)
      this.isEditLead = action;
    } catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }

  }

  public calIndiDis(item: OrderInventoryItems) {
    this.subjectReqDis.next(item);
  }

  public reqDisChanges() {
    this.subjectReqDis.pipe(
      debounceTime(1000)
    ).subscribe(indiReqDisValue => {
      this.calculateRapPricing(indiReqDisValue);
      this.summaryCalculation();
    });
  }

  public summaryCalculation() {
    this.totalAmount = 0;
    this.totalCarat = 0;
    this.totalRAP = 0;
    this.avgRap = 0;
    let rapCount = 0;

    if (this.editCardStatus.toLowerCase() == "approved") {
      this.listInventoryItems.forEach(z => {
        this.totalAmount += z.orderPrice.netAmount ?? 0;
        this.totalCarat += z.weight;
        this.totalRAP += (z.price.rap ?? 0) * (z.weight);
      })
      rapCount = this.listInventoryItems.reduce((acc, cur) => acc + (cur.price.rap ?? 0), 0);
      this.avgRap = rapCount / this.listInventoryItems.length;
    }
    else if (this.editCardStatus.toLowerCase() == "placeorder") {
      this.listInventoryItems.forEach(z => {
        if (z.reqPrice.netAmount)
          this.totalAmount += z.reqPrice.netAmount ?? 0;
        else
          this.totalAmount += z.price.netAmount ?? 0;
        this.totalCarat += z.weight;
        this.totalRAP += (z.price.rap ?? 0) * (z.weight);
      })
      rapCount = this.listInventoryItems.reduce((acc, cur) => acc + (cur.price.rap ?? 0), 0);
      this.avgRap = rapCount / this.listInventoryItems.length;
    }
    else {
      this.listInventoryItems.forEach(z => {
        this.totalAmount += z.price.netAmount ?? 0;
        this.totalCarat += z.weight;
        this.totalRAP += (z.price.rap ?? 0) * (z.weight);
      })
      rapCount = this.listInventoryItems.reduce((acc, cur) => acc + (cur.price.rap ?? 0), 0);
      this.avgRap = rapCount / this.listInventoryItems.length;

    }
    this.totalPcs = this.listInventoryItems.length;
    this.avgDiscPer = (((this.totalAmount / this.totalRAP) * 100) - 100);
    this.perCarat = this.totalAmount / this.totalCarat;

  }

  public calculateRapPricing(target: OrderInventoryItems): PriceDNorm {
    const rap = target.price.rap;
    let disc = target.reqDis;
    if (rap && disc) {
      if (disc.toString() != '-') {
        disc = parseFloat(disc.toString());
        let updateDiscount = (target.price.discount ? target.price.discount : 0) + disc;

        let weight = target.weight;
        let stoneRap = weight * rap;
        let calDiscount = 100 + updateDiscount;
        let netAmount = (calDiscount * stoneRap) / 100;

        target.reqPrice.rap = rap;
        target.reqPrice.discount = updateDiscount;
        target.reqPrice.netAmount = this.utilityService.ConvertToFloatWithTwoDecimal(netAmount);
        let perCarat = netAmount / weight;
        target.reqPrice.perCarat = this.utilityService.ConvertToFloatWithTwoDecimal(perCarat);
      }
    }
    return target.reqPrice;
  }

  //#endregion

  //#region Cart Methods

  public async loadCartsValue() {
    try {
      this.tasksCartList = await this.cartService.getCartBySellerId(this.fxCredential.id);
    } catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);

    }
  }

  public async viewCart(cartItem: Cart, action: boolean) {
    this.isViewCart = action;
    this.leadObj = new Lead();
    this.fieldsInv = await this.gridPropertiesService.getInventoryGrid();
    this.fieldsInv[0].isSelected = false;
    this.fieldsInv[1].isSelected = false;

    let cartDetail = await this.cartService.getStonesByCartId(cartItem.id);
    if (cartDetail) {
      this.customerObj = cartItem.customer;
      this.sellerObj = cartItem.seller;
      this.leadObj.customer = this.customerObj;
      this.leadObj.seller = this.sellerObj;
      this.loadCartInventory(cartDetail);
    }

  }

  public toggleCartDialog() {
    this.isViewCart = false;
  }

  public loadCartInventory(inventories: InventoryItems[]) {
    this.listCartInventoryItems = [];
    this.gridCartInventoryData = [];

    if (inventories && inventories.length > 0) {
      for (let index = 0; index < inventories.length; index++) {
        const element = inventories[index];

        this.listCartInventoryItems.push(element);
      }

      if (this.listCartInventoryItems.length > 0) {
        this.gridCartInventoryData = [];

        for (let indexGrid = 0; indexGrid < this.pageSizeCart; indexGrid++) {
          const element = this.listCartInventoryItems[indexGrid];
          if (element)
            this.gridCartInventoryData.push(element);

        }
        this.loadCartInventoryGrid(this.listCartInventoryItems)
      }
    }

    this.spinnerService.hide();
  }

  public async loadCartInventoryGrid(inventoryItems: InventoryItems[]) {
    if (inventoryItems) {
      this.gridDetailSummary = new Summary();
      this.calculateGridSummary(inventoryItems);
      this.gridViewCartInventory = process(this.gridCartInventoryData, {});
      this.gridViewCartInventory.total = inventoryItems.length;
    }
    this.spinnerService.hide();
  }

  public pageChangeCart(event: PageChangeEvent): void {
    this.spinnerService.show();
    this.gridCartInventoryData = [];
    this.skipCart = event.skip;

    if (this.listCartInventoryItems.length > 0) {
      for (let i = this.skipCart; i < this.pageSizeCart + this.skipCart; i++) {
        const element = this.listCartInventoryItems[i];
        if (element)
          this.gridCartInventoryData.push(element);
      }

      this.loadCartInventoryGrid(this.listCartInventoryItems);
    }

  }

  //#endregion

  //#region Summary Calculation For Grid Items

  public async calculateGridSummary(inventoryItems: InventoryItems[]) {
    this.gridDetailSummary.totalCarat = inventoryItems.reduce((acc, cur) => acc + cur.weight, 0);
    this.gridDetailSummary.totalAmount = inventoryItems.reduce((acc, cur) => acc + (cur.price.netAmount ? cur.price.netAmount : 0), 0);
    this.gridDetailSummary.totalRAP = inventoryItems.reduce((acc, cur) => acc + ((cur.price.rap ?? 0) * (cur.weight)), 0) ?? 0;

    let rapCount = inventoryItems.reduce((acc, cur) => acc + (cur.price.rap ?? 0), 0);

    this.gridDetailSummary.totalPcs = inventoryItems.length;
    this.gridDetailSummary.avgRap = rapCount / this.gridDetailSummary.totalPcs;

    this.gridDetailSummary.avgDiscPer = (((this.gridDetailSummary.totalAmount / this.gridDetailSummary.totalRAP) * 100) - 100);
    this.gridDetailSummary.perCarat = this.gridDetailSummary.totalAmount / this.gridDetailSummary.totalCarat;

    let vowDiscount = 0
    if (!this.leadObj.isEcom) {
      vowDiscount = await this.volumeDiscountService.getVolumeDiscountValue(this.gridDetailSummary.totalAmount) ?? 0;
      this.gridDetailSummary.totalVOWDiscPer = vowDiscount;
    }

    if (this.leadObj.summary.totalVOWDiscPer)
      this.gridDetailSummary.totalVOWDiscPer = this.leadObj.summary.totalVOWDiscPer;

    if (this.leadObj.summary.totalAmount)
      this.gridDetailSummary.totalVOWDiscAmount = this.leadObj.summary.totalVOWDiscAmount;


    this.gridDetailSummary.totalVOWDiscAmount = (this.gridDetailSummary.totalAmount * this.gridDetailSummary.totalVOWDiscPer) / 100;
    this.gridDetailSummary.totalPayableAmount = this.gridDetailSummary.totalAmount - this.gridDetailSummary.totalVOWDiscAmount;
    this.gridDetailSummary.discPer = this.gridDetailSummary.totalPayableAmount / this.gridDetailSummary.totalRAP * 100 - 100;
    this.gridDetailSummary.pricePerCarat = this.gridDetailSummary.avgRap + (this.gridDetailSummary.avgRap * this.gridDetailSummary.discPer / 100);
  }
  //#endregion

  //#region Grid Config
  public openGridConfigDialog(): void {
    this.isGridConfig = true;
    if (this.editCardStatus.toLowerCase() == "approved")
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
      if (this.editCardStatus.toLowerCase() != "approved") {
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

        if (this.isNegotiateFlag) {
          let items = this.fields.filter(x => x.isSelected == false);
          for (let index = 0; index < items.length; index++) {
            const element = items[index];
            if (this.leadObj?.isEcom) {
              if (element.title.toLowerCase() == "status")
                element.isSelected = true;
            }
            else {
              if (element.title.toLowerCase() != "status")
                element.isSelected = true;
            }

          }

        }
      }
      else {
        this.gridConfig = await this.configService.getGridConfig(this.fxCredential.id, "LeadInventory", "LeadInventoryGridApproved");
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
          this.gridMasterConfigResponse = await this.configService.getMasterGridConfig("LeadInventory", "LeadInventoryGridApproved");
          if (this.gridMasterConfigResponse)
            this.fields = this.gridMasterConfigResponse.gridDetail;
          else
            this.fields = await this.gridPropertiesService.getLeadInventoryItemsApproved();
        }
      }

      this.spinnerService.hide();
    }
    catch (error: any) {
      this.alertDialogService.show(error);
      this.spinnerService.hide();
    }
  }
  //#endregion

  public selectAllInventories(event: string) {
    this.mySelection = [];
    if (event.toLowerCase() == 'checked')
      this.mySelection = this.listInventoryItems.map(z => z.id);
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
              this.openRMReasonDialog();
            else {
              this.mySelection.forEach(z => {
                let index = this.listInventoryItems.findIndex(a => a.id == z);
                if (index >= 0)
                  this.listInventoryItems.splice(index, 1)
              })

              if (this.listInventoryItems.length == 0) {
                this.gridInventoryData = [];
                this.loadLeadInventoryGrid(this.listInventoryItems)
                this.summaryCalculation();

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

  public openRMReasonDialog() {
    this.isRMReason = !this.isRMReason;

  }

  public async submitReason() {
    try {
      if (this.removeReasonModel) {
        this.spinnerService.show();
        let selectedStoneIds: string[] = [];
        this.mySelection.forEach(z => {
          let index = this.listInventoryItems.findIndex(a => a.id == z);
          if (index >= 0)
            selectedStoneIds.push(this.listInventoryItems[index].stoneId);
        })
        let response: boolean = await this.updateInventoryStoneRemoveReason(selectedStoneIds, this.removeReasonModel);

        if (response) {
          this.mySelection.forEach(z => {
            let index = this.listInventoryItems.findIndex(a => a.id == z);
            if (index >= 0)
              this.listInventoryItems.splice(index, 1)
          })

          this.leadObj.leadInventoryItems = this.listInventoryItems;
          if (this.leadObj.leadInventoryItems.length == 0)
            this.leadObj.leadStatus = "rejected";
          let responseLeadUpdate = await this.leadService.leadUpdate(this.leadObj);
          if (responseLeadUpdate) {
            if (this.listInventoryItems.length == 0) {
              this.gridInventoryData = [];
              this.loadLeadInventoryGrid(this.listInventoryItems)
              this.summaryCalculation();

            }
            else
              this.loadInventory(this.listInventoryItems);

            await this.loadLeads();
          }

          this.mySelection = [];
          this.removeReasonModel = '';
          this.openRMReasonDialog();
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
        return await this.inventoryService.updateInventoryListData(updatedReasonArray) as any;
      else
        return true;
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }


  //#endregion

  //#region Qc Reason
  public openQcReasonDialog() {
    this.isQcReason = !this.isQcReason;
    if (this.isQcReason == false)
      this.qcReasonModel = '';
  }

  public async submitQCReason() {
    try {
      if (this.qcReasonModel) {
        this.spinnerService.show();
        let messageType: string = "";
        this.partyObj = await this.partyService.getPartyByCustomerIdent(this.customerObj.id);
        this.memoObj.party = this.partyObj;
        this.memoObj.seller = this.sellerObj;
        this.memoObj.broker = this.brokerObj;
        this.memoObj.qcReason = this.qcReasonModel;
        this.memoObj.expiredDays = 2;

        let selectedStoneIds: string[] = [];
        this.mySelection.forEach(z => {
          let index = this.listInventoryItems.findIndex(a => a.id == z);
          if (index >= 0)
            selectedStoneIds.push(this.listInventoryItems[index].stoneId);
        })

        let fetchInventoryItems: InventoryItems[] = await this.inventoryService.getInventoryByStoneIds(selectedStoneIds);
        if (fetchInventoryItems.length > 0)
          this.memoObj.inventoryItems = JSON.parse(JSON.stringify(fetchInventoryItems));
        let stoneIdList = ""
        for (let index = 0; index < this.memoObj.inventoryItems.length; index++) {
          const element = this.memoObj.inventoryItems[index];
          if (element.isHold || element.isMemo)
            stoneIdList += this.memoObj.inventoryItems[index].stoneId + ",";
          else {
            if (this.partyObj?.partyType == null || this.partyObj?.partyType == undefined || this.partyObj?.partyType.toLowerCase() == 'customer')
              element.isHold = true;
            element.isMemo = true;
            element.heldBy = this.partyObj?.name;
          }
        }

        this.memoObj.identity.id = this.fxCredential.id;
        this.memoObj.identity.name = this.fxCredential.fullName;
        this.memoObj.identity.type = 'Employee' ?? '';

        messageType = "Inserted";
        if (stoneIdList)
          this.alertDialogService.show(stoneIdList.slice(0, -1) + " stone(s) are already in memo or hold.");
        else {
          if (fetchInventoryItems.length > 0) {
            let response: string = await this.memoService.insertMemo(this.memoObj);
            if (response) {

              let updateResponse: any = this.inventoryService.updateInventoryListData(this.memoObj.inventoryItems);
              if (updateResponse)
                this.utilityService.showNotification(`You have been ${messageType} successfully!`);

              this.qcReasonModel = '';
              this.mySelection = [];
              this.openQcReasonDialog()

            }
          }
        }
        this.spinnerService.hide();
      }

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

  public sendMessage(leadObj: Lead) {
    this.message.icon = "icon-erroricon";
    this.message.title = `${leadObj.leadNo}`;
    this.message.categoryType = "Alert";
    this.message.description = "notify infotmation desctiption";
    this.message.action = "modal";
    this.message.param = leadObj.id;
    this.message.senderId = JSON.parse(sessionStorage.getItem("userToken") ?? "").ident;
    this.message.receiverId = "61b9849954189e73bec382af";
    this.notificationService.messages.next(this.message)
  }


  public getTitle(field: string) {
    return this.fields.find(f => f.propertyName.toLowerCase() == field.toLowerCase())?.title ?? field;
  }

}
