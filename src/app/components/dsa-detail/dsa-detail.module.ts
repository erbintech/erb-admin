import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsaDetailComponent } from './dsa-detail.component';
import { DsaDetailRoutingModule } from './dsa-detail-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    DsaDetailComponent
  ],
  imports: [
    CommonModule,
    DsaDetailRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ]
})
export class DsaDetailModule { }
