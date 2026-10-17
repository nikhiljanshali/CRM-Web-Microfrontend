import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PendingChangesGuard } from 'common/auth/pendingchanges.guard';
import { RfidsetupComponent } from './rfidsetup/rfidsetup.component';
import { RfidstocktallyComponent } from './rfidstocktally/rfidstocktally.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'rfidsetup'
  },
  {
    path: 'rfidsetup',
    component: RfidsetupComponent,
  },
  {
    path: 'rfidstocktally',
    component: RfidstocktallyComponent,
    canDeactivate: [PendingChangesGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RfidRoutingModule { }
