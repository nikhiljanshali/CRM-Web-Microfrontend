import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiveserviceComponent } from './invoiveservice.component';

const routes: Routes = [
    {
        path: '',
        component: InvoiveserviceComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InvoiveserviceRoutingModule { }

