import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { HomeLoanDetailComponent } from './home-loan-detail.component';
import { HomeLoanDetailRoutingModule } from './home-loan-detail-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
    declarations: [HomeLoanDetailComponent],
    imports: [
        CommonModule,
        HomeLoanDetailRoutingModule,
        FormsModule,
        NgbModule,
        MaterialModule,
        SharedModule,
        NgApexchartsModule,
        NgSelectModule
    ]
})
export class HomeLoanDetailModule { }
