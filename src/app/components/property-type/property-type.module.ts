import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyTypeComponent } from './property-type.component';
import { PropertyTypeRoutingModule } from './property-type-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    PropertyTypeComponent
  ],
  imports: [
    CommonModule,
    PropertyTypeRoutingModule,
    MaterialModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class PropertyTypeModule { }
