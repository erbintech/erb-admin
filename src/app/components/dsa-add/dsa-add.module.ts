import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsaAddComponent } from './dsa-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DsaAddRoutingModule } from './dsa-add-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [
    DsaAddComponent
  ],
  imports: [
    CommonModule,
    DsaAddRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ]
})
export class DsaAddModule { }
