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
import { SharedDirectiveModule } from 'common/directives';
import { CartService, InventoryService, CustomerService, ConfigService, GridPropertiesService, LeadService, UtilityService, AccountconfigurationService, BrokerService, MemoService, PartyService, VolumeDiscountService } from 'common/services';
import { AlertdialogService, GridconfigurationModule } from 'common/views';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { LabelModule } from '@progress/kendo-angular-label';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { PopupModule } from '@progress/kendo-angular-popup';
import { TooltipModule } from '@progress/kendo-angular-tooltip';


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
    CommonModule,
    IndicatorsModule,
    PopupModule,
    NotificationModule,
    GridconfigurationModule,
    LabelModule,
    TooltipModule,
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
    VolumeDiscountService,
    CartService,
    AccountconfigurationService,
    MemoService,
    PartyService,
  ]
})
export class LeadModule { }
