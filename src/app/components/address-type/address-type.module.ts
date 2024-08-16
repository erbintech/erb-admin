import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressTypeComponent } from './address-type.component';
import { AddressTypeRoutingModule } from './address-type-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    AddressTypeComponent
  ],
  imports: [
    CommonModule,
    AddressTypeRoutingModule,
    MaterialModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AddressTypeModule { }
