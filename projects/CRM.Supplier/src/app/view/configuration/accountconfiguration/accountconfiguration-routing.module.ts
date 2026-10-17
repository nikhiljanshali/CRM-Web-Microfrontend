import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountconfigurationComponent } from './accountconfiguration.component';

const routes: Routes = [
  {
    path: '',
    component: AccountconfigurationComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountconfigurationRoutingModule { }
