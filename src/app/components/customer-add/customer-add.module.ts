import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerAddComponent } from './customer-add.component';
import { CustomerAddRoutingModule } from './customer-add-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AlertModule } from 'src/app/common/alert/alert.mocule';



@NgModule({
  declarations: [
    CustomerAddComponent
  ],
  imports: [
    CommonModule,
    CustomerAddRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    AlertModule
  ]
})
export class CustomerAddModule { }
