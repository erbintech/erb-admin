import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order.component';
import { OrderRoutingModule } from './order-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [
    OrderComponent
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    MaterialModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ]
})
export class OrderModule { }
