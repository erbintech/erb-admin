import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndustryTypeComponent } from './industry-type.component';
import { IndustryTypeRoutingModule } from './industry-type-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AlertModule } from 'src/app/common/alert/alert.mocule';



@NgModule({
  declarations: [
      IndustryTypeComponent,
  ],
  imports: [
    CommonModule,
    IndustryTypeRoutingModule,
    MaterialModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    AlertModule
  ]
})
export class IndustrytypeModule { }
