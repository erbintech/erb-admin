import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from './alert.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
    ],
    providers: [],
    exports: [AlertComponent],
    declarations: [AlertComponent]
})
export class AlertModule { }