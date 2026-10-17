import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiamonddetailsRoutingModule } from './diamonddetails-routing.module';
import { DiamonddetailsComponent } from './diamonddetails.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [DiamonddetailsComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [],
  exports:[DiamonddetailsComponent]
})
export class DiamonddetailsModule { }
