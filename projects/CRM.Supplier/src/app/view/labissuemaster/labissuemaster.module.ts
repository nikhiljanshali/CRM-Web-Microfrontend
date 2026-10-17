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
import { CommonService, ConfigService, FileStoreService, GridPropertiesService, LabService, UtilityService } from 'common/services';
import { GridconfigurationModule } from 'common/views';
import { LabissuemasterRoutingModule } from './labissuemaster-routing.module';
import { LabissuemasterComponent } from './labissuemaster.component';


@NgModule({
  declarations: [LabissuemasterComponent],
  imports: [
    CommonModule,
    LabissuemasterRoutingModule,
    DropDownsModule,
    ButtonsModule,
    InputsModule,
    LayoutModule,
    DateInputsModule,
    DialogModule,
    GridModule,
    PopupModule,
    FormsModule,
    IndicatorsModule,
    SharedDirectiveModule,
    GridconfigurationModule,
    TooltipModule,
  ],
  providers: [
    LabService,
    GridPropertiesService,
    CommonService,
    UtilityService,
    ConfigService,
    FileStoreService,
  ]
})
export class LabssuemasterModule { }
