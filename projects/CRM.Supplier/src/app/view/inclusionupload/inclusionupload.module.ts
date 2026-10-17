import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InclusionuploadRoutingModule } from './inclusionupload-routing.module';
import { InclusionuploadComponent } from './inclusionupload.component';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { AlertdialogService, GridconfigurationModule } from 'common/views';
import { PopupModule } from '@progress/kendo-angular-popup';
import { SharedDirectiveModule } from 'common/directives';
import { GridPropertiesService, InventoryService, MasterConfigService, MeasureGradeService, UtilityService } from 'common/services';

@NgModule({
  declarations: [InclusionuploadComponent],
  imports: [
    CommonModule,
    InclusionuploadRoutingModule,
    ButtonsModule,
    InputsModule,
    LayoutModule,
    DateInputsModule,
    DialogModule,
    GridModule,
    DropDownsModule,
    FormsModule,
    TooltipModule,
    GridconfigurationModule ,
    PopupModule,
    SharedDirectiveModule
  ],
  providers: [
    InventoryService,
    AlertdialogService,
    UtilityService,
    MasterConfigService,
    GridPropertiesService,
    MeasureGradeService
  ]
})
export class InclusionuploadModule { }
