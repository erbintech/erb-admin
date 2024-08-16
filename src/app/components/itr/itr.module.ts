import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItrComponent } from './itr.component';
import { ItrRoutingModule } from './itr-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    ItrComponent
  ],
  imports: [
    CommonModule,
    ItrRoutingModule,
    MaterialModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ItrModule { }
