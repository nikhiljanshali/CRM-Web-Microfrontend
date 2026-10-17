import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { EmployeeService } from 'common/services';
import { AlertdialogService } from 'common/views';
import { SharedDirectiveModule } from 'common/directives';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    InputsModule,
    LayoutModule,
    ButtonsModule,
    DialogModule,
    SharedDirectiveModule
  ],
  providers: [
    EmployeeService,
    AlertdialogService
  ]
})
export class ProfileModule { }