import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { PopupModule } from '@progress/kendo-angular-popup';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { SharedDirectiveModule } from 'common/directives';
import { PrintFormatService } from 'common/services';
import { GridconfigurationModule } from 'common/views';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ConsignmentInvoiceRoutingModule } from './consignmentinvoice-routing.module';
import { ConsignmentInvoiceComponent } from './consignmentinvoice.component';



@NgModule({
  declarations: [ConsignmentInvoiceComponent],
  imports: [
    CommonModule,
    FormsModule,
    ButtonsModule,
    ConsignmentInvoiceRoutingModule,
    DropDownsModule,
    GridModule,
    InputsModule,
    LayoutModule,
    SharedDirectiveModule,
    NgxSpinnerModule,
    IndicatorsModule,
    GridconfigurationModule,
    LabelModule,
    DateInputsModule,
    PopupModule,
    NotificationModule,
    TooltipModule,
  ],
  exports: [ConsignmentInvoiceComponent],
  providers: [PrintFormatService]
})
export class ConsignmentinvoiceModule { }
