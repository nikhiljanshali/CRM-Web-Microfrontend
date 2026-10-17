import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationdetailsComponent } from './organizationdetails/organizationdetails.component';
import { OrganizationconfigComponent } from './organizationconfig/organizationconfig.component';

const routes: Routes = [
    {
        path: '',
        component: OrganizationdetailsComponent
    },
    {
        path: 'configurations',
        component: OrganizationconfigComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class OrganizationRoutingModule { }