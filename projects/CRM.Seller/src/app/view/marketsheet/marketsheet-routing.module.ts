import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarketsheetComponent } from './marketsheet.component';

const routes: Routes = [
  {
    path:'',
    component:MarketsheetComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketsheetRoutingModule { }
