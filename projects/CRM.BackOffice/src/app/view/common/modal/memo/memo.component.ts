import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { DataResult, process } from '@progress/kendo-data-query';
import { NgxSpinnerService } from 'ngx-spinner';
import { BankDNorm, InventoryItems, Ledger, LedgerDNorm, Logistic, Memo, Organization, TakenBy, TaxType } from '../../../../entities';
import { fromEvent } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';
import { FileStore, fxCredential, GridConfig, GridMasterConfig } from 'shared/enitites';
import { GridDetailConfig } from 'shared/businessobjects';
import { MemoReceive, MemoReceiveResponse, OrganizationDNorm } from '../../../../businessobjects';
import { AlertdialogService } from 'shared/views';
import { AppPreloadService, ConfigService, FileStoreService, listCurrencyType, listExportType, UtilityService } from 'shared/services';
import { AccountingconfigService, GridPropertiesService, LedgerService, LogisticService, MemoService, OrganizationService } from '../../../../services';

@Component({
  selector: 'app-memo',
  templateUrl: './memo.component.html',
  styleUrls: ['./memo.component.css']
})

// backoffice then seller,broker readonly
// frontoffice then seller,broker not readonly
// frontoffice partyname readonly

export class MemoComponent implements OnInit {
  @ViewChild('BarcodeInput') barcodeInput!: ElementRef;
  @Output() toggle: EventEmitter<boolean> = new EventEmitter();
  @Input() stockOnHandSelectedItems: InventoryItems[] = [];
  @Input() isVisiable: boolean = false;
  @Input() isViewOnly: boolean = false;
  @Input() isReadOnly: boolean = false;
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
  public partyItems: LedgerDNorm[] = [];
  public selectedPartyItem: string = "";
  public partyObj: LedgerDNorm = new LedgerDNorm();
  public listBrokerItems: Array<{ text: string; value: string }> = [];
  public brokerItems: LedgerDNorm[] = [];
  public selectedBrokerItem?: string;
  public brokerObj: LedgerDNorm = new LedgerDNorm();
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
  public logisticObj: Logistic = new Logistic();
  public selectedlogisticItems?: { text: string, value: string };
  public listlogisticItems: Array<{ text: string; value: string }> = [];
  public logisticItems: Logistic[] = [];
  public listBankItems: Array<{ text: string; value: string }> = [];
  public bankItems: BankDNorm[] = [];
  public selectedBankItem?: string;
  public bankObj: BankDNorm = new BankDNorm();
  public listTax: Array<{ name: string; isChecked: boolean }> = [];
  public allTheTax: TaxType[] = [];
  public filterTax: string = '';
  public filterTaxChk: boolean = true;
  public taxTypesZ: string[] = [];
  public listCurrencyType: Array<{ text: string; value: string }> = [];
  public listExportType: Array<{ text: string; value: string }> = [];
  public organizationData: Organization = new Organization();
  public organizationDNormItems!: OrganizationDNorm[];

  constructor(
    private alertDialogService: AlertdialogService,
    public utilityService: UtilityService,
    private spinnerService: NgxSpinnerService,
    public appPreloadService: AppPreloadService,
    public router: Router,
    private gridPropertiesService: GridPropertiesService,
    private configService: ConfigService,
    public memoService: MemoService,
    private fileStoreService: FileStoreService,
    private sanitizer: DomSanitizer,
    public ledgerService: LedgerService,
    public logisticService: LogisticService,
    public accountingconfigService: AccountingconfigService,
    private organizationService: OrganizationService,
  ) { }

  async ngOnInit() {
    await this.loadDefaultMethods();
  }

  public async loadDefaultMethods() {
    try {
      this.spinnerService.show();
      this.fxCredential = await this.appPreloadService.fetchFxCredentials();
      this.organizationData = await this.organizationService.getOrganizationById(this.fxCredential.organizationId);
      await this.getGridConfiguration();
      await this.loadBroker();
      await this.loadBank();
      await this.getData();

      if (!this.fxCredential)
        this.router.navigate(["login"]);
      if (!this.isViewOnly) {
        this.onAddBarcode();
        this.loadStock();
      }
      else {
        this.spinnerService.hide();

        this.partyObj = new LedgerDNorm();
        this.brokerObj = new LedgerDNorm();
        this.takenByObj = new TakenBy();
        this.selectedInventoryItems = new Array<InventoryItems>();

        if (this.selectedMemo) {
          this.selectedPartyItem = this.selectedMemo.party.name;
          this.partyObj = this.selectedMemo.party;
          if (this.selectedMemo.takenBy)
            this.selectedTakenByNameItem = this.selectedMemo.takenBy;
          if (this.selectedMemo.takenBy != undefined && this.selectedMemo.takenBy != null) {
            let takenByNew: any = await this.memoService.getTakenByName(this.selectedMemo.takenBy);
            this.takenByObj = takenByNew[0];
            await this.setTakenByImage(this.takenByObj);
          }

          this.selectedBrokerItem = this.selectedMemo.broker.id;
          this.brokerObj = this.selectedMemo.broker;
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

  public async getData() {
    try {
      this.logisticItems = await this.logisticService.getAllLogistics();
      this.listlogisticItems = [];
      this.logisticItems.forEach(z => { this.listlogisticItems.push({ text: z.name, value: z.name }); });

      this.allTheTax = await this.accountingconfigService.getTaxTypesList();
      this.allTheTax.forEach(z => { this.listTax.push({ name: z.name, isChecked: false }); });

      Object.values(listCurrencyType).forEach(z => { this.listCurrencyType.push({ text: z.toString(), value: z.toString() }); });
      Object.values(listExportType).forEach(z => { this.listExportType.push({ text: z.toString(), value: z.toString() }); });
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  //#region Grid Load

  public async handlePartyFilter(value: any) {
    try {
      this.partyItems = new Array<LedgerDNorm>();
      let ledgerType: string[] = ['Boiler', 'Photography', 'Lab']
      let parties: Ledger[] = await this.ledgerService.getAllLedgersByType(ledgerType, value);
      for (let index = 0; index < parties.length; index++) {
        const element = parties[index];
        this.partyItems.push({
          id: element.id,
          group: element.group.name,
          name: element.name,
          contactPerson: element.contactPerson,
          email: element.email,
          mobileNo: element.mobileNo,
          phoneNo: element.phoneNo,
          faxNo: element.faxNo,
          address: element.address,
        });
      }
      this.listPartyItems = [];
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
        this.partyObj = fetchParty ?? new LedgerDNorm();

        // partycountry same as Orgcountry then Logistic,Portlocation,bank readonly
        // partycountry Diff as Orgcountry then Logistic,Portlocation,bank not readonly   
        if (this.partyObj?.address.country.toLowerCase() == this.organizationData.address.country.toLowerCase())
          this.isReadOnly = true;
        else
          this.isReadOnly = false;
      }
    }
    else
      this.partyObj = new LedgerDNorm();
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
      let fetchTakenBy = this.takenByItems.find(x => x.name == e);
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
      this.takenByObj.name = e;
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
      let ledgerType: string[] = ['Broker']
      let brokers = await this.ledgerService.getAllLedgersByType(ledgerType);
      for (let index = 0; index < brokers.length; index++) {
        const element = brokers[index];
        this.brokerItems.push({
          id: element.id,
          group: element.group.name,
          name: element.name,
          contactPerson: element.contactPerson,
          email: element.email,
          mobileNo: element.mobileNo,
          phoneNo: element.phoneNo,
          faxNo: element.faxNo,
          address: element.address,
        });
      }

      this.listBrokerItems = [];
      this.brokerItems.forEach(z => { this.listBrokerItems.push({ text: z.name, value: z.id }); });
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public brokerChange(e: any) {
    if (this.selectedBrokerItem) {
      let fetchBroker = this.brokerItems.find(x => x.name == e.text);
      if (fetchBroker)
        this.brokerObj = fetchBroker;
    }
    else
      this.brokerObj = new LedgerDNorm();
  }

  public async loadBank() {
    try {
      let banks = await this.ledgerService.getBankAccounts();
      for (let index = 0; index < banks.length; index++) {
        const element = banks[index];
        this.bankItems.push(element);
      }
      this.listBankItems = [];
      this.bankItems.forEach(z => { this.listBankItems.push({ text: z.bankName, value: z.bankName }); });
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public bankChange(e: any) {
    if (this.selectedBankItem) {
      let fetchBank = this.bankItems.find(x => x.bankName == e.text);
      if (fetchBank)
        this.bankObj = fetchBank;
    }
    else
      this.bankObj = new BankDNorm();
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

      //let stockList: InventoryItems[] = await this.memoService.getInventoriesByIdentId(this.fxCredential.id);      
      //this.inventoryItems = stockList;

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
          if ((this.partyObj.id == null || this.partyObj.id == undefined) || (this.fxCredential.id == null || this.fxCredential.id == undefined)) {
            this.alertDialogService.show('Please select the Party, Broker and Seller.');
            return
          }

          this.memoObj.party = this.partyObj;
          this.memoObj.broker = this.brokerObj;

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

  public async addStoneInMemoGridList(inputValue: string) {
    let stockList: InventoryItems[] = await this.memoService.getInventoriesByStoneID(inputValue);
    this.inventoryItems = stockList;

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
        this.memoObj.broker = this.brokerObj;
        this.memoObj.bank = this.bankObj;
        this.memoObj.takenBy = this.takenByObj.name;
        this.memoObj.inventoryItems = JSON.parse(JSON.stringify(this.selectedInventoryItems));
        this.memoObj.taxTypes = this.getSelectedTaxTypeData();

        let totalAmount = 0;
        for (let index = 0; index < this.memoObj.inventoryItems.length; index++) {
          const element = this.memoObj.inventoryItems[index];
          if (this.partyObj?.group == null || this.partyObj?.group == undefined || this.partyObj?.group.toLowerCase() == 'customer')
            element.isHold = true;
          element.isMemo = true;
          element.heldBy = this.partyObj.name;
          element.rfid = "";
          totalAmount += this.memoObj.inventoryItems[index].price.netAmount ?? 0;
        }
        this.memoObj.totalAmount = totalAmount;

        if (this.partyObj?.address.country.toLowerCase() == this.organizationData.address.country.toLowerCase())
          this.memoObj.isOverseas = false
        else
          this.memoObj.isOverseas = true

        this.memoObj.identity.id = this.fxCredential.id;
        this.memoObj.identity.name = this.fxCredential.fullName;
        this.memoObj.identity.type = 'Employee' ?? '';

        this.organizationDNormItems = await this.organizationService.getOrganizationDNorm();
        let organizationId = this.fxCredential.organizationId;
        let organization = this.organizationDNormItems.find(z => z.id == organizationId) ?? new OrganizationDNorm();
        this.memoObj.organization = organization;

        messageType = "Inserted";
        let response: string = await this.memoService.insertMemo(this.memoObj);
        if (response) {

          let updateResponse: any = this.memoService.updateInventoryListData(this.memoObj.inventoryItems);
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

  private getSelectedTaxTypeData(): TaxType[] {
    let taxType: TaxType[] = [];
    this.taxTypesZ.forEach(z => {
      var obj = this.allTheTax.find(a => a.name == z);
      if (obj != null)
        taxType.push(obj);
    });
    return taxType;
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
          let updateResponse: any = this.memoService.updateInventoryListData(receivedInvItems);
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

  public LogisticChange() {
    try {
      let Selectedindex = this.logisticItems.findIndex(x => x.name == this.selectedlogisticItems?.value);
      if (Selectedindex >= 0) {
        this.logisticObj = this.logisticItems[Selectedindex]
        this.memoObj.courierName.id = this.logisticObj.id;
        this.memoObj.courierName.email = this.logisticObj.email;
        this.memoObj.courierName.mobileNo = this.logisticObj.mobileNo;
        this.memoObj.courierName.name = this.logisticObj.name;
        this.memoObj.courierName.phoneNo = this.logisticObj.phoneNo;
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public onMultiSelectChange(val: Array<{ name: string; isChecked: boolean }>, selectedData: string[]): void {
    val.forEach(element => {
      element.isChecked = false;
    });

    if (selectedData && selectedData.length > 0) {
      val.forEach(element => {
        selectedData.forEach(item => {
          if (element.name.toLocaleLowerCase() == item.toLocaleLowerCase())
            element.isChecked = true;
        });
      });
    }
  }

  public onOpenDropdown(list: Array<{ name: string; isChecked: boolean }>, e: boolean, selectedData: string[]): boolean {
    if (selectedData?.length == list.map(z => z.name).length)
      e = true;
    else
      e = false;
    return e;
  }

  public handleFilter(e: any): string {
    return e;
  }

  public filterDropdownSearch(allData: TaxType[], e: any, selectedData: string[]): Array<{ name: string; isChecked: boolean }> {
    let filterData: any[] = [];
    allData.forEach(z => { filterData.push({ name: z.name, isChecked: false }); });
    filterData.forEach(z => {
      if (selectedData?.includes(z.name))
        z.isChecked = true;
    });
    if (e?.length > 0)
      return filterData.filter(z => z.name?.toLowerCase().includes(e?.toLowerCase()));
    else
      return filterData;
  }

  public getCommaSapratedString(vals: any[], isAll: boolean = false): string {
    let name = vals.join(',')
    if (!isAll)
      if (name.length > 15)
        name = name.substring(0, 15) + '...';

    return name;
  }

}
