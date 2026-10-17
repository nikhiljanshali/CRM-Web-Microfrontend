import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PriceanalysismodalComponent } from './priceanalysismodal.component';

const routes: Routes = [
  {
    path: '',
    component: PriceanalysismodalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PriceanalysismodalRoutingModule { }
