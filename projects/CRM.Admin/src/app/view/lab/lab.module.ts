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
import { CommonService, ConfigService, FileStoreService, GridPropertiesService, UtilityService } from 'common/services';
import { GridconfigurationModule } from 'common/views';
import { LabService } from '../../services';
import { LabRoutingModule } from './lab-routing.module';
import { LabComponent } from './lab.component';



@NgModule({
  declarations: [LabComponent],
  imports: [
    CommonModule,
    LabRoutingModule,
    DialogModule,
    FormsModule,
    DropDownsModule,
    ButtonsModule,
    ButtonGroupModule,
    InputsModule,
    LabelModule,
    LayoutModule,
    DateInputsModule,
    GridModule,
    PopupModule,
    NotificationModule,
    IndicatorsModule,
    TooltipModule,
    SharedDirectiveModule,
    GridconfigurationModule,
  ],
  providers: [
    GridPropertiesService,
    LabService,
    CommonService,
    UtilityService,
    ConfigService,
    FileStoreService,
  ]
})
export class LabModule { }
