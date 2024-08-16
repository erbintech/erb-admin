import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiftProductComponent } from './gift-product.component';
import { GiftProductRoutingModule } from './gift-product-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [
    GiftProductComponent
  ],
  imports: [
    CommonModule,
    GiftProductRoutingModule,
    MaterialModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ]
})
export class GiftProductModule { }
