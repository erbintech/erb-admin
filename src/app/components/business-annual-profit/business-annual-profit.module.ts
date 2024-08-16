import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessAnnualProfitComponent } from './business-annual-profit.component';
import { BusinessAnnualProfitRoutingModule } from './business-annual-profit-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    BusinessAnnualProfitComponent
  ],
  imports: [
    CommonModule,
    BusinessAnnualProfitRoutingModule,
    MaterialModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BusinessAnnualProfitModule { }
