import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemoRoutingModule } from './memo-routing.module';
import { MemoComponent } from './memo.component';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
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
import { AlertdialogService, GridconfigurationModule } from 'shared/views';
import { SharedDirectiveModule } from 'shared/directives';
import { GridPropertiesService, MemoService } from '../../../../services';
import { FileStoreService, UtilityService } from 'shared/services';

@NgModule({
  declarations: [MemoComponent],
  imports: [
    CommonModule,
    MemoRoutingModule,
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
    UtilityService,
    AlertdialogService,
    MemoService,
    FileStoreService,
  ],
  exports: [MemoComponent],
})
export class MemoModule { }
