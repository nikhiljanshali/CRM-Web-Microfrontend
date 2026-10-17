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
import { DragulaModule } from 'ng2-dragula';
import { SharedDirectiveModule } from 'shared/directives';
import { AlertdialogService, GridconfigurationModule } from 'shared/views';
import { BrokerService, BusinessconfigurationService, CustomerService, GridPropertiesService, InventoryService, LeadService, RejectedstoneService, SchemeService } from '../../../../services';
import { ConfigService, UtilityService } from 'shared/services';


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
    CustomerService,
    BrokerService,
    GridPropertiesService,
    UtilityService,
    AlertdialogService,
    InventoryService,
    ConfigService,
    LeadService,
    BusinessconfigurationService,
    RejectedstoneService,
    SchemeService,
  ],
  exports: [LeadmodalComponent]
})
export class LeadmodalModule { }
