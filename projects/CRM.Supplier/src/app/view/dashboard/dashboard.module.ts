import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module'
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';

@NgModule({
    imports: [
        CommonModule,   
        FormsModule,
        ButtonsModule,
        DashboardRoutingModule,
        DialogModule
    ],
    providers: [],
    declarations: [DashboardComponent]
})
export class DashboardModule { }