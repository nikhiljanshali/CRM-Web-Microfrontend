import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeotrackingRoutingModule } from './geotracking-routing.module';
import { GeotrackingComponent } from './geotracking.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonGroupModule, ButtonsModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { GridModule } from '@progress/kendo-angular-grid';
import { PopupModule } from '@progress/kendo-angular-popup';
import { GridconfigurationModule } from 'common/views';
import { TooltipModule } from '@progress/kendo-angular-tooltip';


@NgModule({
  declarations: [GeotrackingComponent],
  imports: [
    CommonModule,
    GeotrackingRoutingModule,
    DropDownsModule,
    ButtonsModule,
    InputsModule,
    LayoutModule,
    DateInputsModule,
    DialogModule,
    GridModule,
    PopupModule,
    GridconfigurationModule,
    TooltipModule,
    ButtonGroupModule
  ]
})
export class GeotrackingModule { }
