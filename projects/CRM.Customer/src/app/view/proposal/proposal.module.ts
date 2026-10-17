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
import { PopupModule } from '@progress/kendo-angular-popup';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { SharedDirectiveModule } from 'common/directives';
import { CommonService, GridPropertiesService, MasterConfigService, StoneProposalService, UtilityService } from 'common/services';
import { AlertdialogService, GridconfigurationModule, MediaModule, SearchdetailModule } from 'common/views';
import { PricingService } from 'projects/CRM.Admin/src/app/services';
import { CartService, CustomerLogService } from '../../services';
import { ProposalRoutingModule } from './proposal-routing.module';
import { ProposalComponent } from './proposal.component';

@NgModule({
  declarations: [ProposalComponent],
  imports: [
    CommonModule,
    ProposalRoutingModule,
    ButtonsModule,
    InputsModule,
    LayoutModule,
    DateInputsModule,
    DialogModule,
    GridModule,
    DropDownsModule,
    FormsModule,
    PopupModule,
    GridconfigurationModule,
    SearchdetailModule,
    SharedDirectiveModule,
    MediaModule,
    IndicatorsModule,
    TooltipModule,
  ],
  providers: [
    CommonService,
    UtilityService,
    AlertdialogService,
    MasterConfigService,
    GridPropertiesService,
    PricingService,
    StoneProposalService,
    CartService,
    CustomerLogService
  ]
})
export class ProposalModule { }
