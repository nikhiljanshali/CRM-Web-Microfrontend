import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { ChartsModule, SparklineModule } from '@progress/kendo-angular-charts';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { IntlModule } from '@progress/kendo-angular-intl';
import { LabelModule } from "@progress/kendo-angular-label";
import { LayoutModule } from '@progress/kendo-angular-layout';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { PopupModule } from '@progress/kendo-angular-popup';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { SharedDirectiveModule } from 'common/directives';
import { CommonService, GridPropertiesService, InventoryService, MasterConfigService, OrganizationService, PricingService, UtilityService } from 'common/services';
import { AlertdialogService, GridconfigurationModule } from 'common/views';
import { PlanmakerModule } from '../common/modal/planmaker/planmaker.module';
import { UserpermissionModule } from '../common/modal/userpermission/userpermission.module';
import { GradingRoutingModule } from './grading-routing.module';
import { GradingComponent } from './grading.component';

@NgModule({
  declarations: [GradingComponent],
  imports: [
    CommonModule,
    GradingRoutingModule,
    InputsModule,
    LayoutModule,
    DropDownsModule,
    ButtonsModule,
    ChartsModule,
    GridModule,
    PlanmakerModule,
    SparklineModule,
    DateInputsModule,
    DialogModule,
    FormsModule,
    SharedDirectiveModule,
    IndicatorsModule,
    PopupModule,
    NotificationModule,
    UserpermissionModule,
    GridconfigurationModule,
    LabelModule,
    IntlModule,
    TooltipModule,
    ChartsModule    
  ],
  providers: [
    GridPropertiesService,
    CommonService,
    UtilityService,
    MasterConfigService,
    OrganizationService,
    InventoryService,
    AlertdialogService,
    PricingService
  ],
})
export class GradingModule { }
