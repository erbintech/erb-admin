import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalLoanComponent } from './personal-loan.component';
import { PersonalLoanRoutingModule } from './personal-loan-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgApexchartsModule } from 'ng-apexcharts';
@NgModule({
  declarations: [PersonalLoanComponent],
  imports: [
    CommonModule,
    PersonalLoanRoutingModule,
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
export class PersonalLoanModule { }
