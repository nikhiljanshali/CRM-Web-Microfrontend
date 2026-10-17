import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PriceanalysismodalRoutingModule } from './priceanalysismodal-routing.module';
import { PriceanalysismodalComponent } from './priceanalysismodal.component';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LayoutModule } from '@progress/kendo-angular-layout';


@NgModule({
  declarations: [PriceanalysismodalComponent],
  imports: [
    CommonModule,
    PriceanalysismodalRoutingModule,
    InputsModule,
    LayoutModule,
    ButtonsModule,
    ChartsModule,
  ]
})
export class PriceanalysismodalModule { }
