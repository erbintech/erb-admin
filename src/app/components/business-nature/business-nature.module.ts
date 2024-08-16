import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessNatureComponent } from './business-nature.component';
import { BusinessNatureRoutingModule } from './business-nature-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    BusinessNatureComponent
  ],
  imports: [
    CommonModule,
    BusinessNatureRoutingModule,
    MaterialModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BusinessNatureModule { }
