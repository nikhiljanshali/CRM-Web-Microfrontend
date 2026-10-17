import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./view/view.module').then(m => m.ViewModule) },
  { path: 'register', data: { title: 'Register' }, loadChildren: () => import('./view/common/register/register.module').then(m => m.RegisterModule) },
  { path: 'login', data: { title: 'Login' }, loadChildren: () => import('./view/common/login/login.module').then(m => m.LoginModule) },
  { path: 'forgotpass', data: { title: 'Forget Password' }, loadChildren: () => import('./view/common/forgotpass/forgotpass.module').then(m => m.ForgotpassModule) },
  { path: 'cpassword', data: { title: 'Confirm Password' }, loadChildren: () => import('./view/common/cpassword/cpassword.module').then(m => m.CpasswordModule) },
  { path: 'linkexpire', data: { title: 'Link Expire' }, loadChildren: () => import('../../../../common/views/common/link-expire/link-expire.module').then(m => m.LinkExpireModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
