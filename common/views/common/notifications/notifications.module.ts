import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsComponent } from './notifications.component';
import { AccountconfigurationService, EmployeeService, GridPropertiesService, NotificationService, UtilityService } from 'common/services';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { PopupModule } from '@progress/kendo-angular-popup';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { SharedDirectiveModule } from 'common/directives';
import { AlertdialogService, GridconfigurationModule } from 'common/views';
import { ManualstoneissueModule } from 'projects/CRM.Supplier/src/app/view/common/modal/manualstoneissue/manualstoneissue.module';


@NgModule({
  declarations: [NotificationsComponent],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    DropDownsModule,
    ButtonsModule,
    InputsModule,
    LayoutModule,
    DateInputsModule,
    DialogModule,
    GridModule,
    PopupModule,
    FormsModule,
    IndicatorsModule,
    SharedDirectiveModule,
    GridconfigurationModule,
    TooltipModule,
    ManualstoneissueModule
  ],
  providers: [NotificationService,
    GridPropertiesService,
    UtilityService,
    AccountconfigurationService,
    AlertdialogService,
    EmployeeService]
})
export class NotificationsModule { }
