import { NgModule } from '@angular/core';
import { DateAgoPipe } from './dateago.pipe';
import { DragModalDirective } from './dragmodaldirective';
import { MemoFilterPipe } from './memofilter.pipe';
import { NumberFilterPipe } from './numberfilter.pipe';
import { Ng2TriStateCheckboxComponent } from './tristate-checkbox.component';
import { TypeFilterPipe } from './typefilter.pipe';

@NgModule({
    declarations: [NumberFilterPipe,
        Ng2TriStateCheckboxComponent,
        TypeFilterPipe,
        DragModalDirective,
        DateAgoPipe,
        MemoFilterPipe],
    exports: [NumberFilterPipe,
        Ng2TriStateCheckboxComponent,
        TypeFilterPipe,
        DragModalDirective,
        DateAgoPipe,
        MemoFilterPipe]

})
export class SharedDirectiveModule { }