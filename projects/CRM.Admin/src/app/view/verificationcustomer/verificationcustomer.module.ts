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
import { AccountService, CommonService, ConfigService, FileStoreService, GridPropertiesService, OrganizationService, UtilityService } from 'common/services';
import { AlertdialogService, GridconfigurationModule } from 'common/views';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { CustomerService } from '../../services/customer/customer.service';
import { VerificationCustomerRoutingModule } from './verificationcustomer-routing.module';
import { VerificationCustomerComponent } from './verificationcustomer.component';


@NgModule({
  declarations: [VerificationCustomerComponent],
  imports: [
    CommonModule,
    VerificationCustomerRoutingModule,
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
    TooltipModule,
  ],
  providers: [
    CustomerService,
    OrganizationService,
    GridPropertiesService,
    AlertdialogService,
    CommonService,
    UtilityService,
    ConfigService,
    AccountService,
    FileStoreService
  ],
})
export class VerificationCustomerModule { }