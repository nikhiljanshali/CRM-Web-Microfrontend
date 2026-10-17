import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BalancesheetRoutingModule } from './balancesheet-routing.module';
import { BalancesheetComponent } from './balancesheet.component';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';


@NgModule({
  declarations: [BalancesheetComponent],
  imports: [
    CommonModule,
    BalancesheetRoutingModule,
    DateInputsModule,
    ButtonModule
  ]
})
export class BalancesheetModule { }
