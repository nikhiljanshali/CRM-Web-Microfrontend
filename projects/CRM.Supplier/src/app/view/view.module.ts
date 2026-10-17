import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { AccountService, UtilityService } from 'common/services';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HeaderComponent, SideMenuComponent } from './shell';
import { ViewRoutingModule } from './view-routing.module';
import { ViewComponent } from './view.component';
import { NavigationService } from '../services';
import { AuthGuard } from 'common/auth/auth.guard';
import { AuthenticationService } from 'common/auth/authentication.service';
import { AuthInterceptor } from 'common/auth/auth.interceptor';
import 'hammerjs';
import { SharedDirectiveModule } from 'common/directives';
import { ManualstoneissueModule } from './common/modal/manualstoneissue/manualstoneissue.module';

@NgModule({
  declarations: [ViewComponent,
    HeaderComponent,
    SideMenuComponent],
  imports: [
    CommonModule,
    ViewRoutingModule,
    HttpClientModule,
    ButtonsModule,
    DropDownsModule,
    LabelModule,
    InputsModule,
    NgxSpinnerModule,
    NotificationModule,
    SharedDirectiveModule,
    ManualstoneissueModule
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    UtilityService,
    AccountService,
    NavigationService,
  ],
  exports: [
    ButtonsModule,
    DropDownsModule,
    LabelModule,
    InputsModule,
    ManualstoneissueModule
  ]
})
export class ViewModule { }
