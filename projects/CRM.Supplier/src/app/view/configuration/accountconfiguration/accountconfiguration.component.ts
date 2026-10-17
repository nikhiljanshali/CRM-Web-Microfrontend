import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PanelBarExpandMode } from '@progress/kendo-angular-layout';
import { InvoiceTerm, Reason, VolumeDiscount } from 'common/businessobjects';
import { AccountConfig } from 'common/entities';
import { AccountconfigurationService, UtilityService, VolumeDiscountService } from 'common/services';
import { AlertdialogService } from 'common/views';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-accountconfiguration',
  templateUrl: './accountconfiguration.component.html',
  styleUrls: ['./accountconfiguration.component.css']
})
export class AccountconfigurationComponent implements OnInit {

  public expandMode: number = PanelBarExpandMode.Single;
  public accountConfig: AccountConfig = new AccountConfig();
  public accountRequest: AccountConfig = new AccountConfig();
  public editIndex!: number;

  // public editReason: boolean = false;
  // public holdReason: HoldReason = new HoldReason();

  public editTermIndex!: number;
  public editTerm: boolean = false;
  public invoiceTerm: InvoiceTerm = new InvoiceTerm();
  public reason: Reason = new Reason();
  public qcReasonModel: string = "";
  public removeStoneReasonModel: string = "";
  public editQcReason: boolean = false;
  public editRSReason: boolean = false;

  public columns: any[] = [
    { field: "discount", title: "Discount(%)" },
    { field: "fromAmount", title: "From Amount($)" },
    { field: "toAmount", title: "To Amount($)" },
    { field: "", title: "Action" },
  ];
  public gridDataOnline: VolumeDiscount[] = [];
  public gridDataOffline: VolumeDiscount[] = [];
  public height: number = 186;
  public disabledOnline: boolean = false;
  public volumeDiscountObj = new VolumeDiscount();

  constructor(private router: Router,
    private alertDialogService: AlertdialogService,
    public utilityService: UtilityService,
    private spinnerService: NgxSpinnerService,
    public accountconfigurationService: AccountconfigurationService,
    private volumeDiscountService: VolumeDiscountService) { }

  async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  public async defaultMethodsLoad() {
    await this.loadAccountConfiguration();
    await this.loadVolumeDiscount();
  }

  public async loadAccountConfiguration() {
    try {
      this.spinnerService.show();
      this.accountConfig = new AccountConfig();
      this.accountConfig = await this.accountconfigurationService.getAccountConfiguration();
      this.spinnerService.hide();
    } catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async onReasonNameSubmit(form: NgForm, type: string) {
    try {
      if (form.valid) {
        this.spinnerService.show();
        let response: any;
        this.accountRequest = new AccountConfig();

        if (this.accountConfig)
          this.accountRequest = { ... this.accountConfig };

        if (type.toLowerCase() == "qcreason") {
          this.reason.reasonName = this.qcReasonModel;

          if (this.accountRequest.id) {
            if (this.editQcReason)
              this.accountRequest.qcReasons[this.editIndex] = { ... this.reason };
            else
              this.accountRequest.qcReasons.push({ ...this.reason });
            response = await this.accountconfigurationService.updateAccountConfig(this.accountRequest);
          }
          else {
            this.accountRequest.qcReasons.push({ ...this.reason });
            response = await this.accountconfigurationService.insertAccountConfig(this.accountRequest);
          }
        }
        else {
          this.reason.reasonName = this.removeStoneReasonModel;

          if (this.accountRequest.id) {
            if (this.editRSReason)
              this.accountRequest.removeStoneReasons[this.editIndex] = { ... this.reason };
            else
              this.accountRequest.removeStoneReasons.push({ ...this.reason });
            response = await this.accountconfigurationService.updateAccountConfig(this.accountRequest);
          }
          else {
            this.accountRequest.removeStoneReasons.push({ ...this.reason });
            response = await this.accountconfigurationService.insertAccountConfig(this.accountRequest);
          }
        }

        if (response)
          this.loadAccountConfiguration();

        this.editIndex = null as any;
        if (type.toLowerCase() == "qcreason")
          this.editQcReason = false;
        else
          this.editRSReason = false;
        form.reset();
        this.spinnerService.hide();

      }
      else {
        this.spinnerService.hide();
        Object.keys(form.controls).forEach(key => {
          form.controls[key].markAsTouched();
        });
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public editReasonNameDialog(item: Reason, index: number, type: string) {
    this.reason = new Reason();
    if (type.toLowerCase() == "qcreason") {
      this.qcReasonModel = item.reasonName;
      this.reason = { ...item };
      this.editQcReason = true
    }
    else {
      this.removeStoneReasonModel = item.reasonName;
      this.reason = { ...item };
      this.editRSReason = true
    }


    this.editIndex = index;
  }

  public deleteReasonNameDialog(item: Reason, index: number, type: string) {
    try {
      this.alertDialogService.ConfirmYesNo("Are you sure you want to delete?", "Delete")
        .subscribe(async (res: any) => {
          if (res.flag) {
            this.spinnerService.show();
            this.accountRequest = new AccountConfig();
            if (this.accountConfig)
              this.accountRequest = { ... this.accountConfig };

            if (type.toLowerCase() == "qcreason")
              this.accountRequest.qcReasons.splice(index, 1);
            else
              this.accountRequest.removeStoneReasons.splice(index, 1);

            let responseDelete = await this.accountconfigurationService.updateAccountConfig(this.accountRequest);
            if (responseDelete !== undefined && responseDelete !== null) {
              this.spinnerService.hide();
              this.loadAccountConfiguration();
              this.utilityService.showNotification(`You have been deleted reason successfully!`)
            }
          }
        });
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public clearReasonName(type: string) {
    if (type.toLowerCase() == "qcreason") {
      this.qcReasonModel = null as any;
      this.editQcReason = false;
    }
    else {
      this.removeStoneReasonModel = null as any;
      this.editRSReason = false;
    }
  }

  public async onTermNameSubmit(form: NgForm) {
    try {
      if (form.valid) {
        this.spinnerService.show();
        let response: any;
        this.accountRequest = new AccountConfig();
        if (this.accountConfig)
          this.accountRequest = { ... this.accountConfig };

        if (this.accountRequest.id) {
          if (this.editTerm)
            this.accountRequest.invoiceTerms[this.editTermIndex] = { ... this.invoiceTerm };
          else
            this.accountRequest.invoiceTerms.push({ ...this.invoiceTerm });
          response = await this.accountconfigurationService.updateAccountConfig(this.accountRequest);
        }
        else {
          this.accountRequest.invoiceTerms.push({ ...this.invoiceTerm });
          response = await this.accountconfigurationService.insertAccountConfig(this.accountRequest);
        }

        if (response)
          this.loadAccountConfiguration();

        this.editTermIndex = null as any;
        this.editTerm = false;
        form.reset();
        this.spinnerService.hide();

      }
      else {
        this.spinnerService.hide();
        Object.keys(form.controls).forEach(key => {
          form.controls[key].markAsTouched();
        });
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public editTermNameDialog(item: InvoiceTerm, index: number) {
    this.invoiceTerm = new InvoiceTerm();
    this.invoiceTerm = { ...item };
    this.editTermIndex = index;
    this.editTerm = true
  }

  public deleteTermNameDialog(item: InvoiceTerm, index: number) {
    try {
      this.alertDialogService.ConfirmYesNo("Are you sure you want to delete?", "Delete")
        .subscribe(async (res: any) => {
          if (res.flag) {
            this.spinnerService.show();
            this.accountRequest = new AccountConfig();
            if (this.accountConfig)
              this.accountRequest = { ... this.accountConfig };

            this.accountRequest.invoiceTerms.splice(index, 1);

            let responseDelete = await this.accountconfigurationService.updateAccountConfig(this.accountRequest);
            if (responseDelete !== undefined && responseDelete !== null) {
              this.spinnerService.hide();
              this.loadAccountConfiguration();
              this.utilityService.showNotification(`You have been deleted reason successfully!`)
            }
          }
        });
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async loadVolumeDiscount() {
    try {
      this.spinnerService.show();
      let gridData: VolumeDiscount[] = await this.volumeDiscountService.getAllVolumeDiscounts();
      this.gridDataOnline = gridData.filter(x => x.isOnline === true);
      this.gridDataOffline = gridData.filter(x => x.isOnline === false);
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async sumbitDiscountCriteria(form: NgForm) {
    try {

      if (form.valid) {
        let result: any;
        this.spinnerService.show();
        this.loadVolumeDiscount();
        let validationSubmit: boolean = false;

        if (this.volumeDiscountObj.isOnline)
          validationSubmit = this.validateDiscountAmt(this.gridDataOnline)
        else
          validationSubmit = this.validateDiscountAmt(this.gridDataOffline)

        this.volumeDiscountObj.fromAmount = Number(this.volumeDiscountObj.fromAmount);
        this.volumeDiscountObj.toAmount = Number(this.volumeDiscountObj.toAmount);
        this.volumeDiscountObj.discount = Number(this.volumeDiscountObj.discount);

        if (this.volumeDiscountObj.id) {
          if (validationSubmit)
            result = await this.volumeDiscountService.updateVolumeDiscount(this.volumeDiscountObj);
        }
        else {
          if (validationSubmit)
            result = await this.volumeDiscountService.insertVolumeDiscount(this.volumeDiscountObj);
        }

        if (result) {
          if (this.volumeDiscountObj.id)
            this.utilityService.showNotification("Volume Discount updated successfully");
          else
            this.utilityService.showNotification("Volume Discount saved successfully");

          this.loadVolumeDiscount();
          form.reset();
          this.disabledOnline = false;
          this.volumeDiscountObj = new VolumeDiscount();
        }
        this.spinnerService.hide();
      }
      else {
        Object.keys(form.controls).forEach(key => {
          form.controls[key].markAsTouched();
        });
      }
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public async editDiscountCriteria(data: VolumeDiscount, index: number) {
    this.volumeDiscountObj = { ...data };
    this.disabledOnline = true;
  }

  public clearForm(form: NgForm) {
    form.reset();
    this.disabledOnline = false;
    this.volumeDiscountObj = new VolumeDiscount();
  }

  public async deleteDiscountCriteria(data: VolumeDiscount, index: number) {
    this.alertDialogService.ConfirmYesNo("Are you sure you want to delete?", "Delete")
      .subscribe(async (res: any) => {
        let responseDelete = false;
        if (res.flag)
          responseDelete = await this.volumeDiscountService.deleteVolumeDiscount(data.id);
        if (responseDelete) {
          this.utilityService.showNotification("Volume Discount deleted successfully");
          this.loadVolumeDiscount();
        }
      });
  }

  public validateSizes() {
    if (Number(this.volumeDiscountObj.fromAmount) && Number(this.volumeDiscountObj.toAmount)) {
      if (Number(this.volumeDiscountObj.fromAmount) > Number(this.volumeDiscountObj.toAmount)) {
        this.alertDialogService.show(`From Amt should be less than To Amt`);
        return false;
      }
    }
    return true;
  }

  public validateDiscountAmt(gridDataSend: VolumeDiscount[]) {
    let validation: boolean = false;

    if (gridDataSend.length > 0) {
      for (let index = 0; index < gridDataSend.length; index++) {
        const element = gridDataSend[index];
        if (Number(this.volumeDiscountObj.discount) == Number(element.discount) || (Number(this.volumeDiscountObj.fromAmount) >= Number(element.fromAmount) && Number(this.volumeDiscountObj.fromAmount) <= Number(element.toAmount)) ||
          (Number(this.volumeDiscountObj.toAmount) >= Number(element.fromAmount) && Number(this.volumeDiscountObj.toAmount) <= Number(element.toAmount)) || (Number(element.toAmount) >= Number(this.volumeDiscountObj.fromAmount) && Number(element.fromAmount) <= Number(this.volumeDiscountObj.toAmount))) {
          if (this.volumeDiscountObj.id) {
            if (element.id == this.volumeDiscountObj.id) {
              validation = true;
              break;
            }
            else {
              validation = false;
              this.alertDialogService.show("Volume Criteria already exists or not valid, Please enter valid criteria");
              break;
            }
          }
          else {
            validation = false;
            this.alertDialogService.show("Volume Criteria already exists or not valid, Please enter valid criteria");
            break;
          }
        }
        else
          validation = true;
      }
    }
    else
      validation = true;

    return validation;
  }
}