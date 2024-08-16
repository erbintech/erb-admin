import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmploymentServiceTypeComponent } from './employment-service-type.component';
import { EmploymentServiceTypeRoutingModule } from './employment-service-type-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    EmploymentServiceTypeComponent
  ],
  imports: [
    CommonModule,
    EmploymentServiceTypeRoutingModule,
    MaterialModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class EmploymentServiceTypeModule { }
