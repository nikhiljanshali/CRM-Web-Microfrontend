import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'common/services';
import { DragulaService } from 'ng2-dragula';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, Subscription } from 'rxjs';
import { fxCredential } from 'shared/enitites';
import { AppPreloadService, LeadStatus, UtilityService } from 'shared/services';
import { AlertdialogService } from 'shared/views';
import * as xlsx from 'xlsx';
import { LeadCartItem, LeadResponse } from '../../businessobjects';
import { InventoryItems, InvItem, Lead, SystemUserDNorm } from '../../entities';
import { BrokerService, CartService, CustomerService, InventoryService, LeadService } from '../../services';


@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.css']
})

export class LeadComponent implements OnInit, OnDestroy {

  public disabledFlag: boolean = false;
  public fxCredential!: fxCredential;
  public isAddLead: boolean = false;
  public dragBoard = 'LeadBoard';
  public tasksQualificationList: any[] = [];
  public tasksProposalList: any[] = [];
  public tasksOrderList: any[] = [];
  public tasksApprovedList: any[] = [];
  public tasksDeliveredList: any[] = [];
  public tasksRejectedList: any[] = [];
  public collapeQualification: boolean = true;
  public collapeRejected: boolean = true;
  public listInventoryItems: InvItem[] = [];
  public sellerObj = new SystemUserDNorm();
  public subs = new Subscription();
  public isEditLead: boolean = false;
  public allLeads: LeadResponse[] = [];
  public subjectReqDis: Subject<InvItem> = new Subject();
  public editCardStatus: string = "";
  public cloneStatus: string = "";
  public leadTitle: string = "";
  public leadItem!: any;
  public leadListInvInput: InvItem[] = [];

  public tasksCartList: any[] = [];
  public collapeCart: boolean = false;
  public listCartInventoryItems: InventoryItems[] = [];
  public leadCartItem: LeadCartItem = new LeadCartItem();
  public isViewCart: boolean = false;

  constructor(public dragulaService: DragulaService,
    public customerService: CustomerService,
    public brokerService: BrokerService,
    private alertDialogService: AlertdialogService,
    public utilityService: UtilityService,
    private spinnerService: NgxSpinnerService,
    public appPreloadService: AppPreloadService,
    public inventoryService: InventoryService,
    public router: Router,
    public leadService: LeadService,
    public notificationService: NotificationService,
    public cartService: CartService,
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
      this.sellerObj = await this.leadService.getSellerDNormById(this.fxCredential.id);
      await this.loadLeads();
      await this.loadCarts();
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
        return true; // elements are always draggable by default
      },
      //#endregion
      accepts: (el, target, source, sibling) => {
        let accepted: boolean = true;
        if (source?.id != LeadStatus.Qualification.toString().toLowerCase())
          accepted = (target?.id != LeadStatus.Qualification.toString().toLowerCase());

        return accepted;
      }
    });

    this.subs.add(this.dragulaService.dropModel(this.dragBoard)
      .subscribe(async (value) => {
        try {
          let holdStones: InvItem[] = new Array<InvItem>();
          this.cloneStatus = value.item.leadStatus.toLowerCase().trim();
          let leadInvItems = await this.leadService.getStonesByLeadId(value.item.id, " " as any);
          if (value.item.platform.toLowerCase().trim() == "online") {
            if (value.target.id.toLowerCase() == LeadStatus.Proposal.toString().toLowerCase()) {
              this.loadLeads();
              return this.alertDialogService.show("You can not move lead to proposal from online platform");
            }
          }


          if (leadInvItems.length > 0) {
            if (value.target.id.toLowerCase() != LeadStatus.Proposal.toString().toLowerCase() && !(this.cloneStatus == LeadStatus.Order.toString().toLowerCase() && value.target.id.toLowerCase() == LeadStatus.Approved.toString().toLowerCase()) && !(this.cloneStatus == LeadStatus.Approved.toString().toLowerCase() && value.target.id.toLowerCase() == LeadStatus.Order.toString().toLowerCase())) {
              holdStones = leadInvItems.filter(x => x.isHold);
              if (holdStones.length > 0) {
                this.loadLeads();
                return this.alertDialogService.show(`Lead cannot be moved as it has hold ${holdStones.map(x => x.stoneId).join(",")} ${(holdStones.length == 1 ? "stone" : "stones")} `);
              }
            }

            if (value.target.id.toLowerCase() == LeadStatus.Qualification.toString().toLowerCase())
              value.item.leadStatus = LeadStatus.Qualification.toString().toLowerCase();
            else if (value.target.id.toLowerCase() == LeadStatus.Proposal.toString().toLowerCase())
              value.item.leadStatus = LeadStatus.Proposal.toString().toLowerCase();
            else if (value.target.id.toLowerCase() == LeadStatus.Order.toString().toLowerCase())
              value.item.leadStatus = LeadStatus.Order.toString().toLowerCase();
            else if (value.target.id.toLowerCase() == LeadStatus.Approved.toString().toLowerCase())
              value.item.leadStatus = LeadStatus.Approved.toString().toLowerCase();
            else if (value.target.id.toLowerCase() == LeadStatus.Rejected.toString().toLowerCase())
              value.item.leadStatus = LeadStatus.Rejected.toString().toLowerCase();

            let leadObj = new Lead();
            leadObj = value.item;
            leadObj.leadInventoryItems = new Array<InvItem>();

            if ((this.cloneStatus == LeadStatus.Order.toString().toLowerCase() && value.target.id.toLowerCase() == LeadStatus.Approved.toString().toLowerCase()) || (this.cloneStatus == LeadStatus.Proposal.toString().toLowerCase() && value.target.id.toLowerCase() == LeadStatus.Approved.toString().toLowerCase())) {
              leadInvItems.forEach(x => {
                if (x.isRejected)
                  x.isHold = false;
                else
                  x.isHold = true;
              })
              leadObj.leadInventoryItems = leadInvItems;
            }
            else {
              if (leadInvItems.length > 0)
                for (let index = 0; index < leadInvItems.length; index++) {
                  const element = leadInvItems[index];
                  let invItem = new InvItem();
                  invItem.invId = element.invId;
                  invItem.isRejected = element.isRejected;
                  leadObj.leadInventoryItems.push(invItem);
                }
            }

            if (leadObj.id) {
              leadObj.leadStatus = value.item.leadStatus;
              let responseUpdate: boolean = await this.leadService.leadUpdate(leadObj);
              if (responseUpdate) {
                let invIds = leadInvItems.filter(a => !a.isRejected).map(x => x.invId);
                if (value.item.leadStatus == LeadStatus.Approved.toString().toLowerCase() || value.item.leadStatus == LeadStatus.Order.toString().toLowerCase())
                  await this.inventoryService.updateInventoryHoldUnHoldById(invIds, true);
                else
                  await this.inventoryService.updateInventoryHoldUnHoldById(invIds, false);

              }
            }

          }
        }
        catch (error: any) {
          console.error(error);
          this.alertDialogService.show(error.error);
        }
      })
    );

  }

  public async loadLeads() {
    try {
      this.tasksQualificationList = [];
      this.tasksProposalList = [];
      this.tasksOrderList = [];
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
          element.platform = element.platform.toLowerCase();
          if (element.leadStatus.trim().toLowerCase() == LeadStatus.Qualification.toString().toLowerCase())
            this.tasksQualificationList.push(element);
          else if (element.leadStatus.trim().toLowerCase() == LeadStatus.Proposal.toString().toLowerCase())
            this.tasksProposalList.push(element);
          else if (element.leadStatus.trim().toLowerCase() == LeadStatus.Order.toString().toLowerCase())
            this.tasksOrderList.push(element);
          else if (element.leadStatus.trim().toLowerCase() == LeadStatus.Approved.toString().toLowerCase())
            this.tasksApprovedList.push(element);
          else if (element.leadStatus.trim().toLowerCase() == LeadStatus.Delivered.toString().toLowerCase())
            this.tasksDeliveredList.push(element);
          else if (element.leadStatus.trim().toLowerCase() == LeadStatus.Rejected.toString().toLowerCase())
            this.tasksRejectedList.push(element);
        }
      }
      this.spinnerService.hide();


    } catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);

    }

  }

  public async loadCarts() {
    let cartValue: LeadCartItem[] = new Array<LeadCartItem>();
    if (this.fxCredential.origin.toLowerCase() == 'admin')
      cartValue = await this.cartService.getCartLeadItems();
    else
      cartValue = await this.cartService.getCartLeadItems(this.fxCredential.id);

    if (cartValue && cartValue.length > 0)
      this.tasksCartList = cartValue;

  }


  //#endregion

  //#region Dialog Methods
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
    if (value)
      this.isAddLead = !this.isAddLead;
    else
      this.isAddLead = !value;


    this.leadTitle = "";
    if (!this.isAddLead || !value) {
      await this.loadLeads();
      this.leadItem = undefined as any
    }

  }

  public async editLead(leadItem: Lead, action: boolean, leadTitle: string, isNegotiate: boolean = false) {
    try {
      this.leadTitle = leadTitle;
      this.isAddLead = !this.isAddLead;
      this.leadItem = JSON.parse(JSON.stringify(leadItem));
      this.isEditLead = action;
    } catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }

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
            this.leadListInvInput = new Array<InvItem>();
            this.spinnerService.show();
            let fetchData: InvItem[] = await this.inventoryService.getInventoryDNormsByStones(stoneIds.join(','), " " as any);
            let HoldStone: InvItem[] = fetchData.filter(x => x.isHold);
            if (fetchData && fetchData.length > 0) {
              fetchData = fetchData.filter(x => !x.isHold);

              for (let index = 0; index < fetchData.length; index++) {
                let oi = new InvItem();
                const element: any = fetchData[index];
                oi = element;
                this.leadListInvInput.push(oi)
              }
              if (HoldStone && HoldStone.length > 0)
                this.alertDialogService.show(`${HoldStone.length == 1 ? HoldStone[0].stoneId.toString() + ' Stone is' : HoldStone.map(x => x.stoneId).join(", ") + ' Stones are'} on hold for selected file.`);
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

  public viewCart(leadCartItem: LeadCartItem) {
    this.isViewCart = true;
    this.leadCartItem = leadCartItem;
  }
}
