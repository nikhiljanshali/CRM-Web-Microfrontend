import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AlertdialogComponent } from './alertdialog.component';
import { AlertdialogService } from './alertdialog.service';
@NgModule({
    entryComponents: [AlertdialogComponent],
    declarations: [
        AlertdialogComponent,
    ],
    imports: [
        BrowserModule
    ],
    exports: [
        AlertdialogComponent,
    ],
    providers: [
        AlertdialogService
    ],
})
export class AlertdialogModule { }