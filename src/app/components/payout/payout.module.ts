import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PayoutRoutingModule } from './payout-routing.module';
import { PayoutComponent } from './payout.component';
@NgModule({
    declarations: [PayoutComponent],
    imports: [
        CommonModule,
        PayoutRoutingModule,
        FormsModule,
        NgbModule,
        MaterialModule,
        SharedModule,
        NgSelectModule,
        AngularEditorModule,
        ReactiveFormsModule,
        NgApexchartsModule
    ]
})
export class PayoutModule { }
