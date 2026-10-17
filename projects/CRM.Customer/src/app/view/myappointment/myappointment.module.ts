import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyappointmentRoutingModule } from './myappointment-routing.module';
import { MyappointmentComponent } from './myappointment.component';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { FormsModule } from '@angular/forms';
import { DateInputsModule, TimePickerModule } from '@progress/kendo-angular-dateinputs';
import { LabelModule } from '@progress/kendo-angular-label';


@NgModule({
  declarations: [MyappointmentComponent],
  imports: [
    CommonModule,
    MyappointmentRoutingModule,
    ButtonModule,
    GridModule,
    TooltipModule,
    DropDownsModule,
    InputsModule,
    FormsModule,
    DateInputsModule,
    LabelModule,
    TimePickerModule
  ]
})
export class MyappointmentModule { }
