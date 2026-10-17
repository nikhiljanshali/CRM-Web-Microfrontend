import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { PopupModule } from '@progress/kendo-angular-popup';
import { FilterComponent } from "./filter.component";
import { PricingRequestService } from '../../../../services';
import { AlertdialogService } from 'common/views';
import { EmployeeCriteriaService, MasterConfigService, EmployeeService, OrganizationService, UtilityService, CommonService } from 'common/services';
import { SharedDirectiveModule } from 'common/directives';
import { DateRangeModule } from "@progress/kendo-angular-dateinputs";
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';

@NgModule({
  imports: [
    CommonModule,
    GridModule,
    FormsModule,
    LayoutModule,
    InputsModule,
    ButtonsModule,
    DropDownsModule,
    DialogModule,
    PopupModule,
    SharedDirectiveModule,
    DateRangeModule,
    DateInputsModule
  ],
  declarations: [FilterComponent],
  exports: [FilterComponent],
  providers: [PricingRequestService, 
    AlertdialogService, 
    EmployeeCriteriaService, 
    OrganizationService,
    MasterConfigService,
    UtilityService,
    CommonService,
    EmployeeService]
})
export class FilterModule { }