import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountconfigurationRoutingModule } from './accountconfiguration-routing.module';
import { AccountconfigurationComponent } from './accountconfiguration.component';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { SharedDirectiveModule } from 'common/directives';
import { AccountconfigurationService, UtilityService, VolumeDiscountService } from 'common/services';
import { AlertdialogService } from 'common/views';
import { GridModule } from '@progress/kendo-angular-grid';


@NgModule({
  declarations: [AccountconfigurationComponent],
  imports: [
    CommonModule,
    AccountconfigurationRoutingModule,
    ButtonsModule,
    DropDownsModule,
    FormsModule,
    DialogModule,
    LayoutModule,
    InputsModule,
    SharedDirectiveModule,
    GridModule,
  ],
  providers: [
    AlertdialogService,
    UtilityService,
    AccountconfigurationService,
    VolumeDiscountService,
  ]
})
export class AccountconfigurationModule { }
