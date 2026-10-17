import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadmodalRoutingModule } from './leadmodal-routing.module';
import { LeadmodalComponent } from './leadmodal.component';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { PopupModule } from '@progress/kendo-angular-popup';
import { SharedDirectiveModule } from 'common/directives';
import { AlertdialogService, GridconfigurationModule } from 'common/views';
import { DragulaModule } from 'ng2-dragula';
import { GridPropertiesService, UtilityService, ConfigService, LeadService, BrokerService, PartyService } from 'common/services';
import { InventoryService } from '../../../../services';


@NgModule({
  declarations: [LeadmodalComponent],
  imports: [
    CommonModule,
    LeadmodalRoutingModule,
    LayoutModule,
    InputsModule,
    DialogsModule,
    FormsModule,
    DropDownsModule,
    ButtonsModule,
    GridModule,
    SharedDirectiveModule,
    DragulaModule.forRoot(),
    IndicatorsModule,
    PopupModule,
    NotificationModule,
    GridconfigurationModule,
    LabelModule
  ],
  providers: [
    PartyService,
    BrokerService,
    GridPropertiesService,
    UtilityService,
    AlertdialogService,
    InventoryService,
    ConfigService,
    LeadService
  ],
  exports: [LeadmodalComponent]
})
export class LeadmodalModule { }
