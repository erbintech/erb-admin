import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanstatusComponent } from './loan-status.component';
import { LoanStatusRoutingModule } from './loan-status-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    LoanstatusComponent
  ],
  imports: [
    CommonModule,
    LoanStatusRoutingModule,
    MaterialModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class LoanstatusModule { }
