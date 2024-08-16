import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminGetCommissionComponent } from './admin-get-commission.component';
import { AdminGetCommissionRoutingModule } from './admin-get-commission-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    AdminGetCommissionComponent
  ],
  imports: [
    CommonModule,
    AdminGetCommissionRoutingModule,
    MaterialModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class AdminGetCommissionModule { }
