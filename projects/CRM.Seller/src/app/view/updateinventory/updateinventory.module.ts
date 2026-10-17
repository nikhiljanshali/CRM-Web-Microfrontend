import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from "@progress/kendo-angular-label";
import { LayoutModule } from '@progress/kendo-angular-layout';
import { PopupModule } from "@progress/kendo-angular-popup";
import { SharedDirectiveModule } from 'common/directives';
import { InventoryService, MeasureGradeService, PricingService, CommonService, GridPropertiesService, MasterConfigService, OrganizationService, StoneProposalService, UtilityService } from 'common/services';
import { AlertdialogService, GridconfigurationModule, MediaModule, SearchdetailModule } from 'common/views';
import { LeadmodalModule } from '../common/modal/leadmodal/leadmodal.module';
import { UpdateinventoryRoutingModule } from './updateinventory-routing.module';
import { UpdateinventoryComponent } from './updateinventory.component';

@NgModule({
  declarations: [UpdateinventoryComponent],
  imports: [
    CommonModule,
    UpdateinventoryRoutingModule,
    ButtonsModule,
    InputsModule,
    LayoutModule,
    DateInputsModule,
    DialogModule,
    GridModule,
    DropDownsModule,
    FormsModule,
    SharedDirectiveModule,
    GridconfigurationModule,
    SearchdetailModule,
    PopupModule,
    LabelModule,
    MediaModule,
    LeadmodalModule
  ],
  providers: [
    CommonService,
    InventoryService,
    AlertdialogService,
    UtilityService,
    MasterConfigService,
    OrganizationService,
    GridPropertiesService,
    PricingService,
    MeasureGradeService,
    StoneProposalService
  ],
})
export class UpdateInventoryModule { }
