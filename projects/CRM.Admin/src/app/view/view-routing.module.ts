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
    { path: 'organization', loadChildren: () => import('./organization/organization.module').then(m => m.OrganizationModule), canActivate: [AuthGuard] },
    { path: 'configuration', loadChildren: () => import('./configuration/configuration.module').then(m => m.ConfigurationModule), canActivate: [AuthGuard] },
    { path: 'employee', loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule), canActivate: [AuthGuard] },
    { path: 'systemuser', loadChildren: () => import('./systemuser/systemuser.module').then(m => m.SystemuserModule), canActivate: [AuthGuard] },
    { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule), canActivate: [AuthGuard] },
    { path: 'updateinventory', loadChildren: () => import('./inventory/updateinventory/updateinventory.module').then(m => m.UpdateInventoryModule), canActivate: [AuthGuard] },
    { path: 'masterconfig', loadChildren: () => import('./masterconfig/masterconfig.module').then(m => m.MasterconfigModule), canActivate: [AuthGuard] },
    { path: 'logisticsmaster', loadChildren: () => import('./logisticsmaster/logisticsmaster.module').then(m => m.LogisticsmasterModule), canActivate: [AuthGuard] },
    { path: 'lab', loadChildren: () => import('./lab/lab.module').then(m => m.LabModule), canActivate: [AuthGuard] },
    { path: 'labservice', loadChildren: () => import('./labservice/labservice.module').then(m => m.LabserviceModule), canActivate: [AuthGuard] },
    { path: 'customer-verification', loadChildren: () => import('./verificationcustomer/verificationcustomer.module').then(m => m.VerificationCustomerModule), canActivate: [AuthGuard] },
    { path: 'rapprice', loadChildren: () => import('./rapprice/rapprice.module').then(m => m.RappriceModule), canActivate: [AuthGuard] }, 
    { path: 'notifications', loadChildren: () => import('../../../../../common/views/common/notifications/notifications.module').then(m => m.NotificationsModule), canActivate: [AuthGuard] },


  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewRoutingModule { }