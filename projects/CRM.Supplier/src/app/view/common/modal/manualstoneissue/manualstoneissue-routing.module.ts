import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManualstoneissueComponent } from './manualstoneissue.component';

const routes: Routes = [
  {
    path: '',
    component: ManualstoneissueComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManualstoneissueRoutingModule { }
