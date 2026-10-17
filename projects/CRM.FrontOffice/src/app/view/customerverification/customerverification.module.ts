import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerverificationRoutingModule } from './customerverification-routing.module';
import { CustomerverificationComponent } from '../customerverification/customerverification.component';
import { FormsModule } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { GridModule } from '@progress/kendo-angular-grid';
import { PopupModule } from '@progress/kendo-angular-popup';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { CustomerService, CustomerVerificationService, GridPropertiesService, SystemUserService } from '../../services';
import { SharedDirectiveModule } from 'shared/directives';
import { AlertdialogService, GridconfigurationModule } from 'shared/views';
import { AccountService, CommonService, ConfigService, FileStoreService, UtilityService } from 'shared/services';


@NgModule({
  declarations: [CustomerverificationComponent],
  imports: [
    CommonModule,
    CustomerverificationRoutingModule,
    FormsModule,
    DropDownsModule,
    ButtonsModule,
    InputsModule,
    LayoutModule,
    DateInputsModule,
    DialogModule,
    GridModule,
    PopupModule,
    SharedDirectiveModule,
    GridconfigurationModule,
    IndicatorsModule,
    NgxIntlTelInputModule,
    TooltipModule
  ],
  providers:[
    CustomerService,
    CustomerVerificationService,
    SystemUserService,
    GridPropertiesService,
    AlertdialogService,
    CommonService,
    UtilityService,
    ConfigService,
    AccountService,
    FileStoreService
  ]
})
export class CustomerverificationModule { }
