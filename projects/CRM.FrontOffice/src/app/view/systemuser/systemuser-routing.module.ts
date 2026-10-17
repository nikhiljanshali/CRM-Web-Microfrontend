import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SystemusermasterComponent } from './systemusermaster/systemusermaster.component';
import { SystemuserdetailsComponent } from './systemuserdetails/systemuserdetails.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'search'
    },
    {   
        path: 'search',
        component: SystemusermasterComponent
    },
    {
        path: 'details/:id',
        component: SystemuserdetailsComponent
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SystemuserRoutingModule { }

