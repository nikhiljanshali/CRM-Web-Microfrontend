import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'shared/auth';
import { ViewComponent } from './view.component';

const routes: Routes = [{
  path: '',
  component: ViewComponent,
  children: [
    { path: '', redirectTo: 'dashboard' },
    { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard] },
    { path: 'systemuser', loadChildren: () => import('./systemuser/systemuser.module').then(m => m.SystemuserModule), canActivate: [AuthGuard] },
    { path: 'supplier', loadChildren: () => import('./supplier/supplier.module').then(m => m.SupplierModule), canActivate: [AuthGuard] },
    { path: 'customerverification', loadChildren: () => import('./customerverification/customerverification.module').then(m => m.CustomerverificationModule), canActivate: [AuthGuard] },
    { path: 'masterconfig', loadChildren: () => import('./masterconfig/masterconfig.module').then(m => m.MasterconfigModule), canActivate: [AuthGuard] },
    { path: 'pricingconfig', loadChildren: () => import('./pricingconfig/pricingconfig.module').then(m => m.PricingConfigModule), canActivate: [AuthGuard] },
    { path: 'rapupload', loadChildren: () => import('./rapprice/rapprice.module').then(m => m.RappriceModule), canActivate: [AuthGuard] },
    { path: 'specialstone', loadChildren: () => import('./specialstone/specialstone.module').then(m => m.SpecialStoneModule), canActivate: [AuthGuard] },
    { path: 'pendingpricing', loadChildren: () => import('./pendingpricing/pendingpricing.module').then(m => m.PendingPricingModule), canActivate: [AuthGuard] },
    { path: 'requestprice', loadChildren: () => import('./requestprice/requestprice.module').then(m => m.RequestPriceModule), canActivate: [AuthGuard] },
    { path: 'inventoryprice', loadChildren: () => import('./Inventoryprice/inventoryprice.module').then(m => m.InvetoryPriceModule), canActivate: [AuthGuard] },
    { path: 'inventory', loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule), canActivate: [AuthGuard] },
    { path: 'configuration', loadChildren: () => import('./configuration/configuration.module').then(m => m.ConfigurationModule), canActivate: [AuthGuard] },
    { path: 'schememaster', loadChildren: () => import('./common/schememaster/schememaster.module').then(m => m.SchememasterModule), canActivate: [AuthGuard] },
    { path: 'broker', loadChildren: () => import('./broker/broker.module').then(m => m.BrokerModule), canActivate: [AuthGuard] },
    { path: 'customer', loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule), canActivate: [AuthGuard] },
    { path: 'cart', loadChildren: () => import('./cart/cart.module').then(m => m.CartModule) },
    { path: 'lead', loadChildren: () => import('./lead/lead.module').then(m => m.LeadModule), canActivate: [AuthGuard] },
    { path: 'businessconfig', loadChildren: () => import('./businessconfig/businessconfig.module').then(m => m.BusinessconfigModule), canActivate: [AuthGuard] },
    { path: 'watchlist', loadChildren: () => import('./watchlist/watchlist.module').then(m => m.WatchlistModule), canActivate: [AuthGuard] },
    { path: 'suggestionlist', loadChildren: () => import('./suggestionlist/suggestionlist.module').then(m => m.SuggestionlistModule) },
    { path: 'geotracking', loadChildren: () => import('./geotracking/geotracking.module').then(m => m.GeotrackingModule) },
  ]
}, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewRoutingModule { }