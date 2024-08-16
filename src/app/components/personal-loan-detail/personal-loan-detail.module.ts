import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalLoanDetailComponent } from './personal-loan-detail.component';
import { PersonalLoanDetailRoutingModule } from './personal-loan-detail-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  declarations: [PersonalLoanDetailComponent],
  imports: [
    CommonModule,
    PersonalLoanDetailRoutingModule,
    FormsModule,
    NgbModule,
    MaterialModule,
    SharedModule,
    NgApexchartsModule,
    NgSelectModule
  ]
})
export class PersonalLoanDetailModule { }
