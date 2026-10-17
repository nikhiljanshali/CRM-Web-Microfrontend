import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { AuthGuard } from 'common/auth/auth.guard';
import { AuthInterceptor } from 'common/auth/auth.interceptor';
import { AuthenticationService } from 'common/auth/authentication.service';
import { SharedDirectiveModule } from 'common/directives';
import { UtilityService } from 'common/services';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NavigationService } from '../services';
import { LeadmodalModule } from './common/modal/leadmodal/leadmodal.module';
import { HeaderComponent, SideMenuComponent } from './shell';
import { ViewRoutingModule } from './view-routing.module';
import { ViewComponent } from './view.component';

@NgModule({
  declarations: [ViewComponent,
    HeaderComponent,
    SideMenuComponent],
  imports: [
    CommonModule,
    ViewRoutingModule,
    HttpClientModule,
    ButtonsModule,
    TooltipModule,
    DropDownsModule,
    LabelModule,
    InputsModule,
    NgxSpinnerModule,
    NotificationModule,
    SharedDirectiveModule,
    LeadmodalModule
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
    NavigationService
  ],
  exports: [
    ButtonsModule,
    DropDownsModule,
    LabelModule,
    InputsModule,
    LeadmodalModule
  ]
})
export class ViewModule { }
