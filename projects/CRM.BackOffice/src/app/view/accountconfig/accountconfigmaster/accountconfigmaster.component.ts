import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccountingconfigService } from '../../../services/accounting/accountingconfig.service';
import { AlertdialogService } from 'shared/views';
import { TextEnum, UtilityService } from 'shared/services';
import { AccountingConfig } from '../../../entities';
import { LedgerDNorm, LedgerGroup, TaxType, TransactItemGroup } from '../../../entities';

@Component({
  selector: 'app-accountconfigmaster',
  templateUrl: './accountconfigmaster.component.html',
  styleUrls: ['./accountconfigmaster.component.css']
})
export class AccountconfigmasterComponent implements OnInit {

  public accConfigEnum = TextEnum;
  public showPopup: boolean = false;
  public editMode: boolean = false;
  public accountingConfigData: AccountingConfig = new AccountingConfig();

  public groupTitle: string[] = ['Ledger Group', 'Tax Type', 'Transaction Item Group', 'Sales Ledger', 'Purchase Ledger'];

  public isAddLedgerGroup: boolean = false;
  public ledgerGroupObj: LedgerGroup = new LedgerGroup();

  public isAddTaxType: boolean = false;
  public taxTypeObj: TaxType = new TaxType();

  public isAddTransactionItemGroup: boolean = false;
  public transactItemGroupObj: TransactItemGroup = new TransactItemGroup();

  public changeInvoiceNumflag: boolean = false;
  public changeSalesLedgerflag: boolean = false;
  public changePurchaseLedgerflag: boolean = false;


  constructor(
    private spinnerService: NgxSpinnerService,
    private accountingconfigService: AccountingconfigService,
    private alertDialogService: AlertdialogService,
    private utilityService: UtilityService
  ) { }

  async ngOnInit() {
    this.spinnerService.show();
    await this.defaultMethodsLoad();
  }

  //#region Init Data
  async defaultMethodsLoad() {
    try {
      await this.loadAccountConfigDetail();
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
    }
  }

  public async loadAccountConfigDetail() {
    try {
      this.accountingConfigData = await this.accountingconfigService.getAccoutConfig();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }
  //#endregion

  //#region purcahse Ledger
  public changePurchaseLedger(): void {
    this.changePurchaseLedgerflag = true;
  }

  public async updatePurchaseLedger(purchaseLedger: LedgerDNorm) {
    var result = await this.accountingconfigService.updatePurchaseLedger(purchaseLedger);
    if (result) {
      this.changePurchaseLedgerflag = false;
      await this.accountingconfigService.getPurchaseLedger();
    }
    else
      this.utilityService.showNotification('Already updated, try new', 'error')
  }

  public closePurchaseLedgerUpdate(): void {
    this.changePurchaseLedgerflag = false;
  }
  //#endregion

  //#region Invoice Number
  public changeInvoiceNum(): void {
    this.changeInvoiceNumflag = true;
  }

  public async updateInvoiceNumber(invoiceno: number) {
    var result = await this.accountingconfigService.updateLastInvoiceNum(invoiceno);
    if (result) {
      this.utilityService.showNotification('Update Successfully');
      this.changeInvoiceNumflag = false;
      await this.accountingconfigService.getLastInvoiceNum();
    }
    else
      this.utilityService.showNotification('Already updated, try new', 'error')
  }

  public closeInvoiceNum(): void {
    this.changeInvoiceNumflag = false;
  }
  //#endregion

  //#region Sales Ledger
  public changeSalesLedger(): void {
    this.changeSalesLedgerflag = true;
  }

  public async updateSalesLedger(salesLedger: LedgerDNorm) {
    var result = await this.accountingconfigService.updateSalesLedgerAsync(salesLedger);
    if (result) {
      this.utilityService.showNotification('Update Successfully');
      this.changeSalesLedgerflag = false;
      await this.accountingconfigService.getSalesLedger();
    }
    else
      this.utilityService.showNotification('Already updated, try new', 'error');
  }

  public closeSalesLedgerUpdate(): void {
    this.changeSalesLedgerflag = false;
  }
  //#endregion

  //#region Ledger Group
  public openAddPopup(value: string): void {
    this.showPopup = true;
    if (value == TextEnum.LedgerGroup)
      this.isAddLedgerGroup = true;
    if (value == TextEnum.TaxType)
      this.isAddTaxType = true;
    if (value == TextEnum.TransactGroup)
      this.isAddTransactionItemGroup = true;
  }

  public closePopup(value: string): void {
    this.showPopup = false;
    this.editMode = false;
    if (value == TextEnum.LedgerGroup)
      this.isAddLedgerGroup = false;
    if (value == TextEnum.TaxType)
      this.isAddTaxType = false;
    if (value == TextEnum.TransactGroup)
      this.isAddTransactionItemGroup = false;
  }

  public closePopupOnEsc(): void {
    this.showPopup = false;
    this.isAddLedgerGroup = false;
    this.isAddTaxType = false;
    this.isAddTransactionItemGroup = false;
  }

  public async addNew(value: string, continuity: boolean) {
    if (value == TextEnum.LedgerGroup) {
      var result = await this.accountingconfigService.ledgerGroupInsert(this.ledgerGroupObj);
      if (continuity)
        this.ledgerGroupObj = new LedgerGroup();
      else {
        if (result) {
          this.showPopup = false;
          this.isAddLedgerGroup = false;
          this.ledgerGroupObj = new LedgerGroup();
        }
      }
    }
    if (value == TextEnum.TaxType) {
      var result = await this.accountingconfigService.taxTypeInsert(this.taxTypeObj);
      if (continuity)
        this.ledgerGroupObj = new LedgerGroup();
      else {
        if (result) {
          this.showPopup = false;
          this.isAddTaxType = false;
          this.taxTypeObj = new TaxType();
        }
      }
    }
    if (value == TextEnum.TransactGroup) {
      var result = await this.accountingconfigService.insertTransactItemGroup(this.transactItemGroupObj);
      if (continuity)
        this.ledgerGroupObj = new LedgerGroup();
      else {
        if (result) {
          this.showPopup = false;
          this.isAddTransactionItemGroup = false;
          this.transactItemGroupObj = new TransactItemGroup();
        }
      }
    }
    this.loadAccountConfigDetail();
  }

  public deleteExisting(value: string, dataObj: any): void {
    try {
      var responseDelete: boolean = false;
      this.alertDialogService.ConfirmYesNo("Are you sure you want to delete?", "Delete")
        .subscribe(async (res: any) => {
          if (value == TextEnum.LedgerGroup && res.flag) {
            responseDelete = await this.accountingconfigService.deleteLedgerGroup(dataObj.id);
          }
          if (value == TextEnum.TaxType && res.flag) {
            responseDelete = await this.accountingconfigService.deleteTaxType(dataObj.id);
          }
          if (value == TextEnum.TransactGroup && res.flag) {
            responseDelete = await this.accountingconfigService.deleteTransactItemGroup(dataObj.id);
          }
          if (responseDelete !== undefined && responseDelete !== null) {
            this.loadAccountConfigDetail();
            this.utilityService.showNotification('Deleted Successfully');
          }
        });

    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }

  public editExisting(value: string, dataObj: any): void {
    this.showPopup = true;
    if (value == TextEnum.LedgerGroup) {
      this.isAddLedgerGroup = true;
      this.editMode = true;
      this.ledgerGroupObj = dataObj;
    }
    if (value == TextEnum.TaxType) {
      this.isAddTaxType = true;
      this.editMode = true;
      this.taxTypeObj = dataObj;
    }
    if (value == TextEnum.TransactGroup) {
      this.isAddTransactionItemGroup = true;
      this.editMode = true;
      this.transactItemGroupObj = dataObj;
    }
  }

  public async updateSelected(value: string, dataObj: any) {
    try {
      if (value == TextEnum.LedgerGroup) {
        let result = await this.accountingconfigService.updateLedgerGroupAsync(dataObj);
        if (result) {
          this.showPopup = false;
          this.isAddLedgerGroup = false;
          this.editMode = false;
        }
      }
      if (value == TextEnum.TaxType) {
        let result = await this.accountingconfigService.updateTaxType(dataObj);
        if (result) {
          this.showPopup = false;
          this.isAddTaxType = false;
          this.editMode = false;
        }
      }
      if (value == TextEnum.TransactGroup) {
        let result = await this.accountingconfigService.updateTransactItemGroup(dataObj);
        if (result) {
          this.showPopup = false;
          this.isAddTransactionItemGroup = false;
          this.editMode = false;
        }
      }
      this.utilityService.showNotification('Update Successfully');
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }
  //#endregion
}
