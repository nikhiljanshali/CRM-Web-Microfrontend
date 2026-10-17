import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonGroupModule, ButtonsModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { PopupModule } from '@progress/kendo-angular-popup';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { SharedDirectiveModule } from 'common/directives';
import { CommonService, ConfigService, GridPropertiesService, LogisticService, UtilityService } from 'common/services';
import { GridconfigurationModule } from 'common/views';
import { LogisticsmasterRoutingModule } from './logisticsmaster-routing.module';
import { LogisticsmasterComponent } from './logisticsmaster.component';



@NgModule({
  declarations: [LogisticsmasterComponent],
  imports: [
    CommonModule,
    LogisticsmasterRoutingModule,
    ButtonsModule,
    InputsModule,
    LayoutModule,
    DropDownsModule,
    GridModule,
    DialogModule,
    FormsModule,
    ButtonGroupModule,
    LabelModule,
    DateInputsModule,
    PopupModule,
    NotificationModule,
    IndicatorsModule,
    TooltipModule,
    SharedDirectiveModule,
    GridconfigurationModule,
  ],
  providers: [
    GridPropertiesService,
    LogisticService,
    CommonService,
    UtilityService,
    ConfigService,
  ]
})
export class LogisticsmasterModule { }
