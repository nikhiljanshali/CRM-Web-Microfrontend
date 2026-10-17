import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PanelBarExpandMode } from '@progress/kendo-angular-layout';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilityService } from 'shared/services';
import { AlertdialogService } from 'shared/views';
import { BusinessConfig } from '../../entities';
import { BusinessconfigurationService } from '../../services';

@Component({
  selector: 'app-businessconfig',
  templateUrl: './businessconfig.component.html',
  styles: [
  ]
})
export class BusinessconfigComponent implements OnInit {

  public expandMode: number = PanelBarExpandMode.Single;
  public businessConfig: BusinessConfig = new BusinessConfig();
  public businessRequest: BusinessConfig = new BusinessConfig();
  public editIndex!: number;

  public reason: string = '';
  public qcReasonModel: string = "";
  public removeStoneReasonModel: string = "";
  public editQcReason: boolean = false;
  public editRSReason: boolean = false;

  public height: number = 186;
  public disabledOnline: boolean = false;

  constructor(
    private alertDialogService: AlertdialogService,
    public utilityService: UtilityService,
    private spinnerService: NgxSpinnerService,
    public businessconfigurationService: BusinessconfigurationService,
  ) { }

  async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  public async defaultMethodsLoad() {
    await this.loadBusinessConfiguration();
  }

  public async loadBusinessConfiguration() {
    try {
      this.spinnerService.show();
      this.businessConfig = new BusinessConfig();
      this.businessConfig = await this.businessconfigurationService.getBusinessConfiguration();
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
        this.businessRequest = new BusinessConfig();

        if (this.businessConfig)
          this.businessRequest = { ... this.businessConfig };
        if (type.toLowerCase() == "qcreason") {
          this.reason = this.qcReasonModel;
          if (this.businessRequest.id) {
            if (this.editQcReason)
              this.businessRequest.qcReasons[this.editIndex] = this.reason;
            else
              this.businessRequest.qcReasons.push(this.reason);

            response = await this.businessconfigurationService.updateBusinessConfig(this.businessRequest);
          }
          else {
            this.businessRequest.qcReasons.push(this.reason);

            response = await this.businessconfigurationService.insertBusinessConfig(this.businessRequest);
          }
        }
        else {
          this.reason = this.removeStoneReasonModel;
          if (this.businessRequest.id) {
            if (this.editRSReason)
              this.businessRequest.removeStoneReasons[this.editIndex] = this.reason;
            else
              this.businessRequest.removeStoneReasons.push(this.reason);
            response = await this.businessconfigurationService.updateBusinessConfig(this.businessRequest);
          }
          else {
            this.businessRequest.removeStoneReasons.push(this.reason);
            response = await this.businessconfigurationService.insertBusinessConfig(this.businessRequest);
          }
        }

        if (response)
          this.loadBusinessConfiguration();

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

  public editReasonNameDialog(item: string, index: number, type: string) {
    this.reason = '';
    if (type.toLowerCase() == "qcreason") {
      this.qcReasonModel = item;
      this.reason = item;
      this.editQcReason = true
    }
    else {
      this.removeStoneReasonModel = item;
      this.reason = item;
      this.editRSReason = true
    }


    this.editIndex = index;
  }

  public deleteReasonNameDialog(item: string, index: number, type: string) {
    try {
      this.clearReasonName(type);
      this.alertDialogService.ConfirmYesNo("Are you sure you want to delete?", "Delete")
        .subscribe(async (res: any) => {
          if (res.flag) {
            this.spinnerService.show();
            this.businessRequest = new BusinessConfig();
            if (this.businessConfig)
              this.businessRequest = { ... this.businessConfig };

            if (type.toLowerCase() == "qcreason")
              this.businessRequest.qcReasons.splice(index, 1);
            else
              this.businessRequest.removeStoneReasons.splice(index, 1);

            let responseDelete = await this.businessconfigurationService.updateBusinessConfig(this.businessRequest);
            if (responseDelete !== undefined && responseDelete !== null) {
              this.spinnerService.hide();
              this.loadBusinessConfiguration();
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

}
