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
import { LayoutModule } from '@progress/kendo-angular-layout';
import { PopupModule } from '@progress/kendo-angular-popup';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { SharedDirectiveModule } from 'common/directives';
import { CommonService, ConfigService, FileStoreService, GridPropertiesService,UtilityService, VolumeDiscountService } from 'common/services';
import { GridconfigurationModule } from 'common/views';
import { PrintInvoiceFormat } from '../../services';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceComponent } from './invoice.component';

@NgModule({
  declarations: [InvoiceComponent],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    DropDownsModule,
    ButtonsModule,
    InputsModule,
    LayoutModule,
    DateInputsModule,
    DialogModule,
    GridModule,
    PopupModule,
    CommonModule,
    FormsModule,
    IndicatorsModule,
    SharedDirectiveModule,
    GridconfigurationModule,
    TooltipModule,
  ],
  providers: [    
    GridPropertiesService,
    CommonService,
    UtilityService,
    ConfigService,
    FileStoreService,
    CommonService,
    VolumeDiscountService,
    PrintInvoiceFormat
  ]
})
export class InvoiceModule { }
