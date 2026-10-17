import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { AuthGuard } from 'common/auth/auth.guard';
import { AuthInterceptor } from 'common/auth/auth.interceptor';
import { AuthenticationService } from 'common/auth/authentication.service';
import { AppPreloadService, NotificationService, WebsocketService } from 'common/services';
import { AlertdialogModule } from 'common/views';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DialogModule,
    BrowserAnimationsModule,
    TooltipModule,
    AlertdialogModule
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
    NotificationService,
    WebsocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
