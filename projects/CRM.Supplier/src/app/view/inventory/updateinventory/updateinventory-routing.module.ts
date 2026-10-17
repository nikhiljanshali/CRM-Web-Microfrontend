import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpdateinventoryComponent } from './updateinventory.component';

const routes: Routes = [{
  path: '',
  component: UpdateinventoryComponent,
  pathMatch: 'full'
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateinventoryRoutingModule { }
