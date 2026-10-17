import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { NotificationService } from '@progress/kendo-angular-notification';
import { fxCredential, Organization } from 'common/entities';
import { UtilityService, OrganizationService } from 'common/services';
import { AccountingInformationService } from '../../services';
import { AlertdialogService } from 'common/views';
import { NgxSpinnerService } from 'ngx-spinner';
import { Bank } from '../../businessobjects';

@Component({
  selector: 'app-accountingInformation',
  templateUrl: './accountingInformation.component.html',
  styleUrls: ['./accountingInformation.component.css']
})

export class AccountingInformationComponent implements OnInit {
  
  public organizationId!: string;
  public organizationData: Organization = new Organization();
  public bankObj: Bank = new Bank();
  public isAddBank: boolean = false;
  public bankItems!: Bank[];
  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains'
  };

  constructor(public router: Router,
    public route: ActivatedRoute,
    private organizationService: OrganizationService,
    private accountingInformationService: AccountingInformationService,
    public utilityService: UtilityService,
    public notificationService: NotificationService,
    private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService) { }

  async ngOnInit() {
    await this.defaultMethods()
  }

  public async defaultMethods() {
    this.spinnerService.show();
    await this.loadOrganizationDetail();
    this.spinnerService.hide();
  }

  public async loadOrganizationDetail() {
    try {      
      let fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;
      this.organizationId = fxCredentials.organizationId;
      this.organizationData = await this.organizationService.getOrganizationById(this.organizationId)      
      this.bankItems = await this.accountingInformationService.getBankNames(this.organizationId)
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public openAddBankDialog(): void {
    this.bankObj = new Bank();
    this.isAddBank = true;
  }

  public closeAddBankDialog(): void {
    this.isAddBank = false;
  }

  public updateBank(item: Bank): void {
    this.bankObj = { ...item }
    this.isAddBank = true;
  }

  public async onBankSubmit(form: NgForm, flag: boolean) {
    try {
      if (form.valid) {
        this.spinnerService.show();
        let messageType: string = "";
        let response: string;
        this.bankObj.organizationId=this.organizationId;
        if (this.bankObj.id) {
          messageType = "updated";
          response = await this.accountingInformationService.UpdateBank(this.bankObj);
        }
        else {
          messageType = "inserted";
          response = await this.accountingInformationService.InsertBank(this.bankObj);
        }
        if (response) {
          if (flag)
            this.isAddBank = false;
          await this.loadOrganizationDetail();
          this.spinnerService.hide();
          this.utilityService.showNotification(`Your branch has been ${messageType} successfully!`)
          this.resetBankForm(form);
        }
      }
      else {
        Object.keys(form.controls).forEach(key => {
          form.controls[key].markAsTouched();
        });
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error)
    }
  }

  public resetBankForm(form?: NgForm) {
    this.bankObj = new Bank();
    form?.reset();
  }

  public deleteBank(item: Bank): void {
    try {
      this.alertDialogService.ConfirmYesNo("Are you sure you want to delete?", "Delete")
        .subscribe(async (res: any) => {
          if (res.flag) {
            this.spinnerService.show();
            let responseDelete = await this.accountingInformationService.deleteBank(item.id)
            if (responseDelete !== undefined && responseDelete !== null) {
              this.loadOrganizationDetail();
              this.spinnerService.hide();
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
}