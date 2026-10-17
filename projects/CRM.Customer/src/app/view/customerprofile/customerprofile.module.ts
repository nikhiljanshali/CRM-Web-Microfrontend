import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerprofileRoutingModule } from './customerprofile-routing.module';
import { CustomerprofileComponent } from './customerprofile.component';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { PopupModule } from '@progress/kendo-angular-popup';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { FormsModule } from '@angular/forms';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { SharedDirectiveModule } from 'shared/directives';
import { AlertdialogService, GridconfigurationModule } from 'shared/views';
import { DragulaModule } from 'ng2-dragula';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { CommonService, UtilityService, ConfigService, AccountService, FileStoreService } from 'shared/services';
import { WatchListService } from 'projects/CRM.FrontOffice/src/app/services';
import { CustomerService, GridPropertiesService, SystemUserService, CustomerPreferenceService } from '../../services';


@NgModule({
  declarations: [CustomerprofileComponent],
  imports: [
    CommonModule,
    CustomerprofileRoutingModule,
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
    DragulaModule.forRoot(),
  ],
  providers: [
    CustomerService,
    GridPropertiesService,
    AlertdialogService,
    CommonService,
    UtilityService,
    ConfigService,
    AccountService,
    SystemUserService,
    FileStoreService,
    CustomerPreferenceService,
    WatchListService
  ],
})
export class CustomerprofileModule { }
