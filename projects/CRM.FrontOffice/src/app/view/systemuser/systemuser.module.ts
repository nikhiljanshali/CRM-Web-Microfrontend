import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemusermasterComponent } from './systemusermaster/systemusermaster.component';
import { SystemuserdetailsComponent } from './systemuserdetails/systemuserdetails.component';
import { SystemuserRoutingModule } from './systemuser-routing.module';
import { FormsModule } from '@angular/forms';
import { ButtonsModule, ButtonGroupModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { PopupModule } from '@progress/kendo-angular-popup';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { SharedDirectiveModule } from 'shared/directives';
import { AlertdialogService, GridconfigurationModule } from 'shared/views';
import { AccountService, CommonService, ConfigService, UtilityService } from 'shared/services';
import { AppPreloadService, GridPropertiesService, MasterConfigService, SystemUserService } from '../../services';
import { UserpermissionModule } from '../common/modal/userpermission/userpermission.module';

@NgModule({
  imports: [
    CommonModule,
    SystemuserRoutingModule,
    FormsModule,
    DropDownsModule,
    ButtonsModule,
    ButtonGroupModule,
    InputsModule,
    LabelModule,
    LayoutModule,
    DateInputsModule,
    DialogModule,
    GridModule,
    PopupModule,
    NotificationModule,
    IndicatorsModule,
    TooltipModule,
    SharedDirectiveModule,
    UserpermissionModule,
    GridconfigurationModule
  ],
  providers: [
    AppPreloadService,
    AccountService,
    GridPropertiesService,
    SystemUserService,
    AlertdialogService,
    CommonService,
    UtilityService,
    ConfigService,
    MasterConfigService
  ],
  declarations: [SystemusermasterComponent, SystemuserdetailsComponent]
})
export class SystemuserModule { }
