import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForgotpassComponent } from './forgotpass.component';
import { ForgotpassRoutingModule } from './forgotpass-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,        
        ForgotpassRoutingModule,
    ],
    providers: [],
    declarations: [ForgotpassComponent]
})
export class ForgotpassModule { }