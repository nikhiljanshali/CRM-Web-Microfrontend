import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequestPriceRoutingModule } from './requestprice-routing.module';
import { RequestPriceComponent } from './requestprice.component';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { PopupModule } from '@progress/kendo-angular-popup';
import { InventoryService, PricingConfigService, PricingRequestService, SpecialstonecriteriaService } from '../../services';
import { ConfigService, EmployeeCriteriaService, GridPropertiesService, UtilityService, PricingService, LabService } from 'common/services';
import { AlertdialogService, GridconfigurationModule, MediaModule } from 'common/views';
import { FilterModule } from '../common/model/filter/filter.module';
import { SharedDirectiveModule } from 'common/directives';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { TooltipModule } from '@progress/kendo-angular-tooltip';

@NgModule({
  declarations: [RequestPriceComponent],
  imports: [
    CommonModule,
    RequestPriceRoutingModule,
    InputsModule,
    LayoutModule,
    ButtonsModule,
    DropDownsModule,
    GridModule,
    PopupModule,
    FormsModule,
    ChartsModule,
    DialogModule,
    FilterModule,
    GridconfigurationModule,
    MediaModule,
    TooltipModule,
    SharedDirectiveModule
  ],
  providers: [
    PricingRequestService,
    ConfigService,
    GridPropertiesService,
    AlertdialogService,
    UtilityService,
    EmployeeCriteriaService,
    PricingService,
    InventoryService,
    PricingConfigService,
    SpecialstonecriteriaService,
    LabService
  ]
})
export class RequestPriceModule { }
