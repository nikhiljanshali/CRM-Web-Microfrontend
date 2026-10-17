import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { RowClassArgs, SelectableSettings } from '@progress/kendo-angular-grid';
import { DataResult, process } from '@progress/kendo-data-query';
import { Broker, GridDetailConfig, MemoReceive, MemoReceiveResponse, Party, PartySearchCriteria, SellerDNorm } from 'common/businessobjects';
import { FileStore, fxCredential, GridConfig, GridMasterConfig, InventoryItems, Memo, TakenBy } from 'common/entities';
import { UtilityService, AppPreloadService, GridPropertiesService, ConfigService, FileStoreService, AccountconfigurationService, BrokerService, CustomerService, MemoService, PartyService, InventoryService } from 'common/services';
import { AlertdialogService } from 'common/views';
import { NgxSpinnerService } from 'ngx-spinner';
import { StockOnHandService } from '../../../../services';
import { fromEvent } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-memo',
  templateUrl: './memo.component.html',
  styleUrls: ['./memo.component.css']
})

export class MemoComponent implements OnInit {
  @ViewChild('BarcodeInput') barcodeInput!: ElementRef;
  @Output() toggle: EventEmitter<boolean> = new EventEmitter();
  @Input() stockOnHandSelectedItems: InventoryItems[] = [];
  @Input() isVisiable: boolean = false;
  @Input() isViewOnly: boolean = false;
  @Input() selectedMemo: Memo = new Memo();

  public fxCredential!: fxCredential;
  public pageSize = 26;
  public skip = 0;
  public fields!: GridDetailConfig[];
  public selectableSettings: SelectableSettings = {
    mode: 'multiple',
    checkboxOnly: true,
  };
  public skeletonArray = new Array(3);
  public mySelection: string[] = [];
  public isGridConfig: boolean = false;
  public totalWeight: number = 0;
  public inventoryItems: InventoryItems[] = [];
  public packetsItems!: InventoryItems[];
  public selectedInventoryItems: InventoryItems[] = [];
  public selectedTempInventoryItems: InventoryItems[] = [];
  public selectedInvalidInventoryItems: InventoryItems[] = [];
  public gridConfig!: GridConfig;
  public gridMasterConfigResponse!: GridMasterConfig;
  public cntMnuStones?: string;
  public sumMnuStonesWeight?: string;
  public gridViewInventory!: DataResult;

  public listPartyItems: Array<{ text: string; value: string }> = [];
  public partyItems: Party[] = [];
  public selectedPartyItem: string = "";
  public partyObj: Party = new Party();

  public listBrokerItems: Array<{ text: string; value: string }> = [];
  public brokerItems: Broker[] = [];
  public selectedBrokerItem?: string;
  public brokerObj: Broker = new Broker();

  public listSellerDNormItems: Array<{ text: string; value: string }> = [];
  public sellerDNormItems!: SellerDNorm[];
  public selectedSellerDNormItem?: string;
  public sellerDNormObj: SellerDNorm = new SellerDNorm();

  public listTakenByItems: Array<{ text: string; value: string }> = [];
  public takenByItems: TakenBy[] = [];
  public selectedTakenByNameItem: string = "";
  public takenByObj: TakenBy = new TakenBy();

  public memoObj = new Memo();
  public memoType: string = "Issue";
  public alredyExistInList: string[] = [];
  public alreadyHoldList: string[] = [];
  public notValidStatusStone: string[] = [];
  public notValidPriceStone: string[] = [];
  public notFoundInList: string[] = [];
  public notIssuedInList: string[] = [];
  public allowCustom = false;
  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains'
  };
  public isShowCheckBoxAll: boolean = true;
  public isAddTakenByPopup: boolean = false;
  public validTextLengthFlag: boolean = false;


  public photoIdentityErrorFlag: boolean = false;
  public photoIdentityModel: any = undefined;
  public isImgselectedPhotoIdent: boolean = false;
  public currentFile!: File;
  public imagePreviewphoto: any;
  public fileUploadItems: Array<{ type: string, file: File }> = new Array<{ type: string, file: File }>();
  public folderName = "TakenBy";
  public imageList: FileStore[] = [];
  public imgSrcDisplay: string = "";

  constructor(
    public partyService: PartyService,
    public brokerService: BrokerService,
    private alertDialogService: AlertdialogService,
    public utilityService: UtilityService,
    private spinnerService: NgxSpinnerService,
    public appPreloadService: AppPreloadService,
    public inventoryService: InventoryService,
    public router: Router,
    private gridPropertiesService: GridPropertiesService,
    private configService: ConfigService,
    private stockOnHandService: StockOnHandService,
    public accountConfigurationService: AccountconfigurationService,
    public memoService: MemoService,
    public customerService: CustomerService,
    private fileStoreService: FileStoreService,
    private sanitizer: DomSanitizer
  ) { }

  async ngOnInit() {
    await this.loadDefaultMethods();
  }

  public async loadDefaultMethods() {
    try {
      this.spinnerService.show();
      this.fxCredential = await this.appPreloadService.fetchFxCredentials();
      await this.getGridConfiguration();
      await this.loadBroker();
      await this.getSellerDNormData();

      if (!this.fxCredential)
        this.router.navigate(["login"]);
      if (!this.isViewOnly) {

        this.onAddBarcode();
        this.loadStock();
      }
      else {
        this.spinnerService.hide();

        this.partyObj = new Party();
        this.brokerObj = new Broker();
        this.sellerDNormObj = new SellerDNorm();
        this.takenByObj = new TakenBy();

        this.selectedInventoryItems = new Array<InventoryItems>();
        if (this.selectedMemo) {
          this.selectedPartyItem = this.selectedMemo.party.name;
          this.partyObj = this.selectedMemo.party;
          if (this.selectedMemo.takenBy?.name)
            this.selectedTakenByNameItem = this.selectedMemo.takenBy.name;
          if (this.selectedMemo.takenBy != undefined && this.selectedMemo.takenBy != null) {
            this.takenByObj = this.selectedMemo.takenBy;
            await this.setTakenByImage(this.takenByObj);
          }
          this.selectedBrokerItem = this.selectedMemo.broker.id;
          this.brokerObj = this.selectedMemo.broker;
          this.selectedSellerDNormItem = this.selectedMemo.seller.id;
          this.sellerDNormObj = this.selectedMemo.seller;
          this.memoObj = this.selectedMemo;

          this.selectedInventoryItems = this.selectedMemo.inventoryItems;
          this.selectedTempInventoryItems = JSON.parse(JSON.stringify(this.selectedMemo.inventoryItems));
          let indexFlag = this.selectedInventoryItems.findIndex(x => x.isHold || x.isMemo);
          if (indexFlag < 0)
            this.isShowCheckBoxAll = false;

          this.loadStock();
        }

      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  //#region Grid Load

  public async handlePartyFilter(value: any) {
    try {
      let partyCriteria = new PartySearchCriteria();
      partyCriteria.name = value;
      let parties: any = await this.partyService.getPartyNames(partyCriteria, 0, 100);
      this.listPartyItems = [];
      this.partyItems = parties.party;
      this.partyItems.reverse().forEach(z => { this.listPartyItems.push({ text: z.name, value: z.id }); });
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }

  }

  public partyChange(e: any) {
    if (e) {
      let fetchParty = this.partyItems.find(x => x.id == e);
      if (fetchParty) {
        setTimeout(() => {
          this.selectedPartyItem = fetchParty?.name ?? '';
        }, 0);

        this.partyObj = fetchParty ?? new Party();

      }
    }
    else
      this.partyObj = new Party();
  }

  public async handleTakenbyFilter(value: any) {
    try {
      if (value) {
        let takenBy: any = await this.memoService.getTakenByName(value);

        if (takenBy && takenBy.length > 0) {
          this.listTakenByItems = [];
          this.takenByItems = takenBy;
          this.takenByItems.reverse().forEach(z => { this.listTakenByItems.push({ text: z.name, value: z.id }); });
        }
      }
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }

  }

  public async takenByChange(e: any) {
    if (e) {
      let fetchTakenBy = this.takenByItems.find(x => x.id == e);
      if (fetchTakenBy) {
        setTimeout(() => {
          this.selectedTakenByNameItem = fetchTakenBy?.name ?? '';
        }, 0);
        this.takenByObj = fetchTakenBy;
        await this.setTakenByImage(this.takenByObj);
      }
      else {
        this.takenByObj = new TakenBy();
        this.imageList = [];
        this.clearPreviewFile();
      }

    }
    else {
      this.takenByObj = new TakenBy();
      this.imageList = [];
      this.clearPreviewFile();
    }
  }

  public onTakenByKeyPress(event: any) {
    if (event.target.value.length > 0)
      this.validTextLengthFlag = true;
    else
      this.validTextLengthFlag = false;
  }

  private loadImage(imageSrc: string) {
    if (imageSrc != undefined && imageSrc != null && imageSrc != "")
      return 'data:image/JPEG;base64,' + imageSrc;
    else
      return null
  }

  public toggleTakenByDialog() {
    this.isAddTakenByPopup = !this.isAddTakenByPopup;
    if (!this.takenByObj.id)
      this.imageList = []
  }

  public async loadBroker() {
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
    if (this.selectedBrokerItem) {
      let fetchBroker = this.brokerItems.find(x => x.id == this.selectedBrokerItem);
      if (fetchBroker)
        this.brokerObj = fetchBroker;
    }
    else
      this.brokerObj = new Broker();
  }

  public openDocumentDialog() {
    this.isAddTakenByPopup = true;
  }

  public closeDocumentDialog() {
    this.isAddTakenByPopup = false;
  }

  public sanitizeURL(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private async getSellerDNormData() {
    try {
      this.sellerDNormItems = await this.customerService.getSellerDNorm();
      this.sellerDNormItems.forEach((item) => {
        this.listSellerDNormItems.push({ text: item.name, value: item.id });
      });
    }
    catch (error: any) {
      console.error(error);
      this.alertDialogService.show(error.error);
    }
  }

  public onSellerDNormChange(e: any) {
    const sellerDNorm = this.sellerDNormItems.find(z => z.id == e);
    if (sellerDNorm != undefined && sellerDNorm != null)
      this.sellerDNormObj = sellerDNorm;
  }

  public async loadStock() {
    try {
      this.stockOnHandSelectedItems.forEach((element: InventoryItems) => {
        if (this.setPriorityViaMemotype(element)) {
          this.selectedInventoryItems.push(element);
          this.selectedTempInventoryItems.push(element);
        }
        else
          this.selectedInvalidInventoryItems.push(element);
      });

      if (this.selectedInvalidInventoryItems.length > 0) {
        let invalidHolds = this.selectedInvalidInventoryItems.filter(a => (a.isHold || a.isMemo)).map(x => x.stoneId).join(', ');
        let invalidStatus = this.selectedInvalidInventoryItems.filter(a => (a.status.toLowerCase() == 'lab' || a.status.toLowerCase() == 'sold')).map(x => x.stoneId).join(', ');
        let invalidPrice = this.selectedInvalidInventoryItems.filter(a => ((a.basePrice.netAmount == null || a.basePrice.netAmount == 0))).map(x => x.stoneId).join(', ');

        let message = '';
        if (invalidHolds.length > 0)
          message += `${invalidHolds} <b>in Memo</b>.<br/><br/>`;
        if (invalidStatus.length > 0)
          message += `${invalidStatus} <b>invalid status</b>.<br/><br/>`;
        if (invalidPrice.length > 0)
          message += `${invalidPrice} <b>invalid price</b>.<br/><br/>`;

        this.alertDialogService.show(`
        ${message}<br/>
         Please check the details.`);
      }

      let stockList: InventoryItems[] = await this.stockOnHandService.getStockByIdentId(this.fxCredential.id);
      this.inventoryItems = stockList;
      // //sort by boolead isHold and isMemo
      this.selectedInventoryItems.sort(function (x, y) {
        return (!((x.isMemo === y.isMemo) || (x.isHold === y.isHold))) ? 0 : x ? -1 : 1;
      });

      if (this.memoType == 'Issue')
        this.selectedInventoryItems = this.selectedTempInventoryItems;
      else
        this.selectedInventoryItems = this.selectedInventoryItems.filter(x => x.isMemo || x.isHold);

      this.gridViewInventory = process(this.selectedInventoryItems, {});
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

  public onAddBarcode() {
    try {
      fromEvent(this.barcodeInput.nativeElement, 'keyup').pipe(
        map((event: any) => {
          return event.target.value;
        })
        , filter(res => res.length > 4)
        , debounceTime(1000)
      ).subscribe(async (barcodeText: string) => {
        let message: string = ''

        let stones = this.utilityService.CheckStoneIds(barcodeText);
        this.alreadyHoldList = [];
        this.notValidStatusStone = [];
        this.notValidPriceStone = [];
        this.alredyExistInList = [];
        this.notFoundInList = [];
        this.notIssuedInList = [];

        if (this.memoType == 'Receive') {
          let memoReceiveObj = new MemoReceive();
          if ((this.partyObj.id == null || this.partyObj.id == undefined) || (this.sellerDNormObj.id == null || this.sellerDNormObj.id == undefined) || (this.fxCredential.id == null || this.fxCredential.id == undefined)) {
            this.alertDialogService.show('Please select the Party, Broker and Seller.');
            return
          }

          this.memoObj.party = this.partyObj;
          this.memoObj.broker = this.brokerObj;
          this.memoObj.seller = this.sellerDNormObj;

          this.memoObj.identity.id = this.fxCredential.id;
          this.memoObj.identity.name = this.fxCredential.fullName;
          this.memoObj.identity.type = 'Employee' ?? '';
          memoReceiveObj.memo = this.memoObj;
          memoReceiveObj.stoneIds = stones;

          let resReceive: MemoReceiveResponse[] = await this.memoService.fetchMemoByStone(memoReceiveObj);
          if (resReceive && resReceive.length > 0)
            stones = resReceive.filter((z: any) => z.isTrue).map((x: any) => x.stoneId.toUpperCase());
          let invalidStonesReceive = resReceive.filter((z: any) => !z.isTrue).map((x: any) => x.stoneId)
          if (invalidStonesReceive && invalidStonesReceive.length > 0)
            message += `${invalidStonesReceive.join(', ')} <b>not valid stone(s) for receive to user</b>.<br/><br/>`;
        }

        if (stones.length > 0) {
          for (let index = 0; index < stones.length; index++) {
            const element = stones[index].toUpperCase();
            this.addStoneInMemoGridList(element);
          }
        }
        else
          this.notFoundInList.push(barcodeText);

        if (this.memoType == "Issue") {
          if (this.alreadyHoldList.length > 0)
            message = `${this.alreadyHoldList.toString()}  <b>in Memo</b>.<br/><br/>`;
          if (this.notValidStatusStone.length > 0)
            message = message + ` ${this.notValidStatusStone.toString()} <b>invalid status</b>.<br/><br/>`;
          if (this.notValidPriceStone.length > 0)
            message = message + ` ${this.notValidPriceStone.toString()} <b>invalid price</b>.<br/><br/>`;
          if (this.alredyExistInList.length > 0)
            message = message + ` ${this.alredyExistInList.toString()} <b>already exist</b>. <br/><br/>`;
          if (this.notFoundInList.length > 0)
            message = message + ` ${this.notFoundInList.toString()} <b>not found</b>.`
        }
        else {
          if (this.notIssuedInList.length > 0)
            message = `${this.notIssuedInList.toString()} <b>memo not issued</b>.`
          // if (this.notFoundInList.length > 0)
          //   message = message + ` ${this.notFoundInList.toString()} <b>not found</b>.`
        }

        if (message)
          this.alertDialogService.show(message)
      });

    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public addStoneInMemoGridList(inputValue: string) {
    if (inputValue !== undefined && inputValue !== null && inputValue !== "") {
      let tempSelectData = [...this.selectedInventoryItems];
      let index = -1;
      if (this.memoType == "Issue")
        index = this.inventoryItems.findIndex(
          x => x.stoneId.toLowerCase() == inputValue?.trim().toString().toLowerCase()
            && !x.isMemo
            && !x.isHold
            && (x.status.toLowerCase() != "sold"
              || x.status.toLowerCase() != "lab")
            && ((x.basePrice.netAmount != null && x.basePrice.netAmount != 0))
        );
      else
        index = this.inventoryItems.findIndex(
          x => x.stoneId.toLowerCase() == inputValue?.trim().toString().toLowerCase()
            && (x.isMemo
              || x.isHold)
            && (x.status.toLowerCase() != "sold"
              || x.status.toLowerCase() != "lab")
            && ((x.basePrice.netAmount != null && x.basePrice.netAmount != 0))
        );

      let existErrorStone = this.inventoryItems.find(x => x.stoneId.toLowerCase() == inputValue?.trim().toString().toLowerCase());
      if (index >= 0) {
        let indexInner = this.selectedInventoryItems.findIndex(x => x.stoneId.toLowerCase() == inputValue?.trim().toString().toLowerCase());
        if (indexInner < 0) {
          tempSelectData.push(this.inventoryItems[index])
          this.selectedInventoryItems.push(this.inventoryItems[index])
        }
        else
          this.alredyExistInList.push(this.inventoryItems[index].stoneId);
      }
      else {
        if (existErrorStone) {
          if (this.memoType == "Issue") {
            if (existErrorStone?.isMemo && existErrorStone?.isHold)
              this.alreadyHoldList.push(existErrorStone.stoneId);
            if (existErrorStone?.status.toLowerCase() == "sold" || existErrorStone?.status.toLowerCase() == "lab")
              this.notValidStatusStone.push(existErrorStone.stoneId);
            if ((existErrorStone.basePrice.netAmount == null || existErrorStone.basePrice.netAmount == 0))
              this.notValidPriceStone.push(existErrorStone.stoneId);
          }
          else {
            if (!existErrorStone?.isHold || !existErrorStone?.isMemo)
              this.notIssuedInList.push(existErrorStone.stoneId);
          }
        }
        else
          this.notFoundInList.push(inputValue);
      }

      if (this.memoType == "Receive") {
        if (this.selectedInventoryItems.length > 0)
          this.fields[1].isSelected = true;
      }

      this.gridViewInventory = { data: tempSelectData, total: tempSelectData.length };
      this.cntMnuStones = tempSelectData.length.toString();
      let totalWeight = 0.0;
      tempSelectData.forEach(z => {
        totalWeight = totalWeight + z.weight;
      });
      this.sumMnuStonesWeight = totalWeight.toFixed(2);
    }
  }
  //#endregion

  //#region All the function for save and update and delete
  public async onSaveMemo(form: NgForm, action: boolean) {
    try {
      if (form.valid) {
        this.spinnerService.show();
        let messageType: string = "";
        this.memoObj.party = this.partyObj;
        this.memoObj.seller = this.sellerDNormObj;
        this.memoObj.broker = this.brokerObj;
        this.memoObj.takenBy = this.takenByObj;

        this.memoObj.inventoryItems = JSON.parse(JSON.stringify(this.selectedInventoryItems));

        for (let index = 0; index < this.memoObj.inventoryItems.length; index++) {
          const element = this.memoObj.inventoryItems[index];
          if (this.partyObj?.partyType == null || this.partyObj?.partyType == undefined || this.partyObj?.partyType.toLowerCase() == 'customer')
            element.isHold = true;
          element.isMemo = true;
          element.heldBy = this.partyObj.name;
          element.rfid = "";
        }

        this.memoObj.identity.id = this.fxCredential.id;
        this.memoObj.identity.name = this.fxCredential.fullName;
        this.memoObj.identity.type = 'Employee' ?? '';

        messageType = "Inserted";
        let response: string = await this.memoService.insertMemo(this.memoObj);
        if (response) {

          let updateResponse: any = this.inventoryService.updateInventoryListData(this.memoObj.inventoryItems);
          if (updateResponse)
            this.utilityService.showNotification(`You have been ${messageType} successfully!`);

          if (action)
            this.closeMemoIssueDialog()
        }

        form.reset();
        this.spinnerService.hide();

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

  public async onReceiveMemo(form: NgForm) {
    try {
      if (form.valid) {
        this.spinnerService.show();
        let receiveAbleInventoryItems = this.selectedInventoryItems.filter(x => this.mySelection.findIndex(y => y == x.stoneId) >= 0);
        let receivedInvItems = JSON.parse(JSON.stringify(receiveAbleInventoryItems));
        for (let index = 0; index < receivedInvItems.length; index++) {
          const element = receivedInvItems[index];
          element.isHold = false;
          element.isMemo = false;
          element.heldBy = this.fxCredential.fullName;

        }

        let response = await this.memoService.getMemoInventoryUpdate(receivedInvItems)
        if (response) {
          let updateResponse: any = this.inventoryService.updateInventoryListData(receivedInvItems);
          if (updateResponse)
            this.utilityService.showNotification(`You have been received successfully!`);
          this.closeMemoIssueDialog();

        }
        this.spinnerService.hide();
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

  public async onSaveTaken(form: NgForm) {
    try {
      if (form.valid) {
        this.spinnerService.show();
        let takenBy: TakenBy = new TakenBy();
        takenBy.name = this.selectedTakenByNameItem;
        let response: TakenBy = await this.memoService.insertTakenBy(takenBy);
        if (response.id) {
          this.uploadFilesOnServer(this.photoIdentityModel, response)
        }
        this.spinnerService.hide();

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
      var index = this.selectedInventoryItems.findIndex(x => x.stoneId == id);
      if (index >= 0) {
        this.selectedInventoryItems.splice(index, 1);

        let tempSelectData = [...this.selectedInventoryItems];
        this.gridViewInventory = { data: tempSelectData, total: tempSelectData.length };
        this.cntMnuStones = tempSelectData.length.toString();
        let totalWeight = 0.0;
        tempSelectData.forEach(z => {
          totalWeight = totalWeight + z.weight;
        });
        this.sumMnuStonesWeight = totalWeight.toFixed(2);
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  //#endregion

  public closeMemoIssueDialog(): void {
    this.toggle.emit(false);
  }

  public memoTypeChange(value: string) {
    this.mySelection = [];
    if (!this.isViewOnly) {
      this.barcodeInput.nativeElement.value = ""
      this.selectedInventoryItems = [];
      this.selectedInvalidInventoryItems = [];
      this.stockOnHandSelectedItems = [];
    }
    this.loadStock();

    if (value.toLowerCase() == "issue") {
      this.fields[0].isSelected = true;
      this.fields[1].isSelected = false;
    }
    else {
      this.fields[0].isSelected = false;
      this.fields[1].isSelected = true;
    }

    let indexFlag = this.selectedInventoryItems.findIndex(x => x.isHold || x.isMemo);
    if (indexFlag < 0)
      this.fields[1].isSelected = false;

    if (this.isViewOnly)
      this.fields[0].isSelected = false;
  }

  public selectAllInventories(event: string) {
    this.mySelection = [];
    if (this.memoType.toLowerCase() != "issue") {
      if (event.toLowerCase() == 'checked')
        this.mySelection = this.selectedInventoryItems.filter(a => a.isHold || a.isMemo).map(z => z.stoneId);
    }
  }

  public setPriorityViaMemotype(inventoryItem: InventoryItems) {
    if (this.memoType == "Issue") {
      return (
        !inventoryItem.isMemo
        && !inventoryItem.isHold
        && (inventoryItem.status.toLowerCase() != "sold"
          || inventoryItem.status.toLowerCase() != "lab")
        && ((inventoryItem.basePrice.netAmount != null && inventoryItem.basePrice.netAmount != 0))
      )
    }
    else if (this.memoType == "Receive") {
      return (
        (inventoryItem.isMemo
          || inventoryItem.isHold)
        && (inventoryItem.status.toLowerCase() != "sold"
          || inventoryItem.status.toLowerCase() != "lab")
        && ((inventoryItem.basePrice.netAmount != null && inventoryItem.basePrice.netAmount != 0))
      )
    }
    return null;
  }

  //#region Grid Config
  public openGridConfigDialog(): void {
    this.isGridConfig = true;
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
      this.gridConfig = await this.configService.getGridConfig(this.fxCredential.id, "MemoIssue", "MemoIssueGrid");
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
        this.gridMasterConfigResponse = await this.configService.getMasterGridConfig("MemoIssue", "MemoIssueGrid");
        if (this.gridMasterConfigResponse)
          this.fields = this.gridMasterConfigResponse.gridDetail;
        else
          this.fields = await this.gridPropertiesService.getMemoIssueGrid();
      }

      if (this.isViewOnly && this.memoType == "Issue")
        this.fields[0].isSelected = false;

      this.spinnerService.hide();
    }
    catch (error: any) {
      this.alertDialogService.show(error);
      this.spinnerService.hide();
    }
  }


  //#endregion

  public uploadFiles(event: Event): void {
    try {
      let acceptedFiles: string[] = [];
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
        this.currentFile = file;

        this.photoIdentityModel = this.currentFile;
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreviewphoto = reader.result;
          if (this.imagePreviewphoto?.toString().includes('application/pdf'))
            this.imagePreviewphoto = 'commonAssets/images/pdf_doc.png';
        };
        reader.readAsDataURL(file);
        this.photoIdentityErrorFlag = false;
        this.isImgselectedPhotoIdent = true;

      }
    }
    catch (error: any) {
      console.error(error);
      this.alertDialogService.show("Something went wrong, Try again later");
    }
  }

  public clearPreviewFile() {
    this.imagePreviewphoto = '';
    this.isImgselectedPhotoIdent = false;
    this.photoIdentityModel = undefined;
  }

  public uploadFilesOnServer(file: File, ident: TakenBy, type: string = "TakenBy") {

    this.fileStoreService.postUploadFileDocument(file, type, ident.id, this.folderName).subscribe(
      async (res: any) => {
        if (res.body?.success) {
          this.utilityService.showNotification(`You have been added TakenBy successfully!`);
          this.takenByObj = new TakenBy();
          this.takenByObj = ident;
          // this.takenByObj.name = this.selectedTakenByNameItem;
          await this.setTakenByImage(this.takenByObj);

          this.isAddTakenByPopup = false;
          this.clearPreviewFile();
        }
      },
      (err: any) => {
        this.currentFile = null as any;
        console.error(err);
        this.utilityService.showNotification(`Something went wrong while uploading a file!`, "error")
      }
    );
  }

  public async setTakenByImage(takenBy: TakenBy) {
    this.imageList = await this.fileStoreService.getFileByIdent(takenBy.id);
    this.imageList[0].filePath = await this.fileStoreService.getPathToBase64(this.imageList[0].id, this.imageList[0].type);
    this.imageList[0].filePath = this.loadImage(this.imageList[0].filePath) || null as any;
  }


}
