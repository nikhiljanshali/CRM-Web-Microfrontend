import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { AccountService, UtilityService } from 'common/services';
import { AppPreloadService } from 'common/services/common/apppreload.service';
import { AlertdialogService } from 'common/views';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    LoginRoutingModule,
    NotificationModule,
    NgxSpinnerModule
  ],
  providers: [
    AppPreloadService,
    AccountService,
    AlertdialogService,
    UtilityService
  ]
})
export class LoginModule { }