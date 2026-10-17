import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'common/auth/auth.guard';
import { ViewComponent } from './view.component';

const routes: Routes = [{
  path: '',
  component: ViewComponent,
  children: [
    { path: '', redirectTo: 'dashboard' },
    { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard] },
    { path: 'marketsheet', loadChildren: () => import('./marketsheet/marketsheet.module').then(m => m.MarketsheetModule), canActivate: [AuthGuard] },
    { path: 'customer', loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule), canActivate: [AuthGuard] },
    { path: 'inventory', loadChildren: () => import('./updateinventory/updateinventory.module').then(m => m.UpdateInventoryModule), canActivate: [AuthGuard] },
    { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule), canActivate: [AuthGuard] },
    { path: 'lead', loadChildren: () => import('./lead/lead.module').then(m => m.LeadModule), canActivate: [AuthGuard] },
    { path: 'notifications', loadChildren: () => import('../../../../../common/views/common/notifications/notifications.module').then(m => m.NotificationsModule), canActivate: [AuthGuard] },

  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewRoutingModule { }