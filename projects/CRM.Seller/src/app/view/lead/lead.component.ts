import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { DataResult, process } from '@progress/kendo-data-query';
import { Broker, Customer, GridDetailConfig, Order, OrderInventoryItems, Party, SellerDNorm, Summary } from 'common/businessobjects';
import { AccountConfig, fxCredential, GridConfig, GridMasterConfig, IdentityDNorm, InventoryItems, InventorySearchCriteria, Lead, LeadResponse, Memo, PriceDNorm } from 'common/entities';
import { Cart } from 'common/entities/cart/cart';
import { AppPreloadService, CartService, GridPropertiesService, LeadService, NotificationService, CustomerService, UtilityService, AccountconfigurationService, BrokerService, InventoryService, MemoService, OrderService, PartyService, VolumeDiscountService } from 'common/services';
import { AlertdialogService } from 'common/views';
import { DragulaService } from 'ng2-dragula';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, Subscription } from 'rxjs';
import * as xlsx from 'xlsx';


@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.css']
})

export class LeadComponent implements OnInit, OnDestroy {
  public disabledFlag: boolean = true;
  public gridCartInventoryData: InventoryItems[] = [];
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

  public listCustomerItems: Array<{ text: string; value: string }> = [];
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
  public leadItem!: any;
  public leadListInvInput: OrderInventoryItems[] = [];


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
    public leadService: LeadService,
    public orderService: OrderService,
    public notificationService: NotificationService,
    public volumeDiscountService: VolumeDiscountService,
    public cartService: CartService,
    public accountconfigurationService: AccountconfigurationService,
    public memoService: MemoService,
    public partyService: PartyService,
  ) {
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
          this.selectedCustomerItem = fetchCustomer?.fullName ?? '' as any;
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
      this.customerItems.reverse().forEach(z => { this.listCustomerItems.push({ text: z.fullName, value: z.id }); });
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
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

  public async toggleAddLeadDialog(value: boolean = true) {
    this.leadListInvInput = Array<OrderInventoryItems>();
    if (value)
      this.isAddLead = !this.isAddLead;
    else
      this.isAddLead = !value;

    this.isNegotiateFlag = false;

    this.leadTitle = "";
    if (!this.isAddLead || !value) {
      await this.loadLeads();
      this.leadItem = undefined as any
    }

  }

  public async editLead(leadItem: Lead, action: boolean, leadTitle: string, isNegotiate: boolean = false) {
    try {
      this.mySelection = [];
      this.leadTitle = leadTitle;
      this.isNegotiateFlag = isNegotiate;
      this.isAddLead = !this.isAddLead;
      this.leadItem = JSON.parse(JSON.stringify(leadItem));
      this.isEditLead = action;
    } catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }

  }

  public async closeLeadDialog(value: boolean) {

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

  //#region Generate Lead from Excel
  public async onSelectExcelFile(event: Event) {
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
            let inventorySearchCriteriaObj = new InventorySearchCriteria();
            inventorySearchCriteriaObj.organizationId = this.fxCredential?.organizationId ?? '';
            this.leadListInvInput = new Array<OrderInventoryItems>();
            this.spinnerService.show();

            let fetchData = await this.inventoryService.getInventoryItemsBySearchForExcel(inventorySearchCriteriaObj);
            if (fetchData && fetchData.length > 0) {
              fetchData = fetchData.filter((item: any) => stoneIds.includes(item.stoneId.toLowerCase()));
            }
            if (fetchData && fetchData.length > 0) {
              for (let index = 0; index < fetchData.length; index++) {
                let oi = new OrderInventoryItems();
                const element: any = fetchData[index];
                oi = element;
                oi.sDiscount = 0;
                oi.reqDis = 0;
                oi.isDelivered = false;
                oi.days = 0;
                oi.isLead = null as any;
                oi.stoneStatus = "";
                oi.reqPrice = oi.price;
                oi.orderPrice = new PriceDNorm();
                this.leadListInvInput.push(oi)
              }
            }
            else
              this.alertDialogService.show(`${stoneIds.length == 1 ? stoneIds.toString() + ' Stone is' : stoneIds.join(", ") + ' Stones are'} not found in inventory for selected file.`);
            this.isAddLead = true;
          }
          else
            this.alertDialogService.show(`Stone Ids are not found in excel sheet.`);

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
