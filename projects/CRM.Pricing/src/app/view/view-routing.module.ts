import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewComponent } from './view.component';
import { AuthGuard } from 'common/auth/auth.guard';

const routes: Routes = [{
  path: '',
  component: ViewComponent,
  children: [
    { path: '', redirectTo: 'dashboard' },
    { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard] },
    { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule), canActivate: [AuthGuard] },
    { path: 'pricerequest', loadChildren: () => import('./pricerequest/pricerequest.module').then(m => m.PricerequestModule), canActivate: [AuthGuard] },
    { path: 'requestprice', loadChildren: () => import('./requestprice/requestprice.module').then(m => m.RequestPriceModule), canActivate: [AuthGuard] },
    { path: 'inventoryprice', loadChildren: () => import('./Inventoryprice/inventoryprice.module').then(m => m.InvetoryPriceModule), canActivate: [AuthGuard] },
    { path: 'specialstone', loadChildren: () => import('./specialstone/specialstone.module').then(m => m.SpecialStoneModule), canActivate: [AuthGuard] },
    { path: 'pricingconfig', loadChildren: () => import('./pricingconfig/pricingconfig.module').then(m => m.PricingConfigModule), canActivate: [AuthGuard] },
    { path: 'notifications', loadChildren: () => import('../../../../../common/views/common/notifications/notifications.module').then(m => m.NotificationsModule), canActivate: [AuthGuard] },
    { path: 'pendingpricing', loadChildren: () => import('./pendingpricing/pendingpricing.module').then(m => m.PendingPricingModule), canActivate: [AuthGuard] },

  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewRoutingModule { }