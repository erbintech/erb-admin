import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoApplicantRelationComponent } from './co-applicant-relation.component';
import { CoApplicantRelationRoutingModule } from './co-applicant-relation-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    CoApplicantRelationComponent
  ],
  imports: [
    CommonModule,
    CoApplicantRelationRoutingModule,
    MaterialModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class CoApplicantRelationModule { }
