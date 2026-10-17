import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CpasswordComponent } from './cpassword.component';

const routes: Routes = [
    {
        path: '',
        component: CpasswordComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CpasswordRoutingModule {}