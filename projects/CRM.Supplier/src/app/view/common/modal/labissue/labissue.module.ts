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
import { LabelModule } from "@progress/kendo-angular-label";
import { LayoutModule } from '@progress/kendo-angular-layout';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { PopupModule } from '@progress/kendo-angular-popup';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { SharedDirectiveModule } from 'common/directives';
import { CommonService, FileStoreService, GridPropertiesService, MasterConfigService, OrganizationService, PrintFormatService, UtilityService } from 'common/services';
import { AlertdialogService, GridconfigurationModule } from 'common/views';
import { LabissueRoutingModule } from './labissue-routing.module';
import { LabissueComponent } from './labissue.component';

@NgModule({
  declarations: [LabissueComponent],
  imports: [
    CommonModule,
    LabissueRoutingModule,
    GridModule,
    DropDownsModule,
    InputsModule,
    LayoutModule,
    ButtonsModule,
    DateInputsModule,
    DialogModule,
    FormsModule,
    SharedDirectiveModule,
    IndicatorsModule,
    PopupModule,
    NotificationModule,
    GridconfigurationModule,
    TooltipModule,
    LabelModule
  ],
  providers: [
    GridPropertiesService,
    CommonService,
    UtilityService,
    MasterConfigService,
    OrganizationService,
    AlertdialogService,
    PrintFormatService,
    FileStoreService
  ],
  exports: [LabissueComponent],
})
export class LabissueModule { }