import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsComponent } from './transactions.component';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FormsModule } from '@angular/forms';
import { PurchaseModule } from '../common/modal/purchase/purchase.module';
import { SalesModule } from '../common/modal/sales/sales.module';
import { TooltipModule } from '@progress/kendo-angular-tooltip';


@NgModule({
  declarations: [TransactionsComponent],
  imports: [
    CommonModule,
    TransactionsRoutingModule,
    FormsModule,
    DateInputsModule,
    ButtonsModule,
    DropDownsModule,
    PurchaseModule,
    SalesModule,
    TooltipModule
  ]
})
export class TransactionsModule { }
