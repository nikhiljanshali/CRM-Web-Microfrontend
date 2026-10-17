import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountingInformationComponent } from './accountingInformation.component';

const routes: Routes = [
    {
        path: '',
        component: AccountingInformationComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AccountingInformationRoutingModule { }