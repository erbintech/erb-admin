import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubdsaDetailComponent } from './subdsa-detail.component';
import { SubdsaDetailRoutingModule } from './subdsa-detail-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    SubdsaDetailComponent
  ],
  imports: [
    CommonModule,
    SubdsaDetailRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ]
})
export class SubdsaDetailModule { }
