import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MemomasterRoutingModule } from './memomaster-routing.module';
import { MemomasterComponent } from './memomaster.component';
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
import { AlertdialogService, GridconfigurationModule } from 'common/views';
import { GridPropertiesService, CommonService, UtilityService, InventoryService, AccountconfigurationService, MemoService, PartyService } from 'common/services';
import { MemoModule } from '../common/modal/memo/memo.module';


@NgModule({
  declarations: [MemomasterComponent],
  imports: [
    CommonModule,
    MemomasterRoutingModule,
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
    MemoModule,

  ],
  providers: [
    GridPropertiesService,
    CommonService,
    UtilityService,
    AccountconfigurationService,
    AlertdialogService,
    PartyService,
    MemoService,
    InventoryService,
    DatePipe,
  ],
})
export class MemomasterModule { }
