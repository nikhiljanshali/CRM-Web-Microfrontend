import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilityService } from 'shared/services';
import { AlertdialogService } from 'shared/views';
import { Configurations } from '../../entities';
import { ConfigurationService } from '../../services';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styles: [
  ]
})
export class ConfigurationComponent implements OnInit {
  public configurations: Configurations = new Configurations();
  public tempConfigurations: Configurations = new Configurations();

  constructor(private alertDialogService: AlertdialogService,
    public utilityService: UtilityService,
    private spinnerService: NgxSpinnerService,
    public configurationService: ConfigurationService) { }

  async ngOnInit() {
    await this.defaultMethodsLoad();
  }

  public async defaultMethodsLoad() {
    try {
      this.spinnerService.show();
      let res = await this.configurationService.getConfiguration();
      if (res) {
        this.tempConfigurations = JSON.parse(JSON.stringify(res));
        this.configurations = JSON.parse(JSON.stringify(res));
      }
      this.spinnerService.hide();
    } catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show('Something went wrong, Try again later!');
    }
  }

  public async updateConfigurationData() {
    try {
      if (JSON.stringify(this.tempConfigurations) == JSON.stringify(this.configurations)) {
        this.utilityService.showNotification('Configuration updated successfully!');
        return;
      }

      this.spinnerService.show();
      var res = await this.configurationService.updateConfiguration(this.configurations);
      if (res) {
        this.utilityService.showNotification('Configuration updated successfully!');
        await this.defaultMethodsLoad();
        this.spinnerService.hide();
      } else {
        this.alertDialogService.show('Something went wrong on save data, Try again later!');
        this.spinnerService.hide();
      }
    }
    catch (error: any) {
      console.error(error);
      this.spinnerService.hide();
      this.alertDialogService.show('Something went wrong, Try again later!');
    }
  }

}
