import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesComponent } from './sales.component';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { SalesRoutingModule } from './sales-routing.module';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from '@progress/kendo-angular-tooltip';

@NgModule({
  declarations: [SalesComponent],
  imports: [
    SalesRoutingModule,
    CommonModule,
    FormsModule,
    InputsModule,
    LayoutModule,
    DialogModule,
    DropDownsModule,
    DateInputsModule,
    ButtonsModule,
    TooltipModule,
    GridModule
  ],
  exports: [SalesComponent],
})

export class SalesModule { }