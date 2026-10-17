import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LedgerMasterComponent } from './ledgermaster/ledgermaster.component';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { FormsModule } from '@angular/forms';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { PopupModule } from '@progress/kendo-angular-popup';
import { CommonService, UtilityService} from 'shared/services';
import { UserpermissionModule } from '../common/modal/userpermission/userpermission.module';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { LedgerdetailsComponent } from './ledgerdetails/ledgerdetails.component';
import { SharedDirectiveModule } from 'shared/directives';
import { AccountingconfigService, GridPropertiesService, LedgerService } from '../../services';
import { LedgerRoutingModule } from './ledger-routing.module';

@NgModule({
  declarations: [
    LedgerMasterComponent,
    LedgerdetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    LedgerRoutingModule,
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
    TooltipModule,
    UserpermissionModule
  ],
  providers: [
    GridPropertiesService,
    CommonService,
    LedgerService,
    AccountingconfigService,
    UtilityService
  ]
})
export class LedgerModule { }
