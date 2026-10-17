import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerMasterComponent } from './customermaster/customermaster.component';
import { CustomerdetailsComponent } from './customerdetails/customerdetails.component';

const routes: Routes = [
  {
      path: '',
      redirectTo: 'master'
  },
  {   
      path: 'master',
      component: CustomerMasterComponent
  },
  {
      path: 'details/:id',
      component: CustomerdetailsComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
