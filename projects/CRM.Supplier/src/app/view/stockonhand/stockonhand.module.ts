import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from "@progress/kendo-angular-label";
import { LayoutModule } from '@progress/kendo-angular-layout';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { PopupModule } from '@progress/kendo-angular-popup';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { SharedDirectiveModule } from 'common/directives';
import { CommonService, EmployeeCriteriaService, FileStoreService, GridPropertiesService, InventoryService, MasterConfigService, NotificationService, OrganizationService, PricingService, PrintFormatService, UtilityService } from 'common/services';
import { AlertdialogService, GridconfigurationModule } from 'common/views';
import { StockOnHandService } from '../../services';
import { LabissueModule } from '../common/modal/labissue/labissue.module';
import { LabreceiveModule } from '../common/modal/labreceive/labreceive.module';
import { MemoModule } from '../common/modal/memo/memo.module';
import { UserpermissionModule } from '../common/modal/userpermission/userpermission.module';
import { StockonhandRoutingModule } from './stockonhand-routing.module';
import { StockonhandComponent } from './stockonhand.component';

@NgModule({
  declarations: [StockonhandComponent],
  imports: [
    CommonModule,
    StockonhandRoutingModule,
    DropDownsModule,
    ButtonsModule,
    InputsModule,
    LayoutModule,
    GridModule,
    DateInputsModule,
    FormsModule,
    DialogModule,
    PopupModule,
    NotificationModule,
    IndicatorsModule,
    SharedDirectiveModule,
    UserpermissionModule,
    GridconfigurationModule,
    LabelModule,
    LabissueModule,
    LabreceiveModule,
    TooltipModule,
    MemoModule,
  ],
  providers: [
    GridPropertiesService,
    CommonService,
    StockOnHandService,
    UtilityService,
    MasterConfigService,
    OrganizationService,
    InventoryService,
    AlertdialogService,
    PricingService,
    PrintFormatService,
    EmployeeCriteriaService,
    DatePipe,
    FileStoreService,
  ]
})
export class StockonhandModule { }