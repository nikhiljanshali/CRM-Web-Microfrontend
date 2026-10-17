import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManualstoneissueRoutingModule } from './manualstoneissue-routing.module';
import { ManualstoneissueComponent } from './manualstoneissue.component';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { PopupModule } from '@progress/kendo-angular-popup';
import { SharedDirectiveModule } from 'common/directives';
import { AlertdialogService, GridconfigurationModule } from 'common/views';
import { GridPropertiesService, CommonService, UtilityService, InventoryService } from 'common/services';


@NgModule({
  declarations: [ManualstoneissueComponent],
  imports: [
    CommonModule,
    ManualstoneissueRoutingModule,
    InputsModule,
    DialogsModule,
    FormsModule,
    DropDownsModule,
    ButtonsModule,
    GridModule,
    SharedDirectiveModule,
    IndicatorsModule,
    PopupModule,
    NotificationModule,
    GridconfigurationModule,
    LabelModule
  ],
  providers: [
    InventoryService,
    GridPropertiesService,
    CommonService,
    UtilityService,
    AlertdialogService,
  ],
  exports: [ManualstoneissueComponent]
})
export class ManualstoneissueModule { }
