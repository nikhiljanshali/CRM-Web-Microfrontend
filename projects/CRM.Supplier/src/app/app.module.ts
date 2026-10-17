import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { AppPreloadService, NotificationService } from 'common/services';
import { AlertdialogModule } from 'common/views';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from 'common/auth/auth.guard';
import { AuthenticationService } from 'common/auth/authentication.service';
import { AuthInterceptor } from 'common/auth/auth.interceptor';
import { WebsocketService } from 'common/services/websocket/websocket.service';



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
  bootstrap: [AppComponent],
})
export class AppModule { }
