import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvetoryPriceRoutingModule } from './inventoryprice-routing.module';
import { InvetoryPriceComponent } from './inventoryprice.component';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { PopupModule } from '@progress/kendo-angular-popup';
import { GridPropertiesService, PricingRequestService, SpecialstonecriteriaService, SupplierApiRequestService, SupplierService, UserPricingCriteriaService } from '../../services';
import { ConfigService, UtilityService, PricingService } from 'shared/services';
import { AlertdialogService, GridconfigurationModule, MediaModule } from 'shared/views';
import { FilterModule } from '../common/modal/filter/filter.module';
import { SharedDirectiveModule } from 'shared/directives';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { TooltipModule } from '@progress/kendo-angular-tooltip';

@NgModule({
  declarations: [InvetoryPriceComponent],
  imports: [
    CommonModule,
    InvetoryPriceRoutingModule,
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
    SpecialstonecriteriaService,
    SupplierService,
    SupplierApiRequestService,
  ]
})
export class InvetoryPriceModule { }
