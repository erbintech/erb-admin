import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanAgainstCollteralComponent } from './loan-against-collteral.component';
import { LoanAgainstCollteralRoutingModule } from './loan-against-collteral-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    LoanAgainstCollteralComponent
  ],
  imports: [
    CommonModule,
    LoanAgainstCollteralRoutingModule,
    MaterialModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class LoanAgainstCollteralModule { }
