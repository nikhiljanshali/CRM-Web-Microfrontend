import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DragulaModule } from 'ng2-dragula';
import { SharedDirectiveModule } from 'shared/directives';
import { AppPreloadService, ConfigService, UtilityService } from 'shared/services';
import { GridconfigurationRoutingModule } from './gridconfiguration-routing.module';
import { GridconfigurationComponent } from './gridconfiguration.component';

@NgModule({
  declarations: [GridconfigurationComponent],
  imports: [
    CommonModule,
    FormsModule,
    LayoutModule,
    InputsModule,
    GridconfigurationRoutingModule,
    DragulaModule.forRoot(),
    SharedDirectiveModule
  ],
  exports: [GridconfigurationComponent],
  providers: [UtilityService,
    AppPreloadService,
    ConfigService,
  ]
})
export class GridconfigurationModule { }