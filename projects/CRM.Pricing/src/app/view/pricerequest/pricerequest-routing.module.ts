import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PricerequestComponent } from './pricerequest.component';

const routes: Routes = [
  {
    path:'',
    component: PricerequestComponent

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricerequestRoutingModule { }
