import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResidenceTypeComponent } from './residence-type.component';
import { ResidenceTypeRoutingModule } from './residence-type-routing.module';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    ResidenceTypeComponent
  ],
  imports: [
    CommonModule,
    ResidenceTypeRoutingModule,
    MaterialModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ResidenceTypeModule { }
