import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadRoutingModule } from './lead-routing.module';
import { LeadComponent } from './lead.component';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { FormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { LabelModule } from '@progress/kendo-angular-label';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { PopupModule } from '@progress/kendo-angular-popup';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { AlertdialogService, GridconfigurationModule } from 'shared/views';
import { SharedDirectiveModule } from 'shared/directives';
import { BrokerService, CartService, CustomerService, GridPropertiesService, InventoryService, LeadService } from '../../services';
import { ConfigService, UtilityService } from 'shared/services';
import { LeadmodalModule } from '../common/modal/leadmodal/leadmodal.module';
import { CartmodalModule } from '../common/modal/cartmodal/cartmodal.module';


@NgModule({
  declarations: [LeadComponent],
  imports: [
    CommonModule,
    LeadRoutingModule,
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
    LabelModule,
    TooltipModule,
    LeadmodalModule,
    CartmodalModule,
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
    CartService,
  ]
})
export class LeadModule { }
