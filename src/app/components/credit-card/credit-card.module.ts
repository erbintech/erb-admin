import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditCardComponent } from './credit-card.component';
import { CreditCardRoutingModule } from './credit-card-routing.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    CreditCardComponent
  ],
  imports: [
    CommonModule,
    CreditCardRoutingModule,
    FormsModule,
    NgbModule,
    MaterialModule,
    SharedModule,
    NgSelectModule
  ]
})
export class CreditCardModule { }
