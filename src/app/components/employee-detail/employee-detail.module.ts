import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeDetailComponent } from './employee-detail.component';
import { EmployeeDetailRoutingModule } from './employee-detail-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    EmployeeDetailComponent
  ],
  imports: [
    CommonModule,
    EmployeeDetailRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ]
})
export class EmployeeDetailModule { }
