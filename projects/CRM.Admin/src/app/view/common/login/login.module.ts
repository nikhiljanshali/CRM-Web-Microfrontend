import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { AppPreloadService } from 'common/services/common/apppreload.service';
import { AccountService, UtilityService } from 'common/services';
import { AlertdialogService } from 'common/views';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { NgxSpinnerModule } from 'ngx-spinner';

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
