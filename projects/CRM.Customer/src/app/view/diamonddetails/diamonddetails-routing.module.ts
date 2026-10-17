import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiamonddetailsComponent } from './diamonddetails.component';

const routes: Routes = [
  {
    path: '',
    component: DiamonddetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiamonddetailsRoutingModule { }
