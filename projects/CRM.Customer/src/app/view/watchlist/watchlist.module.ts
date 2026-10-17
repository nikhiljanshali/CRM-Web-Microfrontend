import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WatchlistRoutingModule } from './watchlist-routing.module';
import { WatchlistComponent } from './watchlist.component';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { FormsModule } from '@angular/forms';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { CartService, CustomerService, MasterConfigService, WatchlistService } from '../../services';
import { AlertdialogService } from 'shared/views';
import { DiamondDetailModule } from '../common/modal/diamonddetail/diamonddetail.module';
import { AppPreloadService, UtilityService } from 'shared/services';

@NgModule({
  declarations: [WatchlistComponent],
  imports: [
    CommonModule,
    WatchlistRoutingModule,
    ButtonModule,
    TooltipModule,
    DropDownsModule,
    InputsModule,
    FormsModule,
    DateInputsModule,
    DiamondDetailModule
  ],
  providers:[
    WatchlistService,
    AlertdialogService,
    CustomerService,
    CartService,
    UtilityService,
    AppPreloadService,
    MasterConfigService
  ]
})
export class WatchlistModule { }
