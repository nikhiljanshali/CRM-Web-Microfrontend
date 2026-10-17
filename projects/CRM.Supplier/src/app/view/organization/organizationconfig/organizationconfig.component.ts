import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fxCredential, Organization, OrgConfig } from 'common/entities';
import { OrganizationconfigService, UtilityService, OrganizationService } from 'common/services';
import { AlertdialogService } from 'common/views';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-organizationconfig',
  templateUrl: './organizationconfig.component.html',
  styles: []
})

export class OrganizationconfigComponent implements OnInit {

  public organizationId!: string;
  public organizationData: Organization = new Organization();
  public orgConfig: OrgConfig = new OrgConfig();
  public tempOrgConfig: OrgConfig = new OrgConfig();
  public isUrlEditable: boolean = false;
  public isApiEditable: boolean = false;
  public websitePattern = "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"

  constructor(
    public route: ActivatedRoute,
    private organizationService: OrganizationService,
    private organizationConfigService: OrganizationconfigService,
    public utilityService: UtilityService,
    private alertDialogService: AlertdialogService,
    private spinnerService: NgxSpinnerService) { }

  async ngOnInit() {
    await this.defaultMethods()
  }

  public async defaultMethods() {
    this.spinnerService.show();
    await this.loadOrganizationDetail();
  }

  public async loadOrganizationDetail() {
    try {
      let fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;
      this.organizationId = fxCredentials.organizationId;
      this.orgConfig = await this.organizationConfigService.getOrganizationConfigByOrgId(this.organizationId);
      if (!this.orgConfig) {
        this.orgConfig = new OrgConfig();
        this.organizationData = await this.organizationService.getOrganizationById(this.organizationId);
        this.orgConfig.organizationDNorm.id = this.organizationData.id;
        this.orgConfig.organizationDNorm.name = this.organizationData.name;
        this.orgConfig.organizationDNorm.email = this.organizationData.email;
        this.orgConfig.organizationDNorm.person = this.organizationData.person;
        this.orgConfig.organizationDNorm.phoneNo = this.organizationData.phoneNo;
      }
      this.tempOrgConfig = { ...this.orgConfig };
      this.spinnerService.hide();
    }
    catch (error: any) {
      this.spinnerService.hide();
      this.alertDialogService.show(error.error);
    }
  }

  public enableUrlSaveChanges() {
    this.isUrlEditable = true;
  }

  public disabledUrlConfiguration() {
    this.isUrlEditable = false;
    this.orgConfig = this.tempOrgConfig;
  }

  public enableSaveChanges() {
    this.isApiEditable = true;
  }

  public disabledConfiguration() {
    this.isApiEditable = false;
    this.orgConfig = this.tempOrgConfig;
  }

  public async submit(form: NgForm, config: number) {
    try {
      if (form.valid) {
        let messageFor = 'Api-Path';
        if (config == 1)
          messageFor = 'Urls';

        let message!: string;
        this.spinnerService.show();

        if (!this.orgConfig.id) {
          let responseInsert: string;
          responseInsert = await this.organizationConfigService.organizationConfigInsert(this.orgConfig);
          if (responseInsert) {
            this.orgConfig.id = responseInsert;
            message = "You have been Added " + messageFor + " successfully!";
            if (config == 1)
              this.isUrlEditable = false;
            else
              this.isApiEditable = false;
          }
          else
            message = "Something went wrong while adding " + messageFor;
        }
        else {
          let fetchOrgConfig = Object.assign({}, this.orgConfig)
          if (Object.entries(fetchOrgConfig).toString() !== Object.entries(this.tempOrgConfig).toString()) {
            let responseUpdate: boolean;
            responseUpdate = await this.organizationConfigService.organizationConfigUpdate(this.orgConfig);
            if (responseUpdate) {
              message = "You have been Updated " + messageFor + " successfully!";
              this.tempOrgConfig = { ...this.orgConfig };
              if (config == 1)
                this.isUrlEditable = false;
              else
                this.isApiEditable = false;
            }
            else
              message = "Something went wrong while updating " + messageFor;
          }
          else {
            message = "You have been Updated " + messageFor + " successfully!";
            if (config == 1)
              this.isUrlEditable = false;
            else
              this.isApiEditable = false;
          }
        }
        this.spinnerService.hide();
        this.utilityService.showNotification(message)
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