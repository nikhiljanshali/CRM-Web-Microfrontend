import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RfidRoutingModule } from './rfid-routing.module';
import { RfidstocktallyComponent } from './rfidstocktally/rfidstocktally.component';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { SharedDirectiveModule } from 'common/directives';
import { AlertdialogService, GridconfigurationModule } from 'common/views';
import { InventoryService, UtilityService, GridPropertiesService } from 'common/services';
import { RfidsetupComponent } from './rfidsetup/rfidsetup.component';
import { StocktallyService } from '../../services';
import { PendingChangesGuard } from 'common/auth/pendingchanges.guard';


@NgModule({
  declarations: [
    RfidstocktallyComponent,
    RfidsetupComponent],
  imports: [
    CommonModule,
    RfidRoutingModule,
    ButtonsModule,
    InputsModule,
    LayoutModule,
    DateInputsModule,
    DialogModule,
    GridModule,
    DropDownsModule,
    FormsModule,
    SharedDirectiveModule,
    GridconfigurationModule,
    LabelModule,
    TooltipModule,
  ],
  providers: [
    InventoryService,
    StocktallyService,
    AlertdialogService,
    UtilityService,
    GridPropertiesService,
    PendingChangesGuard
  ],
})
export class RfidModule { }
