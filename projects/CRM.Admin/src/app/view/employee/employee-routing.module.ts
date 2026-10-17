import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedDirectiveModule } from 'common/directives';
import { EmployeedetailsComponent } from './employeedetails/employeedetails.component';
import { EmployeemasterComponent } from './employeemaster/employeemaster.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'search'
    },
    {
        path: 'search',
        component: EmployeemasterComponent
    },
    {
        path: 'details/:id',
        component: EmployeedetailsComponent
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes),
        SharedDirectiveModule],
    exports: [RouterModule]
})
export class EmployeeRoutingModule { }

