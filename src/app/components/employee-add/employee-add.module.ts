import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeAddComponent } from './employee-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmployeeAddRoutingModule } from './employee-add-routing.module';



@NgModule({
  declarations: [
    EmployeeAddComponent
  ],
  imports: [
    CommonModule,
    EmployeeAddRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ]
})
export class EmployeeAddModule { }
