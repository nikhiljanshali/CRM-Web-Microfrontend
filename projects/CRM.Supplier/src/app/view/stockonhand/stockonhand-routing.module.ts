import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockonhandComponent } from './stockonhand.component';

const routes: Routes = [
    {
        path: '',
        component: StockonhandComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class StockonhandRoutingModule { }