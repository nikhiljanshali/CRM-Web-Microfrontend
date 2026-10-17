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
import { NotificationModule } from '@progress/kendo-angular-notification';
import { PopupModule } from '@progress/kendo-angular-popup';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { SharedDirectiveModule } from 'shared/directives';
import { GridconfigurationModule } from 'shared/views';
import { ConfigService, CommonService, UtilityService } from 'shared/services';
import { SupplierService } from '../../services';
import { AppPreloadService, GridPropertiesService } from '../../services';
// import { UserpermissionModule } from '../common/modal/userpermission/userpermission.module';
import { SupplierRoutingModule } from './supplier-routing.module';
import { SupplierdetailsComponent } from './supplierdetails/supplierdetails.component';
import { SuppliermasterComponent } from './suppliermaster/suppliermaster.component';

@NgModule({
  declarations: [
    SupplierdetailsComponent,
    SuppliermasterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SupplierRoutingModule,
    DropDownsModule,
    ButtonsModule,
    InputsModule,
    LayoutModule,
    DateInputsModule,
    DialogModule,
    GridModule,
    PopupModule,
    NotificationModule,
    IndicatorsModule,
    SharedDirectiveModule,
    //UserpermissionModule,
    GridconfigurationModule,
    TooltipModule,
  ],
  providers: [
    AppPreloadService,
    GridPropertiesService,
    CommonService,
    SupplierService,
    UtilityService,    
    ConfigService,
  ]
})
export class SupplierModule { }