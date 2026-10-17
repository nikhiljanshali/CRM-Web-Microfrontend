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
    { path: 'party', loadChildren: () => import('./party/party.module').then(m => m.PartyModule), canActivate: [AuthGuard] },
    { path: 'broker', loadChildren: () => import('./broker/broker.module').then(m => m.BrokerModule), canActivate: [AuthGuard] },
    { path: 'invoiceservice', loadChildren: () => import('./invoiveservice/invoiveservice.module').then(m => m.InvoiveserviceModule), canActivate: [AuthGuard] },
    { path: 'employee', loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule), canActivate: [AuthGuard] },
    { path: 'inventoryupload', loadChildren: () => import('./inventory/inventoryupload/inventoryupload.module').then(m => m.InventoryUploadModule), canActivate: [AuthGuard] },
    { path: 'updateinventory', loadChildren: () => import('./inventory/updateinventory/updateinventory.module').then(m => m.UpdateInventoryModule), canActivate: [AuthGuard] },
    { path: 'grading', loadChildren: () => import('./grading/grading.module').then(m => m.GradingModule), canActivate: [AuthGuard] },
    { path: 'stockonhand', loadChildren: () => import('./stockonhand/stockonhand.module').then(m => m.StockonhandModule), canActivate: [AuthGuard] },
    { path: 'stonemedia', loadChildren: () => import('./stonemedia/stonemedia.module').then(m => m.StonemediaModule), canActivate: [AuthGuard] },
    { path: 'labreceive', loadChildren: () => import('./common/modal/labreceive/labreceive.module').then(m => m.LabreceiveModule), canActivate: [AuthGuard] },
    { path: 'labissuemaster', loadChildren: () => import('./labissuemaster/labissuemaster.module').then(m => m.LabssuemasterModule), canActivate: [AuthGuard] },
    { path: 'consignmentinvoice', loadChildren: () => import('./common/modal/consignmentinvoice/consignmentinvoice.module').then(m => m.ConsignmentinvoiceModule), canActivate: [AuthGuard] },
    { path: 'labreconsiliation', loadChildren: () => import('./labreconsiliation/labreconsiliation.module').then(m => m.LabreconsiliationModule), canActivate: [AuthGuard] },
    { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule), canActivate: [AuthGuard] },
    { path: 'inclusionupload', loadChildren: () => import('./inclusionupload/inclusionupload.module').then(m => m.InclusionuploadModule), canActivate: [AuthGuard] },
    { path: 'rfid', loadChildren: () => import('./rfid/rfid.module').then(m => m.RfidModule), canActivate: [AuthGuard] },
    { path: 'lead', loadChildren: () => import('./lead/lead.module').then(m => m.LeadModule), canActivate: [AuthGuard] },
    { path: 'accountingInformation', loadChildren: () => import('./accountingInformation/accountingInformation.module').then(m => m.AccountingInformationModule), canActivate: [AuthGuard] },
    { path: 'order', loadChildren: () => import('./order/order.module').then(m => m.OrderModule), canActivate: [AuthGuard] },
    { path: 'invoice', loadChildren: () => import('./invoice/invoice.module').then(m => m.InvoiceModule), canActivate: [AuthGuard] },
    { path: 'customer', loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule), canActivate: [AuthGuard] },
    { path: 'accountconfiguration', loadChildren: () => import('./configuration/accountconfiguration/accountconfiguration.module').then(m => m.AccountconfigurationModule), canActivate: [AuthGuard] },
    { path: 'labexpense', loadChildren: () => import('./labexpense/labexpense.module').then(m => m.LabexpenseModule), canActivate: [AuthGuard] },
    { path: 'memomaster', loadChildren: () => import('./memomaster/memomaster.module').then(m => m.MemomasterModule), canActivate: [AuthGuard] },
    { path: 'notifications', loadChildren: () => import('../../../../../common/views/common/notifications/notifications.module').then(m => m.NotificationsModule), canActivate: [AuthGuard] },



  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewRoutingModule { }