import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerificationCustomerComponent } from './verificationcustomer.component';

const routes: Routes = [{
  path: '',
  component: VerificationCustomerComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerificationCustomerRoutingModule { }
