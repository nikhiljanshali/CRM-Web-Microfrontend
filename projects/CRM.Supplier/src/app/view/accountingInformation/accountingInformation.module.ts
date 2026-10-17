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
import { SharedDirectiveModule } from 'common/directives';
import { CommonService, UtilityService, OrganizationService, GridPropertiesService} from 'common/services';
import { AccountingInformationRoutingModule } from './accountingInformation-routing.module';
import { AccountingInformationComponent } from './accountingInformation.component';
import { UserpermissionModule } from '../common/modal/userpermission/userpermission.module';
import { AccountingInformationService } from '../../services';
import { TooltipModule } from '@progress/kendo-angular-tooltip';

@NgModule({
  declarations: [
    AccountingInformationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AccountingInformationRoutingModule,
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
    TooltipModule,
    UserpermissionModule
  ],
  providers: [
    GridPropertiesService,
    CommonService,
    AccountingInformationService,
    OrganizationService,
    UtilityService
  ]
})
export class AccountingInformationModule { }
