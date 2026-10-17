import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { PopupModule } from '@progress/kendo-angular-popup';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { SharedDirectiveModule } from 'common/directives';
import { CommonService, ConfigService, GridPropertiesService, OrganizationconfigService, OrganizationService, UtilityService } from 'common/services';
import { GridconfigurationModule } from 'common/views';
import { UserpermissionModule } from '../common/modal/userpermission/userpermission.module';
import { OrganizationRoutingModule } from './organization-routing.module';
import { OrganizationconfigComponent } from './organizationconfig/organizationconfig.component';
import { OrganizationdetailsComponent } from './organizationdetails/organizationdetails.component';
import { OrganizationmasterComponent } from './organizationmaster/organizationmaster.component';

@NgModule({
  declarations: [
    OrganizationdetailsComponent,
    OrganizationmasterComponent,
    OrganizationconfigComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    OrganizationRoutingModule,
    DropDownsModule,
    ButtonsModule,
    InputsModule,
    LayoutModule,
    DateInputsModule,
    DialogModule,
    GridModule,
    PopupModule,
    NotificationModule,
    IndicatorsModule,
    SharedDirectiveModule,
    UserpermissionModule,
    GridconfigurationModule,
    TooltipModule,
  ],
  providers: [
    GridPropertiesService,
    CommonService,
    OrganizationService,
    UtilityService,
    OrganizationconfigService,
    ConfigService,
  ]
})
export class OrganizationModule { }