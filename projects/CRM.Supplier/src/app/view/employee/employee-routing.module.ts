import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmployeeRoutingModule { }

