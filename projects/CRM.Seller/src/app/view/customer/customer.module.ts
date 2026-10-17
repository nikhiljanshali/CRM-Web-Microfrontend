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
import { SharedDirectiveModule } from 'common/directives';
import { AccountService, CommonService, ConfigService, CustomerCriteriaService, CustomerService, FileStoreService, GridPropertiesService, OrganizationService, UtilityService } from 'common/services';
import { AlertdialogService, GridconfigurationModule } from 'common/views';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { CustomerRoutingModule } from './customer-routing.module';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { CustomerdetailsComponent } from './customerdetails/customerdetails.component';
import { CustomerMasterComponent } from './customermaster/customermaster.component';

@NgModule({
  declarations: [CustomerMasterComponent, CustomerdetailsComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule,
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
    CustomerCriteriaService,
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
export class CustomerModule { }