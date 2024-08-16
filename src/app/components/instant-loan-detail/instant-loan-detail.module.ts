import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { InstantLonDetailRoutingModule } from './instant-loan-detail-routing.module';
import { InstantLoanDetailComponent } from './instant-loan-detail.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
    declarations: [InstantLoanDetailComponent],
    imports: [
        CommonModule,
        InstantLonDetailRoutingModule,
        FormsModule,
        NgbModule,
        MaterialModule,
        SharedModule,
        NgApexchartsModule,
        NgSelectModule
    ]
})
export class InstantLoanDetailModule { }
