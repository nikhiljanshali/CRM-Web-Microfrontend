import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonGroupModule, ButtonsModule } from '@progress/kendo-angular-buttons';
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
import { SharedDirectiveModule } from 'common/directives';
import { AccountService, CommonService, ConfigService, GridPropertiesService, UtilityService } from 'common/services';
import { AlertdialogService, GridconfigurationModule } from 'common/views';
import { SystemUserService } from '../../services/systemuser/systemuser.service';
import { SystemuserRoutingModule } from './systemuser-routing.module';
import { SystemuserdetailsComponent } from './systemuserdetails/systemuserdetails.component';
import { SystemusermasterComponent } from './systemusermaster/systemusermaster.component';



@NgModule({
  declarations: [SystemusermasterComponent, SystemuserdetailsComponent],
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    SystemuserRoutingModule,
    DropDownsModule,
    ButtonsModule,
    ButtonGroupModule,
    InputsModule,
    LabelModule,
    LayoutModule,
    DateInputsModule,
    GridModule,
    PopupModule,
    NotificationModule,
    IndicatorsModule,
    TooltipModule,
    SharedDirectiveModule,
    GridconfigurationModule
  ],
  providers: [
    AccountService,
    GridPropertiesService,
    SystemUserService,
    AlertdialogService,
    CommonService,
    UtilityService,
    ConfigService,
  ],
})
export class SystemuserModule { }
