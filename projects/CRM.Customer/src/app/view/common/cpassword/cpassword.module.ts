import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CpasswordComponent } from './cpassword.component';
import { CpasswordRoutingModule } from './cpassword-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CpasswordRoutingModule,
    ],
    providers: [],
    declarations: [CpasswordComponent]
})
export class CpasswordModule { }