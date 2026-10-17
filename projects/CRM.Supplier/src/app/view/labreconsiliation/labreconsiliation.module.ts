import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabreconsiliationRoutingModule } from './labreconsiliation-routing.module';
import { LabreconsiliationComponent } from './labreconsiliation.component';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { PopupModule } from '@progress/kendo-angular-popup';
import { TooltipModule } from "@progress/kendo-angular-tooltip";
import { MasterConfigService, UtilityService ,GridPropertiesService, EmployeeCriteriaService, RapPriceService, InventoryService, MeasureGradeService, PricingService} from 'common/services';
import { GridconfigurationModule, MediaModule } from 'common/views';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { SharedDirectiveModule } from 'common/directives';


@NgModule({
  declarations: [LabreconsiliationComponent],
  imports: [
    CommonModule,
    LabreconsiliationRoutingModule,
    DropDownsModule,
    ButtonsModule,
    InputsModule,
    LayoutModule,
    DateInputsModule,
    DialogModule,
    GridModule,
    PopupModule,
    FormsModule,
    TooltipModule,
    GridconfigurationModule,
    IndicatorsModule,
    SharedDirectiveModule,
    MediaModule
  ],
  providers: [
    UtilityService,
    MasterConfigService,
    GridPropertiesService,
    PricingService,
    MeasureGradeService,
    EmployeeCriteriaService,
    InventoryService,
    RapPriceService
  ],
})
export class LabreconsiliationModule { }
