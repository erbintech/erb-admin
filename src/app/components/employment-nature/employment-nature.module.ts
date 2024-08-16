import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmploymentNatureComponent } from './employment-nature.component';
import { EmploymentNatureRoutingModule } from './employment-nature-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    EmploymentNatureComponent
  ],
  imports: [
    CommonModule,
    EmploymentNatureRoutingModule,
    MaterialModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class EmploymentNatureModule { }
