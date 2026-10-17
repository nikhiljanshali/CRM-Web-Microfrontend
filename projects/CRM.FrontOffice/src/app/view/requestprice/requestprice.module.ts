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
import { GradingService, GridPropertiesService, PricingConfigService, PricingRequestService, SpecialstonecriteriaService, SupplierApiRequestService, SupplierService, UserPricingCriteriaService } from '../../services';
import { ConfigService, PricingService, UtilityService } from 'shared/services';
import { AlertdialogService, GridconfigurationModule, MediaModule } from 'shared/views';
import { FilterModule } from '../common/modal/filter/filter.module';
import { SharedDirectiveModule } from 'shared/directives';
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
    UserPricingCriteriaService,
    PricingService,
    PricingConfigService,
    SpecialstonecriteriaService,
    SupplierService,
    SupplierApiRequestService,
    GradingService
  ]
})
export class RequestPriceModule { }
