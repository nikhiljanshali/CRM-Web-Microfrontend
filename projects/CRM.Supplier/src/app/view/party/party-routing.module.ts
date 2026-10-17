import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartyMasterComponent } from './partymaster/partymaster.component';
import { PartydetailsComponent } from './partydetails/partydetails.component';

const routes: Routes = [
    {
        path: '',
        component: PartyMasterComponent
    },
    {
        path: 'details/:id',
        component: PartydetailsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PartyRoutingModule {}

