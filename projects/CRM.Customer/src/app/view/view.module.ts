import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { AuthGuard } from 'common/auth/auth.guard';
import { AuthInterceptor } from 'common/auth/auth.interceptor';
import { AuthenticationService } from 'common/auth/authentication.service';
import { AppPreloadService } from 'common/services';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SuggestionService } from 'shared/services';
import { SuggestionModule } from './common/modal/suggestion/suggestion.module';
import { FooterComponent, HeaderComponent, SideMenuComponent } from './shell';
import { ViewRoutingModule } from './view-routing.module';
import { ViewComponent } from './view.component';

@NgModule({
  declarations: [
    ViewComponent,
    HeaderComponent,
    SideMenuComponent,
    FooterComponent,
  ],
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
    SuggestionModule,
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AppPreloadService,
    SuggestionService,
  ],
})
export class ViewModule { }
