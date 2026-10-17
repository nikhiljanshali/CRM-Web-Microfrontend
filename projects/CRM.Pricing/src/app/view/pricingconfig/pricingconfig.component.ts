import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PricingConfig } from 'common/entities';
import { UtilityService } from 'common/services';
import { AlertdialogService } from 'common/views';
import { NgxSpinnerService } from 'ngx-spinner';
import { PricingConfigService } from '../../services';

@Component({
  selector: 'app-pricingconfig',
  templateUrl: './pricingconfig.component.html'
})
export class PricingConfigComponent implements OnInit {
  public organizationId!: string;
  public pricingConfig: PricingConfig = new PricingConfig();
  public temppricingConfig: PricingConfig = new PricingConfig();
  public isEditable: boolean = false;
  public websitePattern = "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"

  constructor(
    public route: ActivatedRoute,
    private pricingConfigService: PricingConfigService,
    public utilityService: UtilityService,
    private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService) { }

  async ngOnInit() {
    await this.defaultMethods()
  }

  public async defaultMethods() {
    this.spinnerService.show();
    await this.getPricingConfig();
  }

  public async getPricingConfig() {
    try {
      this.pricingConfig = await this.pricingConfigService.getPricingConfigData();
      if (this.pricingConfig)
        this.temppricingConfig = { ...this.pricingConfig };
      else
        this.pricingConfig = new PricingConfig();
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public enableSaveChanges() {
    this.isEditable = true;
  }

  public disabledConfiguration() {
    this.isEditable = false;
    this.pricingConfig = this.temppricingConfig;
  }

  public async submit(form: NgForm, config: number) {
    try {
      if (form.valid) {
        let responseInsert = await this.pricingConfigService.updatePricingConfig(this.pricingConfig);
        if (responseInsert) {
          this.utilityService.showNotification("Updated successfully!");
          this.isEditable = false;
        }
        else
          this.alertDialogService.show('Something went wrong, Try again later!');
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

}
