import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderComponent } from './order.component';
import { OrderRoutingModule } from './order-routing.module';
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
import { EmployeeService, GridPropertiesService, LedgerService, OrderService } from '../../services';
import { ConfigService, UtilityService } from 'shared/services';
import { AlertdialogService, GridconfigurationModule } from 'shared/views';
import { SharedDirectiveModule } from 'shared/directives';

@NgModule({
  declarations: [OrderComponent],
  imports: [
    CommonModule,
    OrderRoutingModule,
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
    TooltipModule
  ],
  providers: [
    GridPropertiesService,
    UtilityService,
    ConfigService,
    AlertdialogService,
    OrderService,
    LedgerService,
    DatePipe,
    EmployeeService
  ],
})
export class OrderModule { }