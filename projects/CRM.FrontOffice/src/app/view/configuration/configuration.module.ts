import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration.component';
import { FormsModule } from '@angular/forms';
import { SharedDirectiveModule } from 'common/directives';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { AlertdialogService } from 'shared/views';
import { UtilityService } from 'shared/services';
import { ConfigurationService } from '../../services';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { GridModule } from '@progress/kendo-angular-grid';


@NgModule({
  declarations: [ConfigurationComponent],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    FormsModule,
    SharedDirectiveModule,
    LayoutModule,
    ButtonModule,
    TooltipModule,
    DropDownsModule,
    DialogModule,
    InputsModule,
    GridModule
  ],
  providers: [
    AlertdialogService,
    UtilityService,
    ConfigurationService
  ]
})
export class ConfigurationModule { }
