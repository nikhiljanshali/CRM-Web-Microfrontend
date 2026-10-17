import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'common/auth/auth.guard';
import { ViewComponent } from './view.component';

const routes: Routes = [{
  path: '',
  component: ViewComponent,
  children: [
    { path: '', redirectTo: 'dashboard', data: { title: 'Dashboard' } },
    { path: 'dashboard', data: { title: 'Dashboard' }, loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard] },
    { path: 'marketsheet', data: { title: 'Marketsheet' }, loadChildren: () => import('./marketsheet/marketsheet.module').then(m => m.MarketsheetModule), canActivate: [AuthGuard] },
    { path: 'proposal', data: { title: 'Proposal' }, loadChildren: () => import('./proposal/proposal.module').then(m => m.ProposalModule) },
    { path: 'customerprofile', data: { title: 'CustomerProfile' }, loadChildren: () => import('./customerprofile/customerprofile.module').then(m => m.CustomerprofileModule), canActivate: [AuthGuard] },
    { path: 'myorder', data: { title: 'My Order' }, loadChildren: () => import('./myorder/myorder.module').then(m => m.MyorderModule), canActivate: [AuthGuard] },
    { path: 'mycart', data: { title: 'My Cart' }, loadChildren: () => import('./mycart/mycart.module').then(m => m.MycartModule), canActivate: [AuthGuard] },
    { path: 'watchlist', data: { title: 'Watchlist' }, loadChildren: () => import('./watchlist/watchlist.module').then(m => m.WatchlistModule), canActivate: [AuthGuard] },
    { path: 'searchresult', data: { title: 'Search Result' }, loadChildren: () => import('./searchresult/searchresult.module').then(m => m.SearchresultModule), canActivate: [AuthGuard] },
    { path: 'myappointment', data: { title: 'My Appointment' }, loadChildren: () => import('./myappointment/myappointment.module').then(m => m.MyappointmentModule), canActivate: [AuthGuard] }
  ]
},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewRoutingModule { }
