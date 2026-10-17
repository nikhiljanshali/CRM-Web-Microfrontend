import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { SharedDirectiveModule } from 'shared/directives';
import { DiamondDetailRoutingModule } from './diamonddetail-routing.module';
import { DiamondDetailComponent } from './diamonddetail.component';
import { CartService, CustomerService, CustomerInvSearchService, WatchlistService } from '../../../../services';
import { CommonService, UtilityService } from 'shared/services';
import { AlertdialogService } from 'shared/views';
import { OrdersummaryModule } from '../ordersummary/ordersummary.module';



@NgModule({
  declarations: [DiamondDetailComponent],
  imports: [
    CommonModule,
    DiamondDetailRoutingModule,
    SharedDirectiveModule,
    TooltipModule,
    ButtonsModule,
    OrdersummaryModule
  ],
  exports: [DiamondDetailComponent],
  providers: [
    CommonService,
    UtilityService,
    AlertdialogService,
    WatchlistService,
    CustomerService,
    CustomerInvSearchService,
    CartService
  ],
})
export class DiamondDetailModule { }
