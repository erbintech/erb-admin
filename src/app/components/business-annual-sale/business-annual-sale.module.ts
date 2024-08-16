import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessannualsaleComponent } from './business-annual-sale.component';
import { BusinessAnnualSaleRoutingModule } from './business-annual-sale-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    BusinessannualsaleComponent
  ],
  imports: [
    CommonModule,
    BusinessAnnualSaleRoutingModule,
    MaterialModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BusinessannualsaleModule { }
