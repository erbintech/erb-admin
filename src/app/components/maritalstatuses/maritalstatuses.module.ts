import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaritalstatusesComponent } from './maritalstatuses.component';
import { MaritalstatusesRoutingModule } from './maritalstatuses-routing.module';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    MaritalstatusesComponent
  ],
  imports: [
    CommonModule,
    MaritalstatusesRoutingModule,
    MaterialModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class MaritalstatusesModule { }
