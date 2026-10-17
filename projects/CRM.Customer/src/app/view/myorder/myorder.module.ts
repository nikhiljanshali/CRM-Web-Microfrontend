import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyorderRoutingModule } from './myorder-routing.module';
import { MyorderComponent } from './myorder.component';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { FormsModule } from '@angular/forms';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { UtilityService } from 'shared/services';
import { AppPreloadService, InventoryService, MasterConfigService } from '../../services';
import { LeadService } from 'common/services';
import { AlertdialogService } from 'shared/views';
import { NgxSpinnerService } from 'ngx-spinner';


@NgModule({
  declarations: [MyorderComponent],
  imports: [
    CommonModule,
    MyorderRoutingModule,
    ButtonModule,
    GridModule,
    TooltipModule,
    DropDownsModule,
    InputsModule,
    FormsModule,
    DateInputsModule
  ],
  providers: [
    UtilityService,
    MasterConfigService,
    AppPreloadService,
    LeadService,
    AlertdialogService,
    NgxSpinnerService
  ]
})
export class MyorderModule { }
