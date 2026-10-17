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
import { CommonService, GridPropertiesService, MarketsheetService, MasterConfigService, OrganizationService, UtilityService } from 'common/services';
import { AlertdialogService, GridconfigurationModule, MediaModule, SearchdetailModule } from 'common/views';
import { PricingService } from 'projects/CRM.Admin/src/app/services';
import { MarketsheetRoutingModule } from './marketsheet-routing.module';
import { MarketsheetComponent } from './marketsheet.component';

@NgModule({
  declarations: [MarketsheetComponent],
  imports: [
    CommonModule,
    MarketsheetRoutingModule,
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
    MarketsheetService,
    AlertdialogService,
    MasterConfigService,
    OrganizationService,
    GridPropertiesService,
    PricingService
  ]
})
export class MarketsheetModule { }
