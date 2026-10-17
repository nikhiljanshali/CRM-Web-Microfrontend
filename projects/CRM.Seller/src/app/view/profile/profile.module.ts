import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { ButtonsModule,ButtonGroupModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { CommonService, EmployeeService, UtilityService } from 'common/services';
import { SharedDirectiveModule } from 'common/directives';
import { TooltipModule } from '@progress/kendo-angular-tooltip';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    InputsModule,
    LayoutModule,
    ButtonsModule,
    DialogModule,
    ButtonGroupModule,
    FormsModule,
    DropDownsModule,
    DateInputsModule,
    TooltipModule,
    SharedDirectiveModule
  ],
  providers: [
    EmployeeService,
    UtilityService,
    CommonService
  ]
})
export class ProfileModule { }
